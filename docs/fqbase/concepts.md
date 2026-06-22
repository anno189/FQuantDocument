---
title: FQBase - 核心概念
description: 深入理解 FQBase 的核心概念
tag:
  - fquant
  - fqbase

summary:
  purpose: concepts
  core_concepts:
    - singleton
    - event_bus
    - circuit_breaker
    - retry
    - dependency_injection
---

# FQBase - 核心概念

## 阅读路径

🟢🔵 **新手+开发者**：README → quick-start → concepts → api → usage

## 概述

FQBase 包含多个核心概念，理解这些概念对于正确使用框架至关重要。

## 概念1：单例模式 (Singleton)

### 概念解释

单例模式确保一个类只有一个实例，并提供全局访问点。

### 原理

使用 `@singleton` 装饰器或 `SingletonMeta` 元类实现线程安全的单例。

### 代码示例

```python
from FQBase.Infrastructure import singleton

@singleton
class Database:
    def __init__(self):
        self.connection = None

db1 = Database()
db2 = Database()
print(db1 is db2)  # True
```

## 概念2：事件总线 (EventBus)

### 概念解释

事件总线是观察者模式的实现，用于组件间的松耦合通信。

### 原理

发布者发布事件，订阅者接收处理，事件总线负责路由。

### 代码示例

```python
from FQBase.Foundation import EventBus, Event

bus = EventBus()

def handler(event):
    print(f"Received: {event.name}")

bus.subscribe("data", handler)
bus.publish(Event("data", {"value": 123}))
```

## 概念3：熔断器 (Circuit Breaker)

### 概念解释

熔断器模式防止级联故障，当服务不可用时快速失败。

### 原理

Closed（正常）→ Open（熔断）→ Half-Open（探测）状态转换。

### 代码示例

```python
from FQBase.Infrastructure import CircuitBreaker, CircuitState

breaker = CircuitBreaker(failure_threshold=5)
with breaker:
    risky_operation()
```

## 概念4：重试机制 (Retry)

### 概念解释

重试机制在临时性故障时自动重试操作。

### 原理

装饰器模式，支持指数退避、随机延迟等策略。

### 代码示例

```python
from FQBase.Infrastructure.retry import retry

@retry(stop_max_attempt_number=3, wait_exponential_multiplier=1000)
def unreliable_call():
    pass
```

## 概念5：依赖注入 (Dependency Injection)

### 概念解释

通过容器管理依赖，实现松耦合和可测试性。

### 原理

容器注册服务，根据生命周期（Singleton/Transient）解析依赖。

### 代码示例

```python
from FQBase.Infrastructure.container import ServiceContainer, ServiceLifetime

container = ServiceContainer()
container.register(ServiceLifetime.singleton, IRepository, RepositoryImpl)
repo = container.resolve(IRepository)
```

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [API参考](./api.md)
