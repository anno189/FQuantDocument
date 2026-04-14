---
title: Cache - 快速入门
description: 5分钟快速上手 Cache 模块
tag:
  - fqbase
  - cache

summary:
  purpose: quick-start
  complexity: low
---

# Cache - 快速入门

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → **[快速入门](./quick-start.md)** → [速查表](./cheatsheet.md) → [动手实验室](./workshop.md) → [使用指南](./usage.md) → [案例库](./examples.md) |

## 概述

本指南帮助您在 5 分钟内快速上手 Cache 模块。

## 前置要求

- Python 3.8+
- pip

## 安装

```bash
pip install fquant-base
```

## 5分钟上手

### Step 1: 导入模块

```python
from FQBase.Cache import LocalCache, RedisCacheAdapter
```

### Step 2: 使用本地缓存

```python
# 创建缓存实例
cache = LocalCache(name='my_cache', maxsize=128, ttl=300)

# 设置缓存
cache.set('name', '张三')

# 获取缓存
name = cache.get('name')
print(name)  # 输出: 张三
```

### Step 3: 使用装饰器

```python
from FQBase.Cache import local_cache

@local_cache(ttl=60)
def get_user(user_id):
    return {'id': user_id, 'name': '张三'}

# 第一次调用
user1 = get_user(1)  # 执行函数

# 第二次调用（使用缓存）
user2 = get_user(1)  # 使用缓存
```

### Step 4: 使用 Redis 缓存

```python
from FQBase.Cache import RedisCacheAdapter, redis_cache

# 创建 Redis 缓存
redis = RedisCacheAdapter(host='localhost', port=6379, prefix='myapp:')

# 使用装饰器
@redis_cache(ttl=3600, key_prefix='user')
def fetch_user(user_id):
    return {'id': user_id, 'name': '张三'}

user = fetch_user(1)
```

### Step 5: 完成！

恭喜！您已经学会了 Cache 模块的基本用法。

## ⚠️ 常见陷阱

1. **陷阱 1：忘记设置 TTL**
   - ❌ 错误做法：`cache.set('key', 'value')` - 永不过期
   - ✅ 正确做法：`cache.set('key', 'value', ttl=300)` - 5分钟后过期

2. **陷阱 2：缓存键冲突**
   - ❌ 错误做法：不同业务使用相同键前缀
   - ✅ 正确做法：使用 prefix 隔离不同业务

## 下一步

- 学习 [核心概念](./concepts.md)
- 阅读 [术语表](./glossary.md)
- 查看 [使用指南](./usage.md)

---

## 相关文档

- [README](./README.md)
- [术语表](./glossary.md)
- [核心概念](./concepts.md)
- [使用指南](./usage.md)
