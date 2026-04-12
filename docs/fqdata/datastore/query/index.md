# 指数查询

提供指数日线、分钟线、列表、成分股等数据查询功能。

## 模块路径

```
FQData.DataStore.query.index
```

## 导入

```python
from FQData.DataStore.query import (
    query_index_day,
    query_index_min,
    query_index_transaction,
    query_index_list,
    query_index_name,
    query_index_stocks,
    query_trade_date,
)
```

## query_index_day

```python
def query_index_day(
    code: Union[str, List[str]],
    start_date: str,
    end_date: str,
    format: str = 'pd'
) -> Union[pd.DataFrame, np.ndarray, List, Dict]
```

查询指数日线数据。

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| code | str/List[str] | 指数代码 |
| start_date | str | 开始日期 |
| end_date | str | 结束日期 |
| format | str | 返回格式 ('pd', 'numpy', 'list', 'dict') |

**返回：** 指数日线数据

**示例：**

```python
data = query_index_day(
    code='000001',
    start_date='2024-01-01',
    end_date='2024-12-31'
)
```

---

## query_index_min

```python
def query_index_min(
    code: Union[str, List[str]],
    start_date: str,
    end_date: str,
    format: str = 'pd',
    frequence: str = '1min'
) -> Union[pd.DataFrame, np.ndarray, List, Dict]
```

查询指数分钟数据。

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| code | str/List[str] | 指数代码 |
| start_date | str | 开始时间 |
| end_date | str | 结束时间 |
| format | str | 返回格式 |
| frequence | str | 频率 ('1min', '5min', '15min', '30min', '60min') |

**返回：** 指数分钟数据

---

## query_index_transaction

```python
def query_index_transaction(
    code: Union[str, List[str]],
    start_date: str,
    end_date: str,
    format: str = 'pd',
    frequence: str = 'tick'
) -> Union[pd.DataFrame, np.ndarray, List, Dict]
```

查询指数分笔数据。

---

## query_index_list

```python
def query_index_list() -> pd.DataFrame
```

获取指数列表。

**返回：** 指数列表 DataFrame

---

## query_index_name

```python
def query_index_name(code: Union[str, List[str]]) -> Union[str, pd.DataFrame]
```

查询指数名称。

**参数：**
- 单个代码返回 str
- 列表返回 DataFrame

---

## query_index_stocks

```python
def query_index_stocks(
    date: Optional[str] = None,
    index_code: str = 'all'
) -> pd.DataFrame
```

查询指数成分股列表。

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| date | str | 日期，默认为最新日期 |
| index_code | str | 指数代码，默认为 'all'（所有指数） |

**返回：** 指数成分股数据

---

## query_trade_date

```python
def query_trade_date() -> pd.Series
```

获取交易日期序列。

**返回：** 交易日期 Series

---

## 相关文档

- [Query 模块 README](./README.md)
- [股票查询](./stock.md)
- [期货查询](./future.md)
