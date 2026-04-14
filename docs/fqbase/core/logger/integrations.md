---
title: 统一日志系统 - 集成指南
description: 统一日志系统第三方集成指南
tag:
  - fqbase
  - logger
---

# 统一日志系统 - 集成指南

## 与其他框架集成

### 与 Flask 集成

```python
from FQBase.Core.logger import get_logger
import flask

app = flask.Flask(__name__)
logger = get_logger('flask')

@app.route('/')
def index():
    logger.info('访问首页')
    return 'Hello'
```

### 与 Celery 集成

```python
from FQBase.Core.logger import get_logger

logger = get_logger('celery')

@celery_app.task
def my_task():
    logger.info('任务开始')
    # ...
    logger.info('任务完成')
```

## 相关文档

- [API参考](./api.md)
