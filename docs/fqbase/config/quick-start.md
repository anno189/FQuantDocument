---
title: Config - 快速入门
description: 5分钟快速上手 Config 模块
tag:
  - fquant
  - fqbase
  - config

summary:
  purpose: quick-start
  complexity: low
---

# Config - 快速入门

## 阅读路径

🟢 **新手入门**：README → quick-start → examples → concepts

## 概述

本快速入门指南将帮助您在 5 分钟内理解 Config 模块并开始使用。

## 前置要求

- Python 3.8+
- .env 文件（可选，用于开发环境）

## 5分钟上手

### Step 1: 获取环境变量

```python
from FQBase.Config import get_env

# 获取环境变量
mongo_uri = get_env("MONGODB_URI", default="mongodb://localhost:27017")
```

### Step 2: 获取 MongoDB 配置

```python
from FQBase.Config import SETTING

# 获取 MongoDB URI
uri = SETTING.get_mongo()
print(f"MongoDB URI: {uri}")
```

### Step 3: 获取路径配置

```python
from FQBase.Config import GLOBALMAP

# 获取各种路径
data_path = GLOBALMAP.FQDATA_PATH
cache_path = GLOBALMAP.CACHE_PATH
log_path = GLOBALMAP.LOG_PATH
```

### Step 4: 获取缓存配置

```python
from FQBase.Config import get_cache_config

# 获取缓存配置
config = get_cache_config()
print(f"缓存类型: {config.cache_type}")
```

## ⚠️ 常见陷阱

1. **直接导入单例**
   - ❌ 错误做法：`from FQBase.Config import Setting; s = Setting()`
   - ✅ 正确做法：`from FQBase.Config import SETTING; uri = SETTING.get_mongo()`

2. **环境变量未加载**
   - ❌ 错误做法：直接使用 `get_env()` 但 .env 文件不存在
   - ✅ 正确做法：确保 .env 文件存在或使用默认值

3. **硬编码路径**
   - ❌ 错误做法：`path = "/data/fquant"`
   - ✅ 正确做法：`path = GLOBALMAP.FQDATA_PATH`

## 下一步

- 学习 [核心概念](./concepts.md)
- 阅读 [API参考](./api.md)
- 查看 [使用指南](./usage.md)

## 相关文档

- [README](./README.md)
- [API参考](./api.md)
- [核心概念](./concepts.md)
