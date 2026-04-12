# 行情数据查询

提供股票行情、龙虎榜等查询功能。

## 模块路径

```
FQData.DataStore.query.quotation
```

## 导入

```python
from FQData.DataStore.query import (
    query_quotation,
    query_quotations,
    query_lhb,
)
```

## query_quotation

```python
def query_quotation(code: str, date: date = None) -> pd.DataFrame
```

查询实时行情存储结果。

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| code | str | 股票代码 |
| date | date | 日期，默认为当天 |

**返回：** 实时行情数据

---

## query_quotations

```python
def query_quotations(date: date = None) -> pd.DataFrame
```

查询全部实时行情存储结果。

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| date | date | 日期，默认为当天 |

**返回：** 全部实时行情数据

---

## query_lhb

```python
def query_lhb(date: str) -> pd.DataFrame
```

查询龙虎榜数据。

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| date | str | 日期 |

**返回：** 龙虎榜数据

---

## 相关文档

- [Query 模块 README](./README.md)
- [股票查询](./stock.md)
