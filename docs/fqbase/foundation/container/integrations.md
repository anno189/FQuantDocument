---
title: 服务容器 - 集成指南
description: 服务容器第三方集成指南
tag:
  - fqbase
  - container
---

# 服务容器 - 集成指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → [设计原则](./design.md) → [API参考](./api.md) → [开发指南](./development.md) → [使用指南](./usage.md) → [最佳实践](./best-practices.md) → **[集成指南](./integrations.md)** |


## 概述

本文档介绍如何将服务容器与其他框架和系统集成。

## Python 框架集成

### Flask 集成

```python
from flask import Flask
from FQBase.Foundation.container import ServiceContainer, ServiceLocator

app = Flask(__name__)

# 创建容器
container = ServiceContainer()

# 注册服务
container.register_singleton(DatabaseInterface, PostgreSQLAdapter)
container.register_transient(UserService, UserService)

# 设置全局容器
ServiceLocator.set_container(container)

@app.route('/users/<user_id>')
def get_user(user_id):
    user_service = ServiceLocator.get(UserService)
    return user_service.get_user(user_id)
```

### FastAPI 集成

```python
from fastapi import FastAPI, Depends
from FQBase.Foundation.container import ServiceContainer, ServiceLocator

app = FastAPI()

# 初始化容器
container = ServiceContainer()
container.register_singleton(DatabaseInterface, PostgreSQLAdapter)
container.register_transient(UserRepository, UserRepository)

# 依赖注入
def get_user_repo():
    return ServiceLocator.get(UserRepository)

@app.get("/users/{user_id}")
def read_user(user_id: int, repo: UserRepository = Depends(get_user_repo)):
    return repo.get(user_id)
```

### Django 集成

```python
# settings.py
from FQBase.Foundation.container import ServiceContainer

def setup_container():
    container = ServiceContainer()
    container.register_singleton(CacheInterface, RedisCache)
    return container

# 在 Django 启动时初始化
container = setup_container()
```

## Web 框架集成

### 依赖注入中间件

```python
class DependencyInjectionMiddleware:
    def __init__(self, app, container: ServiceContainer):
        self.app = app
        self.container = container
    
    def __call__(self, environ, start_response):
        # 将容器添加到请求上下文
        request_container = RequestLocalContainer(self.container)
        yield from self.app(environ, start_response)
```

### 请求作用域服务

```python
class RequestScopedContainer(ServiceContainer):
    """请求作用域容器"""
    
    def __init__(self, parent: ServiceContainer):
        super().__init__()
        self._parent = parent
    
    def get(self, service_type):
        # 瞬态服务每次创建新实例
        descriptor = self._services.get(service_type)
        if descriptor and descriptor.lifetime == ServiceLifetime.TRANSIENT:
            return self._resolve_instance(descriptor)
        
        # 其他服务委托给父容器
        return self._parent.get(service_type)
```

## 数据存储集成

### SQLAlchemy 集成

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

class DatabaseService:
    def __init__(self, connection_string: str):
        self.engine = create_engine(connection_string)
        self.Session = sessionmaker(bind=self.engine)
    
    def get_session(self):
        return self.Session()

# 注册到容器
container.register_singleton(
    DatabaseService,
    lambda: DatabaseService("postgresql://localhost/mydb")
)
```

### Redis 集成

```python
import redis

class RedisService:
    def __init__(self, host: str, port: int):
        self.client = redis.Redis(host=host, port=port)
    
    def get_client(self):
        return self.client

container.register_singleton(
    RedisService,
    lambda: RedisService(host="localhost", port=6379)
)
```

## 日志系统集成

### 结构化日志

```python
import logging

class StructuredLogger:
    def __init__(self, logger: logging.Logger):
        self.logger = logger
    
    def log(self, level: str, message: str, **kwargs):
        self.logger.log(getattr(logging, level), message, extra=kwargs)

container.register_singleton(
    LoggerInterface,
    lambda: StructuredLogger(logging.getLogger("myapp"))
)
```

### 统一日志注入

```python
class ServiceWithLogger:
    def __init__(self, logger: LoggerInterface):
        self.logger = logger
    
    def do_something(self):
        self.logger.info("Doing something", extra={"service": "MyService"})
```

## 监控集成

### Prometheus 集成

```python
from prometheus_client import Counter, Histogram

class MetricsService:
    def __init__(self):
        self.request_count = Counter('requests_total', 'Total requests')
        self.request_duration = Histogram('request_duration_seconds', 'Request duration')
    
    def record_request(self, duration):
        self.request_count.inc()
        self.request_duration.observe(duration)

container.register_singleton(MetricsService, MetricsService)
```

### Health Check 集成

```python
class HealthCheckService:
    def __init__(self, container: ServiceContainer):
        self.container = container
    
    def check_health(self):
        results = {"status": "healthy", "services": {}}
        
        for service_type in self.container.registered_services:
            try:
                self.container.get(service_type)
                results["services"][service_type.__name__] = "healthy"
            except Exception as e:
                results["services"][service_type.__name__] = f"unhealthy: {e}"
                results["status"] = "degraded"
        
        return results

container.register_singleton(HealthCheckService, HealthCheckService)
```

## 异步集成

### asyncio 集成

```python
import asyncio

class AsyncServiceContainer(ServiceContainer):
    async def get_async(self, service_type):
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(
            None,
            lambda: self.get(service_type)
        )
```

## 最佳实践

1. **框架启动时初始化**：在应用启动时设置容器
2. **请求级别服务**：使用请求作用域容器
3. **统一日志注入**：所有服务自动获取日志
4. **健康检查集成**：定期检查服务状态

## 相关文档

- [API参考](./api.md)
- [技术架构](./architecture.md)
- [开发指南](./development.md)
- [最佳实践](./best-practices.md)
