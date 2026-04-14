---
title: Foundation 模块 - 开发指南
description: Foundation 模块开发指南
tag:
  - fqbase
  - foundation
---

# Foundation 模块 - 开发指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [使用指南](./usage.md) → **[开发指南](./development.md)** |

## 子模块开发指南

| 子模块 | 开发指南 | 说明 |
|--------|----------|------|
| validators | [开发指南](./validators/development.md) | 输入验证 |
| exceptions | [开发指南](./exceptions/development.md) | 统一异常 |
| retry | [开发指南](./retry/development.md) | 重试装饰器 |
| dotty | [开发指南](./dotty/development.md) | 字典访问 |
| singleton | [开发指南](./singleton/development.md) | 单例模式 |
| lifecycle | [开发指南](./lifecycle/development.md) | 生命周期 |
| container | [开发指南](./container/development.md) | 依赖注入 |
| circuit_breaker | [开发指南](./circuit_breaker/development.md) | 熔断器 |

## 扩展开发

### 添加新验证器

```python
from FQBase.Foundation.validators import register_validator

@register_validator
def validate_custom(value):
    return value is not None
```

### 添加新异常

```python
from FQBase.Foundation.exceptions import FQException

class CustomException(FQException):
    pass
```
