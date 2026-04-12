# EventBus 设计文档

**模块路径**: `FQBase.Core.event_bus`
**源码**: [event_bus.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Core/event_bus.py)

---

## 一、单例模式

```python
@singleton
class EventBus:
    """事件总线 - 单例模式"""
    pass
```

**决策**: 使用 `@singleton` 装饰器实现全局单例，确保整个应用只有一个 EventBus 实例。

---

## 二、快照模式发布

```python
def publish(self, event: Event):
    with self._subscriber_lock:
        type_subscribers = list(self._subscribers.get(event.event_type, []))

    for subscription in type_subscribers:
        self._invoke_callback(subscription, event)
```

**决策**: 使用快照模式获取订阅者列表，避免长时间持有锁，提高并发性能。

---

## 三、弱引用机制

```python
def _create_weak_callback(callback: Callable) -> tuple:
    if hasattr(callback, '__self__'):
        return (weakref.WeakMethod(callback), True)
    else:
        return (weakref.ref(callback), False)
```

**决策**: 使用 `WeakMethod` 处理方法引用，`weakref.ref` 处理函数引用，自动清理失效订阅者。

---

## 四、环形缓冲区

```python
class EventHistory:
    def __init__(self, max_history: int = 100):
        self._history: deque = deque(maxlen=max_history)
```

**决策**: 使用 `deque(maxlen=100)` 实现环形缓冲区，固定内存占用，自动淘汰旧数据。
