# 最佳实践

## 何时使用单例

### 推荐场景

| 场景 | 原因 |
|------|------|
| 全局配置 | 整个应用共享同一配置 |
| 日志记录器 | 统一日志输出 |
| 连接池 | 复用数据库/Redis 连接 |
| 缓存 | 全局共享缓存 |
| 线程池 | 复用线程资源 |

### 不推荐场景

| 场景 | 原因 | 替代方案 |
|------|------|----------|
| 全局可变状态 | 导致隐藏依赖 | 依赖注入 |
| 大范围数据共享 | 难以追踪修改 | 事件驱动 |
| 单元测试 | 难以隔离 | 接口 + Mock |
| 分布式环境 | 不跨进程 | 分布式缓存 |

---

## 设计原则

### 1. 保持单例简单

```python
# 推荐：单例只负责实例管理
@singleton
class ConnectionPool:
    def __init__(self):
        self._connections = []

    def get_connection(self):
        ...

# 不推荐：单例包含过多职责
@singleton
class DataManager:
    def __init__(self):
        self._db = None      # 数据库
        self._cache = {}      # 缓存
        self._config = {}     # 配置
        self._logger = None   # 日志

    # 太多职责！
```

### 2. 使用属性而非构造函数参数

```python
# 推荐：属性配置
@singleton
class Service:
    def __init__(self):
        self.timeout = 30
        self.retry_count = 3

    def configure(self, timeout=None, retry_count=None):
        if timeout is not None:
            self.timeout = timeout
        if retry_count is not None:
            self.retry_count = retry_count

# 使用
service = Service()
service.configure(timeout=60)
```

### 3. 避免在 __init__ 中执行耗时操作

```python
# 推荐：延迟初始化
@singleton
class HeavyService:
    def __init__(self):
        self._resource = None

    @property
    def resource(self):
        if self._resource is None:
            self._resource = self._load_heavy_resource()
        return self._resource
```

---

## 测试最佳实践

### 测试隔离模式

```python
import pytest

@singleton
class TestState:
    def __init__(self):
        self.data = {}

@pytest.fixture
def clean_state():
    TestState.reset_singleton()
    yield
    TestState.reset_singleton()

def test_something(clean_state):
    state = TestState()
    state.data["key"] = "value"
    assert state.data["key"] == "value"

def test_other(clean_state):
    state = TestState()
    assert "key" not in state.data  # 干净的 state
```

### Mock 单例

```python
from unittest.mock import patch

@singleton
class PaymentGateway:
    pass

def test_with_mock_gateway():
    PaymentGateway.reset_singleton()

    with patch.object(PaymentGateway, '__new__') as mock_new:
        mock_instance = MagicMock()
        mock_new.return_value = mock_instance

        gateway = PaymentGateway()
        mock_instance.process.assert_not_called()

        gateway.process(amount=100)
        mock_instance.process.assert_called_once_with(amount=100)
```

---

## 线程安全

### 双重检查锁定

```python
# SingletonMeta 已实现双检查锁定
# 不需要额外处理

@singleton
class ThreadSafeService:
    def __init__(self):
        self._lock = threading.Lock()

    def safe_operation(self):
        with self._lock:  # 额外的方法级锁
            ...
```

### 多线程使用场景

```python
import threading

@singleton
class Counter:
    def __init__(self):
        self._count = 0
        self._lock = threading.Lock()

    def increment(self):
        with self._lock:
            self._count += 1

def worker():
    for _ in range(1000):
        Counter().increment()

threads = [threading.Thread(target=worker) for _ in range(10)]
for t in threads:
    t.start()
for t in threads:
    t.join()

# 正确结果：10000
print(Counter()._count)
```

---

## 命名规范

### 推荐命名

```python
@singleton
class ConfigManager:
    """全局配置管理器"""
    pass

@singleton
class DatabaseConnectionPool:
    """数据库连接池"""
    pass

@singleton
class RedisClient:
    """Redis 客户端单例"""
    pass
```

### 避免的命名

```python
# 过于通用的名称
@singleton
class Manager:  # Manager 什么？
    pass

@singleton
class Handler:  # Handler 处理什么？
    pass

@singleton
class Data:  # Data 什么数据？
    pass
```

---

## 反模式

### 1. 全局可变状态

```python
# 反模式
@singleton
class GlobalState:
    def __init__(self):
        self.users = []  # 可变全局状态
        self.requests = {}  # 难以追踪

# 多个模块修改 users，导致难以调试的问题
```

**替代方案:**

```python
# 使用不可变数据类
@dataclass
class UserState:
    user_id: str
    session_id: str

# 或使用事件驱动
class UserStateManager:
    def __init__(self):
        self._states = {}

    def update(self, user_id, state):
        event = StateChangeEvent(user_id, state)
        event_bus.publish(event)
```

### 2. 单例过度使用

```python
# 反模式：到处都是单例
@singleton
class UserService:
    pass

@singleton
class OrderService:
    pass

@singleton
class ProductService:
    pass

@singleton
class PaymentService:
    pass

# 问题：难以测试，难以替换实现

# 替代方案：依赖注入
class OrderService:
    def __init__(self, user_service, product_service):
        self.user_service = user_service
        self.product_service = product_service
```

### 3. 在单例中存储请求级数据

```python
# 反模式
@singleton
class RequestContext:
    def __init__(self):
        self.current_user = None  # 每个请求不同！

# 多线程环境下会混乱

# 替代方案：请求上下文存储在 thread-local 或 contextvars
import contextvars

_current_user = contextvars.ContextVar('current_user')

def set_user(user):
    _current_user.set(user)

def get_user():
    return _current_user.get()
```

---

## 调试技巧

### 查看当前实例

```python
@singleton
class DebugDemo:
    def __init__(self):
        self.instance_id = id(self)

    def __repr__(self):
        return f"<DebugDemo(id={self.instance_id})>"

demo = DebugDemo()
print(demo)  # <DebugDemo(id=140234567890)>

# 检查是否是同一实例
demo2 = DebugDemo()
print(demo is demo2)  # True
```

### 日志记录

```python
import logging

logger = logging.getLogger(__name__)

@singleton
class LoggedSingleton:
    def __init__(self):
        logger.debug(f"Creating singleton instance: {id(self)}")

    def __del__(self):
        logger.debug(f"Destroying singleton instance: {id(self)}")
```

---

## 性能考量

### 锁竞争

```python
# SingletonMeta 使用双检查锁定
# 首次创建后，无锁访问

# 如果有大量并发获取单例实例
@singleton
class FrequentlyAccessed:
    pass

# 建议：保持 __init__ 简单快速
```

### 内存占用

```python
# 每个单例类占用:
# - 类对象 ~1KB
# - 实例对象 ~取决于实例大小
# - 锁对象 ~几十字节

# 不需要创建过多单例
# 只为真正需要全局唯一性的资源创建单例
```

---

## 迁移指南

### 从全局变量迁移

```python
# 旧代码
_database_connection = None

def get_database():
    global _database_connection
    if _database_connection is None:
        _database_connection = create_connection()
    return _database_connection

# 新代码
@singleton
class Database:
    @classmethod
    def get_connection(cls):
        return cls.get_instance()

# 使用
db = Database.get_connection()
```

### 从工厂函数迁移

```python
# 旧代码
_connection_instance = None

def get_connection():
    global _connection_instance
    if _connection_instance is None:
        _connection_instance = Connection()
    return _connection_instance

# 新代码
@singleton
class Connection:
    pass

# 使用
conn = Connection()
```
