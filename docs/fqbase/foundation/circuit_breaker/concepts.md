---
title: Circuit Breaker 模块 - 核心概念
description: 深入理解 Circuit Breaker 熔断器的核心概念
tag:
  - fqbase
  - circuit_breaker
---

# Circuit Breaker 模块 - 核心概念

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [术语表](./glossary.md) → **[核心概念](./concepts.md)** → [框架集成](./framework.md) → [技术架构](./architecture.md) |
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → **[核心概念](./concepts.md)** → [设计原则](./design.md) → [API参考](./api.md) |


## 概述

本文深入介绍 Circuit Breaker 熔断器的核心概念，帮助您理解其工作原理和设计思想。

## 概念 1：熔断器模式

### 概念解释

熔断器模式是一种防止级联故障的设计模式。类似于电路中的保险丝，当电流过载时熔断以保护电器，熔断器模式在服务调用失败达到阈值时"熔断"，阻止后续请求，避免故障扩散。

### 原理

```
正常请求 → CircuitBreaker → 目标服务
                    ↓
              失败累积 → 打开熔断
                    ↓
              快速失败 → 返回降级响应
```

### 代码示例

```python
from FQBase.Foundation import circuit_breaker

@circuit_breaker(failure_threshold=5)
def call_remote_service():
    return remote_api.call()

# 连续失败 5 次后，熔断器打开
# 后续调用直接返回异常，不真正请求远程服务
```

## 概念 2：三态状态机

### 概念解释

熔断器通过三个状态来管理服务的可用性：

| 状态 | 说明 | 行为 |
|------|------|------|
| CLOSED | 关闭 | 正常执行请求 |
| OPEN | 打开 | 拒绝请求，快速失败 |
| HALF_OPEN | 半开 | 尝试恢复，允许有限请求 |

### 状态转换图

```
CLOSED ──(连续失败 ≥ failure_threshold)──► OPEN
  ▲                                              │
  │                                          (超时)
  │                                              │
  └──(半开状态连续成功 ≥ success_threshold)── HALF_OPEN ──(失败)──► OPEN
```

### 代码示例

```python
breaker = CircuitBreaker(
    name="api",
    failure_threshold=5,    # 连续 5 次失败打开
    success_threshold=2,     # 半开状态 2 次成功关闭
    recovery_timeout=60      # 60 秒后进入半开
)
```

## 概念 3：失败计数机制

### 概念解释

熔断器通过连续失败计数来决定是否打开。关键点：
- **连续失败**：只有连续失败才计数，中间有成功会重置
- **半开恢复**：半开状态下失败会重新打开，成功则关闭

### 原理

```python
# 内部计数器机制
consecutive_failures = 0    # 连续失败计数
consecutive_successes = 0   # 连续成功计数

def record_failure():
    consecutive_failures += 1
    consecutive_successes = 0  # 重置成功计数
    
    if state == CLOSED and consecutive_failures >= threshold:
        transition_to(OPEN)

def record_success():
    consecutive_successes += 1
    consecutive_failures = 0   # 重置失败计数
    
    if state == HALF_OPEN and consecutive_successes >= success_threshold:
        transition_to(CLOSED)
```

## 概念 4：线程安全

### 概念解释

熔断器在多线程环境下使用 Lock 确保状态一致性，所有状态修改和读取操作都是线程安全的。

### 原理

```python
class CircuitBreaker:
    def __init__(self, ...):
        self._lock = threading.Lock()  # 线程锁
    
    def record_failure(self, exception=None):
        with self._lock:  # 保证原子性
            self._metrics.total_calls += 1
            self._metrics.failed_calls += 1
            # ... 状态检查和转换
```

## 概念 5：装饰器模式

### 概念解释

`@circuit_breaker` 装饰器将熔断逻辑透明地添加到目标函数，无需修改业务代码。

### 原理

```python
@circuit_breaker(name="api", failure_threshold=3)
def get_user(user_id):
    return user_service.get(user_id)

# 等价于
def get_user(user_id):
    return user_service.get(user_id)

_breaker = CircuitBreakerManager().get_or_create("get_user")
get_user = _breaker.call(get_user)
```

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [术语表](./glossary.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
