---
title: Business - 使用指南
description: Business 业务配置模块详细使用指南
tag:
  - fqbase
  - config
---

# Business - 使用指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [API参考](./api.md) → **[使用指南](./usage.md)** |


## 概述

详细介绍如何使用 Business 业务配置模块。

## 交易常量使用

### 订单方向

```python
from FQBase.Config.business import ORDER_DIRECTION

direction = ORDER_DIRECTION.BUY   # 买入
direction = ORDER_DIRECTION.SELL  # 卖出
```

### 交易所

```python
from FQBase.Config.business import EXCHANGE_ID

exchange = EXCHANGE_ID.SH    # 上海
exchange = EXCHANGE_ID.SZ    # 深圳
exchange = EXCHANGE_ID.CFFEX # 中金所
```

## 数据源配置

```python
from FQBase.Config.business import get_datasource_priority, get_health_check_config

priority = get_datasource_priority()
health_config = get_health_check_config()
```

## 财务指标

```python
from FQBase.Config.business import FINANCIAL_INDICATORS, FINANCIAL_CATEGORIES

print(FINANCIAL_INDICATORS)
```

---

## 相关文档

- [API参考](./api.md)
