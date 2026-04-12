# DataStruct series 模块

通用序列数据结构模块，提供带有 MultiIndex 的 Series 数据处理功能。

## 模块结构

```
series.py
```

---

## SeriesData

通用序列数据结构。

```python
from FQData.DataStruct import SeriesData

series_data = SeriesData(series)
```

### 初始化参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `series` | pd.Series | Series 数据，必须有 MultiIndex (datetime, code) 或 DatetimeIndex |

### 数据预处理

- 自动排序索引
- 自动检测 MultiIndex 类型

---

## 属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `series` | pd.Series | 原始 Series |
| `if_multiindex` | bool | 是否 MultiIndex |
| `index` | pd.Index | 数据索引 |
| `code` | List[str] | 股票代码列表（MultiIndex 时） |
| `datetime` | List[pd.Timestamp] | 时间列表（MultiIndex 时） |
| `date` | List | 日期列表 |

---

## 方法

### new

通过 Series 新建一个 SeriesData。

```python
new_series_data = series_data.new(new_series)
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `series` | pd.Series | 新的 Series 数据 |

**返回：** SeriesData - 新实例

---

### select_code

按股票代码筛选。

```python
filtered = series_data.select_code('600000')
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `code` | str | 股票代码 |

**返回：** SeriesData - 筛选后的新实例

---

### select_time

按时间筛选。

```python
filtered = series_data.select_time('2024-01-01')

filtered = series_data.select_time('2024-01-01', '2024-12-31')
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `start` | str | 开始时间 |
| `end` | str | 结束时间，None 时只筛选 start 当天 |

**返回：** SeriesData - 筛选后的新实例

---

### to_series

转换为 Series。

```python
series = series_data.to_series()
```

**返回：** pd.Series

---

### to_dataframe

转换为 DataFrame。

```python
df = series_data.to_dataframe()
```

**返回：** pd.DataFrame

---

## 使用示例

### 基本使用

```python
from FQData.DataStruct import SeriesData

series_data = SeriesData(series)

print(f"是否 MultiIndex: {series_data.if_multiindex}")
print(f"代码列表: {series_data.code}")
print(f"时间列表: {series_data.datetime}")
```

### 筛选操作

```python
# 按代码筛选
stock_series = series_data.select_code('600000')

# 按时间筛选
day_series = series_data.select_time('2024-01-01')

# 按时间范围筛选
range_series = series_data.select_time('2024-01-01', '2024-12-31')
```

### 转换

```python
series = series_data.to_series()

df = series_data.to_dataframe()
```

---

## 相关文档

- [DataStruct README](README.md)
- [DataStruct API](api.md)
- [DataStruct _base](_base.md)