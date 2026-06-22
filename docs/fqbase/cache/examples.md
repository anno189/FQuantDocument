---
title: Cache - 案例库
description: Cache 实际应用场景、动手实验与案例研究
tag:
  - fquant
  - fqbase
  - cache

summary:
  purpose: examples
---

# Cache - 案例库

## 阅读路径

🟢🔵 **新手+开发者**：README → examples → api → usage

## 业务场景案例

### 场景 1: API 响应缓存

**业务需求**：缓存频繁访问的 API 响应，减少外部依赖

```python
from FQBase.Cache import redis_cache, init_cache_adapter
import requests

init_cache_adapter()

@redis_cache(ttl=60, key_prefix="api")
def fetch_market_data(symbol):
    response = requests.get(f"https://api.example.com/market/{symbol}")
    return response.json()
```

### 场景 2: 数据库查询缓存

**业务需求**：缓存数据库查询结果，提高查询性能

```python
from FQBase.Cache import create_cache

cache = create_cache()

def get_user_profile(user_id):
    cache_key = f"user:profile:{user_id}"
    profile = cache.get(cache_key)

    if not profile:
        profile = db.users.find_one({"_id": user_id})
        cache.set(cache_key, profile, ttl=3600)

    return profile
```

### 场景 3: 多级缓存策略

**业务需求**：实现 L1（本地）+ L2（Redis）缓存

```python
from FQBase.Cache import LocalCache, RedisCacheAdapter

local_cache = LocalCache(name="L1", ttl=60)
redis_cache = RedisCacheAdapter()

def get_data_with_multilevel_cache(key):
    # L1 查询
    value = local_cache.get(key)
    if value:
        return value

    # L2 查询
    value = redis_cache.get(key)
    if value:
        local_cache.set(key, value)
        return value

    # 回源
    value = fetch_from_db(key)
    redis_cache.set(key, value)
    local_cache.set(key, value)
    return value
```

## 动手实验

### Lab 1: 实现点赞计数器缓存

**目标**：使用 Redis 缓存实现高效的点赞计数

```python
from FQBase.Cache import redis_cache

@redis_cache(ttl=60, key_prefix="likes")
def get_like_count(post_id):
    return db.posts.find_one(post_id)["like_count"]

def increment_like(post_id):
    likes = get_like_count(post_id)
    db.posts.update_one(post_id, {"$inc": {"like_count": 1}})
    get_like_count.cache_clear()
```

**任务**：
1. 添加点赞数上限保护
2. 实现批量获取点赞数

### Lab 2: 实现分布式锁

**目标**：使用缓存实现简单的分布式锁

```python
from FQBase.Cache import get_cache_adapter
import time

def acquire_lock(key, ttl=10):
    adapter = get_cache_adapter()
    lock_key = f"lock:{key}"
    if adapter.get(lock_key) is None:
        adapter.set(lock_key, "1", ttl=ttl)
        return True
    return False

def release_lock(key):
    adapter = get_cache_adapter()
    lock_key = f"lock:{key}"
    adapter.delete(lock_key)

def process_with_lock(key):
    if acquire_lock(key):
        try:
            return do_processing()
        finally:
            release_lock(key)
    else:
        raise Exception("Failed to acquire lock")
```

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
