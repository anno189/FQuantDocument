# Container 模块最佳实践

## 目录

1. [注册规范](#1-注册规范)
2. [生命周期选择](#2-生命周期选择)
3. [依赖设计](#3-依赖设计)
4. [测试策略](#4-测试策略)
5. [性能优化](#5-性能优化)
6. [维护事宜](#6-维护事宜)

---

## 1. 注册规范

### 1.1 使用接口而非实现

```python
GOOD:
container.register_singleton(ICache, RedisCache)

BAD:
container.register_singleton(RedisCache, RedisCache)
```

### 1.2 接口定义

```python
from typing import Protocol

class ICache(Protocol):
    def get(self, key: str): ...
    def set(self, key: str, value: Any): ...
    def delete(self, key: str): ...
```

### 1.3 统一初始化

```python
def configure_services(container: ServiceContainer):
    container.register_singleton(ILogger, FileLogger) \
             .register_singleton(ICache, RedisCache) \
             .register_singleton(IDatabase, PostgreSQL)

    return container
```

---

## 2. 生命周期选择

### 2.1 何时使用单例

**适用场景**：
- 无状态服务
- 全局配置
- 数据库连接池
- 日志记录器

```python
GOOD:
container.register_singleton(ILogger, FileLogger)
container.register_singleton(IDatabase, ConnectionPool)

BAD:
container.register_singleton(IRequest, HttpRequest)  # 请求应该有独立生命周期
```

### 2.2 何时使用瞬态

**适用场景**：
- 有状态对象
- 请求级对象
- 每次请求需要全新实例的对象

```python
GOOD:
container.register_transient(IRequest, HttpRequest)

BAD:
container.register_transient(ILogger, FileLogger)  # 重复创建日志器浪费资源
```

### 2.3 生命周期决策树

```
服务是否有状态?
├── 无状态 → 能共享吗?
│         ├── 能 → SINGLETON
│         └── 不能 → TRANSIENT
└── 有状态 → TRANSIENT
```

---

## 3. 依赖设计

### 3.1 构造函数注入

```python
GOOD:
class UserService:
    def __init__(self, cache: ICache, logger: ILogger):
        self.cache = cache
        self.logger = logger

BAD:
class UserService:
    def __init__(self):
        self.cache = container.get(ICache)  # 避免在构造函数中获取容器
```

### 3.2 依赖深度

```python
GOOD:
# 依赖层级不宜过深
A → B → C  (3层，可接受)
A → B → C → D → E  (5层，考虑重构)

BAD:
# 依赖层级过深
A → B → C → D → E → F → G  (7层，太深)
```

### 3.3 避免循环依赖

```python
GOOD:
# 通过接口或事件解耦
class A:
    def __init__(self, event_bus: IEventBus):
        self.event_bus = event_bus

class B:
    def __init__(self, event_bus: IEventBus):
        self.event_bus = event_bus

BAD:
# 直接循环
class A:
    def __init__(self, b: 'B'):
        self.b = b

class B:
    def __init__(self, a: 'A'):
        self.a = a
```

---

## 4. 测试策略

### 4.1 注入模拟服务

```python
def test_user_service():
    container = ServiceContainer()
    container.register_singleton(ICache, MockCache)
    container.register_singleton(ILogger, MockLogger)
    container.register_singleton(UserService, UserService)

    service = container.get(UserService)
    assert isinstance(service.cache, MockCache)
```

### 4.2 切换实现

```python
def test_with_real_services():
    container = ServiceContainer()
    container.register_singleton(ICache, RealRedisCache)
    container.register_singleton(ILogger, RealFileLogger)
    container.register_singleton(UserService, UserService)

def test_with_mock_services():
    container = ServiceContainer()
    container.register_singleton(ICache, MockCache)
    container.register_singleton(ILogger, MockLogger)
    container.register_singleton(UserService, UserService)
```

### 4.3 测试隔离

```python
def test_isolation():
    container = ServiceContainer()
    container.register_singleton(ICache, MockCache)

    service1 = container.get(ICache)
    service2 = container.get(ICache)

    assert service1 is service2

    container.unregister(ICache)

    assert not container.is_registered(ICache)
```

---

## 5. 性能优化

### 5.1 减少依赖解析开销

```python
GOOD:
# 缓存获取结果
cache = container.get(ICache)
for item in items:
    process(item, cache)

BAD:
# 每次循环都解析
for item in items:
    cache = container.get(ICache)
    process(item, cache)
```

### 5.2 单例优先

```python
GOOD:
# 无状态服务使用单例
container.register_singleton(IValidator, DataValidator)

BAD:
# 无状态服务使用瞬态
container.register_transient(IValidator, DataValidator)
```

### 5.3 延迟注册

```python
# 按需注册，延迟初始化
def get_lazy_cache():
    if not container.is_registered(ICache):
        container.register_singleton(ICache, RedisCache)
    return container.get(ICache)
```

---

## 6. 维护事宜

### 6.1 依赖关系文档化

```python
container = ServiceContainer()

container.register_singleton(ILogger, FileLogger) \
         .register_singleton(ICache, RedisCache) \
         .register_singleton(IDatabase, PostgreSQL) \
         .register_singleton(UserService, UserService) \
         .register_singleton(OrderService, OrderService) \
         .register_transient(IRequest, HttpRequest)
```

### 6.2 配置检查清单

- [ ] 每个接口都有实现注册
- [ ] 依赖关系无循环
- [ ] 生命周期选择正确
- [ ] 测试环境可切换实现
- [ ] 单例不持有请求级状态

### 6.3 常见问题

**问题1：服务未找到**
```python
KeyError: Service not registered: ICache

# 解决：检查是否已注册
container.register_singleton(ICache, RedisCache)
```

**问题2：循环依赖**
```python
CircularDependencyException: A -> B -> A

# 解决：重新设计依赖关系，使用接口解耦
```

**问题3：类型不匹配**
```python
TypeError: __init__() got an unexpected keyword argument 'cache'

# 解决：检查依赖声明与构造函数参数名是否匹配
```
