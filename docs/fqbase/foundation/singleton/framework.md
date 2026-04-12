# 框架文档

## 单例模式框架

### 核心概念

单例模式（Singleton Pattern）是一种创建型设计模式，确保一个类只有一个实例，并提供一个全局访问点。

```
┌─────────────────────────────────────────────┐
│           常规类 vs 单例类                   │
├─────────────────────────────────────────────┤
│                                             │
│   常规类                                    │
│   ┌─────────┐  ┌─────────┐                │
│   │ Class() │  │ Class() │                │
│   │ obj1    │  │ obj2    │                │
│   └─────────┘  └─────────┘                │
│   obj1 != obj2 (不同实例)                  │
│                                             │
│   单例类                                    │
│   ┌─────────┐                              │
│   │ Class() │                              │
│   │ obj1 ───┼── obj2 (同一实例)            │
│   └─────────┘                              │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 实现策略对比

### 1. 装饰器模式（采用）

```python
@singleton
class MyClass:
    pass
```

**优势:**

- 声明式，使用直观
- 非侵入式，不修改类本身
- 可叠加其他装饰器
- 元信息自动传递

**实现原理:**

```python
def singleton(cls: type) -> type:
    class SingletonClass(cls, metaclass=SingletonMeta):
        pass
    # 保留元信息
    SingletonClass.__name__ = cls.__name__
    SingletonClass.__qualname__ = cls.__qualname__
    return SingletonClass
```

### 2. 元类直接使用

```python
class DatabaseConnection(metaclass=SingletonMeta):
    pass
```

**优势:**

- 无装饰器开销
- IDE 支持更好

**劣势:**

- 语法不如装饰器直观
- 无法叠加其他类装饰器

### 3. 替代方案

| 方案 | 线程安全 | 可重置 | 简洁性 | FQBase 采用 |
|------|---------|--------|--------|-------------|
| 模块级变量 | ❌ | ❌ | ✅ | ❌ |
| 函数闭包 | ❌ | ❌ | ✅ | ❌ |
| `__new__` 重写 | ✅ | ❌ | ✅ | ❌ |
| 元类（采用） | ✅ | ✅ | ✅ | ✅ |
| Borg 模式 | ✅ | ✅ | ❌ | ❌ |

---

## 线程安全机制

### 双检查锁定（Double-Checked Locking）

```python
def __call__(cls, *args, **kwargs):
    if cls._singleton_instance is None:      # 检查 1
        with cls._singleton_lock:              # 获取锁
            if cls._singleton_instance is None:  # 检查 2
                cls._singleton_instance = super().__call__(*args, **kwargs)
    return cls._singleton_instance
```

**为什么需要双重检查?**

```
线程 A ──┬── 检查 1: instance is None ✓
         │
         └── 获取锁 ── 创建实例 ── 释放锁

线程 B ──┬── 检查 1: instance is None? (可能已创建)
         │
         └── 如果无检查 2: 会再次创建实例！
```

**不使用双检查的代价:**

```python
# 不正确的实现
def __call__(cls, *args, **kwargs):
    with cls._singleton_lock:  # 每次调用都加锁
        if cls._singleton_instance is None:
            cls._singleton_instance = super().__call__(*args, **kwargs)
    return cls._singleton_instance

# 问题：所有线程都要等待锁
# 1000 次调用 = 1000 次加锁/解锁操作
```

**双检查的优势:**

```python
# 正确的实现
def __call__(cls, *args, **kwargs):
    if cls._singleton_instance is None:      # 快速路径：无锁检查
        with cls._singleton_lock:
            if cls._singleton_instance is None:
                cls._singleton_instance = ...
    return cls._singleton_instance

# 性能优化：
# - 首次创建：1 次检查 + 1 次加锁
# - 后续调用：1 次检查（无锁）
```

---

## 重置机制

### 测试隔离

```python
@singleton
class Config:
    def __init__(self):
        self.debug = False
        self.env = "production"

# 正常流程
config1 = Config()
config1.debug = True
config2 = Config()
assert config2.debug is True  # 同一实例

# 测试隔离
Config.reset_singleton()
config3 = Config()
assert config3.debug is False  # 新实例，默认值
```

### 重置检查流程

```
reset_singleton() 调用
        │
        ▼
┌───────────────────┐
│ 获取类锁          │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ instance = None  │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ 释放锁            │
└────────┬──────────┘
         │
         ▼
    重置完成
```

---

## 实例查询

### 获取实例（不创建）

```python
@singleton
class Service:
    pass

# 尚未创建
instance = Service.get_instance()  # None

# 创建实例
obj = Service()

# 已创建
instance = Service.get_instance()  # obj
```

### 检查实例存在

```python
@singleton
class Cache:
    pass

Cache.has_instance()  # False

cache = Cache()

Cache.has_instance()  # True
```

---

## 元类层级

```
type  (Python 内置)
  │
  │  (被 SingletonMeta 继承)
  ▼
SingletonMeta
  │
  │  (被 SingletonClass 使用)
  ▼
SingletonClass  (装饰器生成的类)
  │
  │  (被用户类继承)
  ▼
YourClass  (如 DatabaseConnection)
```

---

## 与其他模式的关系

### 单例 vs 依赖注入

```python
# 单例模式
@singleton
class Database:
    pass

db = Database()  # 全局唯一

# 依赖注入
class Service:
    def __init__(self, db: Database):
        self.db = db

# 推荐在大型系统中使用依赖注入，便于测试
# 单例适用于基础设施层
```

### 单例 vs 全局变量

```python
# 全局变量（不推荐）
DATABASE = None

def init_db():
    global DATABASE
    DATABASE = Database()

# 单例（推荐）
@singleton
class Database:
    pass

# 优势：
# 1. 延迟初始化
# 2. 线程安全
# 3. 可重置
# 4. 封装更好
```
