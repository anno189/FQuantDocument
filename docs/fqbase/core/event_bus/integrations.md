---
title: 事件总线 - 集成指南
description: 事件总线第三方集成指南
tag:
  - fqbase
  - event_bus
---

# 事件总线 - 集成指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → [设计原则](./design.md) → [API参考](./api.md) → [开发指南](./development.md) → [使用指南](./usage.md) → [最佳实践](./best-practices.md) → **[集成指南](./integrations.md)** |


## 概述

将事件总线与其他系统和服务集成的指南。

## 与数据库集成

### 事件持久化到数据库

```python
from FQBase.Core.event_bus import get_event_bus, Event

bus = get_event_bus()

class DatabaseEventStore:
    def __init__(self, db_connection):
        self.db = db_connection
    
    def save_event(self, event):
        self.db.execute(
            "INSERT INTO events (type, data, timestamp) VALUES (?, ?, ?)",
            (event.event_type, str(event.data), event.timestamp)
        )
    
    def handle(self, event):
        self.save_event(event)

db_store = DatabaseEventStore(db_connection)
bus.subscribe_global(db_store.handle)
```

## 与监控系统集成

### Prometheus 指标

```python
from prometheus_client import Counter, Histogram

event_counter = Counter('event_bus_events_total', 'Total events', ['event_type'])
event_latency = Histogram('event_bus_publish_duration_seconds', 'Publish latency')

bus = get_event_bus()

class MetricsMiddleware:
    def __init__(self):
        self._original_publish = bus.publish
        bus.publish = self._wrapped_publish
    
    def _wrapped_publish(self, event):
        with event_latency.time():
            event_counter.labels(event_type=event.event_type).inc()
        return self._original_publish(event)

MetricsMiddleware()
```

## 与消息队列集成

### Redis Pub/Sub

```python
import redis
from FQBase.Core.event_bus import get_event_bus, Event

bus = get_event_bus()
redis_client = redis.Redis()

def to_redis(event):
    redis_client.publish(f"events:{event.event_type}", str(event.data))

bus.subscribe_global(to_redis)
```

## 与日志系统集成

### 结构化日志

```python
import json
from FQBase.Core.event_bus import get_event_bus, Event

bus = get_event_bus()

def structured_log(event):
    log_entry = {
        'type': event.event_type,
        'timestamp': event.timestamp.isoformat(),
        'data': event.data
    }
    print(json.dumps(log_entry))

bus.subscribe_global(structured_log)
```

## 集成最佳实践

1. 使用中间件模式扩展功能
2. 保持集成代码与业务逻辑分离
3. 处理集成中的异常

## 相关文档

- [API参考](./api.md)
- [技术架构](./architecture.md)
- [开发指南](./development.md)
