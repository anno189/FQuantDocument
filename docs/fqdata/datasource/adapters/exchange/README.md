# Exchange 适配器

交易所数据适配器模块，从交易所官网获取融资融券等数据。

## 模块结构

```
exchange/
└── __init__.py          # 模块入口
└── margin.py            # 融资融券数据
```

## 功能

### 融资融券数据

```python
from FQData.DataSource.adapters.exchange import (
    get_sh_margin,
    get_sz_margin,
    get_margin_all,
)
```

| 函数 | 说明 |
|------|------|
| `get_sh_margin` | 获取上海融资融券数据 |
| `get_sz_margin` | 获取深圳融资融券数据 |
| `get_margin_all` | 获取所有融资融券数据 |

## 快速开始

### 获取上海融资融券

```python
from FQData.DataSource.adapters.exchange import get_sh_margin

data = get_sh_margin(start='2024-01-01', end='2024-12-31')
print(f"获取 {len(data)} 条数据")
```

### 获取深圳融资融券

```python
from FQData.DataSource.adapters.exchange import get_sz_margin

data = get_sz_margin(start='2024-01-01', end='2024-12-31')
```

### 获取所有融资融券

```python
from FQData.DataSource.adapters.exchange import get_margin_all

data = get_margin_all(start='2024-01-01', end='2024-12-31')
```

## 相关文档

- [DataSource 模块](../../README.md)
- [适配器索引](../README.md)