# FQBase 设计文档

## 概述

本文档详细描述 FQBase 框架的设计决策、设计原则和架构权衡。

**版本**: 2.7.0
**最后更新**: 2026-03-29

---

## 设计原则

### 1. 依赖倒置原则 (DIP)

高层模块不应该依赖低层模块，它们都应该依赖于抽象。

```
# 错误：高层依赖低层
class OrderService:
    def __init__(self):
        self.redis = RedisCacheAdapter()  # 高层依赖低层

# 正确：依赖抽象
class OrderService:
    def __init__(self, cache: CacheInterface):  # 依赖接口
        self.cache = cache
```

**实现**:
- `CacheInterface` 定义缓存抽象
- `ServiceContainer` 实现依赖注入
- 所有服务通过接口而非实现类交互

### 2. 单一职责原则 (SRP)

每个模块只负责一件事。

| 模块 | 职责 |
|------|------|
| `LocalCache` | 本地内存缓存 |
| `RedisCacheAdapter` | Redis 分布式缓存 |
| `EventBus` | 事件发布订阅 |
| `FQLogger` | 日志记录 |

### 3. 开闭原则 (OCP)

对扩展开放，对修改关闭。

```python
# 添加新缓存适配器，无需修改现有代码
class MemcachedAdapter(CacheInterface):
    pass

# 在工厂函数中注册
def create_cache(config):
    if config.type == 'memcached':
        return MemcachedAdapter(config)
```

### 4. 接口隔离原则 (ISP)

使用专门的接口，而非通用接口。

```python
# 错误：一个通用接口
class CacheInterface:
    def get(self, key)
    def set(self, key, value)
    def hash_get(self, name, key)  # 太多方法
    def list_push(self, name, value)

# 正确：分离接口
class BasicCacheInterface:
    def get(self, key)
    def set(self, key, value)

class HashCacheInterface:
    def hget(self, name, key)
    def hset(self, name, key, value)
```

---

## 核心设计决策

### 决策 1：缓存接口设计

**问题**: 需要支持多种缓存后端，但不想让用户感知差异。

**方案**: 定义统一接口 `CacheInterface`，各适配器实现此接口。

```python
class CacheInterface:
    def get(self, key: str, default: Any = None) -> Any
    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> bool
    def delete(self, key: str) -> bool
    def exists(self, key: str) -> bool
    def clear(self) -> bool
```

**权衡**:
- ✅ 用户代码无需修改即可切换后端
- ✅ 便于测试（可以注入 MockCache）
- ❌ 适配器必须实现所有方法
- ❌ 部分后端特性无法暴露（如 Redis 的 HyperLogLog）

### 决策 2：单例 vs 工厂

**问题**: 如何管理全局唯一实例？

**方案**: 采用混合模式

```python
@singleton  # 类级别单例
class EventBus:
    _instance = None

class LocalCache:
    def __new__(cls, ...):
        if cls.singleton:
            cls._instances[cls, name] = ...  # 按名称的单例
```

**权衡**:
- ✅ 全局访问方便
- ✅ 按名称区分避免冲突
- ✅ 支持测试隔离 (`reset_singleton`)
- ❌ 可能隐藏依赖关系

### 决策 3：序列化策略

**问题**: 如何处理 pandas/numpy 等特殊类型？

**方案**: 自动检测类型并选择序列化方式

```python
def serialize_value(value):
    if isinstance(value, pd.DataFrame):
        return pickle.dumps(value)
    elif isinstance(value, (int, float, str)):
        return str(value).encode()
    else:
        return pickle.dumps(value)
```

**权衡**:
- ✅ 自动处理常见类型
- ✅ 支持复杂数据结构
- ❌ Pickle 有安全风险（使用 `safe_mode` 缓解）
- ❌ 性能开销

### 决策 4：事件总线设计

**问题**: 如何处理同步/异步事件？如何避免内存泄漏？

**方案**:
- 支持同步/异步发布
- 使用弱引用存储订阅者
- 环形缓冲区限制历史记录

```python
class EventBus:
    _subscribers: Dict[str, List[WeakCallback]]
    _history: RingBuffer  # 限制内存使用

    def subscribe(self, event_type, callback, weak_ref=True):
        if weak_ref:
            ref = WeakMethod(callback)  # 防止内存泄漏
```

**权衡**:
- ✅ 防止内存泄漏
- ✅ 限制内存使用
- ✅ 支持异步处理
- ❌ 弱引用无法保证回调一定执行

### 决策 5：配置管理

**问题**: 如何平衡灵活性和简洁性？

**方案**: 分层配置

```
Config/
├── core/           # 框架配置（env, cache_config）
└── business/       # 业务配置（constants, datasource）
```

```python
# 核心配置 - 框架使用
from FQBase.Config.core import get_env, Setting

# 业务配置 - 业务代码使用
from FQBase.Config.business import MARKET_TYPE, ORDER_DIRECTION
```

**权衡**:
- ✅ 核心配置不依赖业务
- ✅ 业务配置可以复用核心配置
- ✅ 保持向后兼容
- ❌ 两套导入路径可能混淆

---

## 模式应用

### 适配器模式

将不同缓存后端统一为相同接口：

```
                    ┌─────────────┐
                    │CacheInterface│
                    └──────┬──────┘
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    ┌───────────┐    ┌───────────┐   ┌───────────┐
    │LocalCache │    │RedisCache │   │MongoCache │
    └───────────┘    └───────────┘   └───────────┘
```

### 装饰器模式

通过装饰器添加重试、熔断等横切关注点：

```python
@circuit_breaker(failure_threshold=5)
@retry(max_attempts=3)
@redis_cache(ttl=3600)
def get_market_data(symbol):
    return api.fetch(symbol)
```

### 观察者模式

事件总线实现发布-订阅：

```
    ┌──────────┐         ┌──────────┐
    │ Publisher│────────▶│Subscriber│
    └──────────┘         └──────────┘
         │                    ▲
         │    ┌──────────┐    │
         └───▶│ EventBus │────┘
              └──────────┘
```

### 策略模式

缓存驱逐策略可切换：

```python
class LocalCache:
    def __init__(self, eviction='lru'):  # 'lru' or 'fifo'
        if eviction == 'lru':
            self._evict = self._evict_lru
        elif eviction == 'fifo':
            self._evict = self._evict_fifo
```

### 依赖注入

通过容器管理依赖：

```python
container = ServiceContainer()
container.register_singleton(ICache, RedisCacheAdapter)
container.register_singleton(IDatabase, MongoDatabase)

# 自动注入
service = container.get(OrderService)  # OrderService 的 ICache 参数自动注入
```

---

## 异常设计

### 异常层次

```
FQException (基类)
├── DataSourceException
├── DataFetchException
├── NetworkException
├── RedisException
├── MongoDBException
└── ConfigException
```

### 设计原则

1. **记录详细信息**: 包含错误码、上下文
2. **不泄露敏感信息**: 密码等不记录在异常中
3. **可恢复异常**: 提供足够信息进行降级处理

```python
class DataFetchException(FQException):
    def __init__(self, message, code='E_FETCH', details=None):
        super().__init__(message, code=code, details=details)
```

---

## 线程安全设计

### 锁粒度

| 组件 | 锁策略 | 说明 |
|------|--------|------|
| `LocalCache` | `self._lock` | 粗粒度，简化实现 |
| `EventBus` | `self._subscribers_lock` | 读写分离 |
| `ServiceContainer` | `self._lock` | 注册/获取操作 |

### 无锁数据结构

部分场景使用无锁数据结构优化：

```python
class RingBuffer:
    """无锁环形缓冲区，用于事件历史"""
    def __init__(self, capacity):
        self._buffer = [None] * capacity
        self._head = 0  # 原子操作
```

---

## 性能优化

### 缓存优化

1. **惰性清理**: 后台线程定期清理过期项
2. **批量操作**: `get_many`, `set_many`
3. **连接池**: Redis/MongoDB 使用连接池

### 内存优化

1. **弱引用**: EventBus 订阅者使用弱引用
2. **环形缓冲区**: 限制历史记录大小
3. **对象池**: 复用 expensive 对象

---

## 扩展指南

### 添加新缓存适配器

```python
from FQBase.Cache import CacheInterface

class MemcachedAdapter(CacheInterface):
    def __init__(self, servers=['localhost:11211']):
        import pymemcache
        self.client = pymemcache.client.hash.HashClient(servers)

    def get(self, key, default=None):
        return self.client.get(key) or default

    def set(self, key, value, ttl=None):
        expire = ttl or 0
        return self.client.set(key, value, expire=expire)
```

### 添加新通知渠道

```python
from FQBase.Core import NotificationHandler

class DingTalkHandler(NotificationHandler):
    def __init__(self, webhook_url):
        self.webhook_url = webhook_url

    def send(self, content, **kwargs):
        import requests
        payload = {'msgtype': 'text', 'text': {'content': content}}
        return requests.post(self.webhook_url, json=payload).ok
```

---

## 相关文档

- [架构设计](architecture.md)
- [API 文档](../modules/)
- [最佳实践](best-practices.md)
