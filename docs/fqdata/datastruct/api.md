# DataStruct API 参考

## 核心基类

### QuotationDataStructBase

行情数据结构抽象基类，定义统一的行情数据接口。

```python
from FQData.DataStruct import QuotationDataStructBase

class MyDataStruct(QuotationDataStructBase):
    def resample(self, level):
        pass
```

#### 初始化参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `data` | pd.DataFrame | DataFrame 格式的行情数据 |
| `dtype` | str | 数据类型标识 (如 'stock_day', 'index_min') |
| `if_fq` | str | 复权类型 ('bfq', 'qfq', 'hfq') |
| `market_type` | str | 市场类型 |
| `frequence` | str | 数据频率 |

#### 基本属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `data` | pd.DataFrame | 原始 DataFrame |
| `dtype` | str | 数据类型 |
| `if_fq` | str | 复权类型 |
| `market_type` | str | 市场类型 |
| `frequence` | str | 数据频率 |
| `index` | pd.MultiIndex | 数据索引 |
| `code` | pd.Index | 证券代码列表 |
| `open` | pd.Series | 开盘价 |
| `high` | pd.Series | 最高价 |
| `low` | pd.Series | 最低价 |
| `close` | pd.Series | 收盘价 |
| `volume` | pd.Series | 成交量 |
| `amount` | pd.Series | 成交额 |
| `price` | pd.Series | 均价 (OHLC 平均) |
| `date` | pd.DatetimeIndex | 交易日期 |
| `datetime` | pd.DatetimeIndex | 交易时间 |
| `len` | int | 数据长度 |

#### 核心方法

| 方法 | 返回值 | 说明 |
|------|--------|------|
| `new(data, dtype, if_fq)` | QuotationDataStructBase | 创建新实例 |
| `reverse()` | QuotationDataStructBase | 反转数据 |
| `to_df()` | pd.DataFrame | 转换为 DataFrame |
| `to_list()` | list | 转换为列表 |
| `to_numpy()` | np.ndarray | 转换为 numpy 数组 |
| `to_dict(orient)` | dict | 转换为字典 |
| `validate()` | bool | 验证数据有效性 |
| `is_same(other)` | bool | 判断是否相同类型 |

#### 运算方法

| 方法 | 说明 |
|------|------|
| `__add__(other)` | 合并数据，去重 |
| `__sub__(other)` | 移除 other 中的数据 |
| `__getitem__(key)` | 支持切片访问 |
| `__iter__()` | 行迭代器 |
| `__len__()` | 数据长度 |

#### 分组与聚合

| 方法 | 说明 |
|------|------|
| `groupby(by, level)` | 分组操作 |
| `apply(func, *args)` | 应用函数 |
| `add_func(func, *args)` | 按证券分组应用函数 |
| `agg(func)` | 聚合函数 |
| `rolling(N)` | 滚动计算 |

#### 数据访问

| 方法 | 说明 |
|------|------|
| `iterrows()` | 行迭代器 |
| `items()` | 列迭代器 |
| `itertuples()` | 元组迭代器 |
| `query(context)` | 查询数据 |
| `find_bar(code, time)` | 查找指定时间和代码的 bar |
| `get_dict(time, code)` | 获取指定时间和代码的字典数据 |

#### 生成器属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `panel_gen` | Generator | 面板数据迭代器 |
| `bar_gen` | Generator | K 线迭代器 |
| `security_gen` | Generator | 证券代码迭代器 |
| `splits` | List | 按证券代码拆分列表 |
| `split_dicts` | dict | 拆分为 code:datastruct 字典 |

#### 数据变换

| 方法 | 返回值 | 说明 |
|------|--------|------|
| `abs()` | QuotationDataStructBase | 返回绝对值 |

---

## Mixin 类

### QuotationIndicatorsMixin

统计指标混入类，提供指标计算功能。

```python
from FQData.DataStruct import QuotationIndicatorsMixin

class MyStruct(QuotationIndicatorsMixin):
    pass
```

### QuotationOperationsMixin

数据操作混入类，提供数据操作功能。

```python
from FQData.DataStruct import QuotationOperationsMixin
```

### QuotationIOSMixin

序列化 IO 混入类，提供序列化功能。

```python
from FQData.DataStruct import QuotationIOSMixin
```

---

## 数据结构类

### 股票数据

#### StockDayData

股票日线数据结构。

```python
from FQData.DataStruct import StockDayData

stock_day = StockDayData(df)
stock_day = StockDayData(df, if_fq='qfq')
```

#### StockMinData

股票分钟数据结构。

```python
from FQData.DataStruct import StockMinData

stock_min = StockMinData(df)
stock_min = StockMinData(df, frequence='5min')
```

---

### 指数数据

#### IndexDayData

指数日线数据结构。

```python
from FQData.DataStruct import IndexDayData

index_day = IndexDayData(df)
```

#### IndexMinData

指数分钟数据结构。

```python
from FQData.DataStruct import IndexMinData

index_min = IndexMinData(df)
```

---

### 期货数据

#### FutureDayData

期货日线数据结构。

```python
from FQData.DataStruct import FutureDayData

future_day = FutureDayData(df)
```

#### FutureMinData

期货分钟数据结构。

```python
from FQData.DataStruct import FutureMinData

future_min = FutureMinData(df)
```

---

### 债券数据

#### Bond2StockDayData

可转债日线数据结构。

```python
from FQData.DataStruct import Bond2StockDayData

bond_day = Bond2StockDayData(df)
```

#### Bond2StockMinData

可转债分钟数据结构。

```python
from FQData.DataStruct import Bond2StockMinData

bond_min = Bond2StockMinData(df)
```

---

### 成交明细

#### StockTransactionData

股票成交明细结构。

```python
from FQData.DataStruct import StockTransactionData

tx_data = StockTransactionData(df)
```

#### IndexTransactionData

指数成交明细结构。

```python
from FQData.DataStruct import IndexTransactionData

index_tx = IndexTransactionData(df)
```

---

### 板块数据

#### StockBlockData

股票板块数据结构。

```python
from FQData.DataStruct import StockBlockData

block_data = StockBlockData(df)
```

---

### 财务数据

#### FinancialData

财务数据结构。

```python
from FQData.DataStruct import FinancialData

financial = FinancialData(df)
```

---

### 实时数据

#### StockRealtimeData

股票实时数据结构。

```python
from FQData.DataStruct import StockRealtimeData

realtime = StockRealtimeData(code='600000')
```

#### FutureRealtimeData

期货实时数据结构。

```python
from FQData.DataStruct import FutureRealtimeData

future_realtime = FutureRealtimeData(code='IF2401')
```

#### RealtimeSeries

实时序列数据。

```python
from FQData.DataStruct import RealtimeSeries

series = RealtimeSeries(codes=['600000', '000001'])
```

#### FutureTickData

期货 Tick 数据。

```python
from FQData.DataStruct import FutureTickData

tick = FutureTickData(code='IF2401')
```

---

### 其他数据结构

#### SecurityListData

证券列表数据。

```python
from FQData.DataStruct import SecurityListData

sec_list = SecurityListData(df)
```

#### IndicatorData

指标数据。

```python
from FQData.DataStruct import IndicatorData

indicator = IndicatorData(df)
```

#### SeriesData

序列数据。

```python
from FQData.DataStruct import SeriesData

series = SeriesData(data=[1, 2, 3, 4, 5])
```

---

## 重采样函数

### tick_resample_1min

Tick 数据转 1 分钟线。

```python
from FQData.DataStruct import tick_resample_1min

min_data = tick_resample_1min(tick_data)
```

### tick_resample

Tick 数据重采样。

```python
from FQData.DataStruct import tick_resample

resampled = tick_resample(tick_data, freq='5min')
```

### ctptick_resample

CTP Tick 数据重采样。

```python
from FQData.DataStruct import ctptick_resample

resampled = ctptick_resample(ctp_tick, freq='1min')
```

### min_resample

分钟线重采样。

```python
from FQData.DataStruct import min_resample

data_5min = min_resample(min_data, freq='5min')
data_15min = min_resample(min_data, freq='15min')
data_30min = min_resample(min_data, freq='30min')
data_60min = min_resample(min_data, freq='60min')
```

### stockmin_resample

股票分钟线重采样。

```python
from FQData.DataStruct import stockmin_resample

resampled = stockmin_resample(stock_min, target_freq='5min')
```

### min_to_day

分钟线转日线。

```python
from FQData.DataStruct import min_to_day

daily = min_to_day(min_data)
```

### futuremin_resample

期货分钟线重采样。

```python
from FQData.DataStruct import futuremin_resample

resampled = futuremin_resample(future_min, freq='5min')
```

### futuremin_resample_tb_kq

期货分钟线重采样（通达信格式）。

```python
from FQData.DataStruct import futuremin_resample_tb_kq

resampled = futuremin_resample_tb_kq(future_min)
```

### futuremin_resample_tb_kq2

期货分钟线重采样（通达信格式2）。

```python
from FQData.DataStruct import futuremin_resample_tb_kq2

resampled = futuremin_resample_tb_kq2(future_min)
```

### futuremin_resample_today

期货分钟线重采样（当日数据）。

```python
from FQData.DataStruct import futuremin_resample_today

resampled = futuremin_resample_today(future_min)
```

### futuremin_resample_series

期货分钟线重采样（序列格式）。

```python
from FQData.DataStruct import futuremin_resample_series

resampled = futuremin_resample_series(future_min, freq='5min')
```

### day_resample

日线重采样。

```python
from FQData.DataStruct import day_resample

weekly = day_resample(daily, freq='W')
monthly = day_resample(daily, freq='M')
quarterly = day_resample(daily, freq='Q')
yearly = day_resample(daily, freq='Y')
```

### futureday_resample

期货日线重采样。

```python
from FQData.DataStruct import futureday_resample

resampled = futureday_resample(future_day, freq='W')
```

---

## 复权函数

### fetch_stock_adj

获取复权因子。

```python
from FQData.DataStruct import fetch_stock_adj

adj_data = fetch_stock_adj(code='600000', start='2024-01-01')
```

### fetch_stock_xdxr

获取除权除息数据。

```python
from FQData.DataStruct import fetch_stock_xdxr

xdxr_data = fetch_stock_xdxr(code='600000')
```

### data_stock_to_fq

前复权转换。

```python
from FQData.DataStruct import data_stock_to_fq

fq_data = data_stock_to_fq(original_data, adj_data)
```

### data_stock_fq_adj

后复权转换。

```python
from FQData.DataStruct import data_stock_fq_adj

hfq_data = data_stock_fq_adj(original_data, adj_data)
```

---

## 流通市值

### calc_marketvalue

计算流通市值。

```python
from FQData.DataStruct import calc_marketvalue

mv = calc_marketvalue(data, adj_data)
```

### data_marketvalue

获取流通市值数据。

```python
from FQData.DataStruct import data_marketvalue

mv_data = data_marketvalue(code='600000', start='2024-01-01')
```

---

## 相关文档

- [README](README.md)
- [使用指南](usage.md)
- [最佳实践](best-practices.md)
- [开发指南](development.md)
- [FAQ](faq.md)