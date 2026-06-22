---
title: DataStore - API参考
description: DataStore API 参考文档
tag:
  - fquant
  - fqbase
  - datastore

summary:
  purpose: api-reference
  core_classes:
    - MongoDB
    - MongoConnection
    - MongoCollection
    - MongoIndexManager
    - MongoDatabaseAdmin
  core_functions:
    - get_mongo_db
---

# DataStore - API参考

## 阅读路径

🔵 **开发者**：README → api → usage → concepts → examples

## 类

### MongoDB

**位置：** `DataStore/mongo_db.py`

**描述：** MongoDB 门面类，统一入口

```python
from FQBase.DataStore import get_mongo_db

db = get_mongo_db(database="mydb")
```

#### 方法

##### insert_one

```python
result = db.insert_one(collection, document)
```

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| collection | str | 是 | - | 集合名 |
| document | Dict | 是 | - | 文档数据 |

**返回：** `InsertOneResult`

##### find_one

```python
document = db.find_one(collection, query, projection=None)
```

**返回：** `Optional[Dict]` - 匹配的文档

##### update_one

```python
result = db.update_one(collection, query, update, upsert=False)
```

**返回：** `UpdateResult`

##### delete_one

```python
result = db.delete_one(collection, query)
```

**返回：** `DeleteResult`

##### aggregate

```python
results = db.aggregate(collection, pipeline)
```

**返回：** `List[Dict]` - 聚合结果

##### ensure_index

```python
db.ensure_index(collection, keys, **kwargs)
```

---

### MongoCollection

**位置：** `DataStore/_collection.py`

**描述：** 数据操作类

---

### MongoIndexManager

**位置：** `DataStore/_index_manager.py`

**描述：** 索引管理类

```python
from FQBase.DataStore import MongoIndexManager

manager = MongoIndexManager(connection)
manager.create_index("users", [("name", 1)])
```

---

### MongoDatabaseAdmin

**位置：** `DataStore/_database_admin.py`

**描述：** 数据库运维类

---

### MongoConnection

**位置：** `DataStore/_connection.py`

**描述：** 连接管理类

---

## 函数

### get_mongo_db

**位置：** `DataStore/mongo_db.py#L190`

```python
from FQBase.DataStore import get_mongo_db

db = get_mongo_db(database="mydb")
```

**描述：** 获取 MongoDB 数据库实例（单例）

**返回：** `MongoDB`

---

### reset_mongo_db

**位置：** `DataStore/mongo_db.py#L194`

```python
from FQBase.DataStore import reset_mongo_db

reset_mongo_db()
```

**描述：** 重置全局 MongoDB 实例（清除所有连接）

**异常：** 无

---

### get_mongo_client_manager

**位置：** `FQBase.Infrastructure._mongo`

```python
from FQBase.DataStore import get_mongo_client_manager

manager = get_mongo_client_manager()
```

**描述：** 获取 MongoDB 客户端管理器实例（单例）

**返回：** `MongoClientManager`

---

### MongoClientManager

**位置：** `FQBase.Infrastructure._mongo`

**描述：** MongoDB 客户端管理器，负责管理多个 MongoClient 实例

```python
from FQBase.DataStore import MongoClientManager

manager = MongoClientManager()
```

---

## 相关文档

- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
- [配置指南](./configuration.md)
