---
title: DataStore - 使用指南
description: DataStore 详细使用指南
tag:
  - fquant
  - fqbase
  - datastore

summary:
  purpose: usage
---

# DataStore - 使用指南

## 阅读路径

🔵 **开发者**：README → api → usage → concepts → examples

## 概述

本指南详细说明如何在各种场景下使用 DataStore 模块。

## 基本用法

### 获取数据库实例

```python
from FQBase.DataStore import get_mongo_db

db = get_mongo_db(database="mydb")
```

### 插入数据

```python
db.insert_one("users", {"name": "test", "age": 25})
db.insert_many("users", [
    {"name": "user1", "age": 20},
    {"name": "user2", "age": 30}
])
```

## 常见用例

### 用例 1: 查询数据

```python
user = db.find_one("users", {"name": "test"})
users = db.find("users", {"age": {"$gte": 18}})
```

### 用例 2: 更新数据

```python
db.update_one("users", {"name": "test"}, {"$set": {"age": 30}})
db.update_many("users", {"status": "inactive"}, {"$set": {"status": "archived"}})
```

### 用例 3: 聚合查询

```python
pipeline = [
    {"$match": {"status": "active"}},
    {"$group": {"_id": "$category", "total": {"$sum": "$amount"}}}
]
results = db.aggregate("orders", pipeline)
```

## 相关文档

- [API参考](./api.md)
- [最佳实践](./best-practices.md)
- [故障排查](./troubleshooting.md)
