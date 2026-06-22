---
title: Foundation - API参考
description: Foundation API 参考文档
tag:
  - fquant
  - fqbase
  - foundation

summary:
  purpose: api-reference
  core_classes:
    - Dotty
    - DottyEncoder
    - EventBus
    - Event
    - Subscription
    - EventHistory
    - ServiceStatus
    - HealthStatus
    - HealthCheckable
    - Initializable
    - Shutdownable
    - CompositeHealthCheck
    - NotificationManager
    - NotificationHandler
    - WecomHandler
    - ServerChanHandler
    - PushBearHandler
    - NotificationTemplate
    - NotificationTemplateRegistry
  core_functions:
    - dotty
    - get_event_bus
    - sendWechat
    - sendMessage2ServerChan
    - sendMessagetoAll
    - setup_event_bus
    - clear_event_bus
---

# Foundation - API参考

## 阅读路径

🔵 **开发者**：README → api → usage → concepts → examples

## 字典访问 (dotty)

### dotty

**位置：** `Foundation/dotty.py#L32`

```python
from FQBase.Foundation import dotty

d = dotty({'key': 'value'})
```

**描述：** Dotty 工厂函数，创建 Dotty 包装器

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| dictionary | Dict | 否 | {} | 任意字典或类字典对象 |
| no_list | bool | 否 | False | 若为 True，则数字键不会转换为列表索引 |

**返回：** `Dotty`

---

### Dotty

**位置：** `Foundation/dotty.py#L46`

**描述：** 字典包装器，支持点号深度访问

```python
from FQBase.Foundation import dotty

d = dotty({'user': {'name': '张三'}})
print(d['user.name'])
d['user.name'] = '李四'
```

---

### DottyEncoder

**位置：** `Foundation/dotty.py#L264`

**描述：** JSON 编码器，支持 Dotty 对象序列化

---

## 事件总线 (event_bus)

### EventBus

**位置：** `Foundation/event_bus.py#L267`

**描述：** 事件总线 - 单例模式，实现观察者模式

```python
from FQBase.Foundation import EventBus, Event, get_event_bus

bus = get_event_bus()
bus.subscribe('update', lambda e: print(e.data))
bus.publish(Event('update', {'key': 'value'}))
```

#### 方法

##### subscribe

```python
bus.subscribe(event_type, callback, priority=0, subscriber_id=None, weak_ref=True)
```

订阅事件

##### unsubscribe

```python
bus.unsubscribe(event_type, callback)
```

取消订阅

##### publish

```python
bus.publish(event)
```

同步发布事件

##### publish_async

```python
await bus.publish_async(event)
```

异步发布事件

---

### Event

**位置：** `Foundation/event_bus.py#L105`

**描述：** 事件对象，包含事件类型、数据、时间戳

```python
event = Event('price_update', {'symbol': 'AAPL', 'price': 150.0})
```

---

### EventHistory

**位置：** `Foundation/event_bus.py#L142`

**描述：** 事件历史记录管理器，使用环形缓冲区

---

### Subscription

**位置：** `Foundation/event_bus.py#L94`

**描述：** 事件订阅者，按优先级排序

---

### get_event_bus

**位置：** `Foundation/event_bus.py#L712`

**描述：** 获取事件总线单例实例

**返回：** `EventBus`

---

## 生命周期管理 (lifecycle)

### ServiceStatus

**位置：** `Foundation/lifecycle.py#L18`

**描述：** 服务状态枚举

```python
from FQBase.Foundation.lifecycle import ServiceStatus

print(ServiceStatus.RUNNING)
```

枚举值：UNKNOWN, INITIALIZING, RUNNING, DEGRADED, STOPPING, STOPPED, ERROR

---

### HealthStatus

**位置：** `Foundation/lifecycle.py#L95`

**描述：** 健康状态

```python
from FQBase.Foundation.lifecycle import HealthStatus, ServiceStatus

status = HealthStatus(status=ServiceStatus.RUNNING, message="OK", details={})
```

---

### HealthCheckable

**位置：** `Foundation/lifecycle.py#L30`

**描述：** 健康检查协议

```python
from FQBase.Foundation.lifecycle import HealthCheckable, HealthStatus, ServiceStatus

class MyService(HealthCheckable):
    def health_check(self) -> HealthStatus:
        return HealthStatus(status=ServiceStatus.RUNNING, details={})
```

---

### Initializable

**位置：** `Foundation/lifecycle.py#L54`

**描述：** 初始化协议

```python
from FQBase.Foundation.lifecycle import Initializable

class MyService(Initializable):
    def initialize(self) -> bool:
        return True

    @property
    def is_initialized(self) -> bool:
        return True
```

---

### Shutdownable

**位置：** `Foundation/lifecycle.py#L75`

**描述：** 关闭协议

```python
from FQBase.Foundation.lifecycle import Shutdownable

class MyService(Shutdownable):
    def shutdown(self) -> bool:
        return True

    @property
    def is_shutdown(self) -> bool:
        return False
```

---

### CompositeHealthCheck

**位置：** `Foundation/lifecycle.py#L136`

**描述：** 组合健康检查

---

## 通知服务 (notification)

### NotificationManager

**位置：** `Foundation/notification.py#L236`

**描述：** 统一通知管理器

```python
from FQBase.Foundation.notification import NotificationManager

manager = NotificationManager()
manager.send('test', 'Hello')
```

---

### WecomHandler

**位置：** `Foundation/notification.py#L113`

**描述：** 企业微信通知处理器

---

### ServerChanHandler

**位置：** `Foundation/notification.py#L155`

**描述：** Server 酱通知处理器

---

### PushBearHandler

**位置：** `Foundation/notification.py#L195`

**描述：** PushBear 通知处理器

---

### sendWechat

**位置：** `Foundation/notification.py#L362`

```python
from FQBase.Foundation.notification import sendWechat

sendWechat("Hello", webhook_url="your_webhook_url")
```

**描述：** 发送企业微信消息（兼容旧接口）

---

### sendMessage2ServerChan

**位置：** `Foundation/notification.py#L396`

**描述：** 发送 Server 酱消息

---

### sendMessagetoAll

**位置：** `Foundation/notification.py#L423`

**描述：** 发送 PushBear 消息

---

## 通知模板 (notification_template)

### NotificationTemplate

**位置：** `Foundation/notification_template.py#L29`

**描述：** 通知消息模板

```python
from FQBase.Foundation.notification_template import NotificationTemplate

template = NotificationTemplate(
    name='greeting',
    content='Hello, {name}!',
    description='问候模板'
)
result = template.render(name='World')
```

---

### NotificationTemplateRegistry

**位置：** `Foundation/notification_template.py#L78`

**描述：** 通知模板注册表

```python
from FQBase.Foundation.notification_template import NotificationTemplateRegistry

registry = NotificationTemplateRegistry()
registry.register(template)
rendered = registry.render('greeting', name='张三')
```

---

## Celery 集成 (event_bus_celery)

### setup_event_bus

**位置：** `Foundation/event_bus_celery.py#L56`

```python
from FQBase.Foundation.event_bus_celery import setup_event_bus

setup_event_bus()
```

**描述：** 初始化 EventBus 实例（供 Celery Worker 启动时调用）

---

### clear_event_bus

**位置：** `Foundation/event_bus_celery.py#L76`

**描述：** 清除 EventBus 实例（供 Celery Worker 关闭时调用）

---

## 相关文档

- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
