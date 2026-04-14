---
title: FQBase - 使用指南
description: FQBase 详细使用指南
tag:
  - fqbase
---

# FQBase - 使用指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [速查表](./cheatsheet.md) → [动手实验室](./workshop.md) → **[使用指南](./usage.md)** → [案例库](./examples.md) |
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → [设计原则](./design.md) → [API参考](./api.md) → [开发指南](./development.md) → **[使用指南](./usage.md)** → [最佳实践](./best-practices.md) |

## 子模块使用指南

| 子模块 | 使用指南 | 说明 |
|--------|----------|------|
| Core | [使用指南](./core/usage.md) | 事件总线、日志、通知 |
| Foundation | [使用指南](./foundation/usage.md) | 验证、异常、重试、单例 |
| Util | [使用指南](./util/usage.md) | 工具函数 |
| Config | [使用指南](./config/usage.md) | 配置管理 |
| Cache | [使用指南](./cache/usage.md) | 缓存抽象 |
| Date | [使用指南](./date/usage.md) | 日期时间 |
| DataStore | [使用指南](./datastore/usage.md) | 数据存储 |
| Crawler | [使用指南](./crawler/usage.md) | 网页爬虫 |


## 概述

详细说明如何有效使用 FQBase 的各个模块。

## 基本用法

### 安装

```bash
pip install fquant-fqbase
```

### 快速开始

```python
from FQBase.Core import (
    get_event_bus,
    get_logger,
    NotificationManager,
    Event,
)
from FQBase.Foundation import retry

# 创建实例
event_bus = get_event_bus()
logger = get_logger('my_module')
notifier = NotificationManager()

# 订阅事件
@event_bus.subscribe('task_completed')
def on_task_completed(event):
    logger.info(f"任务完成: {event.data}")
    notifier.send(f"任务完成", channel='SYSTEM')

# 发布事件
event_bus.publish(Event('task_completed', {'task_id': 123}))
```

## 常见用例

### 用例 1: 交易信号通知系统

**场景：** 当交易策略产生信号时，发送企业微信通知

**代码：**

```python
from FQBase.Core import get_event_bus, get_logger, NotificationManager, Event
from FQBase.Foundation import retry

# 初始化组件
event_bus = get_event_bus()
logger = get_logger('strategy')
notifier = NotificationManager()

# 订阅交易信号
@event_bus.subscribe('trade_signal')
def handle_trade_signal(event):
    signal = event.data
    logger.info(f"交易信号: {signal}")
    
    # 发送通知
    message = f"{signal['code']} - {signal['signal']} @ {signal['price']}"
    notifier.send(message, channel='WECOM')

# 策略产生信号
def on_signal(code, signal_type, price):
    event_bus.publish(Event('trade_signal', {
        'code': code,
        'signal': signal_type,
        'price': price
    }))
```

### 用例 2: 带重试的数据获取

**场景：** 从外部 API 获取数据，失败时自动重试

**代码：**

```python
from FQBase.Foundation import retry
from FQBase.Cache import CacheAdapter
import requests

cache = CacheAdapter()

@retry(max_attempts=3, delay=1, backoff=2, exceptions=(requests.RequestException,))
def fetch_market_data(code):
    # 尝试从缓存获取
    cached = cache.get(f"market:{code}")
    if cached:
        return cached
    
    # 从外部获取
    response = requests.get(f"https://api.example.com/quote/{code}")
    data = response.json()
    
    # 存入缓存（5分钟）
    cache.set(f"market:{code}", data, ttl=300)
    return data
```

### 用例 3: 配置管理

**场景：** 使用环境变量配置应用

**代码：**

```python
from FQBase.Config import load_env, get_env

# 加载 .env 文件
load_env('.env')

# 获取配置
API_KEY = get_env('API_KEY')
DEBUG = get_env('DEBUG', default=False)
PORT = get_env('PORT', default=8080, type=int)
```

## 配置

### 基本配置

```yaml
fqbase:
  event_bus:
    enabled: true
    max_history: 100
  logger:
    level: INFO
  notification:
    enabled: true
```

## 错误处理

```python
from FQBase.Foundation import FQException, ValidationError, handle_exception
from FQBase.Core import get_logger

logger = get_logger('error_handler')

try:
    validate_code('invalid_code')
except ValidationError as e:
    logger.error(f"验证错误: {e}")
except FQException as e:
    logger.exception(f"FQ异常: {e}")
```

## 相关文档

- [API参考](./api.md)
- [开发指南](./development.md)
- [最佳实践](./best-practices.md)
