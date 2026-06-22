---
title: Foundation - 快速入门
description: 5分钟快速上手 Foundation 模块
tag:
  - fquant
  - fqbase
  - foundation

summary:
  purpose: quick-start
  complexity: low
---

# Foundation - 快速入门

## 阅读路径

🟢 **新手入门**：README → quick-start → examples → concepts

## 概述

本快速入门指南将帮助您在 5 分钟内理解 Foundation 模块并开始使用。

## 前置要求

- Python 3.8+
- FQBase.Infrastructure 已安装

## 5分钟上手

### Step 1: Dotty 嵌套字典访问

```python
from FQBase.Foundation import dotty

data = {'user': {'profile': {'name': '张三', 'age': 30}}}
d = dotty(data)

print(d['user.profile.name'])
d['user.profile.age'] = 31
```

### Step 2: 事件总线发布订阅

```python
from FQBase.Foundation import EventBus, Event, get_event_bus

bus = get_event_bus()

def handler(event):
    print(f"Received: {event.event_type}, data: {event.data}")

bus.subscribe('update', handler)
bus.publish(Event('update', {'key': 'value'}))
```

### Step 3: 生命周期管理

```python
from FQBase.Foundation.lifecycle import ServiceStatus, HealthStatus, HealthCheckable

class MyService(HealthCheckable):
    def health_check(self) -> HealthStatus:
        return HealthStatus(status=ServiceStatus.RUNNING, details={})

service = MyService()
result = service.health_check()
print(result.status)
```

### Step 4: 发送通知

```python
from FQBase.Foundation.notification import sendWechat

sendWechat("Hello from FQBase!", webhook_url="your_webhook_url")
```

## ⚠️ 常见陷阱

1. **Foundation 依赖 Infrastructure**
   - ❌ 错误做法：直接使用 Foundation 而不初始化 Infrastructure
   - ✅ 正确做法：先初始化 `FQBase.Infrastructure.init()`

2. **Celery 集成需要额外依赖**
   - event_bus_celery 是可选模块，需要安装 celery

## 下一步

- 学习 [核心概念](./concepts.md)
- 阅读 [API参考](./api.md)
- 查看 [使用指南](./usage.md)

## 相关文档

- [README](./README.md)
- [API参考](./api.md)
- [核心概念](./concepts.md)
