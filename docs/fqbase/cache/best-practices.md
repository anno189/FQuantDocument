---
title: Cache - 最佳实践
description: Cache 最佳实践与建议
tag:
  - fquant
  - fqbase
  - cache

summary:
  purpose: best-practices
---

# Cache - 最佳实践

## 阅读路径

🔵🟡 **开发者+运维**：README → best-practices → configuration → troubleshooting

## 概述

本文档提供使用 Cache 模块的最佳实践。

## 性能最佳实践

### 技巧 1: 合理选择缓存后端

**建议：** 根据场景选择合适的缓存后端。

| 场景 | 推荐后端 | 原因 |
|------|---------|------|
| 开发环境 | LocalCache | 零依赖、快速 |
| 单进程生产 | LocalCache | 最高性能 |
| 多进程/分布式 | Redis | 跨进程共享 |
| 需要持久化 | MongoDB | 数据持久化 |

### 技巧 2: 合理设置 TTL

**建议：** 根据数据更新频率设置 TTL。

```python
# 实时数据：短 TTL
@redis_cache(ttl=60)
def get_stock_price(symbol):
    return fetch_price(symbol)

# 日数据：长 TTL
@redis_cache(ttl=86400)
def get_daily_summary(date):
    return fetch_summary(date)
```

### 技巧 3: 使用键前缀避免冲突

**建议：** 为不同功能设置不同的键前缀。

```python
@redis_cache(ttl=300, key_prefix="user")
def get_user(user_id):
    pass

@redis_cache(ttl=300, key_prefix="stock")
def get_stock(symbol):
    pass
```

## 错误处理最佳实践

### 使用异常处理

```python
from FQBase.Cache import (
    get_cache_adapter,
    CacheError,
    CacheConnectionError,
    CacheSerializationError,
)

try:
    cache = get_cache_adapter()
    cache.set("key", data)
except CacheConnectionError:
    logger.warning("Redis 连接失败，使用降级方案")
except CacheSerializationError:
    logger.error("数据序列化失败")
except CacheError as e:
    logger.error(f"缓存错误: {e}")
```

## 配置最佳实践

### 使用环境变量

```python
import os
from FQBase.Cache import RedisCacheAdapter, CacheConfig

config = CacheConfig(
    cache_type='redis',
    redis_host=os.getenv('REDIS_HOST', 'localhost'),
    redis_port=int(os.getenv('REDIS_PORT', 6379)),
    redis_password=os.getenv('REDIS_PASSWORD'),
)
```

### 降级策略

```python
def get_cache_with_fallback():
    try:
        return RedisCacheAdapter()
    except CacheConnectionError:
        logger.warning("Redis 不可用，降级到 LocalCache")
        return LocalCache(name="fallback")
```

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [配置指南](./configuration.md)
