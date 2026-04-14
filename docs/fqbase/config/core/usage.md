---
title: Core - 使用指南
description: Core 核心配置模块详细使用指南
tag:
  - fqbase
  - config
---

# Core - 使用指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [技术架构](./architecture.md) → [API参考](./api.md) → **[使用指南](./usage.md)** |


## 概述

详细介绍如何有效使用 Core 核心配置模块。

## 环境变量管理

### 加载环境变量

```python
from FQBase.Config.core import load_env

load_env()
```

### 获取环境变量

```python
from FQBase.Config.core import get_env, get_secure_env

# 普通变量
value = get_env('KEY', 'default')

# 敏感变量
secure = get_secure_env('API_KEY')
```

## 数据库配置

```python
from FQBase.Config.core import DATABASE, DATABASE_ASYNC

print(DATABASE)
print(DATABASE_ASYNC)
```

## 缓存配置

```python
from FQBase.Config.core import get_cache_config, set_cache_config

# 获取
config = get_cache_config()

# 设置
set_cache_config('redis', host='localhost', port=6379)
```

## 配置监听

```python
from FQBase.Config.core import ConfigWatcher

watcher = ConfigWatcher('config.yaml')

@watcher.on_change
def reload(config):
    print("配置已更新")

watcher.start()
```

## 相关文档

- [API参考](./api.md)
- [最佳实践](./best-practices.md)
