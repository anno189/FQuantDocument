---
title: Infrastructure - 使用指南
description: Infrastructure 详细使用指南
tag:
  - fquant
  - fqbase
  - infrastructure

summary:
  purpose: usage
---

# Infrastructure - 使用指南

## 阅读路径

🔵 **开发者**：README → api → usage → concepts → examples

## 概述

本指南详细说明如何在各种场景下使用 Infrastructure 模块。

## 基本用法

### 单例模式

```python
from FQBase.Infrastructure import singleton

@singleton
class Database:
    def __init__(self):
        self.connection = None

db1 = Database()
db2 = Database()
assert db1 is db2
```

### 日志记录

```python
from FQBase.Infrastructure import get_logger, init_logging

init_logging()
logger = get_logger('my_module')
logger.info('Info message')
logger.warning('Warning message')
logger.error('Error message')
```

## 常见用例

### 用例 1: 重试网络调用

```python
from FQBase.Infrastructure import retry
import requests

@retry(stop_max_attempt_number=3, wait_random_min=100, wait_random_max=500,
       retry_on_exception=(requests.ConnectionError, requests.Timeout))
def fetch_data(url):
    return requests.get(url).json()
```

### 用例 2: 熔断器保护下游服务

```python
from FQBase.Infrastructure import circuit_breaker

@circuit_breaker(failure_threshold=5, recovery_timeout=60)
def call_external_api():
    response = requests.get('http://external-api.com/data')
    return response.json()
```

### 用例 3: 依赖注入容器

```python
from FQBase.Infrastructure import ServiceContainer, ServiceLifetime

class ICache:
    def get(self, key): pass

class RedisCache(ICache):
    def get(self, key):
        return f"value_for_{key}"

container = ServiceContainer()
container.register_singleton(ICache, RedisCache)

cache = container.get(ICache)
print(cache.get('my_key'))
```

### 用例 4: 异常处理

```python
from FQBase.Infrastructure import safe_execute, FQException

result = safe_execute(
    lambda: risky_operation(),
    default=None,
    error_msg="Operation failed"
)
```

## 相关文档

- [API参考](./api.md)
- [最佳实践](./best-practices.md)
- [故障排查](./troubleshooting.md)
