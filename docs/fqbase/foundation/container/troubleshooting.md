---
title: 服务容器 - 故障排查
description: 服务容器常见问题与解决方案
tag:
  - fqbase
  - container
---

# 服务容器 - 故障排查

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → [安全指南](./security.md) → **[故障排查](./troubleshooting.md)** → [常见问题](./faq.md) |


## 概述

本章节介绍服务容器使用过程中的常见问题及其解决方案。

## 常见问题

### 问题 1: KeyError - 服务未注册

**症状：**
```
KeyError: Service not registered: <class '__main__.CacheInterface'>
```

**可能原因：**
- 服务未调用 `register_*` 方法注册
- 服务类型注册错误

**解决方案：**

```python
# 检查服务是否已注册
if container.is_registered(CacheInterface):
    cache = container.get(CacheInterface)
else:
    container.register_singleton(CacheInterface, RedisCacheAdapter)
    cache = container.get(CacheInterface)

# 或者使用 try_get 安全获取
cache = container.try_get(CacheInterface)
if cache is None:
    # 处理服务不可用的情况
    pass
```

---

### 问题 2: CircularDependencyException - 循环依赖

**症状：**
```
CircularDependencyException: Circular dependency detected: A -> B -> A
```

**可能原因：**
- 两个或多个服务相互依赖形成闭环

**解决方案：**

```python
# 重新设计依赖关系，打破循环

# ❌ 错误：A 依赖 B，B 依赖 A
class A:
    def __init__(self, b: 'B'): pass

class B:
    def __init__(self, a: 'A'): pass

# ✅ 正确：使用接口解耦
class IA:
    pass

class IB:
    pass

class A(IA):
    pass

class B(IB):
    pass

# 如果确实需要相互引用，考虑使用 lazy import 或事件机制
```

---

### 问题 3: RuntimeError - 容器未设置

**症状：**
```
RuntimeError: Service container not set
```

**可能原因：**
- 使用 ServiceLocator 但未调用 set_container

**解决方案：**

```python
from FQBase.Foundation.container import ServiceLocator, ServiceContainer

# 设置全局容器
container = ServiceContainer()
container.register_singleton(CacheInterface, RedisCacheAdapter)
ServiceLocator.set_container(container)

# 现在可以使用
cache = ServiceLocator.get(CacheInterface)
```

---

### 问题 4: TypeError - 参数不匹配

**症状：**
```
TypeError: __init__() missing 1 required positional argument: 'db'
```

**可能原因：**
- 构造函数需要参数但未通过依赖注入提供

**解决方案：**

```python
# 声明依赖关系
container.register_singleton(
    UserService,
    UserService,
    dependencies=[DatabaseInterface, CacheInterface]
)

# 或使用工厂函数手动提供参数
container.register_singleton(
    UserService,
    lambda: UserService(db=create_db(), cache=create_cache())
)
```

---

### 问题 5: 单例未生效

**症状：**
- 每次获取单例服务返回不同实例

**可能原因：**
- 使用了 `register_transient` 而非 `register_singleton`

**解决方案：**

```python
# ❌ 错误：使用瞬态
container.register_transient(CacheInterface, RedisCacheAdapter)

# ✅ 正确：使用单例
container.register_singleton(CacheInterface, RedisCacheAdapter)

# 验证
cache1 = container.get(CacheInterface)
cache2 = container.get(CacheInterface)
print(cache1 is cache2)  # 应该是 True
```

---

### 问题 6: 线程安全问题

**症状：**
- 多线程环境下出现异常或数据不一致

**可能原因：**
- 单例服务内部状态非线程安全

**解决方案：**

```python
import threading

# 确保容器使用锁
container = ServiceContainer()

# 如果服务内部状态不安全，使用线程安全的数据结构
class UnsafeService:
    def __init__(self):
        self.data = {}  # 非线程安全

class SafeService:
    def __init__(self):
        self._data = {}
        self._lock = threading.Lock()  # 添加锁
    
    def set(self, key, value):
        with self._lock:
            self._data[key] = value
```

---

## 错误参考

### 错误代码

| 错误 | 描述 | 解决方案 |
|------|------|---------|
| KeyError | 服务未注册 | 调用 register_* 方法 |
| CircularDependencyException | 循环依赖 | 重新设计依赖关系 |
| RuntimeError | 容器未设置 | 调用 set_container |
| TypeError | 参数不匹配 | 声明依赖或使用工厂 |
| AttributeError | 服务类型错误 | 检查类型是否正确 |

### 错误处理模式

```python
from FQBase.Foundation.container import CircularDependencyException

try:
    service = container.get(ServiceInterface)
except KeyError as e:
    print(f"服务未注册: {e}")
except CircularDependencyException as e:
    print(f"循环依赖: {' -> '.join(e.dependency_chain)}")
except RuntimeError as e:
    print(f"运行时错误: {e}")
except Exception as e:
    print(f"未知错误: {e}")
```

## 诊断工具

### 调试服务注册

```python
# 列出所有已注册服务
for service_type, descriptor in container.registered_services.items():
    print(f"类型: {service_type.__name__}")
    print(f"  实现: {descriptor.implementation}")
    print(f"  生命周期: {descriptor.lifetime.value}")
    print(f"  依赖: {[d.__name__ for d in descriptor.dependencies]}")
```

### 查看依赖图

```python
# 获取依赖关系图
graph = container.get_dependency_graph()
import json
print(json.dumps(graph, indent=2))

# 格式：
# {
#   "UserService": ["Database", "Cache"],
#   "Database": ["Logger"],
#   "Cache": []
# }
```

### 启用调试日志

```python
import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("FQBase.Foundation.container")
logger.setLevel(logging.DEBUG)
```

## 获取帮助

### 联系支持前

1. 检查服务是否已注册
2. 查看依赖关系图
3. 确认生命周期设置正确
4. 检查是否有循环依赖

### 相关文档

- [常见问题](./faq.md)
- [最佳实践](./best-practices.md)
- [API参考](./api.md)
