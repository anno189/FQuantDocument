# EventBus Celery 模块文档

**模块路径**: `FQBase.Core.event_bus_celery`
**源码**: [event_bus_celery.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Core/event_bus_celery.py)

## 文档索引

| 文档 | 说明 |
|------|------|
| [api.md](api.md) | API 参考 |
| [usage.md](usage.md) | 使用指南 |
| [best-practices.md](best-practices.md) | 最佳实践 |

## 快速开始

```python
from FQBase.Core.event_bus_celery import setup_event_bus, get_event_bus

@worker_process_init.connect
def on_worker_init(**kwargs):
    setup_event_bus()

@shared_task
def my_task(data):
    event_bus = get_event_bus()
    event_bus.publish(Event("task_event", data=data))
```
