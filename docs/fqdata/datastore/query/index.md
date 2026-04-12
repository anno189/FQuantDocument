# 指数查询

提供指数日线、分钟线、列表、成份股等数据查询功能。

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

查询指数日线数据。

```python
def query_index_day(
    code: Union[str, List[str]],
    start: str,
    end: str,
    frequence: str = 'day'
) -> pd.DataFrame
```

| 参数 | 类型 | 说明 |
|------|------|------|
| code | str/List[str] | 指数代码 |
| start | str | 开始日期 (YYYY-MM-DD) |
| end | str | 结束日期 (YYYY-MM-DD) |
| frequence | str | 频率: 'day', 'week', 'month' |

**示例**:

```python
# 查询上证指数日线
data = query_index_day(
    code='000001',
    start='2024-01-01',
    end='2024-12-31'
)

# 查询多只指数
data = query_index_day(
    code=['000001', '399001', '399006'],
    start='2024-01-01',
    end='2024-12-31'
)
```

## query_index_min

查询指数分钟数据。

```python
def query_index_min(
    code: Union[str, List[str]],
    start: str,
    end: str,
    frequence: str = '5min'
) -> pd.DataFrame
```

| 参数 | 类型 | 说明 |
|------|------|------|
| code | str/List[str] | 指数代码 |
| start | str | 开始时间 |
| end | str | 结束时间 |
| frequence | str | 频率: '1min', '5min', '15min', '30min', '60min' |

**示例**:

```python
# 查询 5 分钟数据
data = query_index_min(
    code='000001',
    start='2024-01-01 09:30:00',
    end='2024-01-01 15:00:00',
    frequence='5min'
)
```

## query_index_list

查询指数列表。

```python
def query_index_list(market: str = 'sh') -> pd.DataFrame
```

| 参数 | 类型 | 说明 |
|------|------|------|
| market | str | 市场: 'sh', 'sz', 'all' |

**示例**:

```python
# 查询上海指数列表
sh_index = query_index_list(market='sh')

# 查询全部指数
all_index = query_index_list(market='all')
```

## query_index_stocks

查询指数成份股。

```python
def query_index_stocks(code: str) -> pd.DataFrame
```

**示例**:

```python
# 查询沪深 300 成份股
hs300_stocks = query_index_stocks('000300')
print(f"成份股数量: {len(hs300_stocks)}")
```

## query_trade_date

查询交易日信息。

```python
def query_trade_date(start: str, end: str) -> pd.DataFrame
```

**示例**:

```python
# 查询 2024 年交易日
trade_dates = query_trade_date(
    start='2024-01-01',
    end='2024-12-31'
)
print(f"交易日数量: {len(trade_dates)}")
```

## query_index_transaction

查询指数成交明细。

```python
def query_index_transaction(
    code: str,
    date: str,
    start: int = 0,
    count: int = 100
) -> pd.DataFrame
```

**示例**:

```python
trans = query_index_transaction(
    code='000001',
    date='2024-01-01',
    start=0,
    count=100
)
```

## query_index_name

查询指数名称。

```python
def query_index_name(code: str) -> str
```

**示例**:

```python
name = query_index_name('000001')
print(f"指数名称: {name}")  # 上证指数
```

## 相关文档

- [Query 模块 README](./README.md)
- [股票查询](./stock.md)
- [期货查询](./future.md)
