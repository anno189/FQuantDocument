---
title: Foundation 模块 - 使用指南
description: Foundation 模块使用指南
tag:
  - fqbase
  - foundation
---

# Foundation 模块 - 使用指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → **[使用指南](./usage.md)** |

## 子模块使用指南

| 子模块 | 使用指南 | 说明 |
|--------|----------|------|
| validators | [使用指南](./validators/usage.md) | 输入验证 |
| exceptions | [使用指南](./validators/usage.md) | 统一异常 |
| retry | [使用指南](./retry/usage.md) | 重试装饰器 |
| dotty | [使用指南](./dotty/usage.md) | 字典访问 |
| singleton | [使用指南](./singleton/usage.md) | 单例模式 |
| lifecycle | [使用指南](./lifecycle/usage.md) | 生命周期 |
| container | [使用指南](./container/usage.md) | 依赖注入 |
| circuit_breaker | [使用指南](./circuit_breaker/usage.md) | 熔断器 |

## 目录

1. [基础环境](#1-基础环境)
2. [单例模式](#2-单例模式)
3. [依赖注入容器](#3-依赖注入容器)
4. [熔断器](#4-熔断器)
5. [重试装饰器](#5-重试装饰器)
6. [生命周期管理](#6-生命周期管理)
7. [验证器](#7-验证器)
8. [嵌套字典访问](#8-嵌套字典访问)
9. [统一异常处理](#9-统一异常处理)

---

## 1. 基础环境

### 1.1 导入模块

```python
from FQBase.Foundation import (
    singleton,
    ServiceContainer,
    ServiceLocator,
    circuit_breaker,
    retry,
    retry_with_exponential_backoff,
    HealthCheckable,
    CompositeHealthCheck,
    validate_code,
    FQException,
    dotty,
)
```

---

## 2. 单例模式

```python
from FQBase.Foundation import singleton

@singleton
class ConfigManager:
    def __init__(self):
        self.settings = {}

config1 = ConfigManager()
config2 = ConfigManager()
assert config1 is config2  # True
```

---

## 3. 依赖注入容器

```python
from FQBase.Foundation import ServiceContainer, ServiceLocator

container = ServiceContainer()
container.register_singleton(ICache, RedisCache)
cache = container.get(ICache)
```

---

## 4. 熔断器

```python
from FQBase.Foundation import CircuitBreaker

breaker = CircuitBreaker(name="api", failure_threshold=5)
result = breaker.call(call_api)
```

---

## 5. 重试装饰器

```python
from FQBase.Foundation import retry

@retry(max_attempts=3)
def fetch_data():
    return api.get()
```

---

## 6. 生命周期管理

```python
from FQBase.Foundation import HealthCheckable, HealthStatus, ServiceStatus

class MyService(HealthCheckable):
    def health_check(self):
        return HealthStatus(status=ServiceStatus.RUNNING)
```

---

## 7. 验证器

```python
from FQBase.Foundation import validate_code, validate_date

validate_code("600000")   # True
validate_date("2026-04-14")  # True
```

---

## 8. 嵌套字典访问

```python
from FQBase.Foundation import dotty

d = dotty({'user': {'name': '张三'}})
print(d['user.name'])  # 张三
```

---

## 9. 统一异常处理

```python
from FQBase.Foundation import FQException

try:
    raise DataSourceException("Error", code="DS001")
except FQException as e:
    print(e.code)
```
