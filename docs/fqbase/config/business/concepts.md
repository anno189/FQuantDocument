---
title: Business - 核心概念
description: 深入理解 Business 业务配置模块的核心概念
tag:
  - fqbase
  - config
---

# Business - 核心概念

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [术语表](./glossary.md) → **[核心概念](./concepts.md)** |


## 概念 1: 交易常量

### 概念解释

交易常量是量化交易中使用的标准枚举值，包括订单方向、交易所、订单状态等。

### 代码示例

```python
from FQBase.Config.business import ORDER_DIRECTION, EXCHANGE_ID

direction = ORDER_DIRECTION.BUY
exchange = EXCHANGE_ID.SH
```

## 概念 2: 数据源配置

### 概念解释

数据源配置管理多个数据源的优先级和健康检查。

### 代码示例

```python
from FQBase.Config.business import get_datasource_priority

priority = get_datasource_priority()
```

## 概念 3: 财务指标映射

### 概念解释

财务指标与数据库字段的映射关系。

### 代码示例

```python
from FQBase.Config.business import FINANCIAL_INDICATORS

print(FINANCIAL_INDICATORS)
```

---

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [术语表](./glossary.md)
- [使用指南](./usage.md)
