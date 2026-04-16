---
title: Base - 快速入门
description: 5分钟快速上手 Base 基础配置模块
tag:
  - fqbase
  - config

summary:
  purpose: quick-start
  complexity: low
---

# Base - 快速入门

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → **[快速入门](./quick-start.md)** → [速查表](./cheatsheet.md) → [动手实验室](./workshop.md) → [使用指南](./usage.md) → [案例库](./examples.md) |

## 概述

5分钟快速上手 Base 基础配置模块

## 前置要求

- Python 3.8+
- pip
- MongoDB（可选）
- Redis（可选）

## 安装

```bash
pip install fquant-fqbase
```

## 5分钟上手

### Step 1: 导入模块

```python
from FQBase.Config.base import get_env, SETTING, CacheConfig
```

### Step 2: 获取环境变量

```python
# 获取环境变量（带默认值）
debug = get_env('DEBUG', False)
db_url = get_env('MONGODB_URL', 'mongodb://localhost:27017')

print(f"调试模式: {debug}")
print(f"数据库地址: {db_url}")
```

### Step 3: 获取数据库配置

```python
# 获取 MongoDB 配置
mongo_uri = SETTING.get_mongo()
print(f"MongoDB URI: {mongo_uri}")
```

### Step 4: 配置缓存

```python
# 配置缓存
cache_config = CacheConfig()
cache_type = cache_config.get_type()
print(f"缓存类型: {cache_type}")
```

### Step 5: 完成！

恭喜！你已经学会了 Base 基础配置模块的基本用法。

## ⚠️ 常见陷阱

1. **陷阱 1：SETTING 是单例**
   - ❌ 错误做法：`setting = Setting()`
   - ✅ 正确做法：`setting = SETTING  # 使用单例实例`

2. **陷阱 2：DATABASE 需要初始化**
   - ❌ 错误做法：直接使用 DATABASE 而不初始化
   - ✅ 正确做法：先调用 load_env() 初始化环境

3. **陷阱 3：缓存配置不支持动态切换**
   - ❌ 错误做法：运行时更改缓存类型
   - ✅ 正确做法：在应用启动时设置好缓存配置

## 下一步

- 学习 [核心概念](./concepts.md)
- 阅读 [术语表](./glossary.md)
- 查看 [使用指南](./usage.md)

## 相关文档

- [README](./README.md)
- [术语表](./glossary.md)
- [核心概念](./concepts.md)
- [使用指南](./usage.md)
