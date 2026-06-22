---
title: Cache - 核心概念
description: 深入理解 Cache 的核心概念
tag:
  - fquant
  - fqbase
  - cache

summary:
  purpose: concepts
  core_concepts:
    - cache_adapter
    - cache_decorator
    - ttl
    - serialization
---

# Cache - 核心概念

## 阅读路径

🟢🔵 **新手+开发者**：README → quick-start → concepts → api → usage

## 概述

Cache 模块包含多个核心概念，理解这些概念对于正确使用缓存至关重要。

## 概念1：缓存适配器 (Cache Adapter)

### 概念解释

适配器模式封装不同缓存后端（LocalCache、Redis、MongoDB），提供统一接口。

### 原理

`CacheInterface` 定义统一接口，各适配器实现具体逻辑。

### 代码示例

```python
from FQBase.Cache import create_cache, CacheInterface

cache: CacheInterface = create_cache()
cache.set("key", "value")
```

## 概念2：@redis_cache 装饰器

### 概念解释

装饰器自动缓存函数结果，支持 TTL 和键前缀。

### 原理

- 使用 `functools.wraps` 保留原函数签名
- 使用 SHA256 生成缓存键
- 支持异步函数

### 代码示例

```python
from FQBase.Cache import redis_cache

@redis_cache(ttl=300, key_prefix="data")
def fetch_data(symbol):
    return api_call(symbol)

result = fetch_data("000001")
result.cache_clear()  # 清除缓存
```

## 概念3：TTL (Time To Live)

### 概念解释

缓存过期时间，控制缓存数据的生命周期。

### 代码示例

```python
cache.set("key", "value", ttl=3600)  # 1小时后过期

@redis_cache(ttl=300)
def func():
    pass
```

## 概念4：序列化 (Serialization)

### 概念解释

缓存数据需要序列化，支持 Python 对象、pandas、numpy 等。

### 代码示例

```python
from FQBase.Cache import create_cache
import pandas as pd

cache = create_cache()
df = pd.DataFrame({"a": [1, 2, 3]})
cache.set("df", df)  # 自动序列化
result = cache.get("df")
```

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [API参考](./api.md)
