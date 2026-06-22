---
title: Cache - 配置指南
description: Cache 配置选项详解与初始化生命周期
tag:
  - fquant
  - fqbase
  - cache

summary:
  purpose: configuration
---

# Cache - 配置指南

## 阅读路径

🟡 **运维**：README → configuration → troubleshooting → best-practices

## 初始化与生命周期

### 初始化

```python
from FQBase.Cache import init_cache_adapter, create_cache

# 方式1: 从环境变量初始化
init_cache_adapter()

# 方式2: 手动创建
from FQBase.Cache import RedisCacheAdapter, CacheConfig
config = CacheConfig(cache_type='redis', redis_host='localhost')
cache = RedisCacheAdapter(config)
```

### 生命周期

| 阶段 | 方法 | 说明 |
|------|------|------|
| 初始化 | `init_cache_adapter()` | 从环境变量初始化全局适配器 |
| 获取 | `get_cache_adapter()` | 获取全局适配器 |
| 设置 | `set_cache_adapter()` | 设置全局适配器 |
| 失效 | `invalidate_cache()` | 使缓存失效 |

## 配置选项

### CacheConfig

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| cache_type | str | memory | 缓存类型：memory/redis/mongo |
| ttl_default | int | 0 | 默认 TTL（秒），0 表示永不过期 |

### RedisConfigProtocol

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| redis_host | str | localhost | Redis 主机 |
| redis_port | int | 6379 | Redis 端口 |
| redis_password | str | None | Redis 密码 |
| redis_db | int | 0 | Redis 数据库编号 |
| redis_max_connections | int | 50 | 最大连接数 |
| redis_timeout | int | 10 | 连接超时（秒） |

### MongoConfigProtocol

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| mongo_uri | str | mongodb://localhost:27017 | MongoDB URI |
| mongo_database | str | cache | 数据库名 |
| mongo_collection | str | cache_data | 集合名 |
| mongo_ttl | int | 3600 | 默认 TTL（秒） |

## 环境变量

| 变量 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| CACHE_TYPE | str | memory | 缓存类型：memory/redis/mongo |
| REDIS_HOST | str | localhost | Redis 主机 |
| REDIS_PORT | int | 6379 | Redis 端口 |
| REDIS_PASSWORD | str | None | Redis 密码 |
| REDIS_DB | int | 0 | Redis 数据库编号 |

## 配置优先级

1. 环境变量 → 2. 显式传入配置 → 3. 默认值

## 配置示例

### 最小配置（LocalCache）

```bash
# .env
CACHE_TYPE=memory
```

```python
from FQBase.Cache import create_cache
cache = create_cache()
```

### Redis 配置

```bash
# .env
CACHE_TYPE=redis
REDIS_HOST=redis.example.com
REDIS_PORT=6379
REDIS_PASSWORD=secret
```

```python
from FQBase.Cache import create_cache
cache = create_cache()
```

### MongoDB 配置

```bash
# .env
CACHE_TYPE=mongo
MONGO_URI=mongodb://mongo.example.com:27017
MONGO_DATABASE=my_cache
```

```python
from FQBase.Cache import create_cache
cache = create_cache()
```

### 完整配置

```python
from FQBase.Cache import RedisCacheAdapter, CacheConfig

config = CacheConfig(
    cache_type='redis',
    redis_host='redis.example.com',
    redis_port=6379,
    redis_password='secret',
    redis_max_connections=100,
    redis_timeout=30,
)
cache = RedisCacheAdapter(config)
```

## 动态配置

### 切换缓存后端

```python
from FQBase.Cache import set_cache_adapter, LocalCache

# 切换到 LocalCache
set_cache_adapter(LocalCache(name="temp"))

# 切换回 Redis
from FQBase.Cache import RedisCacheAdapter
set_cache_adapter(RedisCacheAdapter())
```

### 监听配置变更

```python
from FQBase.Cache import get_cache_adapter

adapter = get_cache_adapter()
adapter.set("config:last_update", str(time.time()))
```

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
