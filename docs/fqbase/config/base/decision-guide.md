---
title: Base - 决策指南
description: Base 基础配置模块技术选型决策指南
tag:
  - fqbase
  - config
---

# Base - 决策指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟠 架构师 | [README](./README.md) → [技术架构](./architecture.md) → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) → **[决策指南](./decision-guide.md)** → [案例研究](./case-studies.md) → [数据流](./data-flow.md) |
| 📚 案例库 | **[案例库](./examples.md)** → [案例研究](./case-studies.md) → **[决策指南](./decision-guide.md)** → [数据流](./data-flow.md) → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) |

## 概述

帮助架构师判断何时使用 Base 模块以及如何选择的指南

## 决策树

```
需要配置管理吗？
    │
    ├── 是 ──▶ 需要 MongoDB 连接吗？
    │               │
    │               ├── 是 ──▶ Base 模块合适
    │               │
    │               └── 否 ──▶ 需要缓存吗？
    │                               │
    │                               ├── 是 ──▶ Base 模块合适
    │                               │
    │                               └── 否 ──▶ 只用 env 模块
    │
    └── 否 ──▶ 不需要 Base 模块
```

## 场景 1: 应用配置管理

### 问题

需要集中管理应用配置

### 选项

| 选项 | 优点 | 缺点 |
|------|------|------|
| 硬编码 | 简单 | 难以维护 |
| YAML 文件 | 易于编辑 | 需要解析 |
| Base 模块 | 统一管理、安全 | 需要依赖 |

### 决策

使用 Base 模块

### 理由

- 统一管理环境变量
- 支持敏感信息保护
- 提供缓存和监听功能

## 决策检查清单

在决定使用 Base 模块前，请检查：

- [ ] 需要管理 MongoDB 配置
- [ ] 需要管理缓存配置
- [ ] 需要监听配置变化
- [ ] 需要统一配置接口

如果以上大部分是"是"，Base 模块是一个好选择。

## 相关文档

- [技术架构](./architecture.md)
- [设计模式](./patterns.md)
- [技术权衡](./tradeoff.md)
- [案例研究](./case-studies.md)
- [数据流](./data-flow.md)
