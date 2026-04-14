---
title: Core - 案例库
description: Core 基础设施核心层实际应用场景与示例
tag:
  - fqbase
  - core
---

# Core - 案例库

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → **[案例库](./examples.md)** |
| 📚 案例库 | **[案例库](./examples.md)** → [跨模块集成示例](#跨模块集成) |


## 概述

本文档展示 Core 模块的实际应用场景，重点介绍跨模块组合使用的最佳实践。

## 跨模块集成示例

### 示例 1：事件驱动通知系统

**场景描述：** 构建一个事件驱动的通知系统，当交易信号产生时自动记录日志并发送通知

**涉及子模块：**
- [event_bus](./event_bus/) - 事件驱动
- [logger](./logger/) - 日志记录
- [notification](./notification/) - 通知推送

**代码实现：**

```python
from FQBase.Core import (
    get_event_bus,
    get_logger,
    NotificationManager,
    Event,
)

# 第1步：初始化组件
event_bus = get_event_bus()
logger = get_logger('trading')
notifier = NotificationManager()

# 第2步：定义事件处理器
@event_bus.subscribe('trade_signal')
def handle_trade_signal(event):
    signal = event.data
    # 记录日志
    logger.info(f"交易信号: {signal}")
    # 发送通知
    message = f"{signal['direction']} {signal['code']} @ {signal['price']}"
    notifier.send(message, channel='WECOM')

# 第3步：发布事件
event_bus.publish(Event('trade_signal', {
    'direction': 'BUY',
    'code': '000001',
    'price': 12.50
}))
```

**适用场景：**
- 交易策略信号推送
- 价格监控告警
- 风险事件通知

---

### 示例 2：Celery 异步任务监控

**场景描述：** 监控 Celery 异步任务的执行状态，任务完成后自动记录日志并发送通知

**涉及子模块：**
- [event_bus](./event_bus/) - 事件总线
- [event_bus_celery](./event_bus_celery/) - Celery 集成
- [logger](./logger/) - 日志记录
- [notification](./notification/) - 通知推送

**代码实现：**

```python
from FQBase.Core import (
    setup_event_bus,
    clear_event_bus,
    get_logger,
    NotificationManager,
)
from celery import Celery

# 第1步：初始化
app = Celery('tasks')
event_bus = setup_event_bus(app)
logger = get_logger('tasks')
notifier = NotificationManager()

# 第2步：订阅任务事件
@event_bus.subscribe('task_success')
def on_task_success(event):
    task_id = event.data['task_id']
    logger.info(f"任务成功: {task_id}")
    notifier.send(f"任务 {task_id} 执行成功", channel='SYSTEM')

@event_bus.subscribe('task_failure')
def on_task_failure(event):
    task_id = event.data['task_id']
    logger.error(f"任务失败: {task_id}")
    notifier.send(f"任务 {task_id} 执行失败", channel='WECOM')

# 第3步：使用 Celery
@app.task
def process_data(data):
    # 处理逻辑
    return {'result': 'done'}

# 第4步：清理
@app.task
def cleanup():
    clear_event_bus()
```

**适用场景：**
- 后台任务状态监控
- 定时任务执行通知
- 数据处理任务追踪

---

### 示例 3：统一日志告警

**场景描述：** 对关键业务日志实时监控，当出现错误或警告时自动发送告警通知

**涉及子模块：**
- [logger](./logger/) - 日志记录
- [notification](./notification/) - 通知推送
- [notification_template](./notification_template/) - 通知模板

**代码实现：**

```python
from FQBase.Core import (
    get_logger,
    NotificationManager,
    NotificationTemplate,
)

logger = get_logger('monitor')
notifier = NotificationManager()

def process_critical_operation(data):
    try:
        result = critical_operation(data)
        logger.info(f"操作成功: {result}")
        return result
    except Warning as w:
        logger.warning(f"警告: {w}")
        message = NotificationTemplate.render(
            'warning_alert',
            operation='process_critical_operation',
            message=str(w)
        )
        notifier.send(message, channel='SERVERCHAN')
    except Exception as e:
        logger.error(f"错误: {e}")
        message = NotificationTemplate.render(
            'error_alert',
            operation='process_critical_operation',
            error=str(e)
        )
        notifier.send(message, channel='WECOM')
        raise
```

**适用场景：**
- 关键业务监控
- 错误实时告警
- 系统健康检查

---

### 示例 4：完整的数据处理流水线

**场景描述：** 构建一个完整的异步数据处理流水线，包含任务提交、进度跟踪、完成通知

**涉及子模块：**
- [event_bus](./event_bus/) - 事件总线
- [event_bus_celery](./event_bus_celery/) - Celery 集成
- [logger](./logger/) - 日志记录
- [notification](./notification/) - 通知推送

**代码实现：**

```python
from FQBase.Core import (
    setup_event_bus,
    clear_event_bus,
    get_logger,
    NotificationManager,
    Event,
)
from celery import Celery

app = Celery('pipeline')
event_bus = setup_event_bus(app)
logger = get_logger('pipeline')
notifier = NotificationManager()

@event_bus.subscribe('task_progress')
def on_progress(event):
    task_id = event.data['task_id']
    progress = event.data['progress']
    logger.info(f"任务 {task_id}: {progress}%")

@event_bus.subscribe('task_completed')
def on_completed(event):
    task_id = event.data['task_id']
    result = event.data['result']
    logger.info(f"任务 {task_id} 完成: {result}")
    notifier.send(f"数据处理完成: {result}", channel='SYSTEM')

@event_bus.subscribe('task_failed')
def on_failed(event):
    task_id = event.data['task_id']
    error = event.data['error']
    logger.error(f"任务 {task_id} 失败: {error}")
    notifier.send(f"数据处理失败: {error}", channel='WECOM')

@app.task(bind=True)
def process_data(self, data):
    total = len(data)
    for i, item in enumerate(data):
        # 处理逻辑
        progress = int((i + 1) / total * 100)
        event_bus.publish(Event('task_progress', {
            'task_id': self.request.id,
            'progress': progress
        }))
    event_bus.publish(Event('task_completed', {
        'task_id': self.request.id,
        'result': f'处理了 {total} 条数据'
    }))
    return {'processed': total}
```

**适用场景：**
- 大规模数据处理
- 批量任务执行
- 异步工作流

## 常见应用模式

### 模式 1：发布-订阅

**描述：** 使用 EventBus 实现模块间的松耦合通信

```python
# 生产者
event_bus.publish(Event('event_type', data))

# 消费者
@event_bus.subscribe('event_type')
def handler(event):
    process(event.data)
```

### 模式 2：日志拦截

**描述：** 通过日志处理器集成通知功能

```python
class NotificationHandler(logging.Handler):
    def emit(self, record):
        if record.levelno >= logging.ERROR:
            notifier.send(self.format(record), channel='WECOM')
```

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
- [event_bus 子模块](./event_bus/)
- [logger 子模块](./logger/)
- [notification 子模块](./notification/)
