---
title: Config - 核心概念
description: 深入理解 Config 的核心概念
tag:
  - fquant
  - fqbase
  - config

summary:
  purpose: concepts
  core_concepts:
    - singleton
    - environment_variable
    - configuration_hierarchy
---

# Config - 核心概念

## 阅读路径

🟢🔵 **新手+开发者**：README → quick-start → concepts → api → usage

## 概述

Config 模块包含多个核心概念，理解这些概念对于正确使用配置系统至关重要。

## 概念1：单例模式 (Singleton)

### 概念解释

SETTING 和 GLOBALMAP 都采用单例模式，确保全局唯一实例。

### 代码示例

```python
from FQBase.Config import SETTING, GLOBALMAP

# 无需创建实例，直接使用
uri = SETTING.get_mongo()
path = GLOBALMAP.FQDATA_PATH
```

## 概念2：环境变量

### 概念解释

环境变量是配置的最高优先级，支持敏感信息管理和部署环境差异。

### 代码示例

```python
from FQBase.Config import get_env, get_secure_env

# 普通获取
debug = get_env("DEBUG", default="false")

# 安全获取（过滤占位符）
api_key = get_secure_env("API_KEY")
```

## 概念3：配置层级

### 概念解释

配置按优先级从高到低：环境变量 > .env 文件 > config.ini > 默认值

### 代码示例

```python
from FQBase.Config import SETTING

# SETTING.get_mongo() 内部按以下顺序获取：
# 1. 环境变量 MONGODB_URI
# 2. .env 文件中的 MONGODB_URI
# 3. config.ini [MONGODB] uri
# 4. 默认值 mongodb://localhost:27017
```

## 概念4：配置监听

### 概念解释

ConfigWatcher 监控配置文件变化，支持热更新。

### 代码示例

```python
from FQBase.Config import watch_config

def on_config_change(new_config):
    print(f"配置变更: {new_config}")

watcher = watch_config(["MONGODB_URI", "REDIS_HOST"])
watcher.add_callback(on_config_change)
```

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [API参考](./api.md)
