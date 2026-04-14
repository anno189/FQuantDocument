---
title: Circuit Breaker 模块 - 速查表
description: Circuit Breaker 熔断器模块快速参考指南
tag:
  - fqbase
  - circuit_breaker
---

# Circuit Breaker 模块 - 速查表

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → **[速查表](./cheatsheet.md)** → [动手实验室](./workshop.md) → [使用指南](./usage.md) → [案例库](./examples.md) |


## 快速参考

### 导入

```python
from FQBase.Foundation import (
    CircuitBreaker,           # 熔断器类
    CircuitBreakerManager,   # 管理器
    CircuitBreakerOpenException,  # 异常
    CircuitState,             # 状态枚举
    circuit_breaker,          # 装饰器
)
```

### 快速开始

```python
# 装饰器方式（最简单）
@circuit_breaker(name="api", failure_threshold=5)
def call_api():
    return api.request()

# 手动方式（更灵活）
breaker = CircuitBreaker(name="api", failure_threshold=5)
result = breaker.call(your_function)
```

### 状态

```python
CircuitState.CLOSED     # 关闭，正常执行
CircuitState.OPEN       # 打开，拒绝请求
CircuitState.HALF_OPEN # 半开，尝试恢复
```

### 异常处理

```python
from FQBase.Foundation import CircuitBreakerOpenException

try:
    result = breaker.call(func)
except CircuitBreakerOpenException as e:
    print(f"熔断器打开: {e.circuit_name}")
    print(f"等待: {e.recovery_timeout}秒")
```

### 配置参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| name | 函数名 | 熔断器名称 |
| failure_threshold | 5 | 连续失败次数 |
| success_threshold | 2 | 半开成功次数 |
| recovery_timeout | 60.0 | 恢复超时(秒) |
| excluded_exceptions | () | 排除的异常 |

### 环境变量

```bash
# 禁用熔断器
export FQ_CIRCUIT_BREAKER_DISABLED=true
```

## 常用代码片段

### 装饰器

```python
@circuit_breaker(name="payment", failure_threshold=3)
def pay(order_id):
    return payment.process(order_id)
```

### 手动调用

```python
breaker = CircuitBreaker(name="db", failure_threshold=10)
try:
    result = breaker.call(db.query, "SELECT * FROM users")
except CircuitBreakerOpenException:
    return cached_data
```

### 上下文管理器

```python
with CircuitBreaker(name="api") as breaker:
    result = breaker.call(api.call)
```

### 异步

```python
@circuit_breaker(name="async_api")
async def fetch_data():
    return await api.get()
```

### 管理器

```python
manager = CircuitBreakerManager()
manager.register("api", failure_threshold=5)
status = manager.get_all_status()
```

### 状态回调

```python
def on_change(breaker):
    print(f"状态变更: {breaker.name} -> {breaker.state}")

breaker = CircuitBreaker(on_state_change=on_change)
```

## 快速调试

```python
# 查看状态
status = breaker.get_status()
print(status['state'])
print(status['metrics']['success_rate'])

# 重置熔断器
breaker.reset()

# 查看所有熔断器
all_status = CircuitBreakerManager().get_all_status()
```

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
- [案例库](./examples.md)
