---
title: Cache - 技术架构
description: Cache 模块的技术架构与组件设计
tag:
  - fqbase
  - cache
---

# Cache - 技术架构

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → **[技术架构](./architecture.md)** → [设计原则](./design.md) → [API参考](./api.md) → [开发指南](./development.md) → [最佳实践](./best-practices.md) |
| 🟡 运维/安全 | [README](./README.md) → **[技术架构](./architecture.md)** → [配置指南](./configuration.md) → [安全指南](./security.md) → [故障排查](./troubleshooting.md) → [常见问题](./faq.md) |
| 🟠 架构师 | [README](./README.md) → **[技术架构](./architecture.md)** → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) → [决策指南](./decision-guide.md) → [案例研究](./case-studies.md) → [数据流](./data-flow.md) |

## 概述

Cache 模块采用分层架构设计，从上到下分为五层：
- 应用接口层（装饰器）
- 缓存接口层（CacheInterface）
- 缓存实现层（LocalCache、RedisCacheAdapter、MongoCacheAdapter）
- 序列化层（_serializers）
- 存储后端层（内存、Redis、MongoDB）

## 架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                        应用层                                    │
│         (@local_cache / @redis_cache 装饰器)                    │
├─────────────────────────────────────────────────────────────────┤
│                     全局适配器层                                │
│        (init_cache_adapter / set_cache_adapter)                  │
├─────────────────────────────────────────────────────────────────┤
│                      缓存接口层                                 │
│                      CacheInterface                              │
├─────────────────┬──────────────────┬───────────────────────────┤
│   本地缓存层      │    Redis 缓存层   │     MongoDB 缓存层       │
│   LocalCache    │ RedisCacheAdapter │   MongoCacheAdapter     │
│                 │                   │                          │
│  - OrderedDict  │  - Redis Client   │  - MongoDB Client        │
│  - LRU/FIFO    │  - ConnectionPool │  - Collection           │
│  - TTL Manager │  - Key Prefix     │  - TTL Index            │
├─────────────────┴──────────────────┴───────────────────────────┤
│                      序列化层                                   │
│                   (_serializers)                               │
│         (serialize_value / deserialize_value)                   │
│         (支持 pickle / msgpack / numpy / pandas)              │
├─────────────────┴──────────────────┴───────────────────────────┤
│                      存储后端                                   │
│              (内存)         (Redis)          (MongoDB)          │
└─────────────────────────────────────────────────────────────────┘
```

## 核心组件详解

### 1. LocalCache

**职责：** 提供进程内内存缓存

**内部结构：**
```
LocalCache
├── _cache: OrderedDict     # 有序字典存储
├── _ttl: Dict[str, float]  # TTL 记录
├── _lock: threading.Lock   # 线程锁
└── _stats: dict           # 统计信息
```

**工作原理：**
- 使用 OrderedDict 维护插入顺序，支持 LRU/FIFO 驱逐
- 每次访问时调用 `_maybe_expire_key()` 检查并清理过期键（惰性清理）
- 超过 maxsize 时自动驱逐最旧的条目
- 使用 threading.Lock 保证线程安全

**单例模式：**
```python
# LocalCache 类方法
_local_cache_instances: Dict[tuple, LocalCache] = {}

@classmethod
def _get_instance(cls, name, maxsize, ttl, eviction):
    key = (name, maxsize, ttl, eviction)
    if key not in cls._local_cache_instances:
        cls._local_cache_instances[key] = cls(name, maxsize, ttl, eviction)
    return cls._local_cache_instances[key]
```

### 2. RedisCacheAdapter

**职责：** 提供 Redis 分布式缓存

**内部结构：**
```
RedisCacheAdapter
├── _client: Redis          # Redis 客户端（连接池）
├── _prefix: str            # 键前缀
├── _pickle_first: bool    # 序列化优先级
├── _safe_mode: bool       # 安全模式
└── _connected: bool        # 连接状态
```

**工作原理：**
- 通过 `_RedisClientManager` 单例管理连接池
- 所有键自动添加 prefix 前缀（`_make_key()` 方法）
- 支持四种数据结构：String、Hash、List、Set
- 序列化使用 `_serializers` 模块，支持 pickle 和 msgpack
- Pipeline 批量操作通过 `_pipeline()` 方法实现

**连接管理：**
```python
class _RedisClientManager:
    _clients: Dict[tuple, Redis] = {}
    
    @classmethod
    def get_client(cls, host, port, db, password, max_connections, socket_timeout):
        key = (host, port, db, password, max_connections, socket_timeout)
        if key not in cls._clients:
            pool = ConnectionPool(...)
            cls._clients[key] = Redis(connection_pool=pool)
        return cls._clients[key]
```

### 3. _serializers

**职责：** 处理序列化/反序列化

**支持的格式：**
| 格式 | 优先级 | 支持类型 | 说明 |
|------|--------|---------|------|
| msgpack | 高（默认） | 基础类型 | 高效、跨语言 |
| pickle | 中 | Python 对象 | 支持任意 Python 对象 |
| numpy | 低 | numpy 数组 | 自动检测并处理 |
| pandas | 低 | DataFrame/Series | 自动检测并处理 |

**序列化流程：**
```python
def serialize_value(value):
    # 1. 首先尝试 msgpack
    try:
        return msgpack.packb(value, use_bin_type=True)
    except:
        pass
    
    # 2. 检查 numpy/pandas
    if isinstance(value, (np.ndarray, pd.DataFrame, pd.Series)):
        # 特殊处理
        ...
    
    # 3. 最后使用 pickle
    return pickle.dumps(value)
```

## 数据流

### 缓存读取流程

```
应用代码
    ↓
装饰器 / 直接调用
    ↓
CacheInterface.get()
    ↓
[LocalCache / RedisCacheAdapter].get()
    ↓
序列化反序列化（如需要）
    ↓
返回结果
```

### 缓存写入流程

```
应用代码
    ↓
装饰器 / 直接调用
    ↓
CacheInterface.set()
    ↓
[LocalCache / RedisCacheAdapter].set()
    ↓
序列化
    ↓
[内存 / Redis / MongoDB]
    ↓
返回结果
```

## 依赖

| 依赖 | 版本 | 用途 |
|------|------|------|
| redis | >=4.0 | Redis 客户端 |
| pymongo | >=4.0 | MongoDB 客户端 |
| msgpack | >=1.0 | 序列化 |
| numpy | >=1.20 | numpy 数组序列化 |
| pandas | >=1.3 | pandas 序列化 |

---

## 相关文档

- [框架集成](./framework.md)
- [设计原则](./design.md)
- [API参考](./api.md)
- [三种缓存机制对比](./cache_comparison.md)
