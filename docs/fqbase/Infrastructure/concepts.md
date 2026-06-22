---
title: Infrastructure - 核心概念
description: 深入理解 Infrastructure 的核心概念
tag:
  - fquant
  - fqbase
  - infrastructure

summary:
  purpose: concepts
  core_concepts:
    - singleton
    - decorator
    - circuit_breaker
    - dependency_injection
---

# Infrastructure - 核心概念

## 阅读路径

🟢🔵 **新手+开发者**：README → quick-start → concepts → api → usage

## 概述

Infrastructure 模块包含多个核心概念，理解这些概念对于正确使用基础设施层至关重要。

## 概念1：单例模式 (Singleton)

### 概念解释

确保类只有一个实例，并提供全局访问点。

### 代码示例

```python
from FQBase.Infrastructure import singleton

@singleton
class Database:
    def __init__(self):
        self.connection = None
```

## 概念2：装饰器模式 (Decorator)

### 概念解释

动态地给对象添加功能。

### 代码示例

```python
from FQBase.Infrastructure import retry

@retry(stop_max_attempt_number=3, wait_random_min=100, wait_random_max=500)
def fetch_data():
    pass
```

## 概念3：熔断器模式 (Circuit Breaker)

### 概念解释

防止级联故障，当服务连续失败达到阈值时打开熔断器。

### 代码示例

```python
from FQBase.Infrastructure import circuit_breaker, CircuitState

@circuit_breaker(failure_threshold=5, recovery_timeout=60)
def call_api():
    pass
```

## 概念4：依赖注入 (Dependency Injection)

### 概念解释

将依赖从外部传入，而不是在内部创建。

### 代码示例

```python
from FQBase.Infrastructure import ServiceContainer, ServiceLifetime

container = ServiceContainer()
container.register_singleton(ICache, RedisCache)
cache = container.get(ICache)
```

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [API参考](./api.md)
