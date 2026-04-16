---
title: Config - 集成指南
description: Config 配置中心集成指南，包含模块内部集成、系统集成和跨系统集成
tag:
  - fqbase
  - config
---

# Config - 集成指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [技术架构](./architecture.md) → **[集成指南](./integrations.md)** |

## 子模块集成指南

| 子模块 | 集成指南 | 说明 |
|--------|----------|------|
| base | [集成指南](./base/integrations.md) | 基础配置集成 |
| business | [集成指南](./business/integrations.md) | 业务配置集成 |

---

## 1. 模块内部集成

Config 模块各子模块之间的组合使用。

### 1.1 环境变量 + 数据库配置

```python
from FQBase.Config import (
    load_env,
    get_env,
    SETTING,
)

# 先加载环境变量
load_env()

# 再获取数据库配置
db_url = get_env('MONGODB_URL', SETTING.get_mongo())
```

### 1.2 缓存配置 + 配置监听

```python
from FQBase.Config import (
    CacheConfig,
    ConfigWatcher,
    watch_config,
)

# 配置缓存
cache_config = CacheConfig(cache_type='redis')

# 监听缓存配置变化
watch_config('cache', callback=lambda: print("缓存配置已变更"))
```

---

## 2. 系统模块间集成

Config 模块与项目内其他模块的集成。

### 2.1 Config + FQData 数据源

```python
from FQBase.Config import get_datasource_priority
from FQData import get_datasource

# 获取数据源优先级
priority = get_datasource_priority('stock')

# 使用优先级创建数据源
for source_name in priority:
    ds = get_datasource(source_name)
    if ds.is_available():
        break
```

### 2.2 Config + 缓存模块

```python
from FQBase.Config import get_cache_config, get_cache_kwargs
from FQBase.Cache import CacheManager

# 获取缓存配置
cache_kwargs = get_cache_kwargs()

# 初始化缓存管理器
cache_manager = CacheManager(**cache_kwargs)
```

### 2.3 Config + 日志模块

```python
from FQBase.Config import LOG_PATH
from FQBase.Logger import setup_logging

# 使用配置的日志路径
setup_logging(log_dir=LOG_PATH)
```

---

## 3. 跨系统集成

Config 模块与外部系统、框架的集成。

### 3.1 Flask 集成

```python
from flask import Flask
from FQBase.Config import load_env, get_env

app = Flask(__name__)

# 在 Flask 应用中加载配置
@app.before_request
def load_config():
    load_env()
    app.config['DEBUG'] = get_env('DEBUG', False)
```

### 3.2 FastAPI 集成

```python
from fastapi import FastAPI
from FQBase.Config import load_env, get_env

app = FastAPI()

# 启动时加载配置
@app.on_event("startup")
async def startup():
    load_env()

# 获取配置
@app.get("/config")
async def get_config():
    return {"debug": get_env('DEBUG', False)}
```

### 3.3 Celery 集成

```python
from celery import Celery
from FQBase.Config import get_env, SETTING

# Celery 配置
celery_app = Celery('tasks')
celery_app.conf.update(
    broker_url=get_env('CELERY_BROKER_URL'),
    result_backend=get_env('CELERY_RESULT_BACKEND'),
    mongo_uri=SETTING.get_mongo(),
)
```

---

## 集成模式总结

| 集成类型 | 典型场景 | 组合方案 |
|----------|----------|----------|
| 模块内部 | 环境变量 + 数据库 | load_env() → SETTING.get_mongo() |
| 模块内部 | 缓存 + 监听 | CacheConfig + ConfigWatcher |
| 系统模块间 | 数据源配置 | get_datasource_priority + get_datasource |
| 系统模块间 | 缓存初始化 | get_cache_config + CacheManager |
| 跨系统 | Web 框架 | Flask/FastAPI + get_env |
| 跨系统 | 任务队列 | Celery + SETTING |

## 相关文档

- [API参考](./api.md)
- [技术架构](./architecture.md)
- [开发指南](./development.md)
- [base/integrations](./base/integrations.md)
- [business/integrations](./business/integrations.md)
