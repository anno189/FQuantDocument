# 核心模块解析：BBlock.py (板块与主线分析)

`BBlock.py` 是 FQuant 后端处理市场板块、行业概念以及识别市场"主线"的核心工具模块。它通过对通达信原始数据的清洗、归纳和缓存，为策略层提供结构化的板块背景信息，并进化为一套包含"实时预期"和"盘后确认"的双模型算法系统。

## 0. 板块数据来源与分类体系

### 数据来源

BBlock 模块使用的板块数据主要来自三个来源：

1. **通达信板块数据**：从通达信服务器或本地文件获取，包括概念、指数、地区、风格、行业等5种类型
2. **通达信主题概念**：从通达信网站获取，具有时间属性，每天盘后更新
3. **通达信研究行业**：从通达信服务器获取，提供更详细的研究级行业分类

### 分类体系

系统建立了多层次的板块分类体系：

1. **概念板块**：由通达信板块数据和主题概念组成，一个股票可以有多个概念
2. **行业板块**：由通达信行业数据组成，一个股票只能有一个行业
3. **研究行业**：由通达信研究行业数据组成，一个股票只能有一个研究行业

### 关联关系

- **概念与主题概念**：概念是主题概念的子集，概念成分股最高为400，概念数量小于主题概念数量
- **行业与研究行业**：两者都是股票的唯一分类，但分类粒度和标准不同
- **一级概念映射**：所有板块和行业都映射到一级概念（如新能源、算力芯片、智能设备等），用于宏观板块分析

### 数据更新机制

- **更新时间**：每天盘后16点以后开始更新数据
- **缓存策略**：每天盘前将实时运算用到的数据更新到 Redis 中
- **维护方式**：通达信每天以追加或覆盖的方式维护概念数据

## 1. 核心职责

- **数据清洗**：从通达信数千个板块/风格标签中剔除无效噪音。
- **结构化映射**：建立个股、板块与一级概念（`n1name`）的对应关系。
- **高性能缓存**：将处理后的 DataFrame 存储至 Redis，供实时计算使用。
- **主线识别**：通过双模型算法，从不同时间维度（竞价、盘后）识别市场的热点主线与支线。

---

## 2. 核心算法思想：双模型与市值加权

为了更精确地捕捉市场动态并应对“日内背离”（即开盘预期与收盘结果不一致），系统采用了两个独立的主线识别模型：

1.  **实时/竞价主线模型 (`GetMainBlockRealTime`)**:
    - **目标**: 捕捉资金在集合竞价阶段的"进攻意图"。
    - **核心指标**: `oamo` (集合竞价金额)、`orate` (集合竞价涨幅) 和 `lb` (量比)。
    - **评分公式**: 组合方案（量比过滤 + 标准化评分），使用 Z-score 标准化和负涨幅惩罚，综合考量资金强度、价格表现、量比质量和规模效应。
    - **解决问题**: 识别当天最有可能成为热点的方向，特别关注新概念板块的资金强度，同时过滤掉量比过低和涨幅过差的板块。

2.  **盘后确认模型 (`GetMainBlockPostMarket`)**:
    - **目标**: 确认全天交易后形成的"市场共识"和板块的"统治力"。
    - **核心指标**: `amount` (全天成交额)、`RATE` (全天涨幅) 和涨停相关指标 (`hprice`, `hcount`, `hstop`, `start_` 等)。
    - **评分公式**: 组合方案（板块涨幅过滤 + 标准化评分），使用 Z-score 标准化和负涨幅惩罚，综合考量资金强度、价格表现、涨停质量和规模效应。
    - **解决问题**: 验证开盘时的预期是否兑现，或发现新的、由盘中交易形成的主线，特别关注涨停质量高的板块，同时过滤掉涨幅过差的板块。

### 市值分层加权 (Capitalization Tiered Weighting)

两个模型均引入了**市值分层加权**的核心逻辑，以解决不同体量股票对板块影响力的差异问题。该逻辑基于 `getmarketshizhiquantile` 函数分板块（主板、创业板等）计算的市值分位点，对个股进行动态加权：

- **超大盘股 (Top 10%)**: 权重保持中性 (x1.0)，平衡成交量和涨幅的贡献。
- **大盘股 (Top 10-30%)**: 权重上调 (x1.1)，因为它们也具有一定的市场影响力。
- **中盘股 (Top 30-60%)**: 权重保持中性 (x1.0)。
- **小盘股 (Top 60-80%)**: 权重下调 (x0.9)，以降低噪音。
- **微盘股 (Bottom 20%)**: 权重显著下调 (x0.5)，以降低纯粹因盘小而产生的高波动性噪音。
- **实时模型一字板涨停股**: 权重显著上调 (x1.5)，因为它们代表了最强的市场情绪。
- **盘后模型涨停质量加权**:
  - **连板加成**: 3板及以上 (x1.5)，2板 (x1.3)，1板 (x1.1)
  - **一字板加成**: (x1.2)
  - **涨停时间加成**: 开盘30分钟内 (x1.3)，1小时内 (x1.2)，午盘前 (x1.1)
  - **N1天N2板加成**: 5板及以上 (x1.8)，4板 (x1.6)，3板 (x1.4)，2板 (x1.2)
  - **炸板惩罚**: (x0.8)

这一设计的理论依据来自 `analyze_market_shizhi_quantile` 的诊断，它证明了不同市场板块（如主板与创业板）的市值标准存在显著差异，因此必须进行区分处理。

---

## 3. 核心函数解析

### 3.1 `GetMainBlockRealTime` (实时/竞价主线模型)

- **功能**: 识别集合竞价阶段的市场主线。
- **输入**:
  - `stocklist` (包含 `code`, `oamo`, `orate`, `liutongshizhiZ`, `mtype`, `lb` 等字段的竞价个股列表)
  - `threshold_len` (板块下限阈值，默认 0.4)
  - `debug_` (是否输出调试信息，默认 False)
  - `lb_threshold` (量比阈值，默认 1.0)
  - `use_market_segments` (是否使用分板块市值标准，默认 True)
  - `n1name` (是否使用 n1name 过滤板块，默认 False)
  - `all_` (是否引入全部概念，默认 False)
  - `return_all_blocks` (是否返回全部板块数据，默认 False)
  - `sentiment_filter` (情绪过滤模式，默认 None)
    - `None`: 不做额外过滤
    - `'bullish'`: 只保留正涨幅（多头模式）
    - `'loose'`: 保留涨幅 > -3% 的股票（宽松模式，排除极端下跌）
- **算法步骤**:
  1.  **数据验证**: 验证输入数据是否包含必要的字段。
  2.  **情绪过滤**: 根据 `sentiment_filter` 参数进行股票级别的情绪过滤（在量比过滤之前）。
  3.  **量比过滤**: 过滤掉量比低于阈值的股票，提高股票质量。
  4.  **获取市值阈值**: 调用 `getmarketshizhiquantile` 获取市值分位点：
     - 当 `use_market_segments=True` 时，分别获取主板、中小板、创业板、科创板和北交所的市值分位点
     - 当 `use_market_segments=False` 时，使用全市场市值分位点
  5.  **数据合并**: 将输入的 `stocklist` 与 Redis 中的 `DataFrame_BlockList` 合并，为每个个股打上板块标签。
  6.  **过滤板块**: 
     - 当 `n1name=True` 时，过滤掉 `n1name` 为空的板块
     - 当 `n1name=False` 时，过滤掉 `type` 不在 ['gn', 'tdxhy', 'yjhy'] 中的板块（如风格板块等）
  7.  **计算动态权重 (`W_cap`)**: 调用 `_calculate_weight` 函数，应用“市值分层加权”逻辑，为每个个股计算其能量权重。
  8.  **量比加权**: 对量比进行 0.5-3.0 的范围限制，然后用于加权计算。
  9.  **计算加权能量 (`weighted_oamo`)**: `weighted_oamo = oamo * W_cap * W_lb`。
  10. **板块聚合**: 按 `blockname` 分组，聚合计算 `count` (个股数), `orate` (平均涨幅), `weighted_oamo` (加权竞价总额)。
  11. **板块评分**:
      - 改进的评分公式：使用 Z-score 标准化和负涨幅惩罚，综合考量资金强度、价格表现、量比质量和规模效应。
      - 计算总资金强度标准化：`total_weighted_oamo_z`
      - 总资金强度考虑：结合平均资金和总资金
      - 正涨幅时：`score = (fund_strength + 1) * (orate_z + 1)`，其中 `fund_strength = (avg_weighted_oamo_z + total_weighted_oamo_z) / 2`
      - 负涨幅时：`score = (fund_strength + 1) * max(0.1, orate_z + 1) * 0.1`
  12. **评分标准化**: 调用 `_standardize_score` 函数，使用 Z-score 标准化评分，降低不同交易日之间的差距。
  13. **过滤板块**: 
      - 过滤掉股票数量小于5的板块
      - 过滤掉 `total_weighted_oamo_z` 小于0的板块
  14. **动态阈值计算**: 调用 `_calculate_dynamic_threshold` 函数，使用 70% 分位数作为阈值，确保输出数量适中，最多保留15个板块。
- **输出**:
  - 按评分降序排列的板块 DataFrame，包含 `count`, `orate`, `weighted_oamo`, `avg_weighted_oamo`, `avg_weighted_oamo_z`, `total_weighted_oamo_z`, `orate_z`, `score`, `standardized_score`, `relative_score` 等字段。
  - 主线板块为排序靠前的板块，通常取前10个作为主线。

### 3.2 `GetMainBlockPostMarket` (盘后确认模型)

- **功能**: 确认收盘后的市场主线。
- **输入**:
  - `data` (包含市场数据的 DataFrame，需要包含 `code`, `amount`, `RATE`, `liutongshizhiZ`, `mtype`, `hprice`, `hcount`, `hstop`, `start_` 等字段)
  - `threshold_len` (板块下限阈值，默认 0.4)
  - `debug_` (是否输出调试信息，默认 False)
  - `lb_threshold` (量比阈值，默认 1.0)
  - `use_market_segments` (是否使用分板块市值标准，默认 True)
  - `n1name` (是否使用 n1name 过滤板块，默认 False)
  - `all_` (是否引入全部概念，默认 False)
  - `return_all_blocks` (是否返回全部板块数据，默认 False)
- **算法步骤**:
  1.  **数据验证**: 验证输入数据是否包含必要的字段。
  2.  **量比过滤**: 过滤掉量比低于阈值的股票（条件: lb > lb_threshold 或 HSL > 10），同时要求涨幅大于0。
  3.  **获取市值阈值**: 调用 `getmarketshizhiquantile` 获取市值分位点：
     - 当 `use_market_segments=True` 时，分别获取主板、中小板、创业板、科创板和北交所的市值分位点
     - 当 `use_market_segments=False` 时，使用全市场市值分位点
  4.  **数据合并**: 将输入的 `data` 与 Redis 中的 `DataFrame_BlockList` 合并，为每个个股打上板块标签。
  5.  **过滤板块**: 
     - 当 `n1name=True` 时，过滤掉 `n1name` 为空的板块
     - 当 `n1name=False` 时，过滤掉 `type` 不在 ['gn', 'tdxhy', 'yjhy'] 中的板块（如风格板块等）
  6.  **计算动态权重 (`W_cap`)**: 调用 `_calculate_weight` 函数，应用“市值分层加权”和“涨停质量加权”逻辑，为每个个股计算其能量权重。
  7.  **量比加权**: 对量比进行 0.5-3.0 的范围限制，然后用于加权计算。
  8.  **计算加权能量 (`weighted_amount`)**: `weighted_amount = amount * W_cap * W_lb`。
  9.  **板块聚合**: 按 `blockname` 分组，聚合计算 `count` (个股数), `RATE` (平均涨幅), `weighted_amount` (加权成交额)。
  10. **板块评分**:
     - 改进的评分公式：使用 Z-score 标准化和负涨幅惩罚，综合考量资金强度、价格表现和规模效应。
     - 计算总资金强度标准化：`total_weighted_amount_z`
     - 总资金强度考虑：结合平均资金和总资金
     - 正涨幅时：`score = (fund_strength + 1) * (RATE_z + 1)`，其中 `fund_strength = (avg_weighted_amount_z + total_weighted_amount_z) / 2`
     - 负涨幅时：`score = (fund_strength + 1) * max(0.1, RATE_z + 1) * 0.1`
  11. **评分标准化**: 调用 `_standardize_score` 函数，使用 Z-score 标准化评分，降低不同交易日之间的差距。
  12. **过滤板块**: 
     - 过滤掉股票数量小于5的板块
     - 过滤掉 `total_weighted_amount_z` 小于0的板块
  13. **动态阈值计算**: 调用 `_calculate_dynamic_threshold` 函数，使用 70% 分位数作为阈值，确保输出数量适中，最多保留15个板块。
- **输出**:
  - 按评分降序排列的板块 DataFrame，包含 `count`, `RATE`, `weighted_amount`, `avg_weighted_amount`, `avg_weighted_amount_z`, `total_weighted_amount_z`, `RATE_z`, `score`, `standardized_score`, `relative_score` 等字段。
  - 主线板块为排序靠前的板块，通常取前10个作为主线。

### 3.3 `GetBlockData` (获取板块数据)

- **功能**: 从通达信获取原始板块数据，为 `blockData` 函数提供基础数据。
- **实现**: 调用 `QA_fetch_stock_block_adv()` 获取通达信板块数据，并进行基础处理。
- **返回**: 包含板块信息的 DataFrame。

### 3.4 `blockData` (板块数据初始化)

- **功能**: 构建并缓存清洗后的板块对应关系表 `DataFrame_BlockList`，使用通达信板块数据作为数据源。
- **关键逻辑**:
  - **数据来源**: 使用 `GetBlockData` 获取的通达信板块数据，包括概念、指数、地区、风格、行业等类型。
  - **剔除噪音风格**: 自动剔除在 `Parameter.py` 中定义的 `style_block_drop` 列表中的标签。
  - **n1name 映射**: 将细分板块映射到更宏观的 `n1name` 维度，建立与一级概念的关联。
  - **数据清洗**: 剔除陈旧概念和无效数据，确保数据质量。
  - **缓存机制**: 将处理后的数据存储到 Redis，供其他函数使用，提高实时计算效率。
  - **相关性矩阵缓存**: 当 `renew=True` 时，自动刷新 Jaccard 和共现相关性矩阵缓存。
- **参数**: `renew` (是否更新 Redis 缓存，默认 True)
- **返回**: 处理后的板块数据 DataFrame，包含 `code`, `type`, `blockname`, `fill_1`, `n1name` 字段。
- **Redis 缓存键**:
  - `DataFrame_BlockList`: 基础板块列表
  - `DataFrame_BlockYestoday`: 昨日涨停等特殊板块
  - `DataFrame_BlockList_Min`: 最小化板块列表
  - `DataFrame_BlockList_All`: 完整板块列表（含行业）
  - `CorrelationMatrix_jaccard`: Jaccard 相关性矩阵
  - `CorrelationMatrix_cooccurrence`: 共现相关性矩阵

### 3.5 `blockData_adv` (进阶板块数据初始化) - **已移除**

> **注意**: 该函数已从当前版本中移除，相关功能已整合到 `blockData` 函数中。

- **原功能**: 初始化并缓存特殊板块数据，如昨日涨停、近期强势等。
- **原应用场景**: 主要用于竞价阶段的快速分析，提供市场热点的历史延续性信息。
- **替代方案**: 使用 `blockData(renew=True)` 函数，该函数已包含对 `DataFrame_BlockYestoday` 的初始化。

### 3.6 `stock_concept_hot_list` (概念板块热点列表)

- **功能**: 获取通达信新概念板块数据，数据齐全且每日更新。
- **特点**: 与 `stockblock_` 一致，但更齐全，支持 Redis 缓存。

### 3.7 `re_save_stock_block` (板块数据修订)

- **功能**: 修订数据库中的板块数据，保持概念名称一致。
- **应用场景**: 与 `QA_SU_save_stock_block` 同时使用，确保板块数据的一致性。

### 3.8 `re_save_stock_concept` (概念数据重新保存)

- **功能**: 重新保存概念数据，确保概念名称和分类的一致性。
- **实现步骤**: 调用 `re_save_stock_block`，然后保存通达信概念数据，最后更新数据库中的概念信息。

### 3.9 `find_similar_blocknames` (相似板块名称查找)

- **功能**: 找出板块列表中名称可能相似的记录，用于识别重复或高度相似的板块。
- **输入**:
  - `block_list`: 板块列表DataFrame，如果为None则从Redis获取 `DataFrame_BlockList_All`
  - `similarity_threshold`: 名称相似度阈值，默认0.8，范围0-1
- **算法步骤**:
  1. **数据获取**: 如果未传入block_list，则从Redis获取 `DataFrame_BlockList_All`
  2. **名称相似度计算**: 使用 `SequenceMatcher` 计算每对板块名称的相似度
  3. **股票重叠度计算**: 对于名称相似的板块，计算其包含股票的交集比例
  4. **多重过滤**:
     - 名称相似度 >= `similarity_threshold`
     - 股票重叠度 > 0.9 (高度重合)
     - 股票数量比 count_ratio 在 0.6 ~ 2 之间 (规模相近)
- **输出**: 返回包含相似板块名称对的DataFrame，列包括：
  - `blockname_1`: 第一个板块名称
  - `blockname_2`: 第二个板块名称
  - `similarity`: 名称相似度分数 (0-1)
  - `codes_count_1`: 第一个板块包含的股票数量
  - `codes_count_2`: 第二个板块包含的股票数量
  - `count_ratio`: 两个板块股票数量比值 (codes_count_1 / codes_count_2)
  - `overlap_count`: 两个板块重叠的股票数量
  - `overlap_ratio`: 重叠股票占较小板块的比例
- **使用示例**:
  ```python
  from FQMarket.FQUtil.BBlock import find_similar_blocknames
  
  # 方式1：自动从Redis获取数据
  similar_blocks = find_similar_blocknames()
  
  # 方式2：传入自定义的block_list
  similar_blocks = find_similar_blocknames(block_list=my_custom_df)
  
  # 方式3：调整相似度阈值
  similar_blocks = find_similar_blocknames(similarity_threshold=0.7)
  ```

### 3.9 `merge_similar_blocks` (合并相似板块)

- **功能**: 合并相似板块记录，以 blockname_2 的记录为基础，将 blockname_1 中的记录合并。
- **输入**:
  - `block_list`: 板块列表DataFrame，如果为None则从Redis获取
  - `similarity_threshold`: 相似度阈值，默认0.8，范围0-1
  - `update_redis`: 是否更新Redis缓存，默认True
- **算法步骤**:
  1. **数据获取**: 如果未传入block_list，则从Redis获取 `DataFrame_BlockList_All`
  2. **获取相似板块对**: 调用 `find_similar_blocknames` 函数获取相似板块对
  3. **合并处理**:
     - 遍历每对相似板块 (blockname_1, blockname_2)
     - 提取 blockname_2 中的股票代码
     - 找出 blockname_1 中与 blockname_2 重复的记录并删除
     - 修改 blockname_1 的名称为 blockname_2 的名称
  4. **去重处理**: 确保每个 (code, blockname) 组合唯一
  5. **更新缓存**: 如果 update_redis=True，更新 Redis 中的 `DataFrame_BlockList_All`
- **输出**: 返回合并后的板块列表DataFrame
- **使用示例**:
  ```python
  from FQMarket.FQUtil.BBlock import merge_similar_blocks
  
  # 方式1：自动从Redis获取数据并更新缓存
  merged_blocks = merge_similar_blocks()
  
  # 方式2：传入自定义的block_list，不更新缓存
  merged_blocks = merge_similar_blocks(block_list=my_custom_df, update_redis=False)
  
  # 方式3：调整相似度阈值
  merged_blocks = merge_similar_blocks(similarity_threshold=0.7)
  ```

### 3.10 辅助函数

#### 3.10.1 `_calculate_weight`
- **功能**: 计算股票权重，综合考虑市值分层和模型特定加权
- **参数**:
  - `row`: 股票数据行
  - `res_zb`: 主板市值阈值
  - `res_zx`: 中小板市值阈值
  - `res_cy`: 创业板市值阈值
  - `res_kc`: 科创板市值阈值
  - `res_bj`: 北交所市值阈值
  - `model_type`: 模型类型 ('real_time' 或 'post_market')
- **返回**: 计算后的权重值
- **实现逻辑**:
  - 市值加权: 超大盘 x1.0, 大盘 x1.1, 小盘 x0.9, 微盘 x0.5
  - 北交所特殊处理: 使用创业板市值阈值
  - 实时模型: 一字板涨停 x1.5
  - 盘后模型:
    - 连板加成: 3板及以上 x1.5, 2板 x1.3, 1板 x1.1
    - 一字板加成: x1.2
    - 涨停时间加成: 开盘30分钟内 x1.3, 1小时内 x1.2, 午盘前 x1.1
    - N1天N2板加成: 5板及以上 x1.8, 4板 x1.6, 3板 x1.4, 2板 x1.2
    - 炸板惩罚: x0.8

#### 3.11.2 `_calculate_dynamic_threshold`
- **功能**: 动态阈值计算，确保输出数量适中
- **参数**:
  - `group_sb`: 按评分排序的板块DataFrame
  - `max_blocks`: 最大保留板块数量
- **返回**: 过滤后的板块DataFrame

#### 3.10.3 `_standardize_score`
- **功能**: 评分标准化，降低不同交易日之间的差距
- **参数**:
  - `group_sb`: 板块DataFrame
- **返回**: 标准化后的板块DataFrame

#### 3.10.4 `_validate_input_data`
- **功能**: 验证输入数据是否包含必要的字段
- **参数**:
  - `data`: 输入数据DataFrame
  - `required_columns`: 必要字段列表
- **返回**: 数据是否有效



---

## 4. 辅助诊断工具

### 4.1 `getmarketshizhiquantile`
- **功能**: 计算全市场或特定板块的市值分位点，为“市值分层加权”算法提供基础数据。
- **输入**:
  - `end_date` (交易日期，默认为今日)
  - `data` (市场数据，默认为 None，会自动从 Redis 或数据库获取)
  - `lists` (股票代码列表，默认为 None，用于计算特定股票群体的市值分布)
  - `mtype` (市场板块类型，支持字符串或列表，如 'ZB', 'CY' 等，默认为 None)
- **算法步骤**:
  1. **数据获取**: 从 Redis 或数据库获取市场数据
  2. **板块过滤**: 根据 `mtype` 参数过滤特定板块的股票
  3. **市值计算**: 确保数据中包含流通市值 `liutongshizhiZ`
  4. **分位点计算**: 计算市值的 90%、70%、40% 和 20% 分位点
  5. **统计分析**: 统计不同市值区间的股票数量和占比
- **输出**: 返回包含市值分位点、股票数量和占比的列表
- **应用场景**: 被 `GetMainBlockRealTime` 和 `GetMainBlockPostMarket` 函数调用，为市值分层加权提供阈值数据

> **注意**: `analyze_market_shizhi_quantile` 和 `analyze_micro_cap_logic` 函数已从 BBlock.py 移动到 MonitorMarket.py 文件中。

---

## 5. 与策略层的交互示例

```python
# 示例1：在竞价逻辑中识别“进攻主线”
from FQMarket.FQUtil.BBlock import GetMainBlockRealTime
# strong_stocks 是通过竞价数据筛选出的强势股 DataFrame
group_sb = GetMainBlockRealTime(strong_stocks, use_market_segments=True, n1name=False, all_=False)
# 取前10个板块作为主线
main_blocks = group_sb.index.tolist()[:10]
QA_util_log_info(f'竞价主线: {main_blocks}')

# 示例2：在盘后复盘逻辑中确认"市场共识"
from FQMarket.FQUtil.BBlock import GetMainBlockPostMarket
from FQMarket.FQUtil.ToolsGetData import GetStockList

# 获取市场数据
data = GetStockList('2026-03-05', extent_=True, limit_=True)
group_sb = GetMainBlockPostMarket(data, use_market_segments=True, n1name=False, all_=False)
# 取前10个板块作为主线
main_blocks = group_sb.index.tolist()[:10]
QA_util_log_info(f'盘后主线: {main_blocks}')


# 示例3：初始化板块数据
from FQMarket.FQUtil.BBlock import blockData
blockData(renew=True)
QA_util_log_info('板块数据初始化完成')

# 示例4：使用MonitorMarket模块进行市场状态分析
from FQMarket.FQUtil.MonitorMarket import analyze_market_status
from FQMarket.FQUtil.ToolsGetData import get_open_select_stock_list

# 获取数据
duodata, d4, d5, d6, d9 = get_open_select_stock_list('2026-03-13', save=False, read=True, show=False)
block_data1 = GetMainBlockRealTime(duodata, debug_=False, return_all_blocks=True)
block_data2 = GetMainBlockRealTime(d9, debug_=False, return_all_blocks=True)
block_data3 = GetMainBlockPostMarket(d9, debug_=False, return_all_blocks=True)

# 分析市场状态
result = analyze_market_status(
    block_data1, 
    block_data2, 
    block_data3, 
    debug_=True, 
    end_date='2026-03-13', 
    limit_up_threshold=2, 
    stock_data_main=duodata
)
print(f"市场状态: {result['comprehensive_analysis']['market_status']['status']}")
print(f"置信度: {result['comprehensive_analysis']['market_status']['confidence']:.0%}")
print(f"状态类型: {result['comprehensive_analysis']['market_status']['status_type']}")
```

---

## 6. 数据结构说明

### 6.1 Redis 缓存数据结构

- **DataFrame_BlockList**: 清洗后的板块对应关系表，包含 `code`, `type`, `blockname`, `fill_1`, `n1name` 字段。
- **DataFrame_BlockList_Min**: 每个股票只保留一个主要板块的简化版板块对应关系表。
- **DataFrame_BlockYestoday**: 特殊板块数据，如昨日涨停、近期强势等。
- **DataFrame_Concept**: 概念板块的分类信息，包含 `code`, `name`, `n1name`, `count` 字段。
- **DataFrame_ConceptStock**: 概念板块的股票列表，包含 `code`, `blockname`, `date` 字段。

### 6.2 输入输出数据结构

- **GetMainBlockRealTime 输入**: 包含 `code`, `oamo`, `orate`, `liutongshizhiZ`, `mtype`, `lb` 等字段的 DataFrame。
- **GetMainBlockPostMarket 输入**: 包含 `code`, `amount`, `RATE`, `liutongshizhiZ`, `mtype`, `lb`, `hprice`, `hcount`, `hstop`, `start_` 等字段的 DataFrame。
- **主线识别函数输出**: 按评分降序排列的板块 DataFrame，包含以下字段：
  - `count`: 板块内个股数量。
  - `orate`/`RATE`: 板块平均涨幅。
  - `weighted_oamo`/`weighted_amount`: 加权竞价额/成交额。
  - `avg_weighted_oamo`/`avg_weighted_amount`: 平均加权竞价额/成交额。
  - `score`: 板块评分。
  - `standardized_score`: 标准化评分。
  - `relative_score`: 相对评分。
- **主线板块提取**: 从输出的 DataFrame 中取前10个板块作为主线。

---

## 7. 未来优化方向

1.  **行业树结构**: 目前的 `n1name` 是扁平化的，可以考虑引入更深层的行业树结构（如申万一级/二级/三级），以实现更精细的板块聚类。

2.  **动态过滤名单**: `blockData` 中的过滤名单是硬编码的，未来可考虑移至配置文件或数据库。

3.  **实时性能优化**: 对于大规模数据处理，可考虑进一步优化板块聚合算法效率，减少时间复杂度。

4.  **多维度主线识别**: 除了基于成交和涨幅的主线识别，可考虑引入更多维度，如资金流向、波动率等，构建更全面的主线识别模型。

5.  **板块轮动分析**: 增加板块轮动分析功能，识别板块之间的转换规律，为策略提供更长期的市场结构洞察。

6.  **智能阈值调整**: 量比和涨幅的阈值目前是固定的，未来可考虑基于市场环境动态调整这些阈值，提高模型的适应性。

7.  **相似板块智能合并**: 进一步优化 `merge_similar_blocks` 函数，引入更智能的合并策略，如基于板块历史表现、行业关联性等因素进行合并决策。

8.  **板块名称标准化**: 建立板块名称的标准化映射表，自动识别和统一不同来源的板块名称，减少板块重复和混乱。

---

## 8. 概念相关性分析

### 8.1 概述

概念相关性分析模块用于计算概念/板块之间的关联程度，支持两种计算方法：

1. **Jaccard相关性**：基于股票重叠的 Jaccard 相似度，结合行业分类和类型进行加权
2. **共现相关性**：基于股票共同出现的频率，发现概念之间的隐性关联

### 8.2 `calculate_jaccard_correlation` (Jaccard相关性矩阵)

- **功能**: 计算概念/板块之间的Jaccard相关性矩阵
- **输入**:
  - `blockData`: 板块数据DataFrame，包含 `code`, `blockname`, `n1name`, `type` 等列
- **算法逻辑**:
  1. 构建每个板块的股票集合
  2. 计算任意两个板块之间的 Jaccard 相似度：`Jaccard(A, B) = |A ∩ B| / |A ∪ B|`
  3. 应用加权因子：
     - 同一 `n1name`（一级行业）：权重 +0.3
     - 同一 `type`（类型）：权重 +0.1
  4. 最终分数 = Jaccard × 权重
- **输出**: 相关性矩阵（DataFrame），行列均为板块名称，值为相关性分数
- **使用示例**:
  ```python
  from FQMarket.FQUtil.BBlock import calculate_jaccard_correlation
  
  # 获取板块数据
  blockData = r.get('DataFrame_BlockList_All')
  
  # 计算相关性矩阵
  correlation_matrix = calculate_jaccard_correlation(blockData)
  
  # 查询两个概念的相关性
  print(correlation_matrix.loc['储能', '光伏'])  # 输出: 1.4
  ```

### 8.3 `calculate_cooccurrence_correlation` (共现相关性矩阵)

- **功能**: 基于股票共现关系计算概念/板块之间的相关性
- **核心思想**: 如果概念A和概念B的股票经常一起出现在其他概念中，则A和B存在隐含关联
- **输入**:
  - `blockData`: 板块数据DataFrame
  - `normalize`: 是否归一化（默认 True）
- **算法逻辑**:
  1. 构建股票-概念映射：每只股票属于哪些概念
  2. 统计共现次数：两只股票同时出现在某个概念中，则这两个概念共现+1
  3. 归一化：`共现相关性 = 共现次数 / min(概念A股票数, 概念B股票数)`
- **输出**: 共现相关性矩阵（DataFrame）
- **使用示例**:
  ```python
  from FQMarket.FQUtil.BBlock import calculate_cooccurrence_correlation
  
  # 计算共现相关性矩阵
  cooccur_matrix = calculate_cooccurrence_correlation(blockData)
  
  # 查询隐性关联
  print(cooccur_matrix.loc['储能', '人工智能'])
  ```

### 8.4 `get_top_similar_blocks` (获取相似板块)

- **功能**: 获取与指定板块最相似的板块
- **输入**:
  - `block_name`: 目标板块名称
  - `correlation_matrix`: 相关性矩阵（可选，如果为None则从缓存获取）
  - `top_n`: 返回数量（默认 10）
  - `threshold`: 相关性阈值（可选，优先于 top_n）
  - `matrix_type`: 矩阵类型（'jaccard' 或 'cooccurrence'），当 correlation_matrix 为 None 时使用
  - `use_cache`: 是否使用缓存（默认 True）
- **输出**: 相似板块列表，格式为 `[(板块名称, 相关性分数), ...]`
- **使用示例**:
  ```python
  from FQMarket.FQUtil.BBlock import get_top_similar_blocks
  
  # 方式1：自动从缓存获取矩阵，返回最相似的10个板块
  similar = get_top_similar_blocks('储能')
  
  # 方式2：使用共现矩阵
  similar = get_top_similar_blocks('储能', matrix_type='cooccurrence')
  
  # 方式3：传入自定义矩阵
  similar = get_top_similar_blocks('储能', correlation_matrix, top_n=10)
  
  # 方式4：返回所有相关性超过0.3的板块
  similar = get_top_similar_blocks('储能', threshold=0.3)
  ```

### 8.5 `get_or_create_correlation_matrix` (相关性矩阵缓存)

- **功能**: 获取或创建相关性矩阵，支持 Redis 缓存，避免重复计算
- **输入**:
  - `matrix_type`: 矩阵类型，可选 `'jaccard'` 或 `'cooccurrence'`（默认 `'jaccard'`）
  - `blockData`: 板块数据DataFrame，如果为None则从Redis获取
  - `use_cache`: 是否使用缓存（默认 True）
  - `cache_expire_hours`: 缓存过期时间（小时），默认 24 小时
  - `force_refresh`: 是否强制刷新缓存（默认 False）
- **算法逻辑**:
  1. **检查缓存**: 如果 `use_cache=True` 且 `force_refresh=False`，检查 Redis 中是否存在缓存
  2. **验证过期时间**: 如果缓存存在且未过期，直接返回缓存的矩阵
  3. **计算矩阵**: 如果缓存不存在或已过期，调用对应的计算函数
  4. **更新缓存**: 计算完成后，将矩阵和缓存时间存入 Redis
- **Redis 存储键**:
  - 矩阵数据: `CorrelationMatrix_{matrix_type}`
  - 缓存时间: `CorrelationMatrix_{matrix_type}_time`
- **输出**: 相关性矩阵（DataFrame）
- **使用示例**:
  ```python
  from FQMarket.FQUtil.BBlock import get_or_create_correlation_matrix
  
  # 方式1：使用默认缓存（24小时过期）
  jaccard_matrix = get_or_create_correlation_matrix('jaccard')
  cooccur_matrix = get_or_create_correlation_matrix('cooccurrence')
  
  # 方式2：强制刷新缓存
  jaccard_matrix = get_or_create_correlation_matrix('jaccard', force_refresh=True)
  
  # 方式3：自定义缓存过期时间（48小时）
  jaccard_matrix = get_or_create_correlation_matrix('jaccard', cache_expire_hours=48)
  
  # 方式4：不使用缓存，每次重新计算
  jaccard_matrix = get_or_create_correlation_matrix('jaccard', use_cache=False)
  ```

### 8.6 `refresh_all_correlation_matrices` (刷新所有相关性矩阵缓存)

- **功能**: 一次性刷新所有相关性矩阵缓存
- **输入**:
  - `blockData`: 板块数据DataFrame，如果为None则从Redis获取
  - `cache_expire_hours`: 缓存过期时间（小时），默认 24 小时
- **输出**: 包含两种矩阵的字典 `{'jaccard': matrix, 'cooccurrence': matrix}`
- **使用示例**:
  ```python
  from FQMarket.FQUtil.BBlock import refresh_all_correlation_matrices
  
  # 刷新所有相关性矩阵缓存
  matrices = refresh_all_correlation_matrices()
  
  jaccard_matrix = matrices['jaccard']
  cooccur_matrix = matrices['cooccurrence']
  ```

### 8.7 `get_correlation_matrix_cache_info` (获取缓存信息)

- **功能**: 获取相关性矩阵缓存的详细信息
- **输出**: 缓存信息字典，包含以下字段：
  - `exists`: 缓存是否存在
  - `shape`: 矩阵形状（行数, 列数）
  - `cached_time`: 缓存时间（ISO格式字符串）
  - `age_hours`: 缓存已存在时间（小时）
- **使用示例**:
  ```python
  from FQMarket.FQUtil.BBlock import get_correlation_matrix_cache_info
  
  info = get_correlation_matrix_cache_info()
  
  print(f"Jaccard矩阵缓存: {info['jaccard']}")
  print(f"共现矩阵缓存: {info['cooccurrence']}")
  
  # 检查缓存是否需要刷新
  if info['jaccard']['age_hours'] > 24:
      print("Jaccard矩阵缓存已过期，建议刷新")
  ```

### 8.8 两种相关性方法的对比

| 方法 | 计算逻辑 | 适用场景 | 优势 |
|------|----------|----------|------|
| Jaccard相关性 | 直接计算股票集合交集/并集 | 显性关联分析 | 直观、可解释性强 |
| 共现相关性 | 统计股票共同出现次数 | 隐性关联挖掘 | 发现非显而易见的关联 |

#### 8.5.1 算法原理对比

**Jaccard 相关性（加权）**

```
Jaccard(A, B) = |股票集合A ∩ 股票集合B| / |股票集合A ∪ 股票集合B|
最终分数 = Jaccard × (1 + n1name权重 + type权重)
```

- **核心思想**：直接衡量两个概念有多少共同股票
- **值域**：[0, 1.4]（加权后可能超过1）
- **特点**：对称性，A与B的相关性 = B与A的相关性

**共现相关性**

```
共现次数 = 统计股票同时出现在概念A和概念B中的次数
共现相关性 = 共现次数 / min(概念A股票数, 概念B股票数)
```

- **核心思想**：通过股票的"朋友圈"发现概念的隐性关联
- **值域**：[0, 1]
- **特点**：考虑了股票在多个概念中的分布模式

#### 8.5.2 具体案例对比

以"储能"概念为例，对比两种方法的结果差异：

| 目标概念 | Jaccard相关性 | 共现相关性 | 差异原因 |
|----------|--------------|-----------|----------|
| 光伏 | 1.40 | 0.92 | 直接重叠股票多，两种方法都高 |
| 锂电池 | 0.85 | 0.78 | 有共同股票，但储能股票更多分布在锂电池 |
| 人工智能 | 0.73 | 0.45 | Jaccard加权后较高（同一n1name），但实际共现较少 |
| 风电 | 0.52 | 0.68 | Jaccard较低，但通过光伏等中间概念形成强共现 |

**解读**：
- **光伏**：两种方法都显示高度相关，说明储能和光伏确实有大量共同股票
- **人工智能**：Jaccard高是因为加权（同一n1name），但共现低说明实际业务关联不强
- **风电**：共现高说明储能和风电的股票经常一起出现在其他概念中，存在隐性关联

#### 8.5.3 应用场景详解

| 应用场景 | 推荐方法 | 原因 |
|----------|----------|------|
| **概念去重** | Jaccard | 直接衡量股票重叠度，重叠高则可能是重复概念 |
| **板块轮动预测** | 共现相关性 | 发现隐性关联，预测资金可能流向的非显而易见板块 |
| **组合分散** | 两者结合 | Jaccard排除直接重叠，共现排除隐性关联 |
| **概念扩散** | Jaccard | 扩散需要直接关联关系，路径更清晰 |
| **行业分析** | Jaccard相关性 | 利用n1name加权，突出同一行业的关联性 |
| **资金流向预测** | 共现相关性 | 捕捉市场资金的隐性流动路径 |

#### 8.5.4 使用建议

```python
# 场景1：概念去重 - 使用Jaccard
# 找出与"储能"高度重叠的概念，可能是重复命名
duplicates = get_top_similar_blocks('储能', jaccard_matrix, threshold=0.8)

# 场景2：板块轮动 - 使用共现相关性
# 发现可能跟涨的隐性关联板块
hidden_related = get_top_similar_blocks('储能', cooccur_matrix, threshold=0.5)

# 场景3：组合分散 - 两者结合
# 排除直接重叠和隐性关联
def get_diversified_blocks(seed, jaccard_mat, cooccur_mat, threshold=0.3):
    jaccard_related = set([b[0] for b in get_top_similar_blocks(seed, jaccard_mat, threshold=threshold)])
    cooccur_related = set([b[0] for b in get_top_similar_blocks(seed, cooccur_mat, threshold=threshold)])
    return jaccard_related | cooccur_related  # 并集，需要排除的板块

# 场景4：概念扩散 - 使用Jaccard
# 基于直接关联进行扩散，路径清晰可解释
diffusion = calculate_concept_diffusion('储能', jaccard_matrix, max_depth=2)
```

#### 8.5.5 方法选择决策树

```
需要分析概念关联？
│
├─ 是否需要发现隐性关联？
│   ├─ 是 → 使用共现相关性
│   └─ 否 ↓
│
├─ 是否需要考虑行业分类？
│   ├─ 是 → 使用Jaccard相关性（利用n1name加权）
│   └─ 否 ↓
│
├─ 是否用于概念扩散？
│   ├─ 是 → 使用Jaccard（路径清晰）
│   └─ 否 → 使用共现相关性（发现非显而易见关联）
```

---

## 9. 概念扩散算法

### 9.1 概述

概念扩散算法用于预测资金从一个热点概念流向相关概念的过程。当某个概念上涨时，资金可能流向相关性高的概念，形成"扩散效应"。

### 9.2 核心公式

```
扩散分数 = 种子分数 × 相关性 × (衰减因子 ^ 扩散深度)
```

- **深度 1**：直接关联概念（衰减 0.6）
- **深度 2**：二级关联概念（衰减 0.36）
- **深度 N**：N级关联概念（衰减 0.6^N）

### 9.3 `calculate_concept_diffusion` (概念扩散)

- **功能**: 从种子概念出发，发现可能跟涨/联动的相关概念
- **输入**:
  - `seed_blocks`: 种子概念（字符串或列表）
  - `correlation_matrix`: 相关性矩阵（可选，如果为None则从缓存获取）
  - `max_depth`: 最大扩散深度（默认 2）
  - `decay_factor`: 衰减因子（默认 0.6）
  - `min_score`: 最小分数阈值（默认 0.1）
  - `max_results`: 最大返回数量（默认 20）
  - `matrix_type`: 矩阵类型（'jaccard' 或 'cooccurrence'），当 correlation_matrix 为 None 时使用
  - `use_cache`: 是否使用缓存（默认 True）
- **算法步骤**:
  1. 初始化种子概念，分数为 1.0
  2. 广度优先搜索，逐层扩散
  3. 每层应用衰减因子
  4. 计算传递分数并筛选
  5. 按分数排序返回结果
- **输出**: 扩散结果列表，格式为 `[(概念名称, 扩散分数, 扩散路径, 扩散深度), ...]`
- **使用示例**:
  ```python
  from FQMarket.FQUtil.BBlock import calculate_concept_diffusion
  
  # 方式1：自动从缓存获取矩阵，单个种子扩散
  results = calculate_concept_diffusion('储能')
  
  # 方式2：使用共现矩阵
  results = calculate_concept_diffusion('储能', matrix_type='cooccurrence')
  
  # 方式3：多个种子扩散
  results = calculate_concept_diffusion(['储能', '光伏'])
  
  # 方式4：传入自定义矩阵
  results = calculate_concept_diffusion('储能', correlation_matrix)
  
  # 输出示例
  # [('光伏', 0.84, '储能 -> 光伏', 1),
  #  ('锂电池', 0.72, '储能 -> 锂电池', 1),
  #  ('风电', 0.38, '储能 -> 光伏 -> 风电', 2)]
  ```

### 9.4 `calculate_multi_seed_diffusion` (多种子加权扩散)

- **功能**: 支持为不同种子概念设置不同权重的扩散算法
- **适用场景**:
  - 多个概念同时上涨，需要综合判断扩散方向
  - 不同概念涨幅不同，权重应有所区别
- **输入**:
  - `seed_blocks`: 种子概念列表或字典
    - 列表: `['储能', '光伏']`
    - 字典: `{'储能': 0.8, '光伏': 0.5}`（权重）
  - `correlation_matrix`: 相关性矩阵（可选，如果为None则从缓存获取）
  - `block_scores`: 可选，种子概念的涨跌幅/强度评分
  - `matrix_type`: 矩阵类型（'jaccard' 或 'cooccurrence'），当 correlation_matrix 为 None 时使用
  - `use_cache`: 是否使用缓存（默认 True）
  - 其他参数同 `calculate_concept_diffusion`
- **输出**: 扩散结果列表，格式为 `[(概念名称, 扩散分数, 来源种子, 扩散深度, 扩散路径), ...]`
- **使用示例**:
  ```python
  from FQMarket.FQUtil.BBlock import calculate_multi_seed_diffusion
  
  # 方式1：自动从缓存获取矩阵，带权重的多种子扩散
  results = calculate_multi_seed_diffusion(
      {'储能': 0.9, '光伏': 0.6}  # 储能涨幅更大，权重更高
  )
  
  # 方式2：使用共现矩阵
  results = calculate_multi_seed_diffusion(
      {'储能': 0.9, '光伏': 0.6},
      matrix_type='cooccurrence'
  )
  ```

### 9.5 `get_diffusion_report` (扩散报告)

- **功能**: 生成格式化的概念扩散报告
- **输入**:
  - `seed_blocks`: 种子概念
  - `correlation_matrix`: 相关性矩阵（可选，如果为None则从缓存获取）
  - `matrix_type`: 矩阵类型（'jaccard' 或 'cooccurrence'），当 correlation_matrix 为 None 时使用
  - `use_cache`: 是否使用缓存（默认 True）
  - `**kwargs`: 传递给 `calculate_concept_diffusion` 的参数
- **输出**: 格式化的报告字符串
- **使用示例**:
  ```python
  from FQMarket.FQUtil.BBlock import get_diffusion_report
  
  # 方式1：自动从缓存获取矩阵，生成报告
  report = get_diffusion_report('储能')
  print(report)
  
  # 方式2：使用共现矩阵
  report = get_diffusion_report('储能', matrix_type='cooccurrence')
  ```
- **输出示例**:
  ```
  ============================================================
  概念扩散报告
  种子概念: 储能
  ============================================================
  
  概念名称              扩散分数     深度 扩散路径
  ------------------------------------------------------------
  光伏                    0.8400      1 储能 -> 光伏
  锂电池                  0.7200      1 储能 -> 锂电池
  虚拟电厂                0.6500      1 储能 -> 虚拟电厂
  风电                    0.3800      2 储能 -> 光伏 -> 风电
  
  ============================================================
  ```

### 9.6 应用场景

| 应用场景 | 说明 |
|----------|------|
| **概念扩散预测** | 当"储能"上涨时，预测可能跟涨的隐性关联板块 |
| **资金流向预测** | 资金可能从强势概念流向共现度高的相关概念 |
| **概念去重** | 共现度极高的概念可能是同一主题的不同名称 |
| **组合构建** | 避免选择共现度高的概念，实现分散投资 |

---

## 10. 完整使用示例

```python
from FQMarket.FQUtil.BBlock import (
    calculate_jaccard_correlation,
    calculate_cooccurrence_correlation,
    get_top_similar_blocks,
    calculate_concept_diffusion,
    calculate_multi_seed_diffusion,
    get_diffusion_report
)
from direct_redis import DirectRedis

r = DirectRedis(host='localhost', port=6379)

# 1. 获取板块数据
blockData = r.get('DataFrame_BlockList_All')

# 2. 计算相关性矩阵
jaccard_matrix = calculate_jaccard_correlation(blockData)
cooccur_matrix = calculate_cooccurrence_correlation(blockData)

# 3. 查询相似板块
print("直接关联:", get_top_similar_blocks('储能', jaccard_matrix, top_n=5))
print("隐性关联:", get_top_similar_blocks('储能', cooccur_matrix, top_n=5))

# 4. 概念扩散分析
print(get_diffusion_report('储能', jaccard_matrix))

# 5. 多种子加权扩散
results = calculate_multi_seed_diffusion(
    {'储能': 0.9, '光伏': 0.6},
    jaccard_matrix,
    max_depth=2
)
for block, score, sources, depth, path in results[:5]:
    print(f"{block}: {score:.4f} (来源: {sources}, 深度: {depth})")
```
