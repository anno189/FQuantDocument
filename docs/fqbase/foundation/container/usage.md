# Container 模块使用指南

## 目录

1. [基础用法](#1-基础用法)
2. [生命周期](#2-生命周期)
3. [依赖注入](#3-依赖注入)
4. [服务定位器](#4-服务定位器)
5. [循环依赖](#5-循环依赖)
6. [高级用法](#6-高级用法)

---

## 1. 基础用法

### 1.1 创建容器

```python
from FQBase.Foundation import ServiceContainer

container = ServiceContainer()
```

### 1.2 注册服务

```python
from FQBase.Foundation import ServiceContainer

class ICache:
    pass

class RedisCache(ICache):
    pass

container = ServiceContainer()
container.register_singleton(ICache, RedisCache)
```

### 1.3 获取服务

```python
cache = container.get(ICache)
print(cache)  # RedisCache 实例
```

### 1.4 链式调用

```python
container = ServiceContainer()
container.register_singleton(ICache, RedisCache) \
         .register_singleton(ILogger, FileLogger) \
         .register_transient(IRequest, HttpRequest)
```

---

## 2. 生命周期

### 2.1 单例模式

```python
container.register_singleton(ICache, RedisCache)

cache1 = container.get(ICache)
cache2 = container.get(ICache)
assert cache1 is cache2  # True
```

### 2.2 瞬态模式

```python
container.register_transient(IRequest, HttpRequest)

request1 = container.get(IRequest)
request2 = container.get(IRequest)
assert request1 is not request2  # True
```

### 2.3 工厂函数

```python
def create_cache():
    cache = RedisCache()
    cache.connect()
    return cache

container.register_factory(ICache, create_cache)
```

### 2.4 注册已有实例

```python
existing_cache = RedisCache()
container.register_instance(ICache, existing_cache)
```

---

## 3. 依赖注入

### 3.1 自动解析依赖

```python
class ICache:
    pass

class ILogger:
    pass

class UserService:
    def __init__(self, cache: ICache, logger: ILogger):
        self.cache = cache
        self.logger = logger

container.register_singleton(ICache, RedisCache)
container.register_singleton(ILogger, FileLogger)
container.register_singleton(UserService, UserService)

service = container.get(UserService)
print(service.cache)  # RedisCache 实例
print(service.logger)  # FileLogger 实例
```

### 3.2 显式声明依赖

```python
container.register_singleton(
    UserService,
    UserService,
    dependencies=[ICache, ILogger]
)
```

### 3.3 多层依赖

```python
class IDatabase:
    pass

class ICache:
    pass

class IDatabaseCache:
    pass

class DatabaseCache(IDatabaseCache):
    def __init__(self, db: IDatabase, cache: ICache):
        self.db = db
        self.cache = cache

container.register_singleton(IDatabase, PostgreSQL)
container.register_singleton(ICache, RedisCache)
container.register_singleton(IDatabaseCache, DatabaseCache)

db_cache = container.get(IDatabaseCache)
# 自动解析 db 和 cache 依赖
```

---

## 4. 服务定位器

### 4.1 设置全局容器

```python
from FQBase.Foundation import ServiceLocator, ServiceContainer

container = ServiceContainer()
container.register_singleton(ICache, RedisCache)

ServiceLocator.set_container(container)
```

### 4.2 获取服务

```python
cache = ServiceLocator.get(ICache)
print(cache)  # RedisCache 实例
```

### 4.3 尝试获取

```python
cache = ServiceLocator.try_get(ICache)
if cache is None:
    print("服务未注册")
```

### 4.4 重置容器

```python
ServiceLocator.reset()
print(ServiceLocator.get_container())  # None
```

---

## 5. 循环依赖

### 5.1 检测循环依赖

```python
class A:
    def __init__(self, b: 'B'):
        self.b = b

class B:
    def __init__(self, a: 'A'):
        self.a = a

container.register_singleton(A, A)
container.register_singleton(B, B)

try:
    container.get(A)
except CircularDependencyException as e:
    print(f"循环依赖: {' -> '.join(e.dependency_chain)}")
```

### 5.2 避免循环依赖

```python
GOOD:
# 重新设计，避免循环
class A:
    def __init__(self, cache: ICache):
        self.cache = cache

class B:
    def __init__(self, cache: ICache):
        self.cache = cache

BAD:
# 循环依赖
class A:
    def __init__(self, b: 'B'):
        self.b = b

class B:
    def __init__(self, a: 'A'):
        self.a = a
```

---

## 6. 高级用法

### 6.1 检查服务是否注册

```python
if container.is_registered(ICache):
    cache = container.get(ICache)
else:
    print("服务未注册")
```

### 6.2 注销服务

```python
container.unregister(ICache)
```

### 6.3 清空容器

```python
container.clear()
```

### 6.4 获取依赖关系图

```python
container.register_singleton(ICache, RedisCache)
container.register_singleton(ILogger, FileLogger)
container.register_singleton(UserService, UserService, dependencies=[ICache, ILogger])

graph = container.get_dependency_graph()
print(graph)
# {'ICache': [], 'ILogger': [], 'UserService': ['ICache', 'ILogger']}
```

### 6.5 获取所有已注册服务

```python
services = container.registered_services
for service_type, descriptor in services.items():
    print(f"{service_type.__name__}: {descriptor.lifetime.value}")
```

### 6.6 条件注册

```python
import os

container = ServiceContainer()

if os.environ.get('ENV') == 'production':
    container.register_singleton(ICache, RedisCache)
else:
    container.register_singleton(ICache, MemoryCache)
```

### 6.7 应用启动配置

```python
def configure_container():
    container = ServiceContainer()

    container.register_singleton(ILogger, FileLogger) \
             .register_singleton(ICache, RedisCache) \
             .register_singleton(IDatabase, PostgreSQL) \
             .register_transient(IRequest, HttpRequest) \
             .register_singleton(UserService, UserService)

    return container

app_container = configure_container()
ServiceLocator.set_container(app_container)
```

### 6.8 测试隔离

```python
def test_with_mock_cache():
    container = ServiceContainer()
    container.register_singleton(ICache, MockCache)
    container.register_singleton(ILogger, MockLogger)

    service = container.get(UserService)
    assert isinstance(service.cache, MockCache)

def test_with_real_cache():
    container = ServiceContainer()
    container.register_singleton(ICache, RedisCache)
    container.register_singleton(ILogger, FileLogger)

    service = container.get(UserService)
    assert isinstance(service.cache, RedisCache)
```
