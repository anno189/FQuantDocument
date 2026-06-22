---
title: Foundation - 示例
description: Foundation 完整案例和动手实验
tag:
  - fquant
  - fqbase
  - foundation

summary:
  purpose: examples
---

# Foundation - 示例

## 阅读路径

🟢🔵 **新手+开发者**：README → quick-start → examples → concepts

## 案例1：实时数据通知系统

```python
from FQBase.Foundation import EventBus, Event, get_event_bus
from FQBase.Foundation.notification import NotificationManager

class PriceMonitor:
    def __init__(self, bus, threshold=100):
        self.bus = bus
        self.threshold = threshold
        self.bus.subscribe('price_update', self.on_price_update)

    def on_price_update(self, event):
        data = event.data
        if data['price'] > self.threshold:
            self.bus.publish(Event('alert', {
                'symbol': data['symbol'],
                'price': data['price'],
                'message': f"{data['symbol']} exceeds threshold"
            }))

bus = get_event_bus()
monitor = PriceMonitor(bus, threshold=100)

bus.publish(Event('price_update', {'symbol': 'AAPL', 'price': 150}))
```

## 案例2：服务健康检查聚合

```python
from FQBase.Foundation.lifecycle import (
    ServiceStatus, HealthStatus, CompositeHealthCheck
)

class DatabaseHealthCheck:
    def health_check(self) -> HealthStatus:
        return HealthStatus(status=ServiceStatus.RUNNING, details={'connections': 10})

class CacheHealthCheck:
    def health_check(self) -> HealthStatus:
        return HealthStatus(status=ServiceStatus.RUNNING, details={'hits': 1000})

composite = CompositeHealthCheck()
composite.add_check('db', DatabaseHealthCheck())
composite.add_check('cache', CacheHealthCheck())

overall = composite.check()
print(f"Overall status: {overall.status}")
```

## 案例3：使用 Dotty 简化配置访问

```python
from FQBase.Foundation import dotty

config = {
    'database': {
        'host': 'localhost',
        'port': 27017,
        'credentials': {
            'username': 'admin',
            'password': 'secret'
        }
    }
}

d = dotty(config)
print(d['database.host'])
print(d['database.credentials.username'])

d['database.replicas'] = [' replica1', 'replica2']
print(d['database.replicas'])
```

## 相关文档

- [快速入门](./quick-start.md)
- [核心概念](./concepts.md)
- [API参考](./api.md)
