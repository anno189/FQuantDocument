---
title: Core - 集成指南
description: Core 基础设施核心层第三方集成指南
tag:
  - fqbase
  - core
---

# Core - 集成指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [技术架构](./architecture.md) → [API参考](./api.md) → [使用指南](./usage.md) → [最佳实践](./best-practices.md) → **[集成指南](./integrations.md)** |


## 概述

本文档介绍 Core 模块与第三方系统和服务集成的指南。

## 子模块集成

### event_bus 集成

event_bus 可以与多种消息队列和异步任务系统集成：

| 集成目标 | 说明 | 详细文档 |
|----------|------|----------|
| Celery | 异步任务系统 | [event_bus_celery](./event_bus_celery/) |
| 自定义 | 自定义事件处理器 | [event_bus/integrations](./event_bus/integrations.md) |

### logger 集成

logger 支持多种输出目标：

| 集成目标 | 说明 | 详细文档 |
|----------|------|----------|
| 文件 | 文件输出 | [logger/integrations](./logger/integrations.md) |
| 网络 | 网络日志收集 | [logger/integrations](./logger/integrations.md) |
| ELK | ELK 日志系统 | [logger/integrations](./logger/integrations.md) |

### notification 集成

notification 支持多种通知渠道：

| 渠道 | 说明 | 详细文档 |
|------|------|----------|
| 企业微信 | 企业微信机器人 | [notification/integrations](./notification/integrations.md) |
| Server酱 | Server酱推送 | [notification/integrations](./notification/integrations.md) |
| PushBear | PushBear推送 | [notification/integrations](./notification/integrations.md) |

## 跨模块集成

### 与 Celery 集成

```python
from FQBase.Core import setup_event_bus, clear_event_bus
from celery import Celery

app = Celery('tasks')
event_bus = setup_event_bus(app)

@app.task
def my_task():
    event_bus.publish(Event('task_start', {'task_id': '123'}))
    # 处理逻辑
    event_bus.publish(Event('task_complete', {'task_id': '123'}))

@app.task
def cleanup():
    clear_event_bus()
```

### 与监控系统集成

```python
from FQBase.Core import get_logger
import logging

logger = get_logger('monitor')

# 集成到监控系统
class MonitorHandler(logging.Handler):
    def emit(self, record):
        if record.levelno >= logging.WARNING:
            # 发送到监控系统
            send_to_monitoring(self.format(record))

logger.addHandler(MonitorHandler())
```

### 与数据处理流水线集成

```python
from FQBase.Core import (
    get_event_bus,
    get_logger,
    NotificationManager,
    Event,
)

event_bus = get_event_bus()
logger = get_logger('pipeline')
notifier = NotificationManager()

class Pipeline:
    def __init__(self):
        self.event_bus = event_bus
        self.logger = logger

    def run(self, data):
        try:
            self.logger.info(f"开始处理数据: {len(data)} 条")
            result = self.process(data)
            self.logger.info("处理完成")
            self.event_bus.publish(Event('pipeline_complete', result))
            return result
        except Exception as e:
            self.logger.error(f"处理失败: {e}")
            self.event_bus.publish(Event('pipeline_failed', {'error': str(e)}))
            raise
```

## 最佳集成实践

1. 优先使用 Core 提供的集成方案
2. 保持模块间的松耦合
3. 使用统一的事件类型命名规范
4. 实现适当的错误处理和重试机制

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
- [event_bus 子模块](./event_bus/)
- [logger 子模块](./logger/)
- [notification 子模块](./notification/)
