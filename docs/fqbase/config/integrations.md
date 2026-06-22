---
title: Config - 集成指南
description: Config 集成指南
tag:
  - fquant
  - fqbase
  - config

summary:
  purpose: integrations
---

# Config - 集成指南

## 阅读路径

🔵 **开发者**：README → integrations → configuration → architecture

## 1. Config + Cache

```python
from FQBase.Config import get_cache_config
from FQBase.Cache import create_cache

# 从配置创建缓存
config = get_cache_config()
cache = create_cache(config)
```

## 2. Config + DataStore

```python
from FQBase.Config import SETTING, get_database

# 获取数据库连接
uri = SETTING.get_mongo()
db = get_database()
```

## 3. Config + Infrastructure

```python
from FQBase.Config import get_env
from FQBase.Infrastructure import get_logger

# 根据配置初始化日志
log_level = get_env("LOG_LEVEL", default="INFO")
logger = get_logger(__name__)
```

## 相关文档

- [API参考](./api.md)
- [配置指南](./configuration.md)
