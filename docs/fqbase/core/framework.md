---
title: Core - 框架集成
description: Core 基础设施核心层与其他框架的集成方式
tag:
  - fqbase
  - core
---

# Core - 框架集成

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → **[框架集成](./framework.md)** → [技术架构](./architecture.md) → [API参考](./api.md) → [开发指南](./development.md) → [最佳实践](./best-practices.md) |


## 概述

Core 模块可以与多种框架和系统集成，提供基础设施能力。

## 与 Celery 集成

### 初始化

```python
from FQBase.Core import setup_event_bus, clear_event_bus
from celery import Celery

app = Celery('tasks')
event_bus = setup_event_bus(app)
```

### 生命周期

| 阶段 | 方法 | 说明 |
|------|------|------|
| 初始化 | `setup_event_bus` | 绑定 EventBus 到 Celery |
| 运行 | 任务执行 | 自动发布任务事件 |
| 清理 | `clear_event_bus` | 清理 EventBus |

### 配置

```yaml
celery:
  broker_url: 'redis://localhost:6379/0'
  result_backend: 'redis://localhost:6379/1'
```

## 与 Flask/Django 集成

### Flask

```python
from flask import Flask
from FQBase.Core import get_logger, init_logging

app = Flask(__name__)

# 初始化日志
init_logging(level=logging.INFO)
logger = get_logger('flask_app')

@app.route('/')
def index():
    logger.info('首页访问')
    return 'Hello'
```

### Django

```python
# settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
}

# views.py
from FQBase.Core import get_logger
logger = get_logger('django_app')

def my_view(request):
    logger.info('请求处理')
```

## 与异步框架集成

### asyncio

```python
import asyncio
from FQBase.Core import get_event_bus, Event

async def main():
    event_bus = get_event_bus()

    @event_bus.subscribe('data')
    def handle(data):
        print(f"收到: {data}")

    await event_bus.publish_async(Event('data', 'hello'))

asyncio.run(main())
```

## 与日志框架集成

### logging 标准库

```python
import logging
from FQBase.Core import get_logger

# 使用 FQBase 的日志系统
logger = get_logger('app')
```

### 结构化日志

```python
import json
from FQBase.Core import get_logger

class JSONFormatter(logging.Formatter):
    def format(self, record):
        return json.dumps({
            'level': record.levelname,
            'message': record.getMessage(),
            'module': record.module,
        })

logger = get_logger('app')
handler = logging.StreamHandler()
handler.setFormatter(JSONFormatter())
```

## 相关文档

- [技术架构](./architecture.md)
- [设计原则](./design.md)
- [API参考](./api.md)
- [event_bus 子模块](./event_bus/)
- [logger 子模块](./logger/)
