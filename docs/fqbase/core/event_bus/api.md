---
title: 事件总线 - API参考
description: 事件总线模块 API 参考文档
tag:
  - fqbase
  - event_bus

summary:
  purpose: api-reference
  core_classes:
    - EventBus
    - Event
    - EventHistory
    - Subscription
    - EventBusContext
  core_functions:
    - get_event_bus
    - publish
    - subscribe
---

# 事件总线 - API参考

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → [设计原则](./design.md) → **[API参考](./api.md)** → [开发指南](./development.md) → [最佳实践](./best-practices.md) |


## 类

### Event

**位置：** `FQBase/Core/event_bus.py`

**描述：** 事件对象，包含事件类型、数据、时间戳和额外参数。

```python
from FQBase.Core.event_bus import Event

event = Event('price_update', {'symbol': 'AAPL', 'price': 150.0})
```

#### 参数

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| event_type | str | 是 | - | 事件类型字符串 |
| data | Any | 否 | None | 事件携带的数据 |
| **kwargs | Any | 否 | - | 额外关键字参数 |

#### 属性

| 属性 | 类型 | 描述 |
|------|------|------|
| event_type | str | 事件类型字符串 |
| name | str | 事件名称（等同于 event_type） |
| data | Any | 事件携带的数据 |
| timestamp | datetime | 事件发生时间 |
| extra | dict | 额外关键字参数字典 |

#### 示例

```python
# 基本用法
event = Event('trade', {'order_id': '123', 'price': 100.0})
print(event.event_type)  # 'trade'
print(event.data)        # {'order_id': '123', 'price': 100.0}
print(event.timestamp)    # 2024-01-15 10:30:00.123456

# 带额外参数
event = Event('signal', {'code': '000001'}, source='strategy', confidence=0.8)
print(event.extra)  # {'source': 'strategy', 'confidence': 0.8}
```

---

### EventBus

**位置：** `FQBase/Core/event_bus.py`

**描述：** 事件总线单例类，负责管理事件订阅者、发布事件到订阅者、管理事件历史记录。

```python
from FQBase.Core.event_bus import EventBus, get_event_bus

bus = get_event_bus()
```

#### 参数

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| max_history | int | 否 | 100 | 最大历史记录数 |
| auto_cleanup_interval | int | 否 | 100 | 自动清理死订阅者的间隔（发布次数） |

#### 方法

##### subscribe

```python
sub_id = bus.subscribe(event_type, callback, priority=0, weak_ref=False)
```

**描述：** 订阅指定类型的事件

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| event_type | str | 是 | - | 事件类型 |
| callback | Callable | 是 | - | 回调函数 |
| priority | int | 否 | 0 | 优先级，数值越大越先执行 |
| weak_ref | bool | 否 | False | 是否使用弱引用 |

**返回：** `str` - 订阅ID

**异常：** 无

**示例：**

```python
def handler(event):
    print(f"Received: {event.data}")

sub_id = bus.subscribe('update', handler, priority=10, weak_ref=False)
print(f"Subscribed with ID: {sub_id}")  # "sub_1"
```

---

##### unsubscribe

```python
bus.unsubscribe(event_type, callback)
```

**描述：** 取消订阅

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| event_type | str | 是 | - | 事件类型 |
| callback | Callable | 是 | - | 回调函数 |

**返回：** `None`

**示例：**

```python
def handler(event):
    print(event.data)

bus.subscribe('update', handler)
bus.unsubscribe('update', handler)
```

---

##### unsubscribe_by_id

```python
success = bus.unsubscribe_by_id(subscriber_id)
```

**描述：** 通过订阅ID取消订阅

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| subscriber_id | str | 是 | - | 订阅ID |

**返回：** `bool` - 是否成功取消

**示例：**

```python
sub_id = bus.subscribe('event', handler)
bus.unsubscribe_by_id(sub_id)
```

---

##### subscribe_global

```python
sub_id = bus.subscribe_global(callback, priority=0, weak_ref=False)
```

**描述：** 订阅所有事件

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| callback | Callable | 是 | - | 回调函数 |
| priority | int | 否 | 0 | 优先级 |
| weak_ref | bool | 否 | False | 是否使用弱引用 |

**返回：** `str` - 订阅ID

**示例：**

```python
def log_all(event):
    print(f"[LOG] {event.event_type}: {event.data}")

bus.subscribe_global(log_all, priority=1)
bus.publish(Event('any_event', 'data'))  # 触发 log_all
```

---

##### unsubscribe_global

```python
bus.unsubscribe_global(callback)
```

**描述：** 取消全局订阅

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| callback | Callable | 是 | - | 回调函数 |

**返回：** `None`

---

##### publish

```python
bus.publish(event)
```

**描述：** 同步发布事件

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| event | Event | 是 | - | 事件对象 |

**返回：** `None`

**示例：**

```python
bus.publish(Event('price_update', {'symbol': 'AAPL', 'price': 150}))
```

---

##### publish_async

```python
future = bus.publish_async(event, callback=None)
```

**描述：** 异步发布事件（在线程池中执行）

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| event | Event | 是 | - | 事件对象 |
| callback | Callable | 否 | None | 可选的完成回调函数 |

**返回：** `asyncio.Future`

**示例：**

```python
future = bus.publish_async(Event('async_event', 'data'))
# 或带回调
def on_complete():
    print("发布完成")

future = bus.publish_async(Event('async_event', 'data'), on_complete)
```

---

##### publishAwait

```python
await bus.publishAwait(event)
```

**描述：** 异步等待发布事件（支持 async/await）

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| event | Event | 是 | - | 事件对象 |

**返回：** `None`

**异常：** 无

**示例：**

```python
import asyncio

async def main():
    await bus.publishAwait(Event('async_event', 'data'))

asyncio.run(main())

# 或在异步上下文中
async def async_handler(event):
    await bus.publishAwait(Event('result', event.data))
```

---

##### get_history

```python
events = bus.get_history(event_type=None, limit=100)
```

**描述：** 获取事件历史

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| event_type | str | 否 | None | 事件类型过滤（None 表示所有） |
| limit | int | 否 | 100 | 返回数量限制 |

**返回：** `List[Event]`

**示例：**

```python
# 获取所有历史
all_events = bus.get_history()

# 获取特定类型历史
price_events = bus.get_history(event_type='price_update')

# 限制数量
recent_events = bus.get_history(limit=10)
```

---

##### clear_history

```python
bus.clear_history()
```

**描述：** 清除事件历史

**参数：** 无

**返回：** `None`

---

##### get_subscriber_count

```python
count = bus.get_subscriber_count(event_type=None)
```

**描述：** 获取订阅者数量

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| event_type | str | 否 | None | 事件类型过滤（None 表示所有） |

**返回：** `int`

**示例：**

```python
bus.subscribe('event1', handler1)
bus.subscribe('event2', handler2)

print(bus.get_subscriber_count())           # 2
print(bus.get_subscriber_count('event1'))  # 1
```

---

##### get_subscribers

```python
subscribers = bus.get_subscribers(event_type=None)
```

**描述：** 获取订阅者列表

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| event_type | str | 否 | None | 事件类型过滤 |

**返回：** `List[Dict[str, Any]]`

**示例：**

```python
subscribers = bus.get_subscribers()
print(subscribers)
# [{'id': 'sub_1', 'event_type': 'price_update', 'priority': 10, 'callback': 'handler'}, ...]
```

---

##### cleanup

```python
cleaned = bus.cleanup()
```

**描述：** 清理失效的弱引用订阅者

**参数：** 无

**返回：** `int` - 清理的订阅者数量

---

### EventHistory

**位置：** `FQBase/Core/event_bus.py`

**描述：** 事件历史记录管理器，使用环形缓冲区限制内存

```python
from FQBase.Core.event_bus import EventHistory

history = EventHistory(max_history=100)
```

#### 参数

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| max_history | int | 否 | 100 | 最大历史记录数 |

#### 方法

##### add

```python
history.add(event)
```

**描述：** 添加事件到历史记录

##### get

```python
events = history.get(event_type=None, limit=100)
```

**描述：** 获取事件历史

##### clear

```python
history.clear()
```

**描述：** 清除事件历史

##### count

```python
count = history.count(event_type=None)
```

**描述：** 获取事件数量

#### 属性

##### max_size

```python
size = history.max_size
```

**描述：** 获取最大历史记录数

---

### EventBusContext

**位置：** `FQBase/Core/event_bus.py`

**描述：** 事件总线上下文管理器，提供 with 语句的便捷访问方式

```python
from FQBase.Core.event_bus import EventBusContext

with EventBusContext() as bus:
    bus.subscribe('event', handler)
```

#### 方法

##### __enter__

```python
with EventBusContext() as bus:
    # bus 是 EventBus 实例
```

##### __exit__

```python
# 无需手动清理
```

---

## 函数

### get_event_bus

**位置：** `FQBase/Core/event_bus.py`

```python
from FQBase.Core.event_bus import get_event_bus

bus = get_event_bus()
```

**描述：** 获取事件总线单例实例

**参数：** 无

**返回：** `EventBus`

**示例：**

```python
bus = get_event_bus()
bus.subscribe('event', handler)
```

---

### setup_event_bus

**位置：** `FQBase/Core/event_bus_celery.py`

```python
from FQBase.Core.event_bus_celery import setup_event_bus

bus = setup_event_bus()
```

**描述：** 初始化 EventBus 实例（供 Celery Worker 启动时调用）

**参数：** 无

**返回：** `EventBus`

---

### get_event_bus (celery 版本)

**位置：** `FQBase/Core/event_bus_celery.py`

```python
from FQBase.Core.event_bus_celery import get_event_bus

bus = get_event_bus()
```

**描述：** 获取当前 Worker 进程的 EventBus 实例

**参数：** 无

**返回：** `Optional[EventBus]`

---

### clear_event_bus

**位置：** `FQBase/Core/event_bus_celery.py`

```python
from FQBase.Core.event_bus_celery import clear_event_bus

clear_event_bus()
```

**描述：** 清除 EventBus 实例（供 Celery Worker 关闭时调用）

**参数：** 无

**返回：** `None`

---

## 常量

| 常量 | 类型 | 值 | 描述 |
|------|------|-----|------|
| _max_workers | int | 4 | ThreadPoolExecutor 默认线程数（可通过环境变量 FQ_EVENTBUS_WORKERS 配置） |
| _celery_auto_init | bool | True | Celery 自动初始化开关（可通过环境变量 FQ_CELERY_AUTO_INIT 配置） |

---

## 环境变量

| 变量 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| FQ_EVENTBUS_WORKERS | str | "4" | ThreadPoolExecutor 线程数 |
| FQ_CELERY_AUTO_INIT | str | "true" | Celery 自动初始化，设为 "false" 禁用 |

---

## 异常

| 异常 | 描述 |
|------|------|
| 无特定异常 | EventBus 内部异常会被捕获并记录警告日志 |

---

## 相关文档

- [使用指南](./usage.md)
- [开发指南](./development.md)
- [最佳实践](./best-practices.md)
