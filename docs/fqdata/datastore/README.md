# DataStore 模块

存储抽象模块，提供统一的存储接口，支持 MongoDB 等多种存储后端。

## 模块结构

```
DataStore/
├── base.py              # 存储适配器基类
├── facade.py            # 存储统一入口
├── mongodb_adapter.py   # MongoDB 适配器
├── connection_pool.py   # 连接池管理
├── transaction.py       # 事务管理
├── query.py            # 查询函数
├── query_adv.py        # 高级查询函数
├── query_async.py      # 异步查询函数
└── savers/             # 数据持久化
    ├── tdx_stock_saver.py      # 股票数据持久化
    ├── tdx_index_saver.py      # 指数数据持久化
    ├── tdx_future_saver.py     # 期货数据持久化
    ├── tdx_bond_saver.py       # 债券数据持久化
    ├── tdx_option_saver.py     # 期权数据持久化
    ├── tdx_parallel_saver.py   # 并行数据持久化
    └── ...
```

## 核心组件

| 组件 | 说明 |
|------|------|
| `FQDataStore` | 存储统一入口类 |
| `MongoDBAdapter` | MongoDB 存储适配器 |
| `TransactionManager` | 事务管理器 |
| `UnitOfWork` | 工作单元模式实现 |
| `DataCategory` | 数据分类枚举 |

## 快速开始

### 基本使用

```python
from FQData.DataStore import get_datastore

# 获取存储实例
store = get_datastore()

# 查询数据
data = store.query('stock_day', {'code': '600000'})
```

### 数据持久化

```python
from FQData import save_stock_day

# 保存股票日线数据
save_stock_day('600000', data)

# 批量保存
save_stock_day(['600000', '000001'], data_list)
```

## 数据分类

| 分类 | 说明 |
|------|------|
| `STOCK_DAY` | 股票日线 |
| `STOCK_MIN` | 股票分钟线 |
| `INDEX_DAY` | 指数日线 |
| `INDEX_MIN` | 指数分钟线 |
| `FUTURE_DAY` | 期货日线 |
| `FUTURE_MIN` | 期货分钟线 |
| `BOND_DAY` | 债券日线 |
| `TRANSACTION` | 成交明细 |

## 查询函数

### 股票数据查询

```python
from FQData import query_stock_day, query_stock_min, query_stock_transaction

# 查询股票日线
df = query_stock_day(
    code='600000',
    start='2024-01-01',
    end='2024-12-31'
)

# 查询股票分钟线
df = query_stock_min(
    code='600000',
    freq='5min',
    start='2024-01-01 09:30:00',
    end='2024-01-01 15:00:00'
)

# 查询成交明细
df = query_stock_transaction(
    code='600000',
    start='2024-01-01',
    end='2024-12-31'
)
```

### 指数数据查询

```python
from FQData import query_index_day, query_index_min

# 查询指数日线
df = query_index_day(
    code='000001',
    start='2024-01-01',
    end='2024-12-31'
)

# 查询指数分钟线
df = query_index_min(
    code='000001',
    freq='1min',
    start='2024-01-01'
)
```

### 期货数据查询

```python
from FQData import query_future_day, query_future_min, query_future_tick

# 查询期货日线
df = query_future_day(
    code='IF2401',
    start='2024-01-01',
    end='2024-12-31'
)

# 查询期货分钟线
df = query_future_min(
    code='IF2401',
    freq='5min',
    start='2024-01-01'
)

# 查询期货 Tick
df = query_future_tick(
    code='IF2401',
    start='2024-01-01 09:30:00',
    end='2024-01-01 15:00:00'
)
```

## 事务管理

```python
from FQData import TransactionManager, Transaction, UnitOfWork

# 创建事务管理器
tm = TransactionManager()

# 开始事务
with tm.begin() as tx:
    tx.insert('stock_day', data1)
    tx.update('stock_info', {'code': '600000'}, data2)
    tx.delete('temp_table', {'code': '600000'})

# 使用工作单元
uw = UnitOfWork()
uw.register_new('stock_day', new_data)
uw.register_modified('stock_info', modified_data)
uw.register_removed('temp', to_delete)

tm.commit(uw)
```

## 数据持久化 (Savers)

### 股票数据

```python
from FQData import (
    save_single_stock_day,
    save_stock_day,
    save_stock_min,
    save_single_stock_min,
    save_stock_xdxr,
    save_stock_list,
    save_stock_block,
    save_stock_info
)

# 保存单只股票日线
save_single_stock_day('600000', data)

# 批量保存
save_stock_day(['600000', '000001'], data_dict)

# 保存分钟线
save_stock_min('600000', min_data, freq='5min')

# 保存除权除息数据
save_stock_xdxr(['600000', '000001'])

# 保存股票列表
save_stock_list()

# 保存股票板块
save_stock_block()

# 保存股票信息
save_stock_info(['600000', '000001'])
```

### 指数/ETF数据

```python
from FQData import (
    save_single_index_day,
    save_index_day,
    save_index_min,
    save_single_etf_day,
    save_etf_day,
    save_etf_min
)

# 保存指数日线
save_index_day(['000001', '399001'])

# 保存ETF日线
save_etf_day(['510300', '510050'])
```

### 期货数据

```python
from FQData import (
    save_single_future_day,
    save_future_day,
    save_future_min,
    save_future_list
)

# 保存期货日线
save_future_day(['IF2401', 'IC2401'])

# 保存期货分钟线
save_future_min('IF2401', min_data, freq='5min')
```

## 并行数据持久化

```python
from FQData import (
    save_stock_day_parallel,
    save_index_day_parallel,
    save_etf_day_parallel
)

# 并行保存股票日线
save_stock_day_parallel(
    codes=['600000', '000001', '000002'],
    start='2024-01-01',
    end='2024-12-31',
    workers=4  # 并行工作数
)
```

## 文档索引

| 文档 | 说明 |
|------|------|
| [README](README.md) | 本文档，模块索引 |
| [API](api.md) | 完整API参考 |
| [使用](usage.md) | 使用指南与示例 |
| [开发指南](development.md) | 开发环境、调试、测试 |
| [最佳实践](best-practices.md) | 开发建议与注意事项 |
| [FAQ](faq.md) | 常见问题解答 |

### 子模块文档

| 文档 | 说明 |
|------|------|
| [savers](savers/README.md) | 数据持久化模块 |
| [query](query/README.md) | 数据查询模块 |

## 相关文档

- [FQData 模块](../README.md)
- [DataSource 模块](../datasource/README.md)