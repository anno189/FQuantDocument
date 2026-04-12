# DataStore query 模块

数据查询核心模块，提供从存储层查询各类行情数据的功能。

## 模块结构

```
query.py
```

## 核心查询函数

### 股票数据

```python
from FQData.DataStore.query import (
    query_stock_day,
    query_stock_min,
    query_stock_list,
    query_stock_info,
    query_stock_block,
    query_stock_adj,
    query_stock_full,
    query_stock_terminated,
)
```

| 函数 | 说明 |
|------|------|
| `query_stock_day` | 查询股票日线 |
| `query_stock_min` | 查询股票分钟线 |
| `query_stock_list` | 查询股票列表 |
| `query_stock_info` | 查询股票信息 |
| `query_stock_block` | 查询股票板块 |
| `query_stock_adj` | 查询股票复权因子 |
| `query_stock_full` | 查询完整股票数据 |
| `query_stock_terminated` | 查询已退市股票 |

### 指数数据

```python
from FQData.DataStore.query import (
    query_index_day,
    query_index_min,
    query_index_list,
    query_index_name,
    query_index_transaction,
)
```

| 函数 | 说明 |
|------|------|
| `query_index_day` | 查询指数日线 |
| `query_index_min` | 查询指数分钟线 |
| `query_index_list` | 查询指数列表 |
| `query_index_name` | 查询指数名称 |
| `query_index_transaction` | 查询指数成交明细 |

### 期货数据

```python
from FQData.DataStore.query import (
    query_future_day,
    query_future_min,
    query_future_tick,
    query_future_list,
    query_ctp_tick,
)
```

| 函数 | 说明 |
|------|------|
| `query_future_day` | 查询期货日线 |
| `query_future_min` | 查询期货分钟线 |
| `query_future_tick` | 查询期货 Tick |
| `query_future_list` | 查询期货列表 |
| `query_ctp_tick` | 查询 CTP Tick |

### 其他查询

```python
from FQData.DataStore.query import (
    query_trade_date,
    query_stock_name,
    query_etf_name,
    query_bond2stock_day,
    query_bond2stock_min,
)
```

| 函数 | 说明 |
|------|------|
| `query_trade_date` | 查询交易日 |
| `query_stock_name` | 查询股票名称 |
| `query_etf_name` | 查询 ETF 名称 |
| `query_bond2stock_day` | 查询可转债日线 |
| `query_bond2stock_min` | 查询可转债分钟线 |

---

## 工具函数

### _normalize_date

统一日期参数处理。

```python
from FQData.DataStore.query import _normalize_date

date_str = _normalize_date('2024-01-01')
date_str = _normalize_date(None)  # 自动使用上一交易日
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `date_val` | Any | - | 日期值（str/date/datetime/None） |
| `default` | str | None | 默认日期 |

**返回：** str - YYYY-MM-DD 格式的交易日期

### _validate_code_list

验证并标准化代码列表。

```python
from FQData.DataStore.query import _validate_code_list

codes = _validate_code_list('600000')  # ['600000']
codes = _validate_code_list(['600000', '000001'])  # ['600000', '000001']
codes = _validate_code_list(None)  # []
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `code` | str/List[str] | 单个代码或代码列表 |

**返回：** List[str] - 代码列表

---

## 工具常量

### _FREQUENCE_MAP

频率映射表。

```python
from FQData.DataStore.query import _FREQUENCE_MAP

freq = _FREQUENCE_MAP.get('5min')  # '5min'
freq = _FREQUENCE_MAP.get('5m')     # '5min'
```

---

## 使用示例

### 基本查询

```python
from FQData.DataStore.query import query_stock_day

df = query_stock_day(
    code='600000',
    start_date='2024-01-01',
    end_date='2024-12-31'
)
print(df.head())
```

### 批量查询

```python
df = query_stock_day(
    code=['600000', '000001', '000002'],
    start_date='2024-01-01',
    end_date='2024-06-30'
)
print(df.head())
```

### 不同返回格式

```python
from FQData.DataStore.query import query_stock_day

# DataFrame (默认)
df = query_stock_day(code='600000', start_date='2024-01-01', end_date='2024-01-31', format='pd')

# numpy
arr = query_stock_day(code='600000', start_date='2024-01-01', end_date='2024-01-31', format='numpy')

# list
lst = query_stock_day(code='600000', start_date='2024-01-01', end_date='2024-01-31', format='list')

# dict
d = query_stock_day(code='600000', start_date='2024-01-01', end_date='2024-01-31', format='dict')
```

---

## 相关文档

- [query/README](README.md)
- [query/stock](stock.md)
- [query/index](index.md)
- [query/future](future.md)
- [query/bond](bond.md)
- [query/etf](etf.md)