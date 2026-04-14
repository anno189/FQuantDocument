---
title: Core - 最佳实践
description: Core 基础设施核心层最佳实践与建议
tag:
  - fqbase
  - core
---

# Core - 最佳实践

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [技术架构](./architecture.md) → [API参考](./api.md) → [使用指南](./usage.md) → **[最佳实践](./best-practices.md)** |
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → **[最佳实践](./best-practices.md)** |


## 概述

本文档提供使用 Core 模块的最佳实践建议，涵盖事件总线、日志和通知的组合使用。

## 事件总线最佳实践

### 技巧 1: 使用单例获取 EventBus

**建议：** 使用 `get_event_bus()` 获取单例实例

**代码 - 好：**
```python
event_bus = get_event_bus()
```

**代码 - 差：**
```python
event_bus = EventBus()  # 每次创建新实例
```

### 技巧 2: 提前订阅事件

**建议：** 在发布事件前完成订阅

**代码 - 好：**
```python
@event_bus.subscribe('event')
def handler(e):
    print(e.data)

event_bus.publish(Event('event', 'data'))
```

**代码 - 差：**
```python
event_bus.publish(Event('event', 'data'))
@event_bus.subscribe('event')  # 事件已发布，来不及接收
def handler(e):
    print(e.data)
```

### 技巧 3: 使用有意义的事件类型

**建议：** 使用清晰的事件类型名称

```python
event_bus.publish(Event('trade_signal', data))
event_bus.publish(Event('data_sync_complete', data))
```

## 日志最佳实践

### 技巧 1: 使用统一的模块名称

**建议：** 在同一模块中使用统一的 logger 名称

**代码 - 好：**
```python
logger = get_logger(__name__)  # 自动获取模块名
```

### 技巧 2: 选择合适的日志级别

**建议：** 根据情况选择正确的日志级别

```python
logger.debug('调试信息')
logger.info('一般信息')
logger.warning('警告信息')
logger.error('错误信息')
logger.critical('严重错误')
```

### 技巧 3: 结构化日志内容

**建议：** 使用结构化数据便于后续分析

```python
logger.info(f'交易信号: direction={direction}, code={code}, price={price}')
```

## 通知最佳实践

### 技巧 1: 使用通知模板

**建议：** 使用 NotificationTemplate 保持消息格式统一

**代码 - 好：**
```python
message = NotificationTemplate.render('trade_signal', ...)
notifier.send(message, channel='WECOM')
```

**代码 - 差：**
```python
notifier.send(f'trade_signal: {data}', channel='WECOM')
```

### 技巧 2: 合理选择通知渠道

**建议：** 根据紧急程度选择合适的通知渠道

| 紧急程度 | 推荐渠道 |
|----------|----------|
| 紧急 | 企业微信、电话 |
| 一般 | Server酱 |
| 信息 | PushBear |

### 技巧 3: 避免通知风暴

**建议：** 实现通知去重和频率控制

```python
class NotificationThrottle:
    def __init__(self, max_per_minute=5):
        self.max_per_minute = max_per_minute
        self.notifications = []

    def should_send(self):
        # 实现频率控制逻辑
        return len(self.notifications) < self.max_per_minute
```

## 跨模块组合最佳实践

### 模式 1: 事件驱动 + 日志 + 通知

**建议：** 使用统一的处理函数处理事件

```python
@event_bus.subscribe('task_completed')
def on_task_completed(event):
    logger.info(f"任务完成: {event.data}")
    notifier.send(f"任务完成: {event.data}", channel='SYSTEM')
```

### 模式 2: 错误处理集成

**建议：** 在统一位置处理错误并发送通知

```python
def handle_error(error, context):
    logger.error(f"{context}: {error}")
    notifier.send(f"错误: {context} - {error}", channel='WECOM')
```

## 安全最佳实践

### 技巧 1: 敏感信息不记录日志

**建议：** 不要在日志中记录敏感信息

**代码 - 好：**
```python
logger.info(f"用户登录: {user_id}")
```

**代码 - 差：**
```python
logger.info(f"用户登录: {user_id}, 密码: {password}")  # 永远不要这样做！
```

### 技巧 2: 使用环境变量存储密钥

**建议：** 使用环境变量存储通知渠道的 API 密钥

**代码 - 好：**
```python
import os
api_key = os.environ.get('WECOM_SECRET')
```

**代码 - 差：**
```python
api_key = 'secret_key_123'  # 永远不要这样做！
```

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [技术架构](./architecture.md)
- [event_bus 子模块](./event_bus/)
- [logger 子模块](./logger/)
- [notification 子模块](./notification/)
