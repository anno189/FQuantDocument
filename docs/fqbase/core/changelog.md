---
title: Core - 变更日志
description: Core 基础设施核心层版本历史与更新说明
tag:
  - fqbase
  - core
---

# Core - 变更日志

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 📖 索引 | [README](./README.md) → **[变更日志](./changelog.md)** |


## 概述

本文档汇总各子模块的版本历史与更新说明。各子模块的详细变更日志请参考各自文档。

## 各子模块变更汇总

| 子模块 | 最新版本 | 详细变更日志 |
|--------|----------|--------------|
| event_bus | 请参考 | [changelog](./event_bus/changelog.md) |
| event_bus_celery | 请参考 | [changelog](./event_bus_celery/changelog.md) |
| logger | 请参考 | [changelog](./logger/changelog.md) |
| notification | 请参考 | [changelog](./notification/changelog.md) |
| notification_template | 请参考 | [changelog](./notification_template/changelog.md) |

## Core 模块自身变更

### v1.0.0

#### 新增

- 首次发布 Core 基础设施核心层
- 聚合以下子模块：
  - event_bus: 事件总线（发布-订阅模式）
  - event_bus_celery: EventBus 与 Celery 生命周期集成
  - logger: 统一日志系统
  - notification: 通知服务（企业微信、Server酱、PushBear）
  - notification_template: 通知消息模板

#### 导出 API

Core 模块统一导出所有子模块的核心 API：

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
- [event_bus/changelog](./event_bus/changelog.md)
- [event_bus_celery/changelog](./event_bus_celery/changelog.md)
- [logger/changelog](./logger/changelog.md)
- [notification/changelog](./notification/changelog.md)
- [notification_template/changelog](./notification_template/changelog.md)
