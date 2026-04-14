---
title: FQBase - 术语表
description: FQBase 术语定义与解释
tag:
  - fqbase
---

# FQBase - 术语表

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → **[术语表](./glossary.md)** → [核心概念](./concepts.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) |

## 子模块术语表

| 子模块 | 术语表 | 说明 |
|--------|---------|------|
| Core | [术语表](./core/glossary.md) | 事件总线、日志、通知 |
| Foundation | [术语表](./foundation/glossary.md) | 验证、异常、重试、单例 |
| Util | [术语表](./util/glossary.md) | 工具函数 |
| Config | [术语表](./config/glossary.md) | 配置管理 |
| Cache | [术语表](./cache/glossary.md) | 缓存抽象 |
| Date | [术语表](./date/glossary.md) | 日期时间 |
| DataStore | [术语表](./datastore/glossary.md) | 数据存储 |
| Crawler | [术语表](./crawler/glossary.md) | 网页爬虫 |

## 概述

本术语表定义了 FQBase 框架中的核心概念和术语。

## 术语

### 事件总线 (Event Bus)

**定义：** 基于发布-订阅模式的消息传递系统，用于解耦组件间的通信

**示例：**

```python
from FQBase.Core import get_event_bus, Event

event_bus = get_event_bus()
event_bus.subscribe('trade_signal', handler)
event_bus.publish(Event('trade_signal', {'code': '000001'}))
```

### 发布-订阅模式 (Pub/Sub)

**定义：** 一种消息传递模式，消息发布者不需要知道订阅者的具体信息

**示例：**

```python
# 发布者
event_bus.publish(Event('topic', data))

# 订阅者
@event_bus.subscribe('topic')
def handler(event):
    print(event.data)
```

### 单例模式 (Singleton)

**定义：** 确保一个类只有一个实例，并提供全局访问点

**示例：**

```python
from FQBase.Foundation import singleton

@singleton
class MyClass:
    pass
```

### 重试装饰器 (Retry Decorator)

**定义：** 自动重试失败操作的装饰器，支持指数退避

**示例：**

```python
from FQBase.Foundation import retry

@retry(max_attempts=3, delay=1, backoff=2)
def fetch_data():
    return external_api.get()
```

### 熔断器 (Circuit Breaker)

**定义：** 防止级联故障的组件，当失败次数超过阈值时打开断路器

**示例：**

```python
from FQBase.Foundation.circuit_breaker import CircuitBreaker

cb = CircuitBreaker(failure_threshold=5)
@cb
def risky_operation():
    pass
```

### 缓存适配器 (Cache Adapter)

**定义：** 统一的缓存接口，支持多种后端（Redis、内存等）

**示例：**

```python
from FQBase.Cache import CacheAdapter

cache = CacheAdapter()
cache.set('key', 'value', ttl=3600)
```

### 验证器 (Validator)

**定义：** 数据验证框架，提供统一的验证接口

**示例：**

```python
from FQBase.Foundation import validate_code, Validator

validate_code('000001')
validator = Validator()
validator.validate(data, schema)
```

### 环境变量配置

**定义：** 基于环境变量的配置管理机制

**示例：**

```python
from FQBase.Config import get_env, load_env

load_env('.env')
api_key = get_env('API_KEY')
```

### 通知渠道

**定义：** 消息通知的发送渠道，如企业微信、Server酱、PushBear

**示例：**

```python
from FQBase.Core import NotificationManager

notifier = NotificationManager()
notifier.send('message', channel='WECOM')
notifier.send('message', channel='SERVERCHAN')
```

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [核心概念](./concepts.md)
- [使用指南](./usage.md)
