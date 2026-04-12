# 股票查询

提供股票日线、分钟线、列表、板块、财务等数据查询功能。

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

查询股票日线数据。

```python
def query_stock_day(
    code: Union[str, List[str]],
    start: str,
    end: str,
    frequence: str = 'day',
    adjust: str = 'qfq'
) -> pd.DataFrame
```

| 参数 | 类型 | 说明 |
|------|------|------|
| code | str/List[str] | 股票代码 |
| start | str | 开始日期 (YYYY-MM-DD) |
| end | str | 结束日期 (YYYY-MM-DD) |
| frequence | str | 频率: 'day', 'week', 'month' |
| adjust | str | 复权类型: 'qfq', 'hfq', 'none' |

**返回**: DataFrame，包含 date, open, high, low, close, volume 等列

**示例**:

```python
# 查询单只股票日线
data = query_stock_day(
    code='600000',
    start='2024-01-01',
    end='2024-12-31'
)

# 查询多只股票日线
data = query_stock_day(
    code=['600000', '000001'],
    start='2024-01-01',
    end='2024-12-31'
)

# 查询周线
week_data = query_stock_day(
    code='600000',
    start='2024-01-01',
    end='2024-12-31',
    frequence='week'
)

# 查询不复权数据
raw_data = query_stock_day(
    code='600000',
    start='2024-01-01',
    end='2024-12-31',
    adjust='none'
)
```

## query_stock_min

查询股票分钟数据。

```python
def query_stock_min(
    code: Union[str, List[str]],
    start: str,
    end: str,
    frequence: str = '5min'
) -> pd.DataFrame
```

| 参数 | 类型 | 说明 |
|------|------|------|
| code | str/List[str] | 股票代码 |
| start | str | 开始时间 |
| end | str | 结束时间 |
| frequence | str | 频率: '1min', '5min', '15min', '30min', '60min' |

**示例**:

```python
# 查询 5 分钟数据
data = query_stock_min(
    code='600000',
    start='2024-01-01 09:30:00',
    end='2024-01-01 15:00:00',
    frequence='5min'
)

# 查询 15 分钟数据
data = query_stock_min(
    code='600000',
    start='2024-01-01',
    end='2024-01-31',
    frequence='15min'
)
```

## query_stock_list

查询股票列表。

```python
def query_stock_list(market: str = 'sh') -> pd.DataFrame
```

| 参数 | 类型 | 说明 |
|------|------|------|
| market | str | 市场: 'sh', 'sz', 'bj', 'all' |

**返回**: DataFrame，包含 code, name, market 等列

**示例**:

```python
# 查询上海股票列表
sh_list = query_stock_list(market='sh')

# 查询深圳股票列表
sz_list = query_stock_list(market='sz')

# 查询北京股票列表
bj_list = query_stock_list(market='bj')

# 查询全部股票
all_list = query_stock_list(market='all')
```

## query_stock_info

查询股票基本信息。

```python
def query_stock_info(code: str) -> pd.DataFrame
```

**示例**:

```python
info = query_stock_info('600000')
print(f"股票名称: {info['name']}")
print(f"总股本: {info['total_share']}")
print(f"流通股本: {info['float_share']}")
```

## query_stock_block

查询股票所属板块。

```python
def query_stock_block(code: str) -> pd.DataFrame
```

**示例**:

```python
blocks = query_stock_block('600000')
print(blocks)
#    code block_code block_name
# 0  600000    BK0001      银行板块
# 1  600000    BK0002      沪深300
```

## query_stock_xdxr

查询股票除权除息数据。

```python
def query_stock_xdxr(code: str, start: str, end: str) -> pd.DataFrame
```

**示例**:

```python
xdxr = query_stock_xdxr(
    code='600000',
    start='2024-01-01',
    end='2024-12-31'
)
print(xdxr)
#    date  dividend  split  ...
```

## query_stock_transaction

查询股票成交明细。

```python
def query_stock_transaction(
    code: str,
    date: str,
    start: int = 0,
    count: int = 100
) -> pd.DataFrame
```

**示例**:

```python
trans = query_stock_transaction(
    code='600000',
    date='2024-01-01',
    start=0,
    count=100
)
```

## query_stock_list_all

查询全部股票列表（带缓存）。

```python
def query_stock_list_all(refresh: bool = False) -> pd.DataFrame
```

**示例**:

```python
# 获取缓存的股票列表
all_stocks = query_stock_list_all()

# 强制刷新缓存
all_stocks = query_stock_list_all(refresh=True)
```

## refresh_stock_list_all_cache

刷新全部股票列表缓存。

```python
def refresh_stock_list_all_cache() -> None
```

## 相关文档

- [Query 模块 README](./README.md)
- [指数查询](./index.md)
- [期货查询](./future.md)
