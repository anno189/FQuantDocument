---
title: Cache - 性能调优
description: Cache 模块性能优化指南
tag:
  - fqbase
  - cache
---

# Cache - 性能调优

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → [安全指南](./security.md) → [故障排查](./troubleshooting.md) → [常见问题](./faq.md) → **[性能调优](./performance.md)** |
| 🟠 架构师 | [README](./README.md) → [技术架构](./architecture.md) → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) → [决策指南](./decision-guide.md) → [案例研究](./case-studies.md) → **[性能调优](./performance.md)** |

## 概述

本指南介绍 Cache 模块的性能优化技巧。

## 性能指标

### 关键指标

| 指标 | LocalCache | RedisCacheAdapter | 目标 |
|------|------------|-------------------|------|
| 延迟 | ~100ns | ~1-10ms | LocalCache: < 1μs, Redis: < 10ms |
| 吞吐量 | > 100万 ops/s | > 1万 ops/s | > 10000 ops/s |
| 内存使用 | 受进程内存限制 | Redis 服务器内存 | < 可用内存 50% |

## 优化策略

### 1. 使用本地缓存

**场景：** 单进程场景优先使用 LocalCache

```python
# 本地缓存延迟更低
@local_cache(maxsize=128, ttl=300)
def get_local_data():
    return compute()
```

### 2. 使用批量操作

```python
# ❌ 不好：多次网络往返
for key in keys:
    cache.set(key, values[key])

# ✅ 好：批量操作
cache.set_many(values)

# ❌ 不好：多次网络往返
for key in keys:
    cache.get(key)

# ✅ 好：批量获取
values = cache.get_many(keys)
```

### 3. 连接池配置

```python
redis = RedisCacheAdapter(
    host='localhost',
    port=6379,
    max_connections=50,  # 增加连接数
    socket_timeout=5
)
```

### 4. 使用 Pipeline

```python
# Pipeline 减少网络往返
pipe = redis._client.pipeline()
pipe.get('key1')
pipe.get('key2')
pipe.get('key3')
results = pipe.execute()
```

### 5. 合理设置 maxsize

```python
# 根据内存和访问模式设置
cache = LocalCache(
    maxsize=1000,  # 估算：条目数 * 平均大小 < 可用内存 50%
    ttl=3600
)
```

### 6. 选择合适的序列化

```python
# 优先使用 msgpack（更快）
redis = RedisCacheAdapter(pickle_first=False)

# 数据量大时使用 pickle（更紧凑）
redis = RedisCacheAdapter(pickle_first=True)
```

---

## 相关文档

- [API参考](./api.md)
- [最佳实践](./best-practices.md)
- [技术架构](./architecture.md)
