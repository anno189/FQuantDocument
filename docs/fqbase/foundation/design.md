---
title: Foundation 模块 - 设计原则
description: Foundation 模块设计原则
tag:
  - fqbase
  - foundation
---

# Foundation 模块 - 设计原则

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟠 架构师 | [README](./README.md) → [技术架构](./architecture.md) → **[设计原则](./design.md)** |

## 子模块设计原则

| 子模块 | 设计原则 | 说明 |
|--------|----------|------|
| validators | [设计原则](./validators/design.md) | 输入验证 |
| exceptions | [设计原则](./exceptions/design.md) | 统一异常 |
| retry | [设计原则](./retry/design.md) | 重试装饰器 |
| dotty | [设计原则](./dotty/design.md) | 字典访问 |
| singleton | [设计原则](./singleton/design.md) | 单例模式 |
| lifecycle | [设计原则](./lifecycle/design.md) | 生命周期 |
| container | [设计原则](./container/design.md) | 依赖注入 |
| circuit_breaker | [设计原则](./circuit_breaker/design.md) | 熔断器 |

## 设计原则

### 1. 最小依赖

Foundation 模块尽量减少外部依赖，保持轻量级。

### 2. 清晰接口

所有组件提供清晰的接口定义，便于扩展和替换。

### 3. 线程安全

涉及并发操作的组件（如单例、容器）必须保证线程安全。

### 4. 错误处理

统一的异常体系，便于错误处理和调试。
