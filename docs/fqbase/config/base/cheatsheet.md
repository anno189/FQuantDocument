---
title: Base - 速查表
description: Base 基础配置模块快速参考指南
tag:
  - fqbase
  - config
---

# Base - 速查表

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → **[速查表](./cheatsheet.md)** → [动手实验室](./workshop.md) → [使用指南](./usage.md) → [案例库](./examples.md) |

## 快速参考

### 环境变量

```python
from FQBase.Config.base import load_env, get_env, get_secure_env

load_env()  # 加载 .env
value = get_env('KEY', 'default')
secure = get_secure_env('SECRET')  # 不记录日志
```

### MongoDB 配置

```python
from FQBase.Config.base import SETTING, DATABASE

mongo_uri = SETTING.get_mongo()
db = DATABASE
```

### 缓存配置

```python
from FQBase.Config.base import CacheConfig, get_cache_config, set_cache_config, CacheType

config = get_cache_config()
set_cache_config(CacheType.REDIS, host='localhost')
```

### 配置监听

```python
from FQBase.Config.base import watch_config

@watch_config('config.yaml')
def on_change(config):
    print(f"更新: {config}")
```

## 常见错误

| 错误 | 原因 | 解决方案 |
|------|------|---------|
| ConnectionError | MongoDB 未运行 | 启动 MongoDB |
| KeyError | 环境变量不存在 | 使用默认值 |
| ConfigValidationError | 配置无效 | 检查配置格式 |

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
- [案例库](./examples.md)
