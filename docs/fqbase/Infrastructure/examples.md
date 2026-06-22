---
title: Infrastructure - 示例
description: Infrastructure 完整案例和动手实验
tag:
  - fquant
  - fqbase
  - infrastructure

summary:
  purpose: examples
---

# Infrastructure - 示例

## 阅读路径

🟢🔵 **新手+开发者**：README → quick-start → examples → concepts

## 案例1：带熔断器的 API 调用

```python
from FQBase.Infrastructure import circuit_breaker, get_logger
import requests

logger = get_logger(__name__)

@circuit_breaker(failure_threshold=5, recovery_timeout=60)
def call_market_api(symbol):
    """调用市场数据 API"""
    response = requests.get(f'http://api.market.com/v1/quote/{symbol}')
    return response.json()

try:
    data = call_market_api('AAPL')
    logger.info(f"Got data: {data}")
except Exception as e:
    logger.error(f"API call failed: {e}")
```

## 案例2：带重试的数据库操作

```python
from FQBase.Infrastructure import retry, MongoDBException
import pymongo

@retry(
    stop_max_attempt_number=3,
    wait_random_min=100,
    wait_random_max=500,
    retry_on_exception=(MongoDBException, ConnectionError)
)
def save_data(collection, document):
    """保存数据到 MongoDB"""
    return collection.insert_one(document)
```

## 案例3：服务依赖注入

```python
from FQBase.Infrastructure import ServiceContainer, ServiceLifetime

class ICache:
    def get(self, key): pass
    def set(self, key, value): pass

class RedisCache(ICache):
    def __init__(self, host='localhost', port=6379):
        self.client = redis.Redis(host=host, port=port)

    def get(self, key):
        return self.client.get(key)

    def set(self, key, value):
        return self.client.set(key, value)

class DataService:
    def __init__(self, cache: ICache):
        self.cache = cache

container = ServiceContainer()
container.register_singleton(ICache, RedisCache)
container.register_transient(DataService, DataService)

data_service = container.get(DataService)
data_service.cache.set('key', 'value')
```

## 相关文档

- [快速入门](./quick-start.md)
- [核心概念](./concepts.md)
- [API参考](./api.md)
