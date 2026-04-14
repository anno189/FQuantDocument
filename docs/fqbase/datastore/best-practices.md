---
title: DataStore - 最佳实践
description: DataStore MongoDB数据存储模块最佳实践与建议
tag:
  - fqbase
  - datastore
---

# DataStore - 最佳实践

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [API参考](./api.md) → [使用指南](./usage.md) → **[最佳实践](./best-practices.md)** |


## 概述

使用 DataStore MongoDB数据存储模块的最佳实践。

## 最佳实践

### 1. 使用单例获取实例

```python
# 好：使用单例
from FQBase.DataStore import get_mongo_db
db = get_mongo_db(database="mydb")

# 差：每次创建新实例
from FQBase.DataStore import MongoDB
db = MongoDB(database="mydb")
```

### 2. 批量操作使用 insert_many

```python
# 好：批量插入
documents = [{"name": f"user{i}"} for i in range(100)]
db.insert_many("users", documents)
```

### 3. 使用索引

```python
# 创建索引提高查询性能
db.create_index("users", "name")
```

---

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
