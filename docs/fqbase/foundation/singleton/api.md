# API 参考

## singleton 模块

`FQBase.Foundation.singleton` 模块提供线程安全的单例模式实现。

---

## SingletonMeta 元类

单例元类，控制类的实例化行为。

```python
class SingletonMeta(type):
    def __new__(mcs, name, bases, namespace, **kwargs)
    def __call__(cls, *args, **kwargs) -> Any
    def reset_singleton(cls) -> None
    def get_instance(cls) -> Optional[Any]
    def has_instance(cls) -> bool
```

### `__new__`

创建类时初始化单例相关属性。

```python
def __new__(mcs, name, bases, namespace, **kwargs) -> type
```

**参数:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `mcs` | `SingletonMeta` | 元类实例 |
| `name` | `str` | 类名 |
| `bases` | `Tuple[type, ...]` | 基类元组 |
| `namespace` | `dict` | 类命名空间 |
| `**kwargs` | - | 其他关键字参数 |

**返回值:** 新创建的类

**行为:**

- 初始化 `_singleton_lock = threading.Lock()`
- 初始化 `_singleton_instance = None`

---

### `__call__`

控制实例创建，实现双检查锁定。

```python
def __call__(cls, *args, **kwargs) -> Any
```

**参数:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `*args` | - | 传递给 `__init__` 的位置参数 |
| `**kwargs` | - | 传递给 `__init__` 的关键字参数 |

**返回值:** 单例实例

**行为:**

1. 检查实例是否已存在（快速路径）
2. 获取锁
3. 再次检查实例是否已创建（双重检查）
4. 创建实例并存储
5. 返回实例

---

### `reset_singleton`

重置单例实例，用于测试隔离。

```python
def reset_singleton(cls) -> None
```

**行为:**

- 在锁保护下将 `_singleton_instance` 设为 `None`
- 下次调用类时将创建新实例

**示例:**

```python
@singleton
class Config:
    def __init__(self):
        self.value = 0

config1 = Config()
config1.value = 10

Config.reset_singleton()

config2 = Config()
assert config2.value == 0  # 新实例
assert config1.value == 10  # 旧实例仍然存在
```

---

### `get_instance`

获取当前单例实例，不创建新实例。

```python
def get_instance(cls) -> Optional[Any]
```

**返回值:**

| 值 | 说明 |
|----|------|
| 实例对象 | 如果已创建 |
| `None` | 如果尚未创建 |

**示例:**

```python
@singleton
class Service:
    pass

Service.get_instance()  # None

service = Service()
Service.get_instance()  # service
```

---

### `has_instance`

检查单例实例是否已存在。

```python
def has_instance(cls) -> bool
```

**返回值:** `bool` - 是否已创建实例

**示例:**

```python
@singleton
class Cache:
    pass

Cache.has_instance()  # False

cache = Cache()
Cache.has_instance()  # True
```

---

## 类属性

### `_singleton_lock`

```python
_singleton_lock: threading.Lock
```

线程锁，用于保护实例创建过程。每个单例类有独立的锁。

---

### `_singleton_instance`

```python
_singleton_instance: Optional[Any] = None
```

存储单例实例。`None` 表示尚未创建。

---

## `singleton` 装饰器

单例装饰器，为类添加单例行为。

```python
@singleton
class MyClass:
    pass
```

**等价于:**

```python
class MyClass:
    pass

MyClass = singleton(MyClass)
```

### 函数签名

```python
def singleton(cls: type) -> type
```

**参数:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `cls` | `type` | 要装饰的类 |

**返回值:** 使用 `SingletonMeta` 作为元类的新类 |

**保留的元信息:**

- `__name__`
- `__qualname__`
- `__doc__`

### 使用示例

```python
@singleton
class DatabaseConnection:
    def __init__(self, host="localhost", port=5432):
        self.host = host
        self.port = port

# 获取单例
db1 = DatabaseConnection(host="db1.example.com")
db2 = DatabaseConnection(host="db2.example.com")  # 忽略参数

assert db1 is db2  # True
assert db1.host == "db1.example.com"  # True
assert db2.host == "db1.example.com"  # True
```

### 警告：参数忽略

单例模式会忽略后续调用的所有参数，因为实例已存在：

```python
@singleton
class Service:
    def __init__(self, name):
        self.name = name

s1 = Service("first")
s2 = Service("second")  # name="second" 被忽略

assert s1.name == "first"  # True
assert s2.name == "first"  # True
```

---

## 直接使用元类

### 语法

```python
class MyClass(metaclass=SingletonMeta):
    pass
```

### 等价性

```python
@singleton
class MyClass:
    pass

# 等价于

class MyClass(metaclass=SingletonMeta):
    pass
```

### 选择建议

| 方式 | 适用场景 |
|------|----------|
| `@singleton` | 简单场景，装饰器风格 |
| `metaclass=` | 需要明确元类身份，IDE 提示更好 |

---

## 类型注解

```python
from typing import Any, Optional

class SingletonMeta(type):
    _singleton_lock: threading.Lock
    _singleton_instance: Optional[Any]

    def __new__(mcs, name, bases, namespace, **kwargs) -> type: ...
    def __call__(cls, *args, **kwargs) -> Any: ...
    def reset_singleton(cls) -> None: ...
    def get_instance(cls) -> Optional[Any]: ...
    def has_instance(cls) -> bool: ...

def singleton(cls: type) -> type: ...
```

---

## 继承限制

使用 `@singleton` 装饰的类，其子类也会继承单例行为（除非子类也使用装饰器）：

```python
@singleton
class Base:
    pass

class Child(Base):
    pass

b = Base()
c = Child()
assert b is c  # True，子类共享父类单例
```

**如果需要子类独立的单例：**

```python
@singleton
class Base:
    pass

@singleton
class Child(Base):
    pass

b = Base()   # 实例 1
c = Child()  # 实例 2
```
