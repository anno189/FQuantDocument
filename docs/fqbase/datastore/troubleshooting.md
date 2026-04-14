---
title: DataStore - 故障排查
description: DataStore MongoDB数据存储模块常见问题与解决方案
tag:
  - fqbase
  - datastore
---

# DataStore - 故障排查

## 概述

DataStore MongoDB数据存储模块的常见问题和解决方案。

## 常见问题

### 问题 1: 连接失败

**症状：** 无法连接到 MongoDB

**解决方案：**

1. 检查 MongoDB 服务是否启动
2. 检查连接参数

```python
from FQBase.DataStore import get_mongo_db

db = get_mongo_db(
    database="mydb",
    host="localhost",
    port=27017
)
```

---

### 问题 2: 数据库不存在

**症状：** 提示数据库不存在

**解决方案：** MongoDB 会自动创建数据库，无需手动创建

---

## 相关文档

- [常见问题](./faq.md)
