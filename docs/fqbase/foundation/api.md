---
title: Foundation 模块 - API 参考
description: Foundation 模块 API 参考
tag:
  - fqbase
  - foundation
---

# Foundation 模块 - API 参考

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [使用指南](./usage.md) → **[API参考](./api.md)** |

## 子模块 API 参考

| 子模块 | API 参考 | 说明 |
|--------|----------|------|
| validators | [API参考](./validators/api.md) | 输入验证 |
| exceptions | [API参考](./exceptions/api.md) | 统一异常 |
| retry | [API参考](./retry/api.md) | 重试装饰器 |
| dotty | [API参考](./dotty/api.md) | 字典访问 |
| singleton | [API参考](./singleton/api.md) | 单例模式 |
| lifecycle | [API参考](./lifecycle/api.md) | 生命周期 |
| container | [API参考](./container/api.md) | 依赖注入 |
| circuit_breaker | [API参考](./circuit_breaker/api.md) | 熔断器 |

## 导出模块

```python
from FQBase.Foundation import (
    # validators
    validate_code,
    validate_date,
    validate_market,
    # exceptions
    FQException,
    DataSourceException,
    # retry
    retry,
    retry_with_exponential_backoff,
    # singleton
    Singleton,
    # lifecycle
    HealthCheckable,
    CompositeHealthCheck,
    # container
    ServiceContainer,
    ServiceLocator,
    # circuit_breaker
    CircuitBreaker,
    circuit_breaker,
    # dotty
    dotty,
)
```
