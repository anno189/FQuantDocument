---
title: Core - 最佳实践
description: Core 核心配置模块最佳实践与建议
tag:
  - fqbase
  - config
---

# Core - 最佳实践

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [API参考](./api.md) → [使用指南](./usage.md) → **[最佳实践](./best-practices.md)** |


## 概述

有效使用 Core 核心配置模块的最佳实践。

## 最佳实践

### 1. 使用默认值

```python
value = get_env('KEY', 'default_value')
```

### 2. 敏感配置检测

```python
api_key = get_secure_env('API_KEY')
if api_key is None:
    raise ValueError("API_KEY 未配置")
```

---

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
