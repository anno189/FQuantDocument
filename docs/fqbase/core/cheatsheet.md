---
title: Core - 速查表
description: Core 基础设施核心层快速参考指南
tag:
  - fqbase
  - core
---

# Core - 速查表

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → **[速查表](./cheatsheet.md)** → [使用指南](./usage.md) → [案例库](./examples.md) |


## 快速参考

### EventBus 快速开始

```python
from FQBase.Core import get_event_bus, Event

event_bus = get_event_bus()
event_bus.subscribe('event', lambda e: print(e.data))
event_bus.publish(Event('event', 'data'))
```

### Logger 快速开始

```python
from FQBase.Core import get_logger

logger = get_logger('module')
logger.info('message')
```

### Notification 快速开始

```python
from FQBase.Core import NotificationManager

notifier = NotificationManager()
notifier.send('message', channel='SYSTEM')
```

### 组合使用

```python
from FQBase.Core import (
    get_event_bus,
    get_logger,
    NotificationManager,
    Event,
)

event_bus = get_event_bus()
logger = get_logger('app')
notifier = NotificationManager()

@event_bus.subscribe('task_done')
def handler(event):
    logger.info(f"完成: {event.data}")
    notifier.send(f"完成: {event.data}")

event_bus.publish(Event('task_done', 'data'))
```

## 常用代码片段

### 获取单例

```python
event_bus = get_event_bus()
logger = get_logger(__name__)
```

### 发布事件

```python
event_bus.publish(Event('type', data))
```

### 订阅事件

```python
@event_bus.subscribe('type')
def handler(event):
    print(event.data)
```

### 发送通知

```python
notifier.send('message', channel='WECOM')
```

## 快速调试

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
