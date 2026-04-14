---
title: 通知模板 - 使用指南
description: 通知模板详细使用指南
tag:
  - fqbase
  - core
  - notification_template
---

# 通知模板 - 使用指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [速查表](./cheatsheet.md) → [动手实验室](./workshop.md) → **[使用指南](./usage.md)** → [案例库](./examples.md) |
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → [设计原则](./design.md) → [API参考](./api.md) → [开发指南](./development.md) → **[使用指南](./usage.md)** → [最佳实践](./best-practices.md) |


## 概述

本指南详细介绍如何有效地使用通知模板模块，包括基本用法、自定义模板和高级用法。

## 基本用法

### 使用预设模板

```python
from FQBase.Core.notification_template import NotificationTemplate

# 交易信号
signal_msg = NotificationTemplate.render(
    'trade_signal',
    strategy='均值回归',
    code='000001',
    price=12.50,
    time='2024-01-15 10:30:00'
)

# 风险预警
alert_msg = NotificationTemplate.render(
    'risk_alert',
    risk_type='价格异动',
    details='跌幅超过 5%',
    time='2024-01-15 14:30:00'
)

# 系统异常
error_msg = NotificationTemplate.render(
    'system_error',
    error_type='数据库连接失败',
    details='无法连接到主数据库',
    time='2024-01-15 15:00:00'
)
```

### 获取结构化数据

```python
# 渲染为字典，包含更多信息
result = NotificationTemplate.render_dict(
    'order_update',
    order_id='ORDER_20240115_001',
    code='600000',
    direction='买入',
    volume=1000,
    status='已成交'
)

# result 包含:
# {
#     'name': 'order_update',
#     'title': '【订单更新】',
#     'body': '订单号: ORDER_20240115_001\n标的: 600000\n...',
#     'level': 'info',
#     'variables': {...}
# }
```

## 自定义模板

### 注册自定义模板

```python
from FQBase.Core.notification_template import NotificationTemplate, NotificationTemplateRegistry

# 方式一：使用快捷类方法
new_template = NotificationTemplate(
    name='daily_summary',
    title='【每日汇总】',
    body_template='日期: {date}\n订单数: {order_count}\n成交额: {volume}',
    level='info'
)
NotificationTemplate.register(new_template)

# 方式二：创建注册表实例
registry = NotificationTemplateRegistry()
registry.register(new_template)
```

### 使用自定义模板

```python
# 注册后即可使用
summary = NotificationTemplate.render(
    'daily_summary',
    date='2024-01-15',
    order_count=100,
    volume=1000000
)
```

### 注销模板

```python
# 注销模板
result = NotificationTemplate.unregister('daily_summary')
print(f"注销结果: {result}")  # True 或 False
```

### 模板列表管理

```python
# 列出所有可用模板
names = NotificationTemplate.list_names()
print(f"可用模板: {names}")

# 检查模板是否存在
template = NotificationTemplate.get('trade_signal')
if template:
    print(f"模板存在: {template.name}")
```

## 高级用法

### 与通知服务集成

```python
from FQBase.Core.notification_template import NotificationTemplate
from FQBase.Core.notification import sendWechat

# 渲染并发送
message = NotificationTemplate.render(
    'trade_signal',
    strategy='趋势跟踪',
    code='600000',
    price=15.80,
    time='2024-01-15 10:30:00'
)

sendWechat(message, channel='DEFAULT')
```

### 批量处理

```python
from FQBase.Core.notification_template import NotificationTemplate

# 为多个标的生成消息
signals = [
    {'strategy': '策略A', 'code': '000001', 'price': 10.5, 'time': '10:30'},
    {'strategy': '策略B', 'code': '600000', 'price': 15.8, 'time': '10:31'},
    {'strategy': '策略C', 'code': '300001', 'price': 25.2, 'time': '10:32'},
]

messages = []
for sig in signals:
    msg = NotificationTemplate.render('trade_signal', **sig)
    messages.append(msg)

# 合并发送
combined = "\n\n".join(messages)
```

### 根据通知级别选择渠道

```python
from FQBase.Core.notification_template import NotificationTemplate
from FQBase.Core.notification import sendWechat

def send_with_level(template_name: str, **kwargs):
    """根据模板级别选择渠道发送"""
    result = NotificationTemplate.render_dict(template_name, **kwargs)
    level = result.get('level', 'info')
    body = result.get('title', '') + '\n' + result.get('body', '')

    # 根据级别选择渠道
    channel = {
        'error': 'SYSTEM',
        'warning': 'SYSTEM',
        'info': 'DEFAULT'
    }.get(level, 'DEFAULT')

    return sendWechat(body, channel=channel)

# 使用
send_with_level('system_error', error_type='超时', details='处理超时', time='15:00')
```

## 模板设计最佳实践

### 保持简洁

```python
# 好：简洁的模板
body_template = '标的: {code}\n价格: {price}\n数量: {volume}'

# 避免：过于复杂的模板
body_template = '详细信息：\n标的代码：{code}\n当前价格：{price}\n交易数量：{volume}...'
```

### 包含时间信息

```python
# 好：包含时间
body_template = '股票: {code}\n价格: {price}\n时间: {time}'

# 避免：缺少时间
body_template = '股票: {code}\n价格: {price}'
```

### 使用合适的通知级别

```python
# 错误/异常用 error 级别
NotificationTemplate(
    name='error_template',
    title='【系统异常】',
    body_template='...',
    level='error'  # 错误级别
)

# 警告用 warning 级别
NotificationTemplate(
    name='warning_template',
    title='【风险预警】',
    body_template='...',
    level='warning'  # 警告级别
)

# 一般信息用 info 级别
NotificationTemplate(
    name='info_template',
    title='【交易信号】',
    body_template='...',
    level='info'  # 信息级别
)
```

## 相关文档

- [API参考](./api.md)
- [开发指南](./development.md)
- [最佳实践](./best-practices.md)
