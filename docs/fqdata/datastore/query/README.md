# DataStore Query 模块

数据查询模块，提供从存储层查询股票、指数、期货、债券、ETF 等数据的功能。

## 模块结构

```
query/
├── __init__.py          # 模块入口
├── _utils.py            # 工具函数
├── query.py             # 查询主入口
├── stock.py             # 股票查询
├── index.py             # 指数查询
├── bond.py              # 债券查询
├── future.py            # 期货查询
├── etf.py               # ETF 查询
├── financial.py         # 财务数据查询
└── quotation.py         # 行情数据查询
```

## 导入

```python
from FQData.DataStore.query import (
    # 股票查询
    query_stock_day,
    query_stock_min,
    query_stock_list,
    query_stock_info,
    query_stock_block,
    # 指数查询
    query_index_day,
    query_index_min,
    query_index_list,
    # 期货查询
    query_future_day,
    query_future_min,
    # 债券查询
    query_bond2stock_day,
    # ETF 查询
    query_etf_list,
    # 财务数据
    query_financial_report,
    # 行情查询
    query_quotation,
    query_lhb,
)
```

## 股票查询

```python
from FQData.DataStore.query import query_stock_day, query_stock_min

# 查询股票日线
data = query_stock_day(
    code='600000',
    start='2024-01-01',
    end='2024-12-31',
    frequence='day'
)

# 查询股票分钟数据
min_data = query_stock_min(
    code='600000',
    start='2024-01-01 09:30:00',
    end='2024-01-01 15:00:00',
    frequence='5min'
)
```

## 指数查询

```python
from FQData.DataStore.query import query_index_day, query_index_list

# 查询指数日线
index_data = query_index_day(
    code='000001',
    start='2024-01-01',
    end='2024-12-31'
)

# 查询指数列表
index_list = query_index_list()
```

## 期货查询

```python
from FQData.DataStore.query import query_future_day, query_future_min

# 查询期货日线
future_data = query_future_day(
    code='IF2401',
    start='2024-01-01',
    end='2024-12-31'
)

# 查询期货分钟数据
future_min = query_future_min(
    code='IF2401',
    start='2024-01-01 09:30:00',
    end='2024-01-01 15:00:00',
    frequence='1min'
)
```

## 债券查询

```python
from FQData.DataStore.query import query_bond2stock_day, query_bond2stock_min

# 查询可转债日线
bond_data = query_bond2stock_day(
    code='113009',
    start='2024-01-01',
    end='2024-12-31'
)
```

## ETF 查询

```python
from FQData.DataStore.query import query_etf_list, query_etf_name

# 查询 ETF 列表
etf_list = query_etf_list()

# 查询 ETF 名称
etf_name = query_etf_name(code='510300')
```

## 财务数据查询

```python
from FQData.DataStore.query import query_financial_report, query_stock_financial_calendar

# 查询财务报表
financial = query_financial_report(
    code='600000',
    start='2024-01-01',
    end='2024-12-31',
    report_type='annual'
)

# 查询财务日历
calendar = query_stock_financial_calendar(code='600000')
```

## 行情查询

```python
from FQData.DataStore.query import query_quotation, query_lhb

# 通用行情查询
quotation = query_quotation(
    code='600000',
    market='stock',
    date='2024-01-01'
)

# 查询龙虎榜数据
lhb_data = query_lhb(start='2024-01-01', end='2024-12-31')
```

## 工具函数

```python
from FQData.DataStore.query import (
    _normalize_date,
    _validate_code_list,
    _FREQUENCE_MAP,
    _process_day_result,
    _process_min_result,
)

# 日期标准化
date_str = _normalize_date('2024-01-01')  # '2024-01-02' (如果是交易日)

# 代码列表验证
codes = _validate_code_list(['600000', '000001'])  # ['600000', '000001']
codes = _validate_code_list('600000')  # ['600000']

# 频率映射
freq = _FREQUENCE_MAP.get('5min')  # '5min'
```

## 文档索引

| 模块 | 文档 |
|------|------|
| 查询核心 | [query.md](./query.md) |
| 工具函数 | [_utils.md](./_utils.md) |
| 股票查询 | [stock.md](./stock.md) |
| 指数查询 | [index.md](./index.md) |
| 期货查询 | [future.md](./future.md) |
| 债券查询 | [bond.md](./bond.md) |
| ETF 查询 | [etf.md](./etf.md) |
| 财务数据 | [financial.md](./financial.md) |
| 行情查询 | [quotation.md](./quotation.md) |

## 相关文档

- [DataStore 模块](../README.md)
- [DataStore API](../api.md)
- [DataSource 模块](../../datasource/README.md)
