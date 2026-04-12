# EventBus Celery API 参考

**模块路径**: `FQBase.Core.event_bus_celery`
**源码**: [event_bus_celery.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Core/event_bus_celery.py)

---

## 一、模块概述

EventBus Celery 提供 EventBus 与 Celery Worker 生命周期的集成管理。

### 1.1 导入方式

```python
from FQBase.Core.event_bus_celery import (
    setup_event_bus,
    get_event_bus,
    clear_event_bus,
)
```

### 1.2 核心组件

| 组件 | 类型 | 说明 |
|------|------|------|
| `_event_bus_instance` | 模块变量 | 当前 Worker 的 EventBus 实例 |
| `_celery_auto_init` | 模块变量 | 自动初始化标志 |

---

## 二、函数 API

### `setup_event_bus() -> EventBus`

初始化 EventBus 实例，供 Celery Worker 启动时调用。

**返回值**: 新创建的 EventBus 实例

**示例**:
```python
from FQBase.Core.event_bus_celery import setup_event_bus

@worker_process_init.connect
def on_worker_init(**kwargs):
    event_bus = setup_event_bus()
```

### `get_event_bus() -> Optional[EventBus]`

获取当前 Worker 进程的 EventBus 实例。

**返回值**: 已初始化的 EventBus 实例或 None

**示例**:
```python
from FQBase.Core.event_bus_celery import get_event_bus

@shared_task
def process_task(data):
    event_bus = get_event_bus()
    if event_bus is None:
        return {"status": "error"}
    event_bus.publish(Event("task_processed", data=data))
```

### `clear_event_bus() -> None`

清除 EventBus 实例，供 Celery Worker 关闭时调用。

---

## 三、环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `FQ_CELERY_AUTO_INIT` | `true` | 是否启用自动初始化 |

---

## 四、使用模式

### 自动初始化模式（默认）

```python
from FQBase.Core.event_bus_celery import get_event_bus

@shared_task
def my_task(data):
    event_bus = get_event_bus()
    event_bus.publish(Event("task_event", data=data))
```

### 手动初始化模式

```python
import os
os.environ['FQ_CELERY_AUTO_INIT'] = 'false'

from celery import Celery
from celery.signals import worker_process_init, worker_shutdown
from FQBase.Core.event_bus_celery import setup_event_bus, clear_event_bus

app = Celery('myapp')

@worker_process_init.connect
def on_init(**kwargs):
    event_bus = setup_event_bus()

@worker_shutdown.connect
def on_shutdown(**kwargs):
    clear_event_bus()
```

---

## 五、注意事项

### 调用时机

| 操作 | 推荐时机 |
|------|----------|
| `setup_event_bus()` | `worker_process_init` 信号处理函数中 |
| `get_event_bus()` | Task 执行函数中 |
| `clear_event_bus()` | `worker_shutdown` 信号处理函数中 |

### 返回值检查

```python
@shared_task
def safe_task(data):
    event_bus = get_event_bus()
    if event_bus is None:
        return {"status": "error", "message": "EventBus not initialized"}
    event_bus.publish(Event("task_event", data=data))
```

### 多 Worker 隔离

每个 Worker 有独立的 EventBus 实例，事件不会跨 Worker 分发。
