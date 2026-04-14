---
title: 事件总线 - 案例研究
description: 事件总线实际案例分析与经验总结
tag:
  - fqbase
  - event_bus
---

# 事件总线 - 案例研究

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟠 架构师 | [README](./README.md) → [技术架构](./architecture.md) → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) → [决策指南](./decision-guide.md) → **[案例研究](./case-studies.md)** → [数据流](./data-flow.md) |
| 📚 案例库 | **[案例库](./examples.md)** → **[案例研究](./case-studies.md)** → [决策指南](./decision-guide.md) → [数据流](./data-flow.md) → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) |


## 概述

本章节通过真实案例分析，帮助您理解事件总线的最佳实践。

## 案例 1: 量化交易系统事件驱动架构

### 背景

一个量化交易系统，需要在收到市场数据后，触发多个下游模块（策略计算、风控检查、订单执行、通知推送）

### 挑战

- 多模块需要同时响应市场数据
- 模块间耦合度高，修改困难
- 需要异步处理提高吞吐量

### 解决方案

使用事件总线实现松耦合：

```python
bus = get_event_bus()

# 市场数据服务
class MarketDataService:
    def on_tick(self, data):
        bus.publish(Event('market_data', data))

# 策略模块
class Strategy:
    def __init__(self):
        bus.subscribe('market_data', self.on_market_data, priority=80)
    
    def on_market_data(self, event):
        signal = self.calculate(event.data)
        if signal:
            bus.publish(Event('signal', signal))

# 风控模块
class RiskManager:
    def __init__(self):
        bus.subscribe('signal', self.check_risk, priority=100)
    
    def check_risk(self, event):
        if self.is_risky(event.data):
            bus.publish(Event('risk_alert', event.data))

# 执行模块
class Executor:
    def __init__(self):
        bus.subscribe('signal', self.execute, priority=50)
    
    def execute(self, event):
        self.submit_order(event.data)

# 通知模块
class Notifier:
    def __init__(self):
        bus.subscribe('risk_alert', self.notify, priority=10)
        bus.subscribe('order_filled', self.notify, priority=10)
    
    def notify(self, event):
        send_notification(event.data)
```

### 结果

| 指标 | 改善前 | 改善后 |
|------|--------|--------|
| 模块耦合度 | 高 | 低 |
| 添加新模块 | 需要修改多处 | 只需订阅 |
| 响应延迟 | 100ms | 10ms |

### 经验教训

1. 使用优先级确保处理顺序
2. 异步模块使用 `publishAwait`
3. 关键模块使用高优先级

---

## 案例 2: 异步任务处理系统

### 背景

后台任务系统，任务完成后需要触发后续处理

### 挑战

- 任务处理时间长，不能阻塞主流程
- 多个下游需要任务结果
- 需要保证可靠性

### 解决方案

```python
bus = get_event_bus()
executor = ThreadPoolExecutor(max_workers=10)

# 任务完成后发布事件
def on_task_complete(task_id, result):
    bus.publish(Event('task_complete', {
        'task_id': task_id,
        'result': result
    }))

# 结果存储（高优先级）
async def store_result(event):
    await save_to_db(event.data['task_id'], event.data['result'])

bus.subscribe('task_complete', store_result, priority=100)

# 通知用户（异步）
async def notify_user(event):
    await send_email(event.data['user_id'], event.data['result'])

bus.subscribe('task_complete', notify_user, priority=50)

# 触发下游任务
def trigger_next(event):
    if event.data.get('next_task'):
        queue.put(event.data['next_task'])

bus.subscribe('task_complete', trigger_next, priority=20)
```

### 结果

| 指标 | 改善前 | 改善后 |
|------|--------|--------|
| 吞吐量 | 10 task/s | 100 task/s |
| 响应时间 | 10s | <1s |

---

## 案例 3: 实时监控告警系统

### 背景

系统监控多个指标，异常时需要告警

### 解决方案

```python
bus = get_event_bus()

# 全局审计日志
def audit(event):
    log_to_file(f"{event.timestamp} - {event.event_type} - {event.data}")

bus.subscribe_global(audit, priority=-100)

# 指标收集
class MetricsCollector:
    def on_metric(self, event):
        metrics = event.data
        if metrics['value'] > thresholds[metrics['name']]:
            bus.publish(Event('alert', metrics))

# 告警处理
class AlertHandler:
    def on_alert(self, event):
        send_alert(event.data)

bus.subscribe('alert', AlertHandler().on_alert, priority=100)
```

### 经验教训

1. 审计日志使用低优先级最后执行
2. 关键告警使用高优先级

## 相关文档

- [设计模式](./patterns.md)
- [技术权衡](./tradeoff.md)
- [决策指南](./decision-guide.md)
- [数据流](./data-flow.md)
