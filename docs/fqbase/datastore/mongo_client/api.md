# MongoClientManager API 参考

**模块路径**: `FQBase.DataStore.mongo_client`
**源码**: [mongo_client.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/DataStore/mongo_client.py)

---

## 一、MongoClientManager 类

### `MongoClientManager(uri: str, max_pool_size: int = 50, min_pool_size: int = 10, server_selection_timeout_ms: int = 5000, connect_timeout_ms: int = 5000, socket_timeout_ms: int = 30000)`

MongoDB 客户端管理器构造函数（实际通过 `__new__` 实现单例）。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `uri` | `str` | - | MongoDB 连接 URI |
| `max_pool_size` | `int` | `50` | 最大连接池大小 |
| `min_pool_size` | `int` | `10` | 最小连接池大小 |
| `server_selection_timeout_ms` | `int` | `5000` | 服务器选择超时（毫秒） |
| `connect_timeout_ms` | `int` | `5000` | 连接超时（毫秒） |
| `socket_timeout_ms` | `int` | `30000` | Socket 超时（毫秒） |

---

## 二、属性

### `MongoClientManager.uri -> str`

获取连接 URI。

### `MongoClientManager.client -> Optional[MongoClient]`

获取 MongoClient 实例（延迟初始化，线程安全）。

| 返回值 | 类型 | 说明 |
|--------|------|------|
| `MongoClient` | `pymongo.MongoClient` | MongoDB 客户端实例 |
| `None` | - | 连接失败时返回 None |

---

## 三、连接管理方法

### `MongoClientManager.ping() -> bool`

Ping 检查连接是否有效。

**返回值**: 连接有效返回 True

### `MongoClientManager.is_connected() -> bool`

检查是否已连接。

**返回值**: 已连接返回 True

### `MongoClientManager.close() -> None`

关闭 MongoDB 连接。

### `MongoClientManager.reset_client() -> None`

重置客户端，强制重新创建连接。

---

## 四、统计与健康检查

### `MongoClientManager.get_pool_stats() -> Dict[str, Any]`

获取连接池详细统计信息。

**返回值**:
```python
{
    'connected': True,
    'max_pool_size': 50,
    'min_pool_size': 10,
    'connect_time': 3,
    'uri_safe': 'mongodb://****@localhost:27017',
    'server_selection_timeout_ms': 5000,
    'connect_timeout_ms': 5000,
    'socket_timeout_ms': 30000,
    'server_address': 'localhost:27017',  # 如果已连接
    'topology_type': 'ReplicaSet',         # 如果已连接
    'known_servers': 3                      # 如果已连接
}
```

### `MongoClientManager.health_check_detailed() -> Dict[str, Any]`

详细健康检查。

**返回值**:
```python
{
    'healthy': True,
    'connected': True,
    'latency_ms': 12.5,
    'server_info': {
        'version': '6.0.0',
        'process': 'mongod',
        # ...
    },
    'errors': []
}
```

---

## 五、实例管理方法

### `MongoClientManager.clear_all() -> None`

清除所有缓存的客户端实例（类方法）。

**返回值**: None

### `MongoClientManager.release(uri: str, max_pool_size: int = 50, min_pool_size: int = 10, server_selection_timeout_ms: int = 5000) -> None`

释放客户端实例的引用（类方法）。

当引用计数降为 0 时，自动关闭并移除实例。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `uri` | `str` | - | MongoDB 连接 URI |
| `max_pool_size` | `int` | `50` | 最大连接池大小 |
| `min_pool_size` | `int` | `10` | 最小连接池大小 |
| `server_selection_timeout_ms` | `int` | `5000` | 服务器选择超时 |

### `MongoClientManager.get_instance_count() -> int`

获取当前实例数量（类方法）。

**返回值**: 当前管理的实例数量

### `MongoClientManager.get_ref_count(uri: str, max_pool_size: int = 50, min_pool_size: int = 10, server_selection_timeout_ms: int = 5000) -> int`

获取指定实例的引用计数（类方法）。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `uri` | `str` | - | MongoDB 连接 URI |
| `max_pool_size` | `int` | `50` | 最大连接池大小 |
| `min_pool_size` | `int` | `10` | 最小连接池大小 |
| `server_selection_timeout_ms` | `int` | `5000` | 服务器选择超时 |

**返回值**: 引用计数

---

## 六、便捷函数

### `get_mongo_client_manager(uri: str, **kwargs) -> MongoClientManager`

获取 MongoDB 客户端管理器实例。

| 参数 | 类型 | 说明 |
|------|------|------|
| `uri` | `str` | MongoDB 连接 URI |
| `**kwargs` | - | 其他参数传递给 MongoClientManager |

**返回值**: MongoClientManager 实例

---

## 七、重试机制

### 重试参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `max_attempts` | `3` | 最大重试次数 |
| `base_wait` | `100` | 基础等待时间（毫秒） |
| `max_wait` | `5000` | 最大等待时间（毫秒） |
| `retry_on_exception` | `(ConnectionFailure, ServerSelectionTimeoutError)` | 重试的异常类型 |
