---
title: Cache - 集成指南
description: Cache 集成指南，包含模块内部集成、系统集成和跨系统集成
tag:
  - fquant
  - fqbase
  - cache

summary:
  purpose: integrations
---

# Cache - 集成指南

## 阅读路径

🔵 **开发者**：README → integrations → configuration → architecture

## 1. 模块内部集成

Cache 各组件之间的组合使用。

### 1.1 装饰器 + 缓存适配器

```python
from FQBase.Cache import redis_cache, get_cache_adapter

@redis_cache(ttl=300)
def cached_function():
    pass

adapter = get_cache_adapter()
adapter.set("manual_key", "value")
```

### 1.2 多级缓存组合

```python
from FQBase.Cache import LocalCache, RedisCacheAdapter

L1 = LocalCache(name="L1", ttl=60)
L2 = RedisCacheAdapter()

def get_with_multi_cache(key):
    # 先查 L1
    val = L1.get(key)
    if val:
        return val
    # 再查 L2
    val = L2.get(key)
    if val:
        L1.set(key, val)
        return val
    # 回源
    val = fetch_from_db(key)
    L2.set(key, val)
    L1.set(key, val)
    return val
```

## 2. 系统模块间集成

Cache 与项目内其他模块的集成。

### 2.1 Cache + Config

```python
from FQBase.Cache import create_cache
from FQBase.Config import get_cache_config

config = get_cache_config()
cache = create_cache(config)
```

### 2.2 Cache + Infrastructure

```python
from FQBase.Cache import create_cache
from FQBase.Infrastructure import get_logger

logger = get_logger(__name__)

cache = create_cache()
try:
    cache.set("key", value)
except Exception as e:
    logger.error(f"缓存设置失败: {e}")
```

### 2.3 Cache + FQData

```python
from FQBase.Cache import redis_cache
from FQData import StockDataSource

@redis_cache(ttl=3600)
def get_stock_data(code, start, end):
    ds = StockDataSource()
    return ds.get_daily(code, start, end)
```

## 3. 跨系统集成

Cache 与外部系统、框架的集成。

### 3.1 Celery 集成

```python
from FQBase.Cache import redis_cache
from celery import Celery

celery_app = Celery('tasks', broker='redis://localhost:6379/0')

@celery_app.task
@redis_cache(ttl=300)
def fetch_data_task(symbol):
    return fetch_data(symbol)
```

### 3.2 FastAPI 集成

```python
from fastapi import FastAPI
from FQBase.Cache import redis_cache, init_cache_adapter

init_cache_adapter()

app = FastAPI()

@app.get("/stock/{symbol}")
@redis_cache(ttl=60)
async def get_stock(symbol: str):
    return fetch_stock(symbol)
```

## 集成模式总结

| 集成方式 | 源模块 | 目标模块 | 数据流 | 适用场景 |
|---------|--------|---------|--------|---------|
| 装饰器 | @redis_cache | 缓存适配器 | 函数结果 → 缓存 | 函数结果缓存 |
| 多级缓存 | L1+L2 | 缓存适配器 | L1 → L2 → DB | 高性能读取 |
| Config | 配置模块 | 缓存适配器 | 配置 → 创建 | 统一配置 |
| FastAPI | Web 框架 | 缓存装饰器 | 请求 → 缓存 | API 响应缓存 |

## 相关文档

- [API参考](./api.md)
- [配置指南](./configuration.md)
