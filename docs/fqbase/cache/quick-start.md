---
title: Cache - 快速入门
description: 5分钟快速上手 Cache 模块
tag:
  - fquant
  - fqbase
  - cache

summary:
  purpose: quick-start
  complexity: low
---

# Cache - 快速入门

## 阅读路径

🟢 **新手入门**：README → quick-start → examples → concepts

## 概述

本快速入门指南将帮助您在 5 分钟内理解 Cache 模块并开始使用。

## 前置要求

- Python 3.8+
- Redis（用于 Redis 缓存，可选）
- MongoDB（用于 MongoDB 缓存，可选）

## 5分钟上手

### Step 1: 使用默认缓存（LocalCache）

```python
from FQBase.Cache import create_cache, LocalCache

cache = create_cache()
cache.set("key", "value")
value = cache.get("key")
print(value)  # value
```

### Step 2: 使用 Redis 缓存

```python
from FQBase.Cache import RedisCacheAdapter, CacheConfig

config = CacheConfig(
    cache_type='redis',
    redis_host='localhost',
    redis_port=6379
)
cache = RedisCacheAdapter(config)
cache.set("key", {"data": "value"}, ttl=3600)
```

### Step 3: 使用 @redis_cache 装饰器

```python
from FQBase.Cache import redis_cache, init_cache_adapter

init_cache_adapter()

@redis_cache(ttl=300, key_prefix="user")
def get_user_info(user_id):
    return fetch_from_database(user_id)

user = get_user_info(123)
```

### Step 4: 使用全局缓存适配器

```python
from FQBase.Cache import get_cache_adapter, set_cache_adapter

adapter = get_cache_adapter()
adapter.set("key", "value")

from FQBase.Cache import RedisCacheAdapter
new_adapter = RedisCacheAdapter()
set_cache_adapter(new_adapter)
```

## ⚠️ 常见陷阱

1. **缓存未初始化**
   - ❌ 错误做法：直接使用 `get_cache_adapter()` 但未初始化
   - ✅ 正确做法：先调用 `init_cache_adapter()` 或使用 `create_cache()`

2. **TTL 设置过大**
   - ❌ 错误做法：`cache.set("key", value, ttl=86400 * 30)` 缓存一个月
   - ✅ 正确做法：合理设置 TTL，如 `ttl=3600`（1小时）

3. **键冲突**
   - ❌ 错误做法：使用 `key_prefix=""` 导致不同函数键冲突
   - ✅ 正确做法：设置有意义的 `key_prefix`

## 下一步

- 学习 [核心概念](./concepts.md)
- 阅读 [API参考](./api.md)
- 查看 [使用指南](./usage.md)

## 相关文档

- [README](./README.md)
- [API参考](./api.md)
- [核心概念](./concepts.md)
