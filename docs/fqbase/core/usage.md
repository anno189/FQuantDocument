---
title: Core - 使用指南
description: Core 基础设施核心层详细使用指南
tag:
  - fqbase
  - core
---

# Core - 使用指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [使用指南](./usage.md) → [案例库](./examples.md) |
| 🔵 开发者 | [README](./README.md) → [技术架构](./architecture.md) → [API参考](./api.md) → **[使用指南](./usage.md)** → [最佳实践](./best-practices.md) |


## 概述

本文档详细介绍如何有效地使用 Core 模块，包括基本用法、常见用例和最佳实践。

## 基本用法

### 安装

```bash
pip install fquant-base
```

### 快速开始

```python
from FQBase.Core import (
    get_event_bus,
    get_logger,
    NotificationManager,
    Event,
)

# 初始化
event_bus = get_event_bus()
logger = get_logger('app')
notifier = NotificationManager()

# 组合使用
@event_bus.subscribe('update')
def handle_update(event):
    logger.info(f"更新: {event.data}")
    notifier.send(f"更新: {event.data}", channel='SYSTEM')

event_bus.publish(Event('update', {'status': 'done'}))
```

## 常见用例

### 用例 1: 事件驱动通知

**场景：** 当数据更新时，自动记录日志并发送通知

**代码：**

```python
from FQBase.Core import (
    get_event_bus,
    get_logger,
    NotificationManager,
    Event,
)

event_bus = get_event_bus()
logger = get_logger('data_sync')
notifier = NotificationManager()

@event_bus.subscribe('data_sync_complete')
def on_sync_complete(event):
    data = event.data
    logger.info(f"数据同步完成: {data['record_count']} 条记录")
    notifier.send(
        f"数据同步完成，共 {data['record_count']} 条记录",
        channel='WECOM'
    )

event_bus.publish(Event('data_sync_complete', {'record_count': 1000}))
```

### 用例 2: 交易信号推送

**场景：** 策略产生交易信号时，记录日志并通过多渠道通知

**代码：**

```python
from FQBase.Core import (
    get_event_bus,
    get_logger,
    NotificationManager,
    Event,
)

event_bus = get_event_bus()
logger = get_logger('strategy')
notifier = NotificationManager()

@event_bus.subscribe('trade_signal')
def on_trade_signal(event):
    signal = event.data
    logger.info(f"交易信号: {signal}")
    notifier.send(
        f"{signal['direction']} {signal['code']} @ {signal['price']}",
        channel='WECOM'
    )

event_bus.publish(Event('trade_signal', {
    'direction': 'BUY',
    'code': '000001',
    'price': 12.50
}))
```

### 用例 3: 异常告警

**场景：** 捕获异常，记录日志并发送告警

**代码：**

```python
from FQBase.Core import (
    get_logger,
    NotificationManager,
)

logger = get_logger('monitor')
notifier = NotificationManager()

def process_data(data):
    try:
        result = risky_operation(data)
        logger.info(f"处理成功: {result}")
        return result
    except Exception as e:
        logger.error(f"处理失败: {e}")
        notifier.send(f"处理失败: {str(e)}", channel='WECOM')
        raise
```

## 配置

### 初始化日志系统

```python
from FQBase.Core import init_logging

init_logging(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    log_dir='logs'
)
```

### 配置通知渠道

```python
from FQBase.Core import NotificationManager, WECOM_CHANNELS

notifier = NotificationManager(
    wecom_corp_id='your_corp_id',
    wecom_secret='your_secret',
    wecom_agent_id='your_agent_id'
)
```

## 错误处理

```python
from FQBase.Core import get_logger

logger = get_logger('app')

try:
    event_bus.publish(Event('test', {'data': 'value'}))
except Exception as e:
    logger.error(f"发布事件失败: {e}")
```

## 相关文档

- [API参考](./api.md)
- [技术架构](./architecture.md)
- [最佳实践](./best-practices.md)
- [案例库](./examples.md)
- [event_bus 子模块](./event_bus/)
- [logger 子模块](./logger/)
- [notification 子模块](./notification/)
