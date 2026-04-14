---
title: 服务容器 - 快速入门
description: 5分钟快速上手服务容器
tag:
  - fqbase
  - container

summary:
  purpose: quick-start
  complexity: low
---

# 服务容器 - 快速入门

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → **[快速入门](./quick-start.md)** → [速查表](./cheatsheet.md) → [动手实验室](./workshop.md) → [使用指南](./usage.md) → [案例库](./examples.md) |


## 概述

服务容器是 FQBase 的核心基础设施，提供轻量级依赖注入功能。本指南将帮助您在 5 分钟内掌握基本用法。

## 前置要求

- Python 3.8+
- FQBase 已安装

## 5分钟上手

### Step 1: 导入模块

```python
from FQBase.Foundation.container import ServiceContainer
```

### Step 2: 创建容器实例

```python
container = ServiceContainer()
```

### Step 3: 注册服务

```python
# 方式1：注册单例（推荐用于数据库连接、缓存等）
container.register_singleton(
    CacheInterface,    # 服务类型
    RedisCacheAdapter,  # 实现类
)

# 方式2：注册瞬态（每次创建新实例）
container.register_transient(
    LoggerInterface,
    FileLogger,
)

# 方式3：使用工厂函数
container.register_factory(
    DatabaseInterface,
    lambda: create_database_connection(),
)
```

### Step 4: 获取服务

```python
# 获取服务实例
cache = container.get(CacheInterface)
logger = container.get(LoggerInterface)
```

### Step 5: 使用服务

```python
# 使用获取的服务
cache.set("key", "value")
logger.info("Application started")
```

### 完成！

恭喜！您已掌握服务容器的基本用法。

## ⚠️ 常见陷阱

### 陷阱 1：未注册服务就获取

```python
# ❌ 错误：服务未注册
container = ServiceContainer()
cache = container.get(CacheInterface)  # KeyError: Service not registered

# ✅ 正确：先注册再获取
container = ServiceContainer()
container.register_singleton(CacheInterface, RedisCacheAdapter)
cache = container.get(CacheInterface)  # 正常工作
```

### 陷阱 2：循环依赖

```python
# ❌ 错误：循环依赖
class A:
    def __init__(self, b: 'B'): pass

class B:
    def __init__(self, a: 'A'): pass

container.register_singleton(A, A)
container.register_singleton(B, B)
container.get(A)  # CircularDependencyException

# ✅ 正确：避免循环依赖
# 重新设计依赖关系，消除循环
```

### 陷阱 3：单例中存储状态

```python
# ❌ 错误：单例中存储请求相关状态
class UserService:
    def set_user(self, user):
        self.current_user = user  # 状态会跨请求共享

# ✅ 正确：使用瞬态或作用域
container.register_transient(UserService, UserService)
```

## 高级特性

### 链式调用

```python
container.register_singleton(A, AImpl) \
        .register_singleton(B, BImpl) \
        .register_transient(C, CImpl)
```

### 依赖自动注入

```python
class Database:
    def __init__(self, logger: LoggerInterface):
        self.logger = logger

container.register_singleton(LoggerInterface, FileLogger)
container.register_singleton(Database, Database)
db = container.get(Database)  # logger 自动注入
```

## 下一步

- 学习 [核心概念](./concepts.md)
- 阅读 [使用指南](./usage.md)
- 查看 [API参考](./api.md)

## 相关文档

- [README](./README.md)
- [核心概念](./concepts.md)
- [使用指南](./usage.md)
- [API参考](./api.md)
