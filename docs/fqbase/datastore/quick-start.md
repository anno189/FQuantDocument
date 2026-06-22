---
title: DataStore - 快速入门
description: 5分钟快速上手 DataStore 模块
tag:
  - fquant
  - fqbase
  - datastore

summary:
  purpose: quick-start
  complexity: low
---

# DataStore - 快速入门

## 阅读路径

🟢 **新手入门**：README → quick-start → examples → concepts

## 概述

本快速入门指南将帮助您在 5 分钟内理解 DataStore 模块并开始使用。

## 前置要求

- Python 3.8+
- MongoDB 服务
- pymongo 库

## 5分钟上手

### Step 1: 获取数据库实例

```python
from FQBase.DataStore import get_mongo_db

db = get_mongo_db(database="mydb")
```

### Step 2: 插入数据

```python
db.insert_one("users", {"name": "test", "age": 25})
```

### Step 3: 查询数据

```python
user = db.find_one("users", {"name": "test"})
print(user)
```

### Step 4: 更新数据

```python
db.update_one("users", {"name": "test"}, {"$set": {"age": 30}})
```

## ⚠️ 常见陷阱

1. **直接导入 pymongo**
   - ❌ 错误做法：`from pymongo import MongoClient`
   - ✅ 正确做法：`from FQBase.DataStore import get_mongo_db`

2. **频繁创建连接**
   - ❌ 错误做法：每次操作创建新连接
   - ✅ 正确做法：使用单例 `get_mongo_db()`

## 下一步

- 学习 [核心概念](./concepts.md)
- 阅读 [API参考](./api.md)
- 查看 [使用指南](./usage.md)

## 相关文档

- [README](./README.md)
- [API参考](./api.md)
- [核心概念](./concepts.md)
