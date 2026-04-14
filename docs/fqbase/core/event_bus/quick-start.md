---
title: 事件总线 - 快速入门
description: 5分钟快速上手事件总线模块
tag:
  - fqbase
  - event_bus

summary:
  purpose: quick-start
  complexity: low
---

# 事件总线 - 快速入门

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → **[快速入门](./quick-start.md)** → [速查表](./cheatsheet.md) → [动手实验室](./workshop.md) → [使用指南](./usage.md) → [案例库](./examples.md) |


## 概述

本指南将帮助您在 5 分钟内掌握 FQBase 事件总线的基本用法。事件总线实现了发布-订阅模式，用于模块间的松耦合通信。

## 前置要求

- Python 3.8+
- pip

## 安装

事件总线是 FQBase 的内置模块：

```bash
pip install FQBase
```

## 5分钟上手

### Step 1: 导入模块

```python
from FQBase.Core.event_bus import EventBus, Event, get_event_bus
```

### Step 2: 获取事件总线实例

```python
# 使用单例函数获取（推荐）
bus = get_event_bus()

# 或直接创建实例
bus = EventBus()
```

### Step 3: 订阅事件

```python
# 定义事件处理函数
def on_data_update(event):
    print(f"收到事件: {event.event_type}, 数据: {event.data}")

# 订阅特定类型事件
bus.subscribe('data_update', on_data_update, priority=1)
```

### Step 4: 发布事件

```python
# 创建并发布事件
event = Event('data_update', {'key': 'value', 'timestamp': '2024-01-01'})
bus.publish(event)

# 输出: 收到事件: data_update, 数据: {'key': 'value', 'timestamp': '2024-01-01'}
```

### Step 5: 验证结果

完整示例：

```python
from FQBase.Core.event_bus import EventBus, Event, get_event_bus

# 获取事件总线
bus = get_event_bus()

# 定义处理函数
def handler(event):
    print(f"Received: {event.event_type}, data: {event.data}")

# 订阅事件
bus.subscribe('update', handler, priority=1)

# 发布事件
bus.publish(Event('update', {'key': 'value'}))

# 输出: Received: update, data: {'key': 'value'}
```

### 完成！🎉

恭喜！您已经掌握了事件总线的基本用法。

## 高级特性快速预览

事件总线还支持更多高级特性：

```python
# 异步发布
import asyncio
async def async_publish():
    await bus.publishAwait(Event('async_event', 'data'))
asyncio.run(async_publish())

# 全局订阅（接收所有事件）
bus.subscribe_global(lambda e: print(f"全局收到: {e.event_type}"))

# 优先级订阅（数值越大越先执行）
bus.subscribe('high_priority', handler, priority=100)
bus.subscribe('low_priority', handler, priority=1)

# 弱引用订阅（防止内存泄漏）
bus.subscribe('event', handler, weak_ref=True)

# 查看事件历史
history = bus.get_history(event_type='update', limit=10)
```

## ⚠️ 常见陷阱

### 陷阱 1：订阅函数无法被调用

**问题描述**：订阅后事件发布但处理函数未执行

- ❌ 错误做法：订阅时使用匿名函数或 lambda，且未保存引用

```python
# 错误：lambda 表达式可能无法正确调用
bus.subscribe('event', lambda e: print(e.data))
```

- ✅ 正确做法：使用具名函数

```python
# 正确：使用具名函数
def my_handler(event):
    print(event.data)
bus.subscribe('event', my_handler)
```

### 陷阱 2：内存泄漏

**问题描述**：长时间运行后内存持续增长

- ❌ 错误做法：使用类方法订阅且未取消订阅

```python
# 错误：类实例方法订阅，实例不再使用但仍被引用
class DataManager:
    def on_update(self, event):
        pass

manager = DataManager()
bus.subscribe('update', manager.on_update)  # 造成内存泄漏

# 后续 manager 被删除但订阅仍存在
del manager
```

- ✅ 正确做法：使用弱引用或在适当时机取消订阅

```python
# 方法1：使用弱引用
bus.subscribe('update', manager.on_update, weak_ref=True)

# 方法2：及时取消订阅
sub_id = bus.subscribe('update', manager.on_update)
# ... 使用完毕后
bus.unsubscribe_by_id(sub_id)
```

### 陷阱 3：异步事件处理中的阻塞

**问题描述**：异步发布事件但处理函数阻塞主线程

- ❌ 错误做法：在同步处理函数中执行耗时操作

```python
# 错误：同步处理函数中执行耗时操作
def slow_handler(event):
    time.sleep(10)  # 阻塞 10 秒
    print(event.data)

bus.subscribe('event', slow_handler)
bus.publish(Event('event', 'data'))  # 会阻塞 10 秒
```

- ✅ 正确做法：使用异步处理函数或在线程池中执行

```python
# 方法1：使用异步处理函数
async def async_handler(event):
    await asyncio.sleep(10)
    print(event.data)

bus.subscribe('event', async_handler)
await bus.publishAwait(Event('event', 'data'))

# 方法2：使用 publish_async 在线程池中执行
bus.publish_async(Event('event', 'data'))
```

## 下一步

- 学习 [核心概念](./concepts.md) - 深入理解事件总线设计
- 阅读 [术语表](./glossary.md) - 了解关键术语定义
- 查看 [使用指南](./usage.md) - 掌握更多用法

## 相关文档

- [README](./README.md)
- [术语表](./glossary.md)
- [核心概念](./concepts.md)
- [使用指南](./usage.md)
