---
title: Cache - 故障排查
description: Cache 模块常见问题与解决方案
tag:
  - fqbase
  - cache
---

# Cache - 故障排查

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → [安全指南](./security.md) → **[故障排查](./troubleshooting.md)** → [常见问题](./faq.md) |

## 概述

本指南帮助解决 Cache 模块的常见问题。

## 常见问题

### 问题 1: Redis 连接失败

**症状：**
- 错误：`ConnectionError: Error connecting to localhost:6379`

**可能原因：**
- Redis 服务未启动
- 网络连接问题
- 防火墙阻止连接

**解决方案：**

1. 检查 Redis 服务：
```bash
redis-cli ping
# 返回 PONG 表示正常
```

2. 检查连接配置：
```python
redis = RedisCacheAdapter(host='localhost', port=6379)
redis.ping()
```

---

### 问题 2: 缓存未命中

**症状：**
- 每次调用都执行函数，未使用缓存

**可能原因：**
- TTL 设置为 0
- 缓存键不同
- 缓存被清除

**解决方案：**

1. 检查 TTL 设置：
```python
@redis_cache(ttl=3600)  # 确保 TTL > 0
def my_func():
    pass
```

2. 检查缓存键：
```python
# 使用 key_prefix 统一键前缀
@redis_cache(ttl=3600, key_prefix='myapp:')
def my_func():
    pass
```

---

### 问题 3: 内存使用过高

**症状：**
- 内存持续增长

**可能原因：**
- LocalCache maxsize 过大
- 未正确清理缓存

**解决方案：**

1. 减小 maxsize：
```python
cache = LocalCache(maxsize=64)
```

2. 使用 Redis 代替：
```python
@redis_cache(ttl=3600)
def my_func():
    pass
```

---

### 问题 4: 序列化错误

**症状：**
- 错误：`TypeError: cannot pickle ...`

**可能原因：**
- 缓存了不可序列化的对象

**解决方案：**

1. 使用可序列化格式：
```python
# ❌ 不好：缓存对象实例
class MyClass:
    pass
cache.set("key", MyClass())

# ✅ 好：缓存字典
cache.set("key", {"data": "value"})
```

---

### 问题 5: 线程安全

**症状：**
- 并发访问时数据错乱

**可能原因：**
- 未使用线程安全的缓存实现

**解决方案：**
- LocalCache 使用了 threading.Lock，是线程安全的
- 确保使用的是 LocalCache 实例

---

### 问题 6: 缓存穿透

**症状：**
- 大量请求直接穿透到数据库

**可能原因：**
- 未缓存空值

**解决方案：**
```python
def get_data(key):
    result = cache.get(key)
    if result is not None:
        return result
    
    data = db.query(key)
    # 空值也缓存
    cache.set(key, data if data else NULL_MARKER, ttl=300)
    return data
```

---

## 诊断工具

### 启用调试日志

```python
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("FQBase.Cache")
logger.debug("调试信息")
```

### 健康检查

```python
from FQBase.Cache import RedisCacheAdapter

redis = RedisCacheAdapter(host='localhost', port=6379)

# 测试连接
is_connected = redis.ping()
print(f"Redis 连接: {is_connected}")
```

### 缓存统计

```python
cache = LocalCache()
print(cache.stats)
# {'hits': 100, 'misses': 20, 'hit_rate': '83.33%'}
```

---

## 相关文档

- [常见问题](./faq.md)
- [最佳实践](./best-practices.md)
- [API参考](./api.md)
