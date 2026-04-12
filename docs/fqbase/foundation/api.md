# Foundation 模块 API 参考

## 目录

- [1. singleton.py - 单例模式](#1-singletonpy---单例模式)
- [2. container.py - 依赖注入容器](#2-containerpy---依赖注入容器)
- [3. circuit_breaker.py - 熔断器](#3-circuit_breakerpy---熔断器)
- [4. retry.py - 重试装饰器](#4-retrypy---重试装饰器)
- [5. lifecycle.py - 生命周期管理](#5-lifecyclepy---生命周期管理)
- [6. validators.py - 输入验证器](#6-validatorspy---输入验证器)
- [7. exceptions.py - 统一异常体系](#7-exceptionspy---统一异常体系)
- [8. dotty.py - 嵌套字典访问](#8-dottypy---嵌套字典访问)
- [9. crypto.py - 随机数生成](#9-cryptopy---随机数生成)

---

## 1. singleton.py - 单例模式

### SingletonMeta

```python
class SingletonMeta(type)
```

单例元类，线程安全的单例实现。

**方法**：

| 方法 | 说明 |
|------|------|
| `reset_singleton()` | 重置单例实例（用于测试隔离） |
| `get_instance()` | 获取当前实例，不存在返回 None |
| `has_instance()` | 检查是否已创建实例 |

**示例**：

```python
@singleton
class MyClass:
    def __init__(self):
        self.value = 0

obj1 = MyClass()
obj1.value = 10
MyClass.reset_singleton()
obj2 = MyClass()
print(obj2.value)  # 0 (新实例)
```

### singleton

```python
def singleton(cls: type) -> type
```

单例装饰器。

**参数**：`cls` - 要装饰的类

**返回**：装饰后的类

---

## 2. container.py - 依赖注入容器

### CircularDependencyException

```python
class CircularDependencyException(Exception)
```

循环依赖异常。

**属性**：`dependency_chain: List[str]` - 依赖链

### ServiceLifetime

```python
class ServiceLifetime(Enum)
```

服务生命周期枚举。

| 值 | 说明 |
|----|------|
| `SINGLETON` | 单例，全局共享 |
| `TRANSIENT` | 瞬态，每次请求创建新实例 |
| `SCOPED` | 作用域 |

### ServiceDescriptor

```python
class ServiceDescriptor
```

服务描述符。

**属性**：
- `service_type: Type` - 服务类型
- `implementation: Union[Type, Callable]` - 实现
- `lifetime: ServiceLifetime` - 生命周期
- `dependencies: List[Type]` - 依赖列表

**方法**：`get_instance(container: ServiceContainer) -> Any`

### ServiceContainer

```python
class ServiceContainer
```

依赖注入容器。

**方法**：

| 方法 | 说明 |
|------|------|
| `register_singleton(service_type, implementation, dependencies=None)` | 注册单例服务 |
| `register_transient(service_type, implementation, dependencies=None)` | 注册瞬态服务 |
| `register_factory(service_type, factory, lifetime=SINGLETON, dependencies=None)` | 注册工厂 |
| `register_instance(service_type, instance)` | 注册现有实例 |
| `get(service_type)` | 获取服务实例 |
| `try_get(service_type)` | 尝试获取服务，不存在返回 None |
| `is_registered(service_type)` | 检查服务是否已注册 |
| `unregister(service_type)` | 注销服务 |
| `clear()` | 清空所有服务 |
| `get_dependency_graph()` | 获取依赖关系图 |

**属性**：`registered_services: Dict[Type, ServiceDescriptor]` - 已注册服务

### ServiceLocator

```python
class ServiceLocator
```

全局服务定位器。

**类方法**：

| 方法 | 说明 |
|------|------|
| `set_container(container: ServiceContainer)` | 设置全局容器 |
| `get_container()` | 获取全局容器 |
| `get(service_type)` | 获取服务实例 |
| `try_get(service_type)` | 尝试获取服务 |
| `reset()` | 重置全局容器 |

**示例**：

```python
container = ServiceContainer()
container.register_singleton(ICache, RedisCache)
ServiceLocator.set_container(container)
cache = ServiceLocator.get(ICache)
```

---

## 3. circuit_breaker.py - 熔断器

### CircuitState

```python
class CircuitState(Enum)
```

熔断器状态枚举。

| 值 | 说明 |
|----|------|
| `CLOSED` | 关闭，正常工作 |
| `OPEN` | 打开，拒绝请求 |
| `HALF_OPEN` | 半开，尝试恢复 |

### CircuitBreakerOpenException

```python
class CircuitBreakerOpenException(FQException)
```

熔断器打开异常。

**属性**：
- `circuit_name: str` - 熔断器名称
- `recovery_timeout: float` - 恢复超时（秒）

### CircuitBreakerMetrics

```python
@dataclass
class CircuitBreakerMetrics
```

熔断器指标。

**属性**：
- `total_calls: int` - 总调用数
- `successful_calls: int` - 成功调用数
- `failed_calls: int` - 失败调用数
- `rejected_calls: int` - 拒绝调用数
- `consecutive_failures: int` - 连续失败次数
- `consecutive_successes: int` - 连续成功次数
- `last_failure_time: Optional[float]` - 上次失败时间
- `last_success_time: Optional[float]` - 上次成功时间
- `state_changes: int` - 状态变更次数

**属性**：
- `success_rate: float` - 成功率
- `is_healthy: bool` - 是否健康

**方法**：`to_dict() -> Dict[str, Any]`

### CircuitBreaker

```python
class CircuitBreaker
```

熔断器实现。

**初始化参数**：
- `name: str` - 熔断器名称，默认 "default"
- `failure_threshold: int` - 失败阈值，默认 5
- `success_threshold: int` - 半开成功阈值，默认 2
- `recovery_timeout: float` - 恢复超时，默认 60 秒
- `excluded_exceptions: tuple` - 排除的异常类型
- `on_state_change: Callable` - 状态变更回调

**方法**：

| 方法 | 说明 |
|------|------|
| `state` (property) | 获取当前状态 |
| `metrics` (property) | 获取指标 |
| `record_success()` | 记录成功 |
| `record_failure(exception=None)` | 记录失败 |
| `record_rejection()` | 记录拒绝 |
| `can_execute()` | 检查是否可以执行 |
| `call(func, *args, **kwargs)` | 同步执行函数 |
| `call_async(func, *args, **kwargs)` | 异步执行函数 |
| `reset()` | 重置熔断器 |
| `get_status()` | 获取状态详情 |

**上下文管理器**：支持 `with CircuitBreaker() as cb:` 语法

### CircuitBreakerManager

```python
class CircuitBreakerManager
```

熔断器管理器（单例）。

**方法**：

| 方法 | 说明 |
|------|------|
| `register(name, failure_threshold=5, success_threshold=2, recovery_timeout=60.0)` | 注册熔断器 |
| `get(name)` | 获取熔断器 |
| `get_or_create(name)` | 获取或创建熔断器 |
| `unregister(name)` | 注销熔断器 |
| `get_all_status()` | 获取所有熔断器状态 |
| `reset_all()` | 重置所有熔断器 |

### circuit_breaker

```python
def circuit_breaker(
    name: str = None,
    failure_threshold: int = 5,
    success_threshold: int = 2,
    recovery_timeout: float = 60.0,
    excluded_exceptions: tuple = ()
) -> Callable
```

熔断器装饰器。

**参数**：
- `name` - 熔断器名称，默认使用函数名
- `failure_threshold` - 失败阈值
- `success_threshold` - 半开成功阈值
- `recovery_timeout` - 恢复超时
- `excluded_exceptions` - 排除的异常类型

**示例**：

```python
@circuit_breaker(name="user_api", failure_threshold=3)
def get_user(user_id):
    return api.get(user_id)
```

---

## 4. retry.py - 重试装饰器

### retry

```python
def retry(
    stop_max_attempt_number: int = 3,
    wait_random_min: int = 0,
    wait_random_max: int = 1000,
    retry_on_exception: Optional[Tuple[type, ...]] = None,
    on_retry: Optional[Callable[[int, Exception], None]] = None,
) -> Callable
```

重试装饰器（固定随机延迟）。

**参数**：
- `stop_max_attempt_number` - 最大重试次数
- `wait_random_min` - 最小等待时间（毫秒）
- `wait_random_max` - 最大等待时间（毫秒）
- `retry_on_exception` - 需要重试的异常类型
- `on_retry` - 重试回调函数

**行为**：
- `retry_on_exception=None` 时，所有异常都会重试
- 非匹配异常会立即抛出
- 等待时间：`random.randint(wait_random_min, wait_random_max) / 1000.0`

**示例**：

```python
@retry(stop_max_attempt_number=3, wait_random_min=100, wait_random_max=500)
def fetch_data():
    return api.get()
```

### retry_with_exponential_backoff

```python
def retry_with_exponential_backoff(
    max_attempts: int = 3,
    base_wait: int = 100,
    max_wait: int = 10000,
    max_total_time: Optional[float] = None,
    retry_on_exception: Optional[Tuple[type, ...]] = None,
    on_retry: Optional[Callable[[int, Exception], None]] = None,
) -> Callable
```

指数退避重试装饰器。

**参数**：
- `max_attempts` - 最大重试次数
- `base_wait` - 基础等待时间（毫秒）
- `max_wait` - 最大等待时间（毫秒）
- `max_total_time` - 最大总时间（秒）
- `retry_on_exception` - 需要重试的异常类型
- `on_retry` - 重试回调函数

**等待时间计算**：`min(base_wait * 2^(attempt-1), max_wait) / 1000.0`

**示例**：

```python
@retry_with_exponential_backoff(max_attempts=5, base_wait=100, max_wait=5000)
def fetch_with_backoff():
    return api.get()
```

### RetryError

```python
class RetryError(Exception)
```

重试失败异常。

**属性**：`last_exception: Optional[Exception]` - 最后捕获的异常

### RetryContext

```python
class RetryContext
```

重试上下文，手动控制重试。

**初始化参数**：
- `func: Callable` - 要执行的函数
- `max_attempts: int` - 最大重试次数
- `wait_min: int` - 最小等待（毫秒）
- `wait_max: int` - 最大等待（毫秒）
- `retry_on_exception` - 需要重试的异常类型
- `on_retry` - 回调函数

**方法**：`execute(*args, **kwargs)` - 执行函数

**属性**：`attempt_count: int` - 当前尝试次数

### create_retry_context

```python
def create_retry_context(
    func: Callable,
    max_attempts: int = 3,
    wait_min: int = 0,
    wait_max: int = 1000,
    retry_on_exception: Optional[Tuple[type, ...]] = None,
    on_retry: Optional[Callable[[int, Exception], None]] = None,
) -> RetryContext
```

创建重试上下文。

### async_retry_with_exponential_backoff

```python
async def async_retry_with_exponential_backoff(
    max_attempts: int = 3,
    base_wait: int = 100,
    max_wait: int = 10000,
    max_total_time: Optional[float] = None,
    retry_on_exception: Optional[Tuple[type, ...]] = None,
) -> Callable
```

异步指数退避重试装饰器。

**参数**：
- `max_attempts` - 最大重试次数
- `base_wait` - 基础等待时间（毫秒）
- `max_wait` - 最大等待时间（毫秒）
- `max_total_time` - 最大总时间（秒）
- `retry_on_exception` - 需要重试的异常类型

**示例**：

```python
@async_retry_with_exponential_backoff(max_attempts=3, base_wait=100, max_wait=5000)
async def fetch_data():
    return await api.get()
```

---

## 5. lifecycle.py - 生命周期管理

### ServiceStatus

```python
class ServiceStatus(Enum)
```

服务状态枚举。

| 值 | 说明 |
|----|------|
| `UNKNOWN` | 未知 |
| `INITIALIZING` | 初始化中 |
| `RUNNING` | 运行中 |
| `DEGRADED` | 降级 |
| `STOPPING` | 停止中 |
| `STOPPED` | 已停止 |
| `ERROR` | 错误 |

### HealthCheckable

```python
@runtime_checkable
class HealthCheckable(Protocol)
```

健康检查协议。

**方法**：`health_check() -> HealthStatus`

### Initializable

```python
@runtime_checkable
class Initializable(Protocol)
```

初始化协议。

**方法**：
- `initialize() -> bool`
- `is_initialized` (property)

### Shutdownable

```python
@runtime_checkable
class Shutdownable(Protocol)
```

关闭协议。

**方法**：
- `shutdown() -> bool`
- `is_shutdown` (property)

### HealthStatus

```python
class HealthStatus
```

健康状态。

**初始化参数**：
- `status: ServiceStatus` - 状态
- `message: Optional[str]` - 消息
- `details: Optional[Dict[str, Any]]` - 详情

**属性**：`is_healthy: bool` - 是否健康

**方法**：`to_dict() -> Dict[str, Any]`

### CompositeHealthCheck

```python
class CompositeHealthCheck
```

组合健康检查。

**方法**：

| 方法 | 说明 |
|------|------|
| `register(name: str, service: HealthCheckable)` | 注册服务 |
| `unregister(name: str)` | 注销服务 |
| `check(name: str)` | 检查单个服务 |
| `check_all()` | 检查所有服务 |

**属性**：`is_all_healthy: bool` - 所有服务是否健康

---

## 6. validators.py - 输入验证器

### validate_code

```python
def validate_code(code: str) -> bool
```

验证股票代码格式（6位数字）。

### validate_date

```python
def validate_date(date_str: str, format: str = '%Y-%m-%d') -> bool
```

验证日期格式。

### validate_date_range

```python
def validate_date_range(start_date: str, end_date: str, format: str = '%Y-%m-%d') -> bool
```

验证日期范围。

### validate_date_range_with_tz

```python
def validate_date_range_with_tz(
    start_date: str,
    end_date: str,
    format: str = '%Y-%m-%d',
    tz_start: int = 0,
    tz_end: int = 0
) -> bool
```

验证带时区偏移的日期范围。

**参数**：
- `start_date` - 开始日期
- `end_date` - 结束日期
- `format` - 日期格式，默认 `'%Y-%m-%d'`
- `tz_start` - 开始日期时区偏移（小时）
- `tz_end` - 结束日期时区偏移（小时）

**返回**：`True` 如果有效，否则 `False`

**示例**：

```python
result = validate_date_range_with_tz(
    "2026-01-01", "2026-04-01",
    tz_start=8, tz_end=8
)
```

### validate_market

```python
def validate_market(market: str) -> bool
```

验证市场代码（SH, SZ, BJ, HK, US）。

### validate_frequency

```python
def validate_frequency(freq: str) -> bool
```

验证K线周期（1m, 5m, 15m, 60m, 1d, 1w, 1M）。

### validate_dict

```python
def validate_dict(data: Any, required_keys: List[str]) -> bool
```

验证字典是否包含必需键。

### validate_positive_number

```python
def validate_positive_number(value: Any) -> bool
```

验证正数。

### validate_percentage

```python
def validate_percentage(value: Any) -> bool
```

验证百分比（0-100）。

### ValidationError

```python
class ValidationError(Exception)
```

验证异常。

### Validator

```python
class Validator
```

验证器类。

**方法**：

| 方法 | 说明 |
|------|------|
| `add_error(message: str)` | 添加错误信息 |
| `has_errors()` | 是否有错误 |
| `get_errors()` | 获取所有错误 |
| `clear_errors()` | 清除错误 |
| `validate(value: Any, rules: dict) -> bool` | 根据规则验证 |

**验证规则**：

| 规则名 | 说明 |
|--------|------|
| `required` | 是否必需 |
| `type` | 类型 |
| `min` | 最小值 |
| `max` | 最大值 |
| `pattern` | 正则表达式 |
| `choices` | 候选值 |

---

## 7. exceptions.py - 统一异常体系

### FQException

```python
class FQException(Exception)
```

FQuant 异常基类。

**初始化参数**：
- `message: str` - 错误消息
- `code: Optional[str]` - 错误码
- `details: Optional[Dict[str, Any]]` - 详情

**属性**：
- `message: str`
- `code: str`
- `details: Dict[str, Any]`

**方法**：`to_dict() -> Dict[str, Any]`

### DataSourceException

```python
class DataSourceException(FQException)
```

数据源异常。子类：`DataFetchException`, `DataParseException`, `DataSaveException`, `DataSourceConnectionError`, `DataNotFoundError`, `DataSourceAPIError`

### StrategyException

```python
class StrategyException(FQException)
```

策略异常。子类：`StrategyInitException`, `StrategyExecuteException`

### ConfigException

```python
class ConfigException(FQException)
```

配置异常。子类：`ConfigLoadException`, `ConfigValidationException`

### NetworkException

```python
class NetworkException(FQException)
```

网络异常。

### RedisException

```python
class RedisException(FQException)
```

Redis 异常。

### MongoDBException

```python
class MongoDBException(FQException)
```

MongoDB 异常。子类：`MongoDBConnectionException`, `MongoDBOperationException`

### CeleryException

```python
class CeleryException(FQException)
```

Celery 任务异常。

### handle_exception

```python
def handle_exception(func)
```

异常处理装饰器。

### safe_execute

```python
def safe_execute(default_return=None)
```

安全执行装饰器，异常时返回默认值。

---

## 8. dotty.py - 嵌套字典访问

### dotty

```python
def dotty(dictionary=None, no_list=False)
```

Dotty 工厂函数。

**参数**：
- `dictionary` - 字典，默认创建空字典
- `no_list` - 数字键不转换为列表索引

**返回**：`Dotty` 实例

### Dotty

```python
class Dotty
```

字典包装器，支持点号深度访问。

**初始化参数**：
- `dictionary` - 字典
- `separator` - 分隔符，默认 '.'
- `esc_char` - 转义字符，默认 '\\'
- `no_list` - 数字键不转换为列表

**方法**：

| 方法 | 说明 |
|------|------|
| `__getitem__(key)` | 点号访问 `d['a.b.c']` |
| `__setitem__(key, value)` | 点号赋值 `d['a.b.c'] = value` |
| `__delitem__(key)` | 删除键 `del d['a.b.c']` |
| `__contains__(item)` | 深度包含检查 |
| `__getattr__(item)` | 属性访问 `d.a.b.c` |
| `copy()` | 返回副本 |
| `get(key, default=None)` | 安全获取 |
| `pop(key, default=None)` | 弹出值 |
| `setdefault(key, default=None)` | 默认值 |
| `to_dict()` | 转换为字典 |
| `to_json()` | 转换为 JSON |

### DottyEncoder

```python
class DottyEncoder(json.JSONEncoder)
```

Dotty 的 JSON 编码器。

---

## 9. crypto.py - 随机数生成

### random_stock_code

```python
def random_stock_code(
    stock_number: int = 10,
    markets: Optional[List[str]] = None
) -> List[str]
```

随机生成股票代码（使用 `random` 模块，非安全敏感）。

**参数**：
- `stock_number` - 生成个数，默认 10
- `markets` - 市场列表，默认 ['SH', 'SZ']

**市场代码范围**：
- SH: 600000-609999, 688xxx (科创板)
- SZ: 000xxx-1999, 002xxx, 300xxx (创业板)
- BJ: 8xxxxx, 4xxxxx (北交所)

### random_string

```python
def random_string(topic: str = 'Acc', length: int = 8) -> str
```

生成随机字符串（使用 `secrets` 模块，安全敏感）。

**参数**：
- `topic` - 开头标识
- `length` - 总长度

**返回**：`f'{topic}_{random_string}'` 格式

**示例**：`random_string('Acc', 8)` → `"Acc_Kj3mP9x2"`

### random_with_topic

```python
def random_with_topic(topic: str = 'Acc', lens: int = 8) -> str
```

生成带主题的随机值（使用 `secrets` 模块）。

**参数**：
- `topic` - 开头标识，默认 'Acc'
- `lens` - 长度，默认 8

**返回**：`f'{topic}_{random_value}'` 格式

**示例**：`random_with_topic('Acc', 8)` → `"Acc_mK3pX7j2"`
