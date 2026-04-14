---
title: 统一异常处理系统 - API 参考
description: 异常类完整 API 文档
tag:
  - fqbase
  - exceptions
---

# 统一异常处理系统 - API 参考

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [使用指南](./usage.md) → **[API参考](./api.md)** |


## 异常类

### FQException

```python
class FQException(Exception):
    def __init__(self, message: str, code: str = None, details: dict = None)
```

### DataSourceException

```python
class DataSourceException(FQException)
```

### ValidationException

```python
class ValidationException(FQException)
```

## 相关文档

- [使用指南](./usage.md)
- [快速入门](./quick-start.md)
