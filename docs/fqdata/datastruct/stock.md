# DataStruct stock 模块

股票数据结构模块，提供股票日线和分钟线数据结构的实现。

## 模块结构

```
stock.py
```

---

## StockDayData

股票日线数据结构。

```python
from FQData.DataStruct import StockDayData

stock_day = StockDayData(df, dtype='stock_day', if_fq='qfq')
```

**继承自：** `QuotationDataStructBase`, `QuotationIndicatorsMixin`, `QuotationOperationsMixin`, `QuotationIOSMixin`

### 常量

| 常量 | 值 | 说明 |
|------|-----|------|
| `_HIGH_LIMIT_MULTIPLIER` | 1.1 | 涨停价倍数 |
| `_LOW_LIMIT_MULTIPLIER` | 0.9 | 跌停价倍数 |
| `_PRICE_PRECISION` | 0.0002 | 价格精度 |
| `_LIMIT_ROUND_DECIMALS` | 2 | 涨跌停取整小数位 |

### 初始化参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `data` | pd.DataFrame | - | DataFrame 数据 |
| `dtype` | str | 'stock_day' | 数据类型 |
| `if_fq` | str | 'bfq' | 复权类型 |

---

## 属性

### 价格属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `high_limit` | pd.Series | 涨停价 |
| `low_limit` | pd.Series | 跌停价 |
| `next_day_high_limit` | pd.Series | 明日涨停价 |
| `next_day_low_limit` | pd.Series | 明日跌停价 |
| `preclose` | pd.Series | 前收价 |
| `price_chg` | pd.Series | 价格涨跌 |

### 周期属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `week` | StockDayData | 周线数据 |
| `month` | StockDayData | 月线数据 |
| `quarter` | StockDayData | 季线数据 |
| `year` | StockDayData | 年线数据 |

---

## 方法

### resample

重采样为其他周期。

```python
weekly = stock_day.resample('W')
monthly = stock_day.resample('M')
quarterly = stock_day.resample('Q')
yearly = stock_day.resample('Y')
```

### to_qfq

前复权转换。

```python
stock_qfq = stock_day.to_qfq()
```

### to_hfq

后复权转换。

```python
stock_hfq = stock_day.to_hfq()
```

### to_liquidity

流通盘处理。

```python
stock_liq = stock_day.to_liquidity()
```

---

## StockMinData

股票分钟线数据结构。

```python
from FQData.DataStruct import StockMinData

stock_min = StockMinData(df, dtype='stock_min', if_fq='bfq')
```

**继承自：** `QuotationDataStructBase`, `QuotationIndicatorsMixin`, `QuotationOperationsMixin`, `QuotationIOSMixin`

### 初始化参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `data` | pd.DataFrame | - | DataFrame 数据 |
| `dtype` | str | 'stock_min' | 数据类型 |
| `if_fq` | str | 'bfq' | 复权类型 |

---

## 分钟周期属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `min5` | StockMinData | 5 分钟线 |
| `min15` | StockMinData | 15 分钟线 |
| `min30` | StockMinData | 30 分钟线 |
| `min60` | StockMinData | 60 分钟线 |

---

## 方法

### resample

重采样为其他周期。

```python
min_5 = stock_min.resample('5min')
min_15 = stock_min.resample('15min')
```

### add_funcx

按证券分组应用函数（单索引）。

```python
result = stock_min.add_funcx(custom_func, arg1, arg2)
```

### to_qfq

前复权转换。

```python
stock_min_qfq = stock_min.to_qfq()
```

### to_hfq

后复权转换。

```python
stock_min_hfq = stock_min.to_hfq()
```

---

## 使用示例

### 创建股票日线

```python
import pandas as pd
from FQData.DataStruct import StockDayData

df = pd.DataFrame({
    'open': [10.0, 10.5, 10.3],
    'high': [10.8, 10.9, 10.7],
    'low': [9.8, 10.2, 10.1],
    'close': [10.5, 10.6, 10.4],
    'volume': [1000000, 1200000, 1100000]
}, index=pd.MultiIndex.from_tuples([
    ('2024-01-01', '600000'),
    ('2024-01-02', '600000'),
    ('2024-01-03', '600000'),
], names=['date', 'code']))

stock_day = StockDayData(df)
print(stock_day)
```

### 获取涨停价

```python
print(f"涨停价: {stock_day.high_limit}")
print(f"跌停价: {stock_day.low_limit}")
```

### 前复权转换

```python
stock_qfq = stock_day.to_qfq()
print(f"复权类型: {stock_qfq.if_fq}")
```

### 获取周线

```python
weekly = stock_day.week
print(weekly)
```

---

## 相关文档

- [DataStruct README](README.md)
- [DataStruct API](api.md)
- [DataStruct _base](_base.md)