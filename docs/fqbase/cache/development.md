# Cache 模块开发指南

## 添加新的缓存适配器

### 1. 实现 CacheInterface 接口

创建新的适配器类，实现 `CacheInterface` 协议定义的所有方法：

```python
from FQBase.Cache._interface import CacheInterface
from typing import Any, Optional, Dict, List

class CustomCacheAdapter:
    """自定义缓存适配器"""

    def __init__(self, config):
        self.config = config

    def get(self, key: str, default: Any = None) -> Any:
        """获取缓存值"""
        raise NotImplementedError

    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> bool:
        """设置缓存值"""
        raise NotImplementedError

    def delete(self, key: str) -> bool:
        """删除缓存"""
        raise NotImplementedError

    def exists(self, key: str) -> bool:
        """检查键是否存在"""
        raise NotImplementedError

    def clear(self) -> bool:
        """清空所有缓存"""
        raise NotImplementedError

    def ttl(self, key: str) -> int:
        """获取剩余生存时间"""
        raise NotImplementedError

    def expire(self, key: str, ttl: int) -> bool:
        """设置过期时间"""
        raise NotImplementedError

    def get_many(self, keys: List[str]) -> Dict[str, Any]:
        """批量获取"""
        raise NotImplementedError

    def set_many(self, mapping: Dict[str, Any], ttl: Optional[int] = None) -> bool:
        """批量设置"""
        raise NotImplementedError

    def delete_many(self, keys: List[str]) -> bool:
        """批量删除"""
        raise NotImplementedError
```

### 2. 在工厂函数中注册

在 `FQBase.Cache.__init__.py` 的 `create_cache` 函数中添加新适配器的支持：

```python
def create_cache(config: CacheConfigProtocol = None) -> CacheInterface:
    if config is None:
        config = get_cache_config()

    if config.cache_type == "redis":
        return RedisCacheAdapter(config)
    elif config.cache_type == "mongo":
        return MongoCacheAdapter(config)
    elif config.cache_type == "custom":
        return CustomCacheAdapter(config)  # 添加新适配器
    else:
        return LocalCache(name="default", ttl=config.ttl_default)
```

---

## 缓存键设计规范

### 命名规范

1. **使用冒号分隔层级**：
   ```
   user:profile:123          # 用户 -> 个人资料 -> ID
   stock:daily:600000        # 股票 -> 日线 -> 代码
   order:filled:20240101     # 订单 -> 成交 -> 日期
   ```

2. **添加前缀避免冲突**：
   ```python
   # 使用 prefix 参数
   redis = RedisCacheAdapter(prefix='fqcache:')
   # 实际键: fqcache:user:profile:123
   ```

3. **键名小写**：
   ```python
   # 推荐
   cache.set('user:profile', data)

   # 避免
   cache.set('User:Profile', data)
   ```

### Prefix 使用场景

详见 [Cache Prefix 使用场景](./Cache_Prefix_使用场景.md)

---

## 序列化策略

### 支持的类型

| 类型 | 序列化方式 |
|------|-----------|
| str | 直接存储 |
| int/float/bool | pickle |
| list/tuple/dict/set | pickle |
| pandas DataFrame/Series | pickle |
| numpy ndarray | 自定义二进制格式 |

### 自定义序列化

如需支持其他类型，在 `_serializers.py` 中添加：

```python
def serialize_value(value: Any) -> Union[str, bytes, None]:
    if isinstance(value, CustomType):
        return json.dumps(value.__dict__).encode()
    # ... 其他类型
```

---

## 性能优化

### 1. 批量操作优先

```python
# 推荐：批量操作
cache.set_many({'key1': 'v1', 'key2': 'v2', 'key3': 'v3'})

# 避免：循环单条操作
for key, value in data.items():
    cache.set(key, value)
```

### 2. 合理设置 TTL

```python
# 实时数据：短 TTL
quote_cache = LocalCache(name='quote', ttl=60)

# 日线数据：长 TTL
daily_cache = LocalCache(name='daily', ttl=86400)
```

### 3. 使用连接池

```python
# RedisCacheAdapter 内部使用连接池
# 确保配置合理的连接参数
redis = RedisCacheAdapter(
    host='localhost',
    port=6379,
    # 连接池参数由 redis-py 自动管理
)
```

---

## 线程安全

所有缓存适配器都是线程安全的：

- `LocalCache`：使用 `threading.Lock`
- `RedisCacheAdapter`：Redis 客户端本身线程安全
- `MongoCacheAdapter`：MongoDB 客户端本身线程安全

---

## 异常处理

缓存操作失败时应优雅降级：

```python
def get_cached_data(key):
    try:
        return cache.get(key)
    except Exception as e:
        logger.warning(f"Cache get failed: {e}")
        return None  # 降级处理

def set_cached_data(key, value):
    try:
        cache.set(key, value)
    except Exception as e:
        logger.warning(f"Cache set failed: {e}")
        # 不抛出异常，避免影响主流程
```

---

## 测试指南

### 单元测试

```python
import pytest
from FQBase.Cache import LocalCache

class TestLocalCache:
    def setup_method(self):
        self.cache = LocalCache(name='test', singleton=False)

    def test_set_and_get(self):
        self.cache.set('key', 'value')
        assert self.cache.get('key') == 'value'

    def test_ttl(self):
        cache = LocalCache(name='test', ttl=1, singleton=False)
        cache.set('key', 'value')
        assert cache.ttl('key') <= 1

    def test_not_exists(self):
        assert self.cache.get('nonexistent') is None

    def test_delete(self):
        self.cache.set('key', 'value')
        assert self.cache.delete('key') is True
        assert self.cache.get('key') is None

    def test_clear(self):
        self.cache.set('key1', 'value1')
        self.cache.set('key2', 'value2')
        self.cache.clear()
        assert len(self.cache) == 0

    def test_stats(self):
        self.cache.set('key', 'value')
        self.cache.get('key')
        self.cache.get('nonexistent')
        stats = self.cache.stats
        assert stats['hits'] == 1
        assert stats['misses'] == 1
```

### 集成测试

```python
import pytest
from FQBase.Cache import RedisCacheAdapter

class TestRedisCacheAdapter:
    @pytest.fixture
    def redis_cache(self):
        cache = RedisCacheAdapter(host='localhost', port=6379)
        yield cache
        cache.clear()

    def test_set_and_get(self, redis_cache):
        redis_cache.set('key', 'value', ttl=3600)
        assert redis_cache.get('key') == 'value'

    def test_hash_operations(self, redis_cache):
        redis_cache.hset('user:1', 'name', '张三')
        assert redis_cache.hget('user:1', 'name') == '张三'

    def test_list_operations(self, redis_cache):
        redis_cache.lpush('queue', 'a', 'b', 'c')
        assert redis_cache.lpop('queue') == 'c'
```

---

## 监控与调试

### 查看缓存统计

```python
cache = LocalCache(name='my_cache')
cache.set('key', 'value')
cache.get('key')
cache.get('nonexistent')
print(cache.stats)
# {'name': 'my_cache', 'hits': 1, 'misses': 1, 'hit_rate': '50.00%'}
```

### 健康检查

```python
redis = RedisCacheAdapter(host='localhost', port=6379)
if redis.ping():
    print("Redis 连接正常")
else:
    print("Redis 连接失败")

mongo = MongoCacheAdapter(host='localhost', port=27017)
if mongo.ping():
    print("MongoDB 连接正常")
```

### 键扫描

```python
redis = RedisCacheAdapter(host='localhost', port=6379, prefix='fqcache:')

# 获取所有键
all_keys = redis.keys('*')

# 获取匹配模式的键
user_keys = redis.keys('user:*')

# 限制返回数量
first_100 = redis.keys('*', limit=100)
```

---

## 相关文档

- [Cache API](./api.md)
- [Cache Prefix 使用场景](./Cache_Prefix_使用场景.md)
- [cache_adapters](./cache_adapters.md)
