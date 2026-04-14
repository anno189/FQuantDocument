---
title: 通知服务 - 术语表
description: 通知服务模块术语定义与解释
tag:
  - fqbase
  - core
  - notification
---

# 通知服务 - 术语表

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → **[术语表](./glossary.md)** → [核心概念](./concepts.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) |


## 概述

本术语表定义了通知服务模块中的核心术语和概念。

## 术语

### 通知渠道

**定义：** 通知服务支持的第三方消息推送平台，目前支持三种渠道：
- 企业微信 (Wecom)
- Server 酱 (ServerChan)
- PushBear

**示例：**

```python
# 指定渠道发送通知
manager.send('消息内容', channel='DEFAULT')
manager.send('消息内容', channel='BOND')
manager.send('消息内容', channel='SYSTEM')
```

### 单例模式

**定义：** 设计模式之一，确保一个类只有一个实例，并提供全局访问点。NotificationManager 使用 `@singleton` 装饰器实现。

**示例：**

```python
from FQBase.Core.notification import NotificationManager

# 多次调用返回同一实例
manager1 = NotificationManager()
manager2 = NotificationManager()
print(manager1 is manager2)  # True
```

### 异步发送

**定义：** 非阻塞的发送方式，通过线程池在后台执行发送任务，立即返回 Future 对象。

**示例：**

```python
future = manager.send_async('异步消息', channel='DEFAULT')
result = future.result()  # 获取结果
```

### 渠道标识

**定义：** 用于区分不同通知用途的标识符，企业微信支持以下渠道：
- DEFAULT：默认渠道
- BOND：债券交易
- VOL_PRICE：量价提醒
- HIGH：高价提醒
- LIMIT：涨停提醒
- INS：指令通知
- SYSTEM：系统通知

### NotificationHandler

**定义：** 通知处理器的抽象基类，所有具体处理器（如 WecomHandler）都继承自此类。

### 环境变量配置

**定义：** 通过环境变量配置各渠道的 API 密钥和认证信息：
- `WECOM_CORPID`：企业微信 CorpID
- `WECOM_AGENTID_{CHANNEL}`：企业微信 AgentID
- `WECOM_SECRET_{CHANNEL}`：企业微信 Secret
- `SERVERCHAN_KEY`：Server 酱 Key
- `PUSHBEAR_KEY`：PushBear Key

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [核心概念](./concepts.md)
- [使用指南](./usage.md)
