---
title: Business - 最佳实践
description: Business 业务配置模块最佳实践与建议
tag:
  - fqbase
  - config
---

# Business - 最佳实践

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [API参考](./api.md) → [使用指南](./usage.md) → **[最佳实践](./best-practices.md)** |


## 概述

使用 Business 业务配置模块的最佳实践。

## 最佳实践

### 使用枚举而非字符串

```python
# 好：使用枚举
from FQBase.Config.business import ORDER_DIRECTION
if order['direction'] == ORDER_DIRECTION.BUY:
    print("买入")

# 差：使用字符串
if order['direction'] == 'BUY':
    print("买入")
```

---

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
