---
title: Core - 故障排查
description: Core 基础设施核心层常见问题与解决方案
tag:
  - fqbase
  - core
---

# Core - 故障排查

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → **[故障排查](./troubleshooting.md)** → [常见问题](./faq.md) |


## 概述

本文档提供 Core 模块常见问题的诊断和解决方案。各子模块的详细故障排查请参考各自文档。

## 常见问题

### 问题 1: EventBus 单例未初始化

**症状：**
- 错误：`AttributeError: 'NoneType' object has no attribute 'subscribe'`

**可能原因：**
- 未调用 `get_event_bus()` 初始化单例

**解决方案：**

```python
from FQBase.Core import get_event_bus

event_bus = get_event_bus()
event_bus.subscribe('event', handler)
```

---

### 问题 2: 事件订阅不生效

**症状：**
- 发布事件后，订阅者未收到通知

**可能原因：**
- 订阅在发布之后

**解决方案：**

```python
# 正确顺序：先订阅，后发布
@event_bus.subscribe('event')
def handler(e):
    print(e.data)

event_bus.publish(Event('event', 'data'))
```

---

### 问题 3: 通知发送失败

**症状：**
- 错误：`NotificationError: 发送失败`

**可能原因：**
- 渠道配置不正确
- API 密钥过期
- 网络连接问题

**解决方案：**

1. 检查渠道配置：
```python
from FQBase.Core import NotificationManager
notifier = NotificationManager(
    wecom_corp_id='正确的ID',
    wecom_secret='正确的密钥',
    wecom_agent_id='正确的AgentID'
)
```

2. 检查网络连接：
```python
import requests
response = requests.get('https://qyapi.weixin.qq.com/cgi-bin/gettoken')
print(response.status_code)
```

---

### 问题 4: 日志未输出

**症状：**
- 日志记录后，控制台或文件没有输出

**可能原因：**
- 日志级别设置过高
- 未正确初始化日志系统

**解决方案：**

```python
import logging
logging.basicConfig(level=logging.DEBUG)
logger = get_logger('app')
logger.debug('调试信息')
```

---

## 错误参考

### EventBus 错误

| 错误 | 描述 | 解决方案 |
|------|------|----------|
| EventBusNotInitialized | EventBus 未初始化 | 调用 get_event_bus() |
| DuplicateSubscription | 重复订阅 | 使用唯一订阅ID |
| EventPublishFailed | 事件发布失败 | 检查订阅者逻辑 |

### Notification 错误

| 错误 | 描述 | 解决方案 |
|------|------|----------|
| ChannelNotConfigured | 渠道未配置 | 配置渠道参数 |
| APIError | API 调用错误 | 检查 API 密钥 |
| NetworkError | 网络错误 | 检查网络连接 |

## 诊断工具

### 启用调试日志

```python
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("FQBase.Core")
logger.debug("调试信息")
```

### 检查 EventBus 状态

```python
from FQBase.Core import get_event_bus

event_bus = get_event_bus()
print(f"订阅数量: {len(event_bus._subscriptions)}")
```

## 相关文档

- [常见问题](./faq.md)
- [最佳实践](./best-practices.md)
- [API参考](./api.md)
- [event_bus 子模块](./event_bus/)
- [logger 子模块](./logger/)
- [notification 子模块](./notification/)
