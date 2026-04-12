# FAQ

## 基础问题

### Q: 单例模式是什么？

单例模式（Singleton Pattern）是一种创建型设计模式，确保一个类只有一个实例，并提供一个全局访问点。

```python
from FQBase.Foundation.singleton import singleton

@singleton
class Database:
    pass

db1 = Database()
db2 = Database()
assert db1 is db2  # True，始终是同一实例
```

---

### Q: 如何创建一个单例类？

有两种方式：

**方式一：使用装饰器（推荐）**

```python
from FQBase.Foundation.singleton import singleton

@singleton
class MySingleton:
    pass
```

**方式二：直接使用元类**

```python
from FQBase.Foundation.singleton import SingletonMeta

class MySingleton(metaclass=SingletonMeta):
    pass
```

---

### Q: singleton 模块是线程安全的吗？

是的，singleton 模块使用双检查锁定（Double-Checked Locking）模式，确保在多线程环境下只创建一个实例。

```python
import threading
from FQBase.Foundation.singleton import singleton

@singleton
class ThreadSafeDemo:
    pass

# 多个线程同时调用
threads = [threading.Thread(target=lambda: ThreadSafeDemo()) for _ in range(10)]
for t in threads:
    t.start()
# 所有线程获得同一实例
```

---

## 使用问题

### Q: 如何重置单例实例？

使用 `reset_singleton()` 方法重置实例，用于测试隔离：

```python
@singleton
class Config:
    def __init__(self):
        self.value = 0

config1 = Config()
config1.value = 100

Config.reset_singleton()  # 重置

config2 = Config()
assert config2.value == 0  # 新实例，默认值
assert config1.value == 100  # 旧实例仍存在
```

**注意**：是 `类.reset_singleton()`，不是 `实例.reset_singleton()`

---

### Q: 为什么参数被忽略了？

单例模式只使用首次创建的参数，后续调用会忽略参数：

```python
@singleton
class Service:
    def __init__(self, timeout=30):
        self.timeout = timeout

s1 = Service(timeout=60)  # timeout=60 生效
s2 = Service(timeout=10)   # timeout=10 被忽略

assert s1.timeout == 60
assert s2.timeout == 60   # 始终是首次的值
```

**解决方案**：使用属性配置

```python
s1 = Service()
s1.timeout = 10  # 修改属性

s2 = Service()
assert s2.timeout == 10  # 同一实例，属性已改变
```

---

### Q: 子类为什么会共享父类的单例？

使用 `@singleton` 装饰的类，其子类默认继承单例行为：

```python
@singleton
class Base:
    pass

class Child(Base):
    pass

b = Base()
c = Child()
assert b is c  # True - 子类共享父类单例
```

**如果需要子类有独立的单例**，单独为子类添加装饰器：

```python
@singleton
class Base:
    pass

@singleton
class Child(Base):
    pass

b = Base()   # 实例 1
c = Child()  # 实例 2（独立）
assert b is not c  # True
```

---

### Q: 如何检查单例实例是否存在？

```python
@singleton
class Service:
    pass

# 尚未创建
print(Service.has_instance())  # False
print(Service.get_instance())   # None

# 创建实例
service = Service()

print(Service.has_instance())  # True
print(Service.get_instance())   # <Service object at 0x...>
```

---

### Q: 单例类的 `__init__` 会被调用多次吗？

不会。`__init__` 只在首次创建实例时调用一次：

```python
call_count = 0

@singleton
class Tracked:
    def __init__(self):
        global call_count
        call_count += 1

obj1 = Tracked()
obj2 = Tracked()
obj3 = Tracked()

assert call_count == 1  # 只调用了一次
assert obj1 is obj2 is obj3  # 同一实例
```

---

## 测试问题

### Q: 如何在测试中隔离单例？

```python
import pytest

@singleton
class TestService:
    def __init__(self):
        self.data = {}

@pytest.fixture(autouse=True)
def reset_service():
    TestService.reset_singleton()
    yield
    TestService.reset_singleton()

def test_case_1():
    service = TestService()
    service.data["key"] = "value"
    assert service.data["key"] == "value"

def test_case_2():
    service = TestService()
    assert "key" not in service.data  # 干净的实例
```

---

### Q: 如何 Mock 单例？

```python
from unittest.mock import patch, MagicMock

@singleton
class PaymentGateway:
    def process(self, amount):
        return f"Processed {amount}"

def test_with_mock():
    PaymentGateway.reset_singleton()

    with patch.object(PaymentGateway, '__new__', return_value=MagicMock()) as mock_new:
        mock_gateway = MagicMock()
        mock_new.return_value = mock_gateway

        gateway = PaymentGateway()
        mock_gateway.process.assert_not_called()

        gateway.process(amount=100)
        mock_gateway.process.assert_called_once_with(amount=100)
```

---

## 设计问题

### Q: 什么时候应该使用单例？

**推荐使用单例的场景**：

| 场景 | 原因 |
|------|------|
| 全局配置 | 整个应用共享同一配置 |
| 日志记录器 | 统一日志输出 |
| 数据库连接池 | 复用连接资源 |
| 缓存 | 全局共享缓存 |
| 线程池 | 复用线程资源 |

**不推荐使用单例的场景**：

| 场景 | 原因 | 替代方案 |
|------|------|----------|
| 全局可变状态 | 难以追踪修改 | 依赖注入 |
| 单元测试 | 难以隔离 | 接口 + Mock |
| 分布式环境 | 不跨进程 | 分布式缓存 |
| 请求级数据 | 多线程混乱 | contextvars |

---

### Q: 单例和全局变量有什么区别？

| 特性 | 全局变量 | 单例模式 |
|------|----------|----------|
| 延迟初始化 | ❌ 需手动实现 | ✅ 自动 |
| 线程安全 | ❌ 需手动加锁 | ✅ 内置 |
| 可重置 | ❌ 不支持 | ✅ 支持 |
| 可测试 | ❌ 困难 | ✅ 容易 |
| 封装性 | ❌ 暴露全局名称 | ✅ 封装更好 |

---

### Q: 单例和 Borg 模式有什么区别？

```python
# 单例模式（singleton）
class Singleton:
    pass

s1 = Singleton()
s2 = Singleton()
assert s1 is s2  # True，同一实例

# Borg 模式
class Borg:
    _shared_state = {}

    def __init__(self):
        self.__dict__ = self._shared_state

b1 = Borg()
b2 = Borg()
assert b1 is b2  # False，不同实例
assert b1.value == b2.value  # True，共享状态
```

**选择建议**：
- 需要唯一实例 → 单例
- 需要共享状态 → Borg

---

### Q: 单例和依赖注入有什么区别？

```python
# 单例模式
@singleton
class Database:
    pass

db = Database()  # 全局访问

# 依赖注入
class Service:
    def __init__(self, db: Database):
        self.db = db

# 推荐在大型系统中使用依赖注入，便于测试和替换实现
```

**选择建议**：
- 基础设施层（数据库、缓存） → 单例
- 业务服务层 → 依赖注入

---

## 常见错误

### Q: 错误：实例状态在测试间污染

```python
# 问题：单例状态在测试间保持
def test_1():
    service = SingletonService()
    service.data = {"user": "Alice"}

def test_2():
    service = SingletonService()
    # service.data 是 test_1 设置的值（污染）

# 解决：在测试前重置单例
def test_1():
    SingletonService.reset_singleton()
    service = SingletonService()
    service.data = {"user": "Alice"}

def test_2():
    SingletonService.reset_singleton()  # 重置
    service = SingletonService()
    assert service.data == {}  # 干净的状态
```

---

### Q: 错误：在多线程中创建单例时死锁

`singleton` 模块已经处理了线程安全问题，但如果在单例类内部使用了不当的锁逻辑，可能导致死锁：

```python
# 错误示例：单例类内部使用递归锁可能出问题
@singleton
class Problematic:
    def __init__(self):
        self._lock = threading.RLock()  # 可能导致死锁

    def method(self):
        with self._lock:
            self.method()  # 递归调用
```

```python
# 正确示例：使用普通锁
@singleton
class Correct:
    def __init__(self):
        self._lock = threading.Lock()

    def method(self):
        with self._lock:
            pass
```

---

### Q: 错误：忘记了装饰器顺序

```python
# 错误：装饰器顺序可能导致问题
@singleton
@dataclass
class Config:
    name: str

# 解决：确保单例装饰器在最外层
@dataclass
@singleton
class Config:
    name: str
```

---

## 相关文档

- [API 参考](api.md)
- [使用指南](usage.md)
- [开发指南](development.md)
- [最佳实践](best-practices.md)
- [架构设计](architecture.md)
- [设计决策](design.md)