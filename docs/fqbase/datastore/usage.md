---
title: DataStore - 使用指南
description: DataStore MongoDB数据存储模块详细使用指南
tag:
  - fqbase
  - datastore
---

# DataStore - 使用指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [技术架构](./architecture.md) → [API参考](./api.md) → **[使用指南](./usage.md)** |


## 概述

详细介绍如何使用 DataStore MongoDB数据存储模块。

## 基本用法

### 初始化

```python
from FQBase.DataStore import get_mongo_db

db = get_mongo_db(database="mydb")
```

### 插入数据

```python
# 插入单条
db.insert_one("users", {"name": "test", "age": 25})

# 插入多条
db.insert_many("users", [
    {"name": "user1", "age": 20},
    {"name": "user2", "age": 30},
])
```

### 查询数据

```python
# 查询所有
users = db.find("users", {})

# 条件查询
users = db.find("users", {"age": {"$gte": 18}})

# 查询单条
user = db.find_one("users", {"name": "test"})
```

### 更新数据

```python
# 更新单条
db.update_one("users", {"name": "test"}, {"$set": {"age": 30}})

# 更新多条
db.update_many("users", {"age": {"$lt": 18}}, {"$set": {"status": "minor"}})
```

### 删除数据

```python
# 删除单条
db.delete_one("users", {"name": "test"})

# 删除多条
db.delete_many("users", {"status": "inactive"})
```

## 转换为 DataFrame

```python
import pandas as pd

df = db.find_as_dataframe("users", {"age": {"$gte": 18}})
print(df)
```

---

## 相关文档

- [API参考](./api.md)
- [最佳实践](./best-practices.md)
