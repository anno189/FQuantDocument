# Foundation 模块使用指南

## 目录

1. [基础环境](#1-基础环境)
2. [单例模式](#2-单例模式)
3. [依赖注入容器](#3-依赖注入容器)
4. [熔断器](#4-熔断器)
5. [重试装饰器](#5-重试装饰器)
6. [生命周期管理](#6-生命周期管理)
7. [验证器](#7-验证器)
8. [嵌套字典访问](#8-嵌套字典访问)
9. [统一异常处理](#9-统一异常处理)

---

## 1. 基础环境

### 1.1 导入模块

```python
from FQBase.Foundation import (
    singleton,
    ServiceContainer,
    ServiceLocator,
    circuit_breaker,
    retry,
    retry_with_exponential_backoff,
    HealthCheckable,
    CompositeHealthCheck,
    validate_code,
    FQException,
    dotty,
)
```

---

## 2. 单例模式

### 2.1 基本使用

```python
from FQBase.Foundation import singleton

@singleton
class ConfigManager:
    def __init__(self):
        self.settings = {}

    def get(self, key):
        return self.settings.get(key)

config1 = ConfigManager()
config2 = ConfigManager()
assert config1 is config2  # True
```

### 2.2 测试隔离

```python
@singleton
class MyService:
    def __init__(self):
        self.value = 0

obj1 = MyService()
obj1.value = 100

MyService.reset_singleton()

obj2 = MyService()
print(obj2.value)  # 0 (新实例)

assert obj1 is not obj2  # True
```

### 2.3 检查实例状态

```python
@singleton
class MyClass:
    pass

print(MyClass.has_instance())  # False

obj = MyClass()
print(MyClass.has_instance())  # True
print(MyClass.get_instance() is obj)  # True
```

---

## 3. 依赖注入容器

### 3.1 基本使用

```python
from FQBase.Foundation import ServiceContainer, ServiceLocator

class ICache:
    def get(self, key): pass
    def set(self, key, value): pass

class RedisCache(ICache):
    def __init__(self, host='localhost', port=6379):
        self.host = host
        self.port = port

    def get(self, key):
        print(f"Getting {key} from Redis")
        return None

    def set(self, key, value):
        print(f"Setting {key}={value} in Redis")

container = ServiceContainer()
container.register_singleton(ICache, RedisCache)

cache = container.get(ICache)
cache.set('user:1', 'John')
```

### 3.2 多种生命周期

```python
container = ServiceContainer()

# 单例 - 全局共享
container.register_singleton(ILogger, FileLogger)

# 瞬态 - 每次创建新实例
container.register_transient(IRequest, HttpRequest)

# 注册已有实例
existing_cache = RedisCache()
container.register_instance(ICache, existing_cache)
```

### 3.3 依赖解析

```python
class ICache:
    pass

class ILogger:
    pass

class DataService:
    def __init__(self, cache: ICache, logger: ILogger):
        self.cache = cache
        self.logger = logger

container = ServiceContainer()
container.register_singleton(ICache, RedisCache)
container.register_singleton(ILogger, FileLogger)
container.register_singleton(IDataService, DataService)

service = container.get(IDataService)
```

### 3.4 服务定位器

```python
container = ServiceContainer()
container.register_singleton(ICache, RedisCache)
ServiceLocator.set_container(container)

cache = ServiceLocator.get(ICache)
```

### 3.5 循环依赖检测

```python
container = ServiceContainer()

class A:
    def __init__(self, b: 'B'):
        self.b = b

class B:
    def __init__(self, a: 'A'):
        self.a = a

container.register_singleton(A, A)
container.register_singleton(B, B)

try:
    container.get(A)
except CircularDependencyException as e:
    print(f"循环依赖: {' -> '.join(e.dependency_chain)}")
```

---

## 4. 熔断器

### 4.1 基本使用

```python
from FQBase.Foundation import CircuitBreaker

breaker = CircuitBreaker(
    name="payment_api",
    failure_threshold=5,
    success_threshold=2,
    recovery_timeout=60
)

def call_payment_service():
    return api.post("/payment", data)

result = breaker.call(call_payment_service)
```

### 4.2 装饰器使用

```python
from FQBase.Foundation import circuit_breaker

@circuit_breaker(name="user_api", failure_threshold=3)
def get_user(user_id):
    return user_service.get(user_id)

@circuit_breaker(name="order_api", failure_threshold=5, recovery_timeout=120)
def create_order(order_data):
    return order_service.create(order_data)
```

### 4.3 上下文管理器

```python
breaker = CircuitBreaker(name="cache_breaker", failure_threshold=3)

with breaker:
    result = cache.get("key")
```

### 4.4 监控熔断器状态

```python
breaker = CircuitBreaker(name="api", failure_threshold=5)

status = breaker.get_status()
print(f"状态: {status['state']}")
print(f"总调用: {status['metrics']['total_calls']}")
print(f"失败调用: {status['metrics']['failed_calls']}")
print(f"成功率: {status['metrics']['success_rate']}")
```

### 4.5 熔断器管理器

```python
from FQBase.Foundation import CircuitBreakerManager

manager = CircuitBreakerManager()

manager.register("api_1", failure_threshold=3)
manager.register("api_2", failure_threshold=5)

all_status = manager.get_all_status()
for name, status in all_status.items():
    print(f"{name}: {status['state']}")
```

### 4.6 异步函数

```python
import asyncio
from FQBase.Foundation import circuit_breaker

@circuit_breaker(name="async_api")
async def fetch_data():
    await asyncio.sleep(0.1)
    return await api.get()
```

---

## 5. 重试装饰器

### 5.1 固定延迟重试

```python
from FQBase.Foundation import retry

@retry(stop_max_attempt_number=3, wait_random_min=100, wait_random_max=500)
def fetch_data():
    return api.get()
```

### 5.2 指数退避重试

```python
from FQBase.Foundation import retry_with_exponential_backoff

@retry_with_exponential_backoff(
    max_attempts=5,
    base_wait=100,
    max_wait=5000
)
def fetch_with_backoff():
    return api.get()
```

### 5.3 指定异常类型

```python
@retry(
    stop_max_attempt_number=3,
    retry_on_exception=(ConnectionError, TimeoutError)
)
def fetch_data():
    return api.get()
```

### 5.4 最大总时间

```python
@retry_with_exponential_backoff(
    max_attempts=10,
    max_total_time=30.0  # 30秒内重试
)
def fetch_data():
    return api.get()
```

### 5.5 回调函数

```python
import logging

logger = logging.getLogger(__name__)

def on_retry(attempt, exception):
    logger.warning(f"尝试 {attempt} 失败: {exception}")

@retry(
    stop_max_attempt_number=3,
    on_retry=on_retry
)
def fetch_data():
    return api.get()
```

### 5.6 手动重试控制

```python
from FQBase.Foundation import create_retry_context

ctx = create_retry_context(
    func=fetch_data,
    max_attempts=5,
    wait_min=100,
    wait_max=1000
)

result = ctx.execute()
print(f"尝试次数: {ctx.attempt_count}")
```

### 5.7 异步重试

```python
from FQBase.Foundation import async_retry_with_exponential_backoff

@async_retry_with_exponential_backoff(max_attempts=5)
async def fetch_data():
    return await api.get()
```

---

## 6. 生命周期管理

### 6.1 实现健康检查

```python
from FQBase.Foundation import HealthCheckable, HealthStatus, ServiceStatus

class MyService(HealthCheckable):
    def __init__(self):
        self._is_healthy = True

    def health_check(self) -> HealthStatus:
        if self._is_healthy:
            return HealthStatus(
                status=ServiceStatus.RUNNING,
                message="Service is running",
                details={'uptime': 3600}
            )
        else:
            return HealthStatus(
                status=ServiceStatus.ERROR,
                message="Service is unhealthy"
            )
```

### 6.2 组合健康检查

```python
from FQBase.Foundation import CompositeHealthCheck

checker = CompositeHealthCheck()
checker.register('database', db_service)
checker.register('cache', cache_service)
checker.register('api', api_service)

all_status = checker.check_all()
for name, status in all_status.items():
    print(f"{name}: {status.status.value} - {status.message}")
```

### 6.3 检查单个服务

```python
status = checker.check('database')
if status and status.is_healthy:
    print("Database is healthy")
else:
    print(f"Database is unhealthy: {status.message if status else 'Not found'}")
```

---

## 7. 验证器

### 7.1 基本验证

```python
from FQBase.Foundation import (
    validate_code,
    validate_date,
    validate_market,
    validate_frequency
)

validate_code("600000")      # True
validate_code("60000")       # False
validate_code("ABCDEF")      # False

validate_date("2026-04-03")  # True
validate_date("2026-13-45") # False

validate_market("SH")        # True
validate_market("HK")        # True
validate_market("US")        # False (invalid)

validate_frequency("1m")     # True
validate_frequency("5m")     # True
validate_frequency("1d")     # True
validate_frequency("2h")     # False
```

### 7.2 Validator 类

```python
from FQBase.Foundation import Validator

validator = Validator()

data = {
    'code': '600000',
    'date': '2026-04-03',
    'market': 'SH',
    'amount': 100.5
}

rules = {
    'code': {'required': True, 'pattern': r'^\d{6}$'},
    'date': {'required': True, 'type': str},
    'market': {'required': True, 'choices': ['SH', 'SZ']},
    'amount': {'required': True, 'min': 0, 'max': 1000000}
}

if validator.validate(data, rules):
    print("验证通过")
else:
    print("验证失败:")
    for error in validator.get_errors():
        print(f"  - {error}")
```

### 7.3 日期范围验证

```python
from FQBase.Foundation import validate_date_range, validate_date_range_with_tz

validate_date_range("2026-01-01", "2026-12-31")  # True
validate_date_range("2026-12-31", "2026-01-01")  # False (start > end)

validate_date_range_with_tz(
    "2026-01-01",
    "2026-12-31",
    tz_start=8,
    tz_end=8
)  # True
```

---

## 8. 嵌套字典访问

### 8.1 基本使用

```python
from FQBase.Foundation import dotty

data = {
    'user': {
        'profile': {
            'name': '张三',
            'age': 30
        },
        'settings': {
            'theme': 'dark',
            'notifications': True
        }
    }
}

d = dotty(data)

name = d['user.profile.name']  # '张三'
theme = d['user.settings.theme']  # 'dark'
```

### 8.2 修改值

```python
d['user.profile.age'] = 31
print(d['user.profile.age'])  # 31

d['user.settings.language'] = 'zh-CN'
print(data['user']['settings']['language'])  # 'zh-CN' (直接修改原字典)
```

### 8.3 列表访问

```python
data = {
    'users': [
        {'name': '张三'},
        {'name': '李四'}
    ]
}

d = dotty(data)
print(d['users.0.name'])  # '张三'
print(d['users.1.name'])  # '李四'
```

### 8.4 切片操作

```python
data = {
    'prices': [100, 200, 300, 400, 500]
}

d = dotty(data)
print(d['prices.0:3'])  # [100, 200, 300]
print(d['prices.2:'])   # [300, 400, 500]
```

### 8.5 包含检查

```python
d = dotty(data)
print('user.profile.name' in d)  # True
print('user.profile.email' in d)  # False
```

### 8.6 安全获取

```python
value = d.get('user.profile.email', 'default@example.com')
print(value)  # 'default@example.com'
```

---

## 9. 统一异常处理

### 9.1 基本使用

```python
from FQBase.Foundation import FQException, DataSourceException

try:
    raise DataSourceException(
        message="Failed to connect to database",
        code="FQ-DS-CONN",
        details={'host': 'localhost', 'port': 27017}
    )
except FQException as e:
    print(f"错误码: {e.code}")
    print(f"消息: {e.message}")
    print(f"详情: {e.details}")
```

### 9.2 异常转字典

```python
try:
    raise ConfigValidationException(
        message="Invalid config",
        details={'field': 'host', 'reason': 'required'}
    )
except FQException as e:
    error_dict = e.to_dict()
    print(error_dict)
    # {'error_code': 'FQ-CF-VALIDATION', 'message': 'Invalid config', ...}
```

### 9.3 安全执行装饰器

```python
from FQBase.Foundation import safe_execute

@safe_execute(default_return=[])
def fetch_data():
    return api.get()

result = fetch_data()  # 异常时返回 []
```

### 9.4 异常处理装饰器

```python
from FQBase.Foundation import handle_exception

@handle_exception
def risky_operation():
    return data_processing()
```

---

## 10. 高级组合用法

### 10.1 熔断器 + 重试

```python
@circuit_breaker(name="api", failure_threshold=3)
@retry_with_exponential_backoff(max_attempts=3)
def resilient_api_call():
    return api.get()
```

### 10.2 依赖注入 + 生命周期

```python
from FQBase.Foundation import (
    ServiceContainer,
    HealthCheckable,
    HealthStatus,
    ServiceStatus,
    CompositeHealthCheck
)

class DatabaseService(HealthCheckable):
    def health_check(self) -> HealthStatus:
        if self.is_connected():
            return HealthStatus(status=ServiceStatus.RUNNING)
        return HealthStatus(status=ServiceStatus.ERROR, message="Disconnected")

container = ServiceContainer()
container.register_singleton(IDatabase, DatabaseService)

checker = CompositeHealthCheck()
db_service = container.get(IDatabase)
checker.register('database', db_service)

print(checker.is_all_healthy)
```
