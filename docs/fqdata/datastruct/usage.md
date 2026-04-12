# DataStruct 使用指南

## 基本使用

### 创建数据结构

```python
import pandas as pd
from FQData.DataStruct import StockDayData

df = pd.DataFrame({
    'date': pd.date_range('2024-01-01', periods=100),
    'code': '600000',
    'open': 10.0,
    'high': 10.5,
    'low': 9.8,
    'close': 10.2,
    'volume': 1000000
})

stock_day = StockDayData(df)
print(stock_day)
# < StockDayData with 1 securities >
```

### 访问数据

```python
print(f"证券代码: {stock_day.code.tolist()}")
print(f"开盘价: {stock_day.open.head()}")
print(f"收盘价: {stock_day.close.head()}")
print(f"成交量: {stock_day.volume.head()}")
print(f"数据长度: {len(stock_day)}")
```

---

## 数据类型

### 股票数据

```python
from FQData.DataStruct import StockDayData, StockMinData

stock_day = StockDayData(df)

stock_min = StockMinData(min_df)
```

### 指数数据

```python
from FQData.DataStruct import IndexDayData, IndexMinData

index_day = IndexDayData(df)
index_min = IndexMinData(min_df)
```

### 期货数据

```python
from FQData.DataStruct import FutureDayData, FutureMinData

future_day = FutureDayData(df)
future_min = FutureMinData(min_df)
```

### 债券数据

```python
from FQData.DataStruct import Bond2StockDayData, Bond2StockMinData

bond_day = Bond2StockDayData(df)
bond_min = Bond2StockMinData(min_df)
```

---

## 数据操作

### 切片访问

```python
first_10 = stock_day[:10]
last_10 = stock_day[-10:]

subset = stock_day[(stock_day.close > 10) & (stock_day.volume > 1000000)]
```

### 数据合并

```python
combined = stock_day_1 + stock_day_2
```

### 数据相减

```python
result = stock_day_all - stock_day_subset
```

### 反转数据

```python
reversed_data = stock_day.reverse()
```

---

## 数据转换

### 转换为 DataFrame

```python
df = stock_day.to_df()
```

### 转换为列表

```python
data_list = stock_day.to_list()
```

### 转换为字典

```python
data_dict = stock_day.to_dict('index')
```

### 转换为 numpy

```python
np_array = stock_day.to_numpy()
```

---

## 分组与聚合

### 按证券分组

```python
grouped = stock_day.groupby(level=1)

for code, group in grouped:
    print(f"证券代码: {code}, 数据量: {len(group)}")
```

### 应用函数

```python
def calc_return(data):
    return (data.close.iloc[-1] / data.close.iloc[0] - 1) * 100

returns = stock_day.add_func(calc_return)
```

### 滚动计算

```python
rolling_avg = stock_day.groupby(level=1).rolling(5).mean()
```

---

## 指标计算

假设 `stock_day` 是 `StockDayData` 实例：

```python
returns = stock_day.returns()

ma5 = stock_day.ma(5)
ma10 = stock_day.ma(10)
ma20 = stock_day.ma(20)

volatility = stock_day.volatility()
```

---

## 数据拆分

### 按证券拆分

```python
splits = stock_day.splits

for stock in splits:
    print(f"代码: {stock.code[0]}, 长度: {len(stock)}")
```

### 拆分字典

```python
split_dict = stock_day.split_dicts

for code, data in split_dict.items():
    print(f"{code}: {len(data)} 条记录")
```

---

## 生成器

### 面板迭代

```python
for panel in stock_day.panel_gen:
    print(f"日期: {panel.date}")
```

### K 线迭代

```python
for idx, bar in stock_day.bar_gen:
    print(f"时间: {idx}, 收盘价: {bar['close']}")
```

### 证券迭代

```python
for stock in stock_day.security_gen:
    print(f"代码: {stock.code[0]}")
```

---

## 复权处理

### 获取复权因子

```python
from FQData.DataStruct import fetch_stock_adj, fetch_stock_xdxr

adj_data = fetch_stock_adj(code='600000', start='2024-01-01')

xdxr_data = fetch_stock_xdxr(code='600000')
```

### 前复权转换

```python
from FQData.DataStruct import data_stock_to_fq

fq_data = data_stock_to_fq(original_data, adj_data)

stock_day_fq = StockDayData(fq_data, if_fq='qfq')
```

### 后复权转换

```python
from FQData.DataStruct import data_stock_fq_adj

hfq_data = data_stock_fq_adj(original_data, adj_data)

stock_day_hfq = StockDayData(hfq_data, if_fq='hfq')
```

---

## 数据重采样

### Tick 转 1 分钟

```python
from FQData.DataStruct import tick_resample_1min

min_data = tick_resample_1min(tick_data)
```

### 分钟重采样

```python
from FQData.DataStruct import min_resample

data_5min = min_resample(min_data, freq='5min')
data_15min = min_resample(min_data, freq='15min')
data_30min = min_resample(min_data, freq='30min')
data_60min = min_resample(min_data, freq='60min')
```

### 分钟转日线

```python
from FQData.DataStruct import min_to_day

daily_data = min_to_day(min_data)
```

### 日线重采样

```python
from FQData.DataStruct import day_resample

weekly = day_resample(daily, freq='W')
monthly = day_resample(daily, freq='M')
quarterly = day_resample(daily, freq='Q')
yearly = day_resample(daily, freq='Y')
```

### 期货分钟重采样

```python
from FQData.DataStruct import futuremin_resample

resampled = futuremin_resample(future_min, freq='5min')
```

---

## 实时数据

```python
from FQData.DataStruct import StockRealtimeData, FutureRealtimeData

stock_realtime = StockRealtimeData(code='600000')

future_realtime = FutureRealtimeData(code='IF2401')

from FQData.DataStruct import RealtimeSeries

series = RealtimeSeries(codes=['600000', '000001', '000002'])
```

---

## 查询操作

### 数据查询

```python
result = stock_day.query('close > 10')
```

### 查找 Bar

```python
bar = stock_day.find_bar('600000', '2024-01-15')
bar = stock_day.find_bar('600000', '2024-01-15 09:30:00')
```

### 获取字典

```python
data = stock_day.get_dict('2024-01-15', '600000')
```

---

## 流通市值

```python
from FQData.DataStruct import calc_marketvalue, data_marketvalue

mv = calc_marketvalue(data, adj_data)

mv_data = data_marketvalue(code='600000', start='2024-01-01')
```

---

## 多证券数据

```python
df_multi = pd.DataFrame({
    'date': pd.date_range('2024-01-01', periods=100).repeat(3),
    'code': ['600000'] * 100 + ['000001'] * 100 + ['000002'] * 100,
    'open': 10.0,
    'high': 10.5,
    'low': 9.8,
    'close': 10.2,
    'volume': 1000000
})

stock_multi = StockDayData(df_multi)
print(f"证券数量: {len(stock_multi.code)}")
print(f"证券列表: {stock_multi.code.tolist()}")
```

---

## 相关文档

- [README](README.md)
- [API 参考](api.md)
- [最佳实践](best-practices.md)
- [开发指南](development.md)
- [FAQ](faq.md)