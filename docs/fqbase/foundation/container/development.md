# Container 开发指南

## 模块简介

`container` 模块提供轻量级依赖注入容器，支持单例、瞬态、工厂函数三种生命周期，并提供循环依赖检测功能。

### 核心组件

| 组件 | 类型 | 说明 |
|------|------|------|
| `ServiceContainer` | 类 | 服务容器 |
| `ServiceDescriptor` | 类 | 服务描述符 |
| `ServiceLifetime` | 枚举 | 服务生命周期 |
| `ServiceLocator` | 类 | 全局服务定位器 |
| `CircularDependencyException` | 异常 | 循环依赖异常 |

---

## 开发环境

### 环境要求

- Python 3.8+
- pytest（用于测试）

### 安装

```bash
cd /Users/A.D.189/FQuant/FQuant.Server/FQBase
pip install -e .
```

### 验证安装

```bash
python -c "from FQBase.Foundation.container import ServiceContainer, ServiceLocator; print('OK')"
```

---

## 本地调试

### 基本调试流程

```python
from FQBase.Foundation.container import ServiceContainer

container = ServiceContainer()

# 注册服务
container.register_singleton(ICache, RedisCacheAdapter)

# 获取服务
cache = container.get(ICache)
print(f"Cache instance: {cache}")
```

### 调试服务注册

```python
from FQBase.Foundation.container import ServiceContainer

container = ServiceContainer()

# 检查是否已注册
print(f"Registered: {container.is_registered(ICache)}")  # False

# 注册服务
container.register_singleton(ICache, RedisCacheAdapter)
print(f"Registered: {container.is_registered(ICache)}")  # True

# 查看所有注册的服务
services = container.registered_services
print(f"Registered services: {list(services.keys())}")
```

### 调试依赖关系

```python
from FQBase.Foundation.container import ServiceContainer

container = ServiceContainer()

# 注册服务及其依赖
container.register_singleton(ILogger, FileLogger)
container.register_singleton(ICache, RedisCacheAdapter, dependencies=[ILogger])

# 查看依赖图
graph = container.get_dependency_graph()
print(f"Dependency graph: {graph}")
```

---

## 测试指南

### 运行测试

```bash
cd /Users/A.D.189/FQuant/FQuant.Server/FQBase
pytest -v FQBase/Foundation/test_container.py
```

### 测试结构

```python
import pytest
from FQBase.Foundation.container import (
    ServiceContainer,
    ServiceLifetime,
    CircularDependencyException
)

class TestServiceContainer:
    def test_register_singleton(self):
        container = ServiceContainer()

        class ICache:
            pass

        class RedisCache:
            pass

        container.register_singleton(ICache, RedisCache)
        cache = container.get(ICache)

        assert isinstance(cache, RedisCache)

    def test_singleton_same_instance(self):
        container = ServiceContainer()

        class IService:
            pass

        class ServiceImpl:
            pass

        container.register_singleton(IService, ServiceImpl)

        service1 = container.get(IService)
        service2 = container.get(IService)

        assert service1 is service2

    def test_transient_different_instances(self):
        container = ServiceContainer()

        class IService:
            pass

        class ServiceImpl:
            pass

        container.register_transient(IService, ServiceImpl)

        service1 = container.get(IService)
        service2 = container.get(IService)

        assert service1 is not service2
```

### 测试循环依赖检测

```python
class TestCircularDependency:
    def test_circular_dependency_detected(self):
        container = ServiceContainer()

        class IServiceA:
            pass

        class IServiceB:
            pass

        container.register_singleton(IServiceA, SomeImplA, dependencies=[IServiceB])
        container.register_singleton(IServiceB, SomeImplB, dependencies=[IServiceA])

        with pytest.raises(CircularDependencyException):
            container.get(IServiceA)
```

### 测试 ServiceLocator

```python
from FQBase.Foundation.container import ServiceLocator, ServiceContainer

class ICache:
    pass

class RedisCache:
    pass

def test_service_locator():
    container = ServiceContainer()
    container.register_singleton(ICache, RedisCache)

    ServiceLocator.set_container(container)

    cache = ServiceLocator.get(ICache)
    assert isinstance(cache, RedisCache)

    ServiceLocator.reset()
```

---

## 代码规范

### 接口命名规范

```python
from typing import Protocol

# 推荐：明确的接口命名
class ICache(Protocol):
    """缓存接口"""
    def get(self, key: str): ...
    def set(self, key: str, value: Any): ...

class ILogger(Protocol):
    """日志接口"""
    def log(self, message: str): ...

# 避免：过于通用的命名
class IManager(Protocol):
    """管理器...什么管理器？"""
    pass
```

### 注册服务规范

```python
# 推荐：清晰的注册
container.register_singleton(
    ICache,
    RedisCacheAdapter,
    dependencies=[ILogger, IConfig]
)

# 避免：缺少依赖声明
container.register_singleton(ICache, RedisCacheAdapter)  # 依赖未声明
```

### 生命周期选择规范

```python
# 单例：全局共享状态
container.register_singleton(IDatabase, PostgresDatabase)

# 瞬态：每次请求新实例
container.register_transient(IRequestContext, RequestContext)

# 工厂：按条件创建
container.register_factory(
    IConnection,
    lambda: create_connection(host="localhost")
)
```

---

## 调试技巧

### 打印容器状态

```python
container = ServiceContainer()
container.register_singleton(ICache, RedisCache)
container.register_singleton(ILogger, FileLogger)

# 打印所有注册的服务
for service_type, descriptor in container.registered_services.items():
    print(f"{service_type.__name__}:")
    print(f"  Implementation: {descriptor.implementation.__name__}")
    print(f"  Lifetime: {descriptor.lifetime.value}")
    print(f"  Dependencies: {[d.__name__ for d in descriptor.dependencies]}")
```

### 追踪依赖解析

```python
container = ServiceContainer()

# 设置断点跟踪 get() 调用
try:
    service = container.get(IService)
except CircularDependencyException as e:
    print(f"Circular dependency: {e.dependency_chain}")
    # 查看循环依赖链
```

### 使用 try_get 安全获取

```python
# 安全获取，未注册返回 None
service = container.try_get(ISomeService)
if service is None:
    print("Service not registered")
else:
    print(f"Got service: {service}")
```

---

## 常见问题

### Q: 单例和瞬态有什么区别？

```python
container = ServiceContainer()

# 单例：全局共享一个实例
container.register_singleton(IService, ServiceImpl)
s1 = container.get(IService)
s2 = container.get(IService)
assert s1 is s2  # True

# 瞬态：每次获取新实例
container.register_transient(IService, ServiceImpl)
s1 = container.get(IService)
s2 = container.get(IService)
assert s1 is not s2  # True
```

### Q: 如何处理循环依赖？

```python
# 错误示例
container.register_singleton(IServiceA, ImplA, dependencies=[IServiceB])
container.register_singleton(IServiceB, ImplB, dependencies=[IServiceA])

# 解决方法：使用延迟注入或重构
# 方法1：使用工厂函数延迟创建
container.register_factory(IServiceA, lambda: ImplA(get_b()))
container.register_factory(IServiceB, lambda: ImplB(get_a()))

# 方法2：重构代码消除循环
```

### Q: 如何重置容器？

```python
# 清除所有服务
container.clear()

# 重置全局 ServiceLocator
ServiceLocator.reset()

# 注销单个服务
container.unregister(ICache)
```

---

## 相关文档

- [API 参考](api.md)
- [使用指南](usage.md)
- [最佳实践](best-practices.md)
- [架构设计](architecture.md)
- [设计决策](design.md)
- [FAQ](faq.md)