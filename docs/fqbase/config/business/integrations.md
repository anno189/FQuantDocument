---
title: Business - 集成指南
description: Business 业务配置模块第三方集成指南
tag:
  - fqbase
  - config
---

# Business - 集成指南

## 概述

Business 业务配置模块的集成指南。

## 交易系统集成

```python
from FQBase.Config.business import (
    ORDER_DIRECTION,
    EXCHANGE_ID,
    ORDER_MODEL,
)

# 集成到交易系统
order_params = {
    'direction': ORDER_DIRECTION.BUY,
    'exchange': EXCHANGE_ID.SH,
    'model': ORDER_MODEL.LIMIT,
}
```

---

## 相关文档

- [API参考](./api.md)
