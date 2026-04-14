---
title: Cache - 常见问题
description: Cache 模块常见问题与解答
tag:
  - fqbase
  - cache
---

# Cache - 常见问题

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → [安全指南](./security.md) → [故障排查](./troubleshooting.md) → **[常见问题](./faq.md)** |

## 一般问题

### Q: LocalCache 和 RedisCacheAdapter 有什么区别？

**A:** LocalCache 是进程内缓存，数据存储在内存中；RedisCacheAdapter 是分布式缓存，数据存储在 Redis 中。LocalCache 延迟更低（~100ns），适合单进程场景；RedisCacheAdapter 延迟较高（~1-10ms），但支持跨进程/跨实例共享。

### Q: 如何选择缓存策略？

**A:** 
- 单进程 + 无 TTL 需求 → 使用 `@lru_cache`（Python 内置）
- 单进程 + 需要 TTL → 使用 `@local_cache`
- 多进程/多实例共享 → 使用 `@redis_cache`

详见 [三种缓存机制的场景化对比分析](./cache_comparison.md)

### Q: 缓存不起作用怎么办？

**A:** 
1. 检查缓存是否正确初始化
2. 检查 TTL 设置是否正确
3. 检查缓存键是否正确生成
4. 启用调试日志查看详细信息

### Q: 缓存键冲突怎么办？

**A:** 使用 RedisCacheAdapter 的 prefix 参数隔离不同业务：
```python
user_cache = RedisCacheAdapter(prefix='user:')
order_cache = RedisCacheAdapter(prefix='order:')
```

### Q: 如何清除所有缓存？

**A:**
```python
# LocalCache
cache.clear()

# RedisCacheAdapter
import redis
r = redis.Redis()
r.flushdb()  # 清除当前数据库
```

## 使用问题

### Q: 支持哪些数据类型？

**A:**
- LocalCache: 任何可 pickle 的 Python 对象
- RedisCacheAdapter: String、Hash、List、Set + 支持 pandas/numpy 自动序列化
- MongoCacheAdapter: 字典/文档对象

详见 [CacheAdapters 与 DirectRedis 比较](./cache_adapters_directredis.md)

### Q: 如何查看缓存统计？

**A:**
```python
from FQBase.Cache import LocalCache
cache = LocalCache()
print(cache.stats)
# {'hits': 100, 'misses': 20, 'hit_rate': '83.33%', 'evictions': 5}
```

### Q: 装饰器和直接使用有什么区别？

**A:** 装饰器自动处理缓存键生成，直接使用需要手动管理键：
```python
# 装饰器：自动生成缓存键
@local_cache(ttl=300)
def my_func(a, b):
    return a + b

# 直接使用：需要手动管理键
cache = LocalCache()
cache.set('my_key', my_func(1, 2), ttl=300)
```

## 性能问题

### Q: 缓存延迟高怎么办？

**A:**
1. 考虑使用 LocalCache 代替 Redis
2. 使用批量操作代替单条操作
3. 检查 Redis 连接池配置
4. 启用本地短路（short-circuit）

### Q: 内存使用过高怎么办？

**A:**
1. 减小 LocalCache 的 maxsize
2. 使用 Redis 缓存代替本地缓存
3. 定期清理过期缓存

### Q: Redis 连接池耗尽怎么办？

**A:**
```python
# 增加连接池大小
redis = RedisCacheAdapter(max_connections=100)
```

## 安全问题

### Q: 如何保护缓存中的数据？

**A:**
1. 不要缓存敏感信息
2. 使用加密缓存值
3. 限制缓存访问权限
4. 使用 safe_mode 禁用 pickle

---

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
- [故障排查](./troubleshooting.md)
- [三种缓存机制对比](./cache_comparison.md)
