---
title: Foundation 模块 - 集成指南
description: Foundation 模块集成指南，包含模块内部集成、系统集成和跨系统集成
tag:
  - fqbase
  - foundation
---

# Foundation 模块 - 集成指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [技术架构](./architecture.md) → **[集成指南](./integrations.md)** |

## 子模块集成指南

| 子模块 | 集成指南 | 说明 |
|--------|----------|------|
| validators | [集成指南](./validators/integrations.md) | 输入验证 |
| exceptions | [集成指南](./exceptions/integrations.md) | 统一异常 |
| retry | [集成指南](./retry/integrations.md) | 重试装饰器 |
| dotty | [集成指南](./dotty/integrations.md) | 字典访问 |
| singleton | [集成指南](./singleton/integrations.md) | 单例模式 |
| lifecycle | [集成指南](./lifecycle/integrations.md) | 生命周期 |
| container | [集成指南](./container/integrations.md) | 依赖注入 |
| circuit_breaker | [集成指南](./circuit_breaker/integrations.md) | 熔断器 |

---

## 1. 模块内部集成

Foundation 各子模块之间的组合使用。

### 1.1 熔断器 + 重试

```python
from FQBase.Foundation import CircuitBreaker, retry

breaker = CircuitBreaker(name="api", failure_threshold=5)

@breaker.call
@retry(max_attempts=3, delay=1)
def call_api():
    return requests.get(url).json()
```

### 1.2 依赖注入 + 生命周期

```python
from FQBase.Foundation import ServiceContainer, HealthCheckable

container = ServiceContainer()
container.register_singleton(IDatabase, DatabaseService)

checker = CompositeHealthCheck()
db = container.get(IDatabase)
checker.register('database', db)
```

### 1.3 单例 + 容器

```python
from FQBase.Foundation import ServiceContainer, singleton

@singleton
class ConfigManager:
    pass

container = ServiceContainer()
container.register_singleton(IConfigManager, ConfigManager)
```

### 1.4 统一异常 + 重试

```python
from FQBase.Foundation import retry, FQException

@retry(max_attempts=3, retry_on_exception=lambda e: isinstance(e, FQException))
def fetch_data():
    pass
```

---

## 2. 系统模块间集成

Foundation 与 FQBase 其他模块的集成。

### 2.1 Foundation + Core

```python
from FQBase.Foundation import singleton
from FQBase.Core import get_logger, EventBus

@singleton
class AppInitializer:
    def __init__(self):
        self.logger = get_logger(__name__)
        self.event_bus = EventBus()
```

### 2.2 Foundation + Config

```python
from FQBase.Foundation import CircuitBreaker
from FQBase.Config import get_config

config = get_config()
breaker = CircuitBreaker(
    name=config.get("breaker.name", "default"),
    failure_threshold=config.get("breaker.threshold", 5)
)
```

### 2.3 Foundation + Cache

```python
from FQBase.Foundation import ServiceContainer

container = ServiceContainer()
container.register_singleton(ICache, RedisCacheAdapter)
```

### 2.4 Foundation + DataStore

```python
from FQBase.Foundation import retry
from FQBase.DataStore import MongoClient

@retry(max_attempts=3)
def get_data(collection_name: str):
    return MongoClient().get_collection(collection_name).find()
```

---

## 3. 跨系统集成

Foundation 与外部系统、框架的集成。

### 3.1 Web 框架

#### Flask

```python
from flask import Flask
from FQBase.Foundation import ServiceContainer, ServiceLocator

app = Flask(__name__)
container = ServiceContainer()
ServiceLocator.set_container(container)
```

#### FastAPI

```python
from fastapi import FastAPI
from FQBase.Foundation import retry

app = FastAPI()

@app.get("/data")
@retry(max_attempts=3)
async def get_data():
    return {"data": "value"}
```

### 3.2 数据库

#### SQLAlchemy

```python
from FQBase.Foundation import singleton
from sqlalchemy import create_engine

@singleton
class DatabaseManager:
    def __init__(self):
        self.engine = create_engine("postgresql://localhost/mydb")
```

#### Redis

```python
from FQBase.Foundation import CircuitBreaker
import redis

breaker = CircuitBreaker(name="redis", failure_threshold=10)

def get_redis():
    with breaker:
        return redis.Redis(host='localhost', port=6379)
```

### 3.3 消息队列

```python
from FQBase.Foundation import retry
from celery import Celery

app = Celery('tasks')

@retry(max_attempts=3)
@app.task
def process_data(data):
    return result
```

### 3.4 监控系统

```python
from FQBase.Foundation import CircuitBreaker
from prometheus_client import Counter, Gauge

breaker_calls = Counter('breaker_calls_total', 'Total calls', ['name', 'result'])
```

---

## 集成模式总结

| 集成类型 | 典型场景 | 组合方案 |
|----------|----------|----------|
| 模块内部 | 弹性调用 | 熔断器 + 重试 |
| 模块内部 | 服务管理 | 容器 + 生命周期 |
| 系统模块间 | 应用初始化 | 单例 + 容器 + Core |
| 系统模块间 | 数据访问 | 重试 + DataStore |
| 跨系统 | Web 服务 | 容器 + Flask/FastAPI |
| 跨系统 | 数据存储 | 熔断器 + Redis/SQLAlchemy |
| 跨系统 | 任务队列 | 重试 + Celery |
