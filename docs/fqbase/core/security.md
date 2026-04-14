---
title: Core - 安全指南
description: Core 基础设施核心层安全配置与最佳实践
tag:
  - fqbase
  - core
---

# Core - 安全指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → **[安全指南](./security.md)** → [故障排查](./troubleshooting.md) → [常见问题](./faq.md) |


## 概述

本文档提供 Core 模块的安全配置与最佳实践建议。

## 认证与授权

### 通知渠道认证

```python
from FQBase.Core import NotificationManager
import os

notifier = NotificationManager(
    wecom_corp_id=os.environ.get('WECOM_CORP_ID'),
    wecom_secret=os.environ.get('WECOM_SECRET'),
    wecom_agent_id=os.environ.get('WECOM_AGENT_ID')
)
```

## 数据保护

### 日志敏感数据

**建议：** 不要在日志中记录敏感信息

**代码 - 好：**
```python
logger.info(f"用户 {user_id} 登录成功")
```

**代码 - 差：**
```python
logger.info(f"用户 {user_id} 登录，密码: {password}")  # 永远不要这样做！
```

### 事件数据

**建议：** 避免在事件数据中传递敏感信息

```python
# 好：只传递必要的非敏感数据
event_bus.publish(Event('user_login', {'user_id': user_id}))

# 差：传递敏感数据
event_bus.publish(Event('user_login', {'user_id': user_id, 'password': password}))
```

## 安全最佳实践

1. 使用环境变量存储 API 密钥
2. 日志中不记录敏感信息
3. 事件数据避免传递密码等敏感内容
4. 定期轮换通知渠道的 API 密钥

## 子模块安全索引

| 子模块 | 安全说明 |
|--------|----------|
| event_bus | [security](./event_bus/security.md) |
| logger | [security](./logger/security.md) |
| notification | [security](./notification/security.md) |

## 相关文档

- [API参考](./api.md)
- [最佳实践](./best-practices.md)
- [配置指南](./configuration.md)
