---
title: Foundation - 核心概念
description: 深入理解 Foundation 的核心概念
tag:
  - fquant
  - fqbase
  - foundation

summary:
  purpose: concepts
  core_concepts:
    - observer
    - factory
    - singleton
    - lifecycle
    - dotty
---

# Foundation - 核心概念

## 阅读路径

🟢🔵 **新手+开发者**：README → quick-start → concepts → api → usage

## 概述

Foundation 模块包含多个核心概念，理解这些概念对于正确使用通用抽象层至关重要。

## 概念1：观察者模式 (Observer)

### 概念解释

观察者模式定义对象间的一对多依赖关系，当一个对象状态改变时，所有依赖它的对象都会收到通知。

### 代码示例

```python
from FQBase.Foundation import EventBus, Event, get_event_bus

bus = get_event_bus()

def handler(event):
    print(f"Event received: {event.event_type}")

bus.subscribe('data_update', handler)
bus.publish(Event('data_update', {'data': 123}))
```

## 概念2：工厂模式 (Factory)

### 概念解释

工厂模式提供创建对象的接口，隐藏对象创建的具体逻辑。

### 代码示例

```python
from FQBase.Foundation import dotty

d = dotty({'key': 'value'})
d2 = dotty()
```

## 概念3：生命周期协议 (Lifecycle Protocol)

### 概念解释

通过协议定义服务的初始化、健康检查、关闭等生命周期行为。

### 代码示例

```python
from FQBase.Foundation.lifecycle import HealthCheckable, Initializable, Shutdownable

class MyService(HealthCheckable, Initializable, Shutdownable):
    def initialize(self) -> bool:
        return True

    def health_check(self):
        return HealthStatus(status=ServiceStatus.RUNNING, details={})

    def shutdown(self) -> bool:
        return True
```

## 概念4：Dotty 嵌套字典

### 概念解释

Dotty 提供对嵌套字典的点号访问，简化深层数据读取。

### 代码示例

```python
from FQBase.Foundation import dotty

data = {'user': {'profile': {'name': '张三'}}}
d = dotty(data)
print(d['user.profile.name'])
d['user.profile.name'] = '李四'
```

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [API参考](./api.md)
