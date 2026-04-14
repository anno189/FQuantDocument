---
title: 通知模板 - 快速入门
description: 5分钟快速上手通知模板模块
tag:
  - fqbase
  - core
  - notification_template

summary:
  purpose: quick-start
  complexity: low
---

# 通知模板 - 快速入门

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → **[快速入门](./quick-start.md)** → [速查表](./cheatsheet.md) → [动手实验室](./workshop.md) → [使用指南](./usage.md) → [案例库](./examples.md) |


## 概述

5分钟快速上手指南，帮助您快速集成通知模板系统。

## 前置要求

- Python 3.8+
- pip

## 安装

```bash
pip install fquant-fqbase
```

## 5分钟上手

### Step 1: 导入模块

```python
from FQBase.Core.notification_template import NotificationTemplate
```

### Step 2: 渲染预设模板

使用预设的模板类型渲染消息：

```python
# 渲染交易信号模板
message = NotificationTemplate.render(
    'trade_signal',
    strategy='均值回归',
    code='000001',
    price=12.50,
    time='2024-01-15 10:30:00'
)

print(message)
# 输出: 【交易信号】均值回归
# 股票: 000001
# 价格: 12.5
# 时间: 2024-01-15 10:30:00
```

### Step 3: 使用不同模板

```python
# 风险预警模板
alert = NotificationTemplate.render(
    'risk_alert',
    risk_type='价格异动',
    details='股票 600000 跌幅超过 5%',
    time='2024-01-15 14:30:00'
)

# 系统异常模板
error = NotificationTemplate.render(
    'system_error',
    error_type='数据库连接失败',
    details='无法连接到主数据库',
    time='2024-01-15 15:00:00'
)

# 订单更新模板
order = NotificationTemplate.render(
    'order_update',
    order_id='ORDER_20240115_001',
    code='600000',
    direction='买入',
    volume=1000,
    status='已成交'
)
```

### Step 4: 渲染为字典

如果需要更结构化的输出，可以使用 render_dict：

```python
result = NotificationTemplate.render_dict(
    'trade_signal',
    strategy='均值回归',
    code='000001',
    price=12.50,
    time='2024-01-15 10:30:00'
)

print(result)
# 输出: {'name': 'trade_signal', 'title': '【交易信号】', 'body': '...', 'level': 'info', 'variables': {...}}
```

### 完成！

恭喜！你已经学会了通知模板的基本用法。

## ⚠️ 常见陷阱

1. **陷阱 1：模板变量名称错误**
   - ❌ 错误做法：`NotificationTemplate.render('trade_signal', stock='000001')`
   - ✅ 正确做法：`NotificationTemplate.render('trade_signal', code='000001')`

2. **陷阱 2：缺少必需变量**
   - ❌ 错误做法：`NotificationTemplate.render('trade_signal', strategy='均值回归')`
   - ✅ 正确做法：`NotificationTemplate.render('trade_signal', strategy='均值回归', code='000001', price=12.50, time='2024-01-15')`

## 下一步

- 学习 [核心概念](./concepts.md)
- 阅读 [术语表](./glossary.md)
- 查看 [使用指南](./usage.md)

## 相关文档

- [README](./README.md)
- [术语表](./glossary.md)
- [核心概念](./concepts.md)
- [使用指南](./usage.md)
