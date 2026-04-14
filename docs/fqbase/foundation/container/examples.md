---
title: 服务容器 - 案例库
description: 服务容器实际应用场景与示例
tag:
  - fqbase
  - container
---

# 服务容器 - 案例库

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [速查表](./cheatsheet.md) → [动手实验室](./workshop.md) → [使用指南](./usage.md) → **[案例库](./examples.md)** |
| 📚 案例库 | **[案例库](./examples.md)** → [跨模块集成示例](#跨模块集成) |


## 概述

本文档展示服务容器在实际项目中的应用场景，帮助您理解如何有效使用依赖注入。

## 基础示例

### 示例 1：简单的用户服务

**场景描述：** 使用容器管理用户服务及其依赖

**代码实现：**

```python
from FQBase.Foundation.container import ServiceContainer

# 定义接口
class DatabaseInterface:
    def query(self, sql: str): pass

class CacheInterface:
    def get(self, key: str): pass
    def set(self, key: str, value: str): pass

# 实现类
class PostgreSQLAdapter(DatabaseInterface):
    def query(self, sql: str):
        print(f"Executing: {sql}")
        return []

class RedisCache(CacheInterface):
    def __init__(self):
        self._data = {}
    
    def get(self, key: str):
        return self._data.get(key)
    
    def set(self, key: str, value: str):
        self._data[key] = value

# 用户服务
class UserService:
    def __init__(self, db: DatabaseInterface, cache: CacheInterface):
        self.db = db
        self.cache = cache
    
    def get_user(self, user_id: str):
        # 先从缓存获取
        cached = self.cache.get(f"user:{user_id}")
        if cached:
            return cached
        
        # 缓存未命中，从数据库查询
        user = self.db.query(f"SELECT * FROM users WHERE id = {user_id}")
        self.cache.set(f"user:{user_id}", user)
        return user

# 使用容器
container = ServiceContainer()
container.register_singleton(DatabaseInterface, PostgreSQLAdapter)
container.register_singleton(CacheInterface, RedisCache)
container.register_transient(UserService, UserService)

user_service = container.get(UserService)
user = user_service.get_user("123")
```

**适用场景：**
- Web 应用后端服务
- 需要数据库和缓存的数据访问层

---

### 示例 2：插件系统

**场景描述：** 使用容器管理可插拔的插件系统

**代码实现：**

```python
from FQBase.Foundation.container import ServiceContainer
from typing import Dict, Type

# 插件接口
class PluginInterface:
    def name(self) -> str: pass
    def execute(self, data: dict): pass

# 插件实现
class ValidationPlugin(PluginInterface):
    def name(self) -> str:
        return "validation"
    
    def execute(self, data: dict):
        print(f"Validating: {data}")
        return {"status": "valid"}

class TransformPlugin(PluginInterface):
    def name(self) -> str:
        return "transform"
    
    def execute(self, data: dict):
        print(f"Transforming: {data}")
        return {"transformed": True}

class OutputPlugin(PluginInterface):
    def name(self) -> str:
        return "output"
    
    def execute(self, data: dict):
        print(f"Outputting: {data}")
        return {"output": True}

# 插件管理器
class PluginManager:
    def __init__(self, plugins: Dict[str, PluginInterface]):
        self.plugins = plugins
    
    def run_pipeline(self, data: dict):
        result = data
        for name, plugin in self.plugins.items():
            result = plugin.execute(result)
        return result

# 使用容器
container = ServiceContainer()
container.register_singleton(PluginInterface, ValidationPlugin)
container.register_singleton(PluginInterface, TransformPlugin)
container.register_singleton(PluginInterface, OutputPlugin)
```

**适用场景：**
- 可扩展的插件架构
- 数据处理流水线

---

## 进阶示例

### 示例 3：多环境配置

**场景描述：** 根据不同环境使用不同配置

**代码实现：**

```python
import os
from FQBase.Foundation.container import ServiceContainer, ServiceLifetime

def create_container(env: str) -> ServiceContainer:
    container = ServiceContainer()
    
    if env == "development":
        # 开发环境：使用内存存储
        container.register_singleton(
            DatabaseInterface,
            InMemoryDatabase,
        )
        container.register_singleton(
            CacheInterface,
            InMemoryCache,
        )
    elif env == "production":
        # 生产环境：使用真实服务
        container.register_singleton(
            DatabaseInterface,
            PostgreSQLAdapter,
            dependencies=[LoggerInterface],
        )
        container.register_singleton(
            CacheInterface,
            RedisCacheAdapter,
        )
    elif env == "test":
        # 测试环境：使用 Mock
        container.register_singleton(
            DatabaseInterface,
            MockDatabase,
        )
        container.register_singleton(
            CacheInterface,
            MockCache,
        )
    
    return container

# 根据环境创建容器
env = os.getenv("APP_ENV", "development")
container = create_container(env)
```

**适用场景：**
- 多环境部署
- CI/CD 流程

---

### 示例 4：微服务架构

**场景描述：** 微服务中的依赖注入

**代码实现：**

```python
from FQBase.Foundation.container import ServiceContainer

# 定义服务接口
class HttpClientInterface:
    def get(self, url: str): pass
    def post(self, url: str, data: dict): pass

class AuthServiceInterface:
    def authenticate(self, token: str): pass

class OrderServiceInterface:
    def create_order(self, user_id: str, items: list): pass

# 实现
class AxiosClient(HttpClientInterface):
    def __init__(self, base_url: str):
        self.base_url = base_url
    def get(self, url: str): 
        return {"data": f"{self.base_url}{url}"}
    def post(self, url: str, data: dict): 
        return {"data": data}

class JwtAuthService(AuthServiceInterface):
    def __init__(self, secret: str):
        self.secret = secret
    def authenticate(self, token: str):
        return {"user_id": "123", "valid": True}

class OrderService(OrderServiceInterface):
    def __init__(self, http: HttpClientInterface, auth: AuthServiceInterface):
        self.http = http
        self.auth = auth
    
    def create_order(self, user_id: str, items: list):
        if not self.auth.authenticate(user_id):
            raise PermissionError("Unauthorized")
        return self.http.post("/orders", {"user_id": user_id, "items": items})

# 注册服务
container = ServiceContainer()
container.register_singleton(
    HttpClientInterface,
    lambda: AxiosClient(base_url="https://api.example.com")
)
container.register_singleton(
    AuthServiceInterface,
    lambda: JwtAuthService(secret=os.environ["JWT_SECRET"])
)
container.register_transient(OrderServiceInterface, OrderService)

# 获取服务
order_service = container.get(OrderServiceInterface)
result = order_service.create_order("user123", [{"item": "book", "qty": 1}])
```

**适用场景：**
- 微服务架构
- REST API 服务

---

## 最佳实践

1. **优先使用接口**：通过接口解耦实现
2. **生命周期选择**：根据服务特性选择合适的生命周期
3. **显式依赖**：使用 `dependencies` 参数声明依赖
4. **配置分离**：环境相关配置通过工厂函数注入

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
- [集成指南](./integrations.md)
