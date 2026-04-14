---
title: 事件总线 - 核心概念
description: 深入理解事件总线的核心概念与设计
tag:
  - fqbase
  - event_bus
---

# 事件总线 - 核心概念

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [术语表](./glossary.md) → **[核心概念](./concepts.md)** → [框架集成](./framework.md) → [技术架构](./architecture.md) |
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → **[核心概念](./concepts.md)** → [设计原则](./design.md) → [API参考](./api.md) |


## 概述

本章节深入介绍事件总线的核心概念，帮助您理解其设计原理和内部机制。

## 概念 1：发布-订阅模式

### 概念解释

发布-订阅模式（Publish-Subscribe Pattern）是一种消息传递模式，其中：

- **发布者（Publisher）**：发送事件到事件总线，不关心谁接收
- **订阅者（Subscriber）**：向事件总线注册对特定事件的兴趣
- **事件总线（Event Bus）**：作为中介，转发事件给匹配的订阅者

这种模式实现了**松耦合**：发布者和订阅者无需相互了解，只需要共同遵循事件总线接口。

### 原理

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  发布者 A   │     │  事件总线   │     │  订阅者 B   │
│             │     │             │     │             │
│  publish()  │────▶│  查找订阅   │────▶│  on_event() │
└─────────────┘     │             │     └─────────────┘
                    │             │     ┌─────────────┐
┌─────────────┐     │  分发事件   │     │  订阅者 C   │
│  发布者 B   │────▶│             │────▶│             │
│             │     └─────────────┘     │  on_event() │
└─────────────┘                        └─────────────┘
```

### 代码示例

```python
from FQBase.Core.event_bus import EventBus, Event, get_event_bus

bus = get_event_bus()

# 订阅者 A：对价格更新感兴趣
def on_price_update(event):
    print(f"价格更新: {event.data}")

# 订阅者 B：对交易执行感兴趣
def on_trade_executed(event):
    print(f"交易执行: {event.data}")

# 订阅者 C：对所有事件感兴趣
def on_any_event(event):
    print(f"收到事件: {event.event_type}")

bus.subscribe('price_update', on_price_update)
bus.subscribe('trade_executed', on_trade_executed)
bus.subscribe_global(on_any_event)

# 发布事件
bus.publish(Event('price_update', {'symbol': 'AAPL', 'price': 150}))
bus.publish(Event('trade_executed', {'order_id': '123', 'price': 150}))

# 输出:
# 价格更新: {'symbol': 'AAPL', 'price': 150}
# 交易执行: {'order_id': '123', 'price': 150}
# 收到事件: price_update
# 收到事件: trade_executed
```

## 概念 2：单例模式

### 概念解释

EventBus 采用单例模式（Singleton Pattern），确保全局只有一个事件总线实例。这保证了所有模块使用同一个事件总线进行通信，避免因实例分散导致的事件无法互通问题。

### 原理

单例模式通过以下机制实现：
1. 使用 `@singleton` 装饰器
2. 首次调用时创建实例
3. 后续调用返回已创建的实例
4. 防止通过构造函数创建多个实例

### 代码示例

```python
from FQBase.Core.event_bus import EventBus, get_event_bus

# 方式1：使用 get_event_bus 函数（推荐）
bus1 = get_event_bus()
bus2 = get_event_bus()

print(bus1 is bus2)  # True - 同一个实例

# 方式2：直接使用 EventBus 构造函数
# EventBus 内部实现了单例逻辑，会返回同一个实例
bus3 = EventBus()
print(bus1 is bus3)  # True - 还是同一个实例
```

## 概念 3：弱引用与内存管理

### 概念解释

EventBus 支持弱引用订阅，防止因订阅关系导致的内存泄漏。当订阅者（回调函数或类方法）不再被外部引用时，弱引用允许其被垃圾回收。

### 原理

```
普通订阅：
┌─────────────┐         ┌─────────────────┐
│  EventBus   │────────▶│  Subscriber     │
│             │  强引用  │  (处理函数)      │
└─────────────┘         └─────────────────┘
                              ▲
                              │
                        ┌─────┴─────┐
                        │ 外部引用  │
                        │ (如类实例)│
                        └──────────┘

弱引用订阅：
┌─────────────┐         ┌─────────────────┐
│  EventBus   │────────▶│  WeakRef        │──▶ (可能指向) Subscriber
│             │  弱引用  │                 │
└─────────────┘         └─────────────────┘
```

### 代码示例

```python
from FQBase.Core.event_bus import get_event_bus

bus = get_event_bus()

class DataHandler:
    def __init__(self, name):
        self.name = name

    def handle(self, event):
        print(f"{self.name} 处理: {event.data}")

# 使用弱引用订阅
handler = DataHandler("Handler1")
bus.subscribe('event', handler.handle, weak_ref=True)

# 发布事件，handler.handle 会被调用
bus.publish(Event('event', 'test data'))
# 输出: Handler1 处理: test data

# 删除外部引用后
del handler

# 触发自动清理（发布一定数量事件后）
for _ in range(101):
    bus.publish(Event('event', 'trigger cleanup'))

# 订阅者列表为空（弱引用订阅已自动清理）
print(bus.get_subscriber_count())  # 0
```

## 概念 4：事件历史与环形缓冲区

### 概念解释

EventHistory 使用 Python 的 `deque` 实现环形缓冲区（Ring Buffer），当缓冲区满时，新元素自动覆盖最旧的元素。这种设计限制了内存占用，同时保留最新事件记录。

### 原理

```
环形缓冲区（maxlen=5）:

初始状态: [空, 空, 空, 空, 空]

添加 3 个: [E1, E2, E3, 空, 空]

添加 2 个: [E1, E2, E3, E4, E5]

再添加 2 个 (覆盖):
            [E4, E5, E6, E7, 空]  <- 新元素在右边加入
            │     │
            └──E1─┘  <- E1 被挤出
```

### 代码示例

```python
from FQBase.Core.event_bus import EventHistory, Event

# 创建容量为 5 的历史记录
history = EventHistory(max_history=5)

# 添加 7 个事件
for i in range(1, 8):
    history.add(Event('test', {'seq': i}))

# 只保留最后 5 个
print(history.count())  # 5

# 获取所有历史
events = history.get(limit=10)
print([e.data['seq'] for e in events])  # [3, 4, 5, 6, 7]
```

## 概念 5：优先级处理

### 概念解释

每个订阅者可以设置优先级（priority），数值越大越先执行。优先级用于控制事件处理的顺序，例如：日志记录应最后执行，数据处理应优先执行。

### 原理

```
事件发布 → 查找订阅者列表 → 按优先级排序 → 依次调用

订阅者列表:
- priority=100: 核心业务处理
- priority=50:  数据验证
- priority=10:  日志记录
- priority=0:  默认优先级

执行顺序: 100 → 50 → 10 → 0
```

### 代码示例

```python
from FQBase.Core.event_bus import get_event_bus, Event

bus = get_event_bus()

# 按不同优先级订阅
def log_handler(event):
    print(f"[LOG] {event.data}")

def validate_handler(event):
    print(f"[VALIDATE] {event.data}")

def business_handler(event):
    print(f"[BUSINESS] {event.data}")

bus.subscribe('order', log_handler, priority=10)
bus.subscribe('order', validate_handler, priority=50)
bus.subscribe('order', business_handler, priority=100)

# 发布事件
bus.publish(Event('order', 'New Order'))

# 执行顺序: 100 (BUSINESS) → 50 (VALIDATE) → 10 (LOG)
# 输出:
# BUSINESS: New Order
# VALIDATE: New Order
# LOG: New Order
```

## 概念 6：线程安全

### 概念解释

EventBus 内部使用锁（threading.Lock）保护共享数据，确保在多线程环境中正确运行。订阅、取消订阅、发布等操作都是线程安全的。

### 原理

```
┌─────────────────────────────────────┐
│           EventBus                  │
│                                      │
│  _subscriber_lock ───────────────▶  │
│  (threading.Lock)                   │
│                                      │
│  publish() ──▶ 获取锁 ──▶ 操作 ──▶ 释放锁 │
│  subscribe() ──▶ 获取锁 ──▶ 操作 ──▶ 释放锁 │
└─────────────────────────────────────┘
```

### 代码示例

```python
import threading
import time
from FQBase.Core.event_bus import get_event_bus, Event

bus = get_event_bus()

results = []

def worker(worker_id):
    for i in range(50):
        bus.publish(Event('work', {'worker': worker_id, 'task': i}))
        time.sleep(0.001)  # 模拟工作

# 启动 10 个线程同时发布事件
threads = [threading.Thread(target=worker, args=(i,)) for i in range(10)]
for t in threads:
    t.start()
for t in threads:
    t.join()

print(f"总计发布事件: {bus.get_history().__len__()}")
# 安全完成，无数据竞争
```

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [术语表](./glossary.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
