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

为了更精确地捕捉市场动态并应对“日内背离”（即开盘预期与收盘结果不一致），原有的 `GetMainBlock` 函数已升级为两个独立的模型：

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
- **算法步骤**:
  1.  **数据验证**: 验证输入数据是否包含必要的字段。
  2.  **量比过滤**: 过滤掉量比低于阈值的股票，提高股票质量。
  3.  **获取市值阈值**: 调用 `getmarketshizhiquantile` 分别获取主板和创业板的市值分位点。
  4.  **数据合并**: 将输入的 `stocklist` 与 Redis 中的 `DataFrame_BlockList` 合并，为每个个股打上板块标签。
  5.  **过滤板块**: 过滤掉 `type` 不在 ['gn', 'tdxhy', 'yjhy'] 中的板块（如风格板块等）。
  6.  **计算动态权重 (`W_cap`)**: 调用 `_calculate_weight` 函数，应用“市值分层加权”逻辑，为每个个股计算其能量权重。
  7.  **量比加权**: 对量比进行 0.5-3.0 的范围限制，然后用于加权计算。
  8.  **计算加权能量 (`weighted_oamo`)**: `weighted_oamo = oamo * W_cap * W_lb`。
  9.  **板块聚合**: 按 `blockname` 分组，聚合计算 `count` (个股数), `orate` (平均涨幅), `weighted_oamo` (加权竞价总额)。
  10. **板块涨幅过滤**: 过滤掉涨幅小于-1的概念板块。
  11. **板块评分**:
      - 改进的评分公式：使用 Z-score 标准化和负涨幅惩罚，综合考量资金强度、价格表现、量比质量和规模效应。
      - 正涨幅时：`score = (avg_weighted_oamo_z + 1) * (orate_z + 1) * (1 + log1p(count))`
      - 负涨幅时：`score = (avg_weighted_oamo_z + 1) * max(0.1, orate_z + 1) * (1 + log1p(count)) * 0.1`
  12. **评分标准化**: 调用 `_standardize_score` 函数，使用 Z-score 标准化评分，降低不同交易日之间的差距。
  13. **动态阈值计算**: 调用 `_calculate_dynamic_threshold` 函数，使用 70% 分位数作为阈值，确保输出数量适中，最多保留15个板块。
  14. **相对评分过滤**: 调用 `_apply_relative_score_filter` 函数，只保留相对评分高于阈值的板块作为主线。
- **输出**:
  - 按评分降序排列的板块 DataFrame，包含 `count`, `orate`, `weighted_oamo`, `avg_weighted_oamo`, `avg_weighted_oamo_z`, `orate_z`, `score`, `standardized_score`, `relative_score` 等字段。
  - 主线板块为排序靠前的板块，通常取前10个作为主线。

### 3.2 `GetMainBlockPostMarket` (盘后确认模型)

- **功能**: 确认收盘后的市场主线。
- **输入**:
  - `end_date` (交易日期)
  - `data` (包含市场数据的 DataFrame，需要包含 `code`, `amount`, `RATE`, `liutongshizhiZ`, `mtype`, `hprice`, `hcount`, `hstop`, `start_` 等字段)
  - `threshold_len` (板块下限阈值，默认 0.4)
  - `debug_` (是否输出调试信息，默认 False)
- **算法步骤**:
  1.  **数据验证**: 验证输入数据是否包含必要的字段。
  2.  **获取市值阈值**: 调用 `getmarketshizhiquantile` 分别获取主板和创业板的市值分位点。
  3.  **数据合并**: 将输入的 `data` 与 Redis 中的 `DataFrame_BlockList` 合并，为每个个股打上板块标签。
  4.  **过滤板块**: 过滤掉 `type` 不在 ['gn', 'tdxhy', 'yjhy'] 中的板块（如风格板块等）。
  5.  **计算动态权重 (`W_cap`)**: 调用 `_calculate_weight` 函数，应用“市值分层加权”和“涨停质量加权”逻辑，为每个个股计算其能量权重。
  6.  **计算加权能量 (`weighted_amount`)**: `weighted_amount = amount * W_cap`。
  7.  **板块聚合**: 按 `blockname` 分组，聚合计算 `count` (个股数), `amount` (总成交额), `RATE` (平均涨幅), `weighted_amount` (加权成交额), `hcount_total` (涨停家数)。
  8.  **修复hcount_total计算**: 确保涨停家数不为负数。
  9.  **板块涨幅过滤**: 过滤掉涨幅小于-1的板块。
  10. **板块评分**:
     - 改进的评分公式：使用 Z-score 标准化和负涨幅惩罚，综合考量资金强度、价格表现、涨停质量和规模效应。
     - 正涨幅时：`score = (avg_weighted_amount_z + 1) * (RATE_z + 1) * (hprice_ratio_z + 1) * (1 + log1p(count))`
     - 负涨幅时：`score = (avg_weighted_amount_z + 1) * max(0.1, RATE_z + 1) * (hprice_ratio_z + 1) * (1 + log1p(count)) * 0.1`
  11. **评分标准化**: 调用 `_standardize_score` 函数，使用 Z-score 标准化评分，降低不同交易日之间的差距。
  12. **动态阈值计算**: 调用 `_calculate_dynamic_threshold` 函数，使用 70% 分位数作为阈值，确保输出数量适中，最多保留15个板块。
  13. **相对评分过滤**: 调用 `_apply_relative_score_filter` 函数，只保留相对评分高于阈值的板块作为主线。
- **输出**:
  - 按评分降序排列的板块 DataFrame，包含 `count`, `amount`, `RATE`, `weighted_amount`, `hcount_total`, `avg_weighted_amount`, `hprice_ratio`, `avg_weighted_amount_z`, `RATE_z`, `hprice_ratio_z`, `score`, `standardized_score`, `relative_score` 等字段。
  - 主线板块为排序靠前的板块，通常取前10个作为主线。

### 3.3 `_process_block_structure` (内部归并逻辑)

- **功能**: 这是两个主线模型共用的私有核心函数，负责将一个已经按 `score` 降序排列的板块 DataFrame 进行结构化处理，识别出主线和支线。
- **算法**:
  - 从评分最高的板块开始，将其定为“主线”。
  - 遍历其余所有板块，如果某板块与当前主线板块的成分股重叠度超过 `60%`，则将其判定为该主线的“支线”，并入当前主线体系。
  - 将已归类的板块（主线和其所有支线）从待处理列表中移除。
  - 从剩余的板块中，继续寻找下一个评分最高的板块作为新的“主线”，重复此过程，直到所有板块都被归类。
  - **注意**: 新版归并逻辑中，`independent_block_list` 的特殊处理已不再使用，所有板块一视同仁参与重叠度计算。
- **输出**: 返回一个元组 `(block_ma, block_mm, block_all)`
  - `block_ma`: 包含所有主线和支线板块名称的列表 (去重)。
  - `block_mm`: 仅包含主线板块名称的列表 (去重)。
  - `block_all`: 一个 DataFrame，包含所有板块的评分、归属的主线索引 (`index_`) 和是否为主线的标记 (`is_main`)。

### 3.4 `GetBlockData` (获取板块数据)

- **功能**: 从通达信获取原始板块数据，为 `blockData` 函数提供基础数据。
- **实现**: 调用 `QA_fetch_stock_block_adv()` 获取通达信板块数据，并进行基础处理。
- **返回**: 包含板块信息的 DataFrame。

### 3.5 `blockData` (板块数据初始化)

- **功能**: 构建并缓存清洗后的板块对应关系表 `DataFrame_BlockList`，使用通达信板块数据作为数据源。
- **关键逻辑**:
  - **数据来源**: 使用 `GetBlockData` 获取的通达信板块数据，包括概念、指数、地区、风格、行业等类型。
  - **剔除噪音风格**: 自动剔除在 `Parameter.py` 中定义的 `style_block_drop` 列表中的标签。
  - **n1name 映射**: 将细分板块映射到更宏观的 `n1name` 维度，建立与一级概念的关联。
  - **数据清洗**: 剔除陈旧概念和无效数据，确保数据质量。
  - **缓存机制**: 将处理后的数据存储到 Redis，供其他函数使用，提高实时计算效率。
- **参数**: `renew` (是否更新 Redis 缓存，默认 True)
- **返回**: 处理后的板块数据 DataFrame，包含 `code`, `type`, `blockname`, `fill_1`, `n1name` 字段。

### 3.6 `blockData_adv` (进阶板块数据初始化)

- **功能**: 初始化并缓存特殊板块数据，如昨日涨停、近期强势等。
- **应用场景**: 主要用于竞价阶段的快速分析，提供市场热点的历史延续性信息。

### 3.6 `getMarketHighStock` (市场高标识别)

- **功能**: 识别市场高标股票，定义为 20日、10日、5日涨幅的前 XX 只股票。
- **应用场景**: 在盘前初始化时调用，为市场情绪分析提供参考。

### 3.7 `stock_concept_hot_list` (概念板块热点列表)

- **功能**: 获取通达信新概念板块数据，数据齐全且每日更新。
- **特点**: 与 `stockblock_` 一致，但更齐全，支持 Redis 缓存。

### 3.8 `re_save_stock_block` (板块数据修订)

- **功能**: 修订数据库中的板块数据，保持概念名称一致。
- **应用场景**: 与 `QA_SU_save_stock_block` 同时使用，确保板块数据的一致性。

### 3.9 `re_save_stock_concept` (概念数据重新保存)

- **功能**: 重新保存概念数据，确保概念名称和分类的一致性。
- **实现步骤**: 调用 `re_save_stock_block`，然后保存通达信概念数据，最后更新数据库中的概念信息。

### 3.10 `GetMainlineDeviation` (主线偏离度分析)

- **功能**: 量化对比实时/竞价主线模型与盘后确认模型的结果差异，监控日内主线背离。
- **输入**:
  - `realtime_result` (GetMainBlockRealTime 的输出结果，即按评分降序排列的板块 DataFrame)
  - `postmarket_result` (GetMainBlockPostMarket 的输出结果，即按评分降序排列的板块 DataFrame)
  - `threshold` (背离阈值，超过此值则报警，默认 0.5)
  - `debug_` (是否输出详细调试信息，默认 False)
- **算法步骤**:
  1.  **提取主线板块**: 从两个模型的输出结果中分别取前10个板块作为主线。
  2.  **计算主线板块重叠度**: 分析竞价主线与盘后主线的重叠情况。
  3.  **计算全部板块重叠度**: 分析竞价识别的所有板块与盘后识别的所有板块的重叠情况。
  4.  **计算排序一致性**: 使用 Spearman 秩相关系数分析板块排名的相关性。
  5.  **综合背离度**: 加权计算综合背离度（主线50% + 全部板块30% + 排序20%）。
  6.  **报警逻辑**: 当综合背离度超过阈值时发出报警。
- **输出**: 返回包含背离度、具体差异和报警信息的字典，包含以下字段：
  - `overall_deviation`: 综合背离度
  - `main_block_deviation`: 主线板块背离度
  - `all_block_deviation`: 全部板块背离度
  - `rank_deviation`: 排序背离度
  - `rank_correlation`: 排序相关性
  - `realtime_main_blocks`: 实时主线板块
  - `postmarket_main_blocks`: 盘后主线板块
  - `realtime_all_blocks`: 实时全部板块
  - `postmarket_all_blocks`: 盘后全部板块
  - `common_main_blocks`: 共同主线板块
  - `common_all_blocks`: 共同全部板块
  - `unique_realtime_main`: 实时独有主线板块
  - `unique_postmarket_main`: 盘后独有主线板块
  - `unique_realtime_all`: 实时独有全部板块
  - `unique_postmarket_all`: 盘后独有全部板块
  - `is_alert`: 是否报警
  - `threshold`: 报警阈值

### 3.11 `analyze_mainline_deviation_demo` (主线偏离度诊断工具)

- **功能**: 一键运行完整的主线偏离度分析流程。
- **输入**:
  - `end_date` (分析日期，默认为今日)
  - `open_` (分析模式：True为今日开盘与昨日收盘的偏离度，False为今日开盘与今日收盘的偏离度，默认 True)
  - `debug_` (是否输出详细调试信息，默认 False)
- **功能**:
  1. 获取指定日期的竞价数据和收盘数据
  2. 分别运行实时主线模型和盘后确认模型
  3. 对比分析两者的偏离度
  4. 输出详细的诊断报告
- **实现特点**:
  - 默认通过CSV文件读取数据，如文件不存在则自动回退到从数据库获取
  - 自动调整日期逻辑，确保数据对应正确
  - 提供详细的日志输出，便于分析和调试
- **输出**: 返回包含完整分析结果的字典。

### 3.12 辅助函数

#### 3.12.1 `_calculate_weight`
- **功能**: 计算股票权重，综合考虑市值分层和模型特定加权
- **参数**:
  - `row`: 股票数据行
  - `res_zb`: 主板市值阈值
  - `res_cy`: 创业板市值阈值
  - `model_type`: 模型类型 ('real_time' 或 'post_market')
- **返回**: 计算后的权重值
- **实现逻辑**:
  - 市值加权: 超大盘 x1.0, 大盘 x1.1, 小盘 x0.9, 微盘 x0.5
  - 实时模型: 一字板涨停 x1.5
  - 盘后模型: 连板加成、一字板加成、涨停时间加成、炸板惩罚

#### 3.12.2 `_calculate_dynamic_threshold`
- **功能**: 动态阈值计算，确保输出数量适中
- **参数**:
  - `group_sb`: 按评分排序的板块DataFrame
  - `max_blocks`: 最大保留板块数量
- **返回**: 过滤后的板块DataFrame

#### 3.12.3 `_apply_relative_score_filter`
- **功能**: relative_score阈值过滤，只保留相对评分高于阈值的板块作为主线
- **参数**:
  - `group_sb`: 按评分排序的板块DataFrame
  - `threshold`: relative_score阈值
  - `top_n`: 前N个板块无论评分如何都保留
- **返回**: 过滤后的板块DataFrame

#### 3.12.4 `_standardize_score`
- **功能**: 评分标准化，降低不同交易日之间的差距
- **参数**:
  - `group_sb`: 板块DataFrame
- **返回**: 标准化后的板块DataFrame

#### 3.12.5 `_validate_input_data`
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

### 4.2 `analyze_market_shizhi_quantile`
- **功能**: 对比全市场、主板、创业板各自的市值分位点分布，为“市值分层加权”算法提供数据支持和合理性验证。
- **业务结论**: 主板与创业板的微盘线存在显著落差（约 2.91 亿），证明了分板块处理的必要性。

### 4.3 `analyze_micro_cap_logic`
- **功能**: 对指定市值阈值以下的微盘股进行深度构成分析，揭示其板块分布、风险特征和行业集中度。
- **业务结论**: 微盘股中主板标的占比较高，且集中于中游制造业，直接否定了“一刀切”剔除微盘股的简单策略，催生了更为精细的“权重惩罚”方案。

---

## 5. 与策略层的交互示例

```python
# 示例1：在竞价逻辑中识别“进攻主线”
from FQMarket.FQUtil.BBlock import GetMainBlockRealTime
# strong_stocks 是通过竞价数据筛选出的强势股 DataFrame
group_sb = GetMainBlockRealTime(strong_stocks)
# 取前10个板块作为主线
main_blocks = group_sb.index.tolist()[:10]
QA_util_log_info(f'竞价主线: {main_blocks}')

# 示例2：在盘后复盘逻辑中确认“市场共识”
from FQMarket.FQUtil.BBlock import GetMainBlockPostMarket
from FQMarket.FQUtil.ToolsGetData import GetStockList

# 获取市场数据
data = GetStockList('2026-03-05', extent_=True, limit_=True)
group_sb = GetMainBlockPostMarket('2026-03-05', data)
# 取前10个板块作为主线
main_blocks = group_sb.index.tolist()[:10]
QA_util_log_info(f'盘后主线: {main_blocks}')

# 示例3：主线偏离度分析
from FQMarket.FQUtil.BBlock import GetMainlineDeviation
# realtime_result 和 postmarket_result 分别是两个模型的输出结果
deviation_report = GetMainlineDeviation(realtime_result, postmarket_result)
QA_util_log_info(f'综合背离度: {deviation_report["overall_deviation"]:.3f}')

# 示例4：获取市场高标股票
from FQMarket.FQUtil.BBlock import getMarketHighStock
high_stocks = getMarketHighStock('2026-03-05', count=20)
QA_util_log_info(f'市场高标: {high_stocks["name"].tolist()}')

# 示例5：初始化板块数据
from FQMarket.FQUtil.BBlock import blockData, blockData_adv
blockData(renew=True)
blockData_adv(renew=True)
QA_util_log_info('板块数据初始化完成')
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
- **GetMainBlockPostMarket 输入**:
  - `end_date`: 交易日期字符串，如 '2026-03-05'。
  - `data`: 包含 `code`, `amount`, `RATE`, `liutongshizhiZ`, `mtype`, `hprice`, `hcount`, `hstop`, `start_` 等字段的 DataFrame。
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

3.  **实时性能优化**: 对于大规模数据处理，可考虑进一步优化 `_process_block_structure` 函数的算法效率，减少时间复杂度。

4.  **多维度主线识别**: 除了基于成交和涨幅的主线识别，可考虑引入更多维度，如资金流向、波动率等，构建更全面的主线识别模型。

5.  **板块轮动分析**: 增加板块轮动分析功能，识别板块之间的转换规律，为策略提供更长期的市场结构洞察。

6.  **智能阈值调整**: 量比和涨幅的阈值目前是固定的，未来可考虑基于市场环境动态调整这些阈值，提高模型的适应性。
