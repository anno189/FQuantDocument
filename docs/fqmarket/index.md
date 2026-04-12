---
title: FQMarket 市场层
---

# FQMarket 市场层

FQMarket 是市场分析的核心模块，包含策略系统、回测引擎、实时分析功能。

## 目录结构

```
FQMarket/FQMarket/
├── FQUtil/                          # 工具模块
│   ├── BBlock.py                   # 板块与主线分析
│   ├── CBaseData.py                # 基础数据类
│   ├── CConceptData.py             # 概念数据
│   ├── CDataDay.py                 # 日线数据
│   ├── CDataTick.py                # 分笔数据
│   ├── CExtentData.py              # 扩展数据
│   ├── CFactorData.py              # 因子数据
│   ├── CFutureData.py              # 期货数据
│   ├── CIndexData.py               # 指数数据
│   ├── CIndustryData.py            # 行业数据
│   ├── CMarket.py                  # 市场数据
│   ├── CRPSData.py                 # RPS数据
│   ├── CStockData.py               # 股票数据
│   ├── MonitorMarket.py            # 市场监控
│   ├── Parameter.py                # 参数配置
│   ├── Tools.py                    # 工具函数
│   ├── ToolsCRCData.py             # CRC数据校验
│   ├── ToolsCheckData.py           # 数据检查
│   ├── ToolsDBData.py              # 数据库工具
│   ├── ToolsGMI.py                 # GMI指标
│   ├── ToolsGetData.py             # 数据获取
│   ├── ToolsGetWebNews.py          # 网页新闻
│   ├── ToolsJianGuan.py            # 监管数据
│   ├── ToolsLhbData.py             # 龙虎榜数据
│   ├── ToolsRedisData.py           # Redis缓存
│   ├── ToolsSaveAkshare.py         # AkShare保存
│   ├── ToolsSaveData.py            # 数据保存
│   ├── ToolsSaveLocalData.py       # 本地数据保存
│   └── ToolsStrategyPools.py       # 策略池工具
│
├── StrategyPools/                    # 策略池 (55+策略)
│   ├── sp_*.py                     # 强势股/连板/量价策略
│   ├── bs_*.py                     # 买入策略
│   └── p_*.py                      # 其他策略
│
├── Simulate/                        # 回测系统
│   ├── CPoolsBase.py              # 基础类
│   ├── CPoolsSimulate.py           # 核心回测引擎
│   ├── CPools_Pools.py            # 股票池
│   ├── CPools_BuyStra.py          # 买入策略
│   ├── CPools_SellStra.py         # 卖出策略
│   ├── CPools_EmptyStra.py        # 空仓策略
│   ├── CPools_CleanStra.py        # 清仓策略
│   └── CPools_PositionStra.py     # 仓位管理
│
└── RealTime/                        # 实时分析
    └── CAnalysisRealTime.py        # 实时分析
```

## 核心功能

### 策略系统 StrategyPools

包含55+策略文件，分为以下类别：

| 类型 | 数量 | 示例 |
|-----|------|------|
| **强势股策略** | 15+ | sp_strong.py, sp_strong_con.py, sp_strong_long.py |
| **量价策略** | 10+ | sp_pricevol.py, sp_pricevol60.py, sp_kdjvol.py |
| **连板策略** | 8+ | sp_strdays_all.py, sp_strdays_con.py, sp_strdays_ins.py |
| **相关性策略** | 6+ | sp_corr.py, sp_spcorr.py, sp_strindcorrcon.py |
| **买入策略** | 4+ | bs_00000130.py, bs_00000160.py, bs_cfy01.py |

### 回测系统 Simulate

详细文档请参考：[Simulate 模块文档索引](/design/simulate/)

**基本使用**：

```python
from FQMarket.Simulate.CPoolsSimulate import CPoolsSimulate

sim = CPoolsSimulate(
    code=['strong', 'backtest_001'],
    position_stra=['default_funds'],
    buy_stra=['buy_stra_base', [['open', 0, 5]]],
    sell_stra=['sell_stra_base', [0.05], [-0.06], [5]],
    empty_stra=None,
    clean_stra=['clean_no_code', None],
    pools_stra=None
)

sim.calunetvalue(
    start_date='2023-01-01',
    end_date='2023-12-31',
    renew=True
)
```

### 市场工具 FQUtil

提供市场数据分析的各类工具：

```python
from FQMarket.FQUtil import (
    BBlock, MonitorMarket,
    ToolsGetData, ToolsLhbData,
    CMarket, CStockData,
)

# 板块与主线分析
bblock = BBlock()
main_blocks = bblock.get_main_block(date)

# 市场监控
monitor = MonitorMarket()
status = monitor.get_market_status()
```

### 实时分析 RealTime

```python
from FQMarket.RealTime.CAnalysisRealTime import CAnalysisRealTime

analyzer = CAnalysisRealTime()
result = analyzer.analyze(code)
```

## 策略配置

### 买入策略

```python
# 开盘价买入，允许涨停和超跌买入，允许ETF买入
buy_stra = ['buy_stra_base', [['open', 0., True, True, True]]]

# 收盘价买入
buy_stra = ['buy_stra_base', [['close', -0.01, False, True, False]]]
```

### 卖出策略

```python
# 止盈5%，止损6%，持仓5天
sell_stra = ['sell_stra_base', [0.05], [-0.06], [5]]

# 开盘卖出策略
sell_stra = ['sell_stra_opensell', [-0.06, 1]]
```

### 空仓策略

```python
# 默认不空仓
empty_stra = [['empty_no_code']]

# 基本空仓策略
empty_stra = [['empty_stra_base', -0.0159]]
```

### 仓位管理

```python
# 默认仓位管理
position_stra = ['default_funds']

# 私募轮动仓位管理
position_stra = ['private_funds']

# 自定义仓位管理
position_stra = ['custom_funds', 50000, 500000, 10, True]
```

## 子模块文档

- [回测系统 Simulate](/design/simulate/) - 完整的回测引擎文档
- [BBlock 板块分析](/design/baseapi/module-bblock) - 板块与主线识别
- [MonitorMarket 市场监控](/design/baseapi/module-monitormarket) - 实时市场监控