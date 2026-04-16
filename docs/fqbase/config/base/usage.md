---
title: Base - 使用指南
description: Base 基础配置模块详细使用指南
tag:
  - fqbase
  - config
---

# Base - 使用指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [速查表](./cheatsheet.md) → [动手实验室](./workshop.md) → **[使用指南](./usage.md)** → [案例库](./examples.md) |
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → [设计原则](./design.md) → [API参考](./api.md) → [开发指南](./development.md) → **[使用指南](./usage.md)** → [最佳实践](./best-practices.md) |

## 概述

如何有效地使用 Base 基础配置模块

## 基本用法

### 环境变量

```python
from FQBase.Config.base import load_env, get_env, get_secure_env

# 加载环境变量
load_env()

# 获取环境变量
debug = get_env('DEBUG', False)
db_url = get_env('MONGODB_URL', 'mongodb://localhost:27017')

# 获取安全变量（不记录日志）
api_key = get_secure_env('API_KEY')
```

### MongoDB 配置

```python
from FQBase.Config.base import SETTING, DATABASE

# 获取 MongoDB 配置
mongo_uri = SETTING.get_mongo()

# 获取数据库实例
db = DATABASE
```

### 缓存配置

```python
from FQBase.Config.base import CacheConfig, get_cache_config, set_cache_config

# 获取缓存配置
config = get_cache_config()

# 设置缓存配置
set_cache_config(CacheType.REDIS, host='localhost', port=6379)

# 获取缓存参数
kwargs = config.get_kwargs()
```

### 配置监听

```python
from FQBase.Config.base import ConfigWatcher, watch_config

# 使用装饰器监听配置变化
@watch_config('config.yaml')
def on_config_change(config):
    print(f"配置已更新: {config}")

# 或使用类
watcher = ConfigWatcher()
watcher.watch('config.yaml', on_config_change)
watcher.start()
```

## 常见用例

### 用例 1: 应用初始化

**场景：** 应用启动时初始化配置

**代码：**

```python
# 第1步：加载环境变量
load_env('.env')

# 第2步：获取配置
debug = get_env('DEBUG', False)
mongo_uri = SETTING.get_mongo()

# 第3步：配置缓存
set_cache_config(CacheType.REDIS, host='localhost', port=6379)
```

### 用例 2: 动态配置更新

**场景：** 运行时更新配置

**代码：**

```python
# 重新加载环境变量
reload_env()

# 更新缓存配置
set_cache_config(CacheType.MONGODB, db_name='cache')
```

## 错误处理

```python
from FQBase.Config.base import get_env, ConfigValidationError

try:
    value = get_env('REQUIRED_CONFIG')
except Exception as e:
    print(f"配置错误: {e}")
```

## 相关文档

- [API参考](./api.md)
- [开发指南](./development.md)
- [最佳实践](./best-practices.md)
