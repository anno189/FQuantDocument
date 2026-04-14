---
title: Core - API参考
description: Core 基础设施核心层跨模块组合 API 参考
tag:
  - fqbase
  - core

summary:
  purpose: api-reference
  type: container
---

# Core - API参考

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [技术架构](./architecture.md) → **[API参考](./api.md)** → [子模块文档] |


## 概述

本文档介绍如何组合使用 Core 模块下的多个子模块来实现完整的功能流程。

## 跨模块组合

### 组合 1: 事件驱动通知系统

**用途：** 当某个事件发生时，自动记录日志并发送通知

**涉及的子模块：**
- [event_bus](./event_bus/) - 事件驱动
- [logger](./logger/) - 日志记录
- [notification](./notification/) - 通知推送

**代码示例：**

```python
from FQBase.Core import (
    get_event_bus,
    get_logger,
    NotificationManager,
    Event,
)

# 第1步：初始化
event_bus = get_event_bus()
logger = get_logger('app')
notifier = NotificationManager()

# 第2步：订阅事件
@event_bus.subscribe('signal')
def handle_signal(event):
    logger.info(f"收到信号: {event.data}")
    notifier.send(f"信号: {event.data}")

# 第3步：发布事件
event_bus.publish(Event('signal', {'type': 'trade', 'price': 100.5}))
```

### 组合 2: Celery 异步任务监控

**用途：** 监控 Celery 异步任务的执行状态，任务完成后记录日志并通知

**涉及的子模块：**
- [event_bus](./event_bus/) - 事件总线
- [event_bus_celery](./event_bus_celery/) - Celery 集成
- [logger](./logger/) - 日志记录
- [notification](./notification/) - 通知推送

**代码示例：**

```python
from FQBase.Core import (
    setup_event_bus,
    clear_event_bus,
    get_logger,
    NotificationManager,
)
from celery import Celery

# 第1步：初始化 Celery 和 EventBus
app = Celery('tasks')
event_bus = setup_event_bus(app)
logger = get_logger('tasks')
notifier = NotificationManager()

# 第2步：订阅任务事件
@event_bus.subscribe('task_success')
def on_task_success(event):
    logger.info(f"任务成功: {event.data['task_id']}")
    notifier.send(f"任务 {event.data['task_id']} 完成", channel='SYSTEM')

@event_bus.subscribe('task_failure')
def on_task_failure(event):
    logger.error(f"任务失败: {event.data['task_id']}")
    notifier.send(f"任务 {event.data['task_id']} 失败", channel='WECOM')

# 第3步：清理
clear_event_bus()
```

### 组合 3: 统一日志记录 + 告警

**用途：** 记录日志的同时发送告警通知

**涉及的子模块：**
- [logger](./logger/) - 日志记录
- [notification](./notification/) - 通知推送
- [notification_template](./notification_template/) - 通知模板

**代码示例：**

```python
from FQBase.Core import (
    get_logger,
    NotificationManager,
    NotificationTemplate,
)
import logging

logger = get_logger('monitor')
notifier = NotificationManager()

# 错误日志 + 告警
try:
    result = risky_operation()
except Exception as e:
    logger.error(f"操作失败: {e}")
    message = NotificationTemplate.render(
        'error_alert',
        operation='risky_operation',
        error=str(e)
    )
    notifier.send(message, channel='WECOM')
```

## 子模块 API 索引

各子模块的详细 API 文档请参考：

| 子模块 | 主要类/函数 | 文档 |
|--------|-------------|------|
| event_bus | EventBus, get_event_bus, Event, Subscription | [API](./event_bus/api.md) |
| event_bus_celery | setup_event_bus, clear_event_bus | [API](./event_bus_celery/api.md) |
| logger | get_logger, FQLogger, init_logging | [API](./logger/api.md) |
| notification | NotificationManager, sendWechat, sendMessage2ServerChan | [API](./notification/api.md) |
| notification_template | NotificationTemplate, NotificationTemplateRegistry | [API](./notification_template/api.md) |

## 最佳组合实践

### 模式 1: 事件驱动架构

**推荐组合：** event_bus + logger + notification

**适用场景：**
- 异步任务完成通知
- 系统异常告警
- 交易信号推送
- 数据更新推送

**典型流程：**
```python
# 1. 业务逻辑发布事件
event_bus.publish(Event('task_completed', task_info))

# 2. EventBus 触发订阅者
# 3. 订阅者记录日志
logger.info(f"任务完成: {task_info}")
# 4. 订阅者发送通知
notifier.send(f"任务完成: {task_info}")
```

### 模式 2: Celery 任务监控

**推荐组合：** event_bus_celery + logger + notification

**适用场景：**
- 异步任务状态监控
- 定时任务执行通知
- 后台任务异常告警

### 模式 3: 统一日志 + 告警

**推荐组合：** logger + notification + notification_template

**适用场景：**
- 重要日志实时告警
- 错误信息结构化通知
- 关键业务指标监控

## 统一导出

Core 模块的 `__init__.py` 统一导出了所有子模块的核心 API：

```python
from FQBase.Core import (
    # EventBus
    Event,
    EventBus,
    EventBusContext,
    EventHistory,
    Subscription,
    get_event_bus,
    setup_event_bus,
    clear_event_bus,

    # Logger
    get_logger,
    FQLogger,
    init_logging,

    # Notification
    NotificationManager,
    WECOM_CHANNELS,
    NOTIFICATION_CHANNELS,
    ServerChan,
    PushBear,
    sendWechat,
    sendMessage2ServerChan,
    sendMessagetoAll,

    # Notification Template
    NotificationTemplate,
    NotificationTemplateRegistry,
)
```

## 相关文档

- [README](./README.md)
- [技术架构](./architecture.md)
- [案例库](./examples.md)
- [event_bus 子模块](./event_bus/)
- [logger 子模块](./logger/)
- [notification 子模块](./notification/)
