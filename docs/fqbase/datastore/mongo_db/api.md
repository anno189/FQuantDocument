# MongoDB API 参考

**模块路径**: `FQBase.DataStore.mongo_db`
**源码**: [mongo_db.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/DataStore/mongo_db.py)

---

## 一、MongoDB 类

### `MongoDB.__init__(config=None, *, uri=None, database='quantaxis', username=None, password=None, max_pool_size=50, min_pool_size=10, server_selection_timeout_ms=5000, connect_timeout_ms=5000, socket_timeout_ms=30000)`

初始化 MongoDB 操作类。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `config` | `MongoDBConfigProtocol/dict/None` | `None` | 配置对象或字典 |
| `uri` | `str` | `None` | MongoDB 连接 URI |
| `database` | `str` | `"quantaxis"` | 默认数据库名 |
| `username` | `str` | `None` | 用户名 |
| `password` | `str` | `None` | 密码 |
| `max_pool_size` | `int` | `50` | 最大连接池大小 |
| `min_pool_size` | `int` | `10` | 最小连接池大小 |
| `server_selection_timeout_ms` | `int` | `5000` | 服务器选择超时（毫秒） |
| `connect_timeout_ms` | `int` | `5000` | 连接超时（毫秒） |
| `socket_timeout_ms` | `int` | `30000` | Socket 超时（毫秒） |

---

## 二、属性

### `MongoDB.is_connected -> bool`

检查是否已连接。

### `MongoDB.database -> Optional[Database]`

获取数据库对象。

### `MongoDB.database_name -> str`

获取数据库名称。

### `MongoDB.client_manager -> MongoClientManager`

获取客户端管理器。

---

## 三、连接管理

### `MongoDB.health_check() -> bool`

健康检查。

### `MongoDB.close() -> None`

关闭连接。

### `MongoDB.reset() -> None`

重置连接（关闭后重新建立）。

### `MongoDB.ping() -> bool`

Ping 检查。

---

## 四、CRUD 操作

### `MongoDB.insert_one(collection: str, document: Dict[str, Any]) -> Optional[str]`

插入单个文档。

| 参数 | 类型 | 说明 |
|------|------|------|
| `collection` | `str` | 集合名称 |
| `document` | `Dict` | 文档字典 |

**返回值**: 插入的文档 ID（字符串），失败返回 None

### `MongoDB.insert_many(collection: str, documents: List[Dict[str, Any]], ordered=False) -> List[str]`

批量插入文档。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `collection` | `str` | - | 集合名称 |
| `documents` | `List[Dict]` | - | 文档列表 |
| `ordered` | `bool` | `False` | 是否有序插入 |

**返回值**: 插入的文档 ID 列表

### `MongoDB.find(collection: str, query=None, projection=None, sort=None, skip=0, limit=0) -> List[Dict[str, Any]]`

查询文档列表。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `collection` | `str` | - | 集合名称 |
| `query` | `Dict` | `None` | 查询条件 |
| `projection` | `Dict` | `None` | 返回字段 |
| `sort` | `List[tuple]` | `None` | 排序条件 |
| `skip` | `int` | `0` | 跳过的文档数 |
| `limit` | `int` | `0` | 返回数量限制，0 表示不限制 |

**返回值**: 匹配的文档列表

### `MongoDB.find_one(collection: str, query: Dict[str, Any], projection=None) -> Optional[Dict[str, Any]]`

查询单个文档。

| 参数 | 类型 | 说明 |
|------|------|------|
| `collection` | `str` | 集合名称 |
| `query` | `Dict` | 查询条件 |
| `projection` | `Dict` | 返回字段 |

**返回值**: 匹配的文档，未找到返回 None

### `MongoDB.find_by_id(collection: str, object_id: str) -> Optional[Dict[str, Any]]`

根据 ID 查询文档。

| 参数 | 类型 | 说明 |
|------|------|------|
| `collection` | `str` | 集合名称 |
| `object_id` | `str` | ObjectId 字符串 |

**返回值**: 匹配的文档，未找到或 ID 无效返回 None

### `MongoDB.find_as_dataframe(collection: str, query=None, projection=None, sort=None, skip=0, limit=0) -> pd.DataFrame`

查询并返回 DataFrame。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `collection` | `str` | - | 集合名称 |
| `query` | `Dict` | `None` | 查询条件 |
| `projection` | `Dict` | `None` | 返回字段 |
| `sort` | `List[tuple]` | `None` | 排序条件 |
| `skip` | `int` | `0` | 跳过的文档数 |
| `limit` | `int` | `0` | 返回数量限制 |

**返回值**: pandas DataFrame

### `MongoDB.find_by_page(collection: str, query=None, page=1, page_size=20, sort=None, projection=None) -> Dict[str, Any]`

分页查询。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `collection` | `str` | - | 集合名称 |
| `query` | `Dict` | `None` | 查询条件 |
| `page` | `int` | `1` | 页码（从 1 开始） |
| `page_size` | `int` | `20` | 每页数量 |
| `sort` | `List[tuple]` | `None` | 排序条件 |
| `projection` | `Dict` | `None` | 返回字段 |

**返回值**:
```python
{
    'data': [...],      # 当前页数据
    'total': 100,       # 总数量
    'page': 1,          # 当前页
    'page_size': 20,    # 每页大小
    'total_pages': 5    # 总页数
}
```

### `MongoDB.count(collection: str, query=None) -> int`

统计文档数量。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `collection` | `str` | - | 集合名称 |
| `query` | `Dict` | `None` | 查询条件 |

**返回值**: 匹配的文档数量

### `MongoDB.update_one(collection: str, query: Dict[str, Any], update: Dict[str, Any], upsert=False) -> int`

更新单个文档。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `collection` | `str` | - | 集合名称 |
| `query` | `Dict` | - | 查询条件 |
| `update` | `Dict` | - | 更新操作 |
| `upsert` | `bool` | `False` | 不存在时是否插入 |

**返回值**: 实际修改的文档数量

### `MongoDB.update_many(collection: str, query: Dict[str, Any], update: Dict[str, Any], upsert=False) -> int`

批量更新文档。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `collection` | `str` | - | 集合名称 |
| `query` | `Dict` | - | 查询条件 |
| `update` | `Dict` | - | 更新操作 |
| `upsert` | `bool` | `False` | 不存在时是否插入 |

**返回值**: 实际修改的文档数量

### `MongoDB.upsert(collection: str, query: Dict[str, Any], update: Dict[str, Any]) -> Optional[str]`

更新或插入文档。

| 参数 | 类型 | 说明 |
|------|------|------|
| `collection` | `str` | 集合名称 |
| `query` | `Dict` | 查询条件 |
| `update` | `Dict` | 更新操作 |

**返回值**: 新插入文档的 ID（如果有），否则 None

### `MongoDB.find_one_and_update(collection: str, query: Dict[str, Any], update: Dict[str, Any], return_new=False) -> Optional[Dict[str, Any]]`

原子操作：查询并更新。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `collection` | `str` | - | 集合名称 |
| `query` | `Dict` | - | 查询条件 |
| `update` | `Dict` | - | 更新操作 |
| `return_new` | `bool` | `False` | 是否返回更新后的文档 |

**返回值**: 更新前或更新后的文档

### `MongoDB.delete_one(collection: str, query: Dict[str, Any]) -> int`

删除单个文档。

| 参数 | 类型 | 说明 |
|------|------|------|
| `collection` | `str` | 集合名称 |
| `query` | `Dict` | 查询条件 |

**返回值**: 实际删除的文档数量

### `MongoDB.delete_many(collection: str, query: Dict[str, Any]) -> int`

批量删除文档。

| 参数 | 类型 | 说明 |
|------|------|------|
| `collection` | `str` | 集合名称 |
| `query` | `Dict` | 查询条件 |

**返回值**: 实际删除的文档数量

### `MongoDB.exists(collection: str, query: Dict[str, Any]) -> bool`

检查文档是否存在。

| 参数 | 类型 | 说明 |
|------|------|------|
| `collection` | `str` | 集合名称 |
| `query` | `Dict` | 查询条件 |

**返回值**: 存在返回 True

---

## 五、聚合操作

### `MongoDB.aggregate(collection: str, pipeline: List[Dict[str, Any]], allow_disk_use=True) -> List[Dict[str, Any]]`

聚合管道查询。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `collection` | `str` | - | 集合名称 |
| `pipeline` | `List[Dict]` | - | 聚合管道列表 |
| `allow_disk_use` | `bool` | `True` | 是否允许使用磁盘 |

**返回值**: 聚合结果列表

### `MongoDB.distinct(collection: str, field: str, query=None) -> List[Any]`

获取字段的唯一值列表。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `collection` | `str` | - | 集合名称 |
| `field` | `str` | - | 字段名 |
| `query` | `Dict` | `None` | 查询条件 |

**返回值**: 唯一值列表

### `MongoDB.group(collection: str, key, condition=None, initial=None, reduce=None, finalize=None) -> List[Dict[str, Any]]`

分组统计。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `collection` | `str` | - | 集合名称 |
| `key` | `str/List/None` | - | 分组键 |
| `condition` | `Dict` | `None` | 条件 |
| `initial` | `Dict` | `None` | 初始值 |
| `reduce` | `str` | `None` | reduce 函数 |
| `finalize` | `str` | `None` | finalize 函数 |

**返回值**: 分组结果列表

---

## 六、索引操作

### `MongoDB.create_index(collection: str, keys, unique=False, background=True, **kwargs) -> str`

创建索引。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `collection` | `str` | - | 集合名称 |
| `keys` | `str/List[tuple]` | - | 索引键 |
| `unique` | `bool` | `False` | 是否唯一索引 |
| `background` | `bool` | `True` | 是否后台创建 |

**返回值**: 索引名称

### `MongoDB.create_indexes(collection: str, indexes: List[Dict]) -> List[str]`

批量创建索引。

| 参数 | 类型 | 说明 |
|------|------|------|
| `collection` | `str` | 集合名称 |
| `indexes` | `List[Dict]` | 索引定义列表 |

**返回值**: 创建的索引名称列表

### `MongoDB.list_indexes(collection: str) -> List[Dict[str, Any]]`

列出集合的所有索引。

| 参数 | 类型 | 说明 |
|------|------|------|
| `collection` | `str` | 集合名称 |

**返回值**: 索引信息列表

### `MongoDB.drop_index(collection: str, index_name: str) -> bool`

删除索引。

| 参数 | 类型 | 说明 |
|------|------|------|
| `collection` | `str` | 集合名称 |
| `index_name` | `str` | 索引名称 |

**返回值**: 成功返回 True

### `MongoDB.drop_all_indexes(collection: str) -> bool`

删除集合的所有索引。

| 参数 | 类型 | 说明 |
|------|------|------|
| `collection` | `str` | 集合名称 |

**返回值**: 成功返回 True

---

## 七、集合操作

### `MongoDB.list_collections() -> List[str]`

列出所有集合名称。

**返回值**: 集合名称列表

### `MongoDB.create_collection(name: str, **kwargs) -> bool`

创建集合。

| 参数 | 类型 | 说明 |
|------|------|------|
| `name` | `str` | 集合名称 |

**返回值**: 成功返回 True

### `MongoDB.drop_collection(name: str) -> bool`

删除集合。

| 参数 | 类型 | 说明 |
|------|------|------|
| `name` | `str` | 集合名称 |

**返回值**: 成功返回 True

### `MongoDB.rename_collection(old_name: str, new_name: str) -> bool`

重命名集合。

| 参数 | 类型 | 说明 |
|------|------|------|
| `old_name` | `str` | 原名称 |
| `new_name` | `str` | 新名称 |

**返回值**: 成功返回 True

### `MongoDB.collection_stats(collection: str) -> Dict[str, Any]`

获取集合统计信息。

| 参数 | 类型 | 说明 |
|------|------|------|
| `collection` | `str` | 集合名称 |

**返回值**: 统计信息字典

---

## 八、数据库操作

### `MongoDB.command(command: Dict[str, Any]) -> Any`

执行 MongoDB 命令。

| 参数 | 类型 | 说明 |
|------|------|------|
| `command` | `Dict` | 命令字典 |

**返回值**: 命令执行结果

### `MongoDB.get_database_stats() -> Dict[str, Any]`

获取数据库统计信息。

**返回值**: 数据库统计信息

### `MongoDB.get_server_status() -> Dict[str, Any]`

获取服务器状态信息。

**返回值**: 服务器状态信息

### `MongoDB.clear_cache() -> Dict[str, Any]`

清除 MongoDB 内部缓存。

**返回值**:
```python
{
    'success': True,
    'message': 'Cache cleared successfully',
    'details': {...}
}
```

### `MongoDB.compact_database() -> Dict[str, Any]`

压缩数据库。

**返回值**:
```python
{
    'success': True,
    'size_before_gb': 1.5,
    'size_after_gb': 1.2,
    'collections': {...},
    'skipped': ['system.indexes']
}
```

### `MongoDB.rotate_logs(keep=5) -> Dict[str, Any]`

轮转日志文件。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `keep` | `int` | `5` | 保留的日志文件数量 |

**返回值**:
```python
{
    'success': True,
    'rotated_at': '2024-01-15T10:30:00',
    'kept_files': [...],
    'deleted_files': [...]
}
```

---

## 九、性能分析

### `MongoDB.find_with_profiling(collection: str, query=None, projection=None, sort=None, skip=0, limit=0, slow_threshold_ms=1000) -> Dict[str, Any]`

带性能分析的查询。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `collection` | `str` | - | 集合名称 |
| `query` | `Dict` | `None` | 查询条件 |
| `projection` | `Dict` | `None` | 返回字段 |
| `sort` | `List[tuple]` | `None` | 排序条件 |
| `skip` | `int` | `0` | 跳过的文档数 |
| `limit` | `int` | `0` | 返回数量限制 |
| `slow_threshold_ms` | `int` | `1000` | 慢查询阈值（毫秒） |

**返回值**:
```python
{
    'data': [...],
    'metrics': {
        'elapsed_ms': 150.5,
        'is_slow': False,
        'threshold_ms': 1000,
        'result_count': 10
    }
}
```

### `MongoDB.aggregate_with_profiling(collection: str, pipeline: List[Dict], allow_disk_use=True, slow_threshold_ms=1000) -> Dict[str, Any]`

带性能分析的聚合查询。

---

## 十、事务支持

### `MongoDB.with_transaction(operations: Callable[['MongoDB'], Any], read_concern=None, write_concern=None) -> Any`

事务操作封装。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `operations` | `Callable` | - | 在事务中执行的操作函数 |
| `read_concern` | `str` | `None` | 读关注级别 |
| `write_concern` | `str` | `None` | 写关注级别 |

**返回值**: 事务中操作的结果

### `MongoDB.bulk_write(collection: str, operations: List[Dict]) -> Dict[str, int]`

批量写入操作。

| 参数 | 类型 | 说明 |
|------|------|------|
| `collection` | `str` | 集合名称 |
| `operations` | `List[Dict]` | 操作列表 |

**返回值**:
```python
{
    'inserted_count': 10,
    'modified_count': 5,
    'deleted_count': 2,
    'upserted_count': 1,
    'total': 18
}
```

---

## 十一、便捷函数

### `get_mongo_db(**kwargs) -> MongoDB`

获取全局 MongoDB 单例实例。

**返回值**: MongoDB 实例

### `reset_mongo_db() -> None`

重置全局 MongoDB 实例。

---

## 十二、环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `MONGODB_URI` | `mongodb://localhost:27017` | MongoDB 连接 URI |
| `MONGODB` | `mongodb://localhost:27017` | MongoDB 连接 URI（备选） |
