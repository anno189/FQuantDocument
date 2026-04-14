---
title: 通知模板 - 核心概念
description: 深入理解通知模板模块的核心概念
tag:
  - fqbase
  - core
  - notification_template
---

# 通知模板 - 核心概念

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [术语表](./glossary.md) → **[核心概念](./concepts.md)** → [使用指南](./usage.md) |


## 概述

本章节深入介绍通知模板模块的核心概念，帮助开发者理解模块的设计和实现原理。

## 概念 1: 模板数据类

### 概念解释

NotificationTemplate 是一个 dataclass，用于定义通知模板的结构化数据。每个模板包含名称、标题、正文模板和级别。

### 原理

模板使用 Python 的 string.format() 方法进行变量替换，支持任意数量的占位符。

### 代码示例

```python
from FQBase.Core.notification_template import NotificationTemplate

# 定义一个模板
template = NotificationTemplate(
    name='custom_template',
    title='【自定义】',
    body_template='订单号: {order_id}\n金额: {amount}',
    level='info'
)

# 渲染模板
result = template.render(order_id='12345', amount=1000)
print(result)
# 输出: 订单号: 12345
#       金额: 1000
```

## 概念 2: 模板注册表

### 概念解释

NotificationTemplateRegistry 是模板注册表，管理所有模板的注册、注销和获取。它在模块加载时自动注册 8 种预设模板。

### 原理

注册表使用字典存储模板，键为模板名称，支持新增、删除、查询操作。

### 代码示例

```python
from FQBase.Core.notification_template import NotificationTemplateRegistry

# 创建注册表实例
registry = NotificationTemplateRegistry()

# 注册新模板
registry.register(NotificationTemplate(
    name='my_template',
    title='【我的模板】',
    body_template='内容: {content}',
    level='info'
))

# 获取模板
template = registry.get('my_template')

# 渲染模板
result = registry.render('my_template', content='Hello')

# 列出所有模板
names = registry.list_template_names()
print(names)  # ['trade_signal', 'risk_alert', ..., 'my_template']
```

## 概念 3: 快捷访问类

### 概念解释

NotificationTemplate 也是一个快捷访问类，提供了类方法可以直接调用模板渲染和注册功能，无需创建注册表实例。

### 原理

内部使用全局单例注册表 `_registry`，提供静态方法接口。

### 代码示例

```python
from FQBase.Core.notification_template import NotificationTemplate

# 直接使用类方法渲染
message = NotificationTemplate.render('trade_signal', strategy='均值回归', code='000001')

# 渲染为字典
data = NotificationTemplate.render_dict('trade_signal', strategy='均值回归', code='000001')

# 列出所有模板名称
names = NotificationTemplate.list_names()
```

## 概念 4: 错误处理

### 概念解释

模板渲染时会处理变量缺失的情况，如果缺少必需的变量，会返回错误信息而不是抛出异常。

### 代码示例

```python
from FQBase.Core.notification_template import NotificationTemplate

# 缺少变量时的处理
result = NotificationTemplate.render('trade_signal', strategy='均值回归')
# 输出: [Template Error: missing variable 'code'] {strategy}
#       股票: {code}
#       ...

# 模板不存在时的处理
result = NotificationTemplate.render('nonexistent', name='test')
# 输出: [Template not found: nonexistent]
```

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [术语表](./glossary.md)
- [使用指南](./usage.md)
