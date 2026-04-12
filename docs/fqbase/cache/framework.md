# Cache 模块框架文档

**模块路径**: `FQBase.Cache`
**源码**: [FQBase/Cache](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Cache)
**版本**: 2.7.0
**更新日期**: 2026-03-29

---

## 一、模块概述

Cache 模块是 FQBase 框架的缓存抽象层，为应用提供高性能的缓存解决方案。模块支持多种缓存后端，包括本地内存缓存、Redis 分布式缓存和 MongoDB 缓存。

### 1.1 核心特性

| 特性 | 说明 |
|------|------|
| 多后端支持 | LocalCache、Redis、MongoDB |
| 统一接口 | CacheInterface Protocol |
| 序列化支持 | pandas、numpy、JSON、pickle |
| TTL 管理 | 过期时间控制 |
| 驱逐策略 | LRU、FIFO |
| 装饰器支持 | @local_cache、@redis_cache |
| 线程安全 | 双重锁机制 |
| 批量操作 | get_many、set_many、delete_many |
| 自动重连 | Redis 连接故障恢复 |

---

## 二、框架结构

### 2.1 模块层次

```
FQBase.Cache
├── 接口层 (Interface Layer)
│   ├── CacheInterface        # 缓存适配器协议
│   ├── CacheConfigProtocol   # 缓存配置协议
│   ├── RedisConfigProtocol   # Redis 配置协议
│   └── MongoConfigProtocol   # MongoDB 配置协议
│
├── 实现层 (Implementation Layer)
│   ├── LocalCache           # 本地内存缓存
│   ├── RedisCacheAdapter    # Redis 适配器
│   └── MongoCacheAdapter    # MongoDB 适配器
│
├── 装饰器层 (Decorator Layer)
│   ├── local_cache          # 本地缓存装饰器
│   └── redis_cache          # Redis 缓存装饰器
│
├── 管理层 (Management Layer)
│   ├── init_cache_adapter  # 初始化全局适配器（从 .env）
│   ├── set/get_cache_adapter  # 设置/获取全局适配器
│   ├── CacheContext         # 缓存上下文管理器
│   └── invalidate_cache     # 缓存失效
│
└── 工具层 (Utility Layer)
    ├── _serializers         # 序列化工具
    ├── redis_conn           # Redis 连接管理
    └── metrics              # 缓存监控
```

### 2.2 文件清单

| 文件 | 行数 | 职责 |
|------|------|------|
| `__init__.py` | 98 | 模块入口，导出公共 API |
| `_interface.py` | 134 | CacheInterface 协议定义 |
| `CacheAdapters.py` | 1612 | 三大适配器 + 装饰器 |
| `config_protocol.py` | ~100 | 配置协议定义 |
| `_serializers.py` | ~200 | 序列化/反序列化 |
| `redis_conn.py` | ~100 | Redis 连接管理 |
| `metrics.py` | ~150 | 缓存监控指标 |

---

## 三、快速开始

### 3.1 安装依赖

```bash
pip install redis pymongo pandas numpy
```

### 3.2 基本使用

```python
from FQBase.Cache import LocalCache

# 创建本地缓存
cache = LocalCache(name='my_cache', maxsize=128, ttl=3600)

# 缓存操作
cache.set('key', {'data': 'value'})
value = cache.get('key')
cache.delete('key')
cache.clear()
```

### 3.3 Redis 缓存

```python
from FQBase.Cache import init_cache_adapter, get_cache_adapter

# 初始化全局缓存适配器（从 .env 读取配置）
# 自动降级：Redis → Memory
init_cache_adapter()

# 获取全局缓存适配器
adapter = get_cache_adapter()
adapter.set('key', {'data': 'value'}, ttl=3600)
```

### 3.4 装饰器使用

```python
from FQBase.Cache import local_cache, redis_cache, init_cache_adapter

# 初始化全局缓存（自动根据 CACHE_TYPE 配置选择）
# 首次调用 init_cache_adapter() 或 get_cache_adapter() 时自动初始化
init_cache_adapter()

# 本地缓存装饰器（函数私有，通过 name=函数名 隔离）
# 每个 @local_cache 装饰的函数有独立的 LocalCache 实例
@local_cache(maxsize=128, ttl=600)
def get_stock_price(code: str):
    return fetch_from_api(code)

# Redis 缓存装饰器（使用全局适配器）
# 所有 @redis_cache 装饰的函数共享同一个全局适配器
@redis_cache(ttl=3600)
def get_market_data(symbol: str):
    return fetch_market_data(symbol)
```

**装饰器对比**：

| 装饰器 | 缓存存储 | name 参数 | 与全局适配器关系 |
|--------|----------|----------|-----------------|
| `@local_cache` | 每个函数独立的 `LocalCache` 实例 | `name=函数名` | ❌ 完全独立，不读取全局适配器 |
| `@redis_cache` | 全局适配器 (`RedisCacheAdapter` 或 `LocalCache(name="fquant_memory")`) | - | ✅ 依赖 `get_cache_adapter()` |

---

## 四、缓存选择指南

### 4.1 选择决策树

```
缓存场景
    │
    ├── 单进程应用？
    │       │
    │       ├── 是 ──► LocalCache
    │       │
    │       └── 否 ──► 多进程/分布式？
    │               │
    │               ├── Redis 可用？ ──► RedisCacheAdapter
    │               │
    │               └── MongoDB 可用？ ──► MongoCacheAdapter
```

### 4.2 特性对比

| 特性 | LocalCache | RedisCacheAdapter | MongoCacheAdapter |
|------|------------|-------------------|-------------------|
| 存储位置 | 内存 | Redis 服务器 | MongoDB 服务器 |
| 持久化 | ❌ | ✅ 可配置 | ✅ |
| 分布式 | ❌ | ✅ | ✅ |
| 跨进程 | ❌ | ✅ | ✅ |
| 数据结构 | dict | String/Hash/List/Set | document |
| 最大容量 | 受限于内存 | Redis 配置 | MongoDB 配置 |
| 性能 | 最快 | 快 | 中等 |
| 过期策略 | TTL | TTL | TTL + MongoDB TTL 索引 |
| 复杂度 | 低 | 中 | 中 |

### 4.3 推荐场景

| 场景 | 推荐缓存 | 理由 |
|------|----------|------|
| 开发测试 | LocalCache | 零配置，快速启动 |
| Web 应用会话 | RedisCacheAdapter | 分布式，高性能 |
| 微服务缓存 | RedisCacheAdapter | 跨服务共享 |
| 数据分析 | LocalCache | 低延迟，减少 IO |
| 大型缓存 | RedisCacheAdapter | 可扩展，海量存储 |
| 已有 MongoDB | MongoCacheAdapter | 复用基础设施 |

---

## 五、模块集成

### 5.1 与 Config 模块集成

```python
from FQBase.Config import get_cache_config, CacheConfig

# 从配置创建缓存
config = get_cache_config()
cache = create_cache(config)
```

### 5.2 与 DataStore 模块集成

```python
from FQBase.FQDataStore import DataStore

# DataStore 内置缓存支持
ds = DataStore()
ds.set_cache_adapter(redis_adapter)
```

### 5.3 与业务代码集成

```python
from FQBase.Cache import redis_cache, set_cache_adapter

# 初始化时设置全局缓存
set_cache_adapter(RedisCacheAdapter.from_env())

# 业务代码直接使用装饰器
@redis_cache(ttl=3600)
def get_user_info(user_id: int):
    return database.query_user(user_id)
```

---

## 六、配置管理

### 6.1 环境变量配置

```bash
# 缓存类型: redis / memory（mongo 为未来扩展预留）
CACHE_TYPE=redis

# Redis 配置（当 CACHE_TYPE=redis 时生效）
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=secret

# MongoDB 配置（当前未启用，为未来扩展预留）
# MONGODB_URI=mongodb://localhost:27017/fqdata
```

### 6.2 编程配置

```python
from FQBase.Cache import RedisCacheAdapter

# 直接配置
redis = RedisCacheAdapter(
    host='localhost',
    port=6379,
    db=0,
    password='secret',
    prefix='fqcache:',
    pickle_first=False,
    safe_mode=False
)
```

### 6.3 配置类

```python
from FQBase.Config import CacheConfig, RedisConfig

# Redis 配置
redis_config = RedisConfig(
    redis_host='localhost',
    redis_port=6379,
    redis_db=0,
    prefix='fqcache:'
)

# 通过配置创建
cache = create_cache(redis_config)
```

---

## 七、监控与调试

### 7.1 LocalCache 统计

```python
cache = LocalCache(name='my_cache')

# 添加数据
cache.set('key1', 'value1')
cache.set('key2', 'value2')

# 获取统计
stats = cache.stats
print(stats)
# {'name': 'my_cache', 'maxsize': 128, 'ttl': 0, 'eviction': 'lru',
#  'size': 2, 'hits': 0, 'misses': 0, 'hit_rate': '0.00%'}

# 使用缓存
cache.get('key1')
cache.get('key1')
cache.get('key2')
cache.get('key3')

# 再次查看统计
print(cache.stats)
# {'hits': 3, 'misses': 1, 'hit_rate': '75.00%'}
```

### 7.2 Redis 健康检查

```python
redis = RedisCacheAdapter(host='localhost', port=6379)

# 健康检查
if redis.health_check():
    print("Redis 连接正常")

# 连接统计
stats = _RedisClientManager.get_pool_stats(host, port, db, password)
print(stats)
# {'connected': True, 'connected_clients': 5, 'blocked_clients': 0}
```

### 7.3 日志调试

```python
import logging

# 启用调试日志
logging.getLogger('FQBase.Cache').setLevel(logging.DEBUG)

cache = LocalCache(name='debug_cache')
cache.set('key', 'value')  # 会输出 DEBUG 日志
```

---

## 八、最佳实践

### 8.1 缓存键命名

```python
# 推荐: 层次化命名
cache.set('user:profile:123', user_profile)
cache.set('stock:price:000001', stock_price)
cache.set('market:index:shanghai', market_index)

# 不推荐: 扁平命名
cache.set('user_profile_123', user_profile)
cache.set('stock_price_000001', stock_price)
```

### 8.2 TTL 设置

```python
# 短期数据: 分钟级别
@local_cache(ttl=60)
def get_realtime_quote(code):
    return fetch_realtime(code)

# 中期数据: 小时级别
@redis_cache(ttl=3600)
def get_daily_bar(code, date):
    return fetch_daily_bar(code, date)

# 长期数据: 天级别
@redis_cache(ttl=86400)
def get_financial_report(code, year):
    return fetch_report(code, year)
```

### 8.3 容量规划

```python
# 小缓存: 单进程，高频访问
cache = LocalCache(name='small', maxsize=100, ttl=300)

# 中缓存: 多数据，高频访问
cache = LocalCache(name='medium', maxsize=1000, ttl=600)

# 大缓存: 考虑 Redis
redis = RedisCacheAdapter(host='localhost')
redis.set('large', big_data, ttl=3600)
```

### 8.4 异常处理

```python
from FQBase.Cache import get_cache_adapter

adapter = get_cache_adapter()

# 缓存操作应放在 try 中
try:
    result = adapter.get('key')
    if result is None:
        result = compute_expensive_value()
        adapter.set('key', result, ttl=3600)
except Exception as e:
    # 降级到直接计算
    result = compute_expensive_value()
```

---

## 九、框架扩展

### 9.1 自定义缓存适配器

```python
from FQBase.Cache._interface import CacheInterface

class CustomCacheAdapter(CacheInterface):
    """自定义缓存适配器"""

    def __init__(self, config):
        self._storage = {}
        self._timestamps = {}

    def get(self, key, default=None):
        if key in self._storage:
            if self._is_expired(key):
                del self._storage[key]
                return default
            return self._storage[key]
        return default

    def set(self, key, value, ttl=None):
        self._storage[key] = value
        if ttl:
            self._timestamps[key] = time.time() + ttl
        return True

    # ... 实现其他接口方法
```

### 9.2 自定义序列化

```python
from FQBase.Cache._serializers import serialize_value, deserialize_value

# 自定义序列化逻辑
def my_serializer(value):
    if isinstance(value, MyClass):
        return b'\x04' + my_proto_encode(value)
    return serialize_value(value)  # 回退到默认

def my_deserializer(data):
    if data.startswith(b'\x04'):
        return my_proto_decode(data[1:])
    return deserialize_value(data)  # 回退到默认
```

---

## 十、版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| 2.7.0 | 2026-03-29 | 修复 keys() prefix 处理、expire() TTL 验证 |
| 2.6.0 | 2026-03-29 | 删除重复函数、统一 bytes 解码、LRU 驱逐清理 |
| 2.2.0 | 2026-03-29 | 支持 per-key TTL、key_ttl_func |
| 2.0.0 | 2026-03-29 | 统一 prefix 策略，优化性能 |
| 1.0.0 | 初始版本 | 基础功能实现 |

---

## 十一、相关文档

| 文档 | 说明 |
|------|------|
| [API 文档](api.md) | 详细 API 参考 |
| [开发指南](development.md) | 开发最佳实践 |
| [应用示例](examples.md) | 10 个应用场景 |
| [缓存适配器](cache_adapters.md) | 适配器详细说明 |
| [架构文档](architecture.md) | 架构设计详解 |
| [设计文档](design.md) | 设计决策与权衡 |
| [Cache Prefix 使用场景](Cache_Prefix_使用场景.md) | prefix 隔离策略 |
