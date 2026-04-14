---
title: Cache - 配置指南
description: Cache 模块配置选项详解
tag:
  - fqbase
  - cache
---

# Cache - 配置指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → **[配置指南](./configuration.md)** → [安全指南](./security.md) → [故障排查](./troubleshooting.md) → [常见问题](./faq.md) |

## 概述

本指南介绍 Cache 模块的所有配置选项。

## 环境变量配置

| 变量 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| CACHE_TYPE | str | 'local' | 缓存类型：'local', 'redis', 'mongo' |
| REDIS_HOST | str | 'localhost' | Redis 主机地址 |
| REDIS_PORT | int | 6379 | Redis 端口 |
| REDIS_DB | int | 0 | Redis 数据库编号 |
| REDIS_PASSWORD | str | None | Redis 密码 |
| MONGO_URI | str | 'mongodb://localhost:27017' | MongoDB 连接字符串 |
| LOCAL_CACHE_MAXSIZE | int | 128 | LocalCache 默认最大大小 |
| LOCAL_CACHE_TTL | int | 0 | LocalCache 默认 TTL |

## LocalCache 配置

```python
from FQBase.Cache import LocalCache

cache = LocalCache(
    name='my_cache',    # 缓存名称（用于单例识别）
    maxsize=128,       # 最大缓存条目数
    ttl=300,          # 默认 TTL（秒），0 表示永不过期
    eviction='lru'   # 驱逐策略：'lru' 或 'fifo'
)
```

### 参数说明

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| name | str | 'default' | 缓存实例名称，用于单例识别 |
| maxsize | int | 128 | 最大缓存条目数 |
| ttl | int | 0 | 默认 TTL（秒），0=永不过期 |
| eviction | str | 'lru' | 驱逐策略：'lru'（最近最少使用）或 'fifo'（先进先出） |

## RedisCacheAdapter 配置

```python
from FQBase.Cache import RedisCacheAdapter

redis = RedisCacheAdapter(
    host='localhost',              # Redis 主机
    port=6379,                    # Redis 端口
    db=0,                        # 数据库编号
    password=None,                # 密码
    prefix='myapp:',              # 键前缀
    pickle_first=False,           # 序列化优先级
    safe_mode=False,             # 安全模式
    socket_timeout=5,            # socket 超时
    socket_connect_timeout=5,    # 连接超时
    max_connections=50          # 最大连接数
)
```

### 参数说明

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| host | str | 'localhost' | Redis 主机地址 |
| port | int | 6379 | Redis 端口 |
| db | int | 0 | 数据库编号 |
| password | str | None | 密码认证 |
| prefix | str | '' | 键前缀 |
| pickle_first | bool | False | True=优先 pickle，False=优先 msgpack |
| safe_mode | bool | False | True=禁用 pickle，仅用 msgpack |
| socket_timeout | int | 5 | socket 超时（秒） |
| socket_connect_timeout | int | 5 | 连接超时（秒） |
| max_connections | int | 50 | 连接池最大连接数 |

## MongoCacheAdapter 配置

```python
from FQBase.Cache import MongoCacheAdapter

mongo = MongoCacheAdapter(
    connection_string='mongodb://localhost:27017',
    database='cache_db',
    collection='cache_collection',
    ttl=3600
)
```

### 参数说明

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| connection_string | str | 是 | MongoDB 连接字符串 |
| database | str | 是 | 数据库名称 |
| collection | str | 是 | 集合名称 |
| ttl | int | 否 | 默认 TTL（秒） |

## 配置文件

### 使用 YAML

```yaml
# config/cache.yaml
cache:
  type: redis
  redis:
    host: localhost
    port: 6379
    db: 0
    prefix: myapp:
  local:
    maxsize: 128
    ttl: 300
```

### 使用环境变量

```bash
export CACHE_TYPE=redis
export REDIS_HOST=localhost
export REDIS_PORT=6379
export REDIS_DB=0
```

---

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
