# EventBus API 参考

**模块路径**: `FQBase.Core.event_bus`
**源码**: [event_bus.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Core/event_bus.py)

---

## 一、EventBus 类

### `EventBus.__init__(max_history: int = 100)`

初始化事件总线。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `max_history` | `int` | `100` | 最大历史记录数 |

### `EventBus.subscribe(event_type: str, callback: Callable, priority: int = 0, weak_ref: bool = False) -> str`

订阅事件。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `event_type` | `str` | - | 事件类型 |
| `callback` | `Callable` | - | 回调函数 |
| `priority` | `int` | `0` | 优先级，数值越大越先执行 |
| `weak_ref` | `bool` | `False` | 是否使用弱引用 |

**返回值**: 订阅ID，用于取消订阅

### `EventBus.unsubscribe(event_type: str, callback: Callable) -> None`

取消订阅。

### `EventBus.unsubscribe_by_id(subscriber_id: str) -> bool`

通过订阅ID取消订阅。

| 参数 | 类型 | 说明 |
|------|------|------|
| `subscriber_id` | `str` | 订阅ID |

**返回值**: 是否成功取消

### `EventBus.subscribe_global(callback: Callable, priority: int = 0, weak_ref: bool = False) -> str`

订阅所有事件。

### `EventBus.unsubscribe_global(callback: Callable) -> None`

取消全局订阅。

### `EventBus.publish(event: Event) -> None`

同步发布事件。调用线程会被阻塞，等待所有订阅者回调执行完毕后才会返回。

**特点**: 立即发送消息，同步阻塞等待回调执行完成。

### `EventBus.publish_async(event: Event, callback: Optional[Callable] = None) -> asyncio.Future`

异步发布事件。调用后立即返回，不阻塞当前线程，事件发送和回调执行在后台线程池中进行。

| 参数 | 类型 | 说明 |
|------|------|------|
| `event` | `Event` | 事件对象 |
| `callback` | `Optional[Callable]` | 完成回调 |

**返回值**: asyncio.Future 对象

**特点**: 立即发送消息，非阻塞立即返回。

### `EventBus.publishAwait(event: Event) -> None`

异步等待发布事件（async/await）。使用 asyncio 并行执行所有订阅者回调。

**特点**: 立即发送消息，异步并行执行回调，需要在 async 上下文中使用 `await` 调用。

### 三种发布方式对比

| 特性 | `publish()` | `publish_async()` | `publishAwait()` |
|------|-------------|-------------------|------------------|
| 发送时机 | 立即发送 | 立即发送 | 立即发送 |
| 是否阻塞 | 同步阻塞，等待回调执行完 | 非阻塞，立即返回 | 异步等待，需要 await |
| 执行方式 | 在当前线程顺序执行 | 后台线程池并行执行 | asyncio 并行执行 |
| 返回值 | None | asyncio.Future | None |
| 适用场景 | 同步流程、需要确认回调完成 | 不阻塞主流程、耗时操作 | async/await 异步上下文 |

### `EventBus.get_history(event_type: str = None, limit: int = 100) -> List[Event]`

获取事件历史。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `event_type` | `str` | `None` | 事件类型过滤 |
| `limit` | `int` | `100` | 返回数量限制 |

**返回值**: 事件列表

### `EventBus.clear_history() -> None`

清除事件历史。

### `EventBus.get_subscriber_count(event_type: str = None) -> int`

获取订阅者数量。

### `EventBus.get_subscribers(event_type: str = None) -> List[Dict[str, Any]]`

获取订阅者列表。

### `EventBus.cleanup() -> int`

清理失效的弱引用订阅者。

**返回值**: 清理的订阅者数量

---

## 二、Event 类

```python
class Event:
    def __init__(self, event_type: str, data: Any = None, **kwargs):
        self.event_type = event_type
        self.name = event_type
        self.data = data
        self.timestamp = datetime.now()
        self.extra = kwargs
```

| 属性 | 类型 | 说明 |
|------|------|------|
| `event_type` | `str` | 事件类型 |
| `name` | `str` | 事件名称（等同于 event_type） |
| `data` | `Any` | 事件数据 |
| `timestamp` | `datetime` | 事件时间戳 |
| `extra` | `dict` | 额外参数 |

---

## 三、便捷函数

```python
def get_event_bus() -> EventBus:
    """获取事件总线单例实例"""
    return EventBus()
```

---

## 四、环境变量

EventBus 模块本身不依赖环境变量。

---

## 五、相关文档

| 文档 | 说明 |
|------|------|
| [framework.md](framework.md) | 框架概述 |
| [architecture.md](architecture.md) | 架构设计 |
| [design.md](design.md) | 设计决策 |
| [usage.md](usage.md) | 使用指南 |
| [best-practices.md](best-practices.md) | 最佳实践 |
| [celery/api.md](celery/api.md) | EventBus Celery API |
