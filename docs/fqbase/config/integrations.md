---
title: Config - 集成指南
description: Config 配置中心第三方集成指南
tag:
  - fqbase
  - config
---

# Config - 集成指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [技术架构](./architecture.md) → [API参考](./api.md) → [使用指南](./usage.md) → **[集成指南](./integrations.md)** |


## 概述

将 Config 配置中心与其他系统和服务集成的指南。

## 环境变量集成

### Python-dotenv

Config 使用 `python-dotenv` 加载 .env 文件：

```python
from dotenv import load_dotenv
import os

# 加载 .env 文件
load_dotenv()

# 读取环境变量
api_key = os.getenv('API_KEY')
```

### 环境变量优先级

```python
# 优先级：系统环境变量 > .env 文件
import os

# 如果系统已设置，使用系统值
os.environ['MONGODB_HOST'] = 'production_host'
# .env 中的值不会覆盖
```

## 数据库集成

### MongoDB

```python
from FQBase.Config import DATABASE, get_env
from pymongo import MongoClient

# 使用 DATABASE 配置
client = MongoClient(
    host=DATABASE.get('host', 'localhost'),
    port=DATABASE.get('port', 27017),
)
```

### 异步 MongoDB

```python
from FQBase.Config import DATABASE_ASYNC
from motor.motor_asyncio import AsyncIOMotorClient

# 使用异步配置
client = AsyncIOMotorClient(
    host=DATABASE_ASYNC.get('host', 'localhost'),
    port=DATABASE_ASYNC.get('port', 27017),
)
```

## 缓存集成

### Redis

```python
from FQBase.Config import get_env
import redis

# 从环境变量读取 Redis 配置
redis_host = get_env('REDIS_HOST', 'localhost')
redis_port = int(get_env('REDIS_PORT', 6379))

# 连接 Redis
r = redis.Redis(host=redis_host, port=redis_port)
```

### 内存缓存

```python
from FQBase.Config import CacheConfig

# 使用内存缓存
cache_config = CacheConfig(cache_type='memory')
```

## 框架集成

### Flask

```python
from FQBase.Config import load_env, get_env
from flask import Flask

app = Flask(__name__)

# 加载环境变量
load_env()

# 在 Flask 应用中使用
app.config['SECRET_KEY'] = get_env('SECRET_KEY')
```

### Django

```python
# settings.py
from FQBase.Config import load_env, get_env

# 加载环境变量
load_env()

# Django 配置
SECRET_KEY = get_env('DJANGO_SECRET_KEY')
DEBUG = get_env('DEBUG', 'False') == 'True'
```

### Celery

```python
from FQBase.Config import reload_env
from celery import Celery

app = Celery('tasks')

@app.task
def process_data():
    # Celery 任务中重新加载配置
    reload_env()
    # 使用最新配置
```

## 配置监听集成

### 文件监听

```python
from FQBase.Config import ConfigWatcher

# 创建监听器
watcher = ConfigWatcher('config.yaml')

# 监听配置变化
@watcher.on_change
def reload_config(new_config):
    print(f"配置已更新: {new_config}")

# 启动监听
watcher.start()
```

## 日志集成

### Python Logging

```python
from FQBase.Config import LOG_PATH
import logging
import os

# 使用配置的日志路径
log_file = os.path.join(LOG_PATH, 'app.log')

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(log_file),
        logging.StreamHandler()
    ]
)
```

## 集成最佳实践

1. **统一配置入口**：所有配置通过 Config 模块获取
2. **环境隔离**：不同环境使用不同的 .env 文件
3. **敏感配置**：使用 `get_secure_env` 处理敏感信息
4. **动态重载**：长期运行进程使用 `reload_env()`

## 相关文档

- [API参考](./api.md)
- [技术架构](./architecture.md)
- [使用指南](./usage.md)
