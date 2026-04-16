---
title: Config - 核心概念
description: 深入理解 FQBase 配置中心的核心概念
tag:
  - fqbase
  - config
---

# Config - 核心概念

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [术语表](./glossary.md) → **[核心概念](./concepts.md)** → [框架集成](./framework.md) → [技术架构](./architecture.md) |
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → **[核心概念](./concepts.md)** → [设计原则](./design.md) → [API参考](./api.md) |

## 子模块核心概念

| 子模块 | 核心概念 | 说明 |
|--------|----------|------|
| base | [核心概念](./base/concepts.md) | 环境变量、数据库配置、缓存配置 |
| business | [核心概念](./business/concepts.md) | 数据源配置、IP列表管理 |


## 概述

深入理解配置中心的核心概念，包括环境管理、单例模式、懒加载、配置监听等设计思想。

## 概念 1: 环境变量管理

### 概念解释

环境变量管理是配置中心的基础功能，提供统一的接口来获取和设置环境变量。

### 原理

- 使用 `load_env()` 加载 `.env` 文件到环境变量
- 使用 `get_env()` 安全获取环境变量，支持默认值
- 使用 `get_secure_env()` 获取敏感信息（不记录日志）

### 代码示例

```python
from FQBase.Config import load_env, get_env, get_secure_env

# 加载环境变量
load_env()

# 获取普通配置
debug = get_env('DEBUG', False)
db_url = get_env('MONGODB_URL', 'mongodb://localhost:27017')

# 获取敏感配置（不会被记录到日志）
api_key = get_secure_env('API_KEY')
```

## 概念 2: 单例模式

### 概念解释

SETTING、DATABASE 等核心配置采用单例模式，确保全局唯一性。

### 原理

- 使用 Python 模块级别的单例
- 第一次导入时初始化，后续导入返回同一实例
- 修改配置后全局生效

### 代码示例

```python
from FQBase.Config import SETTING

# 多次导入获取的是同一实例
s1 = SETTING
s2 = SETTING
print(s1 is s2)  # True
```

## 概念 3: 懒加载

### 概念解释

DATABASE 采用懒加载模式，只在首次使用时才建立数据库连接。

### 原理

- 首次访问 DATABASE 属性时触发初始化
- 避免应用启动时不必要的数据库连接
- 支持异步和同步两种模式

### 代码示例

```python
from FQBase.Config import DATABASE

# 首次访问时建立连接
db = DATABASE  # 触发懒加载
print(db.name)  # 使用数据库
```

## 概念 4: 配置监听

### 概念解释

ConfigWatcher 提供配置变更监听能力，支持回调机制。

### 原理

- 注册监听器到配置项
- 当配置变化时触发回调
- 支持热更新场景

### 代码示例

```python
from FQBase.Config import ConfigWatcher

def on_config_change(key, value):
    print(f"配置 {key} 已变更为 {value}")

watcher = ConfigWatcher()
watcher.watch('database', callback=on_config_change)
```

## 概念 5: 缓存配置

### 概念解释

CacheConfig 提供统一的缓存配置管理，支持多种缓存类型。

### 原理

- 支持 Redis 和 MongoDB 两种缓存后端
- 配置一次，全局复用
- 提供缓存参数统一获取接口

### 代码示例

```python
from FQBase.Config import CacheConfig, get_cache_config

# 创建缓存配置
config = CacheConfig(cache_type='redis', ttl=3600)

# 获取全局缓存配置
global_config = get_cache_config()
```

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [术语表](./glossary.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
