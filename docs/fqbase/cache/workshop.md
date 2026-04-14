---
title: Cache - 动手实验室
description: Cache 模块动手练习指南
tag:
  - fqbase
  - cache
---

# Cache - 动手实验室

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [速查表](./cheatsheet.md) → **[动手实验室](./workshop.md)** → [使用指南](./usage.md) → [案例库](./examples.md) |

## 概述

本实验室提供动手练习，帮助您加深对 Cache 模块的理解。

## 准备环境

```bash
pip install fquant-base
```

## Lab 1: LocalCache 基础

### 目标

掌握 LocalCache 的基本操作。

### 练习代码

```python
from FQBase.Cache import LocalCache

# 创建缓存
cache = LocalCache(name='lab1', maxsize=10, ttl=60)

# 基本操作
cache.set('name', '张三')
print(cache.get('name'))  # 输出: 张三

# TTL
import time
cache.set('temp', 'value', ttl=2)
print(cache.get('temp'))  # 输出: value
time.sleep(3)
print(cache.get('temp'))  # 输出: None（已过期）

# 统计
cache.set('a', '1')
cache.get('a')
cache.get('nonexistent')
print(cache.stats)
```

### 任务

1. 创建一个 LocalCache 实例
2. 设置 5 个缓存条目
3. 获取缓存统计信息
4. 验证 TTL 过期

---

## Lab 2: Redis 缓存

### 目标

掌握 RedisCacheAdapter 的使用。

### 练习代码

```python
from FQBase.Cache import RedisCacheAdapter

# 创建 Redis 缓存
redis = RedisCacheAdapter(host='localhost', port=6379, prefix='lab2:')

# String 操作
redis.set('name', '张三', ttl=3600)
print(redis.get('name'))

# Hash 操作
redis.hset('user:1', 'name', '张三')
redis.hset('user:1', 'age', '30')
print(redis.hgetall('user:1'))

# List 操作
redis.lpush('queue', 'task1')
redis.rpush('queue', 'task2')
print(redis.lrange('queue', 0, -1))
```

### 任务

1. 连接 Redis
2. 执行 String/Hash/List/Set 操作
3. 使用 prefix 隔离不同数据
4. 测试 TTL 功能

---

## Lab 3: 装饰器缓存

### 目标

掌握 @local_cache 和 @redis_cache 装饰器。

### 练习代码

```python
from FQBase.Cache import local_cache, redis_cache

# 本地缓存装饰器
@local_cache(ttl=60)
def expensive_compute(x, y):
    print("执行计算...")
    return x + y

# 测试
result1 = expensive_compute(1, 2)  # 输出: 执行计算...
result2 = expensive_compute(1, 2)  # 不输出，使用缓存

print(result1 == result2)  # True
```

### 任务

1. 创建一个带缓存的函数
2. 验证缓存命中/未命中
3. 使用 key_ttl_func 实现动态 TTL

---

## 实验室总结

完成所有实验后，你应该掌握：

- [x] LocalCache 基本操作
- [x] RedisCacheAdapter 使用
- [x] 缓存装饰器
- [x] TTL 和驱逐策略

---

## 下一步

- 学习 [最佳实践](./best-practices.md)
- 查看 [案例库](./examples.md)
- 阅读 [API参考](./api.md)

---

## 相关文档

- [README](./README.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
- [API参考](./api.md)
