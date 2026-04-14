---
title: Core - 决策指南
description: Core 基础设施核心层技术选型决策指南
tag:
  - fqbase
  - core
---

# Core - 决策指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟠 架构师 | [README](./README.md) → [技术架构](./architecture.md) → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) → **[决策指南](./decision-guide.md)** → [案例研究](./case-studies.md) → [数据流](./data-flow.md) |
| 📚 案例库 | [案例库](./examples.md) → [案例研究](./case-studies.md) → **[决策指南](./decision-guide.md)** → [数据流](./data-flow.md) → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) |


## 概述

帮助架构师判断何时使用 Core 模块以及如何选择的指南。

## 决策树

```
需要使用 Core 吗？
    │
    ├── [是否需要事件驱动架构？]
    │       │
    │       ├── 是 ──▶ [是否需要统一日志？]
    │       │               │
    │       │               ├── 是 ──▶ Core 是好选择
    │       │               │
    │       │               └── 否 ──▶ 考虑只使用 event_bus
    │       │
    │       └── 否 ───▶ [是否需要通知功能？]
    │                       │
    │                       ├── 是 ──▶ 考虑只使用 notification
    │                       │
    │                       └── 否 ──▶ 不需要 Core
    │
    └── [是否需要组合多个基础设施功能？]
            │
            ├── 是 ──▶ Core 是好选择（聚合层）
            │
            └── 否 ──▶ 直接使用需要的子模块
```

## 场景 1: 事件驱动通知系统

### 问题

需要构建一个事件驱动的通知系统。

### 选项

| 选项 | 优点 | 缺点 |
|------|------|------|
| 使用 Core | 统一入口，组合使用 | 导入较多 |
| 单独使用子模块 | 按需使用 | 需要手动组合 |

### 决策

推荐使用 Core，提供统一的 API 入口和预置的组合模式。

## 反模式警示

### 错误示例

在同一个应用中混用不同的事件总线实例。

```python
# 错误：每次调用都创建新实例
event_bus1 = EventBus()
event_bus2 = EventBus()  # 与 event_bus1 不同！
```

### 正确做法

使用单例获取 EventBus：

```python
# 正确：使用单例
event_bus = get_event_bus()
```

## 决策检查清单

在决定使用 Core 前，请检查：

- [ ] 需要事件驱动功能
- [ ] 需要日志记录功能
- [ ] 需要通知推送功能
- [ ] 需要组合使用多个功能
- [ ] 需要统一的应用入口

如果以上大部分是"是"，Core 是一个好选择。

## 相关文档

- [技术架构](./architecture.md)
- [设计模式](./patterns.md)
- [技术权衡](./tradeoff.md)
- [案例研究](./case-studies.md)
- [数据流](./data-flow.md)
