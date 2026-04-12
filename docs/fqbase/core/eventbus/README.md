# EventBus 模块文档

**模块路径**: `FQBase.Core.event_bus`
**源码**: [event_bus.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Core/event_bus.py)

## 文档索引

| 文档 | 说明 |
|------|------|
| [framework.md](framework.md) | 框架概述、核心特性、设计模式 |
| [architecture.md](architecture.md) | 整体架构、组件架构、发布流程 |
| [design.md](design.md) | 设计决策与权衡 |
| [api.md](api.md) | 详细 API 参考 |
| [usage.md](usage.md) | 使用指南、量化交易场景 |
| [best-practices.md](best-practices.md) | 最佳实践 |

## 子模块文档

- [celery/](celery/index.md) - EventBus Celery 集成

## 快速开始

```python
from FQBase.Core import EventBus, Event, get_event_bus

bus = get_event_bus()

def on_trade_signal(event: Event):
    print(f"收到信号: {event.data}")

bus.subscribe("trade_signal", on_trade_signal)
bus.publish(Event("trade_signal", data={"code": "000001", "action": "BUY"}))
```
