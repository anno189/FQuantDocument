---
title: datetime - 快速入门
description: 5分钟快速上手 datetime 模块
tag:
  - fqdata
  - trade
  - datetime

summary:
  purpose: quick-start
  complexity: low
---

# datetime - 快速入门

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → **[快速入门](./quick-start.md)** → [使用指南](./usage.md) → [案例库](./examples.md) |


## 概述

5分钟快速上手 datetime 模块

## 前置要求

- Python 3.8+
- pip

## 5分钟上手

### Step 1: 导入模块

```python
from FQData.Trade.datetime import util_if_trade, util_get_next_trade_date
```

### Step 2: 判断交易日

```python
# 判断是否为交易日
is_trade = util_if_trade('2024-01-15')
print(is_trade)  # True 或 False
```

### Step 3: 获取交易日

```python
# 获取下一个交易日
next_date = util_get_next_trade_date('2024-01-15')

# 获取前一个交易日
from FQData.Trade.datetime import util_get_pre_trade_date
pre_date = util_get_pre_trade_date('2024-01-15')
```

### Step 4: 日期计算

```python
# 日期加减
from FQData.Trade.datetime import util_date_gap

# 加3天
result = util_date_gap('2024-01-15', 3, '+')

# 减5天
result = util_date_gap('2024-01-15', 5, '-')
```

### Step 5: 完成！

恭喜！你已经学会了 datetime 模块的基本用法。

## ⚠️ 常见陷阱

1. **陷阱 1：日期格式错误**
   - ❌ 错误做法：`util_if_trade('2024/01/15')`
   - ✅ 正确做法：`util_if_trade('2024-01-15')`

2. **陷阱 2：仅支持上交所交易日**
   - ❌ 错误做法：假设所有市场交易日相同
   - ✅ 正确做法：根据目标市场单独判断

## 下一步

- 学习 [核心概念](./concepts.md)
- 阅读 [API参考](./api.md)
- 查看 [使用指南](./usage.md)

## 相关文档

- [README](./README.md)
- [API参考](./api.md)
- [使用指南](./usage.md)
