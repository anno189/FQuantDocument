# AkShare 适配器

AkShare 数据适配器模块，封装 AkShare 开源金融数据接口。

## 模块结构

```
akshare/
├── __init__.py          # 模块入口
├── base.py              # 适配器基类
├── bond.py              # 债券数据
├── future.py            # 期货数据
├── hkstock.py           # 港股数据
├── index.py             # 指数数据
├── macroindex.py        # 宏观指数数据
├── option.py            # 期权数据
└── usstock.py           # 美股数据
```

## 导入

```python
from FQData.DataSource.adapters.akshare import (
    AkShareAdapter,
    AkShareStockAdapter,
    AkShareIndexAdapter,
    AkShareFutureAdapter,
    AkShareBondAdapter,
    AkShareHKStockAdapter,
    AkShareOptionAdapter,
    AkShareMacroIndexAdapter,
    AkShareUSStockAdapter,
)
```

## AkShareAdapter

AkShare 数据适配器基类，继承自 `DataSourceAdapter`。

```python
from FQData.DataSource.adapters.akshare import AkShareAdapter

adapter = AkShareAdapter()
```

### 基类方法

| 方法 | 说明 |
|------|------|
| `_connect()` | 建立 AkShare 连接 |
| `_execute(operation, *args, **kwargs)` | 执行 AkShare 操作并处理异常 |
| `get_stock_day(code, start, end, frequence)` | 获取股票日线数据 |

### 子类适配器

| 适配器 | 说明 |
|--------|------|
| `AkShareStockAdapter` | 股票数据适配器 |
| `AkShareIndexAdapter` | 指数数据适配器 |
| `AkShareFutureAdapter` | 期货数据适配器 |
| `AkShareBondAdapter` | 债券数据适配器 |
| `AkShareHKStockAdapter` | 港股数据适配器 |
| `AkShareOptionAdapter` | 期权数据适配器 |
| `AkShareMacroIndexAdapter` | 宏观指数数据适配器 |
| `AkShareUSStockAdapter` | 美股数据适配器 |

## 使用示例

### 获取股票日线数据

```python
from FQData.DataSource.adapters.akshare import AkShareStockAdapter

adapter = AkShareStockAdapter()
df = adapter.get_stock_day("600000", "2026-01-01", "2026-04-01")
```

### 获取指数数据

```python
from FQData.DataSource.adapters.akshare import AkShareIndexAdapter

adapter = AkShareIndexAdapter()
df = adapter.get_index_day("000001", "2026-01-01", "2026-04-01")
```

### 获取期货数据

```python
from FQData.DataSource.adapters.akshare import AkShareFutureAdapter

adapter = AkShareFutureAdapter()
df = adapter.get_future_day("IF", "2026-01-01", "2026-04-01")
```

## 相关文档

- [FQData 数据源](../datasource/README)
- [TDX 适配器](./tdx/README)
- [EastMoney 适配器](./eastmoney/README)
- [THS 同花顺适配器](./ths/README)
