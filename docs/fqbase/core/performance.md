---
title: Core - 性能调优
description: Core 基础设施核心层性能优化指南
tag:
  - fqbase
  - core
---

# Core - 性能调优

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → [故障排查](./troubleshooting.md) → [常见问题](./faq.md) → **[性能调优](./performance.md)** |
| 🟠 架构师 | [README](./README.md) → [技术架构](./architecture.md) → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) → [决策指南](./decision-guide.md) → **[性能调优](./performance.md)** |


## 概述

本文档提供 Core 模块的性能优化指南。各子模块的详细性能调优请参考各自文档。

## 性能考虑

### 容器模块特性

作为容器模块，Core 本身的性能开销主要来自：
1. 模块导入时的递归加载
2. 各子模块的初始化

### 优化建议

#### 1. 延迟导入

**优化前：**
```python
# 导入所有子模块
from FQBase.Core import *
```

**优化后：**
```python
# 按需导入
from FQBase.Core import get_event_bus  # 只导入需要的
```

#### 2. EventBus 性能

EventBus 的性能主要取决于订阅者数量和事件分发频率：

| 订阅者数量 | 预期性能 |
|------------|----------|
| < 100 | 毫秒级 |
| 100-1000 | 10毫秒级 |
| > 1000 | 考虑分区 |

#### 3. 日志性能

日志性能优化建议：

| 优化项 | 说明 |
|--------|------|
| 级别控制 | 生产环境使用 INFO 级别 |
| 异步写入 | 使用队列异步写入文件 |
| 格式简化 | 减少不必要的格式化 |

#### 4. 通知性能

通知发送是同步操作，建议使用异步：

```python
import asyncio

async def send_notification_async(message, channel):
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, notifier.send, message, channel)

asyncio.run(send_notification_async('消息', 'WECOM'))
```

## 资源限制

### 配置建议

| 组件 | 建议配置 |
|------|----------|
| EventBus 订阅者 | < 1000 |
| 日志队列大小 | 1000 |
| 通知并发 | < 10 |

## 最佳实践

1. 使用合适的日志级别
2. 避免在事件订阅者中执行耗时操作
3. 使用异步通知发送
4. 定期清理不需要的订阅

## 相关文档

- [API参考](./api.md)
- [最佳实践](./best-practices.md)
- [技术架构](./architecture.md)
- [event_bus 子模块](./event_bus/)
- [logger 子模块](./logger/)
- [notification 子模块](./notification/)
