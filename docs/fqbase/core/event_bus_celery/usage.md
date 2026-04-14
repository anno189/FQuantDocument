---
title: EventBus Celery 集成 - 使用指南
description: EventBus Celery 集成详细使用指南
tag:
  - fqbase
  - event_bus_celery
---

# EventBus Celery 集成 - 使用指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [使用指南](./usage.md) |
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → [API参考](./api.md) → **[使用指南](./usage.md)** |

## 概述

本指南详细介绍如何在 Celery 环境中使用 EventBus。

## 基本用法

### 安装

```bash
pip install FQBase celery
```

### 配置 Celery 信号

```python
# celery_app.py
from FQBase.Core.event_bus_celery import setup_event_bus, clear_event_bus
from celery.signals import worker_process_init, worker_shutdown

@worker_process_init.connect
def init_event_bus(**kwargs):
    setup_event_bus()

@worker_shutdown.connect
def cleanup_event_bus(**kwargs):
    clear_event_bus()
```

### 在任务中使用

```python
# tasks.py
from FQBase.Core.event_bus_celery import get_event_bus
from FQBase.Core.event_bus import Event

@celery_app.task
def my_task(data):
    bus = get_event_bus()
    
    if bus:
        bus.publish(Event('task_start', data))
    
    result = process(data)
    
    if bus:
        bus.publish(Event('task_complete', result))
    
    return result
```

## Celery 信号集成

### worker_process_init

Worker 启动时触发，初始化 EventBus：

```python
@worker_process_init.connect
def on_worker_init(**kwargs):
    setup_event_bus()
    print("EventBus 已初始化")
```

### worker_shutdown

Worker 关闭时触发，清理 EventBus：

```python
@worker_shutdown.connect
def on_worker_shutdown(**kwargs):
    clear_event_bus()
    print("EventBus 已清理")
```

## 配置选项

### 禁用自动初始化

```python
import os

# 在导入模块之前设置
os.environ['FQ_CELERY_AUTO_INIT'] = 'false'

from FQBase.Core.event_bus_celery import setup_event_bus

# 手动初始化
bus = setup_event_bus()
```

### 环境变量

| 变量 | 说明 | 值 |
|------|------|-----|
| FQ_CELERY_AUTO_INIT | 禁用自动初始化 | "false" |

## 错误处理

### 安全获取 EventBus

```python
def get_event_bus_safely():
    bus = get_event_bus()
    if bus is None:
        # 如果未初始化，手动初始化
        setup_event_bus()
        bus = get_event_bus()
    return bus
```

## 相关文档

- [API参考](./api.md)
- [快速入门](./quick-start.md)
- [案例库](./examples.md)
