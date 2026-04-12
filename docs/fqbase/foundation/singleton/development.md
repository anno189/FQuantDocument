# Singleton 开发指南

## 模块简介

`singleton` 模块提供线程安全的单例模式实现，使用元类（Metaclass）确保类只有一个实例。

### 核心组件

| 组件 | 说明 |
|------|------|
| `SingletonMeta` | 单例元类，控制实例创建行为 |
| `singleton` | 单例装饰器 |
| `reset_singleton()` | 重置单例实例（测试隔离） |
| `get_instance()` | 获取当前实例（不创建） |
| `has_instance()` | 检查实例是否存在 |

---

## 开发环境

### 环境要求

- Python 3.8+
- pytest（用于测试）

### 安装

```bash
cd /Users/A.D.189/FQuant/FQuant.Server/FQBase
pip install -e .
```

### 验证安装

```bash
python -c "from FQBase.Foundation.singleton import singleton; print('OK')"
```

---

## 本地调试

### 基本调试流程

```python
from FQBase.Foundation.singleton import singleton

@singleton
class DebugDemo:
    def __init__(self):
        self.value = None

# 设置断点
demo = DebugDemo()
demo.value = "test"

# 验证单例行为
demo2 = DebugDemo()
assert demo is demo2  # 断点检查：应为同一实例
```

### 调试单例状态

```python
from FQBase.Foundation.singleton import singleton, SingletonMeta

@singleton
class Service:
    pass

# 检查单例状态
print(f"has_instance: {Service.has_instance()}")  # False
print(f"get_instance: {Service.get_instance()}")  # None

# 创建实例
service = Service()
print(f"has_instance: {Service.has_instance()}")  # True
print(f"get_instance: {Service.get_instance() is service}")  # True

# 检查内部属性
print(f"_singleton_instance: {Service._singleton_instance}")
print(f"_singleton_lock: {Service._singleton_lock}")
```

### 线程调试

```python
import threading
from FQBase.Foundation.singleton import singleton

@singleton
class ThreadSafeDemo:
    def __init__(self):
        self.thread_id = threading.get_ident()

# 多线程测试
def check_singleton():
    demo = ThreadSafeDemo()
    print(f"Thread {threading.get_ident()}: {id(demo)}")

threads = [threading.Thread(target=check_singleton) for _ in range(5)]
for t in threads:
    t.start()
for t in threads:
    t.join()

# 所有线程应看到同一实例
```

---

## 测试指南

### 运行测试

```bash
cd /Users/A.D.189/FQuant/FQuant.Server/FQBase
pytest -v FQBase/Foundation/test_singleton.py
```

### 测试结构

```python
import pytest
from FQBase.Foundation.singleton import singleton

class TestSingletonBehavior:
    def test_same_instance(self):
        @singleton
        class Demo:
            pass

        d1 = Demo()
        d2 = Demo()
        assert d1 is d2

    def test_reset(self):
        @singleton
        class Demo:
            pass

        d1 = Demo()
        Demo.reset_singleton()
        d2 = Demo()
        assert d1 is not d2
```

### 测试隔离

```python
import pytest

@pytest.fixture
def clean_singleton():
    """每个测试前重置单例"""
    SomeSingleton.reset_singleton()
    yield
    SomeSingleton.reset_singleton()

def test_with_isolation(clean_singleton):
    service = SomeSingleton()
    service.value = "test"
    assert service.value == "test"

def test_without_pollution(clean_singleton):
    service = SomeSingleton()
    assert not hasattr(service, 'value')  # 干净的实例
```

### 并发测试

```python
import threading
import pytest

def test_concurrent_creation():
    @singleton
    class ConcurrentDemo:
        def __init__(self):
            pass

    results = []

    def create_instance():
        instance = ConcurrentDemo()
        results.append(instance)

    threads = [threading.Thread(target=create_instance) for _ in range(10)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()

    # 所有线程应获得同一实例
    assert len(set(results)) == 1
```

---

## 代码规范

### 类命名

```python
# 推荐：明确职责的命名
@singleton
class DatabaseConnection:
    """数据库连接管理器"""
    pass

@singleton
class ConfigService:
    """配置服务"""
    pass

# 避免：过于通用的命名
@singleton
class Manager:  # 什么 Manager？
    pass

@singleton
class Handler:  # 什么 Handler？
    pass
```

### 文档字符串

```python
@singleton
class DatabaseConnection:
    """数据库连接管理器

    全局唯一的数据库连接实例，负责管理连接生命周期。

    Attributes:
        host: 数据库主机地址
        port: 数据库端口
        connected: 是否已连接
    """
    def __init__(self, host="localhost", port=5432):
        self.host = host
        self.port = port
        self.connected = False
```

### 线程安全实现

```python
# 如果单例类内部有共享状态，必须加锁
@singleton
class SharedResource:
    def __init__(self):
        self._lock = threading.Lock()
        self._data = {}

    def safe_update(self, key, value):
        with self._lock:
            self._data[key] = value
```

---

## 调试技巧

### 查看实例 ID

```python
@singleton
class DebugDemo:
    def __init__(self):
        self.instance_id = id(self)

    def __repr__(self):
        return f"<DebugDemo(id={self.instance_id})>"

demo1 = DebugDemo()
demo2 = DebugDemo()

print(f"demo1: {demo1}")  # <DebugDemo(id=140234567890)>
print(f"demo2: {demo2}")  # <DebugDemo(id=140234567890)>
print(f"同一实例: {demo1 is demo2}")  # True
```

### 跟踪实例创建

```python
import logging

logger = logging.getLogger(__name__)

@singleton
class TrackedDemo:
    def __init__(self):
        logger.debug(f"创建单例实例: {id(self)}")

    def __del__(self):
        logger.debug(f"销毁单例实例: {id(self)}")
```

### 使用 get_instance 检查

```python
@singleton
class Service:
    pass

# 尚未创建
assert Service.get_instance() is None

# 创建实例
service = Service()
assert Service.get_instance() is service

# 验证是同一实例
assert Service.get_instance() is Service()
```

---

## 常见问题

### Q: 单例实例没有按预期重置

```python
# 确保正确调用重置方法
SomeSingleton.reset_singleton()  # 不是 SomeSingleton().reset_singleton()

# 重置后立即创建新实例
service = SomeSingleton()
```

### Q: 子类继承了单例行为但不符合预期

```python
@singleton
class Base:
    pass

class Child(Base):
    pass

b = Base()
c = Child()
assert b is c  # True - 子类共享父类单例

# 如果需要子类独立的单例
@singleton
class Child(Base):
    pass  # 单独装饰
```

### Q: 参数被忽略

```python
@singleton
class Service:
    def __init__(self, timeout=30):
        self.timeout = timeout

s1 = Service(timeout=60)  # timeout=60 生效
s2 = Service(timeout=10)  # timeout=10 被忽略

assert s1.timeout == 60
assert s2.timeout == 60  # 始终是首次的值

# 解决方案：使用属性配置
s1.timeout = 10
assert s2.timeout == 10  # 同一实例，属性已改变
```

### Q: 多线程环境下行为异常

```python
# 确保使用线程锁保护共享状态
@singleton
class ThreadUnsafeResource:
    def __init__(self):
        self._lock = threading.Lock()
        self._counter = 0

    def increment(self):
        with self._lock:
            self._counter += 1
```

---

## 相关文档

- [API 参考](api.md)
- [使用指南](usage.md)
- [最佳实践](best-practices.md)
- [架构设计](architecture.md)
- [设计决策](design.md)