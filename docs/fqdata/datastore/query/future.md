# 期货查询

提供期货日线、分钟线、列表、Tick 等数据查询功能。

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

查询期货日线数据。

```python
def query_future_day(
    code: Union[str, List[str]],
    start: str,
    end: str
) -> pd.DataFrame
```

| 参数 | 类型 | 说明 |
|------|------|------|
| code | str/List[str] | 期货合约代码 |
| start | str | 开始日期 (YYYY-MM-DD) |
| end | str | 结束日期 (YYYY-MM-DD) |

**示例**:

```python
# 查询期货日线
data = query_future_day(
    code='IF2401',
    start='2024-01-01',
    end='2024-12-31'
)

# 查询多只期货
data = query_future_day(
    code=['IF2401', 'IC2401'],
    start='2024-01-01',
    end='2024-12-31'
)
```

## query_future_min

查询期货分钟数据。

```python
def query_future_min(
    code: Union[str, List[str]],
    start: str,
    end: str,
    frequence: str = '5min'
) -> pd.DataFrame
```

| 参数 | 类型 | 说明 |
|------|------|------|
| code | str/List[str] | 期货合约代码 |
| start | str | 开始时间 |
| end | str | 结束时间 |
| frequence | str | 频率: '1min', '5min', '15min', '30min', '60min' |

**示例**:

```python
# 查询 5 分钟数据
data = query_future_min(
    code='IF2401',
    start='2024-01-01 09:30:00',
    end='2024-01-01 15:00:00',
    frequence='5min'
)
```

## query_future_list

查询期货列表。

```python
def query_future_list() -> pd.DataFrame
```

**示例**:

```python
# 查询期货列表
future_list = query_future_list()
print(f"期货数量: {len(future_list)}")
```

## query_future_tick

查询期货 Tick 数据。

```python
def query_future_tick(
    code: str,
    date: str,
    start: int = 0,
    count: int = 100
) -> pd.DataFrame
```

| 参数 | 类型 | 说明 |
|------|------|------|
| code | str | 期货合约代码 |
| date | str | 日期 (YYYY-MM-DD) |
| start | int | 起始索引 |
| count | int | 数量 |

**示例**:

```python
tick = query_future_tick(
    code='IF2401',
    date='2024-01-01',
    start=0,
    count=100
)
```

## query_ctp_tick

查询 CTP 期货 Tick 数据。

```python
def query_ctp_tick(
    code: str,
    date: str,
    start: int = 0,
    count: int = 100
) -> pd.DataFrame
```

**示例**:

```python
ctp_tick = query_ctp_tick(
    code='IF2401',
    date='2024-01-01',
    start=0,
    count=100
)
```

## 相关文档

- [Query 模块 README](./README.md)
- [股票查询](./stock.md)
- [指数查询](./index.md)
