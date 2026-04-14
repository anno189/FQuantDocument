---
title: 服务容器 - 核心概念
description: 深入理解服务容器的核心概念
tag:
  - fqbase
  - container
---

# 服务容器 - 核心概念

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [术语表](./glossary.md) → **[核心概念](./concepts.md)** → [框架集成](./framework.md) → [技术架构](./architecture.md) |
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → **[核心概念](./concepts.md)** → [设计原则](./design.md) → [API参考](./api.md) |


## 概述

服务容器是实现依赖注入的核心组件，通过控制反转（IoC）机制管理对象创建和依赖关系。本文档深入解释其核心概念。

## 概念 1: 依赖注入（Dependency Injection）

### 概念解释

依赖注入是一种设计模式，通过**外部注入**而非内部创建的方式提供依赖对象。

### 原理

```
传统方式（紧耦合）：
class UserService:
    def __init__(self):
        self.db = Database()  # 内部创建，紧耦合
    
依赖注入（松耦合）：
class UserService:
    def __init__(self, db: Database):
        self.db = db  # 外部注入，解耦合
```

### 代码示例

```python
# 不使用依赖注入
class OrderService:
    def __init__(self):
        self.payment = AlipayPayment()  # 紧耦合
    
    def create_order(self):
        self.payment.pay(100)

# 使用依赖注入
class OrderService:
    def __init__(self, payment: Payment):
        self.payment = payment  # 松耦合
    
    def create_order(self):
        self.payment.pay(100)

# 容器管理依赖
container = ServiceContainer()
container.register_singleton(Payment, AlipayPayment)
container.register_transient(OrderService, OrderService)

order_service = container.get(OrderService)  # payment 自动注入
```

## 概念 2: 服务生命周期（Service Lifetime）

### 概念解释

服务生命周期决定服务实例的创建方式和销毁时机。

### 三种生命周期

| 生命周期 | 说明 | 适用场景 |
|---------|------|---------|
| **SINGLETON** | 整个应用生命周期内只有一个实例 | 数据库连接、缓存、配置 |
| **TRANSIENT** | 每次请求创建新实例 | 处理器、视图、临时对象 |
| **SCOPED** | 同一作用域内共享实例 | Web请求上下文 |

### 代码示例

```python
# 单例：整个应用只创建一次
container.register_singleton(Cache, RedisCache)
cache1 = container.get(Cache)
cache2 = container.get(Cache)
assert cache1 is cache2  # True，同一个实例

# 瞬态：每次创建新实例
container.register_transient(Logger, FileLogger)
logger1 = container.get(Logger)
logger2 = container.get(Logger)
assert logger1 is not logger2  # True，不同实例
```

## 概念 3: 服务描述符（Service Descriptor）

### 概念解释

服务描述符是容器的内部数据结构，用于描述如何创建和管理服务实例。

### 内部结构

```python
class ServiceDescriptor:
    service_type: Type        # 服务类型（接口/抽象类）
    implementation: Type/Callable  # 实现类或工厂函数
    lifetime: ServiceLifetime # 生命周期
    dependencies: List[Type] # 依赖的其他服务
    _instance: Any           # 单例实例缓存
    _lock: threading.Lock   # 线程安全锁
```

### 工作原理

1. 注册时创建描述符
2. 获取时根据生命周期创建/返回实例
3. 单例模式下缓存实例

## 概念 4: 循环依赖检测

### 概念解释

循环依赖是指两个或多个服务相互依赖形成闭环，可能导致无限递归。

### 检测机制

```python
# 容器内部维护正在解析的服务的集合
_resolving: Set[Type]  # 正在解析的服务

def get(self, service_type):
    # 检测：如果服务正在解析中，说明有循环依赖
    if service_type in self._resolving:
        raise CircularDependencyException(...)
    
    self._resolving.add(service_type)
    try:
        # 解析服务...
    finally:
        self._resolving.discard(service_type)
```

### 示例

```python
# 循环依赖示例
class A:
    def __init__(self, b: 'B'): pass

class B:
    def __init__(self, a: 'A'): pass

container.register_singleton(A, A)
container.register_singleton(B, B)
container.get(A)  # 抛出 CircularDependencyException
```

## 概念 5: 服务定位器（Service Locator）

### 概念解释

服务定位器是全局访问点，通过静态方法访问容器中的服务。

### 与依赖注入对比

| 特性 | 依赖注入 | 服务定位器 |
|------|---------|-----------|
| 耦合度 | 更低 | 中等 |
| 测试性 | 更容易 | 需要 mock |
| 使用方式 | 构造函数参数 | 静态方法调用 |
| 推荐场景 | 应用代码 | 框架集成 |

### 代码示例

```python
# 设置全局容器
container = ServiceContainer()
container.register_singleton(Cache, RedisCache)
ServiceLocator.set_container(container)

# 全局获取服务
cache = ServiceLocator.get(Cache)

# 安全获取（不抛异常）
cache = ServiceLocator.try_get(Cache)
```

## 概念 6: 线程安全

### 概念解释

服务容器使用锁机制确保在多线程环境下安全操作。

### 实现机制

```python
class ServiceContainer:
    def __init__(self):
        self._lock = threading.Lock()  # 全局锁
    
    def register_singleton(self, ...):
        with self._lock:  # 注册时加锁
            self._services[service_type] = ...
    
    def get(self, service_type):
        if descriptor.lifetime == SINGLETON:
            if descriptor._instance is None:
                with self._lock:  # 获取单例时加锁
                    if descriptor._instance is None:
                        descriptor._instance = ...
        return descriptor._instance
```

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [术语表](./glossary.md)
- [使用指南](./usage.md)
- [API参考](./api.md)
- [设计原则](./design.md)
