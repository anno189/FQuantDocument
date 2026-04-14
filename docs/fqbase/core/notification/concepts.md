---
title: 通知服务 - 核心概念
description: 深入理解通知服务模块的核心概念
tag:
  - fqbase
  - core
  - notification
---

# 通知服务 - 核心概念

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [术语表](./glossary.md) → **[核心概念](./concepts.md)** → [框架集成](./framework.md) → [技术架构](./architecture.md) |
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → **[核心概念](./concepts.md)** → [设计原则](./design.md) → [API参考](./api.md) |


## 概述

本章节深入介绍通知服务模块的核心概念，帮助开发者理解模块的设计和实现原理。

## 概念 1: 统一通知管理器 (NotificationManager)

### 概念解释

NotificationManager 是整个通知系统的核心，采用单例模式设计，确保全局只有一个实例。它负责管理所有通知渠道的处理器，并提供统一的发送接口。

### 原理

NotificationManager 使用 `@singleton` 装饰器实现单例模式，并通过延迟初始化（lazy initialization）在首次访问时才创建处理器。这种设计确保了：
1. 全局唯一性：避免重复创建管理器实例
2. 资源节约：处理器在需要时才创建
3. 线程安全：使用锁机制保证并发安全

### 代码示例

```python
from FQBase.Core.notification import NotificationManager

# 获取单例实例
manager = NotificationManager()

# 延迟初始化后，handlers 已创建
handler = manager.get_handler('wecom_default')
print(f"处理器: {handler}")
```

## 概念 2: 通知处理器抽象

### 概念解释

NotificationHandler 是所有通知处理器的抽象基类，定义了统一的接口规范。这种设计遵循了策略模式，允许在不修改客户端代码的情况下切换不同的通知渠道。

### 原理

每个具体处理器（如 WecomHandler、ServerChanHandler）都继承自 NotificationHandler 并实现 `send()` 方法。管理器通过统一的接口调用不同的处理器，实现了：
1. 接口统一：调用方无需关心具体实现
2. 易于扩展：新增渠道只需创建新的 Handler 类
3. 职责分离：每个处理器专注于自己的发送逻辑

### 代码示例

```python
from FQBase.Core.notification import NotificationHandler, WecomHandler, NotificationManager

# 使用具体处理器
handler = WecomHandler(channel='DEFAULT')
result = handler.send('测试消息')
print(f"发送结果: {result}")

# 注册自定义处理器
class CustomHandler(NotificationHandler):
    def send(self, content: str, **kwargs) -> bool:
        # 自定义发送逻辑
        print(f"自定义发送: {content}")
        return True

manager = NotificationManager()
manager.register('custom', CustomHandler())
```

## 概念 3: 渠道隔离机制

### 概念解释

企业微信支持多个渠道（如 DEFAULT、BOND、SYSTEM 等），每个渠道可以配置不同的 AgentID 和 Secret，实现不同业务场景的隔离。

### 原理

渠道隔离通过环境变量实现：
- `WECOM_AGENTID_DEFAULT`：默认渠道的 AgentID
- `WECOM_AGENTID_BOND`：债券渠道的 AgentID
- `WECOM_SECRET_DEFAULT`：默认渠道的 Secret
- `WECOM_SECRET_BOND`：债券渠道的 Secret

### 代码示例

```python
from FQBase.Core.notification import sendWechat

# 发送 到默认渠道
sendWechat('通用通知', channel='DEFAULT')

# 发送 到债券专用渠道
sendWechat('债券交易通知', channel='BOND')

# 发送 到系统通知渠道
sendWechat('系统告警', channel='SYSTEM')
```

## 概念 4: 异步发送机制

### 概念解释

异步发送通过 ThreadPoolExecutor 实现，将通知发送任务提交到线程池执行，不阻塞主线程。这对于需要高吞吐量的场景尤为重要。

### 原理

模块使用 `concurrent.futures.ThreadPoolExecutor` 创建线程池（默认 4 个 worker），当调用 `send_async()` 时：
1. 将发送任务提交到线程池
2. 立即返回 Future 对象
3. 发送任务在后台线程执行
4. 调用方可以通过 Future 获取结果

### 代码示例

```python
from FQBase.Core.notification import NotificationManager
import time

manager = NotificationManager()

# 异步发送多个通知
futures = []
for i in range(10):
    future = manager.send_async(f'异步消息 {i}', channel='DEFAULT')
    futures.append(future)

# 等待所有发送完成
for i, future in enumerate(futures):
    result = future.result()
    print(f"消息 {i}: {'成功' if result else '失败'}")
```

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [术语表](./glossary.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
