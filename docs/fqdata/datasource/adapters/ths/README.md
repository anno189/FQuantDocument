# THS 适配器

同花顺数据适配器模块，提供股票日线、板块数据、基金持仓数据等。

## 模块结构

```
ths/
├── __init__.py          # 模块入口
├── stock_day.py         # 日线数据
├── block.py             # 板块数据
└── fund_position.py     # 基金持仓
```

## 功能

### 日线数据

```python
from FQData.DataSource.adapters.ths import (
    get_stock_day_in_year,
    get_stock_day,
)
```

| 函数 | 说明 |
|------|------|
| `get_stock_day_in_year` | 获取指定年份的股票日线 |
| `get_stock_day` | 获取股票日线数据 |

### 板块数据

```python
from FQData.DataSource.adapters.ths import get_stock_block

block = get_stock_block()
```

### 基金持仓

```python
from FQData.DataSource.adapters.ths import (
    get_fund_position_from_ths,
    save_fund_position,
    save_ths_fund_position,
)
```

| 函数 | 说明 |
|------|------|
| `get_fund_position_from_ths` | 从同花顺获取基金持仓 |
| `save_fund_position` | 保存基金持仓 |
| `save_ths_fund_position` | 保存同花顺基金持仓 |

## 快速开始

### 获取股票日线

```python
from FQData.DataSource.adapters.ths import get_stock_day

data = get_stock_day('600000', start='2024-01-01', end='2024-12-31')
print(f"获取 {len(data)} 条数据")
```

### 获取年度日线

```python
from FQData.DataSource.adapters.ths import get_stock_day_in_year

data = get_stock_day_in_year('600000', year=2024)
```

### 获取板块数据

```python
from FQData.DataSource.adapters.ths import get_stock_block

block_data = get_stock_block()
print(block_data.head())
```

## 相关文档

- [DataSource 模块](../../README.md)
- [适配器索引](../README.md)