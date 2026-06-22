---
title: notification_template - 通知模板
description: 提供预设的通知模板，支持渲染和自定义
tag:
  - fquant
  - fqbase
  - foundation
  - notification_template

summary:
  type: utility
  complexity: low
  maturity: stable
  size: small
  is_container: false
  api_exports:
    total: 2
    classes:
      - name: NotificationTemplate
        signature: "class NotificationTemplate"
        description: 通知消息模板
        source: "notification_template.py#L28"
      - name: NotificationTemplateRegistry
        signature: "class NotificationTemplateRegistry"
        description: 通知模板注册表
        source: "notification_template.py#L78"
  features:
    has_async: false
    is_thread_safe: false
    has_config: false
    has_logging: false
    has_security: false
  source_location: "Foundation/notification_template.py"
  source_mtime: 1776751707
  last_updated: "2026-04"

relationships:
  belongs_to:
    - fquant.fqbase.foundation
---

# notification_template - 通知模板

## 一句话总览

📌 **提供预设的通知模板，支持渲染和自定义，支持模板注册表管理。**

---

## 核心 API

### NotificationTemplate

**位置：** `notification_template.py#L28`

**描述：** 通知消息模板

```python
from FQBase.Foundation.notification_template import NotificationTemplate

template = NotificationTemplate(
    name='trade_signal',
    title='交易信号',
    body_template='股票: {code}\\n价格: {price}',
    level='info'
)

message = template.render(code='000001', price=12.50)
```

#### 构造参数

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| name | str | - | 模板名称 |
| title | str | - | 模板标题 |
| body_template | str | - | 消息体模板 |
| level | str | 'info' | 级别 |

#### 核心方法

| 方法 | 描述 |
|------|------|
| `render(**kwargs)` | 渲染模板，返回格式化字符串 |
| `render_dict(**kwargs)` | 渲染为字典 |

---

### NotificationTemplateRegistry

**位置：** `notification_template.py#L78`

**描述：** 通知模板注册表

```python
from FQBase.Foundation.notification_template import NotificationTemplateRegistry, NotificationTemplate

registry = NotificationTemplateRegistry()

template = NotificationTemplate(name='alert', title='Alert', body_template='{message}')
registry.register(template)

rendered = registry.render('alert', message='System error!')
```

#### 核心方法

| 方法 | 描述 |
|------|------|
| `register(template)` | 注册模板 |
| `get(name)` | 获取模板 |
| `render(name, **kwargs)` | 渲染指定模板 |
| `list_templates()` | 列出所有模板 |

## 使用场景

### 交易信号通知

```python
from FQBase.Foundation.notification_template import NotificationTemplate

template = NotificationTemplate(
    name='trade_signal',
    title='【交易信号】',
    body_template='策略: {strategy}\\n股票: {code}\\n价格: {price}\\n时间: {time}'
)

message = template.render(
    strategy='均值回归',
    code='000001',
    price=12.50,
    time='2024-01-15 10:30:00'
)
```

### 模板注册与管理

```python
from FQBase.Foundation.notification_template import NotificationTemplateRegistry, NotificationTemplate

registry = NotificationTemplateRegistry()

registry.register(NotificationTemplate(
    name='risk_alert',
    title='风险预警',
    body_template='代码: {code}\\n原因: {reason}'
))

result = registry.render('risk_alert', code='600000', reason='价格异常')
```

## 相关文档

- [Foundation README](./README.md)
- [Foundation API](./api.md)
- [notification](./notification.md)
