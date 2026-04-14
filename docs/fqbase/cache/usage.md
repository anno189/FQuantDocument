---
title: Cache - 使用指南
description: Cache 模块详细使用指南
tag:
  - fqbase
  - cache
---

# Cache - 使用指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [速查表](./cheatsheet.md) → [动手实验室](./workshop.md) → **[使用指南](./usage.md)** → [案例库](./examples.md) |
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → [设计原则](./design.md) → [API参考](./api.md) → [开发指南](./development.md) → **[使用指南](./usage.md)** → [最佳实践](./best-practices.md) |

## 概述

本指南详细介绍如何使用 Cache 模块的三种缓存实现，包括 LocalCache、RedisCacheAdapter、MongoCacheAdapter，以及装饰器用法。

## LocalCache 使用

### 基本操作

```python
from FQBase.Cache import LocalCache

# 创建缓存实例
cache = LocalCache(name='my_cache', maxsize=128, ttl=300)

# 设置缓存
cache.set('key1', 'value1')
cache.set('key2', 'value2', ttl=60)  # 覆盖默认 TTL

# 获取缓存
value = cache.get('key1')
value = cache.get('key1', default='default_value')  # 设置默认值

# 删除缓存
cache.delete('key1')

# 检查存在
exists = cache.exists('key1')

# 清空缓存
cache.clear()
```

### 批量操作

```python
# 批量设置
cache.set_many({
    'key1': 'value1',
    'key2': 'value2',
    'key3': 'value3'
}, ttl=300)

# 批量获取
values = cache.get_many(['key1', 'key2', 'key3'])
# 返回: {'key1': 'value1', 'key2': 'value2'}（key3 不存在则不返回）

# 批量删除
deleted_count = cache.delete_many(['key1', 'key2'])
```

### TTL 操作

```python
# 设置 TTL
cache.set('key1', 'value1', ttl=3600)

# 获取剩余 TTL
remaining = cache.ttl('key1')
# 返回: 3600（秒），-1（永不过期），-2（键不存在）

# 设置过期时间
cache.expire('key1', 1800)  # 30 分钟后过期
```

### 统计信息

```python
# 获取统计信息
stats = cache.stats
print(stats)
# {'hits': 100, 'misses': 20, 'hit_rate': '83.33%', 'evictions': 5, ...}
```

## RedisCacheAdapter 使用

### String 操作

```python
from FQBase.Cache import RedisCacheAdapter

redis = RedisCacheAdapter(host='localhost', port=6379, prefix='myapp:')

# 基本操作
redis.set('name', '张三', ttl=3600)
value = redis.get('name')

# 批量操作
redis.mset({'key1': 'value1', 'key2': 'value2'})
values = redis.mget('key1', 'key2')

# 删除
redis.delete('name')
exists = redis.exists('name')

# TTL
redis.expire('name', 1800)
ttl = redis.ttl('name')
```

### Hash 操作

```python
# 设置 Hash
redis.hset('user:1', 'name', '张三')
redis.hset('user:1', 'age', '30')

# 批量设置
redis.hmset('user:1', {'name': '张三', 'age': 30, 'city': '北京'})

# 获取单个字段
name = redis.hget('user:1', 'name')

# 批量获取字段
values = redis.hmget('user:1', 'name', 'age', 'city')

# 获取所有字段
user = redis.hgetall('user:1')
# 返回: {'name': '张三', 'age': '30', 'city': '北京'}

# 获取所有值
values = redis.hvals('user:1')

# 删除字段
redis.hdel('user:1', 'age')
```

### List 操作

```python
# 插入
redis.lpush('queue', 'task1')  # 左侧插入
redis.rpush('queue', 'task2')  # 右侧插入

# 获取
tasks = redis.lrange('queue', 0, -1)  # 获取所有

# 弹出
task = redis.lpop('queue')  # 左侧弹出
task = redis.rpop('queue')  # 右侧弹出

# 长度
length = redis.llen('queue')
```

### Set 操作

```python
# 添加成员
redis.sadd('tags', 'python', 'redis', 'cache', 'python')  # python 只会添加一次

# 获取所有成员
tags = redis.smembers('tags')

# 检查成员
is_member = redis.sismember('tags', 'python')

# 成员数量
count = redis.scard('tags')

# 移除成员
redis.srem('tags', 'cache')

# 随机弹出
random_member = redis.spop('tags')
```

### 使用 prefix 隔离

```python
# 不同 prefix 隔离不同业务
user_cache = RedisCacheAdapter(prefix='user:')
order_cache = RedisCacheAdapter(prefix='order:')

user_cache.set('1', {'name': '张三'})   # 实际键: user:1
order_cache.set('1', {'id': 1})          # 实际键: order:1

print(user_cache.get('1'))  # {'name': '张三'}
print(order_cache.get('1'))  # {'id': 1}
```

### Pipeline 批量操作

```python
# 使用 Pipeline 减少网络往返
pipe = redis._client.pipeline()
pipe.set('key1', 'value1')
pipe.set('key2', 'value2')
pipe.get('key1')
pipe.get('key2')
results = pipe.execute()
# results: [True, True, 'value1', 'value2']
```

### SCAN 安全遍历

```python
# 使用 SCAN 遍历大量键（替代 KEYS，避免阻塞）
keys = redis.scan(match='user:*', count=1000)
# 返回匹配 'user:*' 的键列表
```

## 装饰器使用

### @local_cache

```python
from FQBase.Cache import local_cache

@local_cache(maxsize=128, ttl=300)
def expensive_computation(x, y):
    print("执行计算...")
    return x + y

# 第一次调用
result1 = expensive_computation(1, 2)  # 输出: 执行计算...

# 第二次调用（使用缓存）
result2 = expensive_computation(1, 2)  # 不输出，直接返回缓存结果
```

### @redis_cache

```python
from FQBase.Cache import redis_cache

@redis_cache(ttl=3600, key_prefix='fetch_data')
def fetch_data_from_api(data_id):
    return api_client.get(f'/data/{data_id}')

# 异步函数支持
@redis_cache(ttl=600, key_prefix='async_fetch')
async def async_fetch_data(data_id):
    return await api_client.async_get(f'/data/{data_id}')
```

### 自定义 TTL

```python
# 使用 key_ttl_func 为不同参数设置不同 TTL
def get_ttl_by_data_type(func, args, kwargs):
    data_type = kwargs.get('data_type') or args[0] if args else 'default'
    ttl_map = {
        'realtime': 60,      # 实时数据 60 秒
        'daily': 3600,       # 日数据 1 小时
        'historical': 86400  # 历史数据 1 天
    }
    return ttl_map.get(data_type, 300)

@local_cache(ttl=300, key_ttl_func=get_ttl_by_data_type)
def get_market_data(data_type):
    return fetch_market_data(data_type)
```

## 配置

### LocalCache 配置

```python
cache = LocalCache(
    name='my_cache',    # 缓存名称（用于单例识别）
    maxsize=128,       # 最大条目数
    ttl=300,           # 默认 TTL（秒），0=永不过期
    eviction='lru'     # 驱逐策略：'lru' 或 'fifo'
)
```

### RedisCacheAdapter 配置

```python
redis = RedisCacheAdapter(
    host='localhost',
    port=6379,
    db=0,
    password=None,
    prefix='myapp:',              # 键前缀
    pickle_first=False,           # 序列化优先级
    safe_mode=False,             # 安全模式
    socket_timeout=5,            # socket 超时
    socket_connect_timeout=5,    # 连接超时
    max_connections=50          # 最大连接数
)
```

## 错误处理

```python
from FQBase.Cache import RedisCacheAdapter
import redis as redis_lib

try:
    redis = RedisCacheAdapter(host='localhost', port=6379)
    redis.set('key', 'value')
except redis_lib.ConnectionError as e:
    print(f"Redis 连接失败: {e}")
except redis_lib.TimeoutError as e:
    print(f"Redis 操作超时: {e}")
except Exception as e:
    print(f"其他错误: {e}")
```

---

## 相关文档

- [API参考](./api.md)
- [开发指南](./development.md)
- [最佳实践](./best-practices.md)
- [故障排查](./troubleshooting.md)
- [三种缓存机制对比](./cache_comparison.md)
