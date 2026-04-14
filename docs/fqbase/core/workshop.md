---
title: Core - 动手实验室
description: Core 基础设施核心层动手练习指南
tag:
  - fqbase
  - core
---

# Core - 动手实验室

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [速查表](./cheatsheet.md) → **[动手实验室](./workshop.md)** → [使用指南](./usage.md) → [案例库](./examples.md) |


## 概述

通过动手练习掌握 Core 模块的核心功能。

## 准备环境

```bash
pip install fquant-base
```

## Lab 1: 事件总线基础

### 目标

学习 EventBus 的基本用法：订阅和发布事件。

### 练习代码

```python
from FQBase.Core import get_event_bus, Event

# 获取 EventBus
event_bus = get_event_bus()

# 订阅事件
@event_bus.subscribe('greet')
def handle_greet(event):
    print(f"收到问候: {event.data}")

# 发布事件
event_bus.publish(Event('greet', 'Hello World!'))
```

### 任务

1. 创建一个订阅者处理 'hello' 事件
2. 发布一个 'hello' 事件
3. 运行代码验证

## Lab 2: 组合使用 EventBus + Logger

### 目标

学习如何组合使用事件总线和日志系统。

### 练习代码

```python
from FQBase.Core import (
    get_event_bus,
    get_logger,
    Event,
)

event_bus = get_event_bus()
logger = get_logger('workshop')

@event_bus.subscribe('process')
def handle_process(event):
    logger.info(f"开始处理: {event.data}")
    result = event.data.upper()
    logger.info(f"处理完成: {result}")
    return result

event_bus.publish(Event('process', 'hello'))
```

### 任务

1. 为事件添加错误处理日志
2. 运行代码验证

## Lab 3: 完整流程：事件 + 日志 + 通知

### 目标

学习如何组合使用所有 Core 子模块。

### 练习代码

```python
from FQBase.Core import (
    get_event_bus,
    get_logger,
    NotificationManager,
    Event,
)

event_bus = get_event_bus()
logger = get_logger('workshop')
notifier = NotificationManager()

@event_bus.subscribe('task')
def handle_task(event):
    logger.info(f"任务: {event.data}")
    notifier.send(f"任务完成: {event.data}", channel='SYSTEM')

event_bus.publish(Event('task', '数据处理'))
```

### 任务

1. 运行代码
2. 观察日志和通知输出

## 实验室总结

完成所有实验后，你应该掌握：

- [x] EventBus 订阅和发布
- [x] Logger 日志记录
- [x] Notification 通知发送
- [x] 跨模块组合使用

## 下一步

- 学习 [最佳实践](./best-practices.md)
- 查看 [案例库](./examples.md)
- 阅读 [API参考](./api.md)

## 相关文档

- [README](./README.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
- [API参考](./api.md)
