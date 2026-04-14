---
title: EventBus Celery 集成 - 案例库
description: EventBus Celery 集成实际应用场景与示例
tag:
  - fqbase
  - event_bus_celery
---

# EventBus Celery 集成 - 案例库

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [使用指南](./usage.md) → **[案例库](./examples.md)** |

## 示例 1：异步任务通知

### 场景描述

在 Celery 任务中发布事件，通知其他模块任务状态变化

### 代码实现

```python
# celery_app.py
from FQBase.Core.event_bus_celery import setup_event_bus, clear_event_bus
from celery.signals import worker_process_init, worker_shutdown

@worker_process_init.connect
def init(**kwargs):
    setup_event_bus()

@worker_shutdown.connect
def cleanup(**kwargs):
    clear_event_bus()

# tasks.py
from FQBase.Core.event_bus_celery import get_event_bus
from FQBase.Core.event_bus import Event

@celery_app.task(bind=True)
def process_order(self, order_id):
    bus = get_event_bus()
    
    # 任务开始
    bus.publish(Event('order_processing', {'order_id': order_id}))
    
    # 处理订单...
    result = process(order_id)
    
    # 任务完成
    bus.publish(Event('order_completed', {
        'order_id': order_id,
        'result': result
    }))
    
    return result
```

### 适用场景

- 异步任务状态通知
- 任务完成后续处理

---

## 示例 2：多任务协调

### 场景描述

多个 Celery 任务通过事件总线协调工作

### 代码实现

```python
# tasks.py
from FQBase.Core.event_bus_celery import get_event_bus
from FQBase.Core.event_bus import Event

@celery_app.task
def fetch_data(symbol):
    data = fetch_from_api(symbol)
    bus = get_event_bus()
    bus.publish(Event('data_fetched', {'symbol': symbol, 'data': data}))
    return data

@celery_app.task
def analyze_data(symbol):
    # 等待数据准备好
    bus = get_event_bus()
    
    # 触发数据获取任务
    fetch_data.delay(symbol)
    
    # 稍后查询数据...
    # 实际场景中应使用 chord 或 chain
    result = analyze(symbol)
    bus.publish(Event('analysis_complete', {'symbol': symbol}))
    return result
```

### 适用场景

- 任务链协调
- 任务间通信

---

## 示例 3：任务监控

### 场景描述

监控 Celery 任务执行情况

### 代码实现

```python
# celery_app.py
from FQBase.Core.event_bus_celery import setup_event_bus
from celery.signals import worker_process_init

@worker_process_init.connect
def init(**kwargs):
    setup_event_bus()

# tasks.py
from FQBase.Core.event_bus_celery import get_event_bus
from FQBase.Core.event_bus import Event

class Monitor:
    def __init__(self):
        self.bus = get_event_bus()
        self.bus.subscribe_global(self.on_event)
    
    def on_event(self, event):
        log_event(event)

monitor = Monitor()

@celery_app.task
def monitored_task(data):
    monitor.bus.publish(Event('task_start', {'task_id': self.request.id}))
    # ... 处理
    return result
```

### 适用场景

- 任务执行监控
- 审计日志

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
