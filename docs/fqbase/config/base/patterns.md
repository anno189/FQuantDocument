---
title: Base - 设计模式
description: Base 基础配置模块使用的设计模式详解
tag:
  - fqbase
  - config
---

# Base - 设计模式

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟠 架构师 | [README](./README.md) → [技术架构](./architecture.md) → **[设计模式](./patterns.md)** → [技术权衡](./tradeoff.md) → [决策指南](./decision-guide.md) → [案例研究](./case-studies.md) → [数据流](./data-flow.md) |
| 📚 案例库 | **[案例库](./examples.md)** → [案例研究](./case-studies.md) → [决策指南](./decision-guide.md) → [数据流](./data-flow.md) → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) |

## 概述

Base 模块使用的设计模式详解

## 模式 1: 单例模式

### 上下文

全局配置需要唯一实例

### 模式结构

```
┌─────────────────────┐
│       SETTING       │
│  (Singleton)        │
├─────────────────────┤
│ - instance          │
├─────────────────────┤
│ + get_mongo()       │
└─────────────────────┘
```

### 实现

```python
class Setting:
    _instance = None
    
    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance
```

### 适用场景

- MongoDB 配置单例
- 缓存配置全局唯一

### 优缺点

**优点：**
- 确保全局唯一
- 减少资源消耗

**缺点：**
- 难以测试
- 难以 mock

## 模式 2: 观察者模式

### 上下文

配置文件变化时自动通知

### 模式结构

```
┌──────────────┐      ┌──────────────┐
│  ConfigFile  │─────▶│  Observer    │
└──────────────┘      └──────────────┘
                              │
                              ▼
                     ┌──────────────┐
                     │  Callback    │
                     └──────────────┘
```

### 实现

```python
class ConfigWatcher:
    def __init__(self):
        self._observers = []
    
    def subscribe(self, callback):
        self._observers.append(callback)
    
    def notify(self, config):
        for observer in self._observers:
            observer(config)
```

## 相关文档

- [技术架构](./architecture.md)
- [设计原则](./design.md)
- [技术权衡](./tradeoff.md)
- [案例研究](./case-studies.md)
