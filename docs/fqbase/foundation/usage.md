---
title: Foundation - 使用指南
description: Foundation 详细使用指南
tag:
  - fquant
  - fqbase
  - foundation

summary:
  purpose: usage
---

# Foundation - 使用指南

## 阅读路径

🔵 **开发者**：README → api → usage → concepts → examples

## 概述

本指南详细说明如何在各种场景下使用 Foundation 模块。

## 基本用法

### Dotty 字典访问

```python
from FQBase.Foundation import dotty

data = {'user': {'profile': {'name': '张三', 'age': 30}}}
d = dotty(data)

print(d['user.profile.name'])
d['user.profile.age'] = 31
print(d['user.profile.age'])
```

### 事件总线

```python
from FQBase.Foundation import EventBus, Event, get_event_bus

bus = get_event_bus()

def on_update(event):
    print(f"Update: {event.data}")

bus.subscribe('update', on_update)
bus.publish(Event('update', {'key': 'value'}))
```

## 常见用例

### 用例 1: 解耦组件通信

```python
from FQBase.Foundation import EventBus, Event, get_event_bus

class DataService:
    def __init__(self, bus):
        self.bus = bus

    def update_price(self, symbol, price):
        self.bus.publish(Event('price_update', {'symbol': symbol, 'price': price}))

class AlertService:
    def __init__(self, bus):
        self.bus = bus
        self.bus.subscribe('price_update', self.check_alert)

    def check_alert(self, event):
        if event.data['price'] > 100:
            print(f"Alert: {event.data['symbol']} price too high!")

bus = get_event_bus()
data_service = DataService(bus)
alert_service = AlertService(bus)

data_service.update_price('AAPL', 150)
```

### 用例 2: 统一通知

```python
from FQBase.Foundation.notification import NotificationManager

manager = NotificationManager()
manager.add_handler('wecom', webhook_url='your_wecom_webhook')
manager.add_handler('serverchan', sc_key='your_sc_key')

manager.send('notification', 'System alert: High CPU usage!')
```

### 用例 3: 生命周期管理

```python
from FQBase.Foundation.lifecycle import (
    ServiceStatus, HealthStatus, HealthCheckable, Initializable, Shutdownable
)

class MyService(HealthCheckable, Initializable, Shutdownable):
    def __init__(self):
        self._initialized = False
        self._shutdown = False

    def initialize(self) -> bool:
        self._initialized = True
        return True

    def health_check(self) -> HealthStatus:
        return HealthStatus(
            status=ServiceStatus.RUNNING if self._initialized else ServiceStatus.ERROR,
            details={'initialized': self._initialized}
        )

    def shutdown(self) -> bool:
        self._shutdown = True
        return True

    @property
    def is_initialized(self) -> bool:
        return self._initialized

    @property
    def is_shutdown(self) -> bool:
        return self._shutdown

service = MyService()
service.initialize()
print(service.health_check())
service.shutdown()
```

## 相关文档

- [API参考](./api.md)
- [最佳实践](./best-practices.md)
- [故障排查](./troubleshooting.md)
