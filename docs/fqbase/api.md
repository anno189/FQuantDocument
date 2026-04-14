---
title: FQBase - API参考
description: FQBase API 参考文档
tag:
  - fqbase

summary:
  purpose: api-reference
  core_classes:
    - EventBus
    - Event
    - NotificationManager
    - FQLogger
  core_functions:
    - get_event_bus
    - get_logger
    - validate_code
    - retry
---

# FQBase - API参考

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → [设计原则](./design.md) → **[API参考](./api.md)** → [开发指南](./development.md) → [最佳实践](./best-practices.md) |

## 子模块 API 参考

| 子模块 | API 参考 | 说明 |
|--------|----------|------|
| Core | [API参考](./core/api.md) | 事件总线、日志、通知 |
| Foundation | [API参考](./foundation/api.md) | 验证、异常、重试、单例 |
| Util | [API参考](./util/api.md) | 工具函数 |
| Config | [API参考](./config/api.md) | 配置管理 |
| Cache | [API参考](./cache/api.md) | 缓存抽象 |
| Date | [API参考](./date/api.md) | 日期时间 |
| DataStore | [API参考](./datastore/api.md) | 数据存储 |
| Crawler | [API参考](./crawler/api.md) | 网页爬虫 |


## 概述

本文档介绍 FQBase 的核心 API，包括事件总线、日志、通知、验证等模块的接口。

## 快速导入

```python
# 核心模块
from FQBase.Core import (
    Event,
    EventBus,
    get_event_bus,
    get_logger,
    FQLogger,
    init_logging,
    NotificationManager,
    sendWechat,
)

# Foundation 模块
from FQBase.Foundation import (
    singleton,
    validate_code,
    validate_date,
    retry,
    FQException,
    ValidationError,
)

# Config 模块
from FQBase.Config import (
    get_env,
    load_env,
    GLOBALMAP,
)

# 便捷导入
from FQBase import EventBus, get_logger, FQException, GLOBALMAP
```

## 类

### Event

**位置：** `FQBase/Core/event_bus.py`

```python
from FQBase.Core import Event

event = Event('topic', {'key': 'value'})
```

#### 参数

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| topic | str | 是 | - | 事件主题 |
| data | Any | 否 | None | 事件数据 |

#### 属性

| 属性 | 类型 | 描述 |
|------|------|------|
| topic | str | 事件主题 |
| data | Any | 事件数据 |
| timestamp | datetime | 事件时间戳 |

---

### EventBus

**位置：** `FQBase/Core/event_bus.py`

```python
from FQBase.Core import get_event_bus

event_bus = get_event_bus()
```

#### 方法

##### subscribe

```python
event_bus.subscribe(topic: str, handler: Callable) -> Subscription
```

**描述：** 订阅事件

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| topic | str | 是 | - | 事件主题 |
| handler | Callable | 是 | - | 事件处理函数 |

**返回：** `Subscription` - 订阅对象

##### publish

```python
event_bus.publish(event: Event) -> None
```

**描述：** 发布事件

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| event | Event | 是 | - | 事件对象 |

##### unsubscribe

```python
event_bus.unsubscribe(subscription: Subscription) -> None
```

**描述：** 取消订阅

---

### NotificationManager

**位置：** `FQBase/Core/notification.py`

```python
from FQBase.Core import NotificationManager

notifier = NotificationManager()
notifier.send('message', channel='WECOM')
```

#### 方法

##### send

```python
notifier.send(message: str, channel: str = 'SYSTEM', **kwargs) -> bool
```

**描述：** 发送通知

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| message | str | 是 | - | 通知消息 |
| channel | str | 否 | 'SYSTEM' | 通知渠道 |

**返回：** `bool` - 是否发送成功

---

## 函数

### get_event_bus

```python
from FQBase.Core import get_event_bus

event_bus = get_event_bus()
```

**描述：** 获取事件总线单例

**返回：** `EventBus` - 事件总线实例

---

### get_logger

```python
from FQBase.Core import get_logger

logger = get_logger('module_name')
logger.info('message')
```

**描述：** 获取日志记录器

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| name | str | 是 | - | 日志记录器名称 |

**返回：** `FQLogger` - 日志记录器实例

---

### validate_code

```python
from FQBase.Foundation import validate_code

validate_code('000001')  # 验证股票代码
```

**描述：** 验证股票代码格式

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| code | str | 是 | - | 股票代码 |

**异常：** `ValidationError` - 验证失败

---

### retry

```python
from FQBase.Foundation import retry

@retry(max_attempts=3, delay=1, backoff=2)
def unreliable_operation():
    pass
```

**描述：** 重试装饰器

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| max_attempts | int | 否 | 3 | 最大重试次数 |
| delay | float | 否 | 1 | 初始延迟（秒） |
| backoff | float | 否 | 2 | 退避系数 |
| exceptions | tuple | 否 | (Exception,) | 重试的异常类型 |

---

### get_env

```python
from FQBase.Config import get_env

value = get_env('KEY', default='default_value')
```

**描述：** 获取环境变量

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| key | str | 是 | - | 环境变量名 |
| default | Any | 否 | None | 默认值 |

**返回：** 环境变量值

---

## 常量

| 常量 | 类型 | 值 | 描述 |
|------|------|-----|------|
| WECOM_CHANNELS | dict | {'DEFAULT': '...'} | 企业微信渠道 |
| NOTIFICATION_CHANNELS | dict | {'SYSTEM': '...'} | 通知渠道 |

## 异常

| 异常 | 描述 |
|------|------|
| FQException | 基础异常类 |
| ValidationError | 验证错误 |
| NetworkException | 网络错误 |
| ConfigException | 配置错误 |

## 相关文档

- [使用指南](./usage.md)
- [开发指南](./development.md)
- [最佳实践](./best-practices.md)
- [子模块 API](./core/api.md)
