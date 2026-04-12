# FAQ

## 基础问题

### Q: 什么是依赖注入？

依赖注入（Dependency Injection）是一种设计模式，通过外部容器将依赖传递给类，而不是在类内部创建依赖。

```python
# 传统方式：类内部创建依赖
class UserService:
    def __init__(self):
        self.db = Database()  # 紧耦合

# 依赖注入：依赖由外部传入
class UserService:
    def __init__(self, db: IDatabase):
        self.db = db  # 松耦合

# 通过容器注入
container.register_singleton(IDatabase, PostgresDatabase)
service = container.get(UserService)  # 容器自动注入 db
```

---

### Q: 容器支持哪些生命周期？

| 生命周期 | 说明 | 使用场景 |
|----------|------|----------|
| `SINGLETON` | 全局唯一实例 | 数据库连接、缓存 |
| `TRANSIENT` | 每次请求新实例 | 请求上下文、一次性对象 |
| `SCOPED` | 作用域内唯一 | Web 请求生命周期 |

---

### Q: 如何创建容器？

```python
from FQBase.Foundation.container import ServiceContainer

container = ServiceContainer()

# 链式注册
container.register_singleton(ICache, RedisCache).register_singleton(ILogger, FileLogger)
```

---

## 注册问题

### Q: 如何注册服务？

```python
from FQBase.Foundation.container import ServiceContainer, ServiceLifetime

container = ServiceContainer()

# 单例（默认）
container.register_singleton(ICache, RedisCacheAdapter)

# 瞬态
container.register_transient(IRequest, RequestImpl)

# 工厂
container.register_factory(IConnection, lambda: create_connection())

# 实例
container.register_instance(IDatabase, existing_db_instance)
```

---

### Q: 如何注册有依赖的服务？

```python
from FQBase.Foundation.container import ServiceContainer

container = ServiceContainer()

# 注册依赖
container.register_singleton(ILogger, FileLogger)
container.register_singleton(IConfig, ConfigManager)

# 注册带依赖的服务
container.register_singleton(
    ICache,
    RedisCacheAdapter,
    dependencies=[ILogger, IConfig]
)

# 获取时自动解析依赖
cache = container.get(ICache)  # RedisCacheAdapter(logger, config) 自动创建
```

---

### Q: 如何使用工厂函数注册？

```python
container = ServiceContainer()

# 工厂函数
def create_database():
    config = load_config()
    return PostgresDatabase(config)

container.register_factory(IDatabase, create_database)

# 带生命周期的工厂
container.register_factory(
    IConnection,
    lambda: create_connection(),
    lifetime=ServiceLifetime.SINGLETON
)
```

---

## 获取问题

### Q: 如何获取服务实例？

```python
container = ServiceContainer()
container.register_singleton(ICache, RedisCache)

# 获取服务
cache = container.get(ICache)
```

---

### Q: 服务未注册会怎样？

```python
container = ServiceContainer()

try:
    cache = container.get(ICache)
except KeyError as e:
    print(f"Service not registered: {e}")

# 安全获取
cache = container.try_get(ICache)  # None 而不是异常
```

---

### Q: 如何安全获取服务？

```python
container = ServiceContainer()

# try_get 返回 None 而不抛异常
cache = container.try_get(ICache)
if cache is None:
    print("ICache not registered, using default")
    cache = DefaultCache()
```

---

## 生命周期问题

### Q: 单例何时创建？

```python
container = ServiceContainer()
container.register_singleton(ICache, RedisCache)

# 此时 RedisCache 还没有创建
cache = container.get(ICache)  # 首次 get 时创建
```

---

### Q: 瞬态每次都创建新实例吗？

```python
container = ServiceContainer()
container.register_transient(IRequest, RequestImpl)

# 每次 get 都创建新实例
req1 = container.get(IRequest)
req2 = container.get(IRequest)
assert req1 is not req2  # True
```

---

### Q: 单例在容器中只有一个吗？

```python
container = ServiceContainer()
container.register_singleton(ICache, RedisCache)

# 多次获取返回同一实例
cache1 = container.get(ICache)
cache2 = container.get(ICache)
assert cache1 is cache2  # True
```

---

## 循环依赖问题

### Q: 如何检测循环依赖？

```python
from FQBase.Foundation.container import CircularDependencyException

# A 依赖 B，B 依赖 A
container.register_singleton(IServiceA, ImplA, dependencies=[IServiceB])
container.register_singleton(IServiceB, ImplB, dependencies=[IServiceA])

try:
    container.get(IServiceA)
except CircularDependencyException as e:
    print(f"Cycle: {' -> '.join(e.dependency_chain)}")
```

---

### Q: 如何解决循环依赖？

```python
# 错误：循环依赖
container.register_singleton(IServiceA, ImplA, dependencies=[IServiceB])
container.register_singleton(IServiceB, ImplB, dependencies=[IServiceA])

# 方法1：延迟初始化，使用工厂函数
container.register_factory(
    IServiceA,
    lambda: ImplA(container.get(IServiceB))
)

# 方法2：重构代码，消除循环
# 将共享依赖提取到第三个服务

# 方法3：使用接口而非具体类
```

---

## ServiceLocator 问题

### Q: ServiceLocator 是什么？

ServiceLocator 是全局服务定位器，提供静态方法访问容器：

```python
from FQBase.Foundation.container import ServiceLocator, ServiceContainer

# 设置全局容器
container = ServiceContainer()
container.register_singleton(ICache, RedisCache)
ServiceLocator.set_container(container)

# 获取服务
cache = ServiceLocator.get(ICache)

# 重置
ServiceLocator.reset()
```

---

### Q: 何时使用 ServiceLocator？

- 全局访问场景（如日志、配置）
- 避免层层传递容器
- 简化测试中的依赖注入

```python
# 避免：在业务代码中直接使用 ServiceLocator
class UserService:
    def __init__(self):
        self.db = ServiceLocator.get(IDatabase)  # 隐藏依赖

# 推荐：显式依赖注入
class UserService:
    def __init__(self, db: IDatabase):
        self.db = db  # 显式依赖
```

---

## 常见错误

### Q: 错误：`Service not registered`

**原因**：服务未注册就尝试获取

```python
container = ServiceContainer()

# 触发错误
try:
    cache = container.get(ICache)
except KeyError as e:
    print(f"Service not registered: {e}")

# 解决：先注册
container.register_singleton(ICache, RedisCache)
cache = container.get(ICache)
```

---

### Q: 错误：`Circular dependency detected`

**原因**：服务之间存在循环依赖

```python
# A → B → A 形成循环
container.register_singleton(IServiceA, ImplA, dependencies=[IServiceB])
container.register_singleton(IServiceB, ImplB, dependencies=[IServiceA])

# 解决：重构代码或使用工厂函数延迟
```

---

### Q: 错误：获取的服务类型不对

**原因**：注册时类型不匹配

```python
# 注册的是实现类
container.register_singleton(ICache, RedisCache)

# 但获取时用了错误的接口
cache = container.get(ILogger)  # KeyError

# 解决：获取时使用注册的接口
cache = container.get(ICache)
```

---

## 相关文档

- [API 参考](api.md)
- [使用指南](usage.md)
- [开发指南](development.md)
- [最佳实践](best-practices.md)
- [架构设计](architecture.md)
- [设计决策](design.md)