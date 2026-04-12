# 债券查询

提供可转债等债券数据的日线和分钟线查询功能。

## 导入

```python
from FQData.DataStore.query import (
    query_bond2stock_list,
    query_bond2stock_day,
    query_bond2stock_min,
)
```

## query_bond2stock_list

查询可转债列表。

```python
def query_bond2stock_list() -> pd.DataFrame
```

**返回**: DataFrame，包含可转债代码、名称等信息

**示例**:

```python
# 查询可转债列表
bond_list = query_bond2stock_list()
print(f"可转债数量: {len(bond_list)}")
```

## query_bond2stock_day

查询可转债日线数据。

```python
def query_bond2stock_day(
    code: Union[str, List[str]],
    start: str,
    end: str
) -> pd.DataFrame
```

| 参数 | 类型 | 说明 |
|------|------|------|
| code | str/List[str] | 可转债代码 |
| start | str | 开始日期 (YYYY-MM-DD) |
| end | str | 结束日期 (YYYY-MM-DD) |

**示例**:

```python
# 查询可转债日线
data = query_bond2stock_day(
    code='113009',
    start='2024-01-01',
    end='2024-12-31'
)
```

## query_bond2stock_min

查询可转债分钟数据。

```python
def query_bond2stock_min(
    code: Union[str, List[str]],
    start: str,
    end: str,
    frequence: str = '5min'
) -> pd.DataFrame
```

| 参数 | 类型 | 说明 |
|------|------|------|
| code | str/List[str] | 可转债代码 |
| start | str | 开始时间 |
| end | str | 结束时间 |
| frequence | str | 频率: '1min', '5min', '15min', '30min', '60min' |

**示例**:

```python
# 查询可转债 5 分钟数据
data = query_bond2stock_min(
    code='113009',
    start='2024-01-01 09:30:00',
    end='2024-01-01 15:00:00',
    frequence='5min'
)
```

## 相关文档

- [Query 模块 README](./README.md)
- [股票查询](./stock.md)
- [ETF 查询](./etf.md)
