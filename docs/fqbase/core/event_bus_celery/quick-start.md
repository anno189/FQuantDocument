---
title: EventBus Celery 集成 - 快速入门
description: 快速上手 EventBus Celery 集成模块
tag:
  - fqbase
  - event_bus_celery

summary:
  purpose: quick-start
  complexity: low
---

# EventBus Celery 集成 - 快速入门

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → **[快速入门](./quick-start.md)** → [使用指南](./usage.md) → [案例库](./examples.md) |


## 概述

本指南帮助您快速上手 EventBus Celery 集成模块。

## 前置要求

- Python 3.8+
- Celery
- FQBase

## 安装

```bash
pip install FQBase celery
```

## 5分钟上手

### Step 1: 配置 Celery 信号

```python
# celery_app.py
from FQBase.Core.event_bus_celery import setup_event_bus, clear_event_bus
from celery.signals import worker_process_init, worker_shutdown

@worker_process_init.connect
def on_worker_init(**kwargs):
    setup_event_bus()

@worker_shutdown.connect
def on_worker_shutdown(**kwargs):
    clear_event_bus()
```

### Step 2: 在任务中使用事件总线

```python
# tasks.py
from FQBase.Core.event_bus_celery import get_event_bus
from FQBase.Core.event_bus import Event

def get_event_bus_safely():
    bus = get_event_bus()
    if bus is None:
        setup_event_bus()
        bus = get_event_bus()
    return bus

@celery_app.task
def process_data(data):
    bus = get_event_bus_safely()
    bus.publish(Event('task_started', data))
    
    # 处理数据...
    result = process(data)
    
    bus.publish(Event('task_completed', result))
    return result
```

### Step 3: 禁用自动初始化（如需要）

```python
# 在导入模块之前设置
import os
os.environ['FQ_CELERY_AUTO_INIT'] = 'false'

# 然后手动初始化
from FQBase.Core.event_bus_celery import setup_event_bus

bus = setup_event_bus()
```

### 完成！

恭喜！您已经掌握 EventBus Celery 集成的基本用法。

## ⚠️ 常见陷阱

1. **陷阱：在 Worker 启动前访问 EventBus**
   - ❌ 错误做法：在 celery_app.py 顶部直接调用 get_event_bus()
   - ✅ 正确做法：使用信号处理器确保在 Worker 初始化后访问

2. **陷阱：未设置环境变量**
   - ❌ 错误做法：在导入后设置 FQ_CELERY_AUTO_INIT
   - ✅ 正确做法：在导入模块之前设置环境变量

## 下一步

- 学习 [核心概念](./concepts.md)
- 查看 [API参考](./api.md)
- 阅读 [使用指南](./usage.md)

## 相关文档

- [README](./README.md)
- [API参考](./api.md)
- [使用指南](./usage.md)
