---
title: EventBus Celery 集成 - 核心概念
description: 深入理解 EventBus Celery 集成的核心概念
tag:
  - fqbase
  - event_bus_celery
---

# EventBus Celery 集成 - 核心概念

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [术语表](./glossary.md) → **[核心概念](./concepts.md)** |
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → **[核心概念](./concepts.md)** |

## 概念 1: Celery 信号机制

### 概念解释

Celery 提供信号机制（Signals），用于在 Worker 生命周期特定时刻执行自定义操作。

### 原理

```
Worker 启动流程:
    1. worker_process_init 信号触发
    2. 执行 @worker_process_init.connect 的函数
    3. Worker 开始执行任务

Worker 关闭流程:
    1. worker_shutdown 信号触发
    2. 执行 @worker_shutdown.connect 的函数
    3. Worker 进程退出
```

### 代码示例

```python
from celery.signals import worker_process_init, worker_shutdown

@worker_process_init.connect
def on_worker_init(**kwargs):
    print("Worker 初始化")
    setup_event_bus()

@worker_shutdown.connect
def on_worker_shutdown(**kwargs):
    print("Worker 关闭")
    clear_event_bus()
```

## 概念 2: 模块级初始化

### 概念解释

模块导入时自动执行初始化，检查 Celery 信号可用性并注册处理器。

### 原理

```
模块导入:
    │
    ▼
_init_celery_signals()
    │
    ├── 检查 FQ_CELERY_AUTO_INIT 环境变量
    │
    ├── 尝试导入 celery.signals
    │
    ├── 注册 worker_process_init 处理器
    │
    └── 注册 worker_shutdown 处理器
```

### 代码示例

```python
# 导入模块时自动初始化
from FQBase.Core.event_bus_celery import get_event_bus

# 在 Worker 中获取 EventBus
bus = get_event_bus()  # 此时 Worker 已初始化
```

## 概念 3: 进程隔离

### 概念解释

每个 Celery Worker 进程有独立的 EventBus 实例，实现进程隔离。

### 原理

```
Worker 进程 1:
    _event_bus_instance = EventBus()  # 独立实例

Worker 进程 2:
    _event_bus_instance = EventBus()  # 另一个独立实例
```

### 代码示例

```python
# 进程 1
bus1 = get_event_bus()
bus1.publish(Event('from_worker_1', 'data'))

# 进程 2
bus2 = get_event_bus()
# bus1 和 bus2 是不同的实例
```

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [使用指南](./usage.md)
