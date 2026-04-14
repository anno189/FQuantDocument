---
title: Core - 快速入门
description: 5分钟快速上手 Core 基础设施核心层
tag:
  - fqbase
  - core

summary:
  purpose: quick-start
  complexity: low
---

# Core - 快速入门

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → **[快速入门](./quick-start.md)** → [子模块文档] → [案例库](./examples.md) |


## 概述

5分钟快速上手 Core 基础设施核心层，学习如何组合使用事件总线、日志系统和通知服务。

## 前置要求

- Python 3.8+
- pip

## 安装

```bash
pip install fquant-base
```

## 5分钟上手

### Step 1: 导入核心组件

```python
from FQBase.Core import (
    get_event_bus,
    get_logger,
    NotificationManager,
    Event,
)
```

### Step 2: 初始化组件

```python
event_bus = get_event_bus()
logger = get_logger('my_app')
notifier = NotificationManager()
```

### Step 3: 使用事件总线

```python
# 订阅事件
@event_bus.subscribe('data_update')
def handle_update(event):
    print(f"收到更新: {event.data}")

# 发布事件
event_bus.publish(Event('data_update', {'key': 'value'}))
```

### Step 4: 使用日志

```python
logger.info('应用启动')
logger.debug('调试信息')
logger.warning('警告信息')
logger.error('错误信息')
```

### Step 5: 发送通知

```python
notifier.send('任务完成', channel='SYSTEM')
```

### Step 6: 组合使用

```python
# 完整示例：事件驱动 + 日志 + 通知
@event_bus.subscribe('task_done')
def on_task_done(event):
    logger.info(f"任务完成: {event.data}")
    notifier.send(f"任务 {event.data} 已完成", channel='SYSTEM')

event_bus.publish(Event('task_done', '数据处理'))
```

### 完成！

恭喜！你已经学会了 Core 基础设施核心层的基本用法。

## ⚠️ 常见陷阱

1. **陷阱 1：EventBus 单例未正确获取**
   - ❌ 错误做法：每次都创建新的 EventBus 实例
   - ✅ 正确做法：使用 `get_event_bus()` 获取单例

2. **陷阱 2：事件订阅在发布之后**
   - ❌ 错误做法：先发布事件，再订阅
   - ✅ 正确做法：先订阅，再发布事件

## 下一步

- 学习 [核心概念](./concepts.md)
- 阅读 [技术架构](./architecture.md)
- 查看 [子模块文档](./event_bus/README.md)
- 学习 [跨模块组合](./api.md)

## 相关文档

- [README](./README.md)
- [技术架构](./architecture.md)
- [API参考](./api.md)
- [event_bus 子模块](./event_bus/)
