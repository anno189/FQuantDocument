---
title: Circuit Breaker 模块 - 快速入门
description: 5分钟快速上手 Circuit Breaker 熔断器模块
tag:
  - fqbase
  - circuit_breaker

summary:
  purpose: quick-start
  complexity: low
---

# Circuit Breaker 模块 - 快速入门

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → **[快速入门](./quick-start.md)** → [速查表](./cheatsheet.md) → [动手实验室](./workshop.md) → [使用指南](./usage.md) → [案例库](./examples.md) |


## 概述

本指南将帮助您在 5 分钟内掌握 Circuit Breaker 熔断器模块的基本用法。

## 前置要求

- Python 3.8+
- pip
- FQBase 已安装

## 安装

```bash
pip install fquant-base
```

## 5分钟上手

### Step 1: 导入模块

```python
from FQBase.Foundation import circuit_breaker, CircuitBreaker
```

### Step 2: 使用装饰器（最简单方式）

```python
@circuit_breaker(name="user_api", failure_threshold=3, recovery_timeout=30)
def get_user(user_id):
    return user_service.get(user_id)

# 调用时自动启用熔断保护
user = get_user(123)
```

### Step 3: 手动管理（更细粒度控制）

```python
from FQBase.Foundation import CircuitBreaker

breaker = CircuitBreaker(
    name="payment_api",
    failure_threshold=5,
    success_threshold=2,
    recovery_timeout=60
)

try:
    result = breaker.call(payment_service.process, order_id=123)
except CircuitBreakerOpenException as e:
    print(f"服务暂不可用，请 {e.recovery_timeout} 秒后重试")
```

### Step 4: 查看熔断器状态

```python
status = breaker.get_status()
print(f"当前状态: {status['state']}")
print(f"失败次数: {status['metrics']['consecutive_failures']}")
print(f"成功率: {status['metrics']['success_rate']}")
```

## ⚠️ 常见陷阱

### 陷阱 1：未处理 CircuitBreakerOpenException

**问题**：熔断器打开后抛出异常，未捕获导致程序崩溃

❌ 错误做法：
```python
@circuit_breaker(failure_threshold=3)
def call_api():
    return api.request()
    
result = call_api()  # 可能抛出异常
```

✅ 正确做法：
```python
from FQBase.Foundation import CircuitBreakerOpenException

@circuit_breaker(failure_threshold=3)
def call_api():
    return api.request()

try:
    result = call_api()
except CircuitBreakerOpenException:
    # 熔断器打开，执行降级逻辑
    return get_cache_data()
```

### 陷阱 2：异常未正确传递

**问题**：在装饰器内捕获异常但未重新抛出

❌ 错误做法：
```python
@circuit_breaker(failure_threshold=3)
def call_api():
    try:
        return api.request()
    except Exception:
        return None  # 错误！应该让异常传播
```

✅ 正确做法：
```python
@circuit_breaker(failure_threshold=3)
def call_api():
    return api.request()  # 让异常自然传播，熔断器会自动记录
```

### 陷阱 3：忘记排除非业务异常

**问题**：网络超时等可恢复异常被计入失败

❌ 错误做法：
```python
@circuit_breaker(failure_threshold=3)
def call_api():
    return api.request()  # 任何异常都会触发熔断
```

✅ 正确做法：
```python
from requests.exceptions import Timeout

@circuit_breaker(
    failure_threshold=3,
    excluded_exceptions=(Timeout,)  # 排除超时异常
)
def call_api():
    return api.request()
```

## 下一步

- 学习 [核心概念](./concepts.md) - 理解熔断器原理
- 阅读 [术语表](./glossary.md) - 了解专业术语
- 查看 [使用指南](./usage.md) - 深入使用

## 相关文档

- [README](./README.md)
- [术语表](./glossary.md)
- [核心概念](./concepts.md)
- [使用指南](./usage.md)
