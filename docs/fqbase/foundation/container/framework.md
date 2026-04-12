# Container 模块框架

## 1. 概述

Container 模块是轻量级依赖注入容器，提供服务注册、解析和生命周期管理功能。

### 1.1 解决的问题

```python
# 传统方式 - 手动创建和传递依赖
class UserService:
    def __init__(self):
        self.cache = RedisCache()
        self.logger = FileLogger()

class OrderService:
    def __init__(self):
        self.cache = RedisCache()
        self.logger = FileLogger()

# 使用容器 - 自动解析依赖
container = ServiceContainer()
container.register_singleton(ICache, RedisCache)
container.register_singleton(ILogger, FileLogger)

user_service = container.get(IUserService)  # 自动注入依赖
```

### 1.2 何时使用容器

- 大型应用中管理服务依赖
- 需要实现控制反转（IoC）
- 需要支持多种服务实现（测试/生产环境）
- 需要单例管理共享资源

## 2. 生命周期

### 2.1 三种生命周期

| 生命周期 | 说明 | 适用场景 |
|----------|------|----------|
| `SINGLETON` | 全局共享单一实例 | 无状态服务、配置、连接池 |
| `TRANSIENT` | 每次请求创建新实例 | 有状态对象、请求级对象 |
| `SCOPED` | 作用域内共享 | Web请求、会话级对象 |

### 2.2 单例模式

```python
container.register_singleton(ICache, RedisCache)

cache1 = container.get(ICache)
cache2 = container.get(ICache)
assert cache1 is cache2  # True
```

### 2.3 瞬态模式

```python
container.register_transient(IRequest, HttpRequest)

request1 = container.get(IRequest)
request2 = container.get(IRequest)
assert request1 is not request2  # True
```

## 3. 注册方式

### 3.1 类型注册

```python
container.register_singleton(IService, ServiceImpl)
container.register_transient(IService, ServiceImpl)
```

### 3.2 工厂函数注册

```python
container.register_factory(
    IDatabase,
    lambda: create_database_connection(),
    lifetime=ServiceLifetime.SINGLETON
)
```

### 3.3 实例注册

```python
existing_cache = RedisCache()
container.register_instance(ICache, existing_cache)
```

## 4. 依赖解析

### 4.1 自动依赖注入

容器自动解析构造函数依赖：

```python
class UserService:
    def __init__(self, cache: ICache, logger: ILogger):
        self.cache = cache
        self.logger = logger

container.register_singleton(ICache, RedisCache)
container.register_singleton(ILogger, FileLogger)
container.register_singleton(IUserService, UserService)

service = container.get(IUserService)
# cache 和 logger 会自动注入
```

### 4.2 依赖检测

容器检测循环依赖并抛出异常：

```python
class A:
    def __init__(self, b: 'B'): pass

class B:
    def __init__(self, a: 'A'): pass

container.register_singleton(A, A)
container.register_singleton(B, B)

try:
    container.get(A)
except CircularDependencyException as e:
    print(f"循环依赖: {' -> '.join(e.dependency_chain)}")
```

## 5. 服务定位器

### 5.1 全局访问点

```python
ServiceLocator.set_container(container)

cache = ServiceLocator.get(ICache)
```

### 5.2 适合场景

- 应用启动时设置全局容器
- 到处需要访问服务时使用
- 避免层层传递容器

## 6. 核心组件

| 组件 | 说明 |
|------|------|
| `ServiceContainer` | 服务容器，负责注册和解析 |
| `ServiceDescriptor` | 服务描述符，描述如何创建服务 |
| `ServiceLifetime` | 生命周期枚举 |
| `ServiceLocator` | 全局服务定位器 |
| `CircularDependencyException` | 循环依赖异常 |
