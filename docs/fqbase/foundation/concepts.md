---
title: Foundation 模块 - 核心概念
description: 深入理解 Foundation 核心概念
tag:
  - fqbase
  - foundation
---

# Foundation 模块 - 核心概念

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → **[核心概念](./concepts.md)** |

## 子模块核心概念

| 子模块 | 核心概念 | 说明 |
|--------|----------|------|
| validators | [核心概念](./validators/concepts.md) | 输入验证 |
| exceptions | [核心概念](./exceptions/concepts.md) | 统一异常 |
| retry | [核心概念](./retry/concepts.md) | 重试装饰器 |
| dotty | [核心概念](./dotty/concepts.md) | 字典访问 |
| singleton | [核心概念](./singleton/concepts.md) | 单例模式 |
| lifecycle | [核心概念](./lifecycle/concepts.md) | 生命周期 |
| container | [核心概念](./container/concepts.md) | 依赖注入 |
| circuit_breaker | [核心概念](./circuit_breaker/concepts.md) | 熔断器 |

## 概念 1: 设计模式

Foundation 提供多种设计模式实现：

- **单例模式** (singleton): 确保类只有一个实例
- **装饰器模式** (retry): 动态添加功能
- **代理模式** (dotty): 增强对象访问

## 概念 2: 依赖注入

**容器** (container) 提供依赖注入能力：

```python
container.register_singleton(ServiceInterface, ServiceImpl)
service = container.get(ServiceInterface)
```

## 概念 3: 熔断机制

**熔断器** (circuit_breaker) 提供故障隔离：

```
Closed (正常) → Open (熔断) → Half-Open (半开)
```
