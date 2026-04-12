# Container 模块 API 参考

## 目录

- [枚举](#1-枚举)
- [异常](#2-异常)
- [服务描述符](#3-服务描述符)
- [服务容器](#4-服务容器)
- [服务定位器](#5-服务定位器)

---

## 1. 枚举

### ServiceLifetime

```python
class ServiceLifetime(Enum)
```

服务生命周期枚举。

| 值 | 说明 |
|----|------|
| `SINGLETON` | 单例，全局共享单一实例 |
| `TRANSIENT` | 瞬态，每次请求创建新实例 |
| `SCOPED` | 作用域，作用域内共享 |

---

## 2. 异常

### CircularDependencyException

```python
class CircularDependencyException(Exception)
```

循环依赖异常。

**初始化参数**：

| 参数 | 类型 | 说明 |
|------|------|------|
| `dependency_chain` | List[str] | 依赖链 |

**属性**：

| 属性 | 类型 | 说明 |
|------|------|------|
| `dependency_chain` | List[str] | 依赖链 |

**示例**：

```python
try:
    container.get(A)
except CircularDependencyException as e:
    print(f"循环依赖: {' -> '.join(e.dependency_chain)}")
```

---

## 3. 服务描述符

### ServiceDescriptor

```python
class ServiceDescriptor
```

服务描述符，描述如何创建和管理服务实例。

**初始化参数**：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `service_type` | Type | - | 服务类型 |
| `implementation` | Union[Type, Callable] | - | 实现类型或工厂函数 |
| `lifetime` | ServiceLifetime | SINGLETON | 生命周期 |
| `dependencies` | Optional[List[Type]] | None | 依赖类型列表 |

**属性**：

| 属性 | 类型 | 说明 |
|------|------|------|
| `service_type` | Type | 服务类型 |
| `implementation` | Union[Type, Callable] | 实现 |
| `lifetime` | ServiceLifetime | 生命周期 |
| `dependencies` | List[Type] | 依赖列表 |
| `_instance` | Optional[Any] | 单例实例缓存 |
| `_lock` | threading.Lock | 线程锁 |

**方法**：

#### get_instance

```python
def get_instance(self, container: 'ServiceContainer') -> Any
```

获取服务实例。

**参数**：
- `container` - 服务容器

**返回**：服务实例

---

## 4. 服务容器

### ServiceContainer

```python
class ServiceContainer
```

服务容器，轻量级依赖注入容器。

**初始化**：无参数

**方法**：

#### register_singleton

```python
def register_singleton(
    self,
    service_type: Type[T],
    implementation: Union[Type[T], Callable[[], T]],
    dependencies: Optional[List[Type]] = None,
) -> 'ServiceContainer'
```

注册单例服务。

**参数**：
- `service_type` - 服务类型
- `implementation` - 实现类型或工厂函数
- `dependencies` - 依赖类型列表

**返回**：`self`（支持链式调用）

**示例**：

```python
container.register_singleton(ICache, RedisCache)
container.register_singleton(ILogger, FileLogger).register_singleton(IDB, PostgreSQL)
```

#### register_transient

```python
def register_transient(
    self,
    service_type: Type[T],
    implementation: Union[Type[T], Callable[[], T]],
    dependencies: Optional[List[Type]] = None,
) -> 'ServiceContainer'
```

注册瞬态服务。

**参数**：
- `service_type` - 服务类型
- `implementation` - 实现类型或工厂函数
- `dependencies` - 依赖类型列表

**返回**：`self`（支持链式调用）

#### register_factory

```python
def register_factory(
    self,
    service_type: Type[T],
    factory: Callable[[], T],
    lifetime: ServiceLifetime = ServiceLifetime.SINGLETON,
    dependencies: Optional[List[Type]] = None,
) -> 'ServiceContainer'
```

注册工厂函数。

**参数**：
- `service_type` - 服务类型
- `factory` - 工厂函数
- `lifetime` - 生命周期
- `dependencies` - 依赖类型列表

**返回**：`self`（支持链式调用）

#### register_instance

```python
def register_instance(
    self,
    service_type: Type[T],
    instance: T,
) -> 'ServiceContainer'
```

注册现有实例。

**参数**：
- `service_type` - 服务类型
- `instance` - 实例

**返回**：`self`（支持链式调用）

#### get

```python
def get(self, service_type: Type[T]) -> T
```

获取服务实例。

**参数**：
- `service_type` - 服务类型

**返回**：服务实例

**抛出**：
- `KeyError` - 服务未注册
- `CircularDependencyException` - 检测到循环依赖

#### try_get

```python
def try_get(self, service_type: Type[T]) -> Optional[T]
```

尝试获取服务实例。

**参数**：
- `service_type` - 服务类型

**返回**：服务实例或 None

#### is_registered

```python
def is_registered(self, service_type: Type) -> bool
```

检查服务是否已注册。

**参数**：
- `service_type` - 服务类型

**返回**：bool

#### unregister

```python
def unregister(self, service_type: Type) -> bool
```

注销服务。

**参数**：
- `service_type` - 服务类型

**返回**：是否成功注销

#### clear

```python
def clear(self) -> None
```

清空所有服务。

#### get_dependency_graph

```python
def get_dependency_graph(self) -> Dict[str, List[str]]
```

获取依赖关系图。

**返回**：服务名到依赖服务名的映射

**示例**：

```python
graph = container.get_dependency_graph()
# {'UserService': ['ICache', 'ILogger'], 'Cache': [], 'Logger': []}
```

**属性**：

#### registered_services

```python
@property
def registered_services(self) -> Dict[Type, ServiceDescriptor]
```

获取所有已注册的服务。

---

## 5. 服务定位器

### ServiceLocator

```python
class ServiceLocator
```

全局服务定位器。

**类方法**：

#### set_container

```python
@classmethod
def set_container(cls, container: ServiceContainer) -> None
```

设置全局容器。

**参数**：
- `container` - 服务容器

#### get_container

```python
@classmethod
def get_container(cls) -> Optional[ServiceContainer]
```

获取全局容器。

**返回**：服务容器或 None

#### get

```python
@classmethod
def get(cls, service_type: Type[T]) -> T
```

获取服务实例。

**参数**：
- `service_type` - 服务类型

**返回**：服务实例

**抛出**：
- `RuntimeError` - 容器未设置
- `KeyError` - 服务未注册

#### try_get

```python
@classmethod
def try_get(cls, service_type: Type[T]) -> Optional[T]
```

尝试获取服务实例。

**参数**：
- `service_type` - 服务类型

**返回**：服务实例或 None

#### reset

```python
@classmethod
def reset(cls) -> None
```

重置全局容器。
