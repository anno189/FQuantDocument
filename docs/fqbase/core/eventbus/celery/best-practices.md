# EventBus Celery 最佳实践

**模块路径**: `FQBase.Core.event_bus_celery`
**源码**: [event_bus_celery.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Core/event_bus_celery.py)

---

## 一、性能最佳实践

### 1.1 避免频繁创建 EventBus

```python
# 不推荐: 在每个 Task 中创建
@shared_task
def bad_task():
    event_bus = EventBus()

# 推荐: 使用模块级获取
_event_bus = None

def get_event_bus_safe():
    global _event_bus
    if _event_bus is None:
        _event_bus = get_event_bus()
    return _event_bus
```

### 1.2 合理设置历史记录大小

```python
# 根据业务需求调整
from FQBase.Core.event_bus_celery import setup_event_bus

def setup_larger_event_bus():
    event_bus = EventBus(max_history=1000)
    return event_bus
```

---

## 二、错误处理最佳实践

### 2.1 检查初始化状态

```python
@shared_task
def safe_publish_task(data: dict):
    event_bus = get_event_bus()

    if event_bus is None:
        logger.warning("EventBus 未初始化")
        return {"status": "skipped"}

    try:
        event_bus.publish(Event("task_processed", data=data))
    except Exception as e:
        logger.error(f"事件发布失败: {e}")
```

### 2.2 资源清理

```python
@worker_shutdown.connect
def cleanup_on_shutdown(**kwargs):
    event_bus = get_event_bus()
    if event_bus:
        event_bus.clear_history()
    clear_event_bus()
```

---

## 三、生产环境最佳实践

### 3.1 环境配置

```python
# celery_config.py
import os

if os.getenv('ENV') == 'production':
    os.environ['FQ_CELERY_AUTO_INIT'] = 'false'

from celery import Celery
from celery.signals import worker_process_init, worker_shutdown

app = Celery('production_app')

@worker_process_init.connect
def on_worker_init(**kwargs):
    from FQBase.Core.event_bus_celery import setup_event_bus
    event_bus = setup_event_bus()
    event_bus._history._max_history = 1000
    setup_production_subscribers(event_bus)

@worker_shutdown.connect
def on_worker_shutdown(**kwargs):
    from FQBase.Core.event_bus_celery import clear_event_bus
    clear_event_bus()
```

### 3.2 多 Worker 协调

EventBus Celery 的事件不跨 Worker。如需跨 Worker 通信，使用 Celery Result Backend。

---

## 四、运维最佳实践

### 4.1 定期清理

```python
@shared_task
def cleanup_task():
    event_bus = get_event_bus()
    if event_bus:
        before_count = len(event_bus.get_history())
        event_bus.clear_history()
        return {"cleaned": before_count}
```

### 4.2 健康检查

```python
@shared_task
def health_check():
    event_bus = get_event_bus()
    return {
        "eventbus_initialized": event_bus is not None,
        "subscriber_count": event_bus.get_subscriber_count() if event_bus else 0,
    }
```

---

## 五、常见问题

### 5.1 EventBus 为 None

**原因**:
1. 自动初始化未启用
2. Worker 未启动
3. 手动初始化前调用了 get

**解决方案**:
```python
@worker_process_init.connect
def on_init(**kwargs):
    event_bus = setup_event_bus()

def get_safe():
    event_bus = get_event_bus()
    if event_bus is None:
        event_bus = setup_event_bus()
    return event_bus
```

### 5.2 事件不触发订阅

**原因**:
1. 在不同 Worker 实例中
2. 订阅时机晚于发布
3. 事件类型不匹配

**解决方案**:
```python
@worker_process_init.connect
def on_init(**kwargs):
    event_bus = setup_event_bus()
    setup_subscribers()
```
