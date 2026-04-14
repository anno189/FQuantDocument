---
title: Circuit Breaker 模块 - 动手实验室
description: Circuit Breaker 熔断器模块动手练习指南
tag:
  - fqbase
  - circuit_breaker
---

# Circuit Breaker 模块 - 动手实验室

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [速查表](./cheatsheet.md) → **[动手实验室](./workshop.md)** → [使用指南](./usage.md) → [案例库](./examples.md) |


## 概述

本实验室通过实际练习帮助您掌握 Circuit Breaker 熔断器的使用。

## 准备环境

```bash
pip install fquant-base
```

## Lab 1: 基本使用

### 目标

掌握熔断器的基本使用方式

### 练习代码

```python
from FQBase.Foundation import circuit_breaker, CircuitBreakerOpenException

call_count = 0

@circuit_breaker(name="lab1", failure_threshold=3, recovery_timeout=5)
def unstable_function():
    global call_count
    call_count += 1
    
    if call_count <= 5:
        raise Exception("模拟失败")
    return "成功"

# 测试调用
for i in range(10):
    try:
        result = unstable_function()
        print(f"第 {i+1} 次调用: 成功 - {result}")
    except CircuitBreakerOpenException as e:
        print(f"第 {i+1} 次调用: 熔断器打开 - 等待 {e.recovery_timeout}s")
    except Exception as e:
        print(f"第 {i+1} 次调用: 失败 - {e}")
```

### 任务

1. 运行代码观察熔断器打开
2. 等待 recovery_timeout 后观察半开状态
3. 记录状态变化

---

## Lab 2: 手动管理

### 目标

掌握手动创建和管理熔断器

### 练习代码

```python
from FQBase.Foundation import CircuitBreaker, CircuitState

breaker = CircuitBreaker(
    name="lab2",
    failure_threshold=3,
    success_threshold=2,
    recovery_timeout=5
)

# 模拟失败
for i in range(5):
    try:
        breaker.call(lambda: (_ for _ in ()).throw(Exception("失败")))
    except:
        pass

print(f"状态: {breaker.state.value}")
print(f"连续失败: {breaker.metrics.consecutive_failures}")

# 查看状态
status = breaker.get_status()
print(f"完整状态: {status}")
```

### 任务

1. 创建熔断器实例
2. 模拟失败触发熔断
3. 查看熔断器状态和指标

---

## Lab 3: 降级逻辑

### 目标

掌握熔断器打开时的降级处理

### 练习代码

```python
from FQBase.Foundation import circuit_breaker, CircuitBreakerOpenException

cache_data = {"user": "cached_user"}

@circuit_breaker(name="lab3", failure_threshold=2)
def get_user(user_id):
    raise Exception("服务不可用")

def get_user_with_fallback(user_id):
    """带降级的获取用户函数"""
    try:
        return get_user(user_id)
    except CircuitBreakerOpenException:
        # 降级逻辑：返回缓存数据
        return cache_data
    except Exception:
        # 其他异常也降级
        return cache_data

# 测试降级
for i in range(5):
    result = get_user_with_fallback(123)
    print(f"结果: {result}")
```

### 任务

1. 实现降级逻辑
2. 观察熔断打开后的降级行为

---

## Lab 4: 异步熔断

### 目标

掌握异步函数的熔断使用

### 练习代码

```python
import asyncio
from FQBase.Foundation import circuit_breaker

call_count = 0

@circuit_breaker(name="lab4", failure_threshold=3, recovery_timeout=5)
async def async_unstable():
    global call_count
    call_count += 1
    
    if call_count <= 3:
        raise Exception("异步失败")
    return "异步成功"

async def main():
    for i in range(6):
        try:
            result = await async_unstable()
            print(f"第 {i+1} 次: {result}")
        except Exception as e:
            print(f"第 {i+1} 次: {e}")
        await asyncio.sleep(1)

asyncio.run(main())
```

### 任务

1. 使用异步装饰器
2. 观察异步函数的熔断行为

---

## Lab 5: 状态监控

### 目标

掌握熔断器状态监控

### 练习代码

```python
from FQBase.Foundation import CircuitBreaker, CircuitState

state_changes = []

def on_state_change(breaker):
    """状态变更回调"""
    change = {
        'name': breaker.name,
        'old_state': breaker._state.value,
        'new_state': breaker.state.value
    }
    state_changes.append(change)
    print(f"状态变更: {change}")

breaker = CircuitBreaker(
    name="lab5",
    failure_threshold=2,
    on_state_change=on_state_change
)

# 触发状态变更
for i in range(5):
    try:
        breaker.call(lambda: (_ for _ in ()).throw(Exception("失败")))
    except:
        pass

print(f"\n状态变更记录: {state_changes}")
print(f"状态变更次数: len(state_changes)}")
```

### 任务

1. 实现状态监控回调
2. 记录状态变更历史

---

## 实验室总结

完成所有实验后，你应该掌握：

- [x] 熔断器基本使用
- [x] 手动管理熔断器
- [x] 实现降级逻辑
- [x] 异步函数熔断
- [x] 状态监控

## 下一步

- 学习 [最佳实践](./best-practices.md)
- 查看 [案例库](./examples.md)
- 阅读 [API参考](./api.md)

## 相关文档

- [README](./README.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
- [API参考](./api.md)
