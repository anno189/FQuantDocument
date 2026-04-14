---
title: 事件总线 - 速查表
description: 事件总线快速参考指南
tag:
  - fqbase
  - event_bus
---

# 事件总线 - 速查表

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → **[速查表](./cheatsheet.md)** → [动手实验室](./workshop.md) → [使用指南](./usage.md) → [案例库](./examples.md) |


## 快速参考

### 导入

```python
from FQBase.Core.event_bus import EventBus, Event, get_event_bus
```

### 获取实例

```python
bus = get_event_bus()
```

### 基本操作

```python
# 发布事件
bus.publish(Event('event_type', {'key': 'value'}))

# 订阅
sub_id = bus.subscribe('event_type', handler, priority=0, weak_ref=False)

# 取消订阅
bus.unsubscribe('event_type', handler)
bus.unsubscribe_by_id(sub_id)

# 全局订阅
bus.subscribe_global(handler)

# 获取历史
history = bus.get_history(event_type=None, limit=100)
```

### 异步操作

```python
import asyncio

# 异步发布
await bus.publishAwait(Event('async_event', 'data'))

# 异步发布（不等待）
bus.publish_async(Event('event', 'data'))
```

## 常用配置

```python
# 环境变量
os.environ['FQ_EVENTBUS_WORKERS'] = '8'

# EventBus 参数
bus = EventBus(max_history=1000, auto_cleanup_interval=100)
```

## 常见错误

| 错误 | 原因 | 解决方案 |
|------|------|---------|
| 订阅者未收到事件 | 事件类型不匹配 | 检查 event_type |
| 内存泄漏 | 未使用弱引用 | 使用 weak_ref=True |
| 异步未执行 | 未使用 await | 使用 await publishAwait |

## 快速调试

```python
# 查看订阅者
bus.get_subscribers()

# 查看订阅者数量
bus.get_subscriber_count()

# 手动清理
bus.cleanup()
```

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
- [案例库](./examples.md)
