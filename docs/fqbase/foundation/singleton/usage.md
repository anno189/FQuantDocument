# 使用指南

## 基础用法

### 简单单例

```python
from FQBase.Foundation.singleton import singleton

@singleton
class Logger:
    def __init__(self):
        self.level = "INFO"

logger1 = Logger()
logger2 = Logger()
assert logger1 is logger2
```

### 带配置的单例

```python
@singleton
class DatabaseConnection:
    def __init__(self, host="localhost", port=5432):
        self.host = host
        self.port = port
        self.connected = False

    def connect(self):
        self.connected = True

db = DatabaseConnection(host="production.db.com", port=5432)
db.connect()
```

---

## 应用场景

### 全局配置管理器

```python
@singleton
class Config:
    def __init__(self):
        self._config = {}
        self.load()

    def load(self):
        self._config = {
            "debug": False,
            "environment": "production",
            "max_connections": 100
        }

    def get(self, key, default=None):
        return self._config.get(key, default)

    def set(self, key, value):
        self._config[key] = value

# 全局访问
config = Config()
if config.get("debug"):
    print("Debug mode")
```

### 日志记录器

```python
@singleton
class AppLogger:
    def __init__(self):
        self._logger = logging.getLogger("app")
        self._logger.setLevel(logging.INFO)

    def info(self, msg):
        self._logger.info(msg)

    def error(self, msg):
        self._logger.error(msg)

# 任何地方都能获取相同实例
logger = AppLogger()
```

### 缓存管理器

```python
@singleton
class DataCache:
    def __init__(self):
        self._cache = {}
        self._max_size = 1000

    def get(self, key):
        return self._cache.get(key)

    def set(self, key, value):
        if len(self._cache) >= self._max_size:
            self._cache.popitem()
        self._cache[key] = value
```

### 连接池

```python
@singleton
class RedisPool:
    def __init__(self):
        self._pool = None
        self._connections = []

    def get_connection(self):
        if not self._pool:
            self._pool = redis.ConnectionPool(host='localhost', port=6379)
        return redis.Redis(connection_pool=self._pool)

redis = RedisPool()
```

---

## 测试隔离

### 使用 reset_singleton

```python
@singleton
class UserService:
    def __init__(self):
        self.users = []

    def add(self, user):
        self.users.append(user)

def test_add_user():
    UserService.reset_singleton()

    service = UserService()
    service.add("Alice")

    assert len(service.users) == 1
    assert service.users[0] == "Alice"

def test_empty_service():
    UserService.reset_singleton()

    service = UserService()
    assert len(service.users) == 0
```

### 使用 get_instance 检查状态

```python
def test_singleton_behavior():
    UserService.reset_singleton()

    assert UserService.get_instance() is None

    service1 = UserService()
    assert UserService.has_instance() is True
    assert UserService.get_instance() is service1

    service2 = UserService()
    assert service1 is service2
```

### pytest 集成

```python
import pytest

@singleton
class TestFixture:
    def __init__(self):
        self.data = None

@pytest.fixture(autouse=True)
def reset_singleton():
    TestFixture.reset_singleton()
    yield
    TestFixture.reset_singleton()
```

---

## 常见模式

### 延迟初始化

```python
@singleton
class ExpensiveResource:
    def __init__(self):
        self._resource = None

    def _initialize(self):
        if self._resource is None:
            self._resource = self._create_expensive_resource()
        return self._resource

    def _create_expensive_resource(self):
        # 模拟耗时操作
        time.sleep(2)
        return "Expensive Resource"

    @property
    def resource(self):
        return self._initialize()
```

### 延迟单例

```python
@singleton
class LazySingleton:
    def __init__(self):
        self.value = None

    @classmethod
    def get_value(cls):
        instance = cls.get_instance()
        if instance is None:
            instance = cls()
        return instance.value if instance else None
```

---

## 装饰器组合

### 单例 + 属性装饰器

```python
@singleton
class ConfigManager:
    @property
    def database_url(self):
        return os.getenv("DATABASE_URL", "sqlite:///default.db")

    @property
    def redis_url(self):
        return os.getenv("REDIS_URL", "redis://localhost:6379")

config = ConfigManager()
print(config.database_url)
```

### 单例 + 类方法

```python
@singleton
class ServiceRegistry:
    def __init__(self):
        self._services = {}

    @classmethod
    def register(cls, name, service):
        instance = cls.get_instance() or cls()
        instance._services[name] = service

    @classmethod
    def get(cls, name):
        instance = cls.get_instance()
        return instance._services.get(name) if instance else None
```

---

## 注意事项

### 参数传递

```python
@singleton
class Service:
    def __init__(self, timeout=30):
        self.timeout = timeout

# 只在首次调用时生效
s1 = Service(timeout=60)  # timeout=60 生效
s2 = Service(timeout=10)  # timeout=10 被忽略

assert s1.timeout == 60
assert s2.timeout == 60  # 始终是首次的值
```

**建议:** 如果需要可变配置，使用属性或字典：

```python
@singleton
class Service:
    def __init__(self):
        self.config = {"timeout": 30}

    def set_timeout(self, timeout):
        self.config["timeout"] = timeout

s1 = Service()
s1.set_timeout(60)

s2 = Service()
assert s2.config["timeout"] == 60
```

### 继承陷阱

```python
@singleton
class Base:
    def __init__(self):
        self.base_value = 0

class Derived(Base):
    def __init__(self):
        super().__init__()
        self.derived_value = 1

d = Derived()
b = Base()

assert d is b  # 共享实例！
```

**解决方案:** 如果需要子类独立单例：

```python
@singleton
class Base:
    pass

@singleton
class Derived(Base):
    pass
```

---

## 完整示例

### 计数器

```python
from FQBase.Foundation.singleton import singleton

@singleton
class Counter:
    def __init__(self):
        self._count = 0

    def increment(self):
        self._count += 1

    @property
    def count(self):
        return self._count

    def reset(self):
        self._count = 0
        # 注意：这只重置计数器，不是重置单例

# 测试
Counter.reset_singleton()

counter1 = Counter()
counter1.increment()
counter1.increment()
print(counter1.count)  # 2

counter2 = Counter()
print(counter2.count)  # 2 (同一实例)

counter1.increment()
print(counter2.count)  # 3
```
