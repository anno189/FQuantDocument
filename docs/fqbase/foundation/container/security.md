---
title: 服务容器 - 安全指南
description: 服务容器安全配置与最佳实践
tag:
  - fqbase
  - container
---

# 服务容器 - 安全指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → **[安全指南](./security.md)** → [故障排查](./troubleshooting.md) → [常见问题](./faq.md) |


## 概述

服务容器本身不直接处理敏感数据，但通过依赖注入管理服务的创建，需要遵循安全最佳实践。

## 认证与授权

### 服务访问控制

```python
# 场景：需要认证才能获取某些服务
class SecureService:
    def __init__(self, auth_service: AuthService):
        self.auth_service = auth_service
    
    def get_data(self, user_id: str):
        if not self.auth_service.is_authenticated(user_id):
            raise PermissionError("未认证")
        # 获取数据...
```

### 依赖链安全

```python
# 确保敏感服务只被可信服务依赖
class SensitiveDataService:
    pass

class PublicService:
    def __init__(self, sensitive: SensitiveDataService):
        # ❌ 错误：公开服务不应依赖敏感服务
        pass

# 正确做法
class InternalService:
    def __init__(self, sensitive: SensitiveDataService):
        # ✅ 内部服务可以访问敏感服务
        pass
```

## 数据保护

### 防止服务实例泄露

```python
# ❌ 错误：单例中存储敏感数据
class UserService:
    def __init__(self):
        self.current_user = None  # 会在所有请求间共享
    
    def set_user(self, user):
        self.current_user = user  # 危险！

# ✅ 正确：使用请求作用域或临时存储
class UserService:
    def get_user_data(self, user_id: str):
        # 从数据库/缓存获取，不在内存中存储
        return database.get_user(user_id)
```

### 敏感配置管理

```python
# ❌ 错误：硬编码敏感信息
container.register_singleton(
    DatabaseInterface,
    PostgreSQLAdapter(
        password="secret123"  # 危险！
    )
)

# ✅ 正确：从环境变量获取
import os
container.register_singleton(
    DatabaseInterface,
    PostgreSQLAdapter(
        password=os.environ["DB_PASSWORD"]
    )
)
```

## 输入验证

### 服务类型验证

```python
# 确保注册的是有效类型
def register_service(container: ServiceContainer, service_type, implementation):
    if not isinstance(service_type, type):
        raise ValueError("service_type 必须是类型")
    
    if not isinstance(implementation, (type, callable)):
        raise ValueError("implementation 必须是类型或可调用对象")
    
    container.register_singleton(service_type, implementation)
```

### 防止恶意工厂函数

```python
# ❌ 错误：允许任意工厂函数
user_factory = eval(user_input)  # 危险！
container.register_singleton(Interface, user_factory)

# ✅ 正确：使用预定义的工厂
ALLOWED_FACTORIES = {
    "cache": lambda: RedisCache(),
    "logger": lambda: FileLogger(),
}

def register_from_input(container, name):
    if name not in ALLOWED_FACTORIES:
        raise ValueError(f"不允许的服务: {name}")
    container.register_singleton(Interface, ALLOWED_FACTORIES[name])
```

## 并发安全

### 线程安全

服务容器内部使用锁确保线程安全，使用时需注意：

```python
# ✅ 容器本身是线程安全的
container = ServiceContainer()  # 可在多线程中使用

# ❌ 但单例服务内部状态不一定是线程安全的
class UnsafeService:
    def __init__(self):
        self.data = {}
    
    def set(self, key, value):
        self.data[key] = value  # 非原子操作

# ✅ 正确：使用线程安全的数据结构或锁
import threading

class SafeService:
    def __init__(self):
        self._data = {}
        self._lock = threading.Lock()
    
    def set(self, key, value):
        with self._lock:
            self._data[key] = value
```

## 错误处理

### 避免信息泄露

```python
# ❌ 错误：向用户暴露内部细节
try:
    service = container.get(ServiceInterface)
except KeyError as e:
    # 危险！可能泄露服务名称
    raise Exception(f"服务 {service_interface} 未找到")  # ❌

# ✅ 正确：使用通用错误消息
try:
    service = container.get(ServiceInterface)
except KeyError:
    raise ServiceNotFoundError("请求的服务不可用")  # ✅
```

### 循环依赖异常处理

```python
from FQBase.Foundation.container import CircularDependencyException

try:
    service = container.get(SomeService)
except CircularDependencyException as e:
    # 记录详细的依赖链用于调试
    logger.error(f"循环依赖: {' -> '.join(e.dependency_chain)}")
    # 对用户显示友好消息
    raise ServiceConfigurationError("服务配置存在循环依赖，请联系管理员")
```

## 监控与审计

### 服务访问日志

```python
class AuditedContainer(ServiceContainer):
    def get(self, service_type):
        logger.info(f"获取服务: {service_type.__name__}")
        try:
            service = super().get(service_type)
            logger.info(f"服务已获取: {service_type.__name__}")
            return service
        except Exception as e:
            logger.error(f"获取服务失败: {service_type.__name__}, {e}")
            raise
```

### 健康检查

```python
def health_check(container: ServiceContainer):
    """检查容器和服务状态"""
    results = {
        "container_status": "healthy",
        "registered_services": len(container.registered_services),
        "services": {}
    }
    
    for service_type in container.registered_services:
        try:
            # 尝试解析每个服务
            container.get(service_type)
            results["services"][service_type.__name__] = "ok"
        except Exception as e:
            results["services"][service_type.__name__] = f"error: {e}"
            results["container_status"] = "degraded"
    
    return results
```

## 安全最佳实践

1. **敏感配置**：使用环境变量或密钥管理服务
2. **服务隔离**：根据信任级别分组服务
3. **输入验证**：验证所有用户输入
4. **错误处理**：避免泄露内部信息
5. **依赖审查**：定期审查依赖关系
6. **监控审计**：记录服务访问和错误

## 相关文档

- [API参考](./api.md)
- [最佳实践](./best-practices.md)
- [配置指南](./configuration.md)
- [故障排查](./troubleshooting.md)
