# Foundation 模块最佳实践

## 目录

1. [单例模式](#1-单例模式)
2. [依赖注入容器](#2-依赖注入容器)
3. [熔断器](#3-熔断器)
4. [重试装饰器](#4-重试装饰器)
5. [生命周期管理](#5-生命周期管理)
6. [验证器](#6-验证器)
7. [异常处理](#7-异常处理)
8. [维护事宜](#8-维护事宜)

---

## 1. 单例模式

### 1.1 何时使用单例

**适用场景**：
- 全局配置管理器
- 日志记录器
- 缓存服务
- 数据库连接池

**不适用场景**：
- 需要不同配置的多实例
- 测试需要模拟的对象
- 有状态且状态不可共享的业务对象

### 1.2 测试隔离

```python
# 在测试 setup 中重置单例
class TestConfigManager(unittest.TestCase):
    def setUp(self):
        ConfigManager.reset_singleton()

    def test_singleton_behavior(self):
        obj1 = ConfigManager()
        obj2 = ConfigManager()
        self.assertIs(obj1, obj2)
```

### 1.3 避免在 `__init__` 中重复初始化

```python
@singleton
class ConfigManager:
    _initialized = False

    def __init__(self):
        if not self._initialized:
            self.settings = {}
            self._initialized = True
```

---

## 2. 依赖注入容器

### 2.1 服务注册规范

```python
GOOD:
container.register_singleton(ICache, RedisCache)
container.register_transient(IRequest, HttpRequest)

BAD:
cache = RedisCache()
container.register_instance(ICache, cache)  # 在注册前实例化
```

### 2.2 接口与实现分离

```python
GOOD:
class ILogger(Protocol):
    def debug(self, msg): ...
    def info(self, msg): ...
    def error(self, msg): ...

container.register_singleton(ILogger, FileLogger)

BAD:
container.register_singleton(FileLogger, FileLogger)  # 直接注册实现
```

### 2.3 依赖解析陷阱

```python
GOOD:
class DataService:
    def __init__(self, cache: ICache, logger: ILogger):
        self.cache = cache
        self.logger = logger

container.register_singleton(ICache, RedisCache)
container.register_singleton(ILogger, FileLogger)
container.register_singleton(IDataService, DataService)

BAD:
class DataService:
    def __init__(self):
        self.cache = container.get(ICache)  # 避免在构造函数中直接获取容器
```

### 2.4 循环依赖检测

```python
try:
    container.get(SomeService)
except CircularDependencyException as e:
    print(f"循环依赖链: {' -> '.join(e.dependency_chain)}")
```

---

## 3. 熔断器

### 3.1 失败阈值设置

| 服务类型 | failure_threshold | recovery_timeout | 说明 |
|----------|-------------------|------------------|------|
| 关键服务 | 3-5 | 60s | 快速熔断保护 |
| 普通服务 | 5-10 | 120s | 容忍暂时故障 |
| 外部API | 10-20 | 300s | 考虑网络抖动 |

### 3.2 排除特定异常

```python
@circuit_breaker(
    failure_threshold=5,
    excluded_exceptions=(ValidationError, AuthError)  # 这些异常不计入失败
)
def call_api():
    return api.get()
```

### 3.3 状态变更回调

```python
def on_state_change(breaker):
    logger.warning(f"Circuit {breaker.name} changed to {breaker.state}")

breaker = CircuitBreaker(
    name="payment",
    on_state_change=on_state_change
)
```

### 3.4 监控指标

```python
breaker = CircuitBreaker(name="api")

metrics = breaker.metrics
if metrics.success_rate < 0.8:
    alert("API success rate below 80%")
if metrics.consecutive_failures > 3:
    alert("API consecutive failures detected")
```

### 3.5 与重试结合使用

```python
@circuit_breaker(name="api", failure_threshold=3)
@retry_with_exponential_backoff(max_attempts=3)
def resilient_call():
    return api.get()

# 注意：熔断器在外层，重试在内层
# 熔断器防止级联故障，重试处理暂时性故障
```

---

## 4. 重试装饰器

### 4.1 延迟设置

| 场景 | 策略 | 参数 |
|------|------|------|
| 快速网络 | 固定短延迟 | wait_random_min=50, wait_random_max=200 |
| 外部API | 指数退避 | base_wait=100, max_wait=5000 |
| 数据库 | 固定中等 | wait_random_min=100, wait_random_max=500 |

### 4.2 指定异常类型

```python
GOOD:
@retry(retry_on_exception=(ConnectionError, TimeoutError))
def fetch_data():
    return api.get()

BAD:
@retry()  # 所有异常都重试，可能导致无限重试
def fetch_data():
    raise ValidationError("Invalid input")  # 不应重试
```

### 4.3 最大总时间限制

```python
@retry_with_exponential_backoff(
    max_attempts=10,
    max_total_time=30.0  # 30秒后不再重试
)
def critical_operation():
    return api.get()
```

### 4.4 日志记录

```python
import logging

logger = logging.getLogger(__name__)

def log_retry(attempt, exception):
    logger.warning(f"Retry {attempt}: {exception}")

@retry(on_retry=log_retry)
def fetch_data():
    return api.get()
```

---

## 5. 生命周期管理

### 5.1 健康检查实现

```python
class DatabaseService(HealthCheckable):
    def health_check(self) -> HealthStatus:
        try:
            if self.is_connected() and self.ping():
                return HealthStatus(
                    status=ServiceStatus.RUNNING,
                    details={'connections': self.connection_count()}
                )
            else:
                return HealthStatus(
                    status=ServiceStatus.DEGRADED,
                    message="Database is slow or degraded"
                )
        except Exception as e:
            return HealthStatus(
                status=ServiceStatus.ERROR,
                message=str(e)
            )
```

### 5.2 组合健康检查

```python
checker = CompositeHealthCheck()
checker.register('database', db_service)
checker.register('cache', cache_service)
checker.register('api', api_service)

status = checker.check_all()
failed = [name for name, s in status.items() if not s.is_healthy]
if failed:
    alert(f"Unhealthy services: {', '.join(failed)}")
```

### 5.3 优雅关闭

```python
class MyService(Shutdownable):
    _is_shutdown = False

    def shutdown(self) -> bool:
        self._is_shutdown = True
        self.release_resources()
        return True

    @property
    def is_shutdown(self) -> bool:
        return self._is_shutdown
```

---

## 6. 验证器

### 6.1 验证规则顺序

```python
GOOD:
rules = {
    'required': True,   # 先检查必需
    'type': str,        # 再检查类型
    'pattern': r'^\d{6}$',  # 最后检查格式
}

BAD:
rules = {
    'pattern': r'^\d{6}$',  # 如果值为 None 会报错
    'required': True,
}
```

### 6.2 自定义验证规则

```python
class OrderValidator(Validator):
    def validate_order(self, order: dict) -> bool:
        self.clear_errors()

        if not self.validate(order, {
            'required': True,
            'type': dict
        }):
            return False

        if not self.validate(order, {
            'code': {'required': True, 'pattern': r'^\d{6}$'},
            'amount': {'required': True, 'min': 0},
            'price': {'required': True, 'min': 0}
        }):
            return False

        if order['amount'] * order['price'] > 1000000:
            self.add_error("Order value exceeds limit")
            return False

        return not self.has_errors()
```

---

## 7. 异常处理

### 7.1 异常层次选择

```python
GOOD:
try:
    data = fetch_data()
except DataFetchException:
    handle_fetch_error()
except DataParseException:
    handle_parse_error()

BAD:
try:
    data = fetch_data()
except FQException:  # 太宽泛
    handle_error()
```

### 7.2 异常链

```python
try:
    process(data)
except Exception as e:
    raise DataSourceException(
        message="Failed to process data",
        details={'original_error': str(e)}
    ) from e
```

### 7.3 安全执行使用场景

```python
GOOD:
@safe_execute(default_return=None)
def get_cached_value(key):
    return cache.get(key)

BAD:
@safe_execute(default_return=[])  # 默认返回值应该明确
defrisky_operation():
    return calculate_values()  # 可能返回 None 的情况不适合
```

---

## 8. 维护事宜

### 8.1 新增异常类型

新增数据源相关的异常时，应继承适当的基类：

```python
# 良好的实践
class MyAPIDataException(DataSourceException):
    ERROR_CODE_PREFIX = "FQ-MYAPI"

# 添加到 __init__.py 的导出列表
from .my_exceptions import MyAPIDataException
```

### 8.2 熔断器阈值调整

根据监控数据定期调整熔断器阈值：

```python
# 每季度审查一次
@circuit_breaker(
    name="api_gateway",
    failure_threshold=10,      # 根据历史数据调整
    success_threshold=3,       # 根据业务稳定性调整
    recovery_timeout=120.0     # 根据服务恢复时间调整
)
def api_call():
    return gateway.get()
```

### 8.3 验证器规则更新

当业务规则变化时更新验证器：

```python
# 场景：科创板股票代码范围变化
VALID_CODE_PATTERNS = {
    'SH': r'^(60\d{4}|688\d{3})$',  # 沪市主板 + 科创板
    'SZ': r'^(00\d{4}|002\d{3}|300\d{3})$',  # 深市主板 + 中小板 + 创业板
}
```

### 8.4 团队协作规范

```python
DATE_VALIDATION_FORMAT = '%Y-%m-%d'

def validate_trade_date(date_str: str) -> bool:
    return validate_date(date_str, DATE_VALIDATION_FORMAT)
```

### 8.5 检查清单

- [ ] 所有新增异常继承适当的基类
- [ ] 熔断器配置有文档说明
- [ ] 验证器规则与业务规则保持同步
- [ ] 单例类实现了 `reset_singleton` 支持测试
- [ ] 依赖注入容器使用接口而非实现
- [ ] 重试装饰器指定了 `retry_on_exception`
- [ ] 健康检查返回适当的 `HealthStatus`
- [ ] 异常处理使用了适当的异常层次
