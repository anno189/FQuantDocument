---
title: 事件总线 - 使用指南
description: 事件总线详细使用指南
tag:
  - fqbase
  - event_bus
---

# 事件总线 - 使用指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [速查表](./cheatsheet.md) → [动手实验室](./workshop.md) → **[使用指南](./usage.md)** → [案例库](./examples.md) |
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → [设计原则](./design.md) → [API参考](./api.md) → [开发指南](./development.md) → **[使用指南](./usage.md)** → [最佳实践](./best-practices.md) |


## 概述

本指南详细介绍事件总线的各种使用方式，帮助您有效地在项目中集成和使用事件总线。

## 基本用法

### 安装

事件总线是 FQBase 的内置模块：

```bash
pip install FQBase
```

### 快速开始

```python
from FQBase.Core.event_bus import EventBus, Event, get_event_bus

# 获取事件总线单例（推荐方式）
bus = get_event_bus()

# 定义事件处理函数
def on_price_update(event):
    print(f"价格更新: {event.data}")

# 订阅事件
bus.subscribe('price_update', on_price_update)

# 发布事件
bus.publish(Event('price_update', {'symbol': 'AAPL', 'price': 150.0}))
# 输出: 价格更新: {'symbol': 'AAPL', 'price': 150.0}
```

## 常见用例

### 用例 1：模块间通信

**场景：** 两个独立模块需要通信，但不希望直接依赖

**代码：**

```python
# 模块 A：数据源
from FQBase.Core.event_bus import get_event_bus, Event

bus = get_event_bus()

def fetch_market_data():
    # 模拟获取数据
    data = {'symbol': 'AAPL', 'price': 150.0}
    # 发布事件通知数据更新
    bus.publish(Event('market_data', data))

# 模块 B：数据消费者
def on_market_data(event):
    print(f"接收数据: {event.data}")

bus.subscribe('market_data', on_market_data)

# 运行时
fetch_market_data()  # 输出: 接收数据: {'symbol': 'AAPL', 'price': 150.0}
```

### 用例 2：策略信号分发

**场景：** 一个策略产生信号，多个下游模块需要接收

**代码：**

```python
bus = get_event_bus()

# 交易执行模块
def execute_trade(event):
    order = event.data
    print(f"执行交易: {order}")

# 风险控制模块
def check_risk(event):
    signal = event.data
    print(f"风险检查: {signal}")

# 通知模块
def send_notification(event):
    signal = event.data
    print(f"发送通知: {signal}")

# 按优先级订阅
bus.subscribe('signal', execute_trade, priority=100)  # 先执行交易
bus.subscribe('signal', check_risk, priority=50)       # 再检查风险
bus.subscribe('signal', send_notification, priority=10)  # 最后发送通知

# 发布信号
bus.publish(Event('signal', {'symbol': 'AAPL', 'action': 'BUY', 'price': 150}))
# 输出:
# 执行交易: {'symbol': 'AAPL', 'action': 'BUY', 'price': 150}
# 风险检查: {'symbol': 'AAPL', 'action': 'BUY', 'price': 150}
# 发送通知: {'symbol': 'AAPL', 'action': 'BUY', 'price': 150}
```

### 用例 3：全局事件监听

**场景：** 需要监听所有事件进行日志记录或审计

**代码：**

```python
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

def audit_handler(event):
    """审计所有事件"""
    logger.info(f"[AUDIT] {datetime.now()} - {event.event_type}: {event.data}")

bus = get_event_bus()

# 全局订阅
bus.subscribe_global(audit_handler, priority=-1)  # 低优先级，最后执行

# 后续任何事件发布都会被记录
bus.publish(Event('trade', {'id': '1', 'amount': 10000}))
bus.publish(Event('price_update', {'symbol': 'AAPL'}))
```

### 用例 4：异步事件处理

**场景：** 事件处理是计算密集型或 I/O 密集型，需要异步执行

**代码：**

```python
import asyncio

bus = get_event_bus()

async def async_handler(event):
    """异步处理函数"""
    await asyncio.sleep(1)  # 模拟异步操作
    print(f"异步处理完成: {event.data}")

# 订阅异步处理函数
bus.subscribe('heavy_task', async_handler)

async def main():
    # 使用 publishAwait 发布
    await bus.publishAwait(Event('heavy_task', 'data'))
    print("主流程继续执行")

asyncio.run(main())
# 输出: 
# 主流程继续执行
# 异步处理完成: data
```

### 用例 5：使用上下文管理器

**代码：**

```python
from FQBase.Core.event_bus import EventBusContext

with EventBusContext() as bus:
    bus.subscribe('event', lambda e: print(e.data))
    bus.publish(Event('event', 'Hello from context'))
# with 块结束后，bus 自动清理
```

## 事件历史

### 查看事件历史

```python
bus = get_event_bus()

# 发布一些事件
for i in range(10):
    bus.publish(Event('counter', {'value': i}))

# 获取所有历史
history = bus.get_history()
print(f"历史记录数: {len(history)}")

# 获取特定类型历史
counter_events = bus.get_history(event_type='counter', limit=5)
for e in counter_events:
    print(e.data)
```

### 限制历史记录大小

```python
# 创建带自定义容量的 EventBus
bus = EventBus(max_history=50)  # 最多保留 50 条

# 后续发布超过 50 条后，只会保留最近 50 条
for i in range(100):
    bus.publish(Event('test', {'i': i}))

print(bus.get_history().__len__())  # 50
```

## 订阅管理

### 取消订阅

```python
def handler(event):
    print(event.data)

# 订阅
sub_id = bus.subscribe('event', handler)

# 取消订阅（通过回调）
bus.unsubscribe('event', handler)

# 或通过订阅 ID
bus.unsubscribe_by_id(sub_id)
```

### 手动清理

```python
# 手动清理失效的订阅者
cleaned_count = bus.cleanup()
print(f"清理了 {cleaned_count} 个失效订阅者")
```

## 错误处理

```python
from FQBase.Core.event_bus import get_event_bus, Event

bus = get_event_bus()

def error_prone_handler(event):
    raise ValueError("模拟错误")

def safe_handler(event):
    print(f"安全处理: {event.data}")

# 错误处理函数不会中断其他订阅者
bus.subscribe('event', error_prone_handler)
bus.subscribe('event', safe_handler)

bus.publish(Event('event', 'test'))
# 输出: 安全处理: test
# 错误会在日志中记录警告
```

## 配置

### 配置线程池大小

```python
import os

# 设置事件总线工作线程数
os.environ['FQ_EVENTBUS_WORKERS'] = '8'

# 需要在导入 FQBase 之前设置
from FQBase.Core.event_bus import get_event_bus

bus = get_event_bus()
# 现在使用 8 个工作线程
```

### Celery 集成配置

```python
import os

# 禁用 Celery 自动初始化
os.environ['FQ_CELERY_AUTO_INIT'] = 'false'

# 需要在导入 event_bus_celery 之前设置
from FQBase.Core.event_bus_celery import setup_event_bus

# 手动初始化
bus = setup_event_bus()
```

## 相关文档

- [API参考](./api.md)
- [开发指南](./development.md)
- [最佳实践](./best-practices.md)
