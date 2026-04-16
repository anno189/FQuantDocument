---
title: Config - 使用指南
description: FQBase 配置中心详细使用指南
tag:
  - fqbase
  - config
---

# Config - 使用指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [速查表](./cheatsheet.md) → **[使用指南](./usage.md)** → [案例库](./examples.md) |
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → [设计原则](./design.md) → [API参考](./api.md) → [开发指南](./development.md) → **[使用指南](./usage.md)** → [最佳实践](./best-practices.md) |

## 子模块使用指南

| 子模块 | 使用指南 | 说明 |
|--------|----------|------|
| base | [使用指南](./base/usage.md) | 基础配置使用指南 |
| business | [使用指南](./business/usage.md) | 业务配置使用指南 |


## 概述

详细介绍配置中心的使用方法，包括环境变量管理、数据库连接、缓存配置和配置监听的最佳实践。

## 基本用法

### 安装

```bash
pip install fquant-fqbase
```

### 快速开始

```python
from FQBase.Config import (
    get_env,
    SETTING,
    CacheConfig,
    load_env,
)

# 第1步：加载环境变量
load_env()

# 第2步：获取配置
debug = get_env('DEBUG', False)
mongo_uri = SETTING.get_mongo()

# 第3步：配置缓存
cache_config = CacheConfig(cache_type='redis')
```

## 常见用例

### 用例 1: 环境变量管理

**场景：** 统一管理应用配置

**代码：**

```python
# 创建 .env 文件
# DEBUG=true
# MONGODB_URL=mongodb://localhost:27017
# REDIS_URL=redis://localhost:6379

from FQBase.Config import load_env, get_env

# 加载环境变量
load_env()

# 获取配置（支持默认值）
debug = get_env('DEBUG', False)
mongo_url = get_env('MONGODB_URL', 'mongodb://localhost:27017')
redis_url = get_env('REDIS_URL', 'redis://localhost:6379')
```

### 用例 2: MongoDB 数据库连接

**场景：** 获取数据库连接配置

**代码：**

```python
from FQBase.Config import SETTING, DATABASE

# 获取 MongoDB 连接 URI
mongo_uri = SETTING.get_mongo()
print(f"连接 MongoDB: {mongo_uri}")

# 使用数据库实例
db = DATABASE
collection = db['my_data']
```

### 用例 3: Redis 缓存配置

**场景：** 配置 Redis 缓存

**代码：**

```python
from FQBase.Config import CacheConfig, get_cache_config, get_cache_kwargs

# 配置缓存
cache_config = CacheConfig(cache_type='redis', ttl=1800)

# 获取全局缓存配置
global_config = get_cache_config()
print(f"缓存类型: {global_config.get_cache_type()}")

# 获取缓存参数字典
cache_kwargs = get_cache_kwargs()
print(f"缓存参数: {cache_kwargs}")
```

### 用例 4: 配置监听

**场景：** 监听配置文件变化并自动更新

**代码：**

```python
from FQBase.Config import ConfigWatcher, watch_config

# 方式1：使用 ConfigWatcher
def on_database_change():
    print("数据库配置已变更")

watcher = ConfigWatcher()
watcher.watch('database', callback=on_database_change)

# 方式2：使用便捷函数
watch_config('cache', callback=lambda: print("缓存配置已变更"))
```

## 配置

### 环境变量文件格式

```bash
# 注释以 # 开头
DEBUG=false
MONGODB_URL=mongodb://user:password@localhost:27017
REDIS_URL=redis://localhost:6379
API_KEY=your-secret-key
```

### 路径配置

```python
from FQBase.Config import (
    FQDATA_PATH,
    SETTING_PATH,
    CACHE_PATH,
    LOG_PATH,
    DOWNLOAD_PATH,
    STRATEGY_PATH,
    BIN_PATH,
)

print(f"数据目录: {FQDATA_PATH}")
print(f"设置目录: {SETTING_PATH}")
```

## 错误处理

```python
from FQBase.Config import (
    get_env,
    SETTING,
    ConfigValidationError,
)

try:
    # 获取配置
    value = get_env('REQUIRED_CONFIG')
    if value is None:
        raise ValueError("必需的配置项未设置")
    
    # 获取数据库配置
    mongo_uri = SETTING.get_mongo()
except ConfigValidationError as e:
    print(f"配置验证错误: {e}")
except Exception as e:
    print(f"配置错误: {e}")
```

## 相关文档

- [API参考](./api.md)
- [开发指南](./development.md)
- [最佳实践](./best-practices.md)
