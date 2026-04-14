---
title: FQBase - 设计原则
description: FQBase 的设计原则与设计决策
tag:
  - fqbase
---

# FQBase - 设计原则

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → **[设计原则](./design.md)** → [API参考](./api.md) → [开发指南](./development.md) → [最佳实践](./best-practices.md) |
| 🟠 架构师 | [README](./README.md) → [技术架构](./architecture.md) → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) → **[设计原则](./design.md)** → [决策指南](./decision-guide.md) |

## 设计原则

| 原则 | 应用 |
|------|------|
| 单一职责 | 每个子模块只负责一个功能领域 |
| 开闭原则 | 对扩展开放，对修改封闭 |
| 依赖倒置 | 依赖抽象而非具体实现 |
| 迪米特法则 | 最小化模块间依赖 |

## 设计决策

### 决策 1: 单例模式作为默认

**上下文：** 需要全局共享状态的服务

**决策：** EventBus、Logger、NotificationManager 等核心服务采用单例模式

**后果：**
- 正面：简化组件获取，确保全局状态一致
- 负面：测试时需要模拟单例

### 决策 2: 装饰器模式实现重试

**上下文：** 需要为函数添加重试逻辑

**决策：** 使用装饰器模式实现 `@retry`

**后果：**
- 正面：非侵入式，无需修改原函数
- 负面：无法重试构造函数

### 决策 3: 适配器模式实现缓存

**上下文：** 需要支持多种缓存后端

**决策：** 使用适配器模式统一缓存接口

**后果：**
- 正面：轻松切换后端（Redis、内存等）
- 负面：需要适配器转换

## 使用的模式

| 模式 | 位置 | 用途 |
|------|------|------|
| 单例模式 | Core/event_bus.py | 全局事件总线 |
| 装饰器模式 | Foundation/retry.py | 重试机制 |
| 适配器模式 | Cache/*.py | 缓存后端 |
| 观察者模式 | Core/event_bus.py | 事件订阅 |

## 扩展点

| 扩展点 | 方法 | 描述 |
|--------|------|------|
| 自定义验证器 | Validator.register() | 注册自定义验证规则 |
| 自定义缓存后端 | CacheAdapter.register_backend() | 注册新的缓存后端 |
| 自定义通知渠道 | NotificationManager.register_channel() | 添加新通知渠道 |

## 相关文档

- [框架集成](./framework.md)
- [技术架构](./architecture.md)
- [最佳实践](./best-practices.md)
