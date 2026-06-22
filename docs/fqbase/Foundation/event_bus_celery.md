---
title: event_bus_celery - EventBus 与 Celery 集成
description: EventBus 与 Celery Worker 生命周期集成，支持 Worker 启动时初始化、关闭时清理
tag:
  - fquant
  - fqbase
  - foundation
  - event_bus_celery

summary:
  type: integration
  complexity: low
  maturity: stable
  size: small
  is_container: false
  api_exports:
    total: 3
    functions:
      - name: setup_event_bus
        signature: "() -> EventBus"
        description: 初始化 EventBus 实例
        source: "event_bus_celery.py#L56"
      - name: get_event_bus
        signature: "() -> Optional[EventBus]"
        description: 获取当前 Worker 的 EventBus 实例
        source: "event_bus_celery.py#L67"
      - name: clear_event_bus
        signature: "() -> None"
        description: 清除 EventBus 实例
        source: "event_bus_celery.py#L76"
  features:
    has_async: false
    is_thread_safe: false
    has_config: true
    has_logging: false
    has_security: false
  environment_vars:
    - name: FQ_CELERY_AUTO_INIT
      default: "true"
      description: 是否启用自动初始化
  source_location: "Foundation/event_bus_celery.py"
  source_mtime: 1776751707
  last_updated: "2026-04"

relationships:
  belongs_to:
    - fquant.fqbase.foundation
---

# event_bus_celery - EventBus 与 Celery 集成

## 一句话总览

📌 **EventBus 与 Celery Worker 生命周期集成，支持 Worker 启动时初始化、关闭时清理。**

---

## 核心 API

### setup_event_bus

**位置：** `event_bus_celery.py#L56`

```python
from FQBase.Foundation.event_bus_celery import setup_event_bus

bus = setup_event_bus()
```

**描述：** 初始化 EventBus 实例（供 Celery Worker 启动时调用）

**返回：** `EventBus`

---

### get_event_bus

**位置：** `event_bus_celery.py#L67`

```python
from FQBase.Foundation.event_bus_celery import get_event_bus

bus = get_event_bus()
```

**描述：** 获取当前 Worker 进程的 EventBus 实例

**返回：** `EventBus` 或 `None`

---

### clear_event_bus

**位置：** `event_bus_celery.py#L76`

```python
from FQBase.Foundation.event_bus_celery import clear_event_bus

clear_event_bus()
```

**描述：** 清除 EventBus 实例（供 Celery Worker 关闭时调用）

---

## 环境配置

| 变量 | 默认值 | 描述 |
|------|--------|------|
| FQ_CELERY_AUTO_INIT | true | 是否启用自动初始化 |

## 使用场景

### Celery Worker 集成

```python
# celery_app.py
from FQBase.Foundation.event_bus_celery import setup_event_bus
from celery.signals import worker_process_init, worker_shutdown

@worker_process_init.connect
def on_worker_init(**kwargs):
    setup_event_bus()

@worker_shutdown.connect
def on_worker_shutdown(**kwargs):
    clear_event_bus()
```

### 在 Task 中使用

```python
# tasks.py
from FQBase.Foundation.event_bus_celery import get_event_bus
from FQBase.Foundation.event_bus import Event

def process_data():
    bus = get_event_bus()
    if bus:
        bus.publish(Event('data_processed', {'result': 'ok'}))
```

## 相关文档

- [Foundation README](./README.md)
- [Foundation API](./api.md)
- [event_bus](./event_bus.md)
