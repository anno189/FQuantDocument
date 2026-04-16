---
title: Base - 动手实验室
description: Base 基础配置模块动手练习指南
tag:
  - fqbase
  - config
---

# Base - 动手实验室

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [速查表](./cheatsheet.md) → **[动手实验室](./workshop.md)** → [使用指南](./usage.md) → [案例库](./examples.md) |

## 概述

通过动手练习掌握 Base 模块

## 准备环境

```bash
pip install fquant-fqbase
```

## Lab 1: 环境变量

### 目标

学会使用环境变量管理配置

### 练习代码

```python
from FQBase.Config.base import load_env, get_env

# 1. 创建 .env 文件
# DEBUG=true
# MONGODB_URL=mongodb://localhost:27017

# 2. 加载环境变量
load_env()

# 3. 读取变量
debug = get_env('DEBUG', False)
print(f"Debug: {debug}")
```

### 任务

1. 创建 .env 文件
2. 加载环境变量
3. 读取并打印配置

## Lab 2: MongoDB 配置

### 目标

学会使用 SETTING 获取 MongoDB 配置

### 练习代码

```python
from FQBase.Config.base import SETTING

# 获取 MongoDB 配置
mongo_uri = SETTING.get_mongo()
print(f"MongoDB: {mongo_uri}")
```

### 任务

1. 确保 MongoDB 运行
2. 获取配置并打印

## Lab 3: 缓存配置

### 目标

学会配置缓存

### 练习代码

```python
from FQBase.Config.base import get_cache_config, CacheType

config = get_cache_config()
print(f"Cache type: {config.get_type()}")
```

### 任务

1. 配置 Redis 缓存
2. 验证配置生效

## 实验室总结

完成所有实验后，你应该掌握：

- [x] 环境变量加载和读取
- [x] MongoDB 配置获取
- [x] 缓存配置管理

## 下一步

- 学习 [最佳实践](./best-practices.md)
- 查看 [案例库](./examples.md)
- 阅读 [API参考](./api.md)

## 相关文档

- [README](./README.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
- [API参考](./api.md)
