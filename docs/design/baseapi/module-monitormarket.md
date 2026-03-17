# 市场监控工具：MonitorMarket.py

`MonitorMarket.py` 是 FQuant 后端的市场监控工具模块，提供了一系列用于分析市场结构、监控主线偏离度以及诊断市场状态的功能。它集成了 BBlock 模块的核心算法，为策略层提供更高级的市场分析能力。

## 1. 核心功能

- **市场状态分析**：综合判断市场状态（静态+动态），识别市场趋势变化。
- **主线偏离度分析**：量化对比实时/竞价主线模型与盘后确认模型的结果差异，监控日内主线背离。
- **市值分位点诊断**：分析全市场及各板块的市值分位点分布，验证市值分层加权算法的效果。
- **微盘股构成分析**：对微盘股的板块分布、风险特征和行业集中度进行深度分析。

## 2. 核心函数解析

### 2.1 `analyze_market_status`

- **功能**：综合分析市场状态，返回静态和动态状态判断结果。
- **参数**：
  - `block_data_main`：多头核心板块数据。
  - `block_data_market`：市场外围板块数据。
  - `block_data_pm`：盘后确认板块数据。
  - `debug_`：是否输出详细调试信息，默认 False。
  - `limit_up_threshold`：涨停数量过滤阈值，默认 0。
  - `end_date`：分析日期。
  - `stock_data_main`：多头竞价股票数据。
- **算法步骤**：
  1. 调用 `compare_two_datasets` 进行三组数据比较。
  2. 加载历史市场状态数据。
  3. 调用 `analyze_main_trend` 进行综合分析。
  4. 保存市场状态数据到 CSV 文件。
- **返回值**：包含综合分析结果的字典。

### 2.2 `compare_two_datasets`

- **功能**：比较两个板块数据集，计算主线偏离度。
- **参数**：
  - `block_data1`：第一个板块数据集。
  - `block_data2`：第二个板块数据集。
  - `type_`：比较类型。
  - `debug_`：是否输出详细调试信息。
  - `limit_up_stats`：涨停统计信息。
  - `limit_up_threshold`：涨停数量过滤阈值。
  - `end_date`：分析日期。
- **返回值**：包含比较结果的字典。

### 2.3 `determine_market_status`

- **功能**：综合判断市场状态（静态 + 动态）。
- **参数**：
  - `classification_result`：板块分类结果。
  - `common_main_ratio`：共同主线板块占比。
  - `main_vs_pm_ratio`：main_vs_pm 多头核心比例。
  - `market_vs_pm_ratio`：market_vs_pm 多头核心比例。
  - `common_main_count`：共同主线板块数量。
  - `history_data`：历史数据列表。
- **状态类型**：
  - **静态状态**：强势一致、强势分歧、轮动上涨、高低切换、弱势震荡、混沌
  - **动态状态**：强势加速、强势退潮、修复中、加速下跌
- **返回值**：包含状态、置信度、状态类型的字典。

### 2.4 `load_market_status_history`

- **功能**：读取历史市场状态数据。
- **参数**：
  - `end_date`：结束日期。
  - `days`：读取天数，默认 5。
- **返回值**：历史数据字典，按日期倒序排列，包含：
  - `date`：日期
  - `indicators`：指标数据
  - `main_blocks`：主线板块列表
  - `divergence_blocks`：分歧板块列表
  - `risk_blocks`：风险板块列表
  - `reversal_blocks`：反转板块列表
  - `block_scores`：板块评分字典

### 2.5 `save_market_status_to_csv`

- **功能**：保存市场状态数据到 CSV 文件。
- **参数**：
  - `end_date`：结束日期。
  - `save_data`：保存数据字典。
- **存储路径**：`/data/market_status/market_status_YYYY-MM-DD.csv`

### 2.6 `analyze_main_trend`

- **功能**：分析竞价多头核心/市场外围状态及整体趋势。
- **参数**：
  - `result_main_market`：main vs market 比较结果。
  - `result_main_pm`：main vs pm 比较结果。
  - `result_market_pm`：market vs pm 比较结果。
  - `history_data`：历史数据列表。
  - `limit_up_threshold`：涨停数量过滤阈值。
  - `score_diff_threshold`：score_diff 阈值。
  - `stock_data_main`：多头竞价股票数据。
- **返回值**：包含每日状态判断和整体趋势分析的结果。

### 2.7 `analyze_micro_cap_logic`

- **功能**：分析微盘股构成的统计逻辑。
- **参数**：
  - `threshold`：市值阈值（亿元），默认 23.38。
- **算法步骤**：
  1. 获取全市场数据（包含真实的 liutongshizhiZ）。
  2. 筛选市值低于阈值的微盘股。
  3. 统计微盘股的板块分布（mtype）。
  4. 统计微盘股中的风险警示（ST）数量。
  5. 检查数据异常情况。
  6. 分析微盘股的行业集中度（Top 10）。
- **输出**：详细的微盘股构成分析日志。

### 2.8 `analyze_market_shizhi_quantile`

- **功能**：诊断工具，分析全市场及各板块的市值分位点分布。
- **算法步骤**：
  1. 测试全市场的市值分位点分布。
  2. 测试仅主板（ZB）的市值分位点分布。
  3. 测试仅创业板（CY）的市值分位点分布。
  4. 分析主板与创业板的微盘线差异。
- **输出**：详细的市值分位点分析日志。

### 2.9 `get_market_cap_quantiles`

- **功能**：获取全市场和各板块的市值分位数。
- **参数**：
  - `end_date`：结束日期，默认为当天。
  - `debug_`：是否输出详细调试信息，默认为 False。
- **返回值**：包含全市场和各板块市值分位数数据的字典。

### 2.10 `get_market_operation_advice`

- **功能**：根据市场状态返回操作建议。
- **参数**：
  - `status`：市场状态。
  - `confidence`：置信度。
  - `common_main_blocks`：共同主线板块列表。
  - `strong_main_blocks`：强势主线板块列表。
  - `potential_main_blocks`：潜力主线板块列表。
  - `weak_blocks`：弱势板块列表。
- **返回值**：包含仓位建议、操作策略、风险提示、关注板块的字典。
- **操作建议配置**：

| 状态 | 仓位范围 | 操作策略 | 风险提示 |
|------|----------|----------|----------|
| 强势一致 | 70-90% | 积极做多，持有主线板块龙头股 | 追高风险，注意分歧信号 |
| 强势分歧 | 50-70% | 轻仓试错，关注分歧后的方向选择 | 分歧可能转为一致或退潮 |
| 轮动上涨 | 50-70% | 板块轮动操作，快进快出 | 轮动过快容易踏空 |
| 高低切换 | 40-60% | 高抛低吸，规避高位股 | 切换失败可能导致亏损 |
| 弱势震荡 | 20-40% | 轻仓观望，等待企稳信号 | 市场方向不明，容易反复 |
| 混沌 | 0-20% | 空仓观望，等待明确信号 | 无主线方向，操作难度大 |
| 强势加速 | 80-100% | 重仓跟进，加仓主线板块 | 加速后可能面临回调 |
| 强势退潮 | 30-50% | 减仓止盈，规避高位股 | 退潮可能加速下跌 |
| 修复中 | 40-60% | 轻仓布局，关注修复力度 | 修复可能失败 |
| 加速下跌 | 0-20% | 空仓观望，等待企稳 | 下跌可能持续 |

### 2.11 `debug_market_status_20days`

- **功能**：运行20日市场状态分析调试函数，回溯历史数据进行批量分析。
- **参数**：
  - `end_date`：结束日期，默认为 '2026-03-13'。
  - `days`：回溯天数，默认 20。
- **输出**：生成调试报告日志文件 `market_status_debug_{end_date}.log`

## 3. 板块评分与分类

### 3.1 评分权重

| 分类 | 权重 | 说明 |
|------|------|------|
| strong（强势主线） | 3 | 多头强于市场 |
| potential（潜力主线） | 2 | 有切换潜力 |
| reversal（反转主线） | 1 | 有反转可能 |
| weak_main（弱势主线） | 0 | 弱势但不是最差 |
| outlier（分歧预期） | -2 | 存在分歧 |
| weak（弱势板块） | -3 | 存在风险 |

### 3.2 板块分类条件

| 板块类型 | 条件 |
|---------|------|
| 🟢 主线板块 | score >= 6 |
| 🔴 分歧板块 | score == -6 |
| ⚠️ 风险板块 | score <= -6 且有 weak 标记 |

## 4. 市场状态判断逻辑

### 4.1 静态状态

| 状态 | 条件 |
|------|------|
| 强势一致 | 共同主线数量 >= 5 且占比 >= 30% |
| 强势分歧 | 强势主线多 + 分歧预期板块多 + 有共同主线 |
| 轮动上涨 | 反转主线 + 潜力主线占比高 |
| 高低切换 | 潜力主线占比高 + 强势主线占比下降 + 有共同主线 |
| 弱势震荡 | 弱势板块占比高 + 市场整体弱势 |
| 混沌 | 无明确主导 + 共同主线占比低 + 共同主线数量少 |

### 4.2 动态状态

| 状态 | 条件 |
|------|------|
| 强势加速 | 强势主线占比上升 + 共同主线增加 + 有共同主线 |
| 强势退潮 | 强势主线占比下降 + 弱势板块占比上升 + 有共同主线 |
| 修复中 | 从弱势恢复 + 有共同主线 |
| 加速下跌 | 弱势板块占比上升 + 共同主线减少 |

### 4.3 状态优先级

- 动态状态得分 >= 1 时，优先选择动态状态
- 否则选择静态状态

## 5. 与其他模块的交互

- **BBlock 模块**：调用 `GetMainBlockRealTime`、`GetMainBlockPostMarket` 和 `GetMainlineDeviation` 函数进行主线识别和偏离度分析。
- **ToolsGetData 模块**：调用 `GetStockList`、`get_stock_open_data` 和 `getmarketshizhiquantile` 函数获取市场数据和市值分位点。
- **ToolsDBData 模块**：调用 `getDayData`、`getDaysDatas` 和 `getliutongshizhiZ` 函数获取数据库数据。

## 6. 应用示例

```python
# 示例1：分析市场状态
from FQMarket.FQUtil.MonitorMarket import analyze_market_status
from FQMarket.FQUtil.BBlock import GetMainBlockRealTime, GetMainBlockPostMarket
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

# 查看结果
print(f"市场状态: {result['comprehensive_analysis']['market_status']['status']}")
print(f"置信度: {result['comprehensive_analysis']['market_status']['confidence']:.0%}")
print(f"状态类型: {result['comprehensive_analysis']['market_status']['status_type']}")

# 查看板块分类
main_div = result['comprehensive_analysis'].get('main_divergence', {})
print(f"主线板块: {main_div.get('main', [])}")
print(f"分歧板块: {main_div.get('divergence', [])}")
print(f"风险板块: {main_div.get('risk', [])}")
print(f"板块评分: {main_div.get('scores', {})}")

# 查看操作建议
advice = result['comprehensive_analysis']['operation_advice']
print(f"建议仓位: {advice['position_advice']}")
print(f"操作策略: {advice['strategy']}")
print(f"风险提示: {advice['risk_warning']}")
print(f"关注板块: {advice['focus_blocks']}")

# 示例2：独立调用操作建议函数
from FQMarket.FQUtil.MonitorMarket import get_market_operation_advice

advice = get_market_operation_advice(
    status="强势一致",
    confidence=0.8,
    common_main_blocks=["储能", "光伏", "风电"],
    strong_main_blocks=["储能", "光伏", "风电", "锂电池", "新能源汽车"]
)
print(f"建议仓位: {advice['position_advice']}")
print(f"关注板块: {advice['focus_blocks']}")

# 示例3：分析微盘股构成
from FQMarket.FQUtil.MonitorMarket import analyze_micro_cap_logic
analyze_micro_cap_logic(threshold=23.38)

# 示例4：分析市值分位点
from FQMarket.FQUtil.MonitorMarket import analyze_market_shizhi_quantile
analyze_market_shizhi_quantile()

# 示例5：获取全市场和各板块的市值分位数
from FQMarket.FQUtil.MonitorMarket import get_market_cap_quantiles
quantiles_data = get_market_cap_quantiles(end_date='2024-01-31', debug_=True)

# 示例6：20日市场状态回测分析
from FQMarket.FQUtil.MonitorMarket import debug_market_status_20days
log_file = debug_market_status_20days(end_date='2026-03-13', days=20)
```

## 7. 数据存储

### CSV 文件格式

市场状态数据保存在 `/data/market_status/market_status_YYYY-MM-DD.csv`，包含以下字段：

| 字段 | 说明 |
|------|------|
| date | 日期 |
| type | 数据类型（comparison/main_block/divergence_block/risk_block/reversal_block/indicators） |
| comparison_type | 比较类型 |
| main_count | 主线数量 |
| other_count | 其他数量 |
| block_name | 板块名称 |
| block_type | 板块类型（main/divergence/risk/reversal） |
| block_score | 板块评分 |
| strong_main_ratio | 强势主线占比 |
| potential_main_ratio | 潜力主线占比 |
| reversal_main_ratio | 反转主线占比 |
| weak_main_ratio | 弱势主线占比 |
| weak_blocks_ratio | 弱势板块占比 |
| common_main_count | 共同主线数量 |
| common_main_ratio | 共同主线占比 |
| outlier_ratio | 分歧预期比例 |
| market_status | 市场状态 |
| status_confidence | 状态置信度 |
| status_type | 状态类型（static/dynamic） |

## 8. 返回值结构

`analyze_market_status` 函数返回的 `comprehensive_analysis` 包含以下字段：

```python
{
    "daily_status": {...},           # 每日状态
    "trend_analysis": {...},        # 趋势分析
    "reversal_blocks": [...],       # 反转板块
    "block_stats": {...},           # 板块统计
    "classification_result": {...},  # 分类结果
    "market_status": {...},         # 市场状态
    "common_main": [...],           # 共同主线板块列表
    "main_divergence": {            # 板块分类（含评分）
        "main": [...],              # 主线板块
        "divergence": [...],        # 分歧板块
        "risk": [...],              # 风险板块
        "scores": {...},            # 板块评分
        "classifications": {...}    # 分类详情
    },
    "history_indicators": {...},     # 历史指标
    "operation_advice": {...}        # 操作建议
}
```

## 9. 未来优化方向

1. **实时监控**：增加实时监控功能，在盘中实时跟踪主线变化。
2. **历史数据分析**：增加历史主线偏离度数据的分析功能，识别市场模式。
3. **可视化输出**：增加可视化输出功能，提供更直观的分析结果展示。
4. **多维度分析**：增加更多维度的市场分析，如行业轮动，资金流向等。
