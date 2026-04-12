# DataStruct index 模块

指数数据结构模块，提供指数日线和分钟线数据结构的实现。

## 模块结构

```
index.py
```

---

## IndexDayData

指数日线数据结构。

```python
from FQData.DataStruct import IndexDayData

index_day = IndexDayData(df, dtype='index_day')
```

**继承自：** `QuotationDataStructBase`, `QuotationIndicatorsMixin`, `QuotationOperationsMixin`, `QuotationIOSMixin`

### 初始化参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `data` | pd.DataFrame | - | DataFrame 数据 |
| `dtype` | str | 'index_day' | 数据类型 |
| `if_fq` | str | '' | 复权类型 |

---

## 属性

### 周期属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `week` | IndexDayData | 周线数据 |
| `month` | IndexDayData | 月线数据 |
| `quarter` | IndexDayData | 季线数据 |
| `year` | IndexDayData | 年线数据 |

---

## 方法

### resample

重采样为其他周期。

```python
weekly = index_day.resample('W')
monthly = index_day.resample('M')
quarterly = index_day.resample('Q')
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `level` | str | 目标周期 ('W', 'M', 'Q', 'Y') |

**返回：** IndexDayData

---

## IndexMinData

指数分钟线数据结构。

```python
from FQData.DataStruct import IndexMinData

index_min = IndexMinData(df, dtype='index_min')
```

**继承自：** `QuotationDataStructBase`, `QuotationIndicatorsMixin`, `QuotationOperationsMixin`, `QuotationIOSMixin`

### 初始化参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `data` | pd.DataFrame | - | DataFrame 数据 |
| `dtype` | str | 'index_min' | 数据类型 |
| `if_fq` | str | '' | 复权类型 |

### 数据预处理

自动筛选列：`open`, `high`, `low`, `close`, `volume`, `amount`, `preclose`, `type`

---

## 属性

### 分钟周期属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `min5` | IndexMinData | 5 分钟线 |
| `min15` | IndexMinData | 15 分钟线 |
| `min30` | IndexMinData | 30 分钟线 |
| `min60` | IndexMinData | 60 分钟线 |

---

## 方法

### resample

重采样为其他周期。

```python
min_5 = index_min.resample('5min')
min_15 = index_min.resample('15min')
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `level` | str | 目标周期 ('5min', '15min', '30min', '60min') |

**返回：** IndexMinData

---

### add_funcx

按证券分组应用函数（单索引）。

```python
result = index_min.add_funcx(custom_func, arg1)
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `func` | function | 函数 |

**返回：** 函数执行结果

---

## 使用示例

### 基本使用

```python
from FQData.DataStruct import IndexDayData, IndexMinData

index_day = IndexDayData(df)
print(index_day)

index_min = IndexMinData(min_df)
print(index_min)
```

### 周线/月线

```python
weekly = index_day.week
monthly = index_day.month
quarterly = index_day.quarter
```

### 分钟重采样

```python
min_5 = index_min.min5
min_15 = index_min.min15
min_30 = index_min.min30
min_60 = index_min.min60
```

---

## 相关文档

- [DataStruct README](README.md)
- [DataStruct API](api.md)
- [DataStruct stock](stock.md)