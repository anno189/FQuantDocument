---
title: DataStore - 集成指南
description: DataStore MongoDB数据存储模块第三方集成指南
tag:
  - fqbase
  - datastore
---

# DataStore - 集成指南

## 概述

DataStore MongoDB数据存储模块的集成指南。

## Pandas 集成

```python
import pandas as pd
from FQBase.DataStore import get_mongo_db

db = get_mongo_db(database="mydb")

# 查询为 DataFrame
df = db.find_as_dataframe("users", {})

# 数据处理
df = df[df['age'] >= 18]
```

## PyMongo 集成

```python
from pymongo import MongoClient
from FQBase.DataStore import get_mongo_client_manager

manager = get_mongo_client_manager()
client = manager.get_client()

# 使用原生 pymongo
db = client["mydb"]
```

---

## 相关文档

- [API参考](./api.md)
