# 期货查询

提供期货日线、分钟线、列表、Tick 等数据查询功能。

## 模块路径

```
FQData.DataStore.query.future
```

## 导入

```python
from FQData.DataStore.query import (
    query_future_day,
    query_future_min,
    query_future_list,
    query_future_tick,
    query_ctp_tick,
)
```

## query_future_day

```python
def query_future_day(
    code: Union[str, List[str]],
    start_date: str,
    end_date: str,
    format: str = 'pd'
) -> Union[pd.DataFrame, np.ndarray, List, Dict]
```

查询期货日线数据。

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| code | str/List[str] | 期货代码 |
| start_date | str | 开始日期 |
| end_date | str | 结束日期 |
| format | str | 返回格式 ('pd', 'numpy', 'list', 'dict') |

**返回：** 期货日线数据

**示例：**

```python
data = query_future_day(
    code='IF2401',
    start_date='2024-01-01',
    end_date='2024-12-31'
)
```

---

## query_future_min

```python
def query_future_min(
    code: Union[str, List[str]],
    start_date: str,
    end_date: str,
    format: str = 'pd',
    frequence: str = '1min'
) -> Union[pd.DataFrame, np.ndarray, List]
```

查询期货分钟数据。

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| code | str/List[str] | 期货代码 |
| start_date | str | 开始时间 |
| end_date | str | 结束时间 |
| format | str | 返回格式 |
| frequence | str | 频率 ('1min', '5min', '15min', '30min', '60min') |

**返回：** 期货分钟数据

---

## query_future_list

```python
def query_future_list() -> pd.DataFrame
```

获取期货列表。

**返回：** 期货列表 DataFrame

---

## query_future_tick

```python
def query_future_tick()
```

查询期货tick数据。

**状态：** 暂未实现

**抛出：** NotImplementedError

---

## query_ctp_tick

```python
def query_ctp_tick(
    code: Union[str, List[str]],
    start_date: str,
    end_date: str,
    frequence: str,
    format: str = 'pd'
) -> pd.DataFrame
```

查询CTP Tick数据。

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| code | str/List[str] | 期货代码 |
| start_date | str | 开始时间 |
| end_date | str | 结束时间 |
| frequence | str | 频率 |
| format | str | 返回格式 |

**返回：** CTP Tick数据

---

## 相关文档

- [Query 模块 README](./README.md)
- [股票查询](./stock.md)
- [指数查询](./index.md)
