---
title: Base - 核心概念
description: 深入理解 Base 基础配置模块的核心概念
tag:
  - fqbase
  - config
---

# Base - 核心概念

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [术语表](./glossary.md) → **[核心概念](./concepts.md)** → [框架集成](./framework.md) → [技术架构](./architecture.md) |
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → **[核心概念](./concepts.md)** → [设计原则](./design.md) → [API参考](./api.md) |

## 概述

Base 基础配置模块核心概念深入理解

## 概念 1: 环境变量管理

### 概念解释

环境变量管理提供了一种安全、便捷的配置管理方式，支持默认值、类型转换和安全变量。

### 原理

- 从 `os.environ` 读取变量
- 支持默认值设置
- 支持类型自动转换

### 代码示例

```python
from FQBase.Config.base import get_env, load_env

# 加载环境变量
load_env()

# 获取环境变量
debug = get_env('DEBUG', False)
db_url = get_env('MONGODB_URL', 'mongodb://localhost:27017')
```

## 概念 2: MongoDB 配置单例

### 概念解释

使用单例模式管理 MongoDB 连接配置，确保全局唯一实例。

### 原理

- 单例模式：全局只有一个 SETTING 实例
- 延迟加载：首次访问时初始化
- 线程安全：使用锁机制

### 代码示例

```python
from FQBase.Config.base import SETTING

# 获取 MongoDB 配置
mongo_uri = SETTING.get_mongo()
```

## 概念 3: 缓存配置

### 概念解释

支持多种缓存类型（Redis、MongoDB）的配置管理。

### 原理

- 缓存类型：Redis、MongoDB
- 配置验证：确保配置值合法
- 懒加载：按需初始化缓存

### 代码示例

```python
from FQBase.Config.base import CacheConfig, get_cache_config

# 获取缓存配置
config = get_cache_config()
cache_type = config.get_type()
```

## 概念 4: 配置监听

### 概念解释

监控配置文件变化并自动触发回调函数。

### 原理

- 文件监控：使用文件系统监听器
- 回调机制：变化时触发回调
- 延迟处理：避免频繁触发

### 代码示例

```python
from FQBase.Config.base import watch_config

@watch_config('config.yaml')
def on_config_change(config):
    print(f"配置已更新: {config}")
```

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [术语表](./glossary.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
