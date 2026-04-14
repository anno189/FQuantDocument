---
title: 服务容器 - 配置指南
description: 服务容器配置选项详解
tag:
  - fqbase
  - container
---

# 服务容器 - 配置指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → **[配置指南](./configuration.md)** → [安全指南](./security.md) → [故障排查](./troubleshooting.md) → [常见问题](./faq.md) |


## 概述

服务容器的配置主要通过代码方式进行，不需要配置文件。所有配置都在服务注册时完成。

## 注册配置

### 基本服务注册

```python
from FQBase.Foundation.container import ServiceContainer, ServiceLifetime

container = ServiceContainer()

# 方式1：使用类型注册
container.register_singleton(CacheInterface, RedisCacheAdapter)

# 方式2：使用工厂函数注册
container.register_singleton(
    DatabaseInterface,
    lambda: create_database_connection(host="localhost", port=5432)
)

# 方式3：注册已有实例
db = MyDatabase()
container.register_instance(DatabaseInterface, db)
```

### 生命周期配置

```python
# 单例模式（默认）
container.register_singleton(ServiceA, ServiceAImpl)

# 瞬态模式
container.register_transient(ServiceB, ServiceBImpl)

# 工厂模式 + 自定义生命周期
container.register_factory(
    ServiceC,
    factory=create_service_c,
    lifetime=ServiceLifetime.SCOPED
)
```

### 依赖配置

```python
# 声明依赖关系
container.register_singleton(
    UserService,
    UserServiceImpl,
    dependencies=[DatabaseInterface, CacheInterface, LoggerInterface]
)
```

## 服务解析配置

### 错误处理策略

```python
# 方式1：直接获取（可能抛异常）
try:
    service = container.get(ServiceInterface)
except KeyError as e:
    print(f"服务未注册: {e}")
except CircularDependencyException as e:
    print(f"循环依赖: {e.dependency_chain}")

# 方式2：安全获取（返回 None）
service = container.try_get(ServiceInterface)
if service is None:
    print("服务不可用")
```

## 全局容器配置

### ServiceLocator 配置

```python
from FQBase.Foundation.container import ServiceLocator, ServiceContainer

# 初始化容器
container = ServiceContainer()
container.register_singleton(Cache, RedisCache)

# 设置全局容器
ServiceLocator.set_container(container)

# 或获取后设置
container = ServiceLocator.get_container()
```

## 环境适配

### 开发环境

```python
# 开发环境：使用内存缓存
container.register_singleton(
    CacheInterface,
    InMemoryCache  # 快速，但重启丢失
)
```

### 生产环境

```python
# 生产环境：使用 Redis 缓存
container.register_singleton(
    CacheInterface,
    RedisCacheAdapter,
    dependencies=[LoggerInterface]
)
```

### 测试环境

```python
# 测试环境：使用 Mock
container.register_singleton(
    PaymentInterface,
    MockPaymentAdapter
)
```

## 高级配置

### 自定义实例创建

```python
def create_custom_service():
    config = load_config()
    service = CustomService(config)
    service.initialize()
    return service

container.register_factory(
    CustomServiceInterface,
    factory=create_custom_service,
    lifetime=ServiceLifetime.SINGLETON
)
```

### 条件注册

```python
import os

# 根据环境变量条件注册
if os.getenv("USE_REDIS") == "true":
    container.register_singleton(CacheInterface, RedisCacheAdapter)
else:
    container.register_singleton(CacheInterface, InMemoryCache)
```

## 动态配置

### 运行时服务替换

```python
# 替换实现（用于热更新或 A/B 测试）
def get_new_implementation():
    if use_new_version():
        return NewImplementation
    return OldImplementation

container.register_singleton(
    ServiceInterface,
    get_new_implementation()
)
```

## 配置验证

### 检查服务状态

```python
# 检查服务是否已注册
if container.is_registered(CacheInterface):
    cache = container.get(CacheInterface)

# 获取所有已注册服务
services = container.registered_services
for service_type, descriptor in services.items():
    print(f"{service_type.__name__}: {descriptor.lifetime}")

# 获取依赖关系图
graph = container.get_dependency_graph()
print(graph)
```

## 最佳实践

1. **统一初始化**：在应用启动时完成所有服务注册
2. **依赖声明**：显式声明依赖关系，便于管理
3. **生命周期选择**：
   - 数据库连接、缓存 → SINGLETON
   - 处理器、视图 → TRANSIENT
   - 请求上下文 → SCOPED
4. **错误处理**：使用 `try_get` 处理可选服务

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
- [故障排查](./troubleshooting.md)
