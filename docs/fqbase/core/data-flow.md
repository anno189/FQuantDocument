---
title: Core - 数据流
description: Core 基础设施核心层数据流动的详细说明
tag:
  - fqbase
  - core
---

# Core - 数据流

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟠 架构师 | [README](./README.md) → [技术架构](./architecture.md) → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) → [决策指南](./decision-guide.md) → [案例研究](./case-studies.md) → **[数据流](./data-flow.md)** |
| 📚 案例库 | **[案例库](./examples.md)** → [案例研究](./case-studies.md) → [决策指南](./decision-guide.md) → **[数据流](./data-flow.md)** → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) |


## 概述

本文档详细说明 Core 模块中数据的流动过程。

## 数据流图

### 完整数据流

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  业务逻辑 │────▶│ EventBus │────▶│ 订阅者1  │
└──────────┘     └──────────┘     └──────────┘
                       │
                       │ 事件分发
                       ▼
                 ┌──────────┐
                 │ 订阅者2  │
                 └──────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
   ┌──────────┐  ┌──────────┐  ┌──────────┐
   │  Logger  │  │Notifier 1│  │Notifier 2│
   └──────────┘  └──────────┘  └──────────┘
```

## 关键数据流

### 数据流 1: 事件驱动通知

```
业务逻辑 → EventBus.publish() → EventBus 分发 → 订阅者处理
                                              │
                                              ├──▶ Logger.info()
                                              │
                                              └──▶ Notification.send()
```

**描述：** 最常用的数据流模式，业务逻辑发布事件，EventBus 分发给订阅者，订阅者记录日志并发送通知。

### 数据流 2: Celery 任务监控

```
Celery Worker → 任务事件 → EventBus → 订阅者处理
                                      │
                                      ├──▶ Logger 记录
                                      │
                                      └──▶ Notification 告警
```

**描述：** EventBus Celery 组件拦截 Celery 任务事件并发布到 EventBus，订阅者处理并记录日志/发送通知。

## 子模块数据流索引

| 子模块 | 数据流说明 |
|--------|------------|
| event_bus | [data-flow](./event_bus/data-flow.md) |
| logger | [data-flow](./logger/data-flow.md) |
| notification | [data-flow](./notification/data-flow.md) |

## 性能考虑

### 瓶颈点

| 阶段 | 潜在瓶颈 | 优化建议 |
|------|---------|---------|
| 事件发布 | 同步分发阻塞 | 考虑异步分发 |
| 日志写入 | 同步写入慢 | 使用异步队列 |
| 通知发送 | 网络延迟 | 使用异步发送 |

### 优化策略

1. 大量订阅者时考虑异步分发
2. 日志使用异步队列
3. 通知使用线程池异步发送

## 相关文档

- [技术架构](./architecture.md)
- [设计模式](./patterns.md)
- [性能调优](./performance.md)
- [案例研究](./case-studies.md)
