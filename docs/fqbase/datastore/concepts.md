---
title: DataStore - 核心概念
description: 深入理解 DataStore MongoDB数据存储模块的核心概念
tag:
  - fqbase
  - datastore
---

# DataStore - 核心概念

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [术语表](./glossary.md) → **[核心概念](./concepts.md)** → [技术架构](./architecture.md) |


## 概述

深入理解 DataStore MongoDB数据存储模块的核心概念。

## 概念 1: MongoDB 操作

### 概念解释

MongoDB 提供 CRUD 操作的封装，简化数据库操作。

### 代码示例

```python
from FQBase.DataStore import get_mongo_db

db = get_mongo_db(database="mydb")

# 插入
db.insert_one("users", {"name": "test"})

# 查询
users = db.find("users", {})

# 更新
db.update_one("users", {"name": "test"}, {"$set": {"age": 30}})

# 删除
db.delete_one("users", {"name": "test"})
```

## 概念 2: 单例模式

### 概念解释

MongoDB 使用单例模式全局管理数据库连接。

### 代码示例

```python
from FQBase.DataStore import get_mongo_db, reset_mongo_db

# 获取实例（始终是同一个）
db1 = get_mongo_db()
db2 = get_mongo_db()
# db1 和 db2 是同一个实例

# 重置实例
reset_mongo_db()
```

## 概念 3: 客户端管理

### 概念解释

MongoClientManager 管理多个 MongoDB 客户端连接。

### 代码示例

```python
from FQBase.DataStore import get_mongo_client_manager

manager = get_mongo_client_manager()
```

---

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [使用指南](./usage.md)
