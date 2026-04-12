# EventBus Celery 使用指南

**模块路径**: `FQBase.Core.event_bus_celery`
**源码**: [event_bus_celery.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Core/event_bus_celery.py)

---

## 一、模块概述

EventBus Celery 是 EventBus 与 Celery Worker 生命周期集成的模块，提供 Worker 进程级别的 EventBus 实例管理。

### 1.1 核心功能

| 功能 | 说明 |
|------|------|
| Worker 级别实例 | 每个 Celery Worker 拥有独立的 EventBus |
| 自动初始化 | Worker 启动时自动创建 EventBus |
| 自动清理 | Worker 关闭时自动清理资源 |
| 手动控制 | 支持禁用自动初始化，手动管理 |

### 1.2 工作原理

```
┌─────────────────────────────────────────────────────────────┐
│                   Celery Worker 集群                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Worker-1                    Worker-2                    │
│  ┌─────────────────┐        ┌─────────────────┐          │
│  │ EventBus Instance│        │ EventBus Instance│          │
│  │ (独立订阅/历史)   │        │ (独立订阅/历史)   │          │
│  └─────────────────┘        └─────────────────┘          │
│                                                             │
│  事件仅在同一 Worker 内部分发，不跨进程                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 二、快速开始

### 2.1 基本配置

```python
from celery import Celery
from FQBase.Core.event_bus_celery import setup_event_bus

app = Celery('myapp')

@worker_process_init.connect
def on_worker_init(**kwargs):
    setup_event_bus()

@worker_shutdown.connect
def on_worker_shutdown(**kwargs):
    from FQBase.Core.event_bus_celery import clear_event_bus
    clear_event_bus()
```

### 2.2 在 Task 中使用

```python
from FQBase.Core.event_bus_celery import get_event_bus
from FQBase.Core.event_bus import Event

@shared_task
def process_stock_data(stock_code: str):
    event_bus = get_event_bus()
    if event_bus is None:
        print("EventBus 未初始化")
        return

    event_bus.publish(Event("stock_processed", data={
        "code": stock_code,
        "status": "completed"
    }))
```

---

## 三、自动初始化配置

### 3.1 默认行为

导入模块时自动注册 Celery 信号处理器。

### 3.2 禁用自动初始化

```python
import os
os.environ['FQ_CELERY_AUTO_INIT'] = 'false'

from FQBase.Core.event_bus_celery import setup_event_bus
```

---

## 四、手动管理模式

```python
import os
os.environ['FQ_CELERY_AUTO_INIT'] = 'false'

from celery import Celery
from celery.signals import worker_process_init, worker_shutdown
from FQBase.Core.event_bus_celery import setup_event_bus, clear_event_bus

app = Celery('myapp')

@worker_process_init.connect
def on_worker_init(**kwargs):
    event_bus = setup_event_bus()

@worker_shutdown.connect
def on_worker_shutdown(**kwargs):
    clear_event_bus()
```

---

## 五、与标准 EventBus 的区别

| 特性 | EventBus | EventBus Celery |
|------|----------|-----------------|
| 实例范围 | 全局单例 | Worker 进程级别 |
| 事件分发 | 进程内 | 仅本 Worker |
| 多 Worker | 共享 | 各自独立 |
| 生命周期 | 应用级别 | Worker 级别 |

---

## 六、事件发布示例

### 6.1 基本发布

```python
@shared_task
def fetch_stock_price(code: str):
    event_bus = get_event_bus()

    event_bus.publish(Event("fetch_started", data={"code": code}))

    try:
        price = fetch_from_api(code)
        event_bus.publish(Event("fetch_completed", data={
            "code": code,
            "price": price
        }))
        return {"code": code, "price": price}
    except Exception as e:
        event_bus.publish(Event("fetch_failed", data={
            "code": code,
            "error": str(e)
        }))
        raise
```

### 6.2 批量处理

```python
@shared_task
def batch_process(stock_codes: list):
    event_bus = get_event_bus()
    results = []

    for i, code in enumerate(stock_codes):
        try:
            result = process_single(code)
            results.append(result)

            event_bus.publish(Event("batch_item_completed", data={
                "code": code,
                "progress": f"{i+1}/{len(stock_codes)}"
            }))
        except Exception as e:
            results.append({"code": code, "error": str(e)})

    event_bus.publish(Event("batch_completed", data={
        "total": len(stock_codes),
        "success": len([r for r in results if "error" not in r])
    }))

    return results
```

---

## 七、调试与监控

### 检查 EventBus 状态

```python
@shared_task
def check_eventbus_status():
    event_bus = get_event_bus()

    if event_bus is None:
        return {"status": "not_initialized"}

    return {
        "status": "initialized",
        "subscriber_count": event_bus.get_subscriber_count(),
        "history_size": len(event_bus.get_history())
    }
```

### 查看历史事件

```python
@shared_task
def debug_recent_events(limit: int = 10):
    event_bus = get_event_bus()
    if event_bus is None:
        return []

    history = event_bus.get_history(limit=limit)
    return [
        {
            "type": e.event_type,
            "timestamp": str(e.timestamp),
            "data": e.data
        }
        for e in history
    ]
```
