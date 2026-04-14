---
title: Cache - 设计模式
description: Cache 模块使用的设计模式详解
tag:
  - fqbase
  - cache
---

# Cache - 设计模式

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟠 架构师 | [README](./README.md) → [技术架构](./architecture.md) → **[设计模式](./patterns.md)** → [技术权衡](./tradeoff.md) → [决策指南](./decision-guide.md) → [案例研究](./case-studies.md) → [数据流](./data-flow.md) |
| 📚 案例库 | **[案例库](./examples.md)** → [案例研究](./case-studies.md) → [决策指南](./decision-guide.md) → [数据流](./data-flow.md) → **[设计模式](./patterns.md)** → [技术权衡](./tradeoff.md) |

## 概述

本文档介绍 Cache 模块使用的设计模式。

## 模式 1: 单例模式

### 上下文

缓存实例管理

### 模式结构

```
┌─────────────────────────────┐
│      LocalCache            │
│  _local_cache_instances    │
│  ┌───────────────────┐     │
│  │ (name, maxsize, │     │
│  │  ttl, eviction) │     │
│  └───────────────────┘     │
└─────────────────────────────┘
```

### 实现

```python
class LocalCache:
    _local_cache_instances = {}
    
    @classmethod
    def _get_instance(cls, name, maxsize, ttl, eviction):
        key = (name, maxsize, ttl, eviction)
        if key not in cls._local_cache_instances:
            cls._local_cache_instances[key] = cls(...)
        return cls._local_cache_instances[key]
```

---

## 模式 2: 装饰器模式

### 上下文

为函数提供缓存能力

### 模式结构

```
┌──────────────┐     ┌──────────────┐
│   原始函数    │────▶│  缓存装饰器   │
└──────────────┘     └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  缓存存储     │
                     └──────────────┘
```

### 实现

```python
def local_cache(ttl=300):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # 检查缓存
            key = generate_key(func, args, kwargs)
            result = cache.get(key)
            if result is not None:
                return result
            # 执行函数并缓存
            result = func(*args, **kwargs)
            cache.set(key, result, ttl)
            return result
        return wrapper
    return decorator
```

---

## 相关文档

- [技术架构](./architecture.md)
- [设计原则](./design.md)
- [技术权衡](./tradeoff.md)
- [案例研究](./case-studies.md)
