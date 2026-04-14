---
title: 服务容器 - 动手实验室
description: 服务容器动手练习指南
tag:
  - fqbase
  - container
---

# 服务容器 - 动手实验室

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [速查表](./cheatsheet.md) → **[动手实验室](./workshop.md)** → [使用指南](./usage.md) → [案例库](./examples.md) |


## 概述

本实验室提供动手练习，帮助您掌握服务容器的核心功能。

## 准备环境

```python
pip install fquant-base
```

## Lab 1: 基础注册与获取

### 目标

掌握服务容器的基本使用：注册和获取服务。

### 练习代码

```python
from FQBase.Foundation.container import ServiceContainer

# 创建容器
container = ServiceContainer()

# 定义接口和实现
class DatabaseInterface:
    def query(self, sql): pass

class PostgreSQL(DatabaseInterface):
    def query(self, sql):
        return f"Executing: {sql}"

# 练习1: 注册单例
container.register_singleton(DatabaseInterface, PostgreSQL)

# 练习2: 获取服务
db = container.get(DatabaseInterface)
print(db.query("SELECT * FROM users"))

# 练习3: 验证单例
db2 = container.get(DatabaseInterface)
print(f"是同一个实例: {db is db2}")
```

### 任务

1. [ ] 创建 ServiceContainer 实例
2. [ ] 定义接口和实现类
3. [ ] 使用 register_singleton 注册服务
4. [ ] 使用 get 获取服务
5. [ ] 验证单例行为

---

## Lab 2: 依赖注入

### 目标

理解依赖注入的工作原理。

### 练习代码

```python
from FQBase.Foundation.container import ServiceContainer

class LoggerInterface:
    def log(self, msg): pass

class DatabaseInterface:
    def query(self, sql): pass

class FileLogger(LoggerInterface):
    def log(self, msg):
        print(f"[LOG] {msg}")

class Database:
    def __init__(self, logger: LoggerInterface):
        self.logger = logger
    
    def query(self, sql):
        self.logger.log(f"Query: {sql}")
        return []

# 容器设置
container = ServiceContainer()

# 练习1: 注册依赖服务
container.register_singleton(LoggerInterface, FileLogger)

# 练习2: 注册有依赖的服务
container.register_singleton(
    DatabaseInterface,
    Database,
    dependencies=[LoggerInterface]
)

# 练习3: 获取服务
db = container.get(DatabaseInterface)
db.query("SELECT * FROM users")
```

### 任务

1. [ ] 创建服务接口和实现
2. [ ] 创建有依赖的服务类
3. [ ] 声明依赖关系
4. [ ] 验证依赖自动注入

---

## Lab 3: 生命周期管理

### 目标

掌握三种服务生命周期的区别。

### 练习代码

```python
from FQBase.Foundation.container import ServiceContainer, ServiceLifetime

class ServiceInterface:
    def get_id(self): pass

class MyService(ServiceInterface):
    def __init__(self):
        import uuid
        self.id = str(uuid.uuid4())[:8]
    
    def get_id(self):
        return self.id

container = ServiceContainer()

# 练习1: 单例模式
container.register_singleton(ServiceInterface, MyService)
s1 = container.get(ServiceInterface)
s2 = container.get(ServiceInterface)
print(f"单例 - 同一个ID: {s1.get_id() == s2.get_id()}")  # True

# 练习2: 瞬态模式
container.register_transient(ServiceInterface, MyService)
t1 = container.get(ServiceInterface)
t2 = container.get(ServiceInterface)
print(f"瞬态 - 不同ID: {t1.get_id() != t2.get_id()}")  # True
```

### 任务

1. [ ] 注册单例服务并验证
2. [ ] 注册瞬态服务并验证
3. [ ] 观察 ID 差异

---

## Lab 4: 错误处理

### 目标

学会处理服务容器的常见错误。

### 练习代码

```python
from FQBase.Foundation.container import ServiceContainer, CircularDependencyException

class ServiceA:
    pass

class ServiceB:
    pass

container = ServiceContainer()

# 场景1: 服务未注册
try:
    service = container.get(ServiceA)
except KeyError as e:
    print(f"错误: {e}")

# 场景2: 使用 try_get 安全获取
service = container.try_get(ServiceA)
print(f"安全获取: {service}")  # None

# 场景3: 检查服务状态
container.register_singleton(ServiceA, ServiceA)
print(f"已注册: {container.is_registered(ServiceA)}")  # True
```

### 任务

1. [ ] 处理 KeyError
2. [ ] 使用 try_get
3. [ ] 使用 is_registered 检查

---

## 实验室总结

完成所有实验后，你应该掌握：

- [x] 创建和配置 ServiceContainer
- [x] 注册单例和瞬态服务
- [x] 使用依赖注入
- [x] 理解服务生命周期
- [x] 处理常见错误

## 下一步

- 学习 [最佳实践](./best-practices.md)
- 查看 [案例库](./examples.md)
- 阅读 [API参考](./api.md)

## 相关文档

- [README](./README.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
- [API参考](./api.md)
