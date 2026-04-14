---
title: Cache - API 参考
description: Cache 模块 API 参考文档
tag:
  - fqbase
  - cache

summary:
  purpose: api-reference
  core_classes:
    - LocalCache
    - RedisCacheAdapter
    - MongoCacheAdapter
  core_functions:
    - local_cache
    - redis_cache
    - init_cache_adapter
    - get_cache_adapter
    - set_cache_adapter
    - invalidate_cache
---

# Cache - API 参考

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → [设计原则](./design.md) → **[API参考](./api.md)** → [开发指南](./development.md) → [最佳实践](./best-practices.md) |

## 类

### LocalCache

**位置：** `FQBase/Cache/CacheAdapters.py`

**描述：** 本地内存缓存实现，采用 LRU/FIFO 驱逐策略，支持 TTL 过期。内部使用 OrderedDict 存储，使用 threading.Lock 保证线程安全。采用单例模式，相同 (name, maxsize, ttl, eviction) 配置共享实例。

```python
from FQBase.Cache import LocalCache

# 创建缓存实例
cache = LocalCache(name='my_cache', maxsize=128, ttl=300, eviction='lru')
```

#### 参数

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| name | str | 否 | 'default' | 缓存实例名称，用于单例识别 |
| maxsize | int | 否 | 128 | 最大缓存条目数，超过后触发驱逐 |
| ttl | int | 否 | 0 | 默认 TTL（秒），0 表示永不过期 |
| eviction | str | 否 | 'lru' | 驱逐策略：'lru'（最近最少使用）或 'fifo'（先进先出） |

#### 属性

| 属性 | 类型 | 描述 |
|------|------|------|
| stats | dict | 缓存统计信息，包含 hits（命中次数）、misses（未命中次数）、hit_rate（命中率）、evictions（驱逐次数）等 |

#### 方法

##### get

```python
value = cache.get(key, default=None)
```

**描述：** 获取缓存值，如果缓存不存在或已过期，返回默认值。

**参数：**
| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| key | str | 是 | - | 缓存键 |
| default | Any | 否 | None | 缓存未命中时返回的默认值 |

**返回：** `Any` - 缓存值或默认值

**示例：**
```python
value = cache.get('user:1', default={'name': 'unknown'})
```

---

##### set

```python
cache.set(key, value, ttl=None)
```

**描述：** 设置缓存值。

**参数：**
| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| key | str | 是 | - | 缓存键 |
| value | Any | 是 | - | 缓存值 |
| ttl | int | 否 | None | TTL（秒），覆盖实例默认 TTL，0 表示永不过期 |

**返回：** `None`

**示例：**
```python
cache.set('user:1', {'name': '张三', 'age': 30}, ttl=3600)
```

---

##### delete

```python
deleted = cache.delete(key)
```

**描述：** 删除缓存键。

**参数：**
| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| key | str | 是 | - | 缓存键 |

**返回：** `bool` - True 表示键存在并删除，False 表示键不存在

---

##### clear

```python
cache.clear()
```

**描述：** 清空所有缓存。清除 stats 统计信息。

**返回：** `None`

---

##### get_many

```python
values = cache.get_many(keys)
```

**描述：** 批量获取缓存值。

**参数：**
| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| keys | list[str] | 是 | - | 缓存键列表 |

**返回：** `dict` - 键值对字典，不存在的键不会出现在返回字典中

**示例：**
```python
values = cache.get_many(['user:1', 'user:2', 'user:3'])
# 返回: {'user:1': {...}, 'user:3': {...}}（user:2 不存在则不返回）
```

---

##### set_many

```python
cache.set_many(mapping, ttl=None)
```

**描述：** 批量设置缓存。

**参数：**
| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| mapping | dict | 是 | - | 键值对字典 |
| ttl | int | 否 | None | 默认 TTL（秒） |

**返回：** `None`

---

##### delete_many

```python
cache.delete_many(keys)
```

**描述：** 批量删除缓存。

**参数：**
| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| keys | list[str] | 是 | - | 缓存键列表 |

**返回：** `int` - 删除的键数量

---

##### exists

```python
exists = cache.exists(key)
```

**描述：** 检查键是否存在（且未过期）。

**参数：**
| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| key | str | 是 | - | 缓存键 |

**返回：** `bool` - True 表示存在，False 表示不存在

---

##### ttl

```python
remaining_ttl = cache.ttl(key)
```

**描述：** 获取键的剩余生存时间。

**参数：**
| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| key | str | 是 | - | 缓存键 |

**返回：** `int` - 剩余秒数，-1 表示永不过期，-2 表示键不存在

---

##### expire

```python
cache.expire(key, ttl)
```

**描述：** 设置键的过期时间。

**参数：**
| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| key | str | 是 | - | 缓存键 |
| ttl | int | 是 | - | TTL（秒） |

**返回：** `bool` - True 表示设置成功，False 表示键不存在

---

### RedisCacheAdapter

**位置：** `FQBase/Cache/CacheAdapters.py`

**描述：** Redis 缓存适配器，支持 String、Hash、List、Set 四种数据结构。采用单例模式管理 Redis 连接，通过 prefix 参数支持键隔离。

```python
from FQBase.Cache import RedisCacheAdapter

redis = RedisCacheAdapter(host='localhost', port=6379, db=0, prefix='myapp:')
```

#### 参数

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| host | str | 否 | 'localhost' | Redis 主机地址 |
| port | int | 否 | 6379 | Redis 端口 |
| db | int | 否 | 0 | Redis 数据库编号 |
| password | str | 否 | None | Redis 密码认证 |
| prefix | str | 否 | '' | 键前缀，自动添加到所有键前 |
| pickle_first | bool | 否 | False | 序列化优先级：True 优先使用 pickle，False 优先使用 msgpack |
| safe_mode | bool | 否 | False | 安全模式：True 不使用 pickle（仅 msgpack），False 允许 pickle |
| socket_timeout | int | 否 | 5 | socket 超时时间（秒） |
| socket_connect_timeout | int | 否 | 5 | socket 连接超时（秒） |
| max_connections | int | 否 | 50 | 连接池最大连接数 |

#### 方法

##### ping

```python
is_alive = redis.ping()
```

**描述：** 健康检查，测试 Redis 连接是否正常。

**返回：** `bool` - True 表示连接正常

---

##### get / set

```python
# 设置缓存（支持 TTL）
redis.set('name', 'value', ttl=3600)

# 获取缓存
value = redis.get('name')
```

**String 操作**

| 方法 | 描述 |
|------|------|
| `set(key, value, ttl=None)` | 设置键值，ttl 为过期秒数 |
| `get(key)` | 获取值 |
| `mset(mapping)` | 批量设置 |
| `mget(*keys)` | 批量获取 |
| `delete(key)` | 删除键 |
| `exists(key)` | 检查键是否存在 |
| `expire(key, ttl)` | 设置过期时间 |
| `ttl(key)` | 获取剩余 TTL |

---

##### Hash 操作

```python
# Hash 操作
redis.hset('user:1', 'name', '张三')
redis.hset('user:1', 'age', '30')
value = redis.hget('user:1', 'name')
data = redis.hgetall('user:1')
```

| 方法 | 描述 |
|------|------|
| `hset(name, key, value)` | 设置 Hash 字段 |
| `hmset(name, mapping)` | 批量设置 Hash 字段 |
| `hget(name, key)` | 获取 Hash 字段 |
| `hmget(name, *keys)` | 批量获取 Hash 字段 |
| `hgetall(name)` | 获取所有字段 |
| `hvals(name)` | 获取所有值 |
| `hkeys(name)` | 获取所有键 |
| `hdel(name, *keys)` | 删除字段 |
| `hexists(name, key)` | 检查字段是否存在 |

---

##### List 操作

```python
# List 操作
redis.lpush('queue', 'task1')
redis.rpush('queue', 'task2')
items = redis.lrange('queue', 0, -1)
item = redis.lpop('queue')
item = redis.rpop('queue')
```

| 方法 | 描述 |
|------|------|
| `lpush(name, *values)` | 左侧插入 |
| `rpush(name, *values)` | 右侧插入 |
| `lpop(name)` | 左侧弹出 |
| `rpop(name)` | 右侧弹出 |
| `lrange(name, start, end)` | 范围获取 |
| `llen(name)` | 获取列表长度 |

---

##### Set 操作

```python
# Set 操作
redis.sadd('tags', 'python', 'redis', 'cache')
members = redis.smembers('tags')
is_member = redis.sismember('tags', 'python')
```

| 方法 | 描述 |
|------|------|
| `sadd(name, *values)` | 添加成员 |
| `srem(name, *values)` | 移除成员 |
| `smembers(name)` | 获取所有成员 |
| `sismember(name, value)` | 检查是否为成员 |
| `scard(name)` | 获取成员数量 |
| `spop(name)` | 随机弹出成员 |

---

##### scan

```python
keys = redis.scan(match='user:*', count=100)
```

**描述：** 使用 SCAN 迭代获取匹配的键（替代 KEYS 命令，避免阻塞）。

**参数：**
| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| match | str | 否 | '*' | 键匹配模式 |
| count | int | 否 | 100 | 每次 SCAN 返回的数量 |

**返回：** `list[str]` - 键列表

---

### MongoCacheAdapter

**位置：** `FQBase/Cache/CacheAdapters.py`

**描述：** MongoDB 缓存适配器。

```python
from FQBase.Cache import MongoCacheAdapter

mongo = MongoCacheAdapter(
    connection_string='mongodb://localhost:27017',
    database='cache_db',
    collection='cache_collection',
    ttl=3600
)
```

#### 参数

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| connection_string | str | 是 | - | MongoDB 连接字符串 |
| database | str | 是 | - | 数据库名称 |
| collection | str | 是 | - | 集合名称 |
| ttl | int | 否 | 3600 | 默认 TTL（秒） |

---

## 函数

### local_cache

**位置：** `FQBase/Cache/CacheAdapters.py`

```python
from FQBase.Cache import local_cache

@local_cache(maxsize=128, ttl=300)
def expensive_function(arg1, arg2):
    return compute_result(arg1, arg2)
```

**描述：** 本地缓存装饰器，基于 LocalCache 实现。相同 (func, maxsize, ttl) 组合共享缓存。

**参数：**
| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| maxsize | int | 否 | 128 | 最大缓存条目数 |
| ttl | int | 否 | 0 | 默认 TTL（秒） |
| key_ttl_func | Callable | 否 | None | 自定义 TTL 函数，签名为 (func, args, kwargs) -> int |

**返回：** `Callable` - 装饰器函数

---

### redis_cache

**位置：** `FQBase/Cache/CacheAdapters.py`

```python
from FQBase.Cache import redis_cache

@redis_cache(ttl=3600, key_prefix='my_func')
def fetch_data(data_id):
    return api_client.get(f'/data/{data_id}')
```

**描述：** Redis 缓存装饰器，基于 RedisCacheAdapter 实现。支持异步函数。

**参数：**
| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| ttl | int | 否 | 300 | 默认 TTL（秒） |
| key_prefix | str | 否 | '' | 缓存键前缀 |
| key_ttl_func | Callable | 否 | None | 自定义 TTL 函数 |
| pickle_first | bool | 否 | False | 序列化优先级 |

**返回：** `Callable` - 装饰器函数

---

### init_cache_adapter

```python
from FQBase.Cache import init_cache_adapter

init_cache_adapter()
```

**描述：** 从环境变量初始化全局缓存适配器。

**环境变量：**
| 变量 | 描述 |
|------|------|
| CACHE_TYPE | 缓存类型：'redis'、'mongo'、'local' |
| REDIS_HOST | Redis 主机地址 |
| REDIS_PORT | Redis 端口 |
| REDIS_DB | Redis 数据库编号 |
| REDIS_PASSWORD | Redis 密码 |
| MONGO_URI | MongoDB 连接字符串 |
| MONGO_DB | MongoDB 数据库名称 |

**返回：** `None`

---

### get_cache_adapter

```python
adapter = get_cache_adapter()
```

**描述：** 获取全局缓存适配器（通过 init_cache_adapter 或 set_cache_adapter 设置）。

**返回：** `RedisCacheAdapter | MongoCacheAdapter | LocalCache | None`

---

### set_cache_adapter

```python
from FQBase.Cache import set_cache_adapter, RedisCacheAdapter

adapter = RedisCacheAdapter(host='localhost', port=6379)
set_cache_adapter(adapter)
```

**描述：** 设置全局缓存适配器。

**参数：**
| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| adapter | CacheInterface | 是 | - | 缓存适配器实例 |

**返回：** `None`

---

### invalidate_cache

```python
from FQBase.Cache import invalidate_cache

invalidate_cache(key_pattern='user:*')
```

**描述：** 使缓存失效，支持模式匹配。

**参数：**
| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| key_pattern | str | 否 | '*' | 键匹配模式，使用 Redis SCAN 或本地过滤 |

**返回：** `bool` - 是否成功 |

---

## 异常

| 异常 | 描述 |
|------|------|
| CacheError | 缓存操作基础异常 |
| ConnectionError | 连接失败异常 |
| SerializationError | 序列化/反序列化异常 |

---

## 相关文档

- [使用指南](./usage.md)
- [开发指南](./development.md)
- [最佳实践](./best-practices.md)
- [CacheAdapters 与 DirectRedis 比较](./cache_adapters_directredis.md)
- [CacheAdapters 与 JsonStorage 比较](./cache_adapters_jsonstorage.md)
- [三种缓存机制的场景化对比分析](./cache_comparison.md)
- [Cache Prefix 使用场景](./Cache_Prefix_使用场景.md)
