---
title: Circuit Breaker 模块 - 术语表
description: Circuit Breaker 熔断器模块术语定义与解释
tag:
  - fqbase
  - circuit_breaker
---

# Circuit Breaker 模块 - 术语表

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → **[术语表](./glossary.md)** → [核心概念](./concepts.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) |


## 概述

本文档定义 Circuit Breaker 熔断器模块中使用的专业术语。

## 术语

### 熔断器（Circuit Breaker）

**定义：** 一种防止级联故障的设计模式，通过监控服务调用的失败次数，在达到阈值时"熔断"后续请求，快速失败以保护系统。

**示例：**

```python
from FQBase.Foundation import CircuitBreaker

breaker = CircuitBreaker(name="payment", failure_threshold=5)
```

### 熔断器状态（Circuit State）

**定义：** 熔断器的当前运行状态，包括 CLOSED（关闭）、OPEN（打开）、HALF_OPEN（半开）。

**示例：**

```python
from FQBase.Foundation import CircuitState

print(CircuitState.CLOSED.value)   # "closed"
print(CircuitState.OPEN.value)     # "open"
print(CircuitState.HALF_OPEN.value) # "half_open"
```

### 失败阈值（Failure Threshold）

**定义：** 触发熔断器打开所需的连续失败次数。

**示例：**

```python
breaker = CircuitBreaker(failure_threshold=5)  # 连续 5 次失败打开
```

### 恢复超时（Recovery Timeout）

**定义：** 熔断器打开后，等待多长时间后进入半开状态尝试恢复。

**示例：**

```python
breaker = CircuitBreaker(recovery_timeout=60)  # 60 秒后尝试恢复
```

### 成功阈值（Success Threshold）

**定义：** 半开状态下，连续成功多少次后关闭熔断器。

**示例：**

```python
breaker = CircuitBreaker(success_threshold=2)  # 半开状态 2 次成功关闭
```

### 连续失败（Consecutive Failures）

**定义：** 没有成功插入的连续失败次数。每次成功会将此计数重置为零。

**示例：**

```python
metrics = breaker.metrics
print(f"连续失败: {metrics.consecutive_failures}")
```

### 成功率（Success Rate）

**定义：** 成功调用次数占总调用次数的百分比。

**示例：**

```python
metrics = breaker.metrics
print(f"成功率: {metrics.success_rate}")  # 如 0.85
```

### 快速失败（Fail Fast）

**定义：** 熔断器打开后，直接拒绝请求而非真正执行，快速返回错误。

**示例：**

```python
try:
    result = breaker.call(api.request)
except CircuitBreakerOpenException:
    print("快速失败，返回降级数据")
```

### 降级（Degradation）

**定义：** 当熔断器打开时，执行备选逻辑以保证系统可用性。

**示例：**

```python
try:
    return api.get_data()
except CircuitBreakerOpenException:
    return get_cache_data()  # 降级逻辑
```

### 排除异常（Excluded Exception）

**定义：** 不计入失败计数的异常类型，通常用于忽略可恢复的临时性错误。

**示例：**

```python
from requests.exceptions import Timeout

breaker = CircuitBreaker(
    excluded_exceptions=(Timeout,)  # 超时不计入失败
)
```

### 熔断器打开异常（Circuit Breaker Open Exception）

**定义：** 当熔断器处于 OPEN 状态时调用会抛出的异常。

**示例：**

```python
from FQBase.Foundation import CircuitBreakerOpenException

try:
    breaker.call(func)
except CircuitBreakerOpenException as e:
    print(f"熔断器 {e.circuit_name} 已打开")
    print(f"等待 {e.recovery_timeout} 秒后重试")
```

### 熔断器管理器（Circuit Breaker Manager）

**定义：** 管理多个熔断器实例的单例组件，提供注册、获取、注销等操作。

**示例：**

```python
from FQBase.Foundation import CircuitBreakerManager

manager = CircuitBreakerManager()
breaker = manager.register("my_api", failure_threshold=3)
```

### 上下文管理器（Context Manager）

**定义：** 支持 `with` 语句的 Python 协议，用于自动管理资源。

**示例：**

```python
with CircuitBreaker(name="api") as breaker:
    result = breaker.call(func)
```

### 状态变更回调（State Change Callback）

**定义：** 熔断器状态变更时调用的用户自定义函数。

**示例：**

```python
def on_state_change(breaker):
    print(f"熔断器 {breaker.name} 状态变为 {breaker.state}")

breaker = CircuitBreaker(on_state_change=on_state_change)
```

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [核心概念](./concepts.md)
- [使用指南](./usage.md)
