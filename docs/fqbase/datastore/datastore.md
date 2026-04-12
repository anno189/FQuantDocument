# FQBase.DataStore MongoDB 通用操作模块

## 模块概述

`FQBase.DataStore` 是 FQuant 系统的 MongoDB 通用操作模块，提供完整的 CRUD、聚合、索引、管理功能。

### 目录结构

```
FQBase/FQBase/DataStore/
├── __init__.py          # 模块导出
├── mongo_client.py      # MongoDB 客户端管理器
└── mongo_db.py         # MongoDB 通用操作类
```

---

## 模块导入

```python
from FQBase.DataStore import (
    MongoDB,                  # MongoDB 通用操作类（单例）
    MongoClientManager,       # MongoDB 客户端管理器
    get_mongo_db,            # 获取全局 MongoDB 单例实例
    get_mongo_client_manager, # 获取客户端管理器
    reset_mongo_db,          # 重置全局 MongoDB 实例
)
```

---

## MongoClientManager 客户端管理器

线程安全的 MongoDB 客户端单例管理器。

### 类定义

```python
class MongoClientManager:
    """MongoDB 客户端管理器 - 线程安全单例

    每个 URI 只创建一个 MongoClient 实例，支持:
    - 延迟初始化
    - 线程安全访问
    - 自动重试连接（3次指数退避）
    - 连接池管理

    Attributes:
        _instances: 按 URI 存储的实例缓存
        _lock: 类级别锁，保护实例创建
    """
```

### 初始化参数

```python
def __init__(
    uri: str,
    max_pool_size: int = 50,           # 最大连接池大小
    min_pool_size: int = 10,           # 最小连接池大小
    server_selection_timeout_ms: int = 5000,  # 服务器选择超时（毫秒）
    connect_timeout_ms: int = 5000,    # 连接超时（毫秒）
    socket_timeout_ms: int = 30000,    # Socket 超时（毫秒）
)
```

### 属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `uri` | str | 连接 URI |
| `client` | MongoClient | MongoDB 客户端（延迟初始化） |

### 方法

#### `ping() -> bool`

Ping 检查连接是否有效。

```python
manager = get_mongo_client_manager("mongodb://localhost:27017")
if manager.ping():
    print("Connected")
```

#### `is_connected() -> bool`

检查是否已连接。

```python
if manager.is_connected():
    print("Connection active")
```

#### `close() -> None`

关闭 MongoDB 连接。

```python
manager.close()
```

#### `reset_client() -> None`

重置客户端，强制重新创建连接。

```python
manager.reset_client()
```

#### `clear_all() -> None`

清除所有缓存的客户端实例（类方法）。

```python
MongoClientManager.clear_all()
```

---

## MongoDB 通用操作类

```python
@singleton
class MongoDB:
    """MongoDB 通用操作类

    特性:
    - 单例模式，全局共享连接
    - 线程安全
    - 自动重连
    - 支持上下文管理器
    - 支持 pandas DataFrame
    - 统一的异常处理

    Example:
        >>> db = MongoDB(database="mydb")
        >>> db.insert_one("users", {"name": "test", "age": 25})
        >>> users = db.find("users", {"age": {"$gte": 18}})
        >>> df = db.find_as_dataframe("users", {"age": {"$gte": 18}})
    """
```

### 初始化参数

```python
def __init__(
    self,
    config: Union['MongoDBConfigProtocol', dict, None] = None,  # 配置对象或字典
    *,
    uri: Optional[str] = None,                    # MongoDB 连接 URI
    database: str = "quantaxis",                    # 默认数据库名
    username: Optional[str] = None,                # 用户名
    password: Optional[str] = None,                 # 密码
    max_pool_size: int = 50,                      # 最大连接池大小
    min_pool_size: int = 10,                       # 最小连接池大小
    server_selection_timeout_ms: int = 5000,       # 服务器选择超时
    connect_timeout_ms: int = 5000,                # 连接超时
    socket_timeout_ms: int = 30000,                 # Socket 超时
)
```

### 快速开始

```python
from FQBase.DataStore import MongoDB, get_mongo_db

# 方式1: 直接创建实例
db = MongoDB(database="mydb")

# 方式2: 获取全局单例
db = get_mongo_db(database="mydb")

# 基本操作
db.insert_one("users", {"name": "test", "age": 25})
users = db.find("users", {"age": {"$gte": 18}})
db.update_one("users", {"name": "test"}, {"$set": {"age": 30}})
db.delete_one("users", {"name": "test"})
```

---

## 连接管理

| 方法 | 返回值 | 说明 |
|------|--------|------|
| `is_connected` | bool | 检查是否已连接 |
| `database` | Database | 获取数据库对象 |
| `database_name` | str | 获取数据库名称 |
| `client_manager` | MongoClientManager | 获取客户端管理器 |
| `health_check()` | bool | 健康检查 |
| `close()` | None | 关闭连接 |
| `reset()` | None | 重置连接（关闭并重新连接） |
| `ping()` | bool | Ping 检查 |

---

## CRUD 操作

### insert_one 插入单条

```python
def insert_one(
    self,
    collection: str,
    document: Dict[str, Any]
) -> Optional[str]
```

**参数**:
- `collection`: 集合名称
- `document`: 要插入的文档

**返回**: 插入的文档 ID（字符串），失败返回 None

```python
doc_id = db.insert_one("users", {"name": "张三", "age": 30})
```

---

### insert_many 批量插入

```python
def insert_many(
    self,
    collection: str,
    documents: List[Dict[str, Any]],
    ordered: bool = False
) -> List[str]
```

**参数**:
- `collection`: 集合名称
- `documents`: 文档列表
- `ordered`: 是否有序插入（False 更高效）

**返回**: 插入的文档 ID 列表

```python
ids = db.insert_many("users", [
    {"name": "李四", "age": 25},
    {"name": "王五", "age": 35}
], ordered=False)
```

---

### find 查询多条

```python
def find(
    self,
    collection: str,
    query: Dict[str, Any] = None,
    projection: Dict[str, Any] = None,
    sort: List[tuple] = None,
    skip: int = 0,
    limit: int = 0
) -> List[Dict[str, Any]]
```

**参数**:
- `collection`: 集合名称
- `query`: 查询条件
- `projection`: 返回字段
- `sort`: 排序条件 `[("field", ASCENDING), ...]`
- `skip`: 跳过的文档数
- `limit`: 返回数量限制，0 表示不限制

**返回**: 匹配的文档列表

```python
users = db.find(
    "users",
    {"age": {"$gte": 18}},
    projection={"name": 1, "age": 1},
    sort=[("age", ASCENDING)],
    skip=0,
    limit=10
)
```

---

### find_one 查询单条

```python
def find_one(
    self,
    collection: str,
    query: Dict[str, Any],
    projection: Dict[str, Any] = None
) -> Optional[Dict[str, Any]]
```

**返回**: 匹配的文档，未找到返回 None

```python
user = db.find_one("users", {"name": "张三"})
```

---

### find_by_id 根据 ID 查询

```python
def find_by_id(
    self,
    collection: str,
    object_id: str
) -> Optional[Dict[str, Any]]
```

**返回**: 匹配的文档，未找到或 ID 无效返回 None

```python
user = db.find_by_id("users", "507f1f77bcf86cd799439011")
```

---

### find_as_dataframe 查询返回 DataFrame

```python
def find_as_dataframe(
    self,
    collection: str,
    query: Dict[str, Any] = None,
    projection: Dict[str, Any] = None,
    sort: List[tuple] = None,
    skip: int = 0,
    limit: int = 0
) -> pd.DataFrame
```

**返回**: pandas DataFrame

```python
df = db.find_as_dataframe("users", {"age": {"$gte": 18}})
```

---

### find_by_page 分页查询

```python
def find_by_page(
    self,
    collection: str,
    query: Dict[str, Any] = None,
    page: int = 1,
    page_size: int = 20,
    sort: List[tuple] = None,
    projection: Dict[str, Any] = None
) -> Dict[str, Any]
```

**返回**:
```python
{
    'data': [...],       # 文档列表
    'total': 100,        # 总数
    'page': 1,           # 当前页
    'page_size': 20,     # 每页数量
    'total_pages': 5     # 总页数
}
```

```python
result = db.find_by_page("users", {}, page=2, page_size=20)
```

---

### count 统计数量

```python
def count(
    self,
    collection: str,
    query: Dict[str, Any] = None
) -> int
```

```python
count = db.count("users", {"age": {"$gte": 18}})
```

---

### update_one 更新单条

```python
def update_one(
    self,
    collection: str,
    query: Dict[str, Any],
    update: Dict[str, Any],
    upsert: bool = False
) -> int
```

**返回**: 实际修改的文档数量

```python
modified = db.update_one(
    "users",
    {"name": "张三"},
    {"$set": {"age": 31}}
)
```

---

### update_many 批量更新

```python
def update_many(
    self,
    collection: str,
    query: Dict[str, Any],
    update: Dict[str, Any],
    upsert: bool = False
) -> int
```

**返回**: 实际修改的文档数量

```python
modified = db.update_many(
    "users",
    {"status": "inactive"},
    {"$set": {"status": "archived"}}
)
```

---

### upsert 更新或插入

```python
def upsert(
    self,
    collection: str,
    query: Dict[str, Any],
    update: Dict[str, Any]
) -> Optional[str]
```

**返回**: 新插入文档的 ID（如果有）

```python
new_id = db.upsert(
    "users",
    {"name": "张三"},
    {"$set": {"name": "张三", "age": 31}}
)
```

---

### find_one_and_update 原子更新

```python
def find_one_and_update(
    self,
    collection: str,
    query: Dict[str, Any],
    update: Dict[str, Any],
    return_new: bool = False
) -> Optional[Dict[str, Any]]
```

**参数**:
- `return_new`: True 返回更新后的文档，False 返回更新前

**返回**: 更新前/后的文档

```python
old_doc = db.find_one_and_update(
    "accounts",
    {"_id": user_id, "balance": {"$gte": 100}},
    {"$inc": {"balance": -100}},
    return_new=False
)
```

---

### delete_one 删除单条

```python
def delete_one(
    self,
    collection: str,
    query: Dict[str, Any]
) -> int
```

**返回**: 实际删除的文档数量

```python
deleted = db.delete_one("users", {"name": "张三"})
```

---

### delete_many 批量删除

```python
def delete_many(
    self,
    collection: str,
    query: Dict[str, Any]
) -> int
```

**返回**: 实际删除的文档数量

```python
deleted = db.delete_many("users", {"age": {"$lt": 18}})
```

---

### exists 检查是否存在

```python
def exists(
    self,
    collection: str,
    query: Dict[str, Any]
) -> bool
```

```python
if db.exists("users", {"name": "张三"}):
    print("用户已存在")
```

---

## 聚合操作

### aggregate 聚合管道

```python
def aggregate(
    self,
    collection: str,
    pipeline: List[Dict[str, Any]],
    allow_disk_use: bool = True
) -> List[Dict[str, Any]]
```

```python
pipeline = [
    {"$match": {"age": {"$gte": 20}}},
    {"$group": {"_id": None, "avg_age": {"$avg": "$age"}, "count": {"$sum": 1}}},
    {"$project": {"_id": 0, "avg_age": 1, "count": 1}}
]
result = db.aggregate("users", pipeline)
```

---

### distinct 获取唯一值

```python
def distinct(
    self,
    collection: str,
    field: str,
    query: Dict[str, Any] = None
) -> List[Any]
```

```python
names = db.distinct("users", "name")
```

---

### group 分组统计

```python
def group(
    self,
    collection: str,
    key: Union[str, List[str], None],
    condition: Dict[str, Any] = None,
    initial: Dict[str, Any] = None,
    reduce: str = None,
    finalize: str = None
) -> List[Dict[str, Any]]
```

---

## 索引操作

### create_index 创建索引

```python
def create_index(
    self,
    collection: str,
    keys: Union[str, List[tuple]],
    unique: bool = False,
    background: bool = True,
    **kwargs
) -> str
```

```python
db.create_index("users", "name")
db.create_index("users", [("name", ASCENDING), ("age", DESCENDING)])
db.create_index("users", "email", unique=True)
```

---

### create_indexes 批量创建索引

```python
def create_indexes(
    self,
    collection: str,
    indexes: List[Dict[str, Any]]
) -> List[str]
```

```python
indexes = [
    {"keys": [("name", ASCENDING)]},
    {"keys": [("email", ASCENDING)], "unique": True},
]
result = db.create_indexes("users", indexes)
```

---

### list_indexes 列出索引

```python
def list_indexes(
    self,
    collection: str
) -> List[Dict[str, Any]]
```

```python
indexes = db.list_indexes("users")
```

---

### drop_index 删除索引

```python
def drop_index(
    self,
    collection: str,
    index_name: str
) -> bool
```

```python
db.drop_index("users", "name_1")
```

---

### drop_all_indexes 删除所有索引

```python
def drop_all_indexes(
    self,
    collection: str
) -> bool
```

```python
db.drop_all_indexes("users")
```

---

## 集合操作

### list_collections 列出集合

```python
def list_collections(self) -> List[str]
```

```python
collections = db.list_collections()
```

---

### create_collection 创建集合

```python
def create_collection(
    self,
    name: str,
    **kwargs
) -> bool
```

```python
db.create_collection("new_collection")
```

---

### drop_collection 删除集合

```python
def drop_collection(self, name: str) -> bool
```

```python
db.drop_collection("old_collection")
```

---

### rename_collection 重命名集合

```python
def rename_collection(
    self,
    old_name: str,
    new_name: str
) -> bool
```

```python
db.rename_collection("users_old", "users_new")
```

---

### collection_stats 集合统计

```python
def collection_stats(
    self,
    collection: str
) -> Dict[str, Any]
```

```python
stats = db.collection_stats("users")
```

---

## 数据库操作

### command 执行命令

```python
def command(self, command: Dict[str, Any]) -> Any
```

```python
result = db.command({"ping": 1})
```

---

### get_database_stats 数据库统计

```python
def get_database_stats(self) -> Dict[str, Any]
```

```python
stats = db.get_database_stats()
```

---

### get_server_status 服务器状态

```python
def get_server_status(self) -> Dict[str, Any]
```

返回包含以下信息的字典:
- `version`: MongoDB 版本
- `connections`: 当前连接数
- `network`: 网络统计
- `memory`: 内存使用
- `opcounters`: 操作计数器
- `WiredTiger`: 缓存统计

```python
status = db.get_server_status()
print(f"版本: {status['version']}")
print(f"当前连接: {status['connections']['current']}")
```

---

## 管理功能

### clear_cache 清除缓存

```python
def clear_cache(self) -> Dict[str, Any]
```

**⚠️ Warning**: 此操作会清除 WiredTiger 缓存，可能导致性能暂时下降

**返回**:
```python
{
    "success": True,
    "message": "Cache cleared successfully",
    "details": {...}
}
```

---

### compact_database 压缩数据库

```python
def compact_database(self) -> Dict[str, Any]
```

**⚠️ Warning**: 此操作会锁定数据库，不建议在生产环境使用

**返回**:
```python
{
    "success": True,
    "size_before_gb": 1.2345,
    "size_after_gb": 0.9876,
    "collections": {...},
    "skipped": ["system.indexes"]
}
```

---

### rotate_logs 轮转日志

```python
def rotate_logs(self, keep: int = 5) -> Dict[str, Any]
```

**参数**:
- `keep`: 保留的日志文件数量，默认 5

**返回**:
```python
{
    "success": True,
    "rotated_at": "2026-03-31T18:00:00",
    "kept_files": ["mongod.log.2026-03-30"],
    "deleted_files": ["mongod.log.2026-03-25"],
    "log_rotate_result": {...}
}
```

---

## 批量操作

### bulk_write 批量写入

```python
def bulk_write(
    self,
    collection: str,
    operations: List[Dict[str, Any]]
) -> Dict[str, int]
```

**支持的 operations**:
- `insert_one`: `{"type": "insert_one", "document": {...}}`
- `update_one`: `{"type": "update_one", "query": {...}, "update": {...}, "upsert": False}`
- `update_many`: `{"type": "update_many", "query": {...}, "update": {...}, "upsert": False}`
- `delete_one`: `{"type": "delete_one", "query": {...}}`
- `delete_many`: `{"type": "delete_many", "query": {...}}`
- `replace_one`: `{"type": "replace_one", "query": {...}, "replacement": {...}, "upsert": False}`

**返回**:
```python
{
    "inserted_count": 2,
    "modified_count": 3,
    "deleted_count": 1,
    "upserted_count": 0,
    "total": 6
}
```

```python
operations = [
    {"type": "insert_one", "document": {"name": "Alice", "age": 30}},
    {"type": "update_one", "query": {"name": "Bob"}, "update": {"$set": {"age": 25}}},
    {"type": "delete_one", "query": {"name": "Charlie"}},
]
result = db.bulk_write("users", operations)
```

---

## 上下文管理器

```python
with MongoDB(database="mydb") as db:
    db.insert_one("users", {"name": "test"})
    users = db.find("users", {})
```

---

## 异常处理

```python
from FQBase.Foundation import (
    MongoDBException,
    MongoDBConnectionException,
    MongoDBOperationException,
)

try:
    db.insert_one("users", {"name": "test"})
except MongoDBConnectionException:
    print("未连接到 MongoDB")
except MongoDBOperationException as e:
    print(f"操作失败: {e}")
```

---

## 全局函数

### get_mongo_db

获取全局 MongoDB 单例实例。

```python
def get_mongo_db(**kwargs) -> MongoDB
```

```python
db = get_mongo_db(database="mydb")
```

---

### reset_mongo_db

重置全局 MongoDB 实例。

```python
def reset_mongo_db() -> None
```

```python
reset_mongo_db()
```

---

## 方法统计

| 类别 | 方法数 |
|------|--------|
| 连接管理 | 8 |
| CRUD | 14 |
| 聚合操作 | 3 |
| 索引操作 | 5 |
| 集合操作 | 5 |
| 数据库操作 | 3 |
| 管理功能 | 3 |
| 批量操作 | 1 |
| **总计** | **42** |