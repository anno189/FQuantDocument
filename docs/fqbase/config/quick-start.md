---
title: Config - 快速入门
description: 5分钟快速上手 FQBase 配置中心
tag:
  - fqbase
  - config

summary:
  purpose: quick-start
  complexity: low
---

# Config - 快速入门

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → **[快速入门](./quick-start.md)** → [速查表](./cheatsheet.md) → [使用指南](./usage.md) → [案例库](./examples.md) |


## 概述

5分钟快速上手 FQBase 配置中心，掌握环境变量、数据库配置、缓存配置和配置监听的核心用法。

## 前置要求

- Python 3.8+
- pip
- MongoDB（可选，用于数据库配置）

## 安装

```bash
pip install fquant-fqbase
```

## 5分钟上手

### Step 1: 导入配置模块

```python
from FQBase.Config import (
    get_env,
    SETTING,
    CacheConfig,
    load_env,
)
```

### Step 2: 加载环境变量

```python
# 加载 .env 文件
load_env()

# 获取环境变量
debug_mode = get_env('DEBUG', False)
mongo_uri = get_env('MONGODB_URL', 'mongodb://localhost:27017')
```

### Step 3: 获取数据库配置

```python
# 获取 MongoDB 连接配置
mongo_uri = SETTING.get_mongo()
print(f"MongoDB URI: {mongo_uri}")
```

### Step 4: 配置缓存

```python
# 配置 Redis 缓存
cache_config = CacheConfig(cache_type='redis')
print(f"缓存类型: {cache_config.cache_type}")
```

### Step 5: 监听配置变化

```python
from FQBase.Config import ConfigWatcher

watcher = ConfigWatcher()
watcher.watch('database', callback=lambda: print("配置已变更"))
```

### 完成！

恭喜！你已经掌握了 Config 配置中心的基本用法。

## ⚠️ 常见陷阱

1. **陷阱 1：环境变量未加载**
   - ❌ 错误做法：直接使用 `get_env()` 但未先调用 `load_env()`
   - ✅ 正确做法：先调用 `load_env()` 加载配置文件

2. **陷阱 2：SETTING 是单例**
   - ❌ 错误做法：每次都创建新的 SETTING 实例
   - ✅ 正确做法：直接使用 `from FQBase.Config import SETTING`

3. **陷阱 3：DATABASE 未初始化**
   - ❌ 错误做法：在应用启动前使用 DATABASE
   - ✅ 正确做法：在应用启动时确保数据库已连接

## 下一步

- 学习 [核心概念](./concepts.md)
- 阅读 [术语表](./glossary.md)
- 查看 [使用指南](./usage.md)
- 参考 [案例库](./examples.md)

## 相关文档

- [README](./README.md)
- [术语表](./glossary.md)
- [核心概念](./concepts.md)
- [使用指南](./usage.md)
- [API参考](./api.md)
