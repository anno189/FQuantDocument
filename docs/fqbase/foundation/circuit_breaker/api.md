# Circuit Breaker 模块 API 参考

## 目录

- [枚举](#1-枚举)
- [异常](#2-异常)
- [数据类](#3-数据类)
- [熔断器类](#4-熔断器类)
- [管理器](#5-管理器)
- [装饰器](#6-装饰器)

---

## 1. 枚举

### CircuitState

```python
class CircuitState(Enum)
```

熔断器状态枚举。

| 值 | 说明 |
|----|------|
| `CLOSED` | 关闭状态，正常执行 |
| `OPEN` | 打开状态，拒绝请求 |
| `HALF_OPEN` | 半开状态，尝试恢复 |

---

## 2. 异常

### CircuitBreakerOpenException

```python
class CircuitBreakerOpenException(FQException)
```

熔断器打开异常。当熔断器处于 OPEN 状态时调用会抛出此异常。

**初始化参数**：

| 参数 | 类型 | 说明 |
|------|------|------|
| `circuit_name` | str | 熔断器名称 |
| `recovery_timeout` | float | 恢复超时（秒） |

**属性**：

| 属性 | 类型 | 说明 |
|------|------|------|
| `circuit_name` | str | 熔断器名称 |
| `recovery_timeout` | float | 恢复超时（秒） |
| `code` | str | 错误码 "FQ-CB-OPEN" |
| `message` | str | 错误消息 |
| `details` | dict | 详细信息 |

**示例**：

```python
try:
    breaker.call(func)
except CircuitBreakerOpenException as e:
    print(f"熔断器 {e.circuit_name} 打开")
    print(f"等待 {e.recovery_timeout} 秒后重试")
```

---

## 3. 数据类

### CircuitBreakerMetrics

```python
@dataclass
class CircuitBreakerMetrics
```

熔断器指标数据类。

**属性**：

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `total_calls` | int | 0 | 总调用次数 |
| `successful_calls` | int | 0 | 成功调用次数 |
| `failed_calls` | int | 0 | 失败调用次数 |
| `rejected_calls` | int | 0 | 被拒绝调用次数 |
| `state_changes` | int | 0 | 状态变更次数 |
| `last_failure_time` | Optional[float] | None | 上次失败时间戳 |
| `last_success_time` | Optional[float] | None | 上次成功时间戳 |
| `consecutive_failures` | int | 0 | 连续失败次数 |
| `consecutive_successes` | int | 0 | 连续成功次数 |

**属性 (只读)**：

| 属性 | 类型 | 说明 |
|------|------|------|
| `success_rate` | float | 成功率 (0-1) |
| `is_healthy` | bool | 是否健康 (连续失败 < 5) |

**方法**：

| 方法 | 返回类型 | 说明 |
|------|----------|------|
| `to_dict()` | Dict[str, Any] | 转换为字典 |

---

## 4. 熔断器类

### CircuitBreaker

```python
class CircuitBreaker
```

熔断器核心类。

**初始化参数**：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `name` | str | "default" | 熔断器名称 |
| `failure_threshold` | int | 5 | 连续失败次数阈值 |
| `success_threshold` | int | 2 | 半开状态连续成功次数阈值 |
| `recovery_timeout` | float | 60.0 | 恢复超时（秒） |
| `excluded_exceptions` | tuple | () | 排除的异常类型元组 |
| `on_state_change` | Optional[Callable] | None | 状态变更回调函数 |

**属性 (只读)**：

| 属性 | 类型 | 说明 |
|------|------|------|
| `state` | CircuitState | 当前状态 |
| `metrics` | CircuitBreakerMetrics | 熔断器指标 |

**方法**：

#### record_success

```python
def record_success(self) -> None
```

记录成功调用。线程安全。

#### record_failure

```python
def record_failure(self, exception: Optional[Exception] = None) -> None
```

记录失败调用。线程安全。

**参数**：
- `exception` - 发生的异常，排除的异常类型不计入失败

#### record_rejection

```python
def record_rejection(self) -> None
```

记录被拒绝的调用。线程安全。

#### can_execute

```python
def can_execute(self) -> bool
```

检查是否可以执行请求。

**返回**：`bool` - True 可以执行，False 熔断器打开

#### call

```python
def call(self, func: Callable, *args, **kwargs)
```

同步执行函数，带熔断保护。

**参数**：
- `func` - 要执行的函数
- `*args` - 位置参数
- `**kwargs` - 关键字参数

**返回**：函数返回值

**抛出**：
- `CircuitBreakerOpenException` - 熔断器打开时

#### call_async

```python
async def call_async(self, func: Callable, *args, **kwargs)
```

异步执行函数，带熔断保护。

**参数**：
- `func` - 异步函数
- `*args` - 位置参数
- `**kwargs` - 关键字参数

**返回**：协程结果

**抛出**：
- `CircuitBreakerOpenException` - 熔断器打开时

#### reset

```python
def reset(self) -> None
```

重置熔断器到初始状态。线程安全。

#### get_status

```python
def get_status(self) -> Dict[str, Any]
```

获取熔断器详细状态。

**返回**：包含名称、状态、配置、指标的字典

**示例**：

```python
status = breaker.get_status()
# {
#     'name': 'api',
#     'state': 'closed',
#     'failure_threshold': 5,
#     'success_threshold': 2,
#     'recovery_timeout': 60.0,
#     'metrics': {...}
# }
```

**上下文管理器**：

支持 `with` 语句：

```python
with CircuitBreaker(name="test") as breaker:
    result = breaker.call(func)
```

---

## 5. 管理器

### CircuitBreakerManager

```python
class CircuitBreakerManager
```

熔断器管理器（单例）。用于管理多个熔断器实例。

**方法**：

#### register

```python
def register(
    self,
    name: str,
    failure_threshold: int = 5,
    success_threshold: int = 2,
    recovery_timeout: float = 60.0,
) -> CircuitBreaker
```

注册熔断器。

**参数**：
- `name` - 熔断器名称
- `failure_threshold` - 失败阈值
- `success_threshold` - 成功阈值
- `recovery_timeout` - 恢复超时

**返回**：`CircuitBreaker` 实例

#### get

```python
def get(self, name: str) -> Optional[CircuitBreaker]
```

获取熔断器。

**参数**：`name` - 熔断器名称

**返回**：`CircuitBreaker` 或 None

#### get_or_create

```python
def get_or_create(self, name: str) -> CircuitBreaker
```

获取或创建熔断器。

**参数**：`name` - 熔断器名称

**返回**：`CircuitBreaker` 实例

#### unregister

```python
def unregister(self, name: str) -> bool
```

注销熔断器。

**参数**：`name` - 熔断器名称

**返回**：是否成功注销

#### get_all_status

```python
def get_all_status(self) -> Dict[str, Dict[str, Any]]
```

获取所有熔断器状态。

**返回**：名称到状态的映射字典

#### reset_all

```python
def reset_all(self) -> None
```

重置所有熔断器。

---

## 6. 装饰器

### circuit_breaker

```python
def circuit_breaker(
    name: str = None,
    failure_threshold: int = 5,
    success_threshold: int = 2,
    recovery_timeout: float = 60.0,
    excluded_exceptions: tuple = (),
) -> Callable
```

熔断器装饰器工厂函数。

**参数**：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `name` | str | None | 熔断器名称，默认使用函数名 |
| `failure_threshold` | int | 5 | 连续失败次数阈值 |
| `success_threshold` | int | 2 | 半开状态连续成功次数阈值 |
| `recovery_timeout` | float | 60.0 | 恢复超时（秒） |
| `excluded_exceptions` | tuple | () | 排除的异常类型 |

**返回**：装饰器函数

**示例**：

```python
@circuit_breaker(name="user_api", failure_threshold=3)
def get_user(user_id):
    return user_service.get(user_id)

@circuit_breaker(failure_threshold=5, recovery_timeout=120)
async def fetch_data():
    return await api.get()
```

**装饰器属性**：

装饰后的函数带有额外属性：

```python
@circuit_breaker(name="api")
def call_api():
    pass

call_api.breaker      # CircuitBreaker 实例
call_api.breaker_name # 熔断器名称 "api"
```
