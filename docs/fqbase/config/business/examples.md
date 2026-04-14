---
title: Business - 案例库
description: Business 业务配置模块实际应用场景与示例
tag:
  - fqbase
  - config
---

# Business - 案例库

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [使用指南](./usage.md) → **[案例库](./examples.md)** |


## 概述

Business 业务配置模块的应用场景。

## 示例

### 示例：创建订单

```python
from FQBase.Config.business import (
    ORDER_DIRECTION,
    EXCHANGE_ID,
    ORDER_MODEL,
)

order = {
    'direction': ORDER_DIRECTION.BUY,
    'exchange': EXCHANGE_ID.SH,
    'model': ORDER_MODEL.LIMIT,
    'price': 10.5,
    'volume': 100,
}
```

---

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
