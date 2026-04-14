---
title: Cache - 集成指南
description: Cache 模块第三方集成指南
tag:
  - fqbase
  - cache
---

# Cache - 集成指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → [设计原则](./design.md) → [API参考](./api.md) → [开发指南](./development.md) → [使用指南](./usage.md) → [最佳实践](./best-practices.md) → **[集成指南](./integrations.md)** |

## 概述

本指南介绍 Cache 模块如何与第三方系统集成。

## 与数据库集成

### PostgreSQL

```python
from FQBase.Cache import redis_cache

@redis_cache(ttl=3600, key_prefix='pg:user')
def get_user_from_db(user_id):
    return db.query('SELECT * FROM users WHERE id = %s', (user_id,))
```

### MongoDB

```python
from FQBase.Cache import MongoCacheAdapter

mongo = MongoCacheAdapter(
    connection_string='mongodb://localhost:27017',
    database='myapp',
    collection='cache'
)
```

## 与消息队列集成

### RabbitMQ

```python
import pika
from FQBase.Cache import RedisCacheAdapter

redis = RedisCacheAdapter(host='localhost', port=6379)

connection = pika.BlockingConnection(
    pika.ConnectionParameters('localhost')
)
channel = connection.channel()

def callback(ch, method, properties, body):
    # 处理消息后清除缓存
    redis.delete(f'cache:{body}')
    ch.basic_ack(delivery_tag=method.delivery_tag)

channel.basic_consume(queue='cache_invalidate', on_message_callback=callback)
```

## 与监控系统集成

```python
from FQBase.Cache import LocalCache
import metrics

cache = LocalCache()

# 上报缓存指标
def report_metrics():
    stats = cache.stats
    metrics.gauge('cache.hits', stats['hits'])
    metrics.gauge('cache.misses', stats['misses'])
    metrics.gauge('cache.hit_rate', stats['hit_rate'])
```

## 与配置系统集成

```python
import os
from FQBase.Cache import init_cache_adapter

# 从配置中心加载配置
os.environ['CACHE_TYPE'] = 'redis'
os.environ['REDIS_HOST'] = config.get('redis.host')
os.environ['REDIS_PORT'] = str(config.get('redis.port'))

init_cache_adapter()
```

---

## 相关文档

- [API参考](./api.md)
- [技术架构](./architecture.md)
- [开发指南](./development.md)
- [框架集成](./framework.md)
