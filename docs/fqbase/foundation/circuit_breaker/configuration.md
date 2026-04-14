---
title: Circuit Breaker 模块 - 配置指南
description: Circuit Breaker 熔断器模块配置选项详解
tag:
  - fqbase
  - circuit_breaker
---

# Circuit Breaker 模块 - 配置指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → **[配置指南](./configuration.md)** → [安全指南](./security.md) → [故障排查](./troubleshooting.md) → [常见问题](./faq.md) |


## 概述

本文档详细介绍 Circuit Breaker 熔断器模块的所有配置选项。

## 配置文件

### 文件位置

```yaml
# 默认位置
config/fqbase.yaml

# 或代码中配置
from FQBase.Foundation import CircuitBreaker
```

### 基本配置

```yaml
fqbase:
  circuit_breaker:
    enabled: true
    default_failure_threshold: 5
    default_success_threshold: 2
    default_recovery_timeout: 60
```

## 配置选项

### 核心选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `failure_threshold` | int | 5 | 连续失败次数阈值 |
| `success_threshold` | int | 2 | 半开状态连续成功次数 |
| `recovery_timeout` | float | 60.0 | 恢复超时（秒） |
| `excluded_exceptions` | tuple | () | 排除的异常类型 |
| `on_state_change` | Callable | None | 状态变更回调 |

### 详细说明

#### failure_threshold

触发熔断器打开所需的连续失败次数。

```python
# 连续 5 次失败后打开
breaker = CircuitBreaker(failure_threshold=5)
```

#### success_threshold

半开状态下，连续成功多少次后关闭熔断器。

```python
# 半开状态 2 次成功即关闭
breaker = CircuitBreaker(success_threshold=2)
```

#### recovery_timeout

熔断器打开后，等待多长时间后进入半开状态。

```python
# 60 秒后尝试恢复
breaker = CircuitBreaker(recovery_timeout=60)
```

#### excluded_exceptions

不计入失败计数的异常类型。

```python
from requests.exceptions import Timeout, ConnectionError

# 网络错误不计入失败
breaker = CircuitBreaker(
    excluded_exceptions=(Timeout, ConnectionError)
)
```

## 环境变量

| 变量 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `FQ_CIRCUIT_BREAKER_DISABLED` | str | "false" | 禁用熔断器 |

```bash
# 禁用熔断器
export FQ_CIRCUIT_BREAKER_DISABLED=true

# 启用熔断器（默认）
export FQ_CIRCUIT_BREAKER_DISABLED=false
```

## 配置示例

### 最小配置

```python
from FQBase.Foundation import circuit_breaker

@circuit_breaker
def call_api():
    return api.request()
```

### 完整配置

```python
from FQBase.Foundation import CircuitBreaker
from requests.exceptions import Timeout

def on_state_change(breaker):
    print(f"熔断器 {breaker.name} 状态变为 {breaker.state}")

breaker = CircuitBreaker(
    name="payment_api",
    failure_threshold=10,
    success_threshold=3,
    recovery_timeout=120,
    excluded_exceptions=(Timeout,),
    on_state_change=on_state_change
)
```

### 不同环境配置

```python
import os

env = os.getenv('ENV', 'production')

if env == 'development':
    # 开发环境：宽松配置
    breaker = CircuitBreaker(
        failure_threshold=20,
        recovery_timeout=300
    )
elif env == 'production':
    # 生产环境：严格配置
    breaker = CircuitBreaker(
        failure_threshold=5,
        recovery_timeout=60
    )
```

## 动态配置

### 运行时更新

```python
breaker = CircuitBreaker(name="api")

# 更新配置
breaker.failure_threshold = 10
breaker.recovery_timeout = 120
```

### 配置验证

```python
def validate_config(breaker):
    errors = []
    
    if breaker.failure_threshold < 1:
        errors.append("failure_threshold 必须 >= 1")
    
    if breaker.recovery_timeout < 1:
        errors.append("recovery_timeout 必须 > 0")
    
    if breaker.success_threshold < 1:
        errors.append("success_threshold 必须 >= 1")
    
    return errors
```

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
