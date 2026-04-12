
# CacheAdapters 与 JsonStorage 比较

**模块路径**: `FQBase.Cache.CacheAdapters`
**源码**: [CacheAdapters.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Cache/CacheAdapters.py)

---

## 一、JsonStorage 概述

JsonStorage 是一个简化 Redis Hash 操作的库，将 Hash 操作封装为 JSON 对象操作。适用于需要以 JSON 语义操作 Redis 的场景。

## 12.2 功能对比

| 功能 | JsonStorage | RedisCacheAdapter |
|------|-------------|-------------------|
| 底层实现 | Redis Hash | Redis Hash/String |
| 数据格式 | JSON | pickle + JSON |
| 自动序列化 | ✅ JSON | ✅ pickle/JSON |
| pandas DataFrame | ❌ | ✅ |
| pandas Series | ❌ | ✅ |
| numpy ndarray | ❌ | ✅ |
| String 操作 | ❌ | ✅ |
| Hash 操作 | ✅ (封装) | ✅ (原生) |
| List 操作 | ❌ | ✅ |
| Set 操作 | ❌ | ✅ |
| TTL 支持 | ❌ | ✅ |
| 连接池管理 | ❌ | ✅ |
| 健康检查 | ❌ | ✅ |
| Pipeline 批量 | ❌ | ✅ |
| SCAN 迭代 | ❌ | ✅ |

## 三、API 对比

| 操作 | JsonStorage | RedisCacheAdapter |
|------|-------------|-------------------|
| 存储 | `storage.update(key, data)` | `redis.hmset(key, data)` |
| 读取 | `storage.get(key)` | `redis.hgetall(key)` |
| 更新字段 | `storage.update(key, {field: value})` | `redis.hset(key, field, value)` |
| 删除字段 | `storage.delete_field(key, field)` | 需组合操作 |
| 前缀支持 | `prefix="user:"` 自动添加 | 需手动拼接 |
| 删除 Key | `storage.delete(key)` | `redis.delete(key)` |

## 12.4 替代用法

### 基本 CRUD 操作

```python
# JsonStorage 旧代码
from redis_json_storage import JsonStorage
storage = JsonStorage(conn, prefix="user:")
storage.update("123", {"name": "张三", "age": 30})
data = storage.get("123")
storage.delete_field("123", "age")
storage.delete("123")

# RedisCacheAdapter 新代码
from FQBase.FQDataStore.CacheAdapters import RedisCacheAdapter
redis = RedisCacheAdapter(host='localhost', port=6379)
# prefix 需手动处理
redis.hmset(f"user:123", {"name": "张三", "age": 30})
data = redis.hgetall(f"user:123")
# 删除字段需组合操作
redis.hdel(f"user:123", "age")
redis.delete(f"user:123")
```

### 批量操作

```python
# JsonStorage 旧代码
storage.update("user:1", {"name": "张三"})
storage.update("user:2", {"name": "李四"})

# RedisCacheAdapter 新代码
redis.hmset("user:1", {"name": "张三"})
redis.hmset("user:2", {"name": "李四"})
# 或使用批量
pipe = redis._client.pipeline()
pipe.hmset("user:1", {"name": "张三"})
pipe.hmset("user:2", {"name": "李四"})
pipe.execute()
```

## 12.5 迁移建议

1. **JSON 语义 vs 完整功能**：如果只需要简单的 JSON 存储，JsonStorage 更直观；如果需要完整 Redis 功能，使用 RedisCacheAdapter
2. **前缀管理**：RedisCacheAdapter 不自动添加前缀，需要手动拼接
3. **字段级操作**：RedisCacheAdapter 需要组合多个操作来实现字段删除

---

## 相关文档

| 文档 | 说明 |
|------|------|
| [CacheAdapters API](./cache_adapters.md) | 缓存适配器完整 API |
| [CacheAdapters 与 DirectRedis 比较](./cache_adapters_directredis.md) | RedisCacheAdapter 与 DirectRedis 对比 |
| [API 文档](api.md) | 模块 API 参考 |
| [应用示例](examples.md) | 10 个应用场景代码示例 |
| [Cache Prefix 使用场景](Cache_Prefix_使用场景.md) | prefix 隔离策略详解 |
| [架构文档](architecture.md) | 架构设计、组件关系 |
| [设计文档](design.md) | 设计决策、权衡分析 |
