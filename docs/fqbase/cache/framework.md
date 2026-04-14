---
title: Cache - 框架集成
description: Cache 模块与其他框架的集成方式
tag:
  - fqbase
  - cache
---

# Cache - 框架集成

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → **[框架集成](./framework.md)** → [技术架构](./architecture.md) → [设计原则](./design.md) → [API参考](./api.md) → [开发指南](./development.md) → [最佳实践](./best-practices.md) |

## 概述

Cache 模块可以与多种框架和工具集成，提供灵活的缓存解决方案。

## 初始化方式

### 方式一：使用环境变量

```python
import os
os.environ['CACHE_TYPE'] = 'redis'
os.environ['REDIS_HOST'] = 'localhost'
os.environ['REDIS_PORT'] = '6379'
os.environ['REDIS_DB'] = '0'

from FQBase.Cache import init_cache_adapter
init_cache_adapter()
```

**环境变量列表：**
| 变量 | 描述 |
|------|------|
| CACHE_TYPE | 缓存类型：'redis'、'mongo'、'local' |
| REDIS_HOST | Redis 主机地址 |
| REDIS_PORT | Redis 端口 |
| REDIS_DB | Redis 数据库编号 |
| REDIS_PASSWORD | Redis 密码 |
| MONGO_URI | MongoDB 连接字符串 |
| MONGO_DB | MongoDB 数据库名称 |

### 方式二：手动配置

```python
from FQBase.Cache import set_cache_adapter, RedisCacheAdapter

adapter = RedisCacheAdapter(
    host='localhost',
    port=6379,
    db=0,
    prefix='myapp:'
)
set_cache_adapter(adapter)
```

## 在 Web 框架中使用

### Flask

```python
from flask import Flask, request, jsonify
from FQBase.Cache import redis_cache
import os

app = Flask(__name__)

# 配置缓存
os.environ['CACHE_TYPE'] = 'redis'
os.environ['REDIS_HOST'] = 'localhost'

from FQBase.Cache import init_cache_adapter
init_cache_adapter()

@app.route('/user/<int:user_id>')
@redis_cache(ttl=3600, key_prefix='user')
def get_user(user_id):
    return fetch_user_from_db(user_id)

@app.route('/user/<int:user_id>', methods=['POST'])
def create_user(user_id):
    data = request.json
    save_user_to_db(user_id, data)
    # 清除用户缓存
    from FQBase.Cache import invalidate_cache
    invalidate_cache(f'user:{user_id}')
    return jsonify({'status': 'created'})

if __name__ == '__main__':
    app.run()
```

### Django

```python
# settings.py
CACHE_TYPE = 'redis'
REDIS_HOST = 'localhost'
REDIS_PORT = 6379
REDIS_DB = 0

# utils/cache.py
from FQBase.Cache import redis_cache

@redis_cache(ttl=1800, key_prefix='django:user')
def get_user_cached(user_id):
    return User.objects.get(id=user_id)

# views.py
from .utils.cache import get_user_cached

def get_user(request, user_id):
    user = get_user_cached(user_id)
    return JsonResponse({'name': user.name})
```

### FastAPI

```python
from fastapi import FastAPI, Depends
from FQBase.Cache import redis_cache
import asyncio

app = FastAPI()

@app.get('/data/{data_id}')
@redis_cache(ttl=600, key_prefix='fastapi:data')
async def get_data(data_id: str):
    return await fetch_data(data_id)

@app.on_event('startup')
async def startup():
    import os
    os.environ['CACHE_TYPE'] = 'redis'
    from FQBase.Cache import init_cache_adapter
    init_cache_adapter()
```

## 在异步框架中使用

### asyncio

```python
import asyncio
from FQBase.Cache import redis_cache

@redis_cache(ttl=3600, key_prefix='async:data')
async def fetch_async_data(data_id):
    await asyncio.sleep(1)  # 模拟异步操作
    return {'id': data_id, 'value': 'some data'}

async def main():
    # 第一次调用
    result1 = await fetch_async_data('123')
    # 第二次调用（从缓存）
    result2 = await fetch_async_data('123')
    print(result1 == result2)  # True

asyncio.run(main())
```

## 在 Celery 中使用

```python
from celery import Celery
from FQBase.Cache import RedisCacheAdapter

app = Celery('myapp')
app.conf.broker_url = 'redis://localhost:6379/0'

# 使用 RedisCacheAdapter 缓存任务结果
cache = RedisCacheAdapter(host='localhost', port=6379, db=1, prefix='celery:')

@app.task
def process_task(task_id):
    # 处理任务
    result = heavy_computation(task_id)
    # 缓存结果
    cache.set(f'result:{task_id}', result, ttl=3600)
    return result
```

## 在数据分析中使用

### pandas/numpy

```python
import pandas as pd
import numpy as np
from FQBase.Cache import redis_cache, LocalCache

# pandas DataFrame 缓存
@redis_cache(ttl=3600, key_prefix='pandas:stock')
def load_stock_data(symbol, start_date, end_date):
    # 从数据库加载数据
    return pd.read_sql(f'SELECT * FROM stocks WHERE symbol={symbol}')

# numpy 数组缓存
@local_cache(ttl=1800)
def calculate_indicators(prices: np.ndarray):
    # 计算技术指标
    return {
        'ma5': pd.Series(prices).rolling(5).mean().values,
        'ma20': pd.Series(prices).rolling(20).mean().values,
    }

# 使用示例
df = load_stock_data('AAPL', '2023-01-01', '2023-12-31')
indicators = calculate_indicators(df['close'].values)
```

## 在测试中使用

```python
import pytest
from FQBase.Cache import LocalCache

@pytest.fixture
def cache():
    """测试用缓存 fixture"""
    c = LocalCache(maxsize=10, ttl=60)
    yield c
    c.clear()

def test_cache_operations(cache):
    cache.set('key1', 'value1')
    assert cache.get('key1') == 'value1'
    assert cache.exists('key1')
    cache.delete('key1')
    assert cache.get('key1') is None
```

---

## 相关文档

- [技术架构](./architecture.md)
- [设计原则](./design.md)
- [API参考](./api.md)
- [最佳实践](./best-practices.md)
