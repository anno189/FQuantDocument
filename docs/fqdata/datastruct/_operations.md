# DataStruct _operations 模块

行情数据操作 Mixin 模块，提供数据选择、切片、重采样等操作。

## 模块结构

```
_operations.py
```

## QuotationOperationsMixin

行情数据操作 Mixin，通过多重继承为数据结构提供各种数据选择和操作方法。

---

## 代码选择

### select_code

按证券代码选择。

```python
selected = data.select_code('600000')
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `code` | str | 证券代码 |

**返回：** QuotationDataStructBase - 新的数据实例

---

## 时间选择

### select_time

按时间范围选择。

```python
selected = data.select_time(start='2024-01-01', end='2024-12-31')

selected = data.select_time(start='2024-01-01')
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `start` | str | 开始时间 |
| `end` | str | 结束时间（可选） |

**返回：** QuotationDataStructBase - 新的数据实例

---

### selects

按证券代码和时间范围选择。

```python
selected = data.selects(code='600000', start='2024-01-01', end='2024-12-31')

selected = data.selects(code='600000', start='2024-01-01')
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `code` | str | 证券代码 |
| `start` | str | 开始时间 |
| `end` | str | 结束时间（可选） |

**返回：** QuotationDataStructBase - 新的数据实例

---

### select_day

选择特定日期（用于分钟线）。

```python
selected = data.select_day('2024-01-01')
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `day` | str | 日期字符串 |

**返回：** QuotationDataStructBase - 新的数据实例

---

### select_month

选择特定月份。

```python
selected = data.select_month('2024-01')
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `month` | str | 月份字符串 |

**返回：** QuotationDataStructBase - 新的数据实例

---

### select_single_time

选择特定时间点。

```python
data_930 = data.select_single_time(hour=9, minute=30)
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `hour` | int | 9 | 小时 |
| `minute` | int | 0 | 分钟 |
| `second` | int | 0 | 秒 |

**返回：** pd.DataFrame - 筛选后的数据

---

### select_time_with_gap

按时间偏移选择数据。

```python
after = data.select_time_with_gap(time='10:30', gap=5, method='gt')

before = data.select_time_with_gap(time='10:30', gap=5, method='lt')
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `time` | str | 基准时间 |
| `gap` | int | 偏移量 |
| `method` | str | 方法 ('gt', 'gte', 'lt', 'lte', 'eq') |

**方法说明：**

| 方法 | 说明 |
|------|------|
| `gt` / `>` | 选择基准时间之后的数据 |
| `gte` / `>=` | 选择基准时间及之后的数据 |
| `lt` / `<` | 选择基准时间之前的数据 |
| `lte` / `<=` | 选择基准时间及之前的数据 |
| `eq` / `==` | 选择基准时间的数据 |

**返回：** QuotationDataStructBase - 选择后的数据结构

---

## 列选择

### select_columns

选择特定列。

```python
prices = data.select_columns(['open', 'high', 'low', 'close'])

close = data.select_columns('close')
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `columns` | str/List[str] | 列名或列名列表 |

**返回：** 选择的列数据

---

## 头部和尾部

### head

返回前 n 条数据。

```python
first_10 = data.head(10)
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `n` | int | 5 | 数量 |

**返回：** QuotationDataStructBase - 新的数据实例

---

### tail

返回后 n 条数据。

```python
last_10 = data.tail(10)
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `n` | int | 5 | 数量 |

**返回：** QuotationDataStructBase - 新的数据实例

---

## 单条数据

### get_bar

获取单个 bar 数据。

```python
bar = data.get_bar(code='600000', time='2024-01-01')
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `code` | str | 证券代码 |
| `time` | str | 时间 |

**返回：** pd.Series - bar 数据

---

## 索引操作

### reindex

重新索引。

```python
reindexed = data.reindex(new_index)
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `ind` | pd.MultiIndex | 新的 MultiIndex |

**返回：** QuotationDataStructBase - 重新索引后的数据结构

---

### reindex_time

按时间重新索引。

```python
reindexed = data.reindex_time(datetime_index)
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `ind` | pd.DatetimeIndex | DatetimeIndex |

**返回：** QuotationDataStructBase - 重新索引后的数据结构

---

## 数据透视

### pivot

数据透视表。

```python
pivot_table = data.pivot('close')

pivot_table = data.pivot(['open', 'close'])
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `column_` | str/List[str] | 要透视的列名 |

**返回：** pd.DataFrame - 透视后的 DataFrame

---

## 使用示例

### 基本选择

```python
from FQData.DataStruct import StockDayData

# 假设 stock 是 StockDayData 实例

# 按代码选择
selected = stock.select_code('600000')

# 按时间范围选择
selected = stock.select_time(start='2024-01-01', end='2024-06-30')

# 按代码和时间选择
selected = stock.selects(code='600000', start='2024-01-01', end='2024-06-30')
```

### 时间序列操作

```python
# 选择特定日期（分钟线）
day_data = stock.select_day('2024-01-01')

# 选择特定月份
month_data = stock.select_month('2024-01')

# 选择特定时间点（如收盘时间 15:00）
closing_data = stock.select_single_time(hour=15, minute=0)
```

### 时间偏移选择

```python
# 选择 10:30 之后的数据
after_1030 = stock.select_time_with_gap(time='10:30', gap=10, method='gt')

# 选择 10:30 之前的数据
before_1030 = stock.select_time_with_gap(time='10:30', gap=10, method='lt')
```

### 数据透视

```python
# 收盘价透视表
pivot_close = stock.pivot('close')

# 多列透视
pivot_prices = stock.pivot(['open', 'high', 'low', 'close'])
```

### 头部和尾部

```python
# 最近 5 个交易日
recent = stock.tail(5)

# 最早 10 个交易日
oldest = stock.head(10)
```

---

## 相关文档

- [DataStruct README](README.md)
- [DataStruct API](api.md)
- [DataStruct _base](_base.md)