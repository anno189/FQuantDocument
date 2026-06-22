---
title: Config - 术语表
description: Config 术语定义与解释
tag:
  - fquant
  - fqbase
  - config

summary:
  purpose: glossary
---

# Config - 术语表

## 阅读路径

🟢 **新手**：README → glossary → quick-start → usage

## 概述

本文档定义了 Config 模块中使用的核心术语。

## 术语

### 单例模式 (Singleton)

**定义：** 确保一个类只有一个实例，并提供全局访问点。

**示例：**

```python
from FQBase.Config import SETTING

# 全局唯一实例
uri = SETTING.get_mongo()
```

### 环境变量 (Environment Variable)

**定义：** 操作系统级别的键值对，用于配置应用程序。

**示例：**

```python
import os
mongo_uri = os.getenv("MONGODB_URI")
```

### 配置层级 (Configuration Hierarchy)

**定义：** 配置的优先级顺序。

**优先级：** 环境变量 > .env 文件 > config.ini > 默认值

### 配置监听 (Configuration Watching)

**定义：** 监控配置文件变化并触发回调。

**示例：**

```python
from FQBase.Config import watch_config

watcher = watch_config(["MONGODB_URI"])
watcher.add_callback(callback)
```

### 懒加载 (Lazy Loading)

**定义：** 延迟到首次使用时才加载资源。

**示例：**

```python
from FQBase.Config import get_database

# 首次调用时才初始化数据库
db = get_database()
```

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [核心概念](./concepts.md)
