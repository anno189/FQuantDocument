---
title: Cache - 使用指南
description: Cache 详细使用指南
tag:
  - fquant
  - fqbase
  - cache

summary:
  purpose: usage
---

# Cache - 使用指南

## 阅读路径

🔵 **开发者**：README → api → usage → concepts → examples

## 概述

本指南详细说明如何在各种场景下使用 Cache 模块。

## 基本用法

### 创建缓存实例

```python
from FQBase.Cache import create_cache, LocalCache, RedisCacheAdapter

# 工厂方法（自动选择后端）
cache = create_cache()

# 直接创建 LocalCache
local_cache = LocalCache(name="my_cache", ttl=3600)

# 直接创建 Redis 缓存
redis_cache = RedisCacheAdapter()
```

### 基本操作

```python
cache = create_cache()

# 设置缓存
cache.set("key", "value", ttl=3600)

# 获取缓存
value = cache.get("key", default="default_value")

# 删除缓存
cache.delete("key")

# 清空所有缓存
cache.clear()
```

## 常见用例

### 用例 1: 使用 @redis_cache 装饰器

**场景：** 缓存函数结果，避免重复计算

```python
from FQBase.Cache import redis_cache, init_cache_adapter

init_cache_adapter()

@redis_cache(ttl=300, key_prefix="stock")
def get_stock_price(code):
    return fetch_price_from_api(code)

# 获取股票价格（首次调用）
price = get_stock_price("000001")

# 后续调用在 TTL 有效期内返回缓存结果
price = get_stock_price("000001")
```

### 用例 2: 动态 TTL

**场景：** 根据参数动态设置缓存时间

```python
@redis_cache(ttl=300, key_ttl_func=lambda symbol, date: 3600 if date > "2024-01-01" else 86400)
def get_market_data(symbol, date):
    return fetch_market_data(symbol, date)
```

### 用例 3: 全局缓存适配器

**场景：** 在多个模块间共享缓存

```python
from FQBase.Cache import get_cache_adapter, set_cache_adapter

# 模块 A
adapter = get_cache_adapter()
adapter.set("shared_key", "shared_value")

# 模块 B
adapter = get_cache_adapter()
value = adapter.get("shared_key")
```

### 用例 4: 缓存上下文管理器

**场景：** 临时切换缓存适配器

```python
from FQBase.Cache import CacheContext, LocalCache

default_adapter = get_cache_adapter()

with CacheContext(LocalCache(name="temp")):
    cache = get_cache_adapter()
    cache.set("temp_key", "temp_value")

# 退出上下文后恢复原适配器
```

### 用例 5: 缓存清除和统计

**场景：** 管理缓存生命周期

```python
@redis_cache(ttl=300, key_prefix="data")
def fetch_data():
    return expensive_operation()

# 获取缓存统计
stats = fetch_data.cache_stats()
print(f"缓存键数量: {stats['keys']}")

# 清除缓存
fetch_data.cache_clear()
```

## 异步支持

```python
from FQBase.Cache import redis_cache, init_cache_adapter

init_cache_adapter()

@redis_cache(ttl=300)
async def fetch_async_data(url):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.json()
```

## 错误处理

```python
from FQBase.Cache import (
    get_cache_adapter,
    CacheError,
    CacheConnectionError,
    CacheSerializationError,
)

try:
    adapter = get_cache_adapter()
    adapter.set("key", {"data": "value"})
except CacheConnectionError:
    print("缓存连接失败，使用降级方案")
except CacheSerializationError:
    print("数据序列化失败")
except CacheError as e:
    print(f"缓存错误: {e}")
```

## 相关文档

- [API参考](./api.md)
- [最佳实践](./best-practices.md)
- [故障排查](./troubleshooting.md)
