---
title: Cache - 最佳实践
description: Cache 模块最佳实践与建议
tag:
  - fqbase
  - cache
---

# Cache - 最佳实践

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → [设计原则](./design.md) → [API参考](./api.md) → [开发指南](./development.md) → [使用指南](./usage.md) → **[最佳实践](./best-practices.md)** |
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → [安全指南](./security.md) → [故障排查](./troubleshooting.md) → [常见问题](./faq.md) → **[最佳实践](./best-practices.md)** |

## 概述

本指南汇总使用 Cache 模块的最佳实践，帮助您在实际项目中高效使用缓存。

## 性能最佳实践

### 1. 选择合适的缓存级别

| 场景 | 推荐 | 原因 |
|------|------|------|
| 单进程、低延迟 | `@local_cache` | 无网络开销，延迟最低 |
| 多进程/多实例共享 | `@redis_cache` | 跨进程共享 |
| 简单配置 | `@lru_cache` | Python 内置，无需额外依赖 |

### 2. 使用批量操作

```python
# ❌ 不好：多次网络往返
for key in keys:
    cache.set(key, values[key])

# ✅ 好：批量操作
cache.set_many(values)
```

### 3. 设置合理的 TTL

```python
# 频繁变化的数据
@redis_cache(ttl=60, key_prefix='market')
def get_market_data():
    return fetch_market()

# 相对稳定的数据
@redis_cache(ttl=86400, key_prefix='config')
def get_system_config():
    return load_config()
```

### 4. 使用 prefix 隔离

```python
# 按业务隔离
user_cache = RedisCacheAdapter(prefix='user:')
order_cache = RedisCacheAdapter(prefix='order:')
```

## 安全最佳实践

### 1. 避免缓存穿透

```python
def get_user(user_id):
    cache_key = f"user:{user_id}"
    result = cache.get(cache_key)
    
    if result is not None:
        # 区分"未命中"和"缓存空值"
        if result is NULL_MARKER:
            return None
        return result
    
    user = db.get_user(user_id)
    # 空值也缓存，避免缓存穿透
    cache.set(cache_key, user if user else NULL_MARKER, ttl=300)
    return user
```

### 2. 保护敏感数据

```python
# ❌ 不好：缓存敏感信息
cache.set("user:password:1", "secret")

# ✅ 好：加密或标记
cache.set("user:password:1", encrypt(password))
# 或完全不缓存
```

### 3. 使用安全模式

```python
# 禁用 pickle（仅使用 msgpack）
redis = RedisCacheAdapter(safe_mode=True)
```

## 错误处理最佳实践

### 1. 实现缓存降级

```python
def get_data(key):
    try:
        return cache.get(key)
    except Exception as e:
        logger.warning(f"缓存获取失败: {e}")
        # 降级到数据库
        return db.get(key)
```

### 2. 设置超时

```python
redis = RedisCacheAdapter(
    socket_timeout=5,
    socket_connect_timeout=3
)
```

### 3. 重试机制

```python
from functools import wraps
import time

def retry_on_failure(max_retries=3, delay=1):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for i in range(max_retries):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if i == max_retries - 1:
                        raise
                    time.sleep(delay)
            return None
        return wrapper
    return decorator

@retry_on_failure(max_retries=3)
def get_cached_data(key):
    return cache.get(key)
```

## 配置最佳实践

### 1. 使用环境变量

```bash
# .env
CACHE_TYPE=redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
```

### 2. 使用连接池

```python
redis = RedisCacheAdapter(
    host='localhost',
    port=6379,
    max_connections=50,
    socket_timeout=5
)
```

### 3. 合理设置 maxsize

```python
# LocalCache：根据内存和访问模式设置
cache = LocalCache(
    maxsize=1000,  # 估算：条目数 * 平均大小 < 可用内存 50%
    ttl=3600       # 根据数据更新频率
)
```

## 监控最佳实践

### 1. 监控缓存命中率

```python
def report_cache_stats():
    stats = cache.stats
    metrics.gauge('cache.hits', stats['hits'])
    metrics.gauge('cache.misses', stats['misses'])
    metrics.gauge('cache.hit_rate', float(stats['hit_rate'].rstrip('%')))
```

### 2. 监控内存使用

```python
import psutil
import os

def get_cache_memory():
    process = psutil.Process(os.getpid())
    return process.memory_info().rss
```

---

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [开发指南](./development.md)
- [故障排查](./troubleshooting.md)
- [三种缓存机制对比](./cache_comparison.md)
