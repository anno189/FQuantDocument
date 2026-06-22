---
title: DataStore - 案例库
description: DataStore 实际应用场景、动手实验与案例研究
tag:
  - fquant
  - fqbase
  - datastore

summary:
  purpose: examples
---

# DataStore - 案例库

## 阅读路径

🟢🔵 **新手+开发者**：README → examples → api → usage

## 业务场景案例

### 场景 1: 用户数据管理

**业务需求：** 管理用户基本信息

```python
from FQBase.DataStore import get_mongo_db

db = get_mongo_db(database="myapp")

def create_user(name, email, age):
    db.insert_one("users", {"name": name, "email": email, "age": age})

def get_user(name):
    return db.find_one("users", {"name": name})

def update_user(name, **kwargs):
    db.update_one("users", {"name": name}, {"$set": kwargs})
```

## 动手实验

### Lab 1: 实现订单统计

**目标：** 统计订单数据

```python
from FQBase.DataStore import get_mongo_db

db = get_mongo_db(database="ecommerce")

pipeline = [
    {"$match": {"status": "completed"}},
    {"$group": {
        "_id": "$category",
        "count": {"$sum": 1},
        "total_amount": {"$sum": "$amount"}
    }}
]
results = db.aggregate("orders", pipeline)
```

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
