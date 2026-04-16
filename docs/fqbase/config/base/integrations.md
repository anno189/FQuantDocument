---
title: Base - 集成指南
description: Base 基础配置模块集成指南
tag:
  - fqbase
  - config
---

# Base - 集成指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [技术架构](./architecture.md) → **[集成指南](./integrations.md)** |

---

## 1. 模块内部集成

### 1.1 环境变量 + MongoDB 配置

```python
from FQBase.Config.base import load_env, SETTING

# 先加载环境变量
load_env()

# 再获取 MongoDB 配置
mongo_uri = SETTING.get_mongo()
```

### 1.2 缓存配置 + 配置监听

```python
from FQBase.Config.base import set_cache_config, watch_config

# 设置缓存配置
set_cache_config(CacheType.REDIS, host='localhost')

# 监听配置变化
@watch_config('cache.yaml')
def on_cache_change(config):
    set_cache_config(**config)
```

---

## 2. 系统模块间集成

### 2.1 Base + Business 配置

```python
from FQBase.Config.base import get_env, SETTING
from FQBase.Config.business import get_datasource_priority

# 基础配置
db_uri = SETTING.get_mongo()

# 业务配置
priority = get_datasource_priority('stock')
```

### 2.2 Base + FQData

```python
from FQBase.Config.base import SETTING, CACHE_PATH
from FQData import FQDataClient

# 使用 Base 配置初始化 FQData
client = FQDataClient(
    mongo_uri=SETTING.get_mongo(),
    cache_path=CACHE_PATH
)
```

---

## 3. 跨系统集成

### 3.1 Flask 集成

```python
from flask import Flask
from FQBase.Config.base import load_env, get_env

app = Flask(__name__)

# 加载配置
load_env()

# 获取配置
debug = get_env('DEBUG', False)
```

### 3.2 FastAPI 集成

```python
from fastapi import FastAPI
from FQBase.Config.base import load_env, get_env

app = FastAPI()

@app.on_event("startup")
async def startup():
    load_env()
```

---

## 集成模式总结

| 集成类型 | 典型场景 | 组合方案 |
|----------|----------|----------|
| 模块内部 | 初始化顺序 | load_env → SETTING.get_mongo() |
| 系统模块间 | 基础+业务配置 | Base + Business |
| 跨系统 | Web 框架集成 | Flask/FastAPI + Base |

## 相关文档

- [API参考](./api.md)
- [技术架构](./architecture.md)
