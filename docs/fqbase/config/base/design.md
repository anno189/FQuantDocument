---
title: Base - 设计原则
description: Base 基础配置模块的设计原则与设计决策
tag:
  - fqbase
  - config
---

# Base - 设计原则

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → **[设计原则](./design.md)** → [API参考](./api.md) → [开发指南](./development.md) → [最佳实践](./best-practices.md) |
| 🟠 架构师 | [README](./README.md) → [技术架构](./architecture.md) → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) → **[设计原则](./design.md)** → [决策指南](./decision-guide.md) |

## 设计原则

| 原则 | 应用 |
|------|------|
| 单一职责 | 每个模块只负责一项配置 |
| 最小惊讶 | 配置行为符合预期 |
| 依赖倒置 | 依赖抽象而非具体 |

## 设计决策

### 决策 1: 单例模式

**上下文：** 全局配置需要唯一实例

**决策：** 使用单例模式

**后果：**
- 正面：确保全局唯一，避免重复初始化
- 负面：难以测试，需要 mock

## 扩展点

| 扩展点 | 方法 | 描述 |
|--------|------|------|
| 自定义配置源 | 实现 ConfigLoader | 添加新的配置来源 |
| 自定义缓存 | 实现 CacheBackend | 添加新的缓存后端 |

## 相关文档

- [框架集成](./framework.md)
- [技术架构](./architecture.md)
- [最佳实践](./best-practices.md)
