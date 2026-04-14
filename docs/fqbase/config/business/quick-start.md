---
title: Business - 快速入门
description: 5分钟快速上手 Business 业务配置模块
tag:
  - fqbase
  - config

summary:
  purpose: quick-start
  complexity: low
---

# Business - 快速入门

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → **[快速入门](./quick-start.md)** → [使用指南](./usage.md) |


## 概述

5分钟快速上手 Business 业务配置模块。

## 5分钟上手

### Step 1: 导入模块

```python
from FQBase.Config.business import ORDER_DIRECTION, MARKET_TYPE
```

### Step 2: 使用交易常量

```python
# 订单方向
print(ORDER_DIRECTION.BUY)   # 买入
print(ORDER_DIRECTION.SELL)  # 卖出

# 市场类型
print(MARKET_TYPE.SH)        # 上海
print(MARKET_TYPE.SZ)        # 深圳
```

### Step 3: 完成！

## 相关文档

- [README](./README.md)
- [使用指南](./usage.md)
