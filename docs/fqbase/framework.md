---
title: FQBase - 框架集成
description: FQBase 与其他框架的集成方式
tag:
  - fqbase
---

# FQBase - 框架集成

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → **[框架集成](./framework.md)** → [技术架构](./architecture.md) → [设计原则](./design.md) → [API参考](./api.md) → [开发指南](./development.md) → [最佳实践](./best-practices.md) |

## 子模块框架集成

| 子模块 | 框架集成 | 说明 |
|--------|----------|------|
| Core | [框架集成](./core/framework.md) | 事件总线、日志、通知 |
| Foundation | [框架集成](./foundation/framework.md) | 验证、异常、重试、单例 |
| Util | [框架集成](./util/framework.md) | 工具函数 |
| Config | [框架集成](./config/framework.md) | 配置管理 |
| Cache | [框架集成](./cache/framework.md) | 缓存抽象 |
| Date | [框架集成](./date/concepts.md) | 日期时间 |
| DataStore | [框架集成](./datastore/framework.md) | 数据存储 |
| Crawler | [框架集成](./crawler/framework.md) | 网页爬虫 |


## 概述

FQBase 与主流 Python 框架的集成方式。

## 框架集成

### Flask 集成

```python
from flask import Flask
from FQBase.Core import get_logger, init_logging

app = Flask(__name__)

# 初始化日志
init_logging(level='INFO')

# 获取日志记录器
logger = get_logger('flask_app')

@app.route('/')
def index():
    logger.info('首页访问')
    return 'Hello FQBase'
```

### FastAPI 集成

```python
from fastapi import FastAPI
from FQBase.Core import get_logger
from FQBase.Foundation import retry

app = FastAPI()
logger = get_logger('fastapi_app')

@app.get('/')
@retry(max_attempts=3)
async def root():
    logger.info('API 请求')
    return {'message': 'Hello FQBase'}
```

### Celery 集成

```python
from celery import Celery
from FQBase.Core.event_bus_celery import setup_event_bus, clear_event_bus

app = Celery('tasks')

@app.task
def process_data():
    setup_event_bus(app)
    # 处理任务
    clear_event_bus()
```

### Django 集成

```python
# settings.py
from FQBase.Core import init_logging

init_logging(
    level='DEBUG',
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# views.py
from FQBase.Core import get_logger

logger = get_logger('django_view')

def my_view(request):
    logger.info('请求处理')
    return Response('OK')
```

## 生命周期

| 阶段 | 方法 | 说明 |
|------|------|------|
| 初始化 | `__init__` | 初始化模块 |
| 配置 | `setup` | 配置模块 |
| 启动 | `start` | 启动模块 |
| 停止 | `stop` | 停止模块 |

## 配置

```yaml
fqbase:
  event_bus:
    enabled: true
    max_history: 100
  logger:
    level: INFO
    format: "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
  notification:
    enabled: true
    channels:
      - WECOM
      - SERVERCHAN
```

## 相关文档

- [技术架构](./architecture.md)
- [设计原则](./design.md)
- [API参考](./api.md)
