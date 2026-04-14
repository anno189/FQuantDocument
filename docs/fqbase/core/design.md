---
title: Core - 设计原则
description: Core 基础设施核心层的设计原则与设计决策
tag:
  - fqbase
  - core
---

# Core - 设计原则

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → **[设计原则](./design.md)** → [API参考](./api.md) → [开发指南](./development.md) → [最佳实践](./best-practices.md) |
| 🟠 架构师 | [README](./README.md) → [技术架构](./architecture.md) → [设计模式](./patterns.md) → **[设计原则](./design.md)** → [决策指南](./decision-guide.md) |


## 设计原则

| 原则 | 应用 |
|------|------|
| 单一职责 | 每个子模块专注做好一件事 |
| 开放封闭 | 扩展新的通知渠道无需修改核心代码 |
| 依赖倒置 | 上层模块依赖抽象接口，不依赖具体实现 |
| 接口隔离 | 各组件提供最小必要接口 |

## 设计决策

### 决策 1: 使用单例模式的 EventBus

**上下文：** 事件总线需要在整个应用中共享

**决策：** 使用单例模式，通过 `get_event_bus()` 获取实例

**后果：**
- 正面：确保全局唯一，简化状态管理
- 负面：测试时需要模拟单例

### 决策 2: 统一的通知接口

**上下文：** 支持多种通知渠道但需要统一的发送接口

**决策：** 定义 `NotificationManager` 统一接口

**后果：**
- 正面：切换渠道无需修改业务代码
- 负面：部分渠道的特殊功能可能被忽略

## 扩展点

| 扩展点 | 方法 | 描述 |
|--------|------|------|
| 新通知渠道 | 继承通知类 | 添加新的通知渠道 |
| 新事件处理 | 订阅事件 | 自定义事件处理逻辑 |
| 日志输出 | 添加 Handler | 自定义日志输出目标 |

## 相关文档

- [框架集成](./framework.md)
- [技术架构](./architecture.md)
- [最佳实践](./best-practices.md)
- [event_bus 子模块](./event_bus/)
- [logger 子模块](./logger/)
- [notification 子模块](./notification/)
