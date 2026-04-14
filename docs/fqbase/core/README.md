---
title: Core - 基础设施核心层
description: FQBase 基础设施核心组件的聚合层，提供事件总线、日志系统和通知服务
tag:
  - fqbase
  - core

summary:
  type: container
  complexity: medium
  maturity: stable
  size: m
  sub_modules:
    - event_bus
    - event_bus_celery
    - logger
    - notification
    - notification_template
  # ⚠️ AI 开发必需信息
  usage_scenarios:
    - "需要事件驱动架构时使用 event_bus"
    - "需要统一日志记录时使用 logger"
    - "需要发送通知时使用 notification"
  warnings:
    - "event_bus 是同步的，Celery版本是异步"
    - "日志级别配置需注意"
  limitations:
    - "event_bus 不支持异步"

relationships:
  belongs_to:
    - fquant.fqbase
  contains:
    - fquant.fqbase.core.event_bus
    - fquant.fqbase.core.event_bus_celery
    - fquant.fqbase.core.logger
    - fquant.fqbase.core.notification
    - fquant.fqbase.core.notification_template
  used_by:
    - fquant.fqdata
    - fquant.fqfactor
---

# Core - 基础设施核心层

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [子模块文档] → [案例库](./examples.md) |
| 🔵 开发者 | [README](./README.md) → [技术架构](./architecture.md) → [API参考](./api.md) → [子模块文档] |
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) |
| 🟠 架构师 | [README](./README.md) → [技术架构](./architecture.md) → [设计模式](./patterns.md) → [数据流](./data-flow.md) |
| 📚 案例库 | **[案例库](./examples.md)** → [跨模块集成示例](./examples.md#跨模块集成) |
| 📖 索引 | [README](./README.md) → [变更日志](./changelog.md) |


## 一句话总览

📌 **FQuant 基础设施核心组件聚合层**

**TL;DR**：
- 功能：提供事件驱动、日志记录、通知推送等基础设施能力
- 包含：5 个核心子模块
- 定位：FQuant 系统的基础设施层，所有业务模块依赖的核心服务

## 子模块概览

本模块是一个**容器模块**，聚合了以下核心子模块：

| 子模块 | 说明 | 文档级别 | 文档链接 |
|--------|------|---------|----------|
| [event_bus](./event_bus/) | 事件总线（发布-订阅模式） | L3 完整 | [README](./event_bus/README.md) |
| [event_bus_celery](./event_bus_celery/) | EventBus 与 Celery Worker 生命周期集成 | L1 基础 | [README](./event_bus_celery/README.md) |
| [logger](./logger/) | 统一日志系统 | L2 标准 | [README](./logger/README.md) |
| [notification](./notification/) | 通知服务（企业微信、Server酱、PushBear） | L2 标准 | [README](./notification/README.md) |
| [notification_template](./notification_template/) | 通知消息模板 | L1 基础 | [README](./notification_template/README.md) |

## 架构图

```
┌─────────────────────────────────────────────┐
│              Core 基础设施核心层               │
├─────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐          │
│  │  event_bus  │  │   logger    │          │
│  │  事件总线    │  │   日志系统   │          │
│  └──────┬──────┘  └──────┬──────┘          │
│         │                │                  │
│  ┌──────┴──────┐  ┌──────┴──────┐          │
│  │event_bus_   │  │ notification │          │
│  │ celery      │  │   通知服务   │          │
│  └─────────────┘  └──────┬──────┘          │
│                          │                  │
│                 ┌────────┴────────┐          │
│                 │notification_   │          │
│                 │  template      │          │
│                 │   通知模板     │          │
│                 └────────────────┘          │
│                     │                        │
│            ┌────────┴────────┐                │
│            │   聚合层 API   │                │
│            │  (__init__.py)│                │
│            └────────────────┘                │
└─────────────────────────────────────────────┘
```

## 快速开始

### 安装

```bash
pip install fquant-base
```

### 组合使用示例

```python
# 组合使用多个子模块
from FQBase.Core import (
    get_event_bus,
    get_logger,
    NotificationManager,
    Event,
)

# 初始化各个组件
event_bus = get_event_bus()
logger = get_logger('my_app')
notifier = NotificationManager()

# 事件驱动 + 日志 + 通知 的完整流程
@event_bus.subscribe('task_completed')
def on_task_completed(event):
    logger.info(f"任务完成: {event.data}")
    notifier.send(f"任务完成: {event.data}", channel='SYSTEM')

event_bus.publish(Event('task_completed', {'task_id': 123}))
```

## 跨模块场景

### 场景 1: 事件驱动通知系统

**场景描述：** 当某个事件发生时，自动记录日志并发送通知

**涉及子模块：**
- [event_bus](./event_bus/) - 事件驱动
- [logger](./logger/) - 日志记录
- [notification](./notification/) - 通知推送

**代码示例：**

```python
from FQBase.Core import (
    get_event_bus,
    get_logger,
    NotificationManager,
    Event,
)

# 初始化
event_bus = get_event_bus()
logger = get_logger('trading')
notifier = NotificationManager()

# 订阅交易信号事件
@event_bus.subscribe('trade_signal')
def handle_trade_signal(event):
    signal_data = event.data
    # 记录日志
    logger.info(f"交易信号: {signal_data}")
    # 发送通知
    notifier.send(
        f"交易信号: {signal_data['type']} - 价格: {signal_data['price']}",
        channel='WECOM'
    )

# 发布事件
event_bus.publish(Event('trade_signal', {
    'type': 'BUY',
    'code': '000001',
    'price': 12.50
}))
```

### 场景 2: Celery 异步任务监控

**场景描述：** 监控 Celery 异步任务的执行状态，任务完成后记录日志并通知

**涉及子模块：**
- [event_bus](./event_bus/) - 事件总线
- [event_bus_celery](./event_bus_celery/) - Celery 集成
- [logger](./logger/) - 日志记录
- [notification](./notification/) - 通知推送

**代码示例：**

```python
from FQBase.Core import (
    setup_event_bus,
    clear_event_bus,
    get_logger,
    NotificationManager,
)
from celery import Celery

# 初始化
app = Celery('tasks')
event_bus = setup_event_bus(app)
logger = get_logger('tasks')
notifier = NotificationManager()

# 任务完成后自动通知
@event_bus.subscribe('task_success')
def on_task_success(event):
    logger.info(f"任务完成: {event.data['task_id']}")
    notifier.send(f"任务 {event.data['task_id']} 已完成", channel='SYSTEM')

# 清理
clear_event_bus()
```

## 快速链接

| 文档 | 说明 |
|------|------|
| [技术架构](./architecture.md) | 子模块架构与关系 |
| [API参考](./api.md) | 跨模块组合 API |
| [案例库](./examples.md) | 跨模块集成示例 |
| [变更日志](./changelog.md) | 各子模块变更汇总 |
| [事件总线](./event_bus/) | 事件驱动核心 |
| [日志系统](./logger/) | 统一日志服务 |
| [通知服务](./notification/) | 多通道通知 |

## 相关文档

| 类型 | 文档 | 链接 |
|------|------|------|
| 项目首页 | FQBase 首页 | [README](../README.md) |
| 子模块 | 事件总线 | [event_bus README](./event_bus/README.md) |
| 子模块 | Celery 集成 | [event_bus_celery README](./event_bus_celery/README.md) |
| 子模块 | 日志系统 | [logger README](./logger/README.md) |
| 子模块 | 通知服务 | [notification README](./notification/README.md) |
| 子模块 | 通知模板 | [notification_template README](./notification_template/README.md) |
