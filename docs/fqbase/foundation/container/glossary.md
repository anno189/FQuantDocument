---
title: 服务容器 - 术语表
description: ServiceContainer 术语定义与解释
tag:
  - fqbase
  - container
---

# 服务容器 - 术语表

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → **[术语表](./glossary.md)** → [核心概念](./concepts.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) |


## 概述

本文档定义服务容器模块中的核心术语，帮助开发者统一理解概念。

## 术语

### 依赖注入（Dependency Injection）

**定义：** 一种软件设计模式，通过外部注入而非内部创建的方式来获取依赖对象。

**示例：**

```python
# 传统方式：内部创建依赖
class OrderService:
    def __init__(self):
        self.payment = PaymentService()  # 内部创建

# 依赖注入方式：外部注入
class OrderService:
    def __init__(self, payment: PaymentService):
        self.payment = payment  # 外部注入
```

### 服务容器（Service Container）

**定义：** 负责创建和管理服务实例的中央注册表，支持依赖解析和生命周期管理。

**示例：**

```python
container = ServiceContainer()
container.register_singleton(IPayment, AlipayPayment)
payment = container.get(IPayment)  # 容器自动创建并注入
```

### 服务生命周期（Service Lifetime）

**定义：** 服务实例在容器中的存活时间和复用策略。

**三种生命周期：**

| 生命周期 | 说明 | 适用场景 |
|---------|------|---------|
| SINGLETON | 全局单例，整个应用生命周期内只创建一个实例 | 数据库连接、缓存、日志 |
| TRANSIENT | 每次请求创建新实例 | 处理器、视图模型 |
| SCOPED | 同一作用域内共享实例 | Web请求上下文 |

### 服务描述符（Service Descriptor）

**定义：** 描述如何创建和管理服务实例的元数据对象。

**包含信息：**
- service_type: 服务类型
- implementation: 实现类或工厂函数
- lifetime: 生命周期
- dependencies: 依赖列表

### 循环依赖（Circular Dependency）

**定义：** 两个或多个服务相互依赖，形成环形引用，导致无限递归。

**示例：**

```python
# A 依赖 B，B 依赖 A
container.register_singleton(A, AImpl)  # AImpl 需要 B
container.register_singleton(B, BImpl)  # BImpl 需要 A
```

### 服务定位器（Service Locator）

**定义：** 全局访问点，通过静态方法获取容器中的服务实例。

**示例：**

```python
ServiceLocator.set_container(container)
cache = ServiceLocator.get(ICache)  # 静态方法获取
```

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [核心概念](./concepts.md)
- [使用指南](./usage.md)
