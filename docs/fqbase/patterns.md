---
title: FQBase - 设计模式
description: FQBase 使用的设计模式详解
tag:
  - fqbase
---

# FQBase - 设计模式

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟠 架构师 | [README](./README.md) → [技术架构](./architecture.md) → **[设计模式](./patterns.md)** → [技术权衡](./tradeoff.md) → [决策指南](./decision-guide.md) → [案例研究](./case-studies.md) → [数据流](./data-flow.md) |
| 📚 案例库 | **[案例库](./examples.md)** → [案例研究](./case-studies.md) → [决策指南](./decision-guide.md) → [数据流](./data-flow.md) → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) |


## 概述

FQBase 使用的主要设计模式详解。

## 模式 1: 单例模式

### 上下文

需要确保全局只有一个实例的服务

### 模式结构

```
┌─────────────────────────┐
│      EventBus          │
├─────────────────────────┤
│ - _instance            │
├─────────────────────────┤
│ + get_event_bus()      │──► 返回单例
└─────────────────────────┘
```

### 实现

```python
class EventBus:
    _instance = None
    
    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance
```

### 适用场景

- 事件总线
- 日志管理器
- 通知管理器
- 配置管理器

## 模式 2: 发布-订阅模式

### 上下文

需要解耦组件间的通信

### 模式结构

```
┌─────────┐     ┌──────────┐     ┌────────────┐
│ Publisher│────►│ EventBus │────►│ Subscriber │
└─────────┘     └──────────┘     └────────────┘
```

### 实现

```python
class EventBus:
    def subscribe(self, topic, handler):
        self._handlers.setdefault(topic, []).append(handler)
    
    def publish(self, event):
        for handler in self._handlers.get(event.topic, []):
            handler(event)
```

### 适用场景

- 事件驱动架构
- 消息通知
- 状态变更传播

## 模式 3: 装饰器模式

### 上下文

需要为函数动态添加功能

### 模式结构

```
┌─────────────┐     ┌─────────────┐
│   Function   │◄────│   @retry   │
└─────────────┘     └─────────────┘
```

### 实现

```python
def retry(max_attempts=3):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception:
                    if attempt == max_attempts - 1:
                        raise
        return wrapper
    return decorator
```

### 适用场景

- 重试机制
- 日志装饰
- 权限检查

## 模式 4: 适配器模式

### 上下文

需要统一不同后端的接口

### 模式结构

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────►│   Cache     │────►│  Redis      │
│             │     │  Adapter    │     │  Adapter    │
└─────────────┘     └─────────────┘     └─────────────┘
```

### 实现

```python
class CacheAdapter:
    def get(self, key):
        raise NotImplementedError

class RedisAdapter(CacheAdapter):
    def get(self, key):
        return self.redis.get(key)
```

### 适用场景

- 缓存后端切换
- 通知渠道适配

## 相关文档

- [技术架构](./architecture.md)
- [设计原则](./design.md)
- [技术权衡](./tradeoff.md)
- [案例研究](./case-studies.md)
