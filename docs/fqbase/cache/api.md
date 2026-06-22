---
title: Cache - API参考
description: Cache API 参考文档
tag:
  - fquant
  - fqbase
  - cache

summary:
  purpose: api-reference
  core_classes:
    - LocalCache
    - RedisCacheAdapter
    - MongoCacheAdapter
    - CacheContext
  core_functions:
    - create_cache
    - init_cache_adapter
    - init_cache_from_env
    - get_cache_adapter
    - set_cache_adapter
    - invalidate_cache
    - redis_cache
    - local_cache
    - register_cache_adapter
---

# Cache - API参考

## 阅读路径

🔵 **开发者**：README → api → usage → concepts → examples

## 类

### LocalCache

**位置：** `Cache/local_cache.py#L26`

**描述：** 本地内存缓存实现

```python
from FQBase.Cache import LocalCache

cache = LocalCache(name="my_cache", ttl=3600, singleton=True)
cache.set("key", "value")
value = cache.get("key")
```

#### 参数

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| name | str | 是 | - | 缓存名称 |
| ttl | int | 否 | 0 | 默认过期时间（秒），0 表示永不过期 |
| singleton | bool | 否 | False | 是否单例模式 |

#### 方法

##### set

```python
cache.set(key, value, ttl=None)
```

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| key | str | 是 | - | 缓存键 |
| value | Any | 是 | - | 缓存值 |
| ttl | int | 否 | None | 过期时间（秒） |

##### get

```python
value = cache.get(key, default=None)
```

##### delete

```python
cache.delete(key)
```

##### clear

```python
cache.clear()
```

##### keys

```python
keys = cache.keys(pattern="*")
```

##### get_many

```python
result = cache.get_many(keys)
```

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| keys | List[str] | 是 | - | 缓存键列表 |

**返回：** `Dict[str, Any]` - 存在的键值对

##### set_many

```python
cache.set_many(mapping, ttl=None)
```

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| mapping | Dict[str, Any] | 是 | - | 键值对字典 |
| ttl | int | 否 | None | 过期时间（秒） |

##### delete_many

```python
cache.delete_many(keys)
```

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| keys | List[str] | 是 | - | 缓存键列表 |

**返回：** `bool` - 是否至少删除了一个键

##### exists

```python
result = cache.exists(key)
```

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| key | str | 是 | - | 缓存键 |

**返回：** `bool` - 键是否存在且未过期

##### ttl

```python
remaining = cache.ttl(key)
```

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| key | str | 是 | - | 缓存键 |

**返回：** `int` - 剩余生存时间（秒），-1 表示永久，-2 表示不存在

##### expire

```python
cache.expire(key, ttl)
```

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| key | str | 是 | - | 缓存键 |
| ttl | int | 是 | - | 过期时间（秒） |

**返回：** `bool` - 是否设置成功

##### cleanup_expired

```python
count = cache.cleanup_expired()
```

**返回：** `int` - 清理的缓存项数量

##### stats

```python
stats = cache.stats
```

**返回：** `Dict[str, Union[str, int, float]]` - 缓存统计信息，包含 name, maxsize, ttl, eviction, size, hits, misses, hit_rate

##### has_key

```python
result = cache.has_key(key)
```

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| key | str | 是 | - | 缓存键 |

**返回：** `bool` - 键是否存在且未过期（不触发过期删除）

---

### RedisCacheAdapter

**位置：** `Cache/redis_adapter.py#L198`

**描述：** Redis 缓存适配器

```python
from FQBase.Cache import RedisCacheAdapter

adapter = RedisCacheAdapter()
adapter.set("key", "value", ttl=3600)
```

#### 参数

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| config | RedisConfigProtocol | 否 | None | Redis 配置 |

#### 方法

##### ping

```python
result = adapter.ping()
```

**返回：** `bool` - Redis 连接是否正常

##### get

```python
value = adapter.get(key, default=None)
```

##### set

```python
adapter.set(key, value, ttl=None)
```

##### delete_many

```python
adapter.delete_many(keys)
```

---

### MongoCacheAdapter

**位置：** `Cache/mongo_adapter.py#L22`

**描述：** MongoDB 缓存适配器

```python
from FQBase.Cache import MongoCacheAdapter

adapter = MongoCacheAdapter()
adapter.set("key", "value", ttl=3600)
```

---

## 函数

### create_cache

**位置：** `Cache/__init__.py#L83`

```python
from FQBase.Cache import create_cache

cache = create_cache(config=None)
```

**描述：** 根据配置创建缓存适配器（工厂方法）

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| config | CacheConfigProtocol | 否 | None | 缓存配置 |

**返回：** `CacheInterface` - 缓存适配器实例

---

### init_cache_adapter

**位置：** `Cache/CacheAdapters.py#L217`

```python
from FQBase.Cache import init_cache_adapter

init_cache_adapter()
```

**描述：** 从环境变量初始化全局缓存适配器，失败时降级到 Memory

---

### get_cache_adapter

**位置：** `Cache/CacheAdapters.py#L256`

```python
from FQBase.Cache import get_cache_adapter

adapter = get_cache_adapter()
```

**描述：** 获取全局缓存适配器，首次调用时自动初始化

**返回：** `Optional[RedisCacheAdapter]`

---

### set_cache_adapter

**位置：** `Cache/CacheAdapters.py#L243`

```python
from FQBase.Cache import set_cache_adapter

set_cache_adapter(adapter)
```

**描述：** 设置全局缓存适配器

---

### invalidate_cache

**位置：** `Cache/CacheAdapters.py#L267`

```python
from FQBase.Cache import invalidate_cache

invalidate_cache(key_pattern="user:*")
```

**描述：** 使缓存失效

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| key_pattern | str | 否 | * | 缓存键模式 |

---

### redis_cache

**位置：** `Cache/CacheAdapters.py#L132`

```python
from FQBase.Cache import redis_cache

@redis_cache(ttl=300, key_prefix="func")
def my_func(arg):
    return expensive_operation(arg)
```

**描述：** Redis 缓存装饰器，支持异步函数

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| ttl | int | 否 | 300 | 缓存过期时间（秒） |
| key_prefix | str | 否 | "" | 缓存键前缀 |
| key_ttl_func | Callable | 否 | None | 动态 TTL 函数 |

---

### local_cache

**位置：** `Cache/local_cache.py#L488`

```python
from FQBase.Cache import local_cache

@local_cache(ttl=300, maxsize=128)
def cached_func():
    return result
```

**描述：** 本地内存缓存装饰器，基于 LocalCache 实现

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| maxsize | int | 否 | 128 | 最大缓存条目数 |
| ttl | int | 否 | 0 | 过期时间（秒），0 表示不过期 |
| key_ttl_func | Callable | 否 | None | 动态 TTL 函数 |

**附加属性：**

| 属性 | 类型 | 描述 |
|------|------|------|
| cache_clear | Callable | 清除缓存 |
| cache_stats | Dict | 缓存统计信息 |

---

### init_cache_from_env

**位置：** `Cache/__init__.py#L111`

```python
from FQBase.Cache import init_cache_from_env

adapter = init_cache_from_env()
```

**描述：** 从环境变量初始化全局缓存（推荐入口）

**返回：** `CacheInterface` - 缓存适配器实例

---

### register_cache_adapter

**位置：** `Cache/__init__.py#L57`

```python
from FQBase.Cache import register_cache_adapter

register_cache_adapter('custom', lambda cfg: CustomAdapter(cfg))
```

**描述：** 注册自定义缓存适配器工厂

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| cache_type | str | 是 | - | 缓存类型标识 |
| factory_func | Callable | 是 | - | 工厂函数，接收 config 返回适配器实例 |

**示例：**

```python
from FQBase.Cache import register_cache_adapter, create_cache

class CustomCacheAdapter:
    def __init__(self, config):
        self._config = config

    def get(self, key):
        return self._backend.get(key)

    def set(self, key, value, ttl=0):
        return self._backend.set(key, value, ttl)

register_cache_adapter('custom', lambda cfg: CustomCacheAdapter(cfg))
cache = create_cache(CustomCacheConfig(cache_type='custom'))
```

---

## 异常

| 异常 | 描述 | 触发条件 | 解决方案 |
|------|------|---------|---------|
| CacheError | 缓存基类异常 | 缓存操作失败 | 检查缓存服务状态 |
| CacheConnectionError | 连接错误 | Redis/MongoDB 连接失败 | 检查服务配置 |
| CacheTimeoutError | 超时错误 | 缓存操作超时 | 增加超时时间 |
| CacheSerializationError | 序列化错误 | 对象无法序列化 | 检查数据类型 |
| CacheKeyError | 键错误 | 缓存键无效 | 检查键格式 |
| CacheOperationError | 操作错误 | 缓存操作失败 | 查看具体错误信息 |

---

## 相关文档

- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
- [配置指南](./configuration.md)
