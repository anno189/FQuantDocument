# Cache 模块架构文档

**模块路径**: `FQBase.Cache`
**源码**: [FQBase/Cache](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Cache)
**版本**: 2.7.0
**更新日期**: 2026-03-29

---

## 一、架构概述

Cache 模块是 FQBase 框架的缓存抽象层，提供统一的缓存接口和多种缓存后端实现。其核心设计理念是**适配器模式**，通过 `CacheInterface` 协议定义统一接口，使上层代码无需关心底层存储细节。

### 1.1 架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                         应用层代码                               │
│    (DataStore, API, 业务逻辑)                                    │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CacheInterface 协议                        │
│  get(), set(), delete(), exists(), clear(), ttl(), expire()    │
│  get_many(), set_many(), delete_many()                          │
└─────────────────────────────────────────────────────────────────┘
                    ▲           │           ▲
                    │           │           │
        ┌───────────┴────┐  ┌───┴────────┴───┐
        │                │  │                │
        ▼                │  ▼                │
┌─────────────────┐      │  ┌─────────────────┐
│   LocalCache    │      │  │ RedisCacheAdapter │
│   (内存缓存)     │      │  │   (分布式缓存)    │
│   LRU/FIFO      │      │  │   Redis Client   │
└─────────────────┘      │  └─────────────────┘
                         │
                         │
                         │  ┌─────────────────┐
                         └──│ MongoCacheAdapter│
                            │   (MongoDB缓存)  │
                            └─────────────────┘
```

### 1.2 核心组件

| 组件 | 文件 | 职责 |
|------|------|------|
| `CacheInterface` | `_interface.py` | 缓存适配器协议定义 |
| `LocalCache` | `CacheAdapters.py` | 本地内存缓存实现 |
| `RedisCacheAdapter` | `CacheAdapters.py` | Redis 分布式缓存适配器 |
| `MongoCacheAdapter` | `CacheAdapters.py` | MongoDB 缓存适配器 |
| `local_cache` | `CacheAdapters.py` | 本地缓存装饰器 |
| `redis_cache` | `CacheAdapters.py` | Redis 缓存装饰器 |
| `CacheConfig` | `FQBase.Config` | 缓存配置管理 |
| `_serializers` | `_serializers.py` | 序列化/反序列化 |

---

## 二、模块结构

### 2.1 目录结构

```
FQBase/Cache/
├── __init__.py           # 模块入口，导出公共 API
├── _interface.py         # CacheInterface 协议定义
├── CacheAdapters.py     # 缓存适配器实现 (1612 行)
├── config_protocol.py    # 缓存配置协议定义
├── _serializers.py       # 序列化工具
├── redis_conn.py         # Redis 连接管理
├── metrics.py            # 缓存监控指标
└── _global_cache.py      # 全局缓存管理（已合并到 CacheAdapters）
```

### 2.2 依赖关系

```
_config_protocol.py
       │
       ▼
CacheAdapters.py ──────► _serializers.py
       │                        │
       │                        ▼
       │                 pandas, numpy, pickle, json
       │
       ▼
_interface.py (协议，由 CacheAdapters 实现)
```

---

## 三、适配器架构

### 3.1 适配器层次

```
┌─────────────────────────────────────────┐
│          CacheInterface 协议            │  ← 定义标准接口
└─────────────────────────────────────────┘
                    △
                    │ 实现
    ┌───────────────┼───────────────┐
    │               │               │
    ▼               ▼               ▼
┌─────────┐   ┌───────────┐   ┌───────────┐
│LocalCache│   │RedisCache│   │MongoCache │
│         │   │ Adapter  │   │ Adapter   │
└─────────┘   └───────────┘   └───────────┘
```

### 3.2 LocalCache 架构

```
LocalCache
├── 类级别组件（类变量）
│   ├── _instances: Dict[str, LocalCache]  # 单例存储
│   ├── _lock: threading.Lock               # 线程锁
│   ├── _access_order: List[str]           # LRU 访问顺序
│   ├── _cleanup_thread                     # 后台清理线程
│   └── _cleanup_event                      # 清理停止事件
│
├── 实例级别组件（实例变量）
│   ├── _cache: OrderedDict        # 缓存存储（有序）
│   ├── _timestamps: OrderedDict   # TTL 时间戳
│   ├── _hits: int                 # 命中次数
│   ├── _misses: int               # 未命中次数
│   └── _cache_lock: threading.Lock # 实例锁
│
└── 驱逐策略
    ├── LRU (Least Recently Used)
    └── FIFO (First In First Out)
```

**单例模式工作原理**:
1. `__new__` 方法拦截实例创建
2. 使用 `(name, maxsize, ttl, eviction)` 作为唯一键
3. 相同配置的缓存返回同一实例
4. 超过 `_max_instances` 时驱逐最久未访问的实例

### 3.3 RedisCacheAdapter 架构

```
RedisCacheAdapter
├── 连接管理层
│   ├── _RedisClientManager       # 客户端单例管理
│   │   ├── _clients: Dict        # 客户端缓存
│   │   ├── _lock: threading.Lock  # 线程安全
│   │   └── _connection_stats      # 连接统计
│   │
│   └── 自动重连机制
│       ├── _connect()            # 初始化连接
│       ├── _ensure_connected()   # 重连逻辑
│       └── health_check()        # 健康检查
│
├── 数据操作层
│   ├── String: get, set, mset, mget
│   ├── Hash: hget, hset, hmset, hmget, hgetall, hvals, hkeys, hdel
│   ├── List: lpush, rpush, lpop, rpop, lrange
│   ├── Set: sadd, smembers, srem, sismember, scard
│   └── Keys: keys (SCAN), delete, exists, ttl, expire
│
└── 序列化层
    ├── serialize_value()          # 序列化
    └── deserialize_value()       # 反序列化
```

**连接池管理**:
- 使用 `_RedisClientManager` 实现客户端单例
- 同一 `(host, port, db, password)` 复用连接
- 支持连接健康检查和自动重连

### 3.4 MongoCacheAdapter 架构

```
MongoCacheAdapter
├── 连接层
│   ├── _connect()                # MongoDB 连接
│   └── ping()                     # 健康检查
│
├── 数据层
│   ├── get/set/delete/exists     # 基本 CRUD
│   ├── get_many/set_many/delete_many  # 批量操作
│   └── ttl/expire                 # TTL 管理
│
└── 索引管理
    └── _ensure_index()           # 确保 key 索引存在
```

---

## 四、装饰器架构

### 4.1 local_cache 装饰器

```
┌─────────────────────────────────────────────────────────┐
│                   @local_cache(ttl=3600)                  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│  1. 创建 LocalCache(name=func.__name__)                  │
│  2. 包装函数，生成缓存键 (SHA256)                         │
│  3. 缓存命中 → 直接返回                                  │
│  4. 缓存未命中 → 调用原函数 → 存入缓存                    │
└─────────────────────────────────────────────────────────┘
```

**缓存键生成**:
```python
key = SHA256(repr(args) + repr(sorted(kwargs.items())))
```

### 4.2 redis_cache 装饰器

```
┌─────────────────────────────────────────────────────────┐
│              @redis_cache(ttl=300, key_prefix="")       │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│  1. 获取全局缓存适配器 (get_cache_adapter)                │
│  2. 生成缓存键 (带 key_prefix)                            │
│  3. 缓存命中 → 直接返回                                  │
│  4. 缓存未命中 → 调用原函数 → 存入缓存                    │
│  5. 支持异步函数 (asyncio.iscoroutinefunction)          │
└─────────────────────────────────────────────────────────┘
```

**异步支持**:
- 检测函数是否为协程函数
- 异步函数返回 `async_wrapper`
- 同步函数返回普通 `wrapper`

---

## 五、全局缓存管理

### 5.1 架构

```
┌─────────────────────────────────────────────────────────┐
│                   _global_cache_adapter                  │
│                   (模块级全局变量)                        │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        ▼                                       ▼
┌───────────────┐      ┌───────────────────┐     │
│LocalCache     │      │ RedisCacheAdapter │     │
│(name='fquant_ │      │  (主要全局适配器)  │     │
│ memory')      │      └───────────────────┘     │
│ (降级备用)    │                               │
└───────────────┘      ┌───────────────────┐     │
                        │ MongoCacheAdapter │     │
                        │  (未来扩展备用)    │     │
                        └───────────────────┘     │
```

**重要说明**：
- `LocalCache` 可以作为全局适配器，**通过 name 参数区分**
- 当 `LocalCache(name='fquant_memory')` 作为全局适配器时，与其他 `LocalCache` 实例隔离（因为 name 不同）
- 全局缓存适配器主要用于 `@redis_cache` 装饰器
- `@local_cache` 装饰的函数使用独立的 `LocalCache` 实例（name=函数名），不依赖全局适配器

### 5.2 管理函数

| 函数 | 职责 |
|------|------|
| `init_cache_adapter()` | 从 .env 初始化，自动降级 Redis → Memory |
| `set_cache_adapter(adapter)` | 设置全局缓存适配器（已保护 Redis 不被 LocalCache 覆盖） |
| `get_cache_adapter()` | 获取全局缓存适配器（首次调用时自动初始化） |
| `invalidate_cache(key_pattern)` | 使缓存失效 |
| `CacheContext` | 临时切换缓存上下文 |

### 5.3 初始化逻辑

```python
def init_cache_adapter():
    """从 .env 初始化全局缓存适配器"""
    cache_type = get_env('CACHE_TYPE', 'redis')  # 默认 redis

    if cache_type == 'redis':
        try:
            adapter = RedisCacheAdapter()
            if adapter.ping():
                set_cache_adapter(adapter)
                logger.info("全局缓存适配器初始化成功: Redis")
                return
        except Exception as e:
            logger.debug(f"Redis 初始化失败: {e}")

    # 降级到 Memory (LocalCache)
    adapter = LocalCache(name="fquant_memory", singleton=True)
    set_cache_adapter(adapter)
    logger.info("全局缓存适配器初始化成功: Memory")
```

**降级链**：Redis → Memory（始终可用）

**注意**：`get_cache_adapter()` 首次调用时会自动执行 `init_cache_adapter()`

---

## 六、序列化架构

### 6.1 序列化流程

```
应用数据 (pandas/numpy/dict/primitive)
           │
           ▼
┌─────────────────────────────────────────┐
│         serialize_value(value)          │
├─────────────────────────────────────────┤
│  1. numpy array → pickle + meta        │
│  2. pandas DataFrame/Series → pickle    │
│  3. dict/list → json                   │
│  4. primitive → 直接返回               │
└─────────────────────────────────────────┘
           │
           ▼
    Redis/MongoDB 存储
```

### 6.2 反序列化流程

```
Redis/MongoDB 数据 (bytes/primitive)
           │
           ▼
┌─────────────────────────────────────────┐
│    deserialize_value(value,             │
│                      pickle_first=False) │
├─────────────────────────────────────────┤
│  1. pickle_first=True → 优先 pickle     │
│  2. 检测数据类型                          │
│  3. numpy/pandas → 反序列化             │
│  4. json → 反序列化                      │
│  5. primitive → 直接返回                │
└─────────────────────────────────────────┘
           │
           ▼
    Python 对象
```

---

## 七、数据流

### 7.1 读操作流程

```
Cache.get(key)
        │
        ▼
┌───────────────────┐
│ 检查连接状态        │ ── 断开 ──► 返回 default
└───────────────────┘
        │ 连接正常
        ▼
┌───────────────────┐
│ 调用底层 get       │ ── LocalCache ──► 直接从 OrderedDict 获取
└───────────────────┘                        │
        │                                    ▼
        │                           ┌───────────────┐
        │                           │ 检查 TTL 过期   │
        └────────────────────────► Redis/MongoDB     │
                │                           │        │
                ▼                           ▼        ▼
        ┌───────────────┐           ┌───────────────┴───┐
        │ 反序列化数据     │           │ 删除过期数据        │
        └───────────────┘           └───────────────────┘
                │
                ▼
        返回应用数据
```

### 7.2 写操作流程

```
Cache.set(key, value, ttl=None)
        │
        ▼
┌───────────────────┐
│ 检查连接状态        │ ── 断开 ──► 返回 False
└───────────────────┘
        │ 连接正常
        ▼
┌───────────────────┐
│ 序列化数据          │
└───────────────────┘
        │
        ▼
┌───────────────────┐
│ 检查容量            │ ── LocalCache LRU/FIFO ──► 驱逐旧数据
└───────────────────┘
        │
        ▼
┌───────────────────┐
│ 调用底层 set       │
│ (带 TTL)          │
└───────────────────┘
        │
        ▼
    返回 True
```

---

## 八、线程安全

### 8.1 LocalCache 线程安全

```python
class LocalCache:
    # 类级别锁 - 保护类变量
    _lock = threading.Lock()

    def __init__(self, ...):
        # 实例级别锁 - 保护实例变量
        self._cache_lock = threading.Lock()

    def get(self, key):
        with self._cache_lock:  # 实例锁
            # 操作 _cache 和 _timestamps
```

**双重锁策略**:
- `_lock` (类级别): 保护 `_instances`、`_access_order`
- `_cache_lock` (实例级别): 保护 `_cache`、`_timestamps`

### 8.2 RedisCacheAdapter 线程安全

- Redis 客户端本身是线程安全的
- `_RedisClientManager` 使用锁保护 `_clients` 字典
- 使用 `pipeline` 保证批量操作的原子性

---

## 九、错误处理

### 9.1 分层错误处理

```
┌─────────────────────────────────────────┐
│           应用层 (try/except)            │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│        CacheAdapter (静默失败)           │
│   所有操作捕获异常，返回默认值/False      │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│        底层客户端 (redis/pymongo)        │
│        抛出 ConnectionError 等           │
└─────────────────────────────────────────┘
```

### 9.2 错误策略

| 场景 | 处理方式 | 返回值 |
|------|----------|--------|
| 连接断开 | 静默失败 | `default` / `False` / `[]` / `{}` |
| Redis 超时 | 记录 warning | `default` / `False` |
| 序列化失败 | 记录 error | `False` |
| 键不存在 | 静默成功 | `False` (delete) / `default` (get) |

---

## 十、配置集成

### 10.1 配置协议

```python
class CacheConfigProtocol(Protocol):
    cache_type: str           # "redis" / "mongo" / "local"
    ttl_default: int          # 默认 TTL

class RedisConfigProtocol(CacheConfigProtocol):
    redis_host: str
    redis_port: int
    redis_db: int
    redis_password: Optional[str]
    prefix: str

class MongoConfigProtocol(CacheConfigProtocol):
    mongo_host: str
    mongo_port: int
    mongo_database: str
    mongo_collection: str
    mongo_username: Optional[str]
    mongo_password: Optional[str]
    prefix: str
```

### 10.2 工厂函数

```python
def create_cache(config: CacheConfigProtocol = None) -> CacheInterface:
    if config.cache_type == "redis":
        return RedisCacheAdapter(config)
    elif config.cache_type == "mongo":
        return MongoCacheAdapter(config)
    else:
        return LocalCache(ttl=config.ttl_default)
```

---

## 十一、相关文档

| 文档 | 说明 |
|------|------|
| [API 文档](api.md) | 详细 API 参考 |
| [开发指南](development.md) | 开发最佳实践 |
| [应用示例](examples.md) | 10 个应用场景 |
| [缓存适配器](cache_adapters.md) | 适配器详细说明 |
| [框架文档](framework.md) | 模块框架概述 |
| [设计文档](design.md) | 设计决策与权衡 |
| [Cache Prefix 使用场景](Cache_Prefix_使用场景.md) | prefix 隔离策略 |
