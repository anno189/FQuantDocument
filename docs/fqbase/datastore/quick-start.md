---
title: DataStore - 快速入门
description: 5分钟快速上手 DataStore MongoDB数据存储模块
tag:
  - fqbase
  - datastore

summary:
  purpose: quick-start
  complexity: low
---

# DataStore - 快速入门

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → **[快速入门](./quick-start.md)** → [速查表](./cheatsheet.md) → [使用指南](./usage.md) |


## 概述

5分钟快速上手 DataStore MongoDB数据存储模块。

## 前置要求

- Python 3.8+
- MongoDB 服务器

## 安装

```bash
pip install pymongo
```

## 5分钟上手

### Step 1: 导入模块

```python
from FQBase.DataStore import get_mongo_db
```

### Step 2: 获取数据库实例

```python
db = get_mongo_db(database="mydb")
```

### Step 3: 执行 CRUD 操作

```python
# 插入数据
db.insert_one("users", {"name": "test", "age": 25})

# 查询数据
users = db.find("users", {"age": {"$gte": 18}})
```

### Step 4: 完成！

## ⚠️ 常见陷阱

1. **陷阱 1：忘记设置数据库名**
   - ✅ 正确：指定 database 参数

## 下一步

- 学习 [核心概念](./concepts.md)
- 查看 [使用指南](./usage.md)

## 相关文档

- [README](./README.md)
- [使用指南](./usage.md)
