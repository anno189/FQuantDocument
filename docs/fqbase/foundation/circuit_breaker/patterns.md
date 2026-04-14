---
title: Circuit Breaker 模块 - 设计模式
description: Circuit Breaker 熔断器模块使用的设计模式详解
tag:
  - fqbase
  - circuit_breaker
---

# Circuit Breaker 模块 - 设计模式

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟠 架构师 | [README](./README.md) → [技术架构](./architecture.md) → **[设计模式](./patterns.md)** → [技术权衡](./tradeoff.md) → [决策指南](./decision-guide.md) → [案例研究](./case-studies.md) → [数据流](./data-flow.md) |
| 📚 案例库 | **[案例库](./examples.md)** → [案例研究](./case-studies.md) → [决策指南](./decision-guide.md) → [数据流](./data-flow.md) → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) |


## 概述

本文档详细介绍 Circuit Breaker 熔断器模块中使用的设计模式。

## 模式 1: 状态机模式

### 上下文

熔断器需要管理服务调用的生命周期，根据失败次数在不同的状态之间转换。

### 模式结构

```
┌─────────┐    失败阈值    ┌────────┐    超时    ┌────────────┐
│ CLOSED  │ ────────────► │  OPEN  │ ─────────► │ HALF_OPEN  │
└─────────┘               └────────┘            └────────────┘
     ▲                                                │
     │                                                │
     └──────────────────成功阈值──────────────────────┘
```

### 实现

```python
class CircuitBreaker:
    def __init__(self, ...):
        self._state = CircuitState.CLOSED
    
    def record_failure(self, exception=None):
        with self._lock:
            if self._state == CircuitState.CLOSED:
                if self._metrics.consecutive_failures >= self.failure_threshold:
                    self._transition_to(CircuitState.OPEN)
            elif self._state == CircuitState.HALF_OPEN:
                self._transition_to(CircuitState.OPEN)
```

### 适用场景

- 服务状态管理
- 有限状态机实现
- 状态转换逻辑

## 模式 2: 装饰器模式

### 上下文

需要透明地为函数添加熔断功能，而不修改原有函数代码。

### 模式结构

```
┌─────────────────┐       ┌─────────────────┐
│   原始函数      │       │   熔断装饰器    │
│  call_api()    │  ──►  │ 包装 call_api()│
└─────────────────┘       └─────────────────┘
                                    │
                                    ▼
                           ┌─────────────────┐
                           │  CircuitBreaker │
                           │    .call()     │
                           └─────────────────┘
```

### 实现

```python
def circuit_breaker(...):
    def decorator(func):
        _breaker = CircuitBreakerManager().get_or_create(name or func.__name__)
        
        @wraps(func)
        def wrapper(*args, **kwargs):
            return _breaker.call(func, *args, **kwargs)
        
        return wrapper
    return decorator

# 使用
@circuit_breaker(name="api", failure_threshold=5)
def call_api():
    return api.request()
```

### 适用场景

- 无侵入地添加功能
- AOP 面向切面编程
- 函数增强

## 模式 3: 单例模式

### 上下文

确保全局只有一个熔断器管理器实例，避免状态不一致。

### 模式结构

```
┌─────────────────────────────────────────┐
│         CircuitBreakerManager           │
│  ┌───────────────────────────────────┐  │
│  │         _instance (唯一)          │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  _circuit_breakers: Dict          │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### 实现

```python
@singleton
class CircuitBreakerManager:
    def __init__(self):
        if getattr(self, '_initialized', False):
            return
        self._circuit_breakers: Dict[str, CircuitBreaker] = {}
        self._initialized = True

# 全局唯一实例
manager = CircuitBreakerManager()
```

### 适用场景

- 全局资源管理
- 配置集中管理
- 状态共享

## 模式 4: 代理模式

### 上下文

通过代理对象控制对目标函数的访问。

### 模式结构

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   客户端    │────►│  熔断代理   │────►│  目标函数  │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ CircuitBreak│
                    │    er      │
                    └─────────────┘
```

### 实现

```python
class CircuitBreaker:
    def call(self, func, *args, **kwargs):
        # 代理逻辑
        if not self.can_execute():
            self.record_rejection()
            raise CircuitBreakerOpenException(...)
        
        try:
            result = func(*args, **kwargs)
            self.record_success()
            return result
        except Exception as e:
            self.record_failure(e)
            raise
```

### 适用场景

- 访问控制
- 前后置处理
- 增强函数行为

## 模式 5: 观察者模式

### 上下文

熔断器状态变更时通知相关方。

### 模式结构

```
┌─────────────────┐       ┌─────────────────┐
│    Subject      │       │   Observers     │
│ CircuitBreaker  │──────►│ - Logger        │
│                 │       │ - Notifier      │
│ _state_changed()│       │ - Monitor       │
└─────────────────┘       └─────────────────┘
```

### 实现

```python
def on_state_change(breaker):
    # 观察者逻辑
    logger.warning(f"熔断器状态变更: {breaker.name}")
    notifier.send(f"熔断器 {breaker.name} 已打开")

breaker = CircuitBreaker(on_state_change=on_state_change)
```

### 适用场景

- 事件通知
- 状态监听
- 解耦逻辑

## 相关文档

- [技术架构](./architecture.md)
- [设计原则](./design.md)
- [技术权衡](./tradeoff.md)
- [案例研究](./case-studies.md)
