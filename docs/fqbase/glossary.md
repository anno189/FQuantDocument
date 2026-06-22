---
title: FQBase - 术语表
description: FQBase 术语定义与解释
tag:
  - fquant
  - fqbase

summary:
  purpose: glossary
---

# FQBase - 术语表

## 阅读路径

🟢 **新手**：README → glossary → quick-start → usage

## 概述

本文档定义了 FQBase 中使用的核心术语。

## 术语

### 单例模式 (Singleton)

**定义：** 确保一个类只有一个实例，并提供全局访问点的设计模式。

**示例：**

```python
@ singleton
class Database:
    pass

db1 = Database()
db2 = Database()
assert db1 is db2  # 同一实例
```

**与相关术语的区别：**

| 术语 | 区别 |
|------|------|
| 工厂模式 | 工厂每次调用可能返回不同实例 |
| 单例模式 | 全局唯一实例 |

### 熔断器 (Circuit Breaker)

**定义：** 防止级联故障的模式，当服务失败率达到阈值时快速失败。

**示例：**

```python
breaker = CircuitBreaker(failure_threshold=5)
with breaker:
    risky_operation()
```

**与相关术语的区别：**

| 术语 | 区别 |
|------|------|
| 重试 | 重试多次后仍可能超时 |
| 熔断器 | 快速失败，避免资源消耗 |

### 重试装饰器 (Retry Decorator)

**定义：** 自动重试失败操作的装饰器，支持多种策略。

**示例：**

```python
@retry(stop_max_attempt_number=3, wait_random_min=100, wait_random_max=500)
def unreliable_call():
    pass
```

**与相关术语的区别：**

| 术语 | 区别 |
|------|------|
| 熔断器 | 防止雪崩，快速失败 |
| 重试 | 临时故障时重复尝试 |

### 事件总线 (Event Bus)

**定义：** 组件间发布-订阅通信的中间件。

**示例：**

```python
bus = EventBus()
bus.subscribe("topic", handler)
bus.publish(Event("topic", {"key": "value"}))
```

**与相关术语的区别：**

| 术语 | 区别 |
|------|------|
| 直接调用 | 紧耦合 |
| 事件总线 | 松耦合 |

### 依赖注入 (Dependency Injection)

**定义：** 通过容器注入依赖，而非在类内部创建。

**示例：**

```python
container.register(ServiceLifetime.singleton, IService, ServiceImpl)
impl = container.resolve(IService)
```

**与相关术语的区别：**

| 术语 | 区别 |
|------|------|
| 依赖查找 | 类主动获取依赖 |
| 依赖注入 | 依赖被推入类 |

### 门面模式 (Facade)

**定义：** 为复杂子系统提供简化接口。

**示例：**

```python
class MongoDB:
    def find(self, collection, query):
        # 内部复杂的 MongoDB 操作
        pass
```

**与相关术语的区别：**

| 术语 | 区别 |
|------|------|
| 适配器 | 转换接口 |
| 门面 | 简化复杂接口 |

### Dotty

**定义：** 支持点号访问嵌套字典的库。

**示例：**

```python
data = {"a": {"b": {"c": 1}}}
value = dotty(data, "a.b.c")  # 1
```

**与相关术语的区别：**

| 术语 | 区别 |
|------|------|
| 原生字典访问 | data["a"]["b"]["c"]，繁琐 |
| Dotty | dotty(data, "a.b.c")，简洁 |

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [核心概念](./concepts.md)
