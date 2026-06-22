---
title: Infrastructure - 设计原则
description: Infrastructure 设计原则和决策
tag:
  - fquant
  - fqbase
  - infrastructure

summary:
  purpose: design
---

# Infrastructure - 设计原则

## 阅读路径

🟠 **架构师**：README → design → patterns

## 核心设计原则

### 1. 底层独立原则

Infrastructure 是 FQBase 最底层，不依赖任何其他 FQBase 模块。

```
Infrastructure --> (无依赖)
```

### 2. 线程安全原则

所有基础设施组件必须线程安全。

| 组件 | 线程安全机制 |
|------|-------------|
| singleton | threading.Lock |
| logger | threading.Lock |
| CircuitBreaker | threading.RLock |
| ServiceContainer | threading.Lock |

### 3. 失败安全原则

基础设施组件在失败时不应导致整个系统崩溃。

| 组件 | 失败安全策略 |
|------|-------------|
| retry | 可配置最大重试次数和超时 |
| circuit_breaker | 熔断打开后快速失败 |
| logger | 降级到标准输出 |

## 设计决策记录

### 决策1：为什么使用元类实现单例？

**问题：** 为什么使用元类而不是装饰器或模块级变量？

**决策：** 元类方式更符合 Python 习惯，支持继承，实例存储在类变量中。

### 决策2：为什么熔断器使用状态机？

**问题：** 熔断器状态管理方式？

**决策：** 状态机模式清晰表达 CLOSED -> OPEN -> HALF_OPEN 的转换逻辑。

### 决策3：为什么重试装饰器支持多种策略？

**问题：** 固定延迟不够用吗？

**决策：** 不同场景需要不同策略：
- 固定延迟：简单场景
- 随机延迟：避免惊群效应
- 指数退避：给下游恢复时间

## 相关文档

- [架构](./architecture.md)
- [设计模式](./patterns.md)
