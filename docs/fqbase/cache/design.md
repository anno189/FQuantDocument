# Cache 模块设计文档

**模块路径**: `FQBase.Cache`
**源码**: [FQBase/Cache](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Cache)
**版本**: 2.7.0
**更新日期**: 2026-03-29

---

## 一、设计原则

### 1.1 核心设计原则

| 原则 | 描述 | 实现方式 |
|------|------|----------|
| **接口抽象** | 统一缓存操作接口 | `CacheInterface` Protocol |
| **适配器模式** | 支持多种后端 | `LocalCache`, `RedisCacheAdapter`, `MongoCacheAdapter` |
| **向后兼容** | 保持现有 API 稳定 | 渐进式迁移策略 |
| **容错设计** | 底层故障不影响业务 | 静默失败，返回默认值 |
| **线程安全** | 多线程环境安全 | 双重锁策略 |

### 1.2 设计权衡

| 权衡点 | 选择 | 理由 |
|--------|------|------|
| LocalCache 存储 | `OrderedDict` vs `dict` | 有序支持 LRU/FIFO 驱逐 |
| Redis 客户端 | 单例模式 | 避免重复连接，复用连接池 |
| 序列化格式 | pickle + JSON | 支持复杂对象 (pandas/numpy) |
| 错误处理 | 静默失败 | 避免缓存故障影响主流程 |
| TTL 精度 | 秒级 | 平衡精度与性能 |

---

## 二、接口设计

### 2.1 CacheInterface Protocol

```python
@runtime_checkable
class CacheInterface(Protocol):
    def get(self, key: str, default: Any = None) -> Any: ...
    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> bool: ...
    def delete(self, key: str) -> bool: ...
    def exists(self, key: str) -> bool: ...
    def clear(self) -> bool: ...
    def ttl(self, key: str) -> int: ...
    def expire(self, key: str, ttl: int) -> bool: ...
    def get_many(self, keys: List[str]) -> Dict[str, Any]: ...
    def set_many(self, mapping: Dict[str, Any], ttl: Optional[int] = None) -> bool: ...
    def delete_many(self, keys: List[str]) -> bool: ...
```

**设计决策**:
- 使用 `Protocol` 实现结构化子类型，无需继承
- 使用 `@runtime_checkable` 支持 `isinstance()` 检查
- 返回值语义统一：操作型返回 `bool`，获取型返回数据或默认值

### 2.2 TTL 返回值语义

```python
def ttl(self, key: str) -> int:
    """返回值语义:
    - 负数: 特殊状态
      - -1: 永不过期 (没有设置 TTL)
      - -2: 键不存在
    - 正数: 剩余生存时间 (秒)
    """
```

**设计理由**: 与 Redis TTL 命令语义一致。

---

## 三、LocalCache 设计

### 3.1 存储结构选择

```python
# 使用 OrderedDict 而非普通 dict
self._cache: OrderedDict = OrderedDict()
self._timestamps: Optional[OrderedDict] = OrderedDict() if ttl > 0 else None
```

**OrderedDict vs dict**:

| 特性 | OrderedDict | dict |
|------|-------------|------|
| 元素顺序 | ✅ 保持插入顺序 | ✅ Python 3.7+ 保持 |
| LRU 操作 | ✅ `move_to_end()` | ❌ 需要手动维护 |
| FIFO 操作 | ✅ `popitem(last=False)` | ❌ 需要额外逻辑 |
| 内存开销 | 略高 | 较低 |
| 操作性能 | 略低 | 较高 |

**决策**: 使用 OrderedDict 以支持高效的 LRU/FIFO 驱逐。

### 3.2 单例模式设计

```python
class LocalCache:
    _instances: Dict[str, 'LocalCache'] = {}  # 类级别存储

    def __new__(cls, name: str = 'default', maxsize: int = 128,
                ttl: int = 0, eviction: str = 'lru', singleton: bool = True):
        if not singleton:
            return super().__new__(cls)

        # 唯一键: 相同配置返回同一实例
        key = f"{name}:{maxsize}:{ttl}:{eviction}"
        with cls._lock:
            if key not in cls._instances:
                # 超过最大实例数，驱逐 LRU 实例
                if len(cls._instances) >= cls._max_instances:
                    cls._evict_lru_instance()
                cls._instances[key] = super().__new__(cls)
        return cls._instances[key]
```

**设计权衡**:

| 方案 | 优点 | 缺点 |
|------|------|------|
| 单例 (当前) | 节省内存，缓存共享 | 配置相同时共享状态 |
| 非单例 | 完全隔离 | 内存占用增加 |
| 支持两者 | 灵活 | API 复杂度增加 |

**决策**: 默认单例，通过 `singleton=False` 支持创建独立实例。

### 3.3 LRU 驱逐实现

```python
def get(self, key: str, default: Any = None) -> Any:
    with self._cache_lock:
        if key not in self._cache:
            self._misses += 1
            return default

        # TTL 过期检查
        if self._timestamps is not None and self._ttl > 0:
            if time.time() > self._timestamps[key]:
                del self._cache[key]
                del self._timestamps[key]
                self._misses += 1
                return default

        # LRU: 移动到末尾（最常用）
        if self._eviction == 'lru':
            self._cache.move_to_end(key)

        self._hits += 1
        return self._cache[key]
```

**LRU 实现对比**:

| 实现方式 | 时间复杂度 | 实现复杂度 |
|----------|------------|------------|
| `move_to_end()` | O(1) | 简单 |
| 双向链表 + dict | O(1) | 复杂 |
| 记录时间戳 + 排序 | O(n log n) | 中等 |

**决策**: 使用 `OrderedDict.move_to_end()` 实现 O(1) LRU。

### 3.4 TTL 惰性清理

```python
def set(self, key: str, value: Any, ttl: Optional[int] = None) -> bool:
    with self._cache_lock:
        # 惰性清理: 每次 set 时清理少量过期项
        if self._timestamps is not None and len(self._cache) > 0:
            self._lazy_cleanup_expired(max_items=10)
        # ... 执行 set 操作

def _lazy_cleanup_expired(self, max_items: int = 100) -> int:
    """惰性清理过期缓存项

    Args:
        max_items: 单次清理的最大数量，避免单次操作耗时过长
    """
```

**清理策略对比**:

| 策略 | 优点 | 缺点 |
|------|------|------|
| 惰性清理 (当前) | 性能影响小，实现简单 | 过期数据暂存 |
| 后台线程清理 | 及时清理 | 需要线程管理 |
| 定时清理 | 精确控制 | 需要调度器 |
| 惰性 + 后台 (当前) | 综合优势 | 复杂度增加 |

**决策**: 惰性清理为主，后台清理线程为辅。

### 3.5 后台清理线程

```python
class LocalCache:
    _cleanup_thread: Optional[threading.Thread] = None
    _cleanup_event: threading.Event = None

    @classmethod
    def start_cleanup_thread(cls, interval: float = 300):
        """启动后台清理线程

        Args:
            interval: 清理间隔（秒）
        """
        if hasattr(cls, '_cleanup_thread') and cls._cleanup_thread is not None:
            return  # 避免重复启动

        cls._cleanup_event = threading.Event()

        def cleanup_worker():
            while not cls._cleanup_event.is_set():
                cls._cleanup_event.wait(interval)
                if cls._cleanup_event.is_set():
                    break
                try:
                    cls.cleanup_expired_instances()
                except Exception as e:
                    logger.warning(f"Error in cleanup worker: {e}")

        cls._cleanup_thread = threading.Thread(
            target=cleanup_worker,
            daemon=True,  # 守护线程，不阻止程序退出
            name="LocalCache-Cleanup"
        )
        cls._cleanup_thread.start()

# 注册退出时的清理
atexit.register(LocalCache.stop_cleanup_thread)
LocalCache.start_cleanup_thread(interval=300)
```

**设计决策**:
- 使用守护线程 (`daemon=True`) 避免阻止程序退出
- 通过 `atexit` 注册确保程序退出时停止线程
- 单例模式：整个类只启动一个清理线程

---

## 四、RedisCacheAdapter 设计

### 4.1 客户端单例管理

```python
class _RedisClientManager:
    """Redis 客户端管理器 - 单例模式"""
    _clients: Dict[str, Any] = {}  # 客户端缓存
    _lock = threading.Lock()

    @classmethod
    def get_client(cls, host: str, port: int, db: int, password: Optional[str]) -> Any:
        key = f"{host}:{port}:{db}:{password}"
        if key not in cls._clients:
            with cls._lock:
                if key not in cls._clients:  # 双重检查锁定
                    cls._clients[key] = redis.Redis(
                        host=host, port=port, db=db, password=password,
                        decode_responses=False,  # 保持 bytes 便于序列化
                        socket_connect_timeout=5,
                        socket_timeout=5,
                        retry_on_timeout=True,
                        health_check_interval=30,  # 自动健康检查
                    )
        return cls._clients[key]
```

**设计决策**:
- 使用 `(host, port, db, password)` 作为唯一键
- 相同连接参数复用客户端
- `decode_responses=False` 保持 bytes 便于统一序列化处理

### 4.2 自动重连机制

```python
def _ensure_connected(self) -> bool:
    """确保连接有效，如已断开则尝试重连"""
    if self._connected:
        try:
            self._client.ping()
            return True
        except (redis.ConnectionError, redis.TimeoutError, OSError):
            self._connected = False

    # 重连逻辑
    try:
        _RedisClientManager.remove_client(...)
        self._client = _RedisClientManager.get_client(...)
        self._client.ping()
        self._connected = True
        return True
    except Exception:
        self._connected = False
        return False
```

**设计权衡**:

| 方案 | 优点 | 缺点 |
|------|------|------|
| 每次操作前检查 | 自动重连 | 每次操作额外开销 |
| 静默失败 | 性能好 | 需要上层处理 |
| 两者结合 (当前) | 平衡 | 实现复杂 |

### 4.3 Prefix 策略

```python
def _make_key(self, key: str) -> str:
    return f"{self._prefix}{key}"

# 所有操作都通过 _make_key 添加前缀
def keys(self, pattern: str = "*", limit: int = 0) -> List[str]:
    search_pattern = f"{self._prefix}{pattern}"
    # ...
```

**设计决策**:
- 前缀默认 `fqcache:`，支持命名空间隔离
- `keys()` 返回时会去除前缀，提供干净的键名
- 使用 SCAN 而非 KEYS，避免阻塞

### 4.4 SCAN 替代 KEYS

```python
def keys(self, pattern: str = "*", limit: int = 0) -> List[str]:
    """获取所有匹配的键（使用 SCAN 替代 KEYS，避免阻塞）

    Args:
        pattern: 匹配模式
        limit: 返回数量限制，0 表示不限制
    """
    result = []
    cursor = 0
    search_pattern = f"{self._prefix}{pattern}"
    prefix_len = len(self._prefix)
    scan_count = min(1000, max(100, limit)) if limit > 0 else 1000

    while True:
        cursor, keys = self._client.scan(cursor, match=search_pattern, count=scan_count)
        for k in keys:
            key_str = k.decode() if isinstance(k, bytes) else k
            if key_str.startswith(self._prefix):
                key_str = key_str[prefix_len:]  # 去除前缀
            result.append(key_str)
            if limit > 0 and len(result) >= limit:
                return result
        if cursor == 0:
            break
    return result
```

**KEYS vs SCAN**:

| 特性 | KEYS | SCAN |
|------|------|------|
| 时间复杂度 | O(N) | O(1) 每次迭代 |
| 阻塞 | 是 | 否 |
| 返回完整性 | 一次返回 | 游标迭代 |
| 大数据量 | 不建议 | 推荐 |

---

## 五、序列化设计

### 5.1 序列化策略

```python
def serialize_value(value: Any) -> bytes:
    """序列化策略:
    1. numpy array → 特殊标记 + pickle
    2. pandas DataFrame/Series → 特殊标记 + pickle
    3. dict/list → json
    4. primitive → json
    """
    if isinstancex(value, np.ndarray):
        return b'\x01' + _serialize_np(value)
    elif isinstancex(value, (pd.DataFrame, pd.Series)):
        return b'\x02' + pickle.dumps(value)
    elif isinstance(value, (dict, list)):
        return b'\x03' + json.dumps(value).encode()
    else:
        return b'\x03' + json.dumps(value).encode()
```

**标记字节**:

| 标记 | 类型 |
|------|------|
| `\x01` | numpy.ndarray |
| `\x02` | pandas.DataFrame/Series |
| `\x03` | json 序列化 |

### 5.2 反序列化策略

```python
def deserialize_value(value: bytes, pickle_first: bool = False, safe_mode: bool = False) -> Any:
    if value is None:
        return None

    if not isinstance(value, bytes):
        return value

    prefix = value[:1]
    data = value[1:]

    if pickle_first:
        # 优先尝试 pickle
        try:
            return pickle.loads(data)
        except:
            pass
        # 回退到其他格式
        if prefix == b'\x01':
            return _deserialize_np(data)
        elif prefix == b'\x03':
            return json.loads(data.decode())

    # 非 pickle_first 模式
    if prefix == b'\x01':
        return _deserialize_np(data)
    elif prefix == b'\x02':
        return pickle.loads(data)
    elif prefix == b'\x03':
        return json.loads(data.decode())

    # 未知格式，尝试 pickle
    try:
        return pickle.loads(value)
    except:
        return value
```

**设计权衡**:

| 参数 | 场景 | 决策 |
|------|------|------|
| `pickle_first=False` | 性能优先 | 避免不必要的 pickle 开销 |
| `pickle_first=True` | 兼容性优先 | 确保 pickle 数据能正确读取 |
| `safe_mode=False` | 向后兼容 | 默认行为 |
| `safe_mode=True` | 安全优先 | 处理不可信数据 |

---

## 六、装饰器设计

### 6.1 缓存键生成策略

```python
def _make_cache_key(func, *args, **kwargs) -> str:
    """生成缓存键

    策略:
    1. 函数全名 (module.name) 作为键的一部分
    2. args 和 kwargs 的 repr 作为键内容
    3. SHA256 哈希确保键长度可控
    """
    func_name = func.__module__ + "." + func.__name__
    key_parts = [func_name]

    sig = inspect.signature(func)
    param_names = list(sig.parameters.keys())

    for i, arg in enumerate(args):
        if i < len(param_names):
            key_parts.append(f"{param_names[i]}={repr(arg)}")
        else:
            key_parts.append(f"arg{i}={repr(arg)}")

    for k, v in kwargs.items():
        key_parts.append(f"{k}={repr(v)}")

    key_string = "|".join(key_parts)
    return hashlib.sha256(key_string.encode()).hexdigest()
```

**设计权衡**:

| 方案 | 优点 | 缺点 |
|------|------|------|
| 直接 repr | 简单 | 键可能过长 |
| SHA256 哈希 | 键长度固定 | 不可读 |
| 两者结合 (当前) | 平衡 | 略微复杂 |

### 6.2 动态 TTL 支持

```python
def local_cache(maxsize: int = 128, ttl: int = 0,
                key_ttl_func: Callable[..., Optional[int]] = None):

    def decorator(func):
        cache = LocalCache(name=func.__name__, maxsize=maxsize, ttl=ttl)

        @wraps(func)
        def wrapper(*args, **kwargs):
            # ... 缓存查找

            effective_ttl = ttl
            if key_ttl_func is not None:
                # 动态 TTL：根据参数决定过期时间
                effective_ttl = key_ttl_func(*args, **kwargs) or ttl

            cache.set(key, result, ttl=effective_ttl)
            return result

        return wrapper
    return decorator
```

**应用场景**:
- 不同参数组合对应不同的缓存策略
- 例如：热门数据短 TTL，冷门数据长 TTL

---

## 七、错误处理设计

### 7.1 静默失败策略

```python
def get(self, key: str, default: Any = None) -> Any:
    if not self._connected:
        return default
    try:
        value = self._client.get(self._make_key(key))
        if value is None:
            return default
        return deserialize_value(value, ...)
    except Exception as e:
        logger.warning(f"RedisCacheAdapter.get failed: {e}")
        return default
```

**设计理由**:
- 缓存是可选的性能优化层
- 缓存故障不应导致业务失败
- 日志记录便于问题排查

### 7.2 异常日志级别

| 操作 | 日志级别 | 理由 |
|------|----------|------|
| 连接失败 | `error` | 需要关注，可能需要干预 |
| 操作失败 | `warning` | 暂时性问题，不紧急 |
| 键不存在 | 不记录 | 正常情况 |

---

## 八、配置设计

### 8.1 配置协议层次

```
CacheConfigProtocol (基础协议)
       │
       ├── ttl_default: int
       │
       ▼
RedisConfigProtocol ──────────────► MongoConfigProtocol
       │                                │
       ├── redis_host                   ├── mongo_host
       ├── redis_port                   ├── mongo_port
       ├── redis_db                     ├── mongo_database
       ├── redis_password               ├── mongo_collection
       ├── redis_pickle_first           ├── mongo_username
       └── prefix                       ├── mongo_password
                                            └── prefix
```

### 8.2 工厂模式

```python
def create_cache(config: CacheConfigProtocol = None) -> CacheInterface:
    """根据配置创建缓存适配器

    设计:
    1. 默认为 None，从环境变量加载配置
    2. 根据 config.cache_type 创建对应适配器
    3. LocalCache 作为最后的兜底方案
    """
    if config is None:
        config = get_cache_config()

    if config.cache_type == "redis":
        return RedisCacheAdapter(config)
    elif config.cache_type == "mongo":
        return MongoCacheAdapter(config)
    else:
        return LocalCache(name="default", ttl=config.ttl_default)
```

---

## 九、性能优化

### 9.1 批量操作优化

```python
def set_many(self, mapping: Dict[str, Any], ttl: Optional[int] = None) -> bool:
    """批量设置缓存 - 使用 pipeline 减少网络往返"""
    if not self._connected:
        return False
    try:
        pipe = self._client.pipeline()  # 批量执行
        for key, value in mapping.items():
            serialized = serialize_value(value)
            if ttl:
                pipe.setex(self._make_key(key), ttl, serialized)
            else:
                pipe.set(self._make_key(key), serialized)
        pipe.execute()  # 一次网络往返
        return True
    except Exception as e:
        logger.warning(f"RedisCacheAdapter.set_many failed: {e}")
        return False
```

### 9.2 惰性清理优化

```python
def set_many(self, mapping: Dict[str, Any], ttl: Optional[int] = None) -> bool:
    with self._cache_lock:
        # 根据批量大小动态调整清理数量
        if self._timestamps is not None and len(self._cache) > 0:
            cleanup_count = max(10, len(mapping) // 10)
            self._lazy_cleanup_expired(max_items=cleanup_count)
```

---

## 十、安全设计

### 10.1 safe_mode 参数

```python
class RedisCacheAdapter:
    def __init__(self, ..., safe_mode: bool = False):
        self.safe_mode = safe_mode

    def get(self, key: str, default: Any = None) -> Any:
        # safe_mode=True 时可以添加额外安全检查
        value = deserialize_value(value, pickle_first=self.pickle_first,
                                   safe_mode=self.safe_mode)
```

### 10.2 pickle 安全

- `pickle` 反序列化存在安全风险
- 默认 `safe_mode=False` 保持向后兼容
- 处理不可信数据时设置 `safe_mode=True`

---

## 十一、相关文档

| 文档 | 说明 |
|------|------|
| [API 文档](api.md) | 详细 API 参考 |
| [开发指南](development.md) | 开发最佳实践 |
| [应用示例](examples.md) | 10 个应用场景 |
| [缓存适配器](cache_adapters.md) | 适配器详细说明 |
| [架构文档](architecture.md) | 架构设计详解 |
| [框架文档](framework.md) | 模块框架概述 |
| [Cache Prefix 使用场景](Cache_Prefix_使用场景.md) | prefix 隔离策略 |
