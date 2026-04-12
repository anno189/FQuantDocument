# 债券查询

提供可转债等债券数据查询功能。

## 模块路径

```
FQData.DataStore.query.bond
```

## 导入

```python
from FQData.DataStore.query import (
    query_bond2stock_list,
    query_bond2stock_day,
    query_bond2stock_min,
)
```

## query_bond2stock_list

```python
def query_bond2stock_list() -> pd.DataFrame
```

获取可转债正股列表。

**返回：** 可转债正股列表 DataFrame

---

## query_bond2stock_day

```python
def query_bond2stock_day(
    code: Union[str, List[str]],
    start_date: str,
    end_date: str,
    format: str = 'pd'
) -> Union[pd.DataFrame, np.ndarray, List, Dict]
```

查询可转债正股日线数据。

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| code | str/List[str] | 股票代码 |
| start_date | str | 开始日期 |
| end_date | str | 结束日期 |
| format | str | 返回格式 ('pd', 'numpy', 'list', 'dict') |

**返回：** 可转债正股日线数据

---

## query_bond2stock_min

```python
def query_bond2stock_min(
    code: Union[str, List[str]],
    start_date: str,
    end_date: str,
    format: str = 'pd',
    frequence: str = '1min'
) -> Union[pd.DataFrame, np.ndarray, List, Dict]
```

查询可转债分钟数据。

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| code | str/List[str] | 可转债代码 |
| start_date | str | 开始时间 |
| end_date | str | 结束时间 |
| format | str | 返回格式 |
| frequence | str | 频率 ('1min', '5min', '15min', '30min', '60min') |

**返回：** 可转债分钟数据

---

## 相关文档

- [Query 模块 README](./README.md)
- [股票查询](./stock.md)
