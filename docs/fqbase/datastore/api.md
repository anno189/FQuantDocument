---
title: DataStore - API参考
description: DataStore MongoDB数据存储模块 API 参考文档
tag:
  - fqbase
  - datastore

summary:
  purpose: api-reference
  core_classes:
    - MongoDB
    - MongoClientManager
  core_functions:
    - get_mongo_db
    - get_mongo_client_manager
    - reset_mongo_db
---

# DataStore - API参考

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [技术架构](./architecture.md) → **[API参考](./api.md)** → [使用指南](./usage.md) |


## 函数

### get_mongo_db

```python
from FQBase.DataStore import get_mongo_db

db = get_mongo_db(database: str = "default", **kwargs) -> MongoDB
```

**描述：** 获取全局 MongoDB 单例实例

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| database | str | 否 | "default" | 数据库名称 |

**返回：** MongoDB 实例

**示例：**

```python
db = get_mongo_db(database="mydb")
```

---

### get_mongo_client_manager

```python
from FQBase.DataStore import get_mongo_client_manager

manager = get_mongo_client_manager() -> MongoClientManager
```

**描述：** 获取 MongoDB 客户端管理器

---

### reset_mongo_db

```python
from FQBase.DataStore import reset_mongo_db

reset_mongo_db()
```

**描述：** 重置全局 MongoDB 实例

---

## 类

### MongoDB

**描述：** MongoDB 通用操作类（单例模式）

```python
from FQBase.DataStore import MongoDB

db = MongoDB(database="mydb")
```

#### 方法

##### insert_one

```python
result = db.insert_one(collection: str, document: dict) -> InsertOneResult
```

**描述：** 插入单条记录

##### insert_many

```python
result = db.insert_many(collection: str, documents: List[dict]) -> InsertManyResult
```

**描述：** 插入多条记录

##### find

```python
results = db.find(collection: str, filter: dict, **kwargs) -> List[dict]
```

**描述：** 查询记录

##### find_one

```python
result = db.find_one(collection: str, filter: dict, **kwargs) -> dict
```

**描述：** 查询单条记录

##### update_one

```python
result = db.update_one(collection: str, filter: dict, update: dict, **kwargs) -> UpdateResult
```

**描述：** 更新单条记录

##### update_many

```python
result = db.update_many(collection: str, filter: dict, update: dict, **kwargs) -> UpdateResult
```

**描述：** 更新多条记录

##### delete_one

```python
result = db.delete_one(collection: str, filter: dict, **kwargs) -> DeleteResult
```

**描述：** 删除单条记录

##### delete_many

```python
result = db.delete_many(collection: str, filter: dict, **kwargs) -> DeleteResult
```

**描述：** 删除多条记录

##### find_as_dataframe

```python
df = db.find_as_dataframe(collection: str, filter: dict, **kwargs) -> DataFrame
```

**描述：** 查询并返回 DataFrame

---

### MongoClientManager

**描述：** MongoDB 客户端管理器

```python
from FQBase.DataStore import MongoClientManager

manager = MongoClientManager()
```

#### 方法

##### get_client

```python
client = manager.get_client(host: str = "localhost", port: int = 27017, **kwargs)
```

**描述：** 获取 MongoDB 客户端

---

## 相关文档

- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
