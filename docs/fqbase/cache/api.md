# Cache 模块 API 文档

**模块路径**: `FQBase.Cache`
**源码**: [FQBase/Cache/](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Cache/)
**版本**: 2.7.0

---

## 概述

Cache 模块提供统一的缓存接口，支持 Redis/Memory/MongoDB 等多种缓存后端。

### 架构设计

```
FQBase.Cache
├── LocalCache              # 本地缓存（LRU/FIFO + TTL）
├── RedisCacheAdapter       # Redis 分布式缓存
├── MongoCacheAdapter       # MongoDB 缓存
├── local_cache             # 本地缓存装饰器
├── redis_cache             # Redis 缓存装饰器
├── _interface               # 缓存接口协议
├── config_protocol          # 配置协议定义
├── _serializers             # 序列化工具
├── metrics                  # 缓存监控指标
└── redis_conn              # Redis 连接配置
```

---

## 模块导入

```python
from FQBase.Cache import (
    # 适配器
    LocalCache,
    RedisCacheAdapter,
    MongoCacheAdapter,

    # 装饰器
    local_cache,
    redis_cache,

    # 管理
    get_cache_adapter,
    set_cache_adapter,
    invalidate_cache,
    CacheContext,

    # 工厂
    create_cache,
    init_cache_from_env,

    # 接口协议
    CacheInterface,
    CacheConfigProtocol,

    # 监控
    CacheMetrics,
    CacheMetricsCollector,
)
```

---

## CacheInterface 缓存接口协议

所有缓存适配器必须实现此接口。

```python
from FQBase.Cache import CacheInterface
```

### 方法签名

| 方法 | 说明 |
|------|------|
| `get(key, default=None)` | 获取缓存值 |
| `set(key, value, ttl=None)` | 设置缓存值 |
| `delete(key)` | 删除缓存 |
| `exists(key)` | 检查键是否存在 |
| `clear()` | 清空所有缓存 |
| `ttl(key)` | 获取剩余生存时间 |
| `expire(key, ttl)` | 设置过期时间 |
| `get_many(keys)` | 批量获取 |
| `set_many(mapping, ttl)` | 批量设置 |
| `delete_many(keys)` | 批量删除 |

---

## LocalCache 本地缓存

本地内存缓存实现，支持 LRU/FIFO 驱逐策略和 TTL 过期。

### 初始化参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `name` | `str` | `'default'` | 缓存名称，用于单例标识 |
| `maxsize` | `int` | `128` | 最大缓存条目数 |
| `ttl` | `int` | `0` | 过期时间（秒），0 表示永不过期 |
| `eviction` | `str` | `'lru'` | 驱逐策略：`'lru'` 或 `'fifo'` |
| `singleton` | `bool` | `True` | 是否启用单例模式 |

### 基本操作

```python
cache = LocalCache(name='my_cache', maxsize=128, ttl=3600)

cache.set('key', 'value')
value = cache.get('key')                    # 'value'
cache.exists('key')                          # True
cache.ttl('key')                            # 3600
cache.expire('key', 7200)                   # 设置新的过期时间
cache.delete('key')                         # True
cache.clear()                               # 清空所有
```

### 批量操作

```python
# 批量设置
cache.set_many({'key1': 'value1', 'key2': 'value2'}, ttl=3600)

# 批量获取
result = cache.get_many(['key1', 'key2', 'key3'])
# {'key1': 'value1', 'key2': 'value2'}

# 批量删除
cache.delete_many(['key1', 'key2'])
```

### 统计信息

```python
cache.stats
# {
#     'name': 'my_cache',
#     'maxsize': 128,
#     'ttl': 3600,
#     'eviction': 'lru',
#     'size': 10,
#     'hits': 100,
#     'misses': 20,
#     'hit_rate': '83.33%'
# }
```

### 魔术方法

```python
len(cache)          # 返回缓存条目数
'key' in cache     # 检查键是否存在
```

### 后台清理线程

```python
# 启动清理线程
LocalCache.start_cleanup_thread(interval=300)

# 停止清理线程
LocalCache.stop_cleanup_thread()

# 手动清理过期实例
LocalCache.cleanup_expired_instances()
```

### 使用示例

```python
from FQBase.Cache import LocalCache

# 基本 LRU 缓存
cache = LocalCache(name='user_cache', maxsize=100)
cache.set('user:1', {'name': '张三', 'age': 30})
user = cache.get('user:1')

# 带 TTL 过期
session_cache = LocalCache(name='session', maxsize=1000, ttl=3600)
session_cache.set('session:abc', {'user_id': 1})

# FIFO 驱逐策略
cache_fifo = LocalCache(name='fifo', maxsize=10, eviction='fifo')

# 非单例模式
cache_multi = LocalCache(name='temp', singleton=False)
```

---

## RedisCacheAdapter Redis 缓存适配器

分布式缓存适配器，支持 Redis 后端，自动序列化 pandas/numpy 数据。

### 初始化参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `host` | `str` | `'localhost'` | Redis 主机 |
| `port` | `int` | `6379` | Redis 端口 |
| `db` | `int` | `0` | 数据库编号 |
| `password` | `Optional[str]` | `None` | 密码 |
| `name` | `str` | `'redis'` | 适配器名称 |
| `prefix` | `str` | `'fqcache:'` | 键前缀，用于命名空间隔离 |
| `pickle_first` | `bool` | `False` | 反序列化时优先尝试 pickle |
| `safe_mode` | `bool` | `False` | 安全模式，限制可反序列化的类型 |

### 基本操作

```python
redis = RedisCacheAdapter(host='localhost', port=6379, prefix='fqcache:')

redis.set('key', 'value', ttl=3600)
value = redis.get('key')
redis.exists('key')
redis.ttl('key')
redis.expire('key', 7200)
redis.delete('key')
redis.clear()
```

### 批量操作

```python
redis.set_many({'key1': 'value1', 'key2': 'value2'}, ttl=3600)
result = redis.get_many(['key1', 'key2', 'key3'])
redis.delete_many(['key1', 'key2'])
```

### Hash 操作

```python
redis.hset('user:1', 'name', '张三')
redis.hset('user:1', 'age', '30')
redis.hget('user:1', 'name')                # '张三'
redis.hmset('user:1', {'city': '北京', 'phone': '123'})
redis.hmget('user:1', 'name', 'city')       # ['张三', '北京']
redis.hgetall('user:1')                     # {'name': '张三', 'age': '30', 'city': '北京', 'phone': '123'}
redis.hvals('user:1')                       # ['张三', '30', '北京', '123']
redis.hkeys('user:1')                       # ['name', 'age', 'city', 'phone']
redis.hdel('user:1', 'phone')
```

### List 操作

```python
redis.lpush('queue', 'task1', 'task2', 'task3')
redis.rpush('queue', 'task4')
redis.lrange('queue', 0, -1)                # ['task3', 'task2', 'task1', 'task4']
redis.lpop('queue')                          # 'task3'
redis.rpop('queue')                          # 'task4'
```

### Set 操作

```python
redis.sadd('tags', 'python', 'redis', 'cache')
redis.smembers('tags')                       # {'python', 'redis', 'cache'}
redis.sismember('tags', 'python')           # True
redis.scard('tags')                          # 3
redis.srem('tags', 'cache')
```

### 键操作

```python
redis.keys('user:*')                         # 获取匹配的键
redis.keys('*', limit=100)                  # 限制返回数量
```

### 健康检查

```python
redis.ping()                                # True/False
redis.health_check()                         # True/False
```

### 使用示例

```python
from FQBase.Cache import RedisCacheAdapter

redis = RedisCacheAdapter(host='localhost', port=6379, prefix='stock:')

# 基本操作
redis.set('price:600000', 12.50, ttl=60)
price = redis.get('price:600000')

# Hash 存储用户信息
redis.hmset('user:123', {'name': '张三', 'balance': 10000.0})

# 队列操作
redis.lpush('tasks', 'download', 'process', 'upload')

# 集合操作
redis.sadd('watchlist:600000', 'user1', 'user2', 'user3')
```

---

## MongoCacheAdapter MongoDB 缓存适配器

使用 MongoDB 作为缓存存储的适配器。

### 初始化参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `host` | `str` | `'localhost'` | MongoDB 主机 |
| `port` | `int` | `27017` | MongoDB 端口 |
| `database` | `str` | `'fquant_cache'` | 数据库名 |
| `collection` | `str` | `'cache'` | 集合名 |
| `username` | `Optional[str]` | `None` | 用户名 |
| `password` | `Optional[str]` | `None` | 密码 |
| `prefix` | `str` | `'fqcache:'` | 键前缀 |

### 基本操作

```python
mongo = MongoCacheAdapter(
    host='localhost',
    port=27017,
    database='fqcache',
    collection='data'
)

mongo.set('key', {'data': 'value'}, ttl=3600)
value = mongo.get('key')
mongo.delete('key')
mongo.clear()
mongo.ping()
```

### 批量操作

```python
mongo.set_many({'key1': 'value1', 'key2': 'value2'}, ttl=3600)
result = mongo.get_many(['key1', 'key2', 'key3'])
mongo.delete_many(['key1', 'key2'])
```

---

## 缓存装饰器

### local_cache 本地缓存装饰器

```python
@local_cache(maxsize=128, ttl=3600)
def get_stock_price(code: str, date: str):
    """从数据库或网络获取股票价格"""
    return fetch_from_database(code, date)

# 第一次调用，触发实际计算
price1 = get_stock_price('000001', '2026-03-29')

# 第二次调用，直接从缓存返回
price2 = get_stock_price('000001', '2026-03-29')

# 查看统计
print(get_stock_price.cache_stats)

# 清空缓存
get_stock_price.cache_clear()
```

### redis_cache Redis 缓存装饰器

```python
from FQBase.Cache import redis_cache, set_cache_adapter, RedisCacheAdapter

# 设置全局缓存适配器
set_cache_adapter(RedisCacheAdapter(host='localhost', port=6379))

@redis_cache(ttl=3600, key_prefix='stock_price')
def get_stock_price(code: str, date: str):
    """从数据库或网络获取股票价格"""
    return fetch_from_database(code, date)

# 支持异步函数
@redis_cache(ttl=600)
async def fetch_remote_data(url: str):
    async with aiohttp.get(url) as response:
        return await response.json()
```

---

## 全局缓存管理

### init_cache_adapter 初始化全局缓存

```python
from FQBase.Cache import init_cache_adapter

# 初始化全局缓存适配器
# 从 .env 读取 CACHE_TYPE 配置
# 自动降级：Redis → Memory
init_cache_adapter()
```

### set_cache_adapter / get_cache_adapter

```python
from FQBase.Cache import (
    set_cache_adapter,
    get_cache_adapter,
    RedisCacheAdapter,
)

# 设置全局缓存
set_cache_adapter(RedisCacheAdapter(host='localhost', port=6379))

# 获取全局缓存
adapter = get_cache_adapter()
```

### register_cache_adapter 注册自定义缓存适配器

```python
from FQBase.Cache import register_cache_adapter, create_cache, CacheInterface

class CustomCacheAdapter(CacheInterface):
    """自定义缓存适配器"""
    def __init__(self, config):
        self._cache = {}

    def get(self, key, default=None):
        return self._cache.get(key, default)

    def set(self, key, value, ttl=None):
        self._cache[key] = value
        return True

    # ... 实现其他接口方法

# 注册自定义缓存类型
register_cache_adapter('custom', lambda cfg: CustomCacheAdapter(cfg))

# 使用自定义缓存
config = CacheConfig(cache_type='custom')
cache = create_cache(config)
```

### CacheContext 上下文管理器

```python
from FQBase.Cache import CacheContext, get_cache_adapter

# 临时替换全局缓存
with CacheContext(my_redis_adapter):
    get_cache_adapter().set('key', 'value')

# 仅保存/恢复当前全局缓存
with CacheContext():
    get_cache_adapter().get('key')
```

### invalidate_cache 使缓存失效

```python
from FQBase.Cache import invalidate_cache

# 清空所有缓存
invalidate_cache('*')

# 按模式失效
invalidate_cache('user:*')
```

### create_cache / init_cache_from_env 工厂函数

```python
from FQBase.Cache import create_cache, init_cache_from_env, CacheConfig

# 从配置创建
config = CacheConfig(
    cache_type='redis',
    prefix='fqcache:',
    ttl_default=3600,
    redis_host='localhost',
    redis_port=6379,
)
cache = create_cache(config)

# 从环境变量初始化
cache = init_cache_from_env()
```

---

## 缓存配置

### CacheConfig

```python
from FQBase.Config.core.cache_config import CacheConfig, get_cache_config

config = CacheConfig.from_env()
# 或
config = CacheConfig(
    cache_type='redis',
    prefix='fqcache:',
    ttl_default=3600,
    redis_host='localhost',
    redis_port=6379,
    redis_db=0,
    redis_password=None
)
```

---

## 缓存监控

### CacheMetrics 缓存指标数据类

```python
from FQBase.Cache.metrics import CacheMetrics

metrics = CacheMetrics(hits=100, misses=20)
print(metrics.hit_rate)      # 0.8333
print(metrics.miss_rate)       # 0.1667
print(metrics.to_dict())
```

### CacheMetricsCollector 缓存指标收集器

```python
from FQBase.Cache.metrics import CacheMetricsCollector

collector = CacheMetricsCollector('my_cache')

collector.record_hit()
collector.record_miss()
collector.record_eviction()
collector.record_error()

# 获取指标
metrics = collector.metrics
# CacheMetrics(hits=10, misses=2, evictions=0, errors=0, total_calls=12)

# 获取完整报告
report = collector.get_full_report()
# {
#     'name': 'my_cache',
#     'metrics': {...},
#     'operation_stats': {...}
# }

# 重置指标
collector.reset()
```

---

## 序列化工具

### serialize_value / deserialize_value

```python
from FQBase.Cache._serializers import serialize_value, deserialize_value

# 序列化
data = serialize_value({'key': 'value'})  # bytes

# 反序列化
value = deserialize_value(data)

# 安全模式
value = deserialize_value(data, safe_mode=True)
```

### 安全序列化

```python
from FQBase.Cache._serializers import (
    serialize_value_secure,
    deserialize_value_secure,
)

# 安全序列化（带签名）
data = serialize_value_secure({'key': 'value'})

# 安全反序列化（验证签名）
value = deserialize_value_secure(data)
```

---

## 缓存选择指南

| 场景 | 推荐 | 说明 |
|------|------|------|
| 单进程本地缓存 | `LocalCache` | 支持 LRU + TTL |
| 多进程共享缓存 | `RedisCacheAdapter` | 分布式缓存 |
| MongoDB 已有项目 | `MongoCacheAdapter` | 复用 MongoDB |
| 函数结果缓存（本地） | `@local_cache` | 装饰器自动管理 |
| 函数结果缓存（分布式） | `@redis_cache` | 装饰器自动管理 |

---

## 相关文档

- [Cache Prefix 使用场景](./Cache_Prefix_使用场景.md)
- [cache_adapters](./cache_adapters.md) - 详细的适配器 API 文档
- [CacheAdapters 与 DirectRedis 比较](./cache_adapters_directredis.md) - RedisCacheAdapter 与 DirectRedis 对比及迁移
- [CacheAdapters 与 JsonStorage 比较](./cache_adapters_jsonstorage.md) - RedisCacheAdapter 与 JsonStorage 对比
