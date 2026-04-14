---
title: 统一异常处理系统 - 使用指南
description: 异常处理系统使用指南
tag:
  - fqbase
  - exceptions
---

# 统一异常处理系统 - 使用指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → **[使用指南](./usage.md)** → [API参考](./api.md) |


## 异常处理

### 捕获异常

```python
try:
    # 业务代码
    pass
except FQException as e:
    print(e.message)
    print(e.code)
```

### 抛出异常

```python
raise DataSourceException("数据获取失败", code="DS001")
```

## 相关文档

- [API参考](./api.md)
- [快速入门](./quick-start.md)
