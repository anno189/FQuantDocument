---
title: DataStore - 集成指南
description: DataStore 集成指南
tag:
  - fquant
  - fqbase
  - datastore

summary:
  purpose: integrations
---

# DataStore - 集成指南

## 阅读路径

🔵 **开发者**：README → integrations → configuration → architecture

## 1. DataStore + Config

```python
from FQBase.DataStore import get_mongo_db
from FQBase.Config import SETTING

uri = SETTING.get_mongo()
db = get_mongo_db(database="mydb")
```

## 2. DataStore + Cache

```python
from FQBase.DataStore import get_mongo_db
from FQBase.Cache import create_cache

db = get_mongo_db(database="mydb")
cache = create_cache()

def get_user(user_id):
    cache_key = f"user:{user_id}"
    user = cache.get(cache_key)
    if not user:
        user = db.find_one("users", {"_id": user_id})
        cache.set(cache_key, user, ttl=3600)
    return user
```

## 3. DataStore + FQData

```python
from FQBase.DataStore import get_mongo_db

db = get_mongo_db(database="fqdata")
db.insert_one("daily", stock_data)
```

## 相关文档

- [API参考](./api.md)
- [配置指南](./configuration.md)
