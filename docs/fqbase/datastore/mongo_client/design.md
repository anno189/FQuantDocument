# MongoClientManager 设计文档

**模块路径**: `FQBase.DataStore.mongo_client`
**源码**: [mongo_client.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/DataStore/mongo_client.py)

---

## 一、按 URI 单例模式

```python
class MongoClientManager:
    _instances: Dict[str, 'MongoClientManager'] = {}

    def __new__(cls, uri: str, ...):
        key = f"{uri}:{max_pool_size}:{min_pool_size}:{server_selection_timeout_ms}"

        with cls._lock:
            if key not in cls._instances:
                cls._instances[key] = super().__new__(cls)
            cls._ref_counts[key] += 1
        return cls._instances[key]
```

**决策**: 使用 URI + 连接池参数作为唯一 Key，同一 URI 共享一个实例。

---

## 二、双锁机制

```python
# 类级别锁 - 保护实例创建
with cls._lock:
    if key not in cls._instances:
        cls._instances[key] = super().__new__(cls)

# 实例级别锁 - 保护客户端访问
with self._client_lock:
    if self._client is None:
        self._client = self._create_client()
```

**决策**: 双锁机制提高并发性能，减少锁竞争。

---

## 三、延迟初始化

```python
@property
def client(self) -> Optional[MongoClient]:
    with self._client_lock:
        if self._client is None:
            self._client = self._create_client()
        return self._client
```

**决策**: 首次访问 `client` 属性时才创建连接，减少启动开销。

---

## 四、指数退避重试

```python
@retry_with_exponential_backoff(
    max_attempts=3,
    base_wait=100,
    max_wait=5000,
    retry_on_exception=(ConnectionFailure, ServerSelectionTimeoutError),
)
def _create_client(self):
    client = pymongo.MongoClient(...)
    client.admin.command('ping')
    return client
```

**决策**: 网络波动时自动重试，指数退避策略避免频繁重试。

---

## 五、引用计数管理

```python
def release(cls, uri: str, ...):
    key = f"{uri}:{max_pool_size}:{min_pool_size}:..."
    with cls._lock:
        cls._ref_counts[key] -= 1
        if cls._ref_counts[key] <= 0:
            instance = cls._instances[key]
            instance.close()
            del cls._instances[key]
```

**决策**: 引用计数自动管理实例生命周期，最后一个使用者负责关闭。

---

## 六、程序退出自动清理

```python
if not cls._cleanup_registered:
    atexit.register(cls._cleanup_at_exit)
    cls._cleanup_registered = True

@classmethod
def _cleanup_at_exit(cls):
    cls.clear_all()
```

**决策**: 使用 `atexit` 注册退出时清理函数，确保程序结束时关闭所有连接。

---

## 七、密码脱敏日志

```python
def get_pool_stats(self):
    safe_uri = self._uri
    if '@' in safe_uri:
        prefix = parts[0].rsplit(':', 1)[0]
        safe_uri = f"{prefix}:****@{parts[1]}"
    return {'uri_safe': safe_uri, ...}
```

**决策**: 日志中隐藏密码，避免敏感信息泄露。
