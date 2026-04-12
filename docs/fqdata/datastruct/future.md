# DataStruct future 模块

期货数据结构模块，提供期货日线和分钟线数据结构的实现。

## 模块结构

```
future.py
```

---

## FutureDayData

期货日线数据结构。

```python
from FQData.DataStruct import FutureDayData

future_day = FutureDayData(df, dtype='future_day')
```

**继承自：** `QuotationDataStructBase`, `QuotationIndicatorsMixin`, `QuotationOperationsMixin`, `QuotationIOSMixin`

### 初始化参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `data` | pd.DataFrame | - | DataFrame 数据 |
| `dtype` | str | 'future_day' | 数据类型 |
| `if_fq` | str | '' | 复权类型 |

### 数据预处理

自动筛选列：`open`, `high`, `low`, `close`, `volume`, `position`, `price`, `amount`

---

## 属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `position` | pd.Series | 持仓量 |
| `tradedate` | pd.DatetimeIndex | 交易日期 |
| `tradetime` | pd.DatetimeIndex | 交易时间 |

### 周期属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `week` | FutureDayData | 周线数据 |
| `month` | FutureDayData | 月线数据 |
| `quarter` | FutureDayData | 季线数据 |
| `year` | FutureDayData | 年线数据 |

---

## 方法

### resample

重采样为其他周期。

```python
weekly = future_day.resample('W')
monthly = future_day.resample('M')
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `level` | str | 目标周期 ('W', 'M', 'Q', 'Y') |

**返回：** FutureDayData

---

## FutureMinData

期货分钟线数据结构。

```python
from FQData.DataStruct import FutureMinData

future_min = FutureMinData(df, dtype='future_min')
```

**继承自：** `QuotationDataStructBase`, `QuotationIndicatorsMixin`, `QuotationOperationsMixin`, `QuotationIOSMixin`

### 初始化参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `data` | pd.DataFrame | - | DataFrame 数据 |
| `dtype` | str | 'future_min' | 数据类型 |
| `if_fq` | str | '' | 复权类型 |

### 数据预处理

自动筛选列：`open`, `high`, `low`, `close`, `volume`, `position`, `price`, `tradetime`, `type`

---

## 属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `tradedate` | pd.Series | 交易日期 |
| `tradetime` | pd.Series | 交易时间 |
| `position` | pd.Series | 持仓量 |

### 分钟周期属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `min5` | FutureMinData | 5 分钟线 |
| `min15` | FutureMinData | 15 分钟线 |
| `min30` | FutureMinData | 30 分钟线 |
| `min60` | FutureMinData | 60 分钟线 |

---

## 方法

### resample

重采样为其他周期。

```python
min_5 = future_min.resample('5min')
min_15 = future_min.resample('15min')
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `level` | str | 目标周期 ('5min', '15min', '30min', '60min') |

**返回：** FutureMinData

---

## 使用示例

### 基本使用

```python
from FQData.DataStruct import FutureDayData, FutureMinData

future_day = FutureDayData(df)
print(future_day)

future_min = FutureMinData(min_df)
print(future_min)
```

### 获取持仓量

```python
print(f"持仓量: {future_day.position}")
```

### 周线/月线

```python
weekly = future_day.week
monthly = future_day.month
```

### 分钟重采样

```python
min_5 = future_min.min5
min_15 = future_min.min15
```

---

## 相关文档

- [DataStruct README](README.md)
- [DataStruct API](api.md)
- [DataStruct stock](stock.md)
- [DataStruct resample](resample.md)