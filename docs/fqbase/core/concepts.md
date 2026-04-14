---
title: Core - 核心概念
description: 深入理解 Core 基础设施核心层的核心概念
tag:
  - fqbase
  - core
---

# Core - 核心概念

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → **[核心概念](./concepts.md)** → [技术架构](./architecture.md) |
| 🔵 开发者 | [README](./README.md) → [技术架构](./architecture.md) → **[核心概念](./concepts.md)** → [API参考](./api.md) |


## 概述

Core 作为容器模块，核心概念主要围绕各子模块的协同工作。本文档从系统角度阐述基础设施的核心概念。

## 概念 1: 事件驱动架构

### 概念解释

事件驱动架构（Event-Driven Architecture）是一种软件架构模式，通过事件的发布和订阅来实现组件间的松耦合通信。

### 原理

1. 事件发布者（Publisher）不直接调用订阅者，而是发布事件到事件总线
2. 事件总线（EventBus）负责事件的路由和分发
3. 事件订阅者（Subscriber）根据自己的兴趣订阅相应类型的事件
4. 当事件发生时，事件总线自动通知所有订阅者

### 代码示例

```python
from FQBase.Core import get_event_bus, Event

event_bus = get_event_bus()

# 订阅者
@event_bus.subscribe('price_alert')
def handle_price_alert(event):
    print(f"价格提醒: {event.data}")

# 发布者
event_bus.publish(Event('price_alert', {'price': 100.5, 'code': '000001'}))
```

## 概念 2: 统一日志系统

### 概念解释

统一日志系统为整个 FQuant 项目提供一致的日志记录能力，支持多级别、多输出目标、格式化输出等功能。

### 原理

- 日志级别：DEBUG < INFO < WARNING < ERROR < CRITICAL
- 日志输出：控制台、文件、网络
- 格式化：时间戳、模块名、级别、内容

### 代码示例

```python
from FQBase.Core import get_logger

logger = get_logger('my_module')
logger.info('信息日志')
logger.warning('警告日志')
logger.error('错误日志')
```

## 概念 3: 多通道通知

### 概念解释

多通道通知服务支持企业微信、Server酱、PushBear 等多种通知渠道，统一的消息发送接口。

### 原理

- 通知管理器（NotificationManager）作为统一入口
- 不同渠道（Channel）实现各自的发送逻辑
- 消息模板（NotificationTemplate）提供格式化能力

### 代码示例

```python
from FQBase.Core import NotificationManager

notifier = NotificationManager()
notifier.send('系统通知', channel='WECOM')
notifier.send('告警信息', channel='SERVERCHAN')
```

## 概念 4: 跨模块协同

### 概念解释

Core 模块的各子模块可以组合使用，形成完整的基础设施能力：事件驱动 + 日志 + 通知。

### 协同流程

```
┌─────────────┐    事件     ┌─────────────┐    日志     ┌─────────────┐
│ 业务模块    │ ──────────▶│  EventBus   │────────────▶│   Logger    │
└─────────────┘             └─────────────┘             └─────────────┘
                                   │
                                   │ 事件触发
                                   ▼
                            ┌─────────────┐
                            │ Notification│
                            └─────────────┘
                                   │
                                   ▼
                            ┌─────────────┐
                            │ 通知渠道    │
                            │ (企微/ServerChan)
                            └─────────────┘
```

### 代码示例

```python
from FQBase.Core import (
    get_event_bus,
    get_logger,
    NotificationManager,
    Event,
)

event_bus = get_event_bus()
logger = get_logger('trading')
notifier = NotificationManager()

@event_bus.subscribe('trade_signal')
def on_signal(event):
    logger.info(f"交易信号: {event.data}")
    notifier.send(f"交易信号: {event.data}", channel='WECOM')

event_bus.publish(Event('trade_signal', {'type': 'BUY', 'price': 10.5}))
```

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [技术架构](./architecture.md)
- [API参考](./api.md)
- [event_bus 子模块](./event_bus/)
- [logger 子模块](./logger/)
- [notification 子模块](./notification/)
