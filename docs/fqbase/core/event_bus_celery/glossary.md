---
title: EventBus Celery 集成 - 术语表
description: EventBus Celery 集成模块术语定义
tag:
  - fqbase
  - event_bus_celery
---

# EventBus Celery 集成 - 术语表

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → **[术语表](./glossary.md)** → [核心概念](./concepts.md) |

## 术语

### Celery Worker

**定义：** Celery 的工作进程，负责执行异步任务

**示例：**

```bash
celery -A my_app worker --loglevel=info
```

### Worker 生命周期

**定义：** Worker 进程从启动到关闭的完整过程，包括初始化、执行任务、清理资源

### 自动初始化

**定义：** 模块自动在 Worker 启动时执行初始化操作的功能

### 单进程模式

**定义：** 禁用自动初始化，由开发者手动控制 EventBus 实例的模式

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [使用指南](./usage.md)
