# Cache Prefix 使用场景

本文档说明 RedisCacheAdapter 和 MongoCacheAdapter 中 `prefix` 参数的典型使用场景。

## 概述

`prefix` 参数用于在缓存键前添加命名空间隔离，格式为 `prefix + key`。在修复前，`_make_key` 方法未使用 prefix，导致该参数形同虚设。修复后，所有缓存操作都会自动添加 prefix 前缀。

## 使用场景

### 1. 多应用/服务隔离

不同的微服务使用不同的 prefix，避免键冲突：

```python
user_service = RedisCacheAdapter(prefix="user_service:")
order_service = RedisCacheAdapter(prefix="order_service:")

user_service.set("session:123", user_data)    # 实际键: "user_service:session:123"
order_service.set("session:123", order_data)   # 实际键: "order_service:session:123"
```

### 2. 多环境隔离（dev/staging/prod）

开发、测试、生产环境共用一个 Redis 实例时，通过 prefix 隔离：

```python
dev_cache    = RedisCacheAdapter(prefix="dev:fqcache:")
staging_cache = RedisCacheAdapter(prefix="staging:fqcache:")
prod_cache   = RedisCacheAdapter(prefix="prod:fqcache:")
```

### 3. 数据类型隔离

按数据类型划分缓存域，便于分类管理和清理：

```python
stock_cache      = RedisCacheAdapter(prefix="stock:")        # 股票数据
indicator_cache  = RedisCacheAdapter(prefix="indicator:")   # 指标数据
news_cache       = RedisCacheAdapter(prefix="news:")         # 新闻数据

# 清理时只清理股票数据，不影响其他类型
stock_cache.clear()  # 只删除 "stock:*" 键，不会影响 indicator: 和 news: 的缓存
```

### 4. 租户隔离（多租户系统）

SaaS 系统中为每个租户隔离缓存数据：

```python
def get_tenant_cache(tenant_id: str):
    return RedisCacheAdapter(prefix=f"tenant:{tenant_id}:")

cache_a = get_tenant_cache("tenant_001")
cache_b = get_tenant_cache("tenant_002")
```

### 5. 版本控制/灰度发布

API 版本升级时，通过 prefix 隔离不同版本缓存，实现平滑迁移：

```python
v1_cache = RedisCacheAdapter(prefix="api:v1:")
v2_cache = RedisCacheAdapter(prefix="api:v2:")

# 清理旧版本缓存不影响新版本
v1_cache.clear()
```

### 6. 便于调试和问题排查

使用有意义的 prefix，快速定位缓存来源：

```python
cache = RedisCacheAdapter(prefix="fqcache:stock:daily:")

# 在 Redis CLI 中快速过滤查看
# SCAN 0 MATCH "fqcache:stock:daily:*"
```

## 注意事项

1. **prefix 不会自动添加冒号分隔**：如果需要 `fqcache:key` 格式，prefix 应设为 `fqcache:`

2. **clear() 方法受 prefix 限制**：修复后 `clear()` 只删除匹配 `prefix*` 的键，不会影响其他 prefix 的数据

3. **跨 adapter 数据不共享**：不同 prefix 的 adapter 无法访问彼此的缓存

## 相关文档

| 文档 | 说明 |
|------|------|
| [CacheAdapters API](./cache_adapters) | 缓存适配器详细 API |
| [FQBase 缓存层](../cache) | 缓存层概览 |
