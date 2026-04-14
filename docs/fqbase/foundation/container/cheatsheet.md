---
title: 服务容器 - 速查表
description: 服务容器快速参考指南
tag:
  - fqbase
  - container
---

# 服务容器 - 速查表

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → **[速查表](./cheatsheet.md)** → [动手实验室](./workshop.md) → [使用指南](./usage.md) → [案例库](./examples.md) |


## 快速参考

### 基本操作

```python
from FQBase.Foundation.container import ServiceContainer, ServiceLocator, ServiceLifetime

# 创建容器
container = ServiceContainer()

# 注册服务
container.register_singleton(Interface, Implementation)
container.register_transient(Interface, Implementation)
container.register_factory(Interface, lambda: create_impl())

# 获取服务
service = container.get(Interface)

# 安全获取
service = container.try_get(Interface)  # 返回 None 而不是抛异常
```

### ServiceLocator

```python
# 设置全局容器
ServiceLocator.set_container(container)

# 获取服务
service = ServiceLocator.get(Interface)

# 安全获取
service = ServiceLocator.try_get(Interface)

# 重置
ServiceLocator.reset()
```

## 常用配置

### 生命周期选择

| 场景 | 生命周期 | 示例 |
|------|---------|------|
| 数据库连接 | SINGLETON | `register_singleton(Db, RedisAdapter)` |
| 缓存 | SINGLETON | `register_singleton(Cache, RedisCache)` |
| 日志 | SINGLETON | `register_singleton(Logger, FileLogger)` |
| 处理器 | TRANSIENT | `register_transient(Handler, OrderHandler)` |
| 视图 | TRANSIENT | `register_transient(View, UserView)` |

### 依赖声明

```python
# 声明依赖
container.register_singleton(
    UserService,
    UserServiceImpl,
    dependencies=[DatabaseInterface, CacheInterface, LoggerInterface]
)
```

## 常见错误

| 错误 | 原因 | 解决方案 |
|------|------|---------|
| KeyError: Service not registered | 未注册服务 | 先调用 register_* 方法 |
| CircularDependencyException | 循环依赖 | 重新设计依赖关系 |
| RuntimeError: Container not set | ServiceLocator 未设置 | 先调用 set_container() |

## 常用代码片段

### 链式注册

```python
container.register_singleton(A, AImpl) \
        .register_singleton(B, BImpl) \
        .register_transient(C, CImpl)
```

### 检查服务状态

```python
# 检查是否注册
if container.is_registered(Interface):
    service = container.get(Interface)

# 获取依赖图
graph = container.get_dependency_graph()

# 获取所有服务
services = container.registered_services
```

### 错误处理

```python
try:
    service = container.get(Interface)
except KeyError:
    print("服务未注册")
except CircularDependencyException as e:
    print(f"循环依赖: {e.dependency_chain}")
```

## 快速调试

```python
# 查看所有已注册服务
for st, desc in container.registered_services.items():
    print(f"{st.__name__}: {desc.lifetime.value}")

# 查看依赖关系
import json
print(json.dumps(container.get_dependency_graph(), indent=2))
```

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
- [案例库](./examples.md)
