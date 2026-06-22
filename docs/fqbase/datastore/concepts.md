---
title: DataStore - 核心概念
description: 深入理解 DataStore 的核心概念
tag:
  - fquant
  - fqbase
  - datastore

summary:
  purpose: concepts
  core_concepts:
    - facade
    - crud
    - aggregation
    - index
---

# DataStore - 核心概念

## 阅读路径

🟢🔵 **新手+开发者**：README → quick-start → concepts → api → usage

## 概述

DataStore 模块包含多个核心概念，理解这些概念对于正确使用数据存储至关重要。

## 概念1：门面模式 (Facade)

### 概念解释

门面模式为复杂子系统提供简化接口。

### 代码示例

```python
from FQBase.DataStore import get_mongo_db

db = get_mongo_db(database="mydb")
db.insert_one("users", {"name": "test"})
```

## 概念2：CRUD 操作

### 概念解释

Create（创建）、Read（读取）、Update（更新）、Delete（删除）。

### 代码示例

```python
db.insert_one("users", {"name": "test"})
db.find_one("users", {"name": "test"})
db.update_one("users", {"name": "test"}, {"$set": {"age": 30}})
db.delete_one("users", {"name": "test"})
```

## 概念3：聚合 (Aggregation)

### 概念解释

对数据进行 pipeline 处理、统计分析。

### 代码示例

```python
pipeline = [
    {"$match": {"status": "active"}},
    {"$group": {"_id": "$category", "count": {"$sum": 1}}}
]
results = db.aggregate("orders", pipeline)
```

## 概念4：索引 (Index)

### 概念解释

提高查询性能的数据库结构。

### 代码示例

```python
db.ensure_index("users", [("name", 1), ("age", -1)])
```

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [API参考](./api.md)
