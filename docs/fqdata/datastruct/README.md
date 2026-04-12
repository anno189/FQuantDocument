# DataStruct 模块

数据结构抽象层，提供统一的行情数据结构，支持股票、指数、期货、债券等多种数据类型。

## 模块结构

```
DataStruct/
├── base.py              # 核心基类
├── _base.py             # QuotationDataStructBase
├── _indicators.py       # 统计指标 Mixin
├── _operations.py       # 数据操作 Mixin
├── _io.py              # 序列化 IO Mixin
├── stock.py            # 股票数据结构
├── index.py            # 指数数据结构
├── future.py           # 期货数据结构
├── bond.py            # 债券数据结构
├── block.py           # 板块数据结构
├── financial.py        # 财务数据结构
├── transaction.py       # 成交明细结构
├── realtime.py         # 实时数据结构
├── resample.py         # 重采样函数
├── adj.py              # 复权处理
├── indicator.py        # 指标数据
├── series.py           # 序列数据
└── security_list.py    # 证券列表
```

## 核心组件

| 组件 | 说明 |
|------|------|
| `QuotationDataStructBase` | 行情数据结构基类 |
| `QuotationIndicatorsMixin` | 统计指标混入类 |
| `QuotationOperationsMixin` | 数据操作混入类 |
| `QuotationIOSMixin` | 序列化 IO 混入类 |

## 数据类型

### 股票数据

```python
from FQData.DataStruct import StockDayData, StockMinData

# 日线数据
stock_day = StockDayData(df)

# 分钟数据
stock_min = StockMinData(df)
```

### 指数数据

```python
from FQData.DataStruct import IndexDayData, IndexMinData

# 指数日线
index_day = IndexDayData(df)

# 指数分钟
index_min = IndexMinData(df)
```

### 期货数据

```python
from FQData.DataStruct import FutureDayData, FutureMinData

# 期货日线
future_day = FutureDayData(df)

# 期货分钟
future_min = FutureMinData(df)
```

## 复权处理

```python
from FQData.DataStruct import fetch_stock_adj, fetch_stock_xdxr

# 获取复权因子
adj_data = fetch_stock_adj(code='600000', start='2024-01-01')

# 获取除权除息数据
xdxr_data = fetch_stock_xdxr(code='600000')

# 前复权转换
fq_data = data_stock_to_fq(original_data, adj_data)

# 后复权转换
fq_adj_data = data_stock_fq_adj(original_data, adj_data)
```

## 数据重采样

```python
from FQData.DataStruct import (
    tick_resample_1min,
    min_resample,
    min_to_day,
    day_resample
)

# Tick 转 1 分钟
min_data = tick_resample_1min(tick_data)

# 分钟重采样为其他周期
data_5min = min_resample(min_data, freq='5min')
data_15min = min_resample(min_data, freq='15min')

# 分钟转日线
daily_data = min_to_day(min_data)

# 日线重采样
weekly_data = day_resample(daily_data, freq='W')
monthly_data = day_resample(daily_data, freq='M')
```

## 实时数据

```python
from FQData.DataStruct import (
    StockRealtimeData,
    FutureRealtimeData,
    RealtimeSeries
)

# 股票实时数据
realtime = StockRealtimeData(code='600000')

# 实时序列
series = RealtimeSeries(codes=['600000', '000001'])

# 期货 Tick
future_tick = FutureTickData(code='IF2401')
```

## 指标计算

数据结构通过 Mixin 提供指标计算功能：

```python
# 假设 stock_day 是 StockDayData 实例
# 可用指标取决于 QuotationIndicatorsMixin

# 收益率
returns = stock_day.returns()

# 移动平均
ma5 = stock_day.ma(5)
ma10 = stock_day.ma(10)
ma20 = stock_day.ma(20)

# 波动率
volatility = stock_day.volatility()
```

## 序列操作

```python
from FQData.DataStruct import SeriesData

# 创建序列
series = SeriesData(data=[1, 2, 3, 4, 5])

# 切片操作
subset = series[1:3]

# 统计
mean = series.mean()
std = series.std()
```

## 文档索引

### 概览文档

| 文档 | 说明 |
|------|------|
| [README](README.md) | 本文档，模块索引 |
| [API](api.md) | 完整API参考 |
| [使用](usage.md) | 使用指南与示例 |
| [开发指南](development.md) | 开发环境、调试、测试 |
| [最佳实践](best-practices.md) | 开发建议与注意事项 |
| [FAQ](faq.md) | 常见问题解答 |

### 子模块文档

| 文档 | 说明 |
|------|------|
| [_base](_base.md) | 核心基类 QuotationDataStructBase |
| [_indicators](_indicators.md) | 统计指标 Mixin |
| [_operations](_operations.md) | 数据操作 Mixin |
| [_io](_io.md) | 序列化 IO Mixin |
| [stock](stock.md) | 股票数据结构 |
| [index](index.md) | 指数数据结构 |
| [future](future.md) | 期货数据结构 |
| [bond](bond.md) | 可转债数据结构 |
| [block](block.md) | 板块数据结构 |
| [financial](financial.md) | 财务数据结构 |
| [transaction](transaction.md) | 成交明细结构 |
| [realtime](realtime.md) | 实时行情数据结构 |
| [resample](resample.md) | 重采样函数 |
| [adj](adj.md) | 复权因子获取和计算 |
| [indicator](indicator.md) | 技术指标计算 |
| [security_list](security_list.md) | 证券列表结构 |
| [series](series.md) | 序列数据结构 |

## 相关文档

- [FQData 模块](../README.md)
- [DataSource 模块](../datasource/README.md)
- [DataStore 模块](../datastore/README.md)