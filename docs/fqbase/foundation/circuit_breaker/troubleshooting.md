---
title: Circuit Breaker 模块 - 故障排查
description: Circuit Breaker 熔断器模块常见问题与解决方案
tag:
  - fqbase
  - circuit_breaker
---

# Circuit Breaker 模块 - 故障排查

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → [安全指南](./security.md) → **[故障排查](./troubleshooting.md)** → [常见问题](./faq.md) |


## 概述

本文档提供 Circuit Breaker 熔断器模块的常见问题与解决方案。

## 常见问题

### 问题 1: 熔断器频繁打开

**症状：**
- 服务频繁进入 OPEN 状态
- 大量请求被拒绝
- 系统可用性下降

**可能原因：**
- failure_threshold 设置过低
- 外部服务不稳定
- 业务异常未正确处理

**解决方案：**

1. 调整失败阈值：

```python
# 增加失败阈值，从 3 次提升到 10 次
@circuit_breaker(name="api", failure_threshold=10)
def call_api():
    return api.request()
```

2. 排除业务异常：

```python
# 排除可忽略的异常
@circuit_breaker(
    name="api",
    failure_threshold=5,
    excluded_exceptions=(ValidationError,)  # 业务校验异常不计入失败
)
def call_api():
    return api.request()
```

3. 检查外部服务健康状态

---

### 问题 2: 熔断器无法恢复

**症状：**
- 熔断器一直处于 OPEN 状态
- recovery_timeout 后仍无法进入 HALF_OPEN

**可能原因：**
- 状态转换逻辑有问题
- 回调函数抛出异常阻塞转换

**解决方案：**

1. 手动重置熔断器：

```python
from FQBase.Foundation import CircuitBreakerManager

manager = CircuitBreakerManager()
breaker = manager.get("my_api")
breaker.reset()  # 手动重置
```

2. 检查回调函数：

```python
def safe_callback(breaker):
    try:
        send_notification(f"熔断器 {breaker.name} 状态变更")
    except Exception as e:
        print(f"回调异常: {e}")  # 不要让异常阻塞状态转换

breaker = CircuitBreaker(on_state_change=safe_callback)
```

---

### 问题 3: 线程安全问题

**症状：**
- 并发请求时状态不一致
- 计数器出现负数或异常值

**可能原因：**
- 未使用线程安全的方法
- 直接访问内部属性

**解决方案：**

1. 使用线程安全的方法：

```python
# 正确：通过 call 方法
result = breaker.call(func)

# 错误：直接访问（不安全）
breaker._metrics.consecutive_failures += 1
```

2. 使用锁保护：

```python
with breaker._lock:
    # 在锁内操作
    status = breaker.get_status()
```

---

### 问题 4: 异步函数熔断不生效

**症状：**
- 异步函数调用时熔断器状态不变
- 异常未被记录

**可能原因：**
- 使用了同步调用方式
- 未使用 call_async 方法

**解决方案：**

1. 使用异步装饰器（自动检测）：

```python
@circuit_breaker(name="async_api")
async def fetch_data():
    return await api.get()

# 装饰器自动识别异步函数并使用 call_async
```

2. 手动调用异步方法：

```python
breaker = CircuitBreaker(name="async_api")

async def call():
    return await breaker.call_async(async_func)

# asyncio.run(call())
```

---

### 问题 5: 环境变量不生效

**症状：**
- 设置了 FQ_CIRCUIT_BREAKER_DISABLED 但熔断器仍生效

**可能原因：**
- 环境变量设置时机问题
- 环境变量值格式错误

**解决方案：**

1. 确保在导入模块前设置环境变量：

```python
import os
os.environ['FQ_CIRCUIT_BREAKER_DISABLED'] = 'true'

# 然后再导入模块
from FQBase.Foundation import circuit_breaker
```

2. 验证环境变量值：

```python
import os
print(os.getenv('FQ_CIRCUIT_BREAKER_DISABLED'))  # 应该打印 'true'
```

---

## 错误参考

### 错误代码

| 错误类型 | 描述 | 解决方案 |
|----------|------|----------|
| CircuitBreakerOpenException | 熔断器打开 | 等待恢复或检查服务 |
| FQException | 基础异常 | 查看 details 获取详情 |

### 错误处理模式

```python
from FQBase.Foundation import circuit_breaker, CircuitBreakerOpenException

@circuit_breaker(name="api")
def call_api():
    return api.request()

try:
    result = call_api()
except CircuitBreakerOpenException as e:
    print(f"熔断器: {e.circuit_name}")
    print(f"恢复超时: {e.recovery_timeout}s")
    print(f"详情: {e.details}")
except Exception as e:
    print(f"其他错误: {e}")
```

## 诊断工具

### 启用调试日志

```python
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("FQBase.Foundation.circuit_breaker")
logger.setLevel(logging.DEBUG)
```

### 查看熔断器状态

```python
from FQBase.Foundation import CircuitBreakerManager

manager = CircuitBreakerManager()
all_status = manager.get_all_status()

for name, status in all_status.items():
    print(f"\n=== {name} ===")
    print(f"状态: {status['state']}")
    print(f"配置: failure={status['failure_threshold']}, success={status['success_threshold']}, timeout={status['recovery_timeout']}")
    print(f"指标: {status['metrics']}")
```

## 获取帮助

### 联系支持前

1. 启用调试日志
2. 收集错误日志
3. 记录熔断器状态
4. 记录重现步骤

## 相关文档

- [常见问题](./faq.md)
- [最佳实践](./best-practices.md)
- [API参考](./api.md)
