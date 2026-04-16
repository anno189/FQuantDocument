---
title: Base - 术语表
description: Base 基础配置模块术语定义与解释
tag:
  - fqbase
  - config
---

# Base - 术语表

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → **[术语表](./glossary.md)** → [核心概念](./concepts.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) |

## 概述

Base 基础配置模块术语定义

## 术语

### 环境变量

**定义：** 操作系统级别的变量，用于存储配置信息

**示例：**

```python
import os
os.environ['DEBUG'] = 'true'
```

### MongoDB

**定义：** NoSQL 数据库，用于存储应用数据

**示例：**

```python
from pymongo import MongoClient
client = MongoClient('mongodb://localhost:27017/')
```

### 缓存

**定义：** 临时存储数据的高速存储区域

**示例：**

```python
cache_config = CacheConfig()
```

### 配置监听

**定义：** 监控配置文件变化并自动重新加载的机制

**示例：**

```python
watcher = ConfigWatcher()
watcher.start()
```

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [核心概念](./concepts.md)
- [使用指南](./usage.md)
