---
title: 事件总线 - 术语表
description: 事件总线模块术语定义与解释
tag:
  - fqbase
  - event_bus
---

# 事件总线 - 术语表

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → **[术语表](./glossary.md)** → [核心概念](./concepts.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) |


## 概述

本文档定义事件总线模块中使用的关键术语，帮助您准确理解模块功能。

## 术语

### 事件总线（Event Bus）

**定义：** 事件总线是发布-订阅模式的核心组件，负责管理事件订阅和事件发布的中介服务。它解耦了事件的发送者（发布者）和接收者（订阅者），使两者无需直接引用即可通信。

**示例：**

```python
from FQBase.Core.event_bus import get_event_bus

bus = get_event_bus()  # 获取事件总线实例
```

### 事件（Event）

**定义：** 事件是包含事件类型、数据、时间戳等信息的对象。事件是事件总线中传递的基本单元。

**示例：**

```python
from FQBase.Core.event_bus import Event

event = Event(
    event_type='price_update',
    data={'symbol': 'AAPL', 'price': 150.0},
    source='market_feed'
)
print(event.event_type)  # 'price_update'
print(event.timestamp)   # 事件创建时间
```

### 发布（Publish）

**定义：** 发布是将事件发送到事件总线，由事件总线分发给所有订阅者的过程。发布者无需知道有多少订阅者。

**示例：**

```python
bus = get_event_bus()
bus.publish(Event('trade_executed', {'order_id': '12345', 'price': 100.0}))
```

### 订阅（Subscribe）

**定义：** 订阅是向事件总线注册事件处理函数的过程。订阅者声明对特定类型事件的兴趣，当事件发布时，处理函数会被调用。

**示例：**

```python
def on_trade(event):
    print(f"交易执行: {event.data}")

bus.subscribe('trade_executed', on_trade)
```

### 全局订阅（Global Subscribe）

**定义：** 全局订阅是一种特殊订阅方式，订阅者将接收所有类型的事件，无论事件类型是什么。

**示例：**

```python
def log_all_events(event):
    print(f"[LOG] {event.event_type}: {event.data}")

bus.subscribe_global(log_all_events)

# 任何事件发布都会触发 log_all_events
bus.publish(Event('type_a', 'data_a'))
bus.publish(Event('type_b', 'data_b'))
```

### 订阅者（Subscriber）

**定义：** 订阅者是指注册到事件总线的事件处理函数或回调方法。订阅者可以是普通函数、类方法或 lambda 表达式。

**示例：**

```python
# 普通函数订阅者
def func_subscriber(event):
    pass

# 类方法订阅者
class Handler:
    def method_subscriber(self, event):
        pass

handler = Handler()
bus.subscribe('event', handler.method_subscriber)
```

### 订阅 ID（Subscriber ID）

**定义：** 订阅 ID 是订阅成功后返回的唯一标识符，用于后续取消订阅操作。

**示例：**

```python
sub_id = bus.subscribe('event', handler)
print(f"订阅成功，ID: {sub_id}")  # e.g., "sub_1"

# 使用订阅 ID 取消订阅
bus.unsubscribe_by_id(sub_id)
```

### 优先级（Priority）

**定义：** 优先级是订阅者的排序权重，数值越大的订阅者越先被执行。用于控制事件处理的顺序。

**示例：**

```python
# 高优先级先执行
bus.subscribe('event', low_priority_handler, priority=1)
bus.subscribe('event', high_priority_handler, priority=100)

# 发布事件时，high_priority_handler 先执行
bus.publish(Event('event', 'data'))
```

### 弱引用（Weak Reference）

**定义：** 弱引用是一种不增加对象引用计数的引用方式。使用弱引用订阅可以防止因订阅关系导致的内存泄漏，当订阅对象被删除时，弱引用自动失效。

**示例：**

```python
class DataProcessor:
    def on_event(self, event):
        print(f"处理事件: {event.data}")

processor = DataProcessor()

# 使用弱引用订阅
bus.subscribe('data', processor.on_event, weak_ref=True)

# 当 processor 被删除时，订阅自动失效，不会造成内存泄漏
del processor
```

### 事件历史（Event History）

**定义：** 事件历史是已发布事件的记录集合，使用环形缓冲区存储。用于事件回溯、调试和审计。

**示例：**

```python
# 获取事件历史
history = bus.get_history(event_type='trade', limit=10)

for event in history:
    print(f"{event.timestamp}: {event.event_type} - {event.data}")
```

### 环形缓冲区（Ring Buffer）

**定义：** 环形缓冲区是一种固定大小的数据结构，当缓冲区满时，新元素会自动覆盖最旧的元素。EventHistory 使用此结构限制内存占用。

**示例：**

```python
from FQBase.Core.event_bus import EventHistory

# 创建历史记录器，最多存储 100 条
history = EventHistory(max_history=100)

# 添加 150 条事件
for i in range(150):
    history.add(Event('test', i))

# 只会保留最近的 100 条
print(history.count())  # 100
```

### 发布-订阅模式（Publish-Subscribe Pattern）

**定义：** 发布-订阅模式是一种消息传递模式，其中发布者将消息发送到事件总线，而不直接发送给订阅者。订阅者向事件总线注册对特定消息的兴趣。这种模式实现了发布者和订阅者之间的松耦合。

### 线程安全（Thread Safety）

**定义：** 线程安全是指代码在多线程环境中正确运行的能力。EventBus 使用锁机制确保在多线程并发访问时数据一致性。

**示例：**

```python
import threading

# EventBus 内部使用锁保护共享数据
# 多个线程可以安全地同时调用 subscribe/publish
def worker():
    for _ in range(100):
        bus.publish(Event('batch', 'data'))

threads = [threading.Thread(target=worker) for _ in range(10)]
for t in threads:
    t.start()
for t in threads:
    t.join()
```

### 异步发布（Async Publish）

**定义：** 异步发布是指事件发布不阻塞当前线程。EventBus 提供 `publish_async` 和 `publishAwait` 两种异步发布方式。

**示例：**

```python
import asyncio

# 方式1：使用 publish_async 返回 Future
future = bus.publish_async(Event('async_event', 'data'))

# 方式2：使用 publishAwait 配合 async/await
async def main():
    await bus.publishAwait(Event('async_event', 'data'))

asyncio.run(main())
```

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [核心概念](./concepts.md)
- [使用指南](./usage.md)
