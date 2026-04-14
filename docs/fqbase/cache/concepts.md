---
title: Cache - 核心概念
description: 深入理解 Cache 模块的核心概念
tag:
  - fqbase
  - cache
---

# Cache - 核心概念

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [术语表](./glossary.md) → **[核心概念](./concepts.md)** → [框架集成](./framework.md) → [技术架构](./architecture.md) |
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → **[核心概念](./concepts.md)** → [设计原则](./design.md) → [API参考](./api.md) |

## 概述

本文档深入介绍 Cache 模块的核心概念，帮助读者理解缓存系统的工作原理。

## 概念 1: 缓存

### 概念解释

缓存是一种临时存储数据的技术，目的是加速数据访问。缓存位于应用和持久存储（如数据库）之间，当应用需要数据时，首先检查缓存，如果缓存中存在则直接返回，避免重复计算或数据库查询。

### 原理

```
应用请求数据
    ↓
检查缓存
    ↓
┌── 缓存命中 → 直接返回
│
└── 缓存未命中 → 从数据源获取 → 存入缓存 → 返回数据
```

### 代码示例

```python
from FQBase.Cache import local_cache

@local_cache(ttl=300)
def get_user(user_id):
    # 如果缓存未命中，从数据库查询
    return db.query(f'SELECT * FROM users WHERE id = {user_id}')
```

---

## 概念 2: LRU 驱逐策略

### 概念解释

LRU（Least Recently Used，最近最少使用）是一种缓存驱逐策略。当缓存满时，优先驱逐最近最少使用的条目。

### 原理

- 每次访问时将条目移到末尾
- 驱逐时从头部移除最旧的条目
- 适合热点数据场景

### 代码示例

```python
# 使用 LRU 策略
cache = LocalCache(maxsize=100, eviction='lru')
```

---

## 概念 3: FIFO 驱逐策略

### 概念解释

FIFO（First In First Out，先进先出）是一种缓存驱逐策略。当缓存满时，优先驱逐最早插入的条目。

### 原理

- 按插入顺序排队
- 驱逐时移除最早插入的条目
- 适合周期性数据场景

### 代码示例

```python
# 使用 FIFO 策略
cache = LocalCache(maxsize=100, eviction='fifo')
```

---

## 概念 4: TTL 过期

### 概念解释

TTL（Time To Live，生存时间）是缓存条目的有效期。超过 TTL 后，缓存条目自动过期并被清理。

### 原理

- 设置时记录过期时间戳
- 访问时检查是否过期
- 过期条目被惰性清理或主动清理

### 代码示例

```python
# 设置 TTL
cache.set('key', 'value', ttl=3600)  # 1小时后过期

# 检查剩余 TTL
remaining = cache.ttl('key')
```

---

## 概念 5: 序列化

### 概念解释

序列化是将 Python 对象转换为可存储/传输格式的过程。反序列化是将存储/传输格式转换回 Python 对象。

### 原理

- LocalCache 使用 pickle
- RedisCacheAdapter 支持 pickle 和 msgpack
- 自动处理 numpy 和 pandas 对象

### 代码示例

```python
# 序列化示例
import pickle
data = {'name': '张三', 'age': 30}
serialized = pickle.dumps(data)
deserialized = pickle.loads(serialized)

# pandas 序列化
import pandas as pd
df = pd.DataFrame({'a': [1, 2, 3]})
redis.set('dataframe', df)
```

---

## 概念 6: 单例模式

### 概念解释

单例模式确保一个类只有一个实例，并提供全局访问点。LocalCache 和 Redis 连接使用单例模式。

### 原理

- 相同配置的缓存实例共享
- 减少资源占用
- 保证缓存一致性

### 代码示例

```python
# 相同配置共享实例
cache1 = LocalCache(name='my_cache', maxsize=128)
cache2 = LocalCache(name='my_cache', maxsize=128)
print(cache1 is cache2)  # True
```

---

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [术语表](./glossary.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
