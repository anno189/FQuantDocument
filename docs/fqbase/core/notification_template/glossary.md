---
title: 通知模板 - 术语表
description: 通知模板模块术语定义与解释
tag:
  - fqbase
  - core
  - notification_template
---

# 通知模板 - 术语表

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → **[术语表](./glossary.md)** → [核心概念](./concepts.md) → [使用指南](./usage.md) |


## 概述

本术语表定义了通知模板模块中的核心术语和概念。

## 术语

### 模板

**定义：** 预定义的消息格式结构，包含标题和正文模板。正文模板支持变量占位符，渲染时会被实际值替换。

**示例：**

```python
NotificationTemplate(
    name='trade_signal',
    title='【交易信号】',
    body_template='{strategy}\n股票: {code}\n价格: {price}\n时间: {time}',
    level='info',
)
```

### 模板渲染

**定义：** 将变量值填充到模板占位符的过程，生成最终的消息字符串。

**示例：**

```python
# 渲染前
body_template = '{strategy}\n股票: {code}'

# 渲染后
result = body_template.format(strategy='均值回归', code='000001')
# 结果: "均值回归\n股票: 000001"
```

### 模板注册表

**定义：** NotificationTemplateRegistry 类，管理所有模板的注册、注销和获取。

### 预设模板

**定义：** 模块内置的 8 种模板类型：
- trade_signal：交易信号
- risk_alert：风险预警
- system_error：系统异常
- order_update：订单更新
- position_update：持仓更新
- account_update：账户更新
- backtest_complete：回测完成
- data_alert：数据警告

### 模板变量

**定义：** 渲染模板时需要提供的参数，对应模板中的 `{variable_name}` 占位符。

**示例：**

```python
# 这些是模板变量
NotificationTemplate.render(
    'trade_signal',
    strategy='均值回归',   # 变量: strategy
    code='000001',         # 变量: code
    price=12.50,           # 变量: price
    time='2024-01-15'      # 变量: time
)
```

### 通知级别

**定义：** 模板所属的通知级别，用于区分不同类型的通知：
- info：信息
- warning：警告
- error：错误

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [核心概念](./concepts.md)
- [使用指南](./usage.md)
