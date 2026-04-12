# MongoDB 设计文档

**模块路径**: `FQBase.DataStore.mongo_db`
**源码**: [mongo_db.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/DataStore/mongo_db.py)

---

## 一、单例模式

```python
@singleton
class MongoDB:
    """MongoDB 通用操作类 - 单例模式"""
    __slots__ = (
        '_uri', '_database_name', '_client_manager',
        '_db', '_connected', '_lock', '_config'
    )
```

**决策**: 使用 `@singleton` 装饰器确保全局只有一个 MongoDB 实例，避免重复创建连接。

---

## 二、URI 解析与安全

```python
def _resolve_uri(self, config, uri, username, password) -> str:
    if base_uri is None:
        base_uri = os.getenv('MONGODB_URI', os.getenv('MONGODB', 'mongodb://localhost:27017'))

    if username and password:
        if '@' not in base_uri:
            uri_parts = base_uri.split('://', 1)
            host_part = uri_parts[1] if len(uri_parts) > 1 else uri_parts[0]
            base_uri = f"{uri_parts[0]}://{username}:****@{host_part}"

    return base_uri

def _get_safe_uri_for_logging(self) -> str:
    """密码脱敏后用于日志"""
```

**决策**:
- 支持多种配置方式（config对象、字典、环境变量）
- 密码在日志中脱敏显示，避免敏感信息泄露

---

## 三、自动重连机制

```python
def _ensure_connected(self) -> bool:
    if self._connected:
        if self._client_manager.ping():
            return True
    return self._connect()
```

**决策**: 每次操作前检查连接状态，如已断开则自动重连，保证操作可靠性。

---

## 四、线程安全

```python
def __init__(self, ...):
    self._lock = threading.Lock()

def close(self) -> None:
    with self._lock:
        self._client_manager.close()
```

**决策**: 使用 `threading.Lock` 保护连接管理操作，确保多线程安全。

---

## 五、上下文管理器

```python
def __enter__(self):
    self._connect()
    return self

def __exit__(self, exc_type, exc_val, exc_tb):
    return False  # 不抑制异常
```

**决策**:
- 支持 `with` 语句自动管理连接生命周期
- 返回 `False` 表示不抑制异常，异常会正常传播

---

## 六、DataFrame 支持

```python
def find_as_dataframe(self, collection, query=None, ...):
    import pandas as pd
    results = self.find(...)
    df = pd.DataFrame(results)
    if '_id' in df.columns:
        df['_id'] = df['_id'].astype(str)
    return df
```

**决策**: 查询结果直接转为 pandas DataFrame，便于数据分析和处理。

---

## 七、统一异常处理

```python
from FQBase.Foundation.exceptions import (
    MongoDBException,
    MongoDBConnectionException,
    MongoDBOperationException,
)

def insert_one(self, collection, document):
    try:
        result = self._get_collection(collection).insert_one(document)
    except PyMongoError as e:
        logger.error(f"insert_one error: {e}")
        raise MongoDBOperationException(
            f"Failed to insert document: {e}",
            details={'collection': collection}
        ) from e
```

**决策**: 将 PyMongo 异常转换为自定义异常，携带业务上下文信息。

---

## 八、慢查询分析

```python
def find_with_profiling(self, collection, query, slow_threshold_ms=1000):
    start_time = time.time()
    data = self.find(...)
    elapsed_ms = (time.time() - start_time) * 1000

    metrics = {
        'elapsed_ms': round(elapsed_ms, 2),
        'is_slow': elapsed_ms > slow_threshold_ms,
        'result_count': len(data),
    }

    if metrics['is_slow']:
        logger.warning(f"Slow query: {collection} took {elapsed_ms:.2f}ms")

    return {'data': data, 'metrics': metrics}
```

**决策**: 内置性能分析功能，自动记录慢查询，便于优化。

---

## 九、事务支持

```python
def with_transaction(self, operations, read_concern=None, write_concern=None):
    with client.start_session() as session:
        with session.start_transaction():
            result = operations(self)
            return result
```

**决策**: 提供简洁的事务封装，保证多操作原子性。
