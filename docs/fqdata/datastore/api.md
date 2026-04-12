# DataStore API 参考

## 核心类

### FQDataStore

数据存储统一入口类，提供简单的统一接口存储各类行情数据。

```python
from FQData.DataStore import FQDataStore, get_datastore

store = FQDataStore()
store = get_datastore()  # 获取单例实例
```

#### 初始化参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `mode` | str | 存储模式 ("auto", "mongo", "redis") |
| `storage_adapter` | StorageAdapter | 外部注入的存储适配器 |
| `cache_adapter` | CacheAdapter | 外部注入的缓存适配器 |

#### 主要方法

| 方法 | 说明 |
|------|------|
| `save(data, category, code, start, end, **kwargs)` | 通用保存方法 |
| `query(collection, query, projection)` | 查询数据 |
| `save_stock_day(data, code, start, end, if_fq)` | 保存股票日线 |
| `query_stock_day(code, start, end, if_fq)` | 查询股票日线 |
| `save_financial(record, collection)` | 保存财务数据 |
| `set_primary_storage(name)` | 设置主存储 |
| `get_storage(name)` | 获取存储适配器 |
| `cache_set(key, value, ttl)` | 设置缓存 |
| `cache_get(key)` | 获取缓存 |
| `health_check()` | 健康检查 |

#### 动态方法

FQDataStore 支持动态方法调用，格式为 `save_{category}` 和 `query_{category}`：

```python
# 保存
store.save_stock_day(data, code='600000')
store.save_index_day(data, code='000001')
store.save_future_day(data, code='IF2401')

# 查询
df = store.query_stock_day(code='600000', start='2024-01-01', end='2024-12-31')
df = store.query_index_min(code='000001', freq='5min')
```

---

### StorageAdapter

存储适配器基类。

```python
from FQData.DataStore.base import StorageAdapter

class MyAdapter(StorageAdapter):
    def connect(self):
        pass

    def disconnect(self):
        pass

    def is_connected(self) -> bool:
        return True
```

| 方法 | 说明 |
|------|------|
| `connect()` | 建立连接 |
| `disconnect()` | 断开连接 |
| `is_connected()` | 检查连接状态 |
| `insert_one(collection, document, filter)` | 插入单条 |
| `insert_many(collection, documents)` | 批量插入 |
| `find(collection, query, projection)` | 查询 |
| `update_one(collection, filter, update, upsert)` | 更新单条 |
| `delete_one(collection, filter)` | 删除单条 |

---

### MongoDBAdapter

MongoDB 存储适配器。

```python
from FQData.DataStore import MongoDBAdapter

adapter = MongoDBAdapter(
    host='localhost',
    port=27017,
    database='fqdata',
    username=None,
    password=None,
    max_pool_size=10,
    timeout=5000
)
```

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `host` | str | "localhost" | MongoDB 主机 |
| `port` | int | 27017 | MongoDB 端口 |
| `database` | str | "fqdata" | 数据库名 |
| `username` | str | None | 用户名 |
| `password` | str | None | 密码 |
| `max_pool_size` | int | 10 | 连接池大小 |
| `timeout` | int | 5000 | 超时时间(ms) |

---

## 枚举类型

### StorageMode

存储模式枚举。

```python
from FQData.DataStore import StorageMode

StorageMode.AUTO   # 自动选择
StorageMode.MONGO  # MongoDB
StorageMode.REDIS  # Redis
StorageMode.SYNC   # 同步模式
StorageMode.ASYNC  # 异步模式
```

### DataCategory

数据分类枚举。

```python
from FQData.DataStore import DataCategory

# 股票
DataCategory.STOCK_DAY       # 股票日线
DataCategory.STOCK_MIN       # 股票分钟线
DataCategory.STOCK_INFO      # 股票信息
DataCategory.STOCK_BLOCK     # 股票板块
DataCategory.STOCK_LIST      # 股票列表
DataCategory.STOCK_TRANSACTION  # 股票成交明细
DataCategory.STOCK_XDXR      # 股票除权除息

# 指数
DataCategory.INDEX_DAY       # 指数日线
DataCategory.INDEX_MIN       # 指数分钟线
DataCategory.INDEX_LIST      # 指数列表
DataCategory.INDEX_STOCKS    # 指数成分股

# 期货
DataCategory.FUTURE_DAY      # 期货日线
DataCategory.FUTURE_MIN      # 期货分钟线
DataCategory.FUTURE_LIST      # 期货列表

# 债券
DataCategory.BOND_DAY        # 债券日线
DataCategory.BOND_MIN        # 债券分钟线
DataCategory.BOND2STOCK_DAY  # 可转债日线
DataCategory.BOND2STOCK_MIN  # 可转债分钟线

# ETF
DataCategory.ETF_DAY         # ETF日线
DataCategory.ETF_MIN         # ETF分钟线

# 财务
DataCategory.FINANCIAL       # 财务报表
DataCategory.FINANCIAL_DATA  # 财务数据
```

---

## 事务管理

### TransactionManager

事务管理器。

```python
from FQData.DataStore import TransactionManager

tm = TransactionManager()
```

| 方法 | 说明 |
|------|------|
| `begin()` | 开始事务 |
| `commit(uow)` | 提交工作单元 |
| `rollback()` | 回滚事务 |

### Transaction

事务类。

```python
from FQData.DataStore import Transaction

with tm.begin() as tx:
    tx.insert('stock_day', data)
    tx.update('stock_info', filter, update)
    tx.delete('temp_table', filter)
```

| 方法 | 说明 |
|------|------|
| `insert(collection, document)` | 插入数据 |
| `update(collection, filter, update)` | 更新数据 |
| `delete(collection, filter)` | 删除数据 |

### TransactionState

事务状态枚举。

```python
from FQData.DataStore import TransactionState

TransactionState.ACTIVE     # 活跃
TransactionState.COMMITTED  # 已提交
TransactionState.ROLLED_BACK  # 已回滚
```

### UnitOfWork

工作单元模式实现。

```python
from FQData.DataStore import UnitOfWork

uw = UnitOfWork()
uw.register_new('stock_day', new_data)
uw.register_modified('stock_info', modified_data)
uw.register_removed('temp', to_delete)

tm.commit(uw)
```

| 方法 | 说明 |
|------|------|
| `register_new(collection, document)` | 注册新增 |
| `register_modified(collection, document)` | 注册修改 |
| `register_removed(collection, document)` | 注册删除 |
| `commit()` | 提交变更 |

---

## 查询函数

### 股票查询

```python
from FQData import (
    query_stock_day,
    query_stock_min,
    query_stock_transaction,
    query_stock_adj,
    query_stock_full,
    query_stock_terminated
)

# 股票日线
df = query_stock_day(
    code='600000',
    start='2024-01-01',
    end='2024-12-31',
    skip_adj=False
)

# 股票分钟线
df = query_stock_min(
    code='600000',
    freq='5min',
    start='2024-01-01 09:30:00',
    end='2024-01-01 15:00:00'
)

# 成交明细
df = query_stock_transaction(
    code='600000',
    start='2024-01-01',
    end='2024-12-31'
)
```

### 指数查询

```python
from FQData import (
    query_index_day,
    query_index_min,
    query_index_transaction,
    query_index_list,
    query_index_name
)

# 指数日线
df = query_index_day(
    code='000001',
    start='2024-01-01',
    end='2024-12-31'
)

# 指数分钟线
df = query_index_min(
    code='000001',
    freq='1min',
    start='2024-01-01'
)
```

### 期货查询

```python
from FQData import (
    query_future_day,
    query_future_min,
    query_future_tick,
    query_future_list,
    query_ctp_tick
)

# 期货日线
df = query_future_day(
    code='IF2401',
    start='2024-01-01',
    end='2024-12-31'
)

# 期货分钟线
df = query_future_min(
    code='IF2401',
    freq='5min',
    start='2024-01-01'
)

# 期货Tick
df = query_future_tick(
    code='IF2401',
    start='2024-01-01 09:30:00',
    end='2024-01-01 15:00:00'
)
```

### 其他查询

```python
from FQData import (
    query_trade_date,
    query_stock_list,
    query_etf_list,
    query_bond2stock_day,
    query_stock_xdxr,
    query_financial_report,
    query_stock_block,
    query_stock_info,
    query_stock_name,
    query_etf_name,
    query_backtest_info,
    query_backtest_history,
    query_lhb,
    query_risk,
    query_account,
    query_user,
    query_strategy
)
```

---

## 异步查询

```python
from FQData import query_async_stock_day, query_async_stock_min

# 异步查询股票日线
df = await query_async_stock_day(
    code='600000',
    start='2024-01-01',
    end='2024-12-31'
)

# 异步查询股票分钟线
df = await query_async_stock_min(
    code='600000',
    freq='5min',
    start='2024-01-01'
)
```

---

## 高级查询

```python
from FQData import (
    query_adv_stock_day,
    query_adv_stock_min,
    query_adv_stock_day_full,
    query_adv_index_day,
    query_adv_index_min,
    query_adv_future_day,
    query_adv_future_min,
    query_adv_stock_list,
    query_adv_index_list,
    query_adv_future_list,
    query_adv_stock_block,
    query_adv_stock_realtime,
    query_adv_financial_report,
    query_adv_stock_financial_calendar
)

# 高级股票日线查询（自动处理复权）
df = query_adv_stock_day(
    code='600000',
    start='2024-01-01',
    end='2024-12-31',
    adjust='qfq'  # 前复权
)

# 高级实时行情
realtime = query_adv_stock_realtime(['600000', '000001'])
```

---

## 缓存接口

### get_cache

获取缓存适配器。

```python
from FQData.DataStore import get_cache

# 获取默认缓存
cache = get_cache()

# 获取内存缓存
memory_cache = get_cache('memory')

# 获取 Redis 缓存
redis_cache = get_cache('redis', host='localhost', port=6379)

# 使用缓存
cache.set('key', value, ttl=3600)
value = cache.get('key')
cache.delete('key')
```

### register_cache

注册缓存适配器。

```python
from FQData.DataStore import register_cache

register_cache('my_cache', custom_cache_adapter)
```

---

## 相关文档

- [README](README.md)
- [使用指南](usage.md)
- [最佳实践](best-practices.md)
- [开发指南](development.md)
- [FAQ](faq.md)