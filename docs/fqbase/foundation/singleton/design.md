# 设计决策

## 为什么使用元类而非装饰器实现单例?

### 方案对比

```python
# 方案 A: 元类实现 (采用)
class SingletonMeta(type):
    def __call__(cls, *args, **kwargs):
        ...

@singleton
class MyClass:
    pass

# 方案 B: __new__ 重写
class MyClass:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

# 方案 C: 模块级单例
_singleton_instance = None

def get_singleton():
    global _singleton_instance
    if _singleton_instance is None:
        _singleton_instance = MyClass()
    return _singleton_instance
```

### 选择元类的原因

| 特性 | 元类 | `__new__` | 模块级 |
|------|------|-----------|--------|
| 线程安全内置 | ✅ | ❌ | ❌ |
| 可重置 | ✅ | ❌ | ❌ |
| 非侵入 | ✅ | ❌ | ✅ |
| 可继承 | ✅ | ❌ | ❌ |
| 代码简洁 | ✅ | ❌ | ✅ |

**决策:** 元类方案在所有维度都是最优选择。

---

## 为什么需要双检查锁定?

### 单检查的问题

```python
# 单检查实现
def __call__(cls, *args, **kwargs):
    with cls._singleton_lock:
        if cls._singleton_instance is None:
            cls._singleton_instance = super().__call__(*args, **kwargs)
    return cls._singleton_instance

# 问题：每次调用都要获取锁
# 即使实例已创建，仍需加锁、解锁
```

### 双检查优势

```python
# 双检查实现 (采用)
def __call__(cls, *args, **kwargs):
    if cls._singleton_instance is None:          # 快速路径
        with cls._singleton_lock:
            if cls._singleton_instance is None:  # 确认
                cls._singleton_instance = super().__call__(*args, **kwargs)
    return cls._singleton_instance

# 优势：
# - 实例已创建时：无锁访问
# - 首次创建时：双检查确保正确
```

### 竞态条件分析

```
场景：两个线程同时首次创建单例

线程 A                          线程 B
─────────────────────────────────────────────────
check: instance is None ✓
                                check: instance is None ✓
acquire lock
check: instance is None ✓
create instance
release lock
                                acquire lock
                                check: instance is None (已创建!)
                                release lock (不创建)
return instance                 return existing instance ✓
```

**如果只用单检查:**

```
线程 A                          线程 B
─────────────────────────────────────────────────
acquire lock
check: instance is None ✓
create instance
release lock
                                acquire lock
                                check: instance is None (已创建!)
                                release lock
return instance                 return existing instance ✓

# 单检查在这种情况下也能工作，但性能较差
```

**关键竞态条件:**

```
线程 A                          线程 B
─────────────────────────────────────────────────
                                acquire lock
                                check: instance is None ✓
                                create instance (很慢)
                                release lock
check: instance is None? (YES! 但实例已创建!)
acquire lock
check: instance is None ✓ (再次检查确保)
create ANOTHER instance! ❌
```

**结论:** 双重检查是必要的，确保即使在高并发下也只创建一个实例。

---

## 为什么每个类有独立的锁?

### 共享锁的问题

```python
# 错误设计
_global_lock = threading.Lock()

class SingletonMeta(type):
    def __call__(cls, *args, **kwargs):
        with _global_lock:  # 所有单例共享同一把锁
            ...

# 问题：
# 1. 不相关的单例之间相互阻塞
# 2. 无法并发创建不同单例
# 3. 违反单一职责原则
```

### 独立锁优势

```python
# 正确设计
class SingletonMeta(type):
    def __new__(mcs, name, bases, namespace, **kwargs):
        cls = super().__new__(mcs, name, bases, namespace, **kwargs)
        cls._singleton_lock = threading.Lock()  # 每个类独立锁
        cls._singleton_instance = None
        return cls

# 优势：
# - 不同单例可并发创建
# - 只阻塞同一单例的并发访问
```

---

## 为什么装饰器保留元信息?

```python
def singleton(cls: type) -> type:
    class SingletonClass(cls, metaclass=SingletonMeta):
        pass

    SingletonClass.__name__ = cls.__name__
    SingletonClass.__qualname__ = cls.__qualname__
    SingletonClass.__doc__ = cls.__doc__
    return SingletonClass
```

### 不保留的后果

```python
@singleton
class DatabaseConnection:
    """数据库连接管理器"""
    pass

# 不保留元信息
print(DatabaseConnection.__name__)   # "SingletonClass"
print(DatabaseConnection.__qualname__)# "singleton.<locals>.SingletonClass"
print(DatabaseConnection.__doc__)     # None

# 问题：
# 1. 日志中显示 "SingletonClass" 而非 "DatabaseConnection"
# 2. 反射失效: getattr(DatabaseConnection, '__doc__') is None
# 3. 序列化/反序列化问题
```

### 保留后的效果

```python
# 保留元信息
print(DatabaseConnection.__name__)   # "DatabaseConnection"
print(DatabaseConnection.__qualname__)# "DatabaseConnection"
print(DatabaseConnection.__doc__)     # "数据库连接管理器"

# 优势：
# - 调试友好
# - 反射正常工作
# - 文档生成工具可用
```

---

## 为什么使用 threading.Lock 而非其他同步原语?

### 方案对比

| 原语 | 适用场景 | 选择原因 |
|------|----------|----------|
| `threading.Lock` | 互斥访问 | 简单、高效 |
| `threading.RLock` | 可重入互斥 | 不需要重入 |
| `threading.Semaphore` | 计数信号量 | 不需要计数 |
| `asyncio.Lock` | 异步互斥 | 同步上下文 |

**决策:** `threading.Lock` 是最简单的互斥锁，适合单例场景。

---

## 为什么使用 Optional[Any] 而非泛型?

```python
# 当前实现
_singleton_instance: Optional[Any] = None

# 为什么不使用 TypeVar?
T = TypeVar('T')

class SingletonMeta(type):
    _singleton_instance: Optional[T] = None  # ❌ 不工作

# 原因：
# 元类被多个不相关的类使用
# 无法为每个类单独绑定类型
```

**决策:** 使用 `Optional[Any]` 保持简单性和通用性。

---

## 为什么需要 reset_singleton?

### 测试隔离需求

```python
# 问题：单例在测试间保持状态
def test_1():
    service = SingletonService()
    service.state = "test1"
    assert service.state == "test1"

def test_2():
    service = SingletonService()
    # service.state 可能是 "test1"！(测试污染)

# 解决方案
def test_1():
    SingletonService.reset_singleton()
    service = SingletonService()
    service.state = "test1"
    assert service.state == "test1"

def test_2():
    SingletonService.reset_singleton()  # 清理
    service = SingletonService()
    assert service.state is None  # 干净的
```

### 为什么不自动重置?

```python
# 不推荐的设计
class SingletonMeta(type):
    def __call__(cls, *args, **kwargs):
        instance = cls._singleton_instance
        if instance is not None:
            # 自动重置？这会导致不可预测行为
            cls._singleton_instance = None
        ...
```

**决策:** 手动调用 `reset_singleton()` 更明确，避免意外状态丢失。

---

## 为什么没有使用 Borg 模式?

### Borg 模式（另一个单例实现）

```python
# Borg 模式：所有实例共享同一状态
class Borg:
    _shared_state = {}

    def __init__(self):
        self.__dict__ = self._shared_state

b1 = Borg()
b2 = Borg()
b1.value = 42
print(b2.value)  # 42
assert b1 is not b2  # True！但行为像单例
```

### 对比

| 特性 | 单例（采用） | Borg |
|------|-------------|------|
| `obj1 is obj2` | True | False |
| `obj1 == obj2` | True | True |
| 可替换实例 | ❌ | ✅ |
| 适用场景 | 需要唯一实例 | 需要共享状态 |

**决策:** FQBase 选择经典单例模式，因为更直观、更符合语义。

---

## 与其他实现的权衡

### vs tenacify

```python
# tenacify 的单例
from tenacify.decorators import singleton

@singleton
class MyClass:
    pass

# FQBase 优势：
# 1. 独立模块，无依赖
# 2. 包含测试工具 (reset_singleton)
# 3. 元类实现更 Pythonic
```

### vs 双检查锁定装饰器

```python
# 手动实现
def singleton(cls):
    instance = None
    lock = threading.Lock()

    @wraps(cls)
    def get_instance(*args, **kwargs):
        nonlocal instance
        if instance is None:
            with lock:
                if instance is None:
                    instance = cls(*args, **kwargs)
        return instance

    return get_instance

# 问题：
# 1. 实例和锁是闭包变量，可能泄漏
# 2. 无法定义类方法如 reset_singleton
# 3. 元类方案更优雅
```

---

## 设计总结

| 设计决策 | 选择 | 原因 |
|----------|------|------|
| 实现方式 | 元类 | 线程安全、可重置、非侵入 |
| 同步机制 | 双检查锁定 | 线程安全 + 高性能 |
| 锁粒度 | 类级别 | 不阻塞其他单例 |
| 元信息 | 保留 | 调试友好 |
| 重置方式 | 手动调用 | 明确、安全 |
