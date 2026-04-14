---
title: Circuit Breaker 模块 - 安全指南
description: Circuit Breaker 熔断器模块安全配置与最佳实践
tag:
  - fqbase
  - circuit_breaker
---

# Circuit Breaker 模块 - 安全指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → **[安全指南](./security.md)** → [故障排查](./troubleshooting.md) → [常见问题](./faq.md) |


## 概述

本文档介绍 Circuit Breaker 熔断器模块的安全特性与最佳实践。

## 安全特性

### 线程安全

Circuit Breaker 所有核心操作都是线程安全的：

```python
from FQBase.Foundation import CircuitBreaker
import threading

breaker = CircuitBreaker(name="api")

def worker():
    for _ in range(1000):
        try:
            breaker.call(func)
        except:
            pass

# 多线程安全使用
threads = [threading.Thread(target=worker) for _ in range(10)]
for t in threads:
    t.start()
```

### 异常隔离

熔断器可以排除特定异常类型，避免误判：

```python
from requests.exceptions import Timeout

# 排除超时异常，这些异常不会触发熔断
breaker = CircuitBreaker(
    name="api",
    excluded_exceptions=(Timeout,)
)
```

## 安全最佳实践

### 1. 敏感信息保护

**建议：** 不要在熔断器名称中包含敏感信息

❌ 错误做法：
```python
breaker = CircuitBreaker(
    name="api_key_12345"  # 包含密钥信息
)
```

✅ 正确做法：
```python
breaker = CircuitBreaker(
    name="payment_api"  # 使用描述性名称
)
```

### 2. 回调函数安全

**建议：** 回调函数应该捕获所有异常，避免阻塞状态转换

✅ 正确做法：

```python
def safe_callback(breaker):
    try:
        send_alert(f"熔断器 {breaker.name} 打开")
    except Exception as e:
        logger.error(f"回调异常: {e}")  # 记录但不抛出

breaker = CircuitBreaker(on_state_change=safe_callback)
```

### 3. 状态监控

**建议：** 实施熔断器状态监控

```python
from FQBase.Foundation import CircuitBreakerManager
import logging

logger = logging.getLogger(__name__)

def monitor_circuits():
    manager = CircuitBreakerManager()
    all_status = manager.get_all_status()
    
    for name, status in all_status.items():
        if status['state'] == 'open':
            logger.warning(f"熔断器 {name} 已打开")
            # 触发告警

# 定期监控
import threading
monitor_thread = threading.Thread(target=lambda: [monitor_circuits() or time.sleep(60) for _ in range(1000)], daemon=True)
monitor_thread.start()
```

### 4. 降级逻辑安全

**建议：** 降级逻辑应该有超时保护

✅ 正确做法：

```python
from FQBase.Foundation import CircuitBreakerOpenException
import requests

@circuit_breaker(name="api")
def call_api():
    return api.request()

def robust_call():
    try:
        return call_api()
    except CircuitBreakerOpenException:
        # 降级调用也应有超时
        return requests.get(fallback_url, timeout=5).json()
    except requests.Timeout:
        # 超时返回空或默认数据
        return default_response()
```

## 输入验证

### 熔断器参数验证

```python
def create_breaker_config(config):
    errors = []
    
    if config.get('failure_threshold', 0) < 1:
        errors.append("failure_threshold 必须 >= 1")
    
    if config.get('recovery_timeout', 0) <= 0:
        errors.append("recovery_timeout 必须 > 0")
    
    if config.get('success_threshold', 0) < 1:
        errors.append("success_threshold 必须 >= 1")
    
    return errors
```

## 安全检查清单

在生产环境中使用熔断器时，请检查：

- [ ] 熔断器名称不包含敏感信息
- [ ] 回调函数已捕获异常
- [ ] 有熔断器状态监控
- [ ] 降级逻辑有超时保护
- [ ] 配置参数已验证
- [ ] 异常处理正确

## 相关文档

- [API参考](./api.md)
- [最佳实践](./best-practices.md)
- [配置指南](./configuration.md)
