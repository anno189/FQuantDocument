# FQData 模块

金融数据模块，提供数据获取、存储、数据结构等功能。

## 模块结构

```
FQData/
├── DataSource/           # 数据源抽象
│   ├── base.py          # 数据源基类和协议
│   ├── registry.py      # 数据源注册表
│   ├── facade.py        # 数据源统一入口
│   ├── health_check.py  # 健康检查
│   └── adapters/        # 数据源适配器
│       ├── tdx/         # 通达信适配器
│       ├── eastmoney/   # 东方财富适配器
│       ├── efinance/    # efinance 适配器
│       ├── akshare/     # Akshare 适配器
│       ├── ths/         # 同花顺适配器
│       ├── exchange/     # 交易所适配器
│       └── jisilu/      # 集思录适配器
├── DataStore/           # 存储抽象
│   ├── base.py          # 存储基类
│   ├── facade.py        # 存储统一入口
│   ├── mongodb_adapter.py  # MongoDB 适配器
│   ├── connection_pool.py  # 连接池
│   ├── transaction.py   # 事务管理
│   ├── query/           # 数据查询
│   │   ├── stock.py     # 股票查询
│   │   ├── index.py     # 指数查询
│   │   ├── future.py    # 期货查询
│   │   ├── bond.py      # 债券查询
│   │   ├── etf.py       # ETF查询
│   │   ├── financial.py # 财务查询
│   │   ├── quotation.py # 行情查询
│   │   └── _utils.py    # 工具函数
│   └── savers/          # 数据持久化
│       ├── tdx_stock_saver.py     # 股票数据持久化
│       ├── tdx_index_saver.py     # 指数数据持久化
│       ├── tdx_future_saver.py    # 期货数据持久化
│       ├── tdx_bond_saver.py      # 债券数据持久化
│       ├── tdx_option_saver.py    # 期权数据持久化
│       ├── tdx_parallel_saver.py  # 并行数据持久化
│       ├── tdx_financial_saver.py # 财务数据持久化
│       ├── tdx_xdxr_checker.py   # 除权除息检查
│       ├── tdx_concept_saver.py  # 概念数据持久化
│       ├── tdx_industry_saver.py  # 行业数据持久化
│       ├── tdx_index_stocks_saver.py  # 指数成分股持久化
│       ├── province_saver.py      # 省份代码持久化
│       └── tdx_usstock_saver.py  # 美股数据持久化
├── DataStruct/           # 数据结构
│   ├── base.py          # 基础数据类
│   ├── stock.py         # 股票数据
│   ├── index.py         # 指数数据
│   ├── future.py        # 期货数据
│   ├── bond.py          # 债券数据
│   ├── block.py         # 板块数据
│   ├── financial.py      # 财务数据
│   ├── indicator.py      # 指标数据
│   ├── realtime.py      # 实时数据
│   ├── transaction.py    # 分笔数据
│   ├── resample.py       # 数据重采样
│   ├── adj.py           # 复权处理
│   └── security_list.py  # 证券列表
├── Pipeline/            # 任务调度
│   ├── tasks.py         # Celery 定时任务
│   └── scheduler.py      # 调度器
├── Processors/          # 数据处理
│   ├── postmarket/      # 盘后处理
│   │   ├── daily_saver.py      # 日线保存
│   │   └── factor_calculator.py # 因子计算
│   └── realtime/        # 实时处理
│       ├── market_collector.py  # 市场采集
│       ├── emotion_analyzer.py   # 情绪分析
│       └── realtime_saver.py    # 实时保存
└── normalizer.py        # 代码规范化
```

## 核心模块

FQData 采用分层架构，核心模块包括：

| 模块 | 说明 | 文档 |
|------|------|------|
| [DataSource](datasource/README.md) | 数据源模块（通达信、东方财富、同花顺等） | [API](datasource/api.md) |
| [DataStore](datastore/README.md) | 存储模块（MongoDB 适配器、Savers） | [API](datastore/api.md) |
| [DataStruct](datastruct/README.md) | 数据结构模块（股票、指数、期货等） | [API](datastruct/api.md) |
| [Pipeline](pipeline/README.md) | 任务调度模块（Celery 定时任务） | [API](pipeline/api.md) |
| [Processors](processors/README.md) | 数据处理模块（盘后/实时处理） | [API](processors/api.md) |

## 导入

### 直接导入（立即加载）

```python
from FQData import (
    # 数据源
    get_datasource,
    DataSourceMode,
    DataSourceHealthCheck,
    HealthStatus,
    # 存储
    get_datastore,
    DataCategory,
    StorageRegistry,
    TransactionManager,
    Transaction,
    UnitOfWork,
    # 处理器
    BaseProcessor,
    ProcessorResult,
    ProcessorType,
    PostMarketProcessor,
    RealtimeProcessor,
    DailySaver,
    FactorCalculator,
    MarketCollector,
    EmotionAnalyzer,
    RealtimeDataSaver,
    # 流水线
    save_daily,
    calculate_factors,
    analyze_market_realtime,
    analyze_sector_realtime,
)
```

### 延迟导入（Saver 函数）

Saver 函数使用延迟导入避免循环依赖：

```python
from FQData import (
    save_single_stock_day,
    save_stock_day,
    save_stock_xdxr,
    save_single_index_day,
    save_index_day,
    save_single_etf_day,
    save_etf_day,
    save_single_future_day,
    save_future_day,
    save_single_bond_day,
    save_bond_day,
    save_option_commodity_day,
    save_option_50etf_day,
    save_stock_day_parallel,
    save_index_day_parallel,
    save_financial_files,
    check_stock_xdxr,
)
```

## 快速开始

### 数据获取

```python
from FQData import get_datasource

ds = get_datasource()

data = ds.get_stock_day('600000', start='2024-01-01', end='2024-12-31')
```

### 数据存储

```python
from FQData import save_single_stock_day

result = save_single_stock_day('600000', start_date='2024-01-01', end_date='2024-12-31')
```

### 数据查询

```python
from FQData.DataStore.query import query_stock_day, query_stock_min

df = query_stock_day(
    code='600000',
    start_date='2024-01-01',
    end_date='2024-12-31'
)

min_df = query_stock_min(
    code='600000',
    start_date='2024-01-01 09:30:00',
    end_date='2024-01-01 15:00:00',
    frequence='5min'
)
```

## 数据类型

| 类型 | 说明 | 数据源 |
|------|------|--------|
| 股票 | A股（沪深主板、创业板、科创板、北交所） | TDX |
| 指数 | 上证、深证指数 | TDX |
| ETF | 交易型开放式指数基金 | TDX |
| 期货 | 商品期货、金融期货 | TDX |
| 债券 | 国债、企业债、可转债 | TDX |
| 期权 | 50ETF期权、300ETF期权、商品期权 | TDX |
| 港股 | 香港股票 | TDX |
| 美股 | 美国股票 | 待实现 |

## 文档索引

| 文档 | 说明 |
|------|------|
| [README](README.md) | 本文档，模块索引 |
| [DataSource](datasource/README.md) | 数据源模块 |
| [DataStore](datastore/README.md) | 存储模块 |
| [DataStruct](datastruct/README.md) | 数据结构模块 |
| [Pipeline](pipeline/README.md) | 任务调度模块 |
| [Processors](processors/README.md) | 数据处理模块 |
| [API](api.md) | 完整API参考 |
| [使用指南](usage.md) | 使用指南与示例 |
| [最佳实践](best-practices.md) | 开发建议与注意事项 |
| [开发指南](development.md) | 开发环境、调试、测试 |
| [FAQ](faq.md) | 常见问题解答 |

## 相关文档

- [FQBase 文档](../fqbase/README.md) - FQData 依赖的基础模块
- [FQFactor 文档](../fqfactor/README.md) - 因子分析模块
- [DataStruct Mixin 模式分析](datastruct/mixin-analysis.md) - 数据结构模块的架构设计分析
