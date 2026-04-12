# Container 模块架构

## 1. 模块结构

```
container.py
├── CircularDependencyException  # 循环依赖异常
├── ServiceLifetime (Enum)       # 生命周期枚举
├── ServiceDescriptor           # 服务描述符
├── ServiceContainer            # 服务容器
└── ServiceLocator             # 服务定位器
```

## 2. 核心组件

### 2.1 ServiceDescriptor

```python
class ServiceDescriptor:
    def __init__(
        self,
        service_type: Type,
        implementation: Union[Type, Callable],
        lifetime: ServiceLifetime = ServiceLifetime.SINGLETON,
        dependencies: Optional[List[Type]] = None,
    ):
        self.service_type = service_type
        self.implementation = implementation
        self.lifetime = lifetime
        self.dependencies = dependencies or []
        self._instance: Optional[Any] = None
        self._lock = threading.Lock()
```

职责：
- 存储服务注册信息
- 管理单例实例缓存
- 线程安全的实例创建

### 2.2 ServiceContainer

```python
class ServiceContainer:
    def __init__(self):
        self._services: Dict[Type, ServiceDescriptor] = {}
        self._lock = threading.Lock()
        self._resolving: Set[Type] = set()
        self._build_order: List[Type] = []
```

核心数据结构：
- `_services`：已注册服务字典
- `_resolving`：正在解析的服务集合（用于循环检测）
- `_build_order`：解析顺序（用于错误信息）

### 2.3 ServiceLocator

```python
class ServiceLocator:
    _container: Optional[ServiceContainer] = None
    _lock = threading.Lock()
```

全局服务定位器，单例模式。

## 3. 注册流程

```
register_singleton(ICache, RedisCache)
        │
        ▼
ServiceDescriptor(
    service_type=ICache,
    implementation=RedisCache,
    lifetime=ServiceLifetime.SINGLETON,
    dependencies=[]
)
        │
        ▼
self._services[ICache] = descriptor
```

## 4. 解析流程

```
container.get(IService)
        │
        ▼
descriptor = _services.get(IService)
        │
        ├─── None ──► KeyError
        │
        ▼
service_type in _resolving?
        │
        ├─── YES ──► CircularDependencyException
        │
        ▼
_resolving.add(IService)
        │
        ▼
descriptor.lifetime == SINGLETON?
        │
        ├─── YES
        │        │
        │        ├─── _instance exists? ── YES ──► 返回 _instance
        │        │
        │        └─── NO ──► _create_instance() ──► 缓存并返回
        │
        └─── NO ──► _create_instance() ──► 返回新实例
        │
        ▼
_resolving.discard(IService)
```

## 5. 循环依赖检测

### 5.1 检测机制

```python
def _detect_cycle(self, service_type: Type, path: Optional[List[str]] = None) -> bool:
    if path is None:
        path = []

    path = path + [service_type.__name__]

    if service_type in self._resolving:
        raise CircularDependencyException(path)

    descriptor = self._services.get(service_type)
    if descriptor is None:
        return False

    for dep in descriptor.dependencies:
        if dep in path:
            raise CircularDependencyException(path + [dep.__name__])
        self._detect_cycle(dep, path)

    return False
```

### 5.2 循环依赖示例

```
A → B → C → A  (循环)

当解析 A 时:
1. _resolving = {A}
2. 尝试解析 B
3. _resolving = {A, B}
4. 尝试解析 C
5. _resolving = {A, B, C}
6. C 依赖 A，但 A 在 _resolving 中
7. 抛出 CircularDependencyException
```

## 6. 依赖解析

```python
def _resolve_instance(self, descriptor: ServiceDescriptor) -> Any:
    deps = {}
    for dep_type in descriptor.dependencies:
        if dep_type in self._services:
            deps[dep_type] = self.get(dep_type)

    impl = descriptor.implementation
    if callable(impl):
        if descriptor.dependencies:
            try:
                return impl(**deps)
            except TypeError:
                return impl()
        return impl()
    return impl
```

## 7. 线程安全

### 7.1 双重检查锁定

```python
if descriptor.lifetime == ServiceLifetime.SINGLETON:
    if descriptor._instance is None:
        with self._lock:
            if descriptor._instance is None:
                descriptor._instance = self._resolve_instance(descriptor)
    return descriptor._instance
```

### 7.2 容器级别锁

```python
def register_singleton(...):
    with self._lock:
        self._services[service_type] = descriptor
    return self
```

## 8. 数据流图

```
┌─────────────────────────────────────────────────────────────────┐
│                         ServiceLocator                           │
│              (全局访问点，类方法封装)                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       ServiceContainer                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    _lock (threading.Lock)               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                _services: Dict[Type, Descriptor]        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │         _resolving: Set[Type] (循环检测)              │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      ServiceDescriptor                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  service_type: Type                                    │   │
│  │  implementation: Union[Type, Callable]                 │   │
│  │  lifetime: ServiceLifetime                            │   │
│  │  dependencies: List[Type]                              │   │
│  │  _instance: Optional[Any] (单例缓存)                   │   │
│  │  _lock: threading.Lock                                │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## 9. 依赖关系

```
container.py
│
├── threading (标准库)
├── typing (标准库)
├── enum (标准库)
│
└── 无外部依赖
```
