# 架构设计

## 模块结构

```
singleton.py
├── SingletonMeta (元类)
│   ├── __new__
│   ├── __call__ (实例创建控制)
│   ├── reset_singleton()
│   ├── get_instance()
│   └── has_instance()
│
└── singleton (装饰器函数)
    └── 创建 SingletonClass
```

---

## 类图

```
┌─────────────────────────────────────────────────────────────────┐
│                        SingletonMeta                            │
│                        (metaclass)                             │
├─────────────────────────────────────────────────────────────────┤
│  + _singleton_lock: threading.Lock                              │
│  + _singleton_instance: Optional[Any] = None                    │
├─────────────────────────────────────────────────────────────────┤
│  + __new__(mcs, name, bases, namespace, **kwargs): type         │
│  + __call__(cls, *args, **kwargs): Any                          │
│  + reset_singleton(cls) -> None                                 │
│  + get_instance(cls) -> Optional[Any]                            │
│  + has_instance(cls) -> bool                                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ creates
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       singleton (decorator)                     │
├─────────────────────────────────────────────────────────────────┤
│  Input:  cls: type                                              │
│  Output: SingletonClass (with SingletonMeta as metaclass)      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ decorates
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     SingletonClass                              │
│                     (user's class)                               │
├─────────────────────────────────────────────────────────────────┤
│  (inherits from decorated class)                               │
│  (uses SingletonMeta as metaclass)                              │
│  (preserves __name__, __qualname__, __doc__)                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 实例创建流程

```
Client 调用 MyClass()
        │
        ▼
┌───────────────────────────┐
│ MyClass.__call__()        │
│ (由 SingletonMeta 定义)   │
└───────────┬───────────────┘
            │
            ▼
┌───────────────────────────┐
│ _singleton_instance      │
│ is None?                  │
└───────────┬───────────────┘
            │
     ┌──────┴──────┐
    Yes            No
     │              │
     ▼              ▼
┌─────────┐   ┌─────────────────┐
│ 获取锁   │   │ 返回已有实例     │
└────┬────┘   └─────────────────┘
     │
     ▼
┌───────────────────────────┐
│ _singleton_instance      │
│ is None? (再次检查)        │
└───────────┬───────────────┘
            │
     ┌──────┴──────┐
    Yes            No
     │              │
     ▼              ▼
┌─────────┐   ┌─────────────────┐
│ 创建实例 │   │ 返回已有实例     │
└────┬────┘   └─────────────────┘
     │
     ▼
┌───────────────────────────┐
│ 调用 super().__call__()   │
│ 创建实际实例              │
└───────────┬───────────────┘
            │
            ▼
┌───────────────────────────┐
│ 存储到 _singleton_instance│
└───────────┬───────────────┘
            │
            ▼
┌───────────────────────────┐
│ 释放锁                    │
└───────────┬───────────────┘
            │
            ▼
┌───────────────────────────┐
│ 返回实例                  │
└───────────────────────────┘
```

---

## 重置流程

```
Client 调用 MyClass.reset_singleton()
        │
        ▼
┌───────────────────────────┐
│ 获取类锁                  │
└───────────┬───────────────┘
            │
            ▼
┌───────────────────────────┐
│ _singleton_instance =    │
│ None                     │
└───────────┬───────────────┘
            │
            ▼
┌───────────────────────────┐
│ 释放锁                    │
└───────────┬───────────────┘
            │
            ▼
┌───────────────────────────┐
│ 下次调用将创建新实例      │
└───────────────────────────┘
```

---

## 装饰器实现

```python
def singleton(cls: type) -> type:
    class SingletonClass(cls, metaclass=SingletonMeta):
        pass

    SingletonClass.__name__ = cls.__name__
    SingletonClass.__qualname__ = cls.__qualname__
    SingletonClass.__doc__ = cls.__doc__
    return SingletonClass
```

**执行步骤:**

```
@singleton 装饰器应用
        │
        ▼
┌───────────────────────────────────┐
│ 1. 创建新类 SingletonClass        │
│    - 继承原 cls                   │
│    - 使用 SingletonMeta 元类      │
└───────────┬───────────────────────┘
            │
            ▼
┌───────────────────────────────────┐
│ 2. 复制元信息                      │
│    __name__ = cls.__name__        │
│    __qualname__ = cls.__qualname__│
│    __doc__ = cls.__doc__          │
└───────────┬───────────────────────┘
            │
            ▼
┌───────────────────────────────────┐
│ 3. 返回 SingletonClass            │
│    (原类已被包装)                 │
└───────────────────────────────────┘
```

---

## 元类 `__new__` 实现

```python
def __new__(mcs, name, bases, namespace, **kwargs):
    cls = super().__new__(mcs, name, bases, namespace, **kwargs)
    cls._singleton_lock = threading.Lock()
    cls._singleton_instance = None
    return cls
```

**设计说明:**

1. `_singleton_lock`: 每个类独立的锁，支持多线程
2. `_singleton_instance`: 类属性存储单例实例
3. 在 `__new__` 初始化，而非 `__init__`，确保线程安全

---

## 并发安全性分析

### 竞态条件场景

```
线程 A                    线程 B
─────────────────────────────────────────
                          MyClass()
                          检查: instance is None ✓
                          获取锁
                          创建实例
                          释放锁
                          返回实例
MyClass()
检查: instance is None ✓
获取锁
检查: instance is None (已创建)
释放锁
返回已有实例 ✓
```

### 为什么每个类有独立锁?

```python
# 正确：类级别锁
class SingletonMeta(type):
    def __new__(mcs, name, bases, namespace, **kwargs):
        cls = super().__new__(mcs, name, bases, namespace, **kwargs)
        cls._singleton_lock = threading.Lock()  # 每个类独立
        cls._singleton_instance = None
        return cls

# 错误：共享锁（会导致死锁）
_global_lock = threading.Lock()  # 所有单例共享
```

---

## 继承行为

```python
@singleton
class Base:
    pass

class Child(Base):
    pass

b = Base()  # 单例实例
c = Child()  # 同样是单例实例
assert b is c  # True
```

**原因:** `Child` 没有使用 `@singleton` 装饰器，但继承了 `Base`，而 `Base` 使用了 `SingletonMeta` 作为元类。

**注意:** 如果希望子类也有独立的单例，需要单独装饰：

```python
@singleton
class Base:
    pass

@singleton
class Child(Base):
    pass

b = Base()   # 实例 1
c = Child()  # 实例 2 (不同单例)
assert b is not c  # True
```
