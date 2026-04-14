---
title: 服务容器 - 设计模式
description: 服务容器使用的设计模式详解
tag:
  - fqbase
  - container
---

# 服务容器 - 设计模式

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟠 架构师 | [README](./README.md) → [技术架构](./architecture.md) → **[设计模式](./patterns.md)** → [技术权衡](./tradeoff.md) → [决策指南](./decision-guide.md) → [案例研究](./case-studies.md) → [数据流](./data-flow.md) |
| 📚 案例库 | **[案例库](./examples.md)** → [案例研究](./case-studies.md) → [决策指南](./decision-guide.md) → [数据流](./data-flow.md) → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) |


## 概述

服务容器的实现涉及多种设计模式，这些模式共同构成了一个健壮的依赖注入系统。

## 模式 1: 依赖注入（Dependency Injection）

### 上下文

当一个类需要使用另一个类的功能时，传统方式是内部创建依赖。依赖注入通过外部注入的方式解耦依赖关系。

### 模式结构

```
        ┌─────────────────┐
        │    Client      │
        │   (消费者)      │
        └────────┬────────┘
                 │ depends on
                 ▼
        ┌─────────────────┐
        │  ServiceContainer│
        │   (注入器)       │
        └────────┬────────┘
                 │ creates
                 ▼
        ┌─────────────────┐
        │   Dependency    │
        │   (服务)        │
        └─────────────────┘
```

### 实现

```python
# 传统方式（紧耦合）
class UserService:
    def __init__(self):
        self.db = Database()  # 内部创建
    
# 依赖注入（松耦合）
class UserService:
    def __init__(self, db: Database):
        self.db = db  # 外部注入

# 容器管理注入
container.register_singleton(Database, PostgreSQL)
container.register_transient(UserService, UserService)
user_service = container.get(UserService)  # db 自动注入
```

### 适用场景

- 需要解耦组件依赖
- 需要提高可测试性
- 需要灵活替换实现

### 优缺点

**优点：**
- 解耦组件依赖
- 便于单元测试（可 mock 依赖）
- 提高代码可维护性

**缺点：**
- 增加代码复杂度
- 需要学习成本

---

## 模式 2: 单例模式（Singleton）

### 上下文

某些服务（如数据库连接、配置）在整个应用生命周期内只需要一个实例。

### 模式结构

```
┌─────────────────────────────────────┐
│         ServiceLocator              │
│  ┌─────────────────────────────┐   │
│  │    _container: Singleton    │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### 实现

```python
class ServiceLocator:
    _container: Optional[ServiceContainer] = None  # 类变量，单例
    _lock = threading.Lock()
    
    @classmethod
    def set_container(cls, container: ServiceContainer):
        with cls._lock:
            cls._container = container
    
    @classmethod
    def get(cls, service_type: Type[T]) -> T:
        with cls._lock:
            if cls._container is None:
                raise RuntimeError("Container not set")
            return cls._container.get(service_type)
```

### 适用场景

- 全局访问点
- 资源共享
- 配置管理

---

## 模式 3: 工厂模式（Factory）

### 上下文

对象的创建逻辑复杂或需要根据条件创建不同实现时。

### 模式结构

```
┌──────────────┐     ┌────────────────┐
│   Client     │────▶│   Factory      │
└──────────────┘     │  register_     │
                     │   factory()    │
                     └────────┬───────┘
                              │ creates
                              ▼
                     ┌────────────────┐
                     │  Service       │
                     │  Instance      │
                     └────────────────┘
```

### 实现

```python
# 工厂函数
def create_database(config: dict) -> Database:
    db_type = config.get("type", "postgresql")
    if db_type == "postgresql":
        return PostgreSQLAdapter(config)
    elif db_type == "mysql":
        return MySQLAdapter(config)
    raise ValueError(f"Unknown database type: {db_type}")

# 注册工厂
container.register_factory(
    DatabaseInterface,
    factory=lambda: create_database({"type": "postgresql"}),
    lifetime=ServiceLifetime.SINGLETON
)
```

### 适用场景

- 复杂创建逻辑
- 条件创建不同实现
- 延迟创建

---

## 模式 4: 服务定位器（Service Locator）

### 上下文

需要全局访问服务，但不希望直接依赖容器。

### 模式结构

```
┌──────────────┐     ┌──────────────────┐
│   Client     │────▶│ ServiceLocator  │
└──────────────┘     │   (全局访问点)    │
                    └────────┬─────────┘
                             │ delegates to
                             ▼
                    ┌──────────────────┐
                    │ ServiceContainer │
                    └──────────────────┘
```

### 实现

```python
class ServiceLocator:
    """服务定位器 - 全局访问点"""
    _container: Optional[ServiceContainer] = None
    
    @classmethod
    def get(cls, service_type: Type[T]) -> T:
        """获取服务实例"""
        if cls._container is None:
            raise RuntimeError("Container not set")
        return cls._container.get(service_type)
    
    @classmethod
    def set_container(cls, container: ServiceContainer):
        """设置容器"""
        cls._container = container
```

### 适用场景

- 框架集成
- 遗留代码
- 快速原型

### 优缺点

**优点：**
- 使用简单
- 全局可用

**缺点：**
- 隐式依赖
- 难以测试

---

## 模式 5: 元对象协议（Metaobject）

### 上下文

需要描述对象创建和管理的元信息。

### 实现

```python
class ServiceDescriptor:
    """服务描述符 - 元对象"""
    service_type: Type           # 服务类型
    implementation: Union[Type, Callable]  # 实现
    lifetime: ServiceLifetime   # 生命周期
    dependencies: List[Type]    # 依赖
    
    def get_instance(self, container: 'ServiceContainer'):
        """获取或创建实例"""
        # 元操作：控制实例创建
```

---

## 相关文档

- [技术架构](./architecture.md)
- [设计原则](./design.md)
- [技术权衡](./tradeoff.md)
- [决策指南](./decision-guide.md)
- [案例研究](./case-studies.md)
