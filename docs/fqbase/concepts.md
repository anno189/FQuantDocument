---
title: FQBase - 核心概念
description: 深入理解 FQBase 的核心概念
tag:
  - fqbase
---

# FQBase - 核心概念

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [术语表](./glossary.md) → **[核心概念](./concepts.md)** → [框架集成](./framework.md) → [技术架构](./architecture.md) |
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → **[核心概念](./concepts.md)** → [设计原则](./design.md) → [API参考](./api.md) |

## 子模块核心概念

| 子模块 | 核心概念 | 说明 |
|--------|----------|------|
| Core | [核心概念](./core/concepts.md) | 事件总线、日志、通知 |
| Foundation | [核心概念](./foundation/concepts.md) | 验证、异常、重试、单例 |
| Util | [核心概念](./util/concepts.md) | 工具函数 |
| Config | [核心概念](./config/concepts.md) | 配置管理 |
| Cache | [核心概念](./cache/concepts.md) | 缓存抽象 |
| Date | [核心概念](./date/concepts.md) | 日期时间 |
| DataStore | [核心概念](./datastore/concepts.md) | 数据存储 |
| Crawler | [核心概念](./crawler/concepts.md) | 网页爬虫 |

## 概述

深入理解 FQBase 的核心概念，包括事件驱动架构、单例模式、重试机制等。

## 概念 1: 事件驱动架构

### 概念解释

事件驱动架构（Event-Driven Architecture）是一种软件架构模式，其中组件之间的通信通过事件的发送和接收来完成。这种架构解耦了组件，使它们可以独立开发和演进。

### 原理

1. **事件发布者（Publisher）**：产生事件但不关心谁接收
2. **事件订阅者（Subscriber）**：订阅感兴趣的事件类型
3. **事件总线（Event Bus）**：中介者，负责事件的路由

### 代码示例

```python
from FQBase.Core import get_event_bus, Event

event_bus = get_event_bus()

# 订阅者
@event_bus.subscribe('trade_signal')
def on_trade_signal(event):
    print(f"收到交易信号: {event.data}")

# 发布者
event_bus.publish(Event('trade_signal', {
    'code': '000001',
    'signal': 'BUY',
    'price': 12.50
}))
```

## 概念 2: 单例模式

### 概念解释

单例模式确保一个类只有一个实例，并提供全局访问点。在 FQBase 中，EventBus、Logger、NotificationManager 等核心服务都采用单例模式。

### 原理

1. 私有化构造函数
2. 类级别存储实例
3. 提供全局访问方法

### 代码示例

```python
from FQBase.Foundation import singleton

@singleton
class Database:
    def __init__(self):
        self.connection = None
    
    def connect(self):
        if not self.connection:
            self.connection = create_connection()
        return self.connection

# 全局唯一实例
db1 = Database()
db2 = Database()
assert db1 is db2  # True
```

## 概念 3: 重试机制

### 概念解释

重试机制（Retry）是一种容错策略，当操作失败时自动重试一定次数。FQBase 的重试装饰器支持自定义重试次数、延迟和指数退避。

### 原理

1. 捕获异常
2. 判断是否需要重试
3. 等待延迟后重试
4. 指数退避增加延迟时间

### 代码示例

```python
from FQBase.Foundation import retry

@retry(max_attempts=3, delay=1, backoff=2, exceptions=(ConnectionError, TimeoutError))
def fetch_data():
    # 可能失败的操作
    return api.get()
```

## 概念 4: 熔断器模式

### 概念解释

熔断器（Circuit Breaker）模式防止级联故障。当服务失败次数超过阈值时，熔断器打开，后续请求直接失败而不调用不健康的服务。

### 原理

1. **关闭状态**：正常调用
2. **打开状态**：快速失败，不调用服务
3. **半开状态**：尝试调用，检测服务是否恢复

### 代码示例

```python
from FQBase.Foundation.circuit_breaker import CircuitBreaker

circuit = CircuitBreaker(
    failure_threshold=5,
    recovery_timeout=60,
    expected_exception=ConnectionError
)

@circuit
def call_service():
    return external_api.get()
```

## 概念 5: 统一日志系统

### 概念解释

FQBase 提供统一的日志系统，支持日志级别、格式化、输出到不同目标。

### 原理

1. Logger 管理器维护日志记录器
2. 每个模块创建自己的 Logger
3. 支持控制台、文件、网络输出

### 代码示例

```python
from FQBase.Core import get_logger, init_logging

# 初始化日志系统
init_logging(
    level='INFO',
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# 获取模块日志记录器
logger = get_logger('my_module')
logger.info('信息日志')
logger.error('错误日志')
```

## 概念 6: 多渠道通知

### 概念解释

FQBase 的通知系统支持多种渠道：企业微信、Server酱、PushBear、邮件等。

### 原理

1. 统一的 NotificationManager 接口
2. 各渠道适配器实现
3. 模板系统支持消息格式化

### 代码示例

```python
from FQBase.Core import NotificationManager

notifier = NotificationManager()

# 发送到不同渠道
notifier.send('任务完成', channel='WECOM')
notifier.send('告警信息', channel='SERVERCHAN')
notifier.send('重要通知', channel='PUSHBEAR')
```

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [术语表](./glossary.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
