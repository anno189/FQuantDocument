---
title: 事件总线 - 动手实验室
description: 事件总线动手练习指南
tag:
  - fqbase
  - event_bus
---

# 事件总线 - 动手实验室

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [速查表](./cheatsheet.md) → **[动手实验室](./workshop.md)** → [使用指南](./usage.md) → [案例库](./examples.md) |


## 概述

本实验室通过动手练习帮助您掌握事件总线的使用。

## 准备环境

```bash
pip install FQBase
```

## Lab 1: 基本发布订阅

### 目标

掌握事件总线的基本使用

### 练习代码

```python
from FQBase.Core.event_bus import get_event_bus, Event

bus = get_event_bus()

# 1. 定义处理函数
def on_message(event):
    print(f"收到消息: {event.data}")

# 2. 订阅事件
bus.subscribe('message', on_message)

# 3. 发布事件
bus.publish(Event('message', 'Hello World'))

# 预期输出: 收到消息: Hello World
```

### 任务

1. [ ] 创建 EventBus 实例
2. [ ] 定义一个事件处理函数
3. [ ] 订阅事件
4. [ ] 发布事件并验证处理函数被调用

---

## Lab 2: 优先级处理

### 目标

理解优先级如何影响事件处理顺序

### 练习代码

```python
bus = get_event_bus()
order = []

def first(event):
    order.append('first')

def second(event):
    order.append('second')

def third(event):
    order.append('third')

bus.subscribe('order', third, priority=1)
bus.subscribe('order', second, priority=10)
bus.subscribe('order', first, priority=100)

bus.publish(Event('order', None))

print(order)  # 预期: ['first', 'second', 'third']
```

### 任务

1. [ ] 创建三个处理函数
2. [ ] 按不同优先级订阅
3. [ ] 发布事件并验证执行顺序

---

## Lab 3: 弱引用与内存管理

### 目标

理解弱引用如何防止内存泄漏

### 练习代码

```python
bus = get_event_bus()

class Handler:
    def handle(self, event):
        print(f"处理: {event.data}")

handler = Handler()

# 使用弱引用订阅
bus.subscribe('event', handler.handle, weak_ref=True)

# 发布事件
bus.publish(Event('event', 'test'))

# 删除外部引用
del handler

# 触发清理
bus.cleanup()

# 检查订阅者数量
print(bus.get_subscriber_count('event'))
```

### 任务

1. [ ] 创建一个类及其处理方法
2. [ ] 使用 weak_ref=True 订阅
3. [ ] 删除类实例
4. [ ] 触发清理并检查订阅者数量

---

## Lab 4: 异步事件处理

### 目标

掌握异步发布的使用

### 练习代码

```python
import asyncio

bus = get_event_bus()

async def async_handler(event):
    await asyncio.sleep(0.1)
    print(f"异步处理: {event.data}")

bus.subscribe('async', async_handler)

async def main():
    print("开始发布")
    await bus.publishAwait(Event('async', 'test'))
    print("发布完成")

asyncio.run(main())
```

### 任务

1. [ ] 定义一个异步处理函数
2. [ ] 使用 subscribe 订阅
3. [ ] 使用 publishAwait 发布
4. [ ] 运行并观察输出

---

## Lab 5: 事件历史

### 目标

学会使用事件历史功能

### 练习代码

```python
bus = get_event_bus()

# 发布多个事件
for i in range(10):
    bus.publish(Event('counter', {'value': i}))

# 获取历史
history = bus.get_history(event_type='counter', limit=5)

print(f"历史记录数: {len(history)}")
for event in history:
    print(event.data)
```

### 任务

1. [ ] 发布 10 个事件
2. [ ] 获取历史记录
3. [ ] 限制返回数量并查看

---

## 实验室总结

完成所有实验后，你应该掌握：

- [x] 基本发布订阅
- [x] 优先级处理
- [x] 弱引用管理
- [x] 异步事件处理
- [x] 事件历史查询

## 下一步

- 学习 [最佳实践](./best-practices.md)
- 查看 [案例库](./examples.md)
- 阅读 [API参考](./api.md)

## 相关文档

- [README](./README.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
- [API参考](./api.md)
