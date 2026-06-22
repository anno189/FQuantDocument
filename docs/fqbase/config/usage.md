---
title: Config - 使用指南
description: Config 详细使用指南
tag:
  - fquant
  - fqbase
  - config

summary:
  purpose: usage
---

# Config - 使用指南

## 阅读路径

🔵 **开发者**：README → api → usage → concepts → examples

## 概述

本指南详细说明如何在各种场景下使用 Config 模块。

## 基本用法

### 获取 MongoDB 配置

```python
from FQBase.Config import SETTING

uri = SETTING.get_mongo()
print(f"MongoDB URI: {uri}")

client = SETTING.client
```

### 获取路径配置

```python
from FQBase.Config import GLOBALMAP

paths = {
    "data": GLOBALMAP.FQDATA_PATH,
    "cache": GLOBALMAP.CACHE_PATH,
    "log": GLOBALMAP.LOG_PATH,
    "download": GLOBALMAP.DOWNLOAD_PATH,
}
```

## 常见用例

### 用例 1: 环境变量管理

**场景：** 管理不同环境下的配置

```python
from FQBase.Config import load_env, get_env, get_secure_env

# 开发环境
load_env()

# 生产环境（从系统环境变量读取）
debug = get_env("DEBUG", default="false")
api_key = get_secure_env("API_KEY")
```

### 用例 2: 动态配置更新

**场景：** 在不停机的情况下更新配置

```python
from FQBase.Config import SETTING, watch_config

# 监听配置变更
def on_mongo_change(new_uri):
    print(f"MongoDB URI 变更: {new_uri}")
    SETTING.change(ip="newhost", port=27017)

watcher = watch_config(["MONGODB_URI"])
watcher.add_callback(on_mongo_change)
```

### 用例 3: 缓存配置管理

**场景：** 动态切换缓存后端

```python
from FQBase.Config import get_cache_config, set_cache_config, CacheConfig

# 获取当前配置
config = get_cache_config()
print(f"当前缓存类型: {config.cache_type}")

# 切换到 Redis
new_config = CacheConfig(
    cache_type='redis',
    redis_host='redis.example.com',
    redis_port=6379
)
set_cache_config(new_config)
```

### 用例 4: 路径一致性

**场景：** 在不同模块中使用统一路径

```python
from FQBase.Config import GLOBALMAP

# 数据模块
DATA_DIR = GLOBALMAP.FQDATA_PATH

# 日志模块
LOG_DIR = GLOBALMAP.LOG_PATH

# 缓存模块
CACHE_DIR = GLOBALMAP.CACHE_PATH
```

## 相关文档

- [API参考](./api.md)
- [最佳实践](./best-practices.md)
- [故障排查](./troubleshooting.md)
