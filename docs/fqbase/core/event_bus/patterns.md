---
title: 事件总线 - 设计模式
description: 事件总线使用的设计模式详解
tag:
  - fqbase
  - event_bus
---

# 事件总线 - 设计模式

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟠 架构师 | [README](./README.md) → [技术架构](./architecture.md) → **[设计模式](./patterns.md)** → [技术权衡](./tradeoff.md) → [决策指南](./decision-guide.md) → [案例研究](./case-studies.md) → [数据流](./data-flow.md) |
| 📚 案例库 | **[案例库](./examples.md)** → [案例研究](./case-studies.md) → [决策指南](./decision-guide.md) → [数据流](./data-flow.md) → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) |


## 概述

本章节介绍事件总线设计和实现中使用的设计模式。

## 模式 1: 观察者模式

### 上下文

当一个对象状态改变时，需要通知多个依赖对象

### 模式结构

```
┌─────────────────┐         ┌─────────────────┐
│   Subject      │         │   Observer      │
│   (EventBus)   │────────▶│   (Subscriber)  │
│                │         │                 │
│  +subscribe()  │         │  +on_event()    │
│  +publish()    │         │                 │
│  +unsubscribe()        │                 │
└─────────────────┘         └─────────────────┘
         │
         │ 一对多
         ▼
┌─────────────────┐
│   Observer 2   │
│                 │
│  +on_event()    │
└─────────────────┘
```

### 实现

```python
class EventBus:
    def subscribe(self, event_type, callback):
        self._subscribers[event_type].append(callback)
    
    def publish(self, event):
        for callback in self._subscribers[event.event_type]:
            callback(event)
```

### 适用场景

- 一个对象改变需要通知多个对象
- 需要动态建立/解除关系

### 优缺点

**优点：**
- 松耦合
- 支持广播
- 动态关系

**缺点：**
- 可能导致内存泄漏（需弱引用）

---

## 模式 2: 单例模式

### 上下文

确保类只有一个实例

### 实现

```python
@singleton
class EventBus:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
```

### 适用场景

- 全局唯一资源
- 配置共享

---

## 模式 3: 备忘录模式

### 上下文

保存对象状态以便恢复

### 实现

```python
class EventHistory:
    def __init__(self, maxlen):
        self._history = deque(maxlen=maxlen)
    
    def add(self, event):
        self._history.append(event)
    
    def get(self):
        return list(self._history)
```

### 适用场景

- 事件历史记录
- 撤销/重做

---

## 相关文档

- [技术架构](./architecture.md)
- [设计原则](./design.md)
- [技术权衡](./tradeoff.md)
- [案例研究](./case-studies.md)
