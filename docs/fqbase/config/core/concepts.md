---
title: Core - 核心概念
description: 深入理解 Core 核心配置模块的核心概念
tag:
  - fqbase
  - config
---

# Core - 核心概念

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [术语表](./glossary.md) → **[核心概念](./concepts.md)** → [技术架构](./architecture.md) |


## 概述

深入理解 Core 核心配置模块的核心概念。

## 概念 1: 环境变量管理

### 概念解释

环境变量管理通过 `EnvManager` 单例类实现，统一管理 .env 文件的加载和读取。

### 原理

1. 使用单例模式确保全局唯一
2. 支持 override=False 避免覆盖系统环境变量
3. 支持敏感信息占位符检测

### 代码示例

```python
from FQBase.Config.core import load_env, get_env, reload_env

# 加载
load_env()

# 读取
value = get_env('KEY_NAME', 'default')

# 重载
reload_env()
```

## 概念 2: 缓存配置

### 概念解释

缓存配置管理多种缓存类型（内存、Redis 等），提供统一的配置接口。

### 原理

1. 使用 CacheConfig 类封装配置
2. 支持多种缓存类型
3. 提供配置验证

### 代码示例

```python
from FQBase.Config.core import CacheConfig, get_cache_config

config = get_cache_config()
print(config)
```

## 概念 3: 配置监听

### 概念解释

配置监听机制允许应用在配置文件变化时自动更新配置。

### 原理

1. 使用文件监听器监控配置
2. 支持热更新
3. 提供回调机制

### 代码示例

```python
from FQBase.Config.core import ConfigWatcher

watcher = ConfigWatcher('config.yaml')
watcher.start()
```

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [术语表](./glossary.md)
- [使用指南](./usage.md)
