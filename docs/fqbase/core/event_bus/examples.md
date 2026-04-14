---
title: 事件总线 - 案例库
description: 事件总线实际应用场景与示例
tag:
  - fqbase
  - event_bus
---

# 事件总线 - 案例库

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [速查表](./cheatsheet.md) → [动手实验室](./workshop.md) → [使用指南](./usage.md) → **[案例库](./examples.md)** |
| 📚 案例库 | **[案例库](./examples.md)** → [案例研究](./case-studies.md) → [决策指南](./decision-guide.md) → [数据流](./data-flow.md) → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) |


## 概述

本文档展示事件总线的实际应用场景和完整示例，帮助您理解如何在实际项目中使用事件总线。

## 示例 1：实时价格更新推送

### 场景描述

在量化交易系统中，市场数据服务获取到新的价格后，需要实时推送给多个订阅者（如图表组件、风控模块、交易执行模块）。

### 代码实现

```python
from FQBase.Core.event_bus import get_event_bus, Event
from datetime import datetime

bus = get_event_bus()

class ChartComponent:
    """图表组件"""
    def __init__(self, symbol):
        self.symbol = symbol
        self.price = None
        
    def on_price_update(self, event):
        self.price = event.data['price']
        print(f"[图表] {self.symbol} 价格更新: {self.price}")

class RiskManager:
    """风控模块"""
    def __init__(self, symbol):
        self.symbol = symbol
        
    def on_price_update(self, event):
        price = event.data['price']
        # 简单风控：价格超过阈值则预警
        if price > 200:
            print(f"[风控] {self.symbol} 价格异常: {price}")

class TradingExecutor:
    """交易执行模块"""
    def __init__(self, symbol):
        self.symbol = symbol
        
    def on_price_update(self, event):
        price = event.data['price']
        print(f"[交易] {self.symbol} 当前价格: {price}")

# 创建组件实例
chart = ChartComponent('AAPL')
risk_mgr = RiskManager('AAPL')
executor = TradingExecutor('AAPL')

# 订阅价格更新事件
bus.subscribe('price_update', chart.on_price_update, priority=10)
bus.subscribe('price_update', risk_mgr.on_price_update, priority=50)
bus.subscribe('price_update', executor.on_price_update, priority=100)

# 模拟市场数据服务推送价格
def on_market_data(data):
    bus.publish(Event('price_update', data))

# 推送价格更新
on_market_data({'symbol': 'AAPL', 'price': 150.0})
on_market_data({'symbol': 'AAPL', 'price': 155.0})
on_market_data({'symbol': 'AAPL', 'price': 205.0})  # 触发风控

# 输出:
# [交易] AAPL 当前价格: 150.0
# [图表] AAPL 价格更新: 150.0
# [风控] AAPL 价格异常: 155.0
# [交易] AAPL 当前价格: 155.0
# [图表] AAPL 价格更新: 155.0
# [交易] AAPL 当前价格: 205.0
# [图表] AAPL 价格更新: 205.0
# [风控] AAPL AAPL 价格异常: 205.0
```

### 适用场景

- 实时数据推送
- 多模块数据同步
- 事件驱动的数据流

---

## 示例 2：异步任务通知系统

### 场景描述

在后台任务处理系统中，任务完成后需要异步通知多个下游系统（如结果存储、通知用户、触发下游任务）。

### 代码实现

```python
import asyncio
from FQBase.Core.event_bus import get_event_bus, Event

bus = get_event_bus()

class ResultStorage:
    """结果存储"""
    async def on_task_complete(self, event):
        task_id = event.data['task_id']
        result = event.data['result']
        # 模拟异步存储
        await asyncio.sleep(0.1)
        print(f"[存储] 任务 {task_id} 结果已保存: {result}")

class NotificationService:
    """通知服务"""
    async def on_task_complete(self, event):
        task_id = event.data['task_id']
        user_id = event.data['user_id']
        # 模拟发送通知
        await asyncio.sleep(0.1)
        print(f"[通知] 用户 {user_id}: 任务 {task_id} 已完成")

class TaskChain:
    """任务链"""
    async def on_task_complete(self, event):
        task_id = event.data['task_id']
        next_task = event.data.get('next_task')
        if next_task:
            print(f"[任务链] 触发下游任务: {next_task}")
            # 可以发布新的事件触发下游任务

# 创建服务实例
storage = ResultStorage()
notifier = NotificationService()
chain = TaskChain()

# 订阅任务完成事件
bus.subscribe('task_complete', storage.on_task_complete, priority=10)
bus.subscribe('task_complete', notifier.on_task_complete, priority=20)
bus.subscribe('task_complete', chain.on_task_complete, priority=30)

# 模拟异步任务完成
async def simulate_task():
    await bus.publishAwait(Event('task_complete', {
        'task_id': 'TASK-001',
        'user_id': 'USER-123',
        'result': 'SUCCESS',
        'next_task': 'TASK-002'
    }))

asyncio.run(simulate_task())

# 输出:
# [任务链] 触发下游任务: TASK-002
# [存储] 任务 TASK-001 结果已保存: SUCCESS
# [通知] 用户 USER-123: 任务 TASK-001 已完成
```

### 适用场景

- 异步任务通知
- 微服务间通信
- 事件驱动的任务链

---

## 示例 3：全局日志与审计

### 场景描述

需要记录系统中所有重要事件，用于审计和问题排查。

### 代码实现

```python
from FQBase.Core.event_bus import get_event_bus, Event
from datetime import datetime
import json

bus = get_event_bus()

class AuditLogger:
    """审计日志器"""
    def __init__(self, log_file='audit.log'):
        self.log_file = log_file
        
    def on_any_event(self, event):
        log_entry = {
            'timestamp': event.timestamp.isoformat(),
            'event_type': event.event_type,
            'data': event.data
        }
        # 实际项目中写入文件
        print(f"[审计] {json.dumps(log_entry)}")

class ErrorTracker:
    """错误追踪"""
    def __init__(self):
        self.error_count = 0
        
    def on_any_event(self, event):
        # 检查是否是错误相关事件
        if 'error' in event.event_type.lower() or \
           (isinstance(event.data, dict) and event.data.get('status') == 'error'):
            self.error_count += 1
            print(f"[错误追踪] 检测到错误: {event.event_type}")

# 创建审计组件
audit = AuditLogger()
tracker = ErrorTracker()

# 全局订阅所有事件
bus.subscribe_global(audit.on_any_event, priority=-100)  # 低优先级
bus.subscribe_global(tracker.on_any_event, priority=-50)

# 模拟各种业务事件
bus.publish(Event('user_login', {'user_id': 'U001', 'ip': '192.168.1.1'}))
bus.publish(Event('trade_executed', {'order_id': 'O001', 'amount': 10000}))
bus.publish(Event('data_fetch', {'source': 'API', 'status': 'success'}))
bus.publish(Event('task_failed', {'task_id': 'T001', 'error': 'Timeout'}))
bus.publish(Event('config_updated', {'key': 'threshold', 'old': 100, 'new': 200}))

print(f"\n总共错误数: {tracker.error_count}")

# 输出:
# [审计] {"timestamp": "2024-01-15T10:30:00", "event_type": "user_login", ...}
# [审计] {"timestamp": "2024-01-15T10:30:01", "event_type": "trade_executed", ...}
# ...
# [错误追踪] 检测到错误: task_failed
# 总共错误数: 1
```

### 适用场景

- 审计日志
- 系统监控
- 错误追踪

---

## 示例 4：事件回溯与调试

### 场景描述

在调试阶段，需要查看事件历史，了解事件发布的时序和内容。

### 代码实现

```python
from FQBase.Core.event_bus import get_event_bus, Event

bus = get_event_bus()

# 订阅并处理事件
def handler(event):
    print(f"处理: {event.event_type}")

bus.subscribe('step1', handler)
bus.subscribe('step2', handler)
bus.subscribe('step3', handler)

# 发布一系列事件
bus.publish(Event('step1', {'order': 1}))
bus.publish(Event('step2', {'order': 2}))
bus.publish(Event('step3', {'order': 3}))

# 查看事件历史
print("\n=== 事件历史 ===")
history = bus.get_history()
for e in history:
    print(f"{e.timestamp.strftime('%H:%M:%S.%f')} | {e.event_type:10} | {e.data}")

# 按类型过滤
print("\n=== step2 事件 ===")
step2_events = bus.get_history(event_type='step2', limit=10)
for e in step2_events:
    print(e.data)

# 获取订阅者信息
print("\n=== 订阅者列表 ===")
subscribers = bus.get_subscribers()
for sub in subscribers:
    print(f"ID: {sub['id']}, 类型: {sub['event_type']}, 优先级: {sub['priority']}")
```

### 适用场景

- 调试和问题排查
- 事件时序分析
- 系统行为回溯

---

## 常见应用模式

### 模式 1：事件驱动的工作流

```python
bus = get_event_bus()

# 定义工作流阶段
def stage_prepare(event):
    print("1. 准备阶段")
    # 准备数据
    bus.publish(Event('workflow_process', {'step': 'prepare'}))

def stage_process(event):
    print("2. 处理阶段")
    bus.publish(Event('workflow_finalize', {'step': 'process'}))

def stage_finalize(event):
    print("3. 完成阶段")

# 订阅
bus.subscribe('workflow_start', stage_prepare, priority=10)
bus.subscribe('workflow_process', stage_process, priority=10)
bus.subscribe('workflow_finalize', stage_finalize, priority=10)

# 启动工作流
bus.publish(Event('workflow_start', {'id': 'WF-001'}))
```

### 模式 2：条件事件路由

```python
bus = get_event_bus()

def high_priority_handler(event):
    if event.data.get('priority') == 'high':
        print(f"[高优先级] 处理: {event.data}")

def low_priority_handler(event):
    if event.data.get('priority') == 'low':
        print(f"[低优先级] 处理: {event.data}")

bus.subscribe('routing_test', high_priority_handler)
bus.subscribe('routing_test', low_priority_handler)

bus.publish(Event('routing_test', {'priority': 'high', 'data': 'A'}))
bus.publish(Event('routing_test', {'priority': 'low', 'data': 'B'}))
```

## 最佳实践

1. **使用有意义的命名**：事件类型使用清晰的命名，如 `trade_executed`、`price_update`
2. **合理设置优先级**：核心业务逻辑使用高优先级，日志记录使用低优先级
3. **使用弱引用**：对于类方法订阅，使用 `weak_ref=True` 防止内存泄漏
4. **处理异常**：事件处理函数中的异常不会中断其他订阅者
5. **清理订阅**：在模块卸载时及时取消订阅

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
- [集成指南](./integrations.md)
- [案例研究](./case-studies.md)
