---
title: DataStore - 常见问题
description: DataStore MongoDB数据存储模块常见问题与解答
tag:
  - fqbase
  - datastore
---

# DataStore - 常见问题

## 一般问题

### Q: 如何连接远程 MongoDB？

**A:**

```python
from FQBase.DataStore import get_mongo_db

db = get_mongo_db(
    database="mydb",
    host="remote.host.com",
    port=27017,
    username="user",
    password="password"
)
```

### Q: 如何重置连接？

**A:**

```python
from FQBase.DataStore import reset_mongo_db

reset_mongo_db()
db = get_mongo_db(database="mydb")
```

---

## 相关文档

- [API参考](./api.md)
