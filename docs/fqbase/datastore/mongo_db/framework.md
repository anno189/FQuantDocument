# MongoDB 框架文档

**模块路径**: `FQBase.DataStore.mongo_db`
**源码**: [mongo_db.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/DataStore/mongo_db.py)

---

## 一、概述

### 1.1 什么是 MongoDB 模块

MongoDB 是 FQBase 框架的 **MongoDB 数据库操作**模块，提供统一的数据库操作接口，支持完整的 CRUD、聚合查询、索引管理和事务操作。

**解决的问题**：
- MongoDB 连接管理复杂，容易出现连接泄漏
- 缺乏统一的异常处理和错误日志
- 数据操作代码分散，难以维护
- 缺乏对 DataFrame 的直接支持

**核心价值**：
- **单例模式**：全局共享连接，避免重复创建
- **线程安全**：支持多线程并发操作
- **自动重连**：连接断开后自动尝试重连
- **DataFrame 支持**：查询结果直接转为 pandas DataFrame
- **统一异常**：自定义异常类型，便于错误处理

### 1.2 模块组件

| 组件 | 类型 | 说明 |
|------|------|------|
| `MongoDB` | 类 | MongoDB 通用操作类（单例模式） |
| `get_mongo_db()` | 函数 | 获取全局单例实例 |
| `reset_mongo_db()` | 函数 | 重置单例实例 |

### 1.3 操作分类

| 分类 | 操作 |
|------|------|
| **CRUD** | `insert_one`, `insert_many`, `find`, `find_one`, `update_one`, `update_many`, `delete_one`, `delete_many` |
| **查询** | `find_by_id`, `find_as_dataframe`, `find_by_page`, `count`, `exists`, `distinct` |
| **聚合** | `aggregate`, `group` |
| **索引** | `create_index`, `create_indexes`, `list_indexes`, `drop_index`, `drop_all_indexes` |
| **集合** | `list_collections`, `create_collection`, `drop_collection`, `rename_collection` |
| **数据库** | `command`, `get_database_stats`, `get_server_status`, `clear_cache`, `compact_database`, `rotate_logs` |
| **性能** | `find_with_profiling`, `aggregate_with_profiling` |
| **事务** | `with_transaction`, `bulk_write` |

---

## 二、核心特性

### 2.1 连接管理

```python
class MongoDB:
    def __init__(
        self,
        uri: str = None,
        database: str = "quantaxis",
        max_pool_size: int = 50,
        min_pool_size: int = 10,
        server_selection_timeout_ms: int = 5000,
        connect_timeout_ms: int = 5000,
        socket_timeout_ms: int = 30000,
    ):
```

**特性**：
- 连接池管理（最大 50，最小 10）
- 自动 URI 解析（支持环境变量 `MONGODB_URI`、`MONGODB`）
- 密码脱敏日志（避免泄露敏感信息）

### 2.2 自动重连

```python
def _ensure_connected(self) -> bool:
    if self._connected:
        if self._client_manager.ping():
            return True
    return self._connect()
```

### 2.3 上下文管理器

```python
with MongoDB() as db:
    db.insert_one("users", {"name": "test"})
# 自动关闭连接
```

### 2.4 DataFrame 支持

```python
df = db.find_as_dataframe("stocks", {"date": {"$gte": "2024-01-01"}})
```

---

## 三、依赖说明

### 3.1 核心依赖

| 依赖 | 版本 | 说明 |
|------|------|------|
| `pymongo` | - | MongoDB Python 驱动 |
| `pandas` | - | DataFrame 支持 |
| `bson` | - | ObjectId 处理 |

### 3.2 系统依赖

| 依赖 | 说明 |
|------|------|
| MongoDB Server | 3.6+ 推荐 4.0+ 支持事务 |

---

## 四、设计模式

| 模式 | 应用 |
|------|------|
| 单例模式 | `MongoDB` 使用 `@singleton` 装饰器 |
| 工厂模式 | `get_mongo_db()` 工厂函数 |
| 上下文管理器 | `with` 语句自动管理连接 |
| 委托模式 | 底层通过 `MongoClientManager` 管理连接 |
