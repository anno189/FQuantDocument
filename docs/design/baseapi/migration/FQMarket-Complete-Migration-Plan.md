# FQMarket 迁移至 FQuant.Server 完整方案

## 一、迁移概述

### 1.1 源项目结构
- **路径**: `/Users/A.D.189/FQuant/FQuant.Server/_bak/server/FQMarket`
- **版本**: 0.0.0.1
- **Python**: 3.4-3.13

### 1.2 目标项目结构
- **路径**: `/Users/A.D.189/FQuant/FQuant.Server`
- **模块**: FQBase, FQData

### 1.3 迁移模块清单

| 序号 | 源模块 | 文件数 | 目标位置 | 优先级 |
|------|--------|--------|----------|--------|
| 1 | FQUtil/Parameter | 1 | FQBase/FQConfig | P0 |
| 2 | FQUtil/C* (数据类) | 13 | FQData/DataStruct | P0 |
| 3 | FQUtil/ToolsGetData | 1 | FQData/DataSource/adapters | P0 |
| 4 | FQUtil/ToolsSaveData | 1 | FQData/DataStore/savers | P1 |
| 5 | FQUtil/MonitorMarket | 1 | 新建 FQAnalysis | P1 |
| 6 | FQUtil/BBlock | 1 | FQData/DataStruct/block | P1 |
| 7 | AnalysisTools | 10 | 新建 FQAnalysis | P1 |
| 8 | StrategyPools | 60+ | 新建 FQStrategy | P2 |
| 9 | Simulate | 9 | 新建 FQStrategy/simulate | P2 |
| 10 | RealTime | 1 | 新建 FQAnalysis/realtime | P1 |
| 11 | StrategyResearch | 1 | FQStrategy/research | P2 |
| 12 | Tools (ths/db) | 6 | FQData/DataSource/adapters | P1 |

---

## 二、详细迁移计划

### 阶段一：核心数据类迁移 (P0)

#### 2.1 Parameter 模块
**源文件**: `FQMarket/FQUtil/Parameter.py`
**目标**: `FQBase/FQConfig/`

| 源内容 | 目标位置 | 说明 |
|--------|----------|------|
| GLOBALMAP | FQConfig/paths.py | 路径配置 |
| defaultDayTicks | FQConfig/constants.py | 常量定义 |
| get_redis_connection | FQConfig/redis.py | Redis连接 |
| 通知函数 | FQBase/FQNotification | 独立通知模块 |

**已存在兼容层** - Parameter.py 已是转发层

---

#### 2.2 数据类迁移
**源目录**: `FQMarket/FQUtil/`
**目标目录**: `FQData/FQData/DataStruct/`

| 源文件 | 源类 | 目标结构 | 说明 |
|--------|------|----------|------|
| CBaseData.py | CBaseData | DataStruct/_base.py | 基础数据类，继承CFactorData, CExtentData |
| CDataDay.py | CDataDay | DataStruct/_io.py | 日线数据 |
| CDataTick.py | CDataTick | DataStruct/transaction.py | 分时数据 |
| CIndexData.py | CIndexData | DataStruct/index.py | 指数数据 |
| CStockData.py | CStockData | DataStruct/stock.py | 股票数据 |
| CFutureData.py | CFutureData | DataStruct/future.py | 期货数据 |
| CIndustryData.py | CIndustryData | DataStruct/block.py | 行业数据 |
| CConceptData.py | CConceptData | DataStruct/block.py | 概念数据 |
| CFactorData.py | CFactorData | DataStruct/indicator.py | 因子数据 |
| CExtentData.py | CExtentData | DataStruct/resample.py | 扩展数据 |
| CRPSData.py | CRPSData | DataStruct/indicator.py | RPS数据 |
| CBlocks.py | CBlocksData | DataStruct/block.py | 板块数据 |
| CMarket.py | CMarketData | DataStruct/base.py | 市场数据 |

**继承关系映射**:
```
源: CBaseData(CFactorData, CExtentData)
    ├── CIndexData(CBaseData)
    ├── CStockData(CBaseData)
    └── CFutureData(CBaseData)

目标: 使用组合优于继承
    DataStruct/_base.py (基础操作)
    DataStruct/stock.py (股票特有)
    DataStruct/index.py (指数特有)
```

---

### 阶段二：数据获取/存储迁移 (P0-P1)

#### 2.3 ToolsGetData 迁移
**源文件**: `FQMarket/FQUtil/ToolsGetData.py` (2300+行)
**目标**: 拆分为多个adapter

| 源函数 | 目标位置 | 适配器 |
|--------|----------|--------|
| fetch_stock_list_bj | DataSource/adapters/tdx/stock.py | TDX |
| getMarketDataDays | DataSource/adapters/tdx/stock.py | TDX |
| getIndexExtentWeightDays | DataSource/adapters/tdx/index.py | TDX |
| getStockExtentDays | DataSource/adapters/tdx/stock.py | TDX |
| getStrategyPoolsData | DataStruct/block.py | Block模块 |
| calu_limit | DataSource/adapters/tdx/stock.py | TDX |
| getlimitopen | DataSource/adapters/tdx/stock.py | TDX |
| GetStockList | DataSource/facade.py | 门面类 |
| stock_ana_con | 新建 FQAnalysis/market.py | 分析模块 |
| get_open_select_stock_list | 新建 FQAnalysis/market.py | 分析模块 |

---

#### 2.4 ToolsSaveData 迁移
**源文件**: `FQMarket/FQUtil/ToolsSaveData.py`
**目标**: `FQData/DataStore/savers/`

| 源函数 | 目标文件 | 说明 |
|--------|----------|------|
| save_stock_list_bj | tdx_stock_saver.py | 已存在 |
| saveblock | tdx_concept_saver.py | 板块保存 |
| save1600 | tdx_stock_saver.py | 股票日线 |
| save2400 | tdx_index_saver.py | 指数日线 |
| saveBaseInfo | tdx_financial_saver.py | 财务数据 |
| saveFutureDay | tdx_future_saver.py | 期货日线 |
| saveLhbData | tdx_transaction_saver.py | 龙虎榜 |

---

### 阶段三：分析模块迁移 (P1)

#### 2.5 AnalysisTools 迁移
**源目录**: `FQMarket/AnalysisTools/`
**目标目录**: `FQAnalysis/`

| 源文件 | 目标位置 | 功能 |
|--------|----------|------|
| ACheckAll.py | FQAnalysis/market_status.py | 市场状态检测 |
| AIndexData.py | FQAnalysis/index_analysis.py | 宽指分析 |
| AIndustryData.py | FQAnalysis/industry_analysis.py | 行业分析 |
| AMarketData.py | FQAnalysis/market_analysis.py | 市场分析 |
| AMoneryFocus.py | FQAnalysis/fund_flow.py | 资金流向 |
| ACNTYATY.py | FQAnalysis/concept_analysis.py | 概念分析 |
| AConceptData.py | FQAnalysis/concept_analysis.py | 概念数据 |
| AFundOwner.py | FQAnalysis/fund_owner.py | 主力持股 |
| AStockRate.py | FQAnalysis/stock_rate.py | 股票评级 |
| AStrategyData.py | FQStrategy/strategy_data.py | 策略数据 |

---

#### 2.6 MonitorMarket 迁移
**源文件**: `FQMarket/FQUtil/MonitorMarket.py` (2700+行)
**目标**: `FQAnalysis/monitor.py`

| 源函数 | 功能 |
|--------|------|
| analyze_micro_cap_logic | 微盘股分析 |
| analyze_market_shizhi_quantile | 市值分位数 |
| get_market_cap_quantiles | 市值分位 |
| compare_two_datasets | 数据集对比 |
| StatDayLimitStock | 涨停统计 |
| AnalysisOpenStockConcept | 竞价分析 |

---

#### 2.7 RealTime 迁移
**源文件**: `FQMarket/RealTime/CAnalysisRealTime.py`
**目标**: `FQAnalysis/realtime/`

| 源函数 | 功能 |
|--------|------|
| markerRealtime1530 | 15:30复盘 |
| analysisIndex | 指数分析 |
| marketRealtime | 市场实时 |

---

### 阶段四：策略模块迁移 (P2)

#### 2.8 StrategyPools 迁移
**源目录**: `FQMarket/StrategyPools/`
**目标目录**: `FQStrategy/pools/`

| 类型 | 源文件 | 目标位置 |
|------|--------|----------|
| 基础函数 | spStrategyTools.py | FQStrategy/pools/tools.py |
| 策略文件 | sp_str*.py | FQStrategy/pools/strategies/ |
| 选股公式 | p_shortpools.py | FQStrategy/pools/selection.py |
| 量化选股 | bs_*.py | FQStrategy/pools/quant_select.py |

**策略文件列表** (按优先级):
```
P1: sp_str60, sp_kdjvol, sp_pricevol, sp_cfy01, sp_strong
P2: sp_baotuan, sp_breakthrough, sp_emotion, sp_focus, sp_red3days
P3: sp_str10, sp_str20, sp_str30, sp_str120, sp_str250
```

---

#### 2.9 Simulate 迁移
**源目录**: `FQMarket/Simulate/`
**目标目录**: `FQStrategy/simulate/`

| 源文件 | 目标位置 | 功能 |
|--------|----------|------|
| CPoolsBase.py | simulate/base.py | 模拟池基础 |
| CPools_Pools.py | simulate/portfolio.py | 组合管理 |
| CPoolsSimulate.py | simulate/runner.py | 模拟运行 |
| CPools_BuyStra.py | simulate/buy_strategy.py | 买入策略 |
| CPools_SellStra.py | simulate/sell_strategy.py | 卖出策略 |
| CPools_PositionStra.py | simulate/position.py | 仓位管理 |
| CPools_EmptyStra.py | simulate/empty_strategy.py | 空仓策略 |
| CPools_CleanStra.py | simulate/clean_strategy.py | 清理策略 |

---

### 阶段五：工具模块迁移 (P1)

#### 2.10 Tools 迁移
**源目录**: `FQMarket/Tools/`
**目标**: 分布式

| 源文件 | 目标位置 | 说明 |
|--------|----------|------|
| Tools/db.py | FQData/DataStore/mongodb_adapter.py | 已存在 |
| Tools/selenium.py | FQBase/Crawler/browser.py | 浏览器 |
| Tools/tui_data.py | 废弃 | 迁移到新系统 |
| Tools/ths/*.py | FQData/DataSource/adapters/ths/ | 同花顺适配器 |

---

## 三、依赖关系分析

### 3.1 模块依赖图

```
FQMarket.FQUtil.Parameter
         │
         ├── FQBase.FQConfig (目标)
         └── FQBase.FQNotification (目标)

FQMarket.FQUtil.CBaseData
         │
         ├── FQData.DataStruct._base (目标)
         ├── FQData.DataSource.adapters.tdx (目标)
         └── FQData.DataStore (目标)

FQMarket.FQUtil.CMarket
         │
         ├── FQMarket.FQUtil.CStockData
         ├── FQMarket.FQUtil.CIndexData
         └── FQMarket.FQUtil.CFutureData

FQMarket.AnalysisTools.*
         │
         ├── FQMarket.FQUtil.CMarket (核心)
         ├── FQData (数据源)
         └── FQAnalysis (目标)

FQMarket.Simulate.*
         │
         ├── FQMarket.FQUtil (核心)
         ├── FQMarket.StrategyPools (策略)
         └── FQStrategy (目标)

FQMarket.RealTime.CAnalysisRealTime
         │
         ├── FQMarket.FQUtil.CMarket
         ├── FQMarket.AnalysisTools.ACheckAll
         └── FQAnalysis.realtime (目标)
```

---

## 四、迁移优先级与阶段计划

### 4.1 第一阶段：P0 核心 (1-2周)
1. Parameter 模块完全迁移至 FQBase/FQConfig
2. C* 数据类迁移至 FQData/DataStruct
3. ToolsGetData 核心函数适配

**产出**:
- `FQBase/FQConfig/` 完整配置模块
- `FQData/DataStruct/_base.py` 基础数据类
- `FQData/DataSource/adapters/tdx/stock.py` 股票获取

---

### 4.2 第二阶段：P1 数据流 (2-4周)
1. ToolsSaveData 迁移至 FQData/DataStore/savers
2. AnalysisTools 核心分析迁移至 FQAnalysis
3. MonitorMarket 整体迁移
4. RealTime 模块迁移

**产出**:
- `FQData/DataStore/savers/` 完整savers
- `FQAnalysis/` 基础分析模块
- `FQAnalysis/realtime/` 实时分析

---

### 4.3 第三阶段：P2 策略 (4-6周)
1. StrategyPools 完整迁移
2. Simulate 模拟交易系统迁移
3. StrategyResearch 研究模块迁移

**产出**:
- `FQStrategy/pools/` 策略池
- `FQStrategy/simulate/` 模拟交易
- `FQStrategy/research/` 策略研究

---

## 五、迁移检查清单

### 5.1 P0 阶段检查项

| 检查项 | 状态 | 说明 |
|--------|------|------|
| Parameter.py 完全转发至 FQConfig | ✅ | 已存在兼容层 |
| GLOBALMAP 迁移至 FQConfig/paths.py | ⬜ | 待完成 |
| get_redis_connection 迁移至 FQConfig/redis.py | ⬜ | 待完成 |
| CBaseData 迁移至 DataStruct/_base.py | ⬜ | 待完成 |
| CDataDay 迁移至 DataStruct/_io.py | ⬜ | 待完成 |
| CMarket 迁移至 DataStruct/base.py | ⬜ | 待完成 |
| ToolsGetData.GetStockList 迁移至 facade.py | ⬜ | 待完成 |

---

### 5.2 P1 阶段检查项

| 检查项 | 状态 | 说明 |
|--------|------|------|
| ToolsSaveData.save1600 迁移 | ⬜ | |
| ToolsSaveData.saveblock 迁移 | ⬜ | |
| MonitorMarket.analyze_micro_cap_logic 迁移 | ⬜ | |
| ACheckAll 市场状态检测迁移 | ⬜ | |
| AIndexData 宽指分析迁移 | ⬜ | |
| RealTime.CAnalysisRealTime 迁移 | ⬜ | |

---

### 5.3 P2 阶段检查项

| 检查项 | 状态 | 说明 |
|--------|------|------|
| sp_str60 策略迁移 | ⬜ | |
| sp_kdjvol 策略迁移 | ⬜ | |
| CPools_Pools 组合管理迁移 | ⬜ | |
| CPoolsSimulate 模拟运行迁移 | ⬜ | |
| sr_index01 研究模块迁移 | ⬜ | |

---

## 六、数据结构映射

### 6.1 MongoDB Collection 映射

| 源 Collection | 目标 Collection | 说明 |
|---------------|----------------|------|
| market_data_base | stock_day | 股票日线 |
| stock_day | stock_day | (同上) |
| stock_list | security_list | 股票列表 |
| index_day | index_day | 指数日线 |
| future_day | future_day | 期货日线 |
| block_data | block | 板块数据 |
| concept_data | concept | 概念数据 |
| strategy_pools | strategy_pools | 策略池 |
| pools_tradelog | simulate_trade_log | 交易日志 |
| pools_traderecord | simulate_trade_record | 交易记录 |

---

## 七、API 兼容性设计

### 7.1 导入路径兼容

```python
# 新路径 (推荐)
from FQData import DataStruct
from FQData.DataStruct import Stock, Index
from FQAnalysis import MarketAnalyzer

# 旧路径 (兼容)
from FQMarket.FQUtil import CStockData, CMarketData
from FQMarket.AnalysisTools import ACheckAll
```

### 7.2 兼容层设计

```python
# FQMarket/compat.py
import warnings
warnings.warn("FQMarket 已迁移至 FQData/FQAnalysis", DeprecationWarning)

from FQData.DataStruct import Stock, Index, Block
from FQAnalysis import MarketAnalyzer
```

---

## 八、风险与注意事项

### 8.1 已知风险

| 风险项 | 影响 | 缓解措施 |
|--------|------|----------|
| Redis 依赖过重 | 性能 | 迁移至 FQBase/Cache |
| 直接依赖通达信 | 平台限制 | 抽象接口层 |
| Pyecharts 图表依赖 | 可视化 | 迁移至 ECharts |
| MongoDB 直接操作 | 数据一致性 | 使用 ORM 层 |

### 8.2 注意事项

1. **继承层次深**: CBaseData 继承链较长，迁移时需解耦
2. **直接 Redis 访问**: 多处直接使用 `r.get()/r.set()`，需统一到 Cache 层
3. **全局状态**: GLOBALMAP 包含全局状态，需重构为配置中心
4. **冗余数据获取**: 同一数据有多处获取路径，需统一 facade

---

## 九、迁移后目录结构

```
FQuant.Server/
├── FQBase/
│   └── FQBase/
│       ├── FQConfig/          # 配置模块 (原 Parameter)
│       ├── FQNotification/    # 通知模块
│       ├── Cache/             # 缓存层
│       ├── Core/              # 核心组件
│       ├── Crawler/           # 爬虫
│       ├── DataStore/         # 数据存储
│       ├── Date/              # 日期工具
│       ├── Foundation/        # 基础框架
│       └── Util/              # 通用工具
│
├── FQData/
│   └── FQData/
│       ├── DataSource/        # 数据源适配器
│       │   └── adapters/      # tdx, ths, eastmoney, jisilu
│       ├── DataStore/         # 数据存储
│       │   └── savers/        # 各类saver
│       └── DataStruct/        # 数据结构
│
├── FQAnalysis/                 # 新建 - 分析模块
│   ├── __init__.py
│   ├── market_status.py       # 市场状态 (ACheckAll)
│   ├── index_analysis.py      # 宽指分析 (AIndexData)
│   ├── industry_analysis.py   # 行业分析 (AIndustryData)
│   ├── market_analysis.py     # 市场分析 (AMarketData)
│   ├── fund_flow.py           # 资金流向 (AMoneryFocus)
│   ├── concept_analysis.py    # 概念分析
│   ├── realtime/              # 实时分析
│   │   └── analyzer.py
│   └── monitor.py             # 监控 (MonitorMarket)
│
└── FQStrategy/                 # 新建 - 策略模块
    ├── __init__.py
    ├── pools/                 # 策略池
    │   ├── tools.py
    │   └── strategies/        # sp_*.py
    ├── simulate/              # 模拟交易
    │   ├── base.py
    │   ├── portfolio.py
    │   ├── runner.py
    │   └── strategies/
    └── research/              # 策略研究
        └── sr_index01.py
```

---

## 十、总结

FQMarket 迁移是系统性工程，建议分阶段执行：

1. **第一优先级 (P0)**: Parameter + C* 数据类 + 核心ToolsGetData
2. **第二优先级 (P1)**: ToolsSaveData + AnalysisTools + MonitorMarket + RealTime
3. **第三优先级 (P2)**: StrategyPools + Simulate + StrategyResearch

建议建立每日构建机制，每完成一个模块即进行集成测试，确保迁移质量。
