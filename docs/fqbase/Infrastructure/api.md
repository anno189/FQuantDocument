---
title: Infrastructure - API参考
description: Infrastructure API 参考文档
tag:
  - fquant
  - fqbase
  - infrastructure

summary:
  purpose: api-reference
  core_classes:
    - SingletonMeta
    - FQLogger
    - CircuitBreaker
    - CircuitBreakerMetrics
    - CircuitBreakerManager
    - CircuitState
    - RetryContext
    - ServiceContainer
    - ServiceLocator
    - MongoClientManager
  core_functions:
    - singleton
    - get_logger
    - init_logging
    - retry
    - retry_with_exponential_backoff
    - circuit_breaker
    - handle_exception
    - safe_execute
---

# Infrastructure - API参考

## 阅读路径

🔵 **开发者**：README → api → usage → concepts → examples

## 单例模式 (singleton)

### singleton

**位置：** `Infrastructure/singleton.py`

```python
from FQBase.Infrastructure import singleton

@singleton
class MyClass:
    pass
```

**描述：** 单例装饰器，线程安全

---

### SingletonMeta

**位置：** `Infrastructure/singleton.py#L20`

**描述：** 单例元类

```python
from FQBase.Infrastructure import SingletonMeta

class MyClass(metaclass=SingletonMeta):
    pass

SingletonMeta.reset_singleton()
```

---

## 日志系统 (logger)

### get_logger

**位置：** `Infrastructure/logger.py`

```python
from FQBase.Infrastructure import get_logger

logger = get_logger('my_module')
logger.info('Hello')
logger.error('Error occurred')
```

**描述：** 获取 FQLogger 实例的工厂函数

**返回：** `FQLogger`

---

### FQLogger

**位置：** `Infrastructure/logger.py#L45`

**描述：** 统一的日志记录器 - 多实例单例模式（按 name 区分）

---

### init_logging

**位置：** `Infrastructure/logger.py`

```python
from FQBase.Infrastructure import init_logging

init_logging('/path/to/logging.yaml')
```

**描述：** 显式初始化日志系统

---

## 异常处理 (exceptions)

### FQException

**位置：** `Infrastructure/exceptions.py#L26`

**描述：** FQuant 异常基类

```python
from FQBase.Infrastructure import FQException

raise FQException(message="Error", code="FQ-001", details={})
```

---

### 异常类型

| 异常 | 位置 | 描述 |
|------|------|------|
| FQException | exceptions.py#L26 | FQuant 异常基类 |
| DataSourceException | exceptions.py#L52 | 数据源异常 |
| DataFetchException | exceptions.py#L57 | 数据获取异常 |
| DataParseException | exceptions.py#L62 | 数据解析异常 |
| DataSaveException | exceptions.py#L67 | 数据保存异常 |
| DataSourceConnectionError | exceptions.py#L72 | 数据源连接异常 |
| DataNotFoundError | exceptions.py#L77 | 数据未找到异常 |
| DataSourceAPIError | exceptions.py#L82 | 数据源API异常 |
| StrategyException | exceptions.py#L87 | 策略异常 |
| StrategyInitException | exceptions.py#L92 | 策略初始化异常 |
| StrategyExecuteException | exceptions.py#L97 | 策略执行异常 |
| ConfigException | exceptions.py#L102 | 配置异常 |
| ConfigLoadException | exceptions.py#L107 | 配置加载异常 |
| ConfigValidationException | exceptions.py#L112 | 配置验证异常 |
| NetworkException | exceptions.py#L117 | 网络异常 |
| RedisException | exceptions.py#L122 | Redis 异常 |
| MongoDBException | exceptions.py#L127 | MongoDB 异常基类 |
| MongoDBConnectionException | exceptions.py#L132 | MongoDB 连接异常 |
| MongoDBOperationException | exceptions.py#L137 | MongoDB 操作异常 |
| CeleryException | exceptions.py#L142 | Celery 任务异常 |
| CircuitBreakerOpenException | circuit_breaker.py#L44 | 熔断器打开异常 |

---

### handle_exception

**位置：** `Infrastructure/exceptions.py`

```python
from FQBase.Infrastructure import handle_exception

handle_exception(exc, context="operation_name")
```

---

### safe_execute

**位置：** `Infrastructure/exceptions.py`

```python
from FQBase.Infrastructure import safe_execute

result = safe_execute(func, default=None, error_msg="Failed")
```

---

## 重试机制 (retry)

### retry

**位置：** `Infrastructure/retry.py#L36`

```python
from FQBase.Infrastructure import retry

@retry(stop_max_attempt_number=3, wait_random_min=100, wait_random_max=500)
def unreliable_call():
    pass
```

**参数：**

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| stop_max_attempt_number | int | 3 | 最大重试次数 |
| wait_random_min | int | 0 | 最小等待时间(毫秒) |
| wait_random_max | int | 1000 | 最大等待时间(毫秒) |
| max_total_wait | float | None | 最大总等待时间(秒) |
| retry_on_exception | Tuple | None | 需要重试的异常类型 |
| on_retry | Callable | None | 重试回调函数 |

---

### retry_with_exponential_backoff

**位置：** `Infrastructure/retry.py`

```python
from FQBase.Infrastructure import retry_with_exponential_backoff

@retry_with_exponential_backoff(factor=2, max_delay=60)
def call():
    pass
```

---

### RetryError

**位置：** `Infrastructure/retry.py#L202`

**描述：** 重试失败异常

---

### RetryContext

**位置：** `Infrastructure/retry.py#L209`

**描述：** 重试上下文

---

### create_retry_context

**位置：** `Infrastructure/retry.py`

**描述：** 创建重试上下文

```python
from FQBase.Infrastructure import create_retry_context

ctx = create_retry_context(max_attempts=3)
```

---

### async_retry_with_exponential_backoff

**位置：** `Infrastructure/retry.py`

**描述：** 异步重试装饰器（指数退避）

```python
from FQBase.Infrastructure import async_retry_with_exponential_backoff

@async_retry_with_exponential_backoff(factor=2)
async def async_call():
    pass
```

---

## 熔断器 (circuit_breaker)

### CircuitState

**位置：** `Infrastructure/circuit_breaker.py#L37`

**描述：** 熔断器状态枚举

```python
from FQBase.Infrastructure import CircuitState

print(CircuitState.CLOSED)
print(CircuitState.OPEN)
print(CircuitState.HALF_OPEN)
```

---

### CircuitBreakerMetrics

**位置：** `Infrastructure/circuit_breaker.py#L62`

**描述：** 熔断器指标

```python
from FQBase.Infrastructure import CircuitBreakerMetrics

metrics = CircuitBreakerMetrics()
print(metrics.success_rate)
print(metrics.is_healthy)
```

---

### CircuitBreaker

**位置：** `Infrastructure/circuit_breaker.py#L100`

**描述：** 熔断器

```python
from FQBase.Infrastructure import CircuitBreaker

breaker = CircuitBreaker(name='my_service', failure_threshold=5)
result = breaker.call(some_function)
```

---

### circuit_breaker

**位置：** `Infrastructure/circuit_breaker.py`

```python
from FQBase.Infrastructure import circuit_breaker

@circuit_breaker(failure_threshold=3, recovery_timeout=60)
def call_service():
    pass
```

---

### CircuitBreakerManager

**位置：** `Infrastructure/circuit_breaker.py#L319`

**描述：** 熔断器管理器 - 管理多个熔断器

---

## 依赖注入 (container)

### ServiceLifetime

**位置：** `Infrastructure/container.py#L39`

**描述：** 服务生命周期枚举

```python
from FQBase.Infrastructure import ServiceLifetime

print(ServiceLifetime.SINGLETON)
print(ServiceLifetime.TRANSIENT)
print(ServiceLifetime.SCOPED)
```

---

### ServiceDescriptor

**位置：** `Infrastructure/container.py#L46`

**描述：** 服务描述符

---

### ServiceContainer

**位置：** `Infrastructure/container.py#L100`

**描述：** 服务容器 - 增强版

```python
from FQBase.Infrastructure import ServiceContainer, ServiceLifetime

container = ServiceContainer()
container.register_singleton(ICache, RedisCache)
cache = container.get(ICache)
```

---

### ServiceLocator

**位置：** `Infrastructure/container.py#L433`

**描述：** 服务定位器

---

### CircularDependencyException

**位置：** `Infrastructure/container.py#L30`

**描述：** 循环依赖异常

---

## MongoDB 客户端 (_mongo)

### MongoClientManager

**位置：** `Infrastructure/_mongo/_mongo_client.py#L36`

**描述：** MongoDB 客户端管理器 - 线程安全单例

```python
from FQBase.Infrastructure import MongoClientManager, get_mongo_client_manager

manager = get_mongo_client_manager()
client = manager.get_client(uri='mongodb://localhost:27017')
```

---

### SortOrder

**位置：** `Infrastructure/_mongo/_interfaces.py#L17`

**描述：** MongoDB 排序顺序枚举

```python
from FQBase.Infrastructure import SortOrder

# SortOrder.ASCENDING 或 SortOrder.DESCENDING
```

---

### IMongoCollection

**位置：** `Infrastructure/_mongo/_interfaces.py#L22`

**描述：** MongoDB 集合操作接口

---

### IMongoDatabase

**位置：** `Infrastructure/_mongo/_interfaces.py#L135`

**描述：** MongoDB 数据库接口

---

### IMongoClient

**位置：** `Infrastructure/_mongo/_interfaces.py#L164`

**描述：** MongoDB 客户端接口

---

### IMongoClientManager

**位置：** `Infrastructure/_mongo/_interfaces.py#L193`

**描述：** MongoDB 客户端管理器接口

---

### get_mongo_client_manager

**位置：** `Infrastructure/_mongo/__init__.py`

**描述：** 获取 MongoClientManager 单例

```python
from FQBase.Infrastructure import get_mongo_client_manager

manager = get_mongo_client_manager()
```

---

## 相关文档

- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
