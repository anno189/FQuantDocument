---
title: Config - 术语表
description: FQBase 配置中心术语定义与解释
tag:
  - fqbase
  - config
---

# Config - 术语表

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → **[术语表](./glossary.md)** → [核心概念](./concepts.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) |

## 子模块术语表

| 子模块 | 术语表 | 说明 |
|--------|---------|------|
| base | [术语表](./base/glossary.md) | 基础配置术语 |
| business | [术语表](./business/glossary.md) | 业务配置术语 |


## 概述

配置中心的核心术语定义，帮助理解配置管理的基本概念。

## 术语

### 环境变量

**定义：** 操作系统级别的键值对，用于存储配置信息

**示例：**

```python
# .env 文件
DEBUG=true
MONGODB_URL=mongodb://localhost:27017
```

### 单例模式

**定义：** 设计模式，确保一个类只有一个实例

**示例：**

```python
from FQBase.Config import SETTING
# 多次导入获取同一实例
```

### 懒加载

**定义：** 延迟初始化策略，只在首次使用时才创建对象

**示例：**

```python
from FQBase.Config import DATABASE
# 首次访问时才建立数据库连接
```

### 配置监听

**定义：** 监听配置变化并触发回调的机制

**示例：**

```python
watcher.watch('database', callback=on_change)
```

### 缓存类型

**定义：** 缓存后端的类型，目前支持 Redis 和 MongoDB

**值：**
- `redis`: Redis 缓存
- `mongo`: MongoDB 缓存

### 路径配置

**定义：** 应用中各类目录路径的集中管理

**类型：**
- FQDATA_PATH: 数据目录
- SETTING_PATH: 设置目录
- CACHE_PATH: 缓存目录
- LOG_PATH: 日志目录

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [核心概念](./concepts.md)
- [使用指南](./usage.md)
