---
title: Core - 案例研究
description: Core 基础设施核心层实际案例分析与经验总结
tag:
  - fqbase
  - core
---

# Core - 案例研究

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟠 架构师 | [README](./README.md) → [技术架构](./architecture.md) → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) → [决策指南](./decision-guide.md) → **[案例研究](./case-studies.md)** → [数据流](./data-flow.md) |
| 📚 案例库 | **[案例库](./examples.md)** → **[案例研究](./case-studies.md)** → [决策指南](./decision-guide.md) → [数据流](./data-flow.md) → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) |


## 案例 1: 量化交易信号推送系统

### 背景

某量化交易团队需要构建一个系统，当策略产生交易信号时，自动记录日志并通过企业微信推送通知。

### 挑战

- 交易信号需要实时推送
- 需要记录完整的交易日志用于回测
- 多策略同时运行需要隔离

### 解决方案

使用 Core 模块组合：
- EventBus：作为信号总线，策略产生的信号通过 EventBus 分发
- Logger：记录所有交易信号用于回测分析
- Notification：通过企业微信实时推送信号

### 实现

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

# 为每个策略创建独立的 logger
for strategy in strategies:
    strategy_logger = get_logger(f'strategy.{strategy.name}')

    @event_bus.subscribe(f'signal.{strategy.name}')
    def handle_signal(event, logger=strategy_logger):
        logger.info(f"信号: {event.data}")
        notifier.send(f"{strategy.name}: {event.data}", channel='WECOM')
```

### 结果

| 指标 | 改善前 | 改善后 |
|------|--------|--------|
| 信号推送延迟 | 5分钟 | 实时 |
| 日志完整性 | 部分记录 | 100% |
| 开发时间 | 2周 | 1天 |

### 经验教训

- 使用 Core 的组合模式可以快速构建完整功能
- 为每个策略使用独立 logger 便于隔离分析

## 案例 2: 异步任务监控系统

### 背景

某数据处理团队使用 Celery 处理大量异步任务，需要监控任务状态并在任务完成或失败时发送通知。

### 挑战

- Celery 任务分布在多个 Worker 上
- 需要统一的任务状态监控
- 任务失败时需要立即告警

### 解决方案

使用 Core 模块组合：
- EventBus + EventBusCelery：监听 Celery 任务事件
- Logger：记录任务执行日志
- Notification：任务状态变更通知

### 实现

```python
from FQBase.Core import (
    setup_event_bus,
    clear_event_bus,
    get_logger,
    NotificationManager,
)

app = Celery('tasks')
event_bus = setup_event_bus(app)
logger = get_logger('tasks')
notifier = NotificationManager()

@event_bus.subscribe('task_success')
def on_success(event):
    logger.info(f"任务成功: {event.data}")
    notifier.send(f"任务完成: {event.data['task_id']}", channel='SYSTEM')

@event_bus.subscribe('task_failure')
def on_failure(event):
    logger.error(f"任务失败: {event.data}")
    notifier.send(f"任务失败: {event.data['task_id']}", channel='WECOM')
```

### 结果

| 指标 | 改善前 | 改善后 |
|------|--------|--------|
| 故障发现时间 | 1小时 | 实时 |
| 任务可追溯性 | 差 | 完整日志 |
| 告警响应时间 | 30分钟 | <1分钟 |

## 相关文档

- [设计模式](./patterns.md)
- [技术权衡](./tradeoff.md)
- [决策指南](./decision-guide.md)
- [数据流](./data-flow.md)
