# DataStore quotation 查询

行情数据查询模块，提供股票行情、龙虎榜等查询功能。

## 模块结构

```
quotation.py
```

---

## 函数

### query_quotation

查询单只股票的实时行情存储结果。

```python
from FQData.DataStore.query.quotation import query_quotation

data = query_quotation(code='600000', date='2024-01-01')
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `code` | str | - | 股票代码 |
| `date` | date | None | 日期，None 时使用当前日期 |

**返回：** pd.DataFrame - 实时行情数据

**数据字段：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `code` | str | 股票代码 |
| `name` | str | 股票名称 |
| `open` | float | 开盘价 |
| `high` | float | 最高价 |
| `low` | float | 最低价 |
| `close` | float | 收盘价 |
| `volume` | int | 成交量 |
| `amount` | float | 成交额 |
| `datetime` | datetime | 时间 |
| `date` | date | 日期 |

---

### query_quotations

查询全部股票的实时行情存储结果。

```python
from FQData.DataStore.query.quotation import query_quotations

data = query_quotations(date='2024-01-01')
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `date` | date | None | 日期，None 时使用当前日期 |

**返回：** pd.DataFrame - 全部实时行情数据

**数据索引：** (datetime, code) 的 MultiIndex

---

### query_lhb

查询龙虎榜数据。

```python
from FQData.DataStore.query.quotation import query_lhb

data = query_lhb(date='2024-01-01')
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `date` | str | 日期字符串 (YYYY-MM-DD) |

**返回：** pd.DataFrame - 龙虎榜数据

**数据索引：** code

**数据字段：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `code` | str | 股票代码 |
| `name` | str | 股票名称 |
| `close` | float | 收盘价 |
| `pct_change` | float | 涨跌幅 |
| `turnover` | float | 换手率 |
| `amount` | float | 成交额 |
| `reason` | str | 上榜原因 |

---

## 使用示例

### 查询单只股票行情

```python
from FQData.DataStore.query.quotation import query_quotation

data = query_quotation(code='600000')
print(data)
```

### 查询全部行情

```python
from FQData.DataStore.query.quotation import query_quotations

all_data = query_quotations()
print(f"股票数量: {len(all_data.code.unique())}")
```

### 查询龙虎榜

```python
from FQData.DataStore.query.quotation import query_lhb

lhb_data = query_lhb(date='2024-01-15')
print(lhb_data.head())
```

---

## 相关文档

- [query/README](README.md)
- [DataStore 模块](../README.md)