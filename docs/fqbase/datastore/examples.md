---
title: DataStore - 案例库
description: DataStore MongoDB数据存储模块实际应用场景与示例
tag:
  - fqbase
  - datastore
---

# DataStore - 案例库

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [使用指南](./usage.md) → **[案例库](./examples.md)** |


## 概述

DataStore MongoDB数据存储模块的实际应用场景。

## 示例

### 示例：用户管理

```python
from FQBase.DataStore import get_mongo_db

db = get_mongo_db(database="myapp")

# 创建用户
db.insert_one("users", {"name": "test", "email": "test@example.com"})

# 查询用户
user = db.find_one("users", {"name": "test"})

# 更新用户
db.update_one("users", {"name": "test"}, {"$set": {"email": "new@example.com"}})

# 删除用户
db.delete_one("users", {"name": "test"})
```

---

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
