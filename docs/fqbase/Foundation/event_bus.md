---
title: event_bus - 事件总线
file-id: fqbase-foundation-event_bus
type: reference
status: active
audience: ai-agent
token-estimate: 3496
description: 提供事件发布订阅功能，实现观察者模式，支持同步/异步发布、优先级、弱引用
tag:
  - fquant
  - fqbase
  - foundation
  - event_bus

summary:
  type: component
  complexity: medium
  maturity: stable
  size: medium
  is_container: false
  api_exports:
    total: 6
    classes:
      - name: EventBus
        signature: "@singleton class EventBus"
        description: 单例模式的事件总线，负责事件发布订阅管理
        source: "event_bus.py#L277"
      - name: Event
        signature: "class Event[T]"
        description: 事件对象，包含事件类型、数据、时间戳和额外参数
        source: "event_bus.py#L115"
      - name: EventHistory
        signature: "class EventHistory"
        description: 事件历史记录管理器，使用环形缓冲区
        source: "event_bus.py#L152"
      - name: Subscription
        signature: "@dataclass class Subscription"
        description: 事件订阅者，按优先级排序
        source: "event_bus.py#L103"
      - name: EventBusContext
        signature: "class EventBusContext"
        description: 事件总线上下文管理器，提供 with 语句便捷访问
        source: "event_bus.py#L697"
    functions:
      - name: get_event_bus
        signature: "() -> EventBus"
        description: 获取 EventBus 单例实例
        source: "event_bus.py#L722"
  features:
    has_async: true
    is_thread_safe: true
    has_config: true
    has_logging: true
    has_security: false
  design_patterns:
    - observer
    - singleton
  environment_vars:
    - name: FQ_EVENTBUS_WORKERS
      default: "4"
      description: ThreadPoolExecutor 线程数
    - name: FQ_EVENTBUS_AUTHORIZATION_ENABLED
      default: "false"
      description: 是否启用事件总线授权功能
  source_location: "Foundation/event_bus.py"
  source_mtime: 1776751707
  last_updated: "2026-04"

relationships:
  belongs_to:
    - fquant.fqbase.foundation
  depends_on:
    - fquant.fqbase.infrastructure.logger
    - fquant.fqbase.infrastructure.singleton
---

# event_bus - 事件总线

## 一句话总览

📌 **提供事件发布订阅功能，实现观察者模式，支持同步/异步发布、优先级订阅、弱引用防泄漏、环形缓冲区历史记录。**

---

## 核心 API

### get_event_bus

**位置：** `event_bus.py#L722`

```python
from FQBase.Foundation.event_bus import get_event_bus

bus = get_event_bus()
```

**描述：** 获取 EventBus 单例实例

**返回：** `EventBus`

---

### EventBus

**位置：** `event_bus.py#L277`

**描述：** 单例模式的事件总线，负责事件发布订阅管理

```python
from FQBase.Foundation.event_bus import EventBus, Event, get_event_bus

bus = get_event_bus()

def handler(event):
    print(f"Received: {event.event_type}, data: {event.data}")

bus.subscribe('update', handler, priority=1)
bus.publish(Event('update', {'key': 'value'}))
```

#### 构造参数

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| max_history | int | 100 | 最大历史记录数 |
| auto_cleanup_interval | int | 100 | 自动清理死订阅者的间隔（发布次数） |

#### 订阅方法

| 方法 | 签名 | 返回值 | 描述 |
|------|------|--------|------|
| subscribe | `(event_type: str, callback: Callable, priority: int = 0, weak_ref: bool = False) -> str` | 订阅ID | 订阅指定类型事件 |
| unsubscribe | `(event_type: str, callback: Callable) -> None` | - | 通过回调取消订阅 |
| unsubscribe_by_id | `(subscriber_id: str) -> bool` | 是否成功 | 通过订阅ID取消订阅 |
| subscribe_global | `(callback: Callable, priority: int = 0, weak_ref: bool = False) -> str` | 订阅ID | 订阅所有类型事件 |
| unsubscribe_global | `(callback: Callable) -> None` | - | 取消全局订阅 |

#### 发布方法

| 方法 | 签名 | 返回值 | 描述 |
|------|------|--------|------|
| publish | `(event: Event) -> None` | - | 同步发布事件（阻塞） |
| publish_async | `(event: Event, callback: Optional[Callable] = None) -> asyncio.Future` | Future | 线程池异步发布（非阻塞） |
| publishAwait | `async (event: Event) -> None` | - | 异步等待发布（async/await 协程） |

#### 查询与管理方法

| 方法 | 签名 | 返回值 | 描述 |
|------|------|--------|------|
| get_history | `(event_type: str = None, limit: int = 100) -> List[Event]` | 事件列表 | 获取事件历史 |
| clear_history | `() -> None` | - | 清除事件历史 |
| get_subscriber_count | `(event_type: str = None) -> int` | 数量 | 获取订阅者数量 |
| get_subscribers | `(event_type: str = None) -> List[Dict[str, Any]]` | 订阅者信息列表 | 获取订阅者详情 |
| cleanup | `() -> int` | 清理数量 | 手动清理失效弱引用订阅者 |

---

### Event

**位置：** `event_bus.py#L115`

**描述：** 事件对象，包含事件类型、数据、时间戳和额外参数。支持泛型 `Event[T]` 指定数据类型。

```python
from FQBase.Foundation.event_bus import Event

event = Event('price_update', {'symbol': 'AAPL', 'price': 150.0})
print(event.event_type)
print(event.data)
print(event.timestamp)
print(event.name)
print(event.extra)
```

#### 构造参数

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| event_type | str | - | 事件类型字符串 |
| data | Optional[T] | None | 事件携带的数据 |
| **kwargs | Any | - | 额外关键字参数，存入 extra |

#### 实例属性

| 属性 | 类型 | 描述 |
|------|------|------|
| event_type | str | 事件类型字符串 |
| name | str | 事件名称（等同于 event_type） |
| data | Optional[T] | 事件携带的数据 |
| timestamp | datetime | 事件发生时间 |
| extra | dict | 额外关键字参数 |

---

### EventHistory

**位置：** `event_bus.py#L152`

**描述：** 事件历史记录管理器，使用环形缓冲区限制内存，线程安全访问

```python
from FQBase.Foundation.event_bus import EventHistory, Event

history = EventHistory(max_history=50)
history.add(Event('test', 'data'))

events = history.get(event_type='test', limit=10)
count = history.count(event_type='test')
history.clear()
max_size = history.max_size
```

#### 构造参数

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| max_history | int | 100 | 最大历史记录数 |

#### 核心方法

| 方法 | 签名 | 返回值 | 描述 |
|------|------|--------|------|
| add | `(event: Event) -> None` | - | 添加事件到历史记录 |
| get | `(event_type: Optional[str] = None, limit: int = 100) -> List[Event]` | 事件列表 | 获取历史事件，可按类型过滤 |
| clear | `() -> None` | - | 清除历史记录 |
| count | `(event_type: Optional[str] = None) -> int` | 数量 | 统计事件数量，可按类型过滤 |

#### 属性

| 属性 | 类型 | 描述 |
|------|------|------|
| max_size | int | 最大历史记录数（只读） |

---

### Subscription

**位置：** `event_bus.py#L103`

**描述：** 事件订阅者包装类，dataclass 实现，按 priority 排序（数值越大越先执行）

#### 字段

| 字段 | 类型 | 默认值 | 参与排序 | 描述 |
|------|------|--------|----------|------|
| priority | int | - | ✅ | 优先级，数值越大越先执行 |
| callback | Callable | - | ❌ | 回调 |
| weak_info | Optional[tuple] | None | ❌ | 弱引用信息 (weak_ref, is_method) |
| subscriber_id | Optional[str] | None | ❌ | 订阅唯一标识 |

---

### EventBusContext

**位置：** `event_bus.py#L697`

**描述：** 事件总线上下文管理器，提供 with 语句便捷访问 EventBus 单例

```python
from FQBase.Foundation.event_bus import EventBusContext, Event

def handler(event):
    print(f"Got: {event.data}")

with EventBusContext() as bus:
    bus.subscribe('data', handler)
    bus.publish(Event('data', {'key': 'value'}))
```

> **注意：** EventBus 是全局单例，`__exit__` 不执行任何清理操作。此上下文管理器仅提供便捷访问方式。

---

## 设计模式

- **观察者模式**：订阅/发布机制实现松耦合
- **单例模式**：EventBus 全局唯一实例（通过 `@singleton` 装饰器实现）
- **弱引用模式**：`weak_ref=True` 时使用 WeakMethod/WeakRef 防止内存泄漏

## 核心特性

| 特性 | 描述 |
|------|------|
| 同步发布 | `publish()` 阻塞式同步调用所有订阅者 |
| 异步发布 | `publish_async()` 线程池异步发布，返回 Future |
| 协程发布 | `publishAwait()` 支持 async/await，自动识别协程回调 |
| 全局订阅 | `subscribe_global()` 接收所有类型事件 |
| 优先级 | `priority` 数值越大越先执行 |
| 弱引用 | `weak_ref=True` 防止内存泄漏 |
| 自动清理 | 每 auto_cleanup_interval 次发布后自动清理死订阅者 |
| 线程安全 | 使用 Lock 保护订阅者集合 |
| 环形缓冲区 | EventHistory 使用 deque(maxlen=N) 自动淘汰旧记录 |

## 环境配置

| 变量 | 默认值 | 描述 |
|------|--------|------|
| `FQ_EVENTBUS_WORKERS` | 4 | ThreadPoolExecutor 线程数 |
| `FQ_EVENTBUS_AUTHORIZATION_ENABLED` | false | 是否启用授权功能 |

## 使用场景

### 场景1：组件间通信

```python
from FQBase.Foundation.event_bus import EventBus, Event, get_event_bus

bus = get_event_bus()

def on_price_update(event):
    print(f"Price updated: {event.data}")

bus.subscribe('price_update', on_price_update)

class PriceService:
    def update_price(self, symbol, price):
        bus.publish(Event('price_update', {'symbol': symbol, 'price': price}))
```

### 场景2：异步事件处理

```python
bus = get_event_bus()
future = bus.publish_async(Event('data_process', {'data': large_data}))
```

### 场景3：协程事件处理

```python
import asyncio
from FQBase.Foundation.event_bus import get_event_bus, Event

bus = get_event_bus()

async def async_handler(event):
    await asyncio.sleep(0.1)
    print(f"Async processed: {event.data}")

bus.subscribe('async_event', async_handler)

async def main():
    await bus.publishAwait(Event('async_event', {'key': 'value'}))

asyncio.run(main())
```

### 场景4：弱引用订阅与自动清理

```python
bus = get_event_bus()

class DataProcessor:
    def on_data(self, event):
        print(f"Processing: {event.data}")

processor = DataProcessor()
sub_id = bus.subscribe('data', processor.on_data, weak_ref=True)

del processor
cleaned = bus.cleanup()
print(f"Cleaned {cleaned} dead subscribers")
```

### 场景5：事件历史查询

```python
bus = get_event_bus()
recent_events = bus.get_history(event_type='price_update', limit=50)
total = bus.get_subscriber_count()
subscribers = bus.get_subscribers(event_type='price_update')
```

### 场景6：上下文管理器

```python
from FQBase.Foundation.event_bus import EventBusContext, Event

with EventBusContext() as bus:
    bus.subscribe('init', lambda e: print("Initialized"))
    bus.publish(Event('init', None))
```

## 注意事项

1. **单例模式**：使用 `get_event_bus()` 获取实例，不要直接 `EventBus()` 创建
2. **弱引用订阅**：`weak_ref` 默认为 `False`，需显式设置为 `True` 才启用弱引用
3. **异步发布**：`publish_async()` 返回 `asyncio.Future`，不会阻塞调用者
4. **协程发布**：`publishAwait()` 自动识别协程回调并 await，同步回调则放入线程池
5. **历史记录**：使用环形缓冲区，自动淘汰最旧记录
6. **订阅ID**：`subscribe()` 和 `subscribe_global()` 返回订阅ID，可用于 `unsubscribe_by_id()` 精确取消
7. **回调异常**：回调中的异常会被捕获并记录警告日志，不会中断其他订阅者的执行

## 相关文档

- [Foundation README](./README.md)
- [Foundation API](./api.md)
- [event_bus_celery - Celery 集成](./event_bus_celery.md)

[^parent]: fquant.fqbase.foundation
[^depends]: fquant.fqbase.infrastructure.logger, fquant.fqbase.infrastructure.singleton
