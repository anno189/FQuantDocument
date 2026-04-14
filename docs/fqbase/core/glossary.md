---
title: Core - 术语表
description: Core 基础设施核心层术语定义与解释
tag:
  - fqbase
  - core
---

# Core - 术语表

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → **[术语表](./glossary.md)** → [核心概念](./concepts.md) |


## 概述

本文档列出 Core 模块及其子模块中使用的核心术语。各子模块的详细术语请参考各自文档。

## 通用术语

### EventBus（事件总线）

**定义：** 事件总线是发布-订阅模式的核心实现，负责事件的注册、发布和分发。

**示例：**

```python
from FQBase.Core import get_event_bus
event_bus = get_event_bus()
```

### Event（事件）

**定义：** 事件是描述系统中发生的事情的数据结构，包含事件类型和事件数据。

**示例：**

```python
from FQBase.Core import Event
event = Event('trade_signal', {'code': '000001', 'price': 12.5})
```

### 发布-订阅模式

**定义：** 一种消息传递模式，发布者发布消息，订阅者接收消息，两者不直接耦合。

### 统一日志系统

**定义：** 为整个项目提供一致的日志记录能力，包括日志级别、格式化、输出目标等。

### 通知渠道

**定义：** 通知服务的发送通道，如企业微信、Server酱、PushBear 等。

## 子模块术语索引

### event_bus 子模块术语

| 术语 | 定义 | 详细文档 |
|------|------|----------|
| EventBus | 事件总线核心类 | [event_bus/glossary](./event_bus/glossary.md) |
| Event | 事件对象 | [event_bus/glossary](./event_bus/glossary.md) |
| Subscription | 订阅关系 | [event_bus/glossary](./event_bus/glossary.md) |
| EventHistory | 事件历史记录 | [event_bus/glossary](./event_bus/glossary.md) |

### logger 子模块术语

| 术语 | 定义 | 详细文档 |
|------|------|----------|
| FQLogger | 日志记录器封装 | [logger/glossary](./logger/glossary.md) |
| 日志级别 | DEBUG, INFO, WARNING, ERROR, CRITICAL | [logger/glossary](./logger/glossary.md) |
| 日志格式化 | 日志输出格式配置 | [logger/glossary](./logger/glossary.md) |

### notification 子模块术语

| 术语 | 定义 | 详细文档 |
|------|------|----------|
| NotificationManager | 通知管理器 | [notification/glossary](./notification/glossary.md) |
| WECOM_CHANNELS | 企业微信渠道常量 | [notification/glossary](./notification/glossary.md) |
| ServerChan | Server酱渠道 | [notification/glossary](./notification/glossary.md) |
| PushBear | PushBear 渠道 | [notification/glossary](./notification/glossary.md) |

### notification_template 子模块术语

| 术语 | 定义 | 详细文档 |
|------|------|----------|
| NotificationTemplate | 通知消息模板 | [notification_template/glossary](./notification_template/glossary.md) |
| NotificationTemplateRegistry | 模板注册表 | [notification_template/glossary](./notification_template/glossary.md) |

### event_bus_celery 子模块术语

| 术语 | 定义 | 详细文档 |
|------|------|----------|
| setup_event_bus | EventBus 初始化函数 | [event_bus_celery/glossary](./event_bus_celery/glossary.md) |
| clear_event_bus | EventBus 清理函数 | [event_bus_celery/glossary](./event_bus_celery/glossary.md) |

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [核心概念](./concepts.md)
- [使用指南](./usage.md)
- [event_bus 子模块](./event_bus/)
- [logger 子模块](./logger/)
- [notification 子模块](./notification/)
