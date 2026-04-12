# DataStruct bond 模块

可转债数据结构模块，提供可转债转股数据结构的实现。

## 模块结构

```
bond.py
```

---

## Bond2StockDayData

可转债转股日线数据结构。

```python
from FQData.DataStruct import Bond2StockDayData

bond_day = Bond2StockDayData(df, dtype='bond2stock_day')
```

**继承自：** `QuotationDataStructBase`, `QuotationIndicatorsMixin`, `QuotationOperationsMixin`, `QuotationIOSMixin`

### 初始化参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `data` | pd.DataFrame | - | DataFrame 数据 |
| `dtype` | str | 'bond2stock_day' | 数据类型 |
| `if_fq` | str | '' | 复权类型 |

---

## 属性

### 周期属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `week` | Bond2StockDayData | 周线数据 |
| `month` | Bond2StockDayData | 月线数据 |
| `quarter` | Bond2StockDayData | 季线数据 |
| `year` | Bond2StockDayData | 年线数据 |

---

## 方法

### resample

重采样为其他周期。

```python
weekly = bond_day.resample('W')
monthly = bond_day.resample('M')
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `level` | str | 目标周期 ('W', 'M', 'Q', 'Y') |

**返回：** Bond2StockDayData

---

## Bond2StockMinData

可转债转股分钟线数据结构。

```python
from FQData.DataStruct import Bond2StockMinData

bond_min = Bond2StockMinData(df, dtype='bond2stock_min')
```

**继承自：** `QuotationDataStructBase`, `QuotationIndicatorsMixin`, `QuotationOperationsMixin`, `QuotationIOSMixin`

### 初始化参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `data` | pd.DataFrame | - | DataFrame 数据 |
| `dtype` | str | 'bond2stock_min' | 数据类型 |
| `if_fq` | str | '' | 复权类型 |

### 数据预处理

自动筛选列：`open`, `high`, `low`, `close`, `volume`, `amount`, `preclose`, `type`

---

## 属性

### 分钟周期属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `min5` | Bond2StockMinData | 5 分钟线 |
| `min15` | Bond2StockMinData | 15 分钟线 |
| `min30` | Bond2StockMinData | 30 分钟线 |
| `min60` | Bond2StockMinData | 60 分钟线 |

---

## 方法

### resample

重采样为其他周期。

```python
min_5 = bond_min.resample('5min')
min_15 = bond_min.resample('15min')
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `level` | str | 目标周期 ('5min', '15min', '30min', '60min') |

**返回：** Bond2StockMinData

---

### add_funcx

按证券分组应用函数（单索引）。

```python
result = bond_min.add_funcx(custom_func, arg1)
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
from FQData.DataStruct import Bond2StockDayData, Bond2StockMinData

bond_day = Bond2StockDayData(df)
print(bond_day)

bond_min = Bond2StockMinData(min_df)
print(bond_min)
```

### 周线/月线

```python
weekly = bond_day.week
monthly = bond_day.month
```

### 分钟重采样

```python
min_5 = bond_min.min5
min_15 = bond_min.min15
```

---

## 相关文档

- [DataStruct README](README.md)
- [DataStruct API](api.md)
- [DataStruct stock](stock.md)