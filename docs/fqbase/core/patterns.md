---
title: Core - 设计模式
description: Core 基础设施核心层使用的设计模式详解
tag:
  - fqbase
  - core
---

# Core - 设计模式

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟠 架构师 | [README](./README.md) → [技术架构](./architecture.md) → **[设计模式](./patterns.md)** → [技术权衡](./tradeoff.md) → [决策指南](./decision-guide.md) → [案例研究](./case-studies.md) → [数据流](./data-flow.md) |
| 📚 案例库 | [案例库](./examples.md) → [案例研究](./case-studies.md) → **[设计模式](./patterns.md)** → [技术权衡](./tradeoff.md) |


## 概述

Core 模块使用了多种设计模式来实现其功能。

## 模式 1: 单例模式

### 上下文

EventBus 需要在整个应用中保持唯一实例。

### 模式结构

```
Client → get_event_bus() → EventBus (唯一实例)
```

### 实现

```python
_event_bus_instance = None

def get_event_bus():
    global _event_bus_instance
    if _event_bus_instance is None:
        _event_bus_instance = EventBus()
    return _event_bus_instance
```

## 模式 2: 发布-订阅模式

### 上下文

实现组件间的松耦合通信。

### 模式结构

```
Publisher → EventBus → Subscriber1
                      → Subscriber2
                      → Subscriber3
```

### 实现

```python
class EventBus:
    def subscribe(self, event_type, handler):
        # 注册订阅者
        pass

    def publish(self, event):
        # 分发事件
        for handler in self._subscriptions[event.type]:
            handler(event)
```

## 模式 3: 策略模式

### 上下文

支持多种通知渠道，但使用统一的发送接口。

### 模式结构

```
NotificationManager
    ├── WeChatStrategy
    ├── ServerChanStrategy
    └── PushBearStrategy
```

## 相关文档

- [技术架构](./architecture.md)
- [设计原则](./design.md)
- [技术权衡](./tradeoff.md)
- [案例研究](./case-studies.md)
