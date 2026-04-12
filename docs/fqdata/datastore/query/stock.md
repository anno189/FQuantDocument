# 股票查询

提供股票日线、分钟线、列表、板块、财务等数据查询功能。

## 模块路径

```
FQData.DataStore.query.stock
```

## 导入

```python
from FQData.DataStore.query import (
    query_stock_day,
    query_stock_adj,
    query_stock_min,
    query_stock_transaction,
    query_stock_list,
    query_stock_list_bj,
    query_stock_terminated,
    query_stock_block,
    query_stock_info,
    query_stock_name,
    query_stock_full,
    query_stock_xdxr,
    query_stock_list_all,
    refresh_stock_list_all_cache,
)
```

## query_stock_day

```python
def query_stock_day(
    code: Union[str, List[str]],
    start_date: str,
    end_date: str,
    format: str = 'pd'
) -> Union[pd.DataFrame, np.ndarray, List, Dict]
```

查询股票日线数据。

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| code | str/List[str] | 股票代码 |
| start_date | str | 开始日期 (YYYY-MM-DD) |
| end_date | str | 结束日期 (YYYY-MM-DD) |
| format | str | 返回格式 ('pd', 'numpy', 'list', 'dict') |

**返回：** 股票日线数据

**示例：**

```python
data = query_stock_day(
    code='600000',
    start_date='2024-01-01',
    end_date='2024-12-31'
)

data = query_stock_day(
    code=['600000', '000001'],
    start_date='2024-01-01',
    end_date='2024-12-31'
)
```

---

## query_stock_adj

```python
def query_stock_adj(
    code: Union[str, List[str]],
    start: str,
    end: str,
    collections: str = None
) -> pd.DataFrame
```

查询股票复权系数 ADJ。

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| code | str/List[str] | 股票代码 |
| start | str | 开始日期 |
| end | str | 结束日期 |
| collections | str | 集合名称（已废弃） |

**返回：** 复权系数数据

---

## query_stock_min

```python
def query_stock_min(
    code: Union[str, List[str]],
    start_date: str,
    end_date: str,
    format: str = 'pd',
    frequence: str = '1min'
) -> Union[pd.DataFrame, np.ndarray, List, Dict]
```

查询股票分钟线数据。

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| code | str/List[str] | 股票代码 |
| start_date | str | 开始时间 |
| end_date | str | 结束时间 |
| format | str | 返回格式 |
| frequence | str | 频率 ('1min', '5min', '15min', '30min', '60min') |

**示例：**

```python
data = query_stock_min(
    code='600000',
    start_date='2024-01-01 09:30:00',
    end_date='2024-01-01 15:00:00',
    frequence='5min'
)
```

---

## query_stock_transaction

```python
def query_stock_transaction(
    code: Union[str, List[str]],
    start_date: str,
    end_date: str,
    format: str = 'pd',
    frequence: str = 'tick'
) -> Union[pd.DataFrame, np.ndarray, List, Dict]
```

查询股票分笔数据。

---

## query_stock_list

```python
def query_stock_list() -> pd.DataFrame
```

获取股票列表（沪深）。

**返回：** 股票列表 DataFrame

---

## query_stock_list_bj

```python
def query_stock_list_bj() -> pd.DataFrame
```

获取北交所股票列表。

**返回：** 北交所股票列表 DataFrame

---

## query_stock_terminated

```python
def query_stock_terminated() -> pd.DataFrame
```

获取已退市股票列表。

**返回：** 退市股票列表 DataFrame

---

## query_stock_block

```python
def query_stock_block(code: str = None, format: str = 'pd') -> pd.DataFrame
```

查询股票板块数据。

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| code | str | 股票代码（可选） |
| format | str | 返回格式 |

**返回：** 股票板块数据

---

## query_stock_info

```python
def query_stock_info(code: Union[str, List[str]], format: str = 'pd') -> pd.DataFrame
```

查询股票基本信息。

---

## query_stock_name

```python
def query_stock_name(code: Union[str, List[str]]) -> Union[str, pd.DataFrame]
```

查询股票名称。

**参数：**
- 单个代码返回 str
- 列表返回 DataFrame

---

## query_stock_full

```python
def query_stock_full(date: str, format: str = 'pd') -> Union[pd.DataFrame, np.ndarray, List]
```

获取全市场某一日的数据。

---

## query_stock_xdxr

```python
def query_stock_xdxr(code: Union[str, List[str]], format: str = 'pd') -> pd.DataFrame
```

查询股票除权信息。

---

## query_stock_list_all

```python
def query_stock_list_all(debug: bool = True) -> pd.DataFrame
```

获取所有股票列表（沪深 + 北交所）。

**参数：**
- debug=True: 返回调试样本（5个主板 + 5个创业板 + 5个北交所）
- debug=False: 返回完整列表

**返回：** 所有股票列表 DataFrame，包含 code, name, zongguben, liutongguben, ipo_date 列

---

## refresh_stock_list_all_cache

```python
def refresh_stock_list_all_cache()
```

刷新股票列表缓存（供 Celery 定时任务调用）。

---

## 相关文档

- [Query 模块 README](./README.md)
- [指数查询](./index.md)
- [期货查询](./future.md)
