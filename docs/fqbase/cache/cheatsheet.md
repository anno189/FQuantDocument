---
title: Cache - 速查表
description: Cache 模块快速参考指南
tag:
  - fqbase
  - cache
---

# Cache - 速查表

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → **[速查表](./cheatsheet.md)** → [动手实验室](./workshop.md) → [使用指南](./usage.md) → [案例库](./examples.md) |

## 快速参考

### LocalCache

```python
from FQBase.Cache import LocalCache

cache = LocalCache(name='my_cache', maxsize=128, ttl=300, eviction='lru')
cache.set('key', 'value', ttl=60)
value = cache.get('key', default='default')
cache.delete('key')
cache.clear()
stats = cache.stats
```

### RedisCacheAdapter

```python
from FQBase.Cache import RedisCacheAdapter

redis = RedisCacheAdapter(host='localhost', port=6379, prefix='app:')
redis.set('key', 'value', ttl=3600)
redis.get('key')
redis.hset('hash', 'field', 'value')
redis.hgetall('hash')
redis.lpush('list', 'item')
redis.sadd('set', 'member')
redis.delete('key')
redis.ping()
```

### 装饰器

```python
from FQBase.Cache import local_cache, redis_cache

@local_cache(ttl=300)
def func1(): pass

@redis_cache(ttl=3600, key_prefix='app:')
def func2(): pass
```

---

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
