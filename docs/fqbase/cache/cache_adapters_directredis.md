# CacheAdapters 与 DirectRedis 比较

**模块路径**: `FQBase.Cache.CacheAdapters`
**源码**: [CacheAdapters.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Cache/CacheAdapters.py)

---

## 一、DirectRedis 概述

DirectRedis 是旧版 FQuant 系统使用的 Redis 客户端，目前仍在多个文件中使用。继承自 `redis.Redis`，提供基础的 Redis 操作。

## 二、功能对比

| 特性 | DirectRedis | RedisCacheAdapter |
|------|-------------|-------------------|
| 继承自 | `redis.Redis` | 自定义实现 |
| 连接管理 | 需自行管理 | 自动连接 + 单例客户端 |
| 连接池 | ❌ 不支持 | ✅ 可配合 `connection_pool.py` |
| 健康检查 | ❌ 不支持 | ✅ `ping()` |
| 单例模式 | ❌ | ✅ 内部单例 |
| CacheInterface 接口 | ❌ | ✅ 实现 |
| pandas/numpy 支持 | ✅ | ✅ |
| String 操作 | ✅ | ✅ |
| Hash 操作 | ✅ | ✅ |
| List 操作 | ✅ | ✅ |
| Set 操作 | ✅ | ✅ |
| Pipeline 批量操作 | ❌ | ✅ |
| SCAN 迭代 | ❌ | ✅ |
| TTL 支持 | ✅ | ✅ |

## 三、API 对比

### String 操作

| 操作 | DirectRedis | RedisCacheAdapter |
|------|-------------|-------------------|
| `set` | ✅ | ✅ (支持 TTL) |
| `get` | ✅ | ✅ |
| `mset` | ✅ | ✅ (支持 TTL) |
| `mget` | ✅ | ✅ |

### Hash 操作

| 操作 | DirectRedis | RedisCacheAdapter |
|------|-------------|-------------------|
| `hset` | ✅ | ✅ |
| `hget` | ✅ | ✅ |
| `hmset` | ✅ | ✅ (使用 pipeline) |
| `hmget` | ✅ | ✅ |
| `hgetall` | ✅ | ✅ |
| `hvals` | ✅ | ✅ |
| `hkeys` | ✅ | ✅ |
| `hdel` | ✅ | ✅ |

### List 操作

| 操作 | DirectRedis | RedisCacheAdapter |
|------|-------------|-------------------|
| `lpush` | ✅ | ✅ |
| `rpush` | ✅ | ✅ |
| `lpop` | ✅ | ✅ |
| `rpop` | ✅ | ✅ |
| `lrange` | ✅ | ✅ |
| `llen` | ✅ | ❌ |

### Set 操作

| 操作 | DirectRedis | RedisCacheAdapter |
|------|-------------|-------------------|
| `sadd` | ✅ | ✅ |
| `srem` | ✅ | ✅ |
| `smembers` | ✅ | ✅ |
| `sismember` | ✅ | ✅ |
| `scard` | ✅ | ✅ |
| `spop` | ✅ | ❌ |

## 四、替代用法

### 基本操作

```python
# DirectRedis 旧代码
from direct_redis import DirectRedis
r = DirectRedis(host='localhost', port=6379)
r.set('key', 'value')
value = r.get('key')

# RedisCacheAdapter 新代码
from FQBase.Cache.CacheAdapters import RedisCacheAdapter
redis = RedisCacheAdapter(host='localhost', port=6379)
redis.set('key', 'value')
value = redis.get('key')
```

### Hash 操作

```python
# DirectRedis 旧代码
r.hset('hash', 'field', 'value')
r.hmset('hash', {'a': 1, 'b': 2})
r.hgetall('hash')

# RedisCacheAdapter 新代码
redis.hset('hash', 'field', 'value')
redis.hmset('hash', {'a': 1, 'b': 2})
redis.hgetall('hash')
```

### List 操作

```python
# DirectRedis 旧代码
r.lpush('queue', 'task1')
r.lrange('queue', 0, -1)

# RedisCacheAdapter 新代码
redis.lpush('queue', 'task1')
redis.lrange('queue', 0, -1)
```

### Set 操作

```python
# DirectRedis 旧代码
r.sadd('set', 'member1')
r.smembers('set')
r.sismember('set', 'member1')

# RedisCacheAdapter 新代码
redis.sadd('set', 'member1')
redis.smembers('set')
redis.sismember('set', 'member1')
```

## 五、迁移建议

1. **渐进式迁移**：新旧代码可以共存，逐步替换
2. **注意 prefix 差异**：DirectRedis 可能使用 prefix，RedisCacheAdapter 统一不添加 prefix
3. **统一序列化**：RedisCacheAdapter 自动处理 pandas/numpy 序列化

---

## 相关文档

| 文档 | 说明 |
|------|------|
| [CacheAdapters API](./cache_adapters.md) | 缓存适配器完整 API |
| [CacheAdapters 与 JsonStorage 比较](./cache_adapters_jsonstorage.md) | RedisCacheAdapter 与 JsonStorage 对比 |
| [API 文档](api.md) | 模块 API 参考 |
| [应用示例](examples.md) | 10 个应用场景代码示例 |
| [Cache Prefix 使用场景](Cache_Prefix_使用场景.md) | prefix 隔离策略详解 |
| [架构文档](architecture.md) | 架构设计、组件关系 |
| [设计文档](design.md) | 设计决策、权衡分析 |
