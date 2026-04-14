---
title: EventBus Celery 集成
description: EventBus 与 Celery Worker 生命周期集成模块
tag:
  - fqbase
  - event_bus_celery

summary:
  type: infrastructure
  complexity: low
  maturity: stable
  size: xs
  core_classes: []
  key_functions:
    - setup_event_bus
    - get_event_bus
    - clear_event_bus
    - _init_celery_signals

relationships:
  belongs_to:
    - fqbase.core
  depends_on:
    - fqbase.Core.event_bus
  used_by:
    - fqbase.celery_tasks
---

# EventBus Celery 集成

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [使用指南](./usage.md) → [案例库](./examples.md) |
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → [API参考](./api.md) → [最佳实践](./best-practices.md) |
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → [故障排查](./troubleshooting.md) |

## 一句话总览

📌 **EventBus 与 Celery Worker 生命周期集成**

**TL;DR**：
- 解决什么问题：在 Celery Worker 进程启动/关闭时自动初始化/清理 EventBus 实例
- 核心能力：自动初始化、生命周期管理、环境配置
- 入门难度：🟢 简单

**快速判断**：当您需要在 Celery 异步任务中使用事件总线时，使用本模块。

## 适用场景

✅ **推荐使用**：
- Celery 异步任务需要使用 EventBus
- 多 Worker 进程需要独立的事件总线实例
- 需要在 Worker 启动时初始化资源

❌ **不推荐使用**：
- 非 Celery 环境（使用 event_bus 即可）
- 不需要事件总线的简单任务

💡 **与其他模块的关系**：
- 依赖 [event_bus](./event_bus/README.md)（核心事件总线）
- 用于 Celery 任务中的事件发布/订阅

## 概述

EventBus Celery 集成模块提供 EventBus 与 Celery Worker 生命周期的自动集成：

- **自动初始化**：Worker 启动时自动创建 EventBus 实例
- **自动清理**：Worker 关闭时自动清理 EventBus 实例
- **手动控制**：支持禁用自动初始化，实现单进程模式

## 快速链接

| 文档 | 说明 |
|------|------|
| [快速入门](./quick-start.md) | 快速上手 |
| [API参考](./api.md) | API 文档 |
| [使用指南](./usage.md) | 详细用法 |
| [案例库](./examples.md) | 使用案例 |

## 相关文档

| 类型 | 文档 | 链接 |
|------|------|------|
| 项目首页 | FQBase 首页 | [README](../README.md) |
| 核心模块 | 事件总线 | [event_bus](./event_bus/README.md) |
