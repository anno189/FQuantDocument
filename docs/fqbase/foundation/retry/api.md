# API 参考

## retry 模块

`FQBase.Foundation.retry` 模块提供函数级重试装饰器，支持固定延迟、指数退避、异步重试等多种重试策略。

---

## 核心函数

### `retry`

随机延迟重试装饰器。

```python
@retry(stop_max_attempt_number=3, wait_random_min=0, wait_random_max=1000,
       retry_on_exception=None, on_retry=None)
def func():
    ...
```

**参数:**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `stop_max_attempt_number` | `int` | `3` | 最大重试次数（含首次调用） |
| `wait_random_min` | `int` | `0` | 最小等待时间（毫秒） |
| `wait_random_max` | `int` | `1000` | 最大等待时间（毫秒） |
| `retry_on_exception` | `Optional[Tuple[type, ...]]` | `None` | 需要重试的异常类型元组，`None` 表示重试所有异常 |
| `on_retry` | `Optional[Callable[[int, Exception], None]]` | `None` | 每次重试前的回调函数，签名为 `(attempt: int, exception: Exception) -> None` |

**返回值:** `Callable` - 装饰后的函数包装器

**行为:**

1. 如果 `retry_on_exception` 为 `None`，所有异常都会触发重试
2. 如果指定了 `retry_on_exception`，只有匹配的异常才会触发重试，其他异常立即向上传播
3. 重试次数耗尽后，抛出最后一次捕获的异常
4. 等待时间在 `wait_random_min` 和 `wait_random_max` 之间随机选择

---

### `retry_with_exponential_backoff`

指数退避重试装饰器。

```python
@retry_with_exponential_backoff(max_attempts=3, base_wait=100, max_wait=10000,
                                 max_total_time=None, retry_on_exception=None,
                                 on_retry=None)
def func():
    ...
```

**参数:**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `max_attempts` | `int` | `3` | 最大重试次数（含首次调用） |
| `base_wait` | `int` | `100` | 基础等待时间（毫秒） |
| `max_wait` | `int` | `10000` | 最大等待时间（毫秒） |
| `max_total_time` | `Optional[float]` | `None` | 最大总耗时（秒），超时后停止重试 |
| `retry_on_exception` | `Optional[Tuple[type, ...]]` | `None` | 需要重试的异常类型元组 |
| `on_retry` | `Optional[Callable[[int, Exception], None]]` | `None` | 回调函数 |

**退避时间计算:**

```
wait_time = min(base_wait * (2 ** (attempt - 1)), max_wait) / 1000.0
```

| attempt | base_wait=100 | base_wait=500 |
|---------|---------------|---------------|
| 1 | 100ms | 500ms |
| 2 | 200ms | 1000ms |
| 3 | 400ms | 2000ms |
| 4 | 800ms | 4000ms |
| 5 | 1000ms (capped) | 5000ms (capped) |

---

### `async_retry_with_exponential_backoff`

异步指数退避重试装饰器。

```python
@async_retry_with_exponential_backoff(max_attempts=3, base_wait=100, max_wait=10000,
                                      retry_on_exception=None)
async def func():
    ...
```

**参数:**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `max_attempts` | `int` | `3` | 最大重试次数 |
| `base_wait` | `int` | `100` | 基础等待时间（毫秒） |
| `max_wait` | `int` | `10000` | 最大等待时间（毫秒） |
| `retry_on_exception` | `Optional[Tuple[type, ...]]` | `None` | 需要重试的异常类型元组 |

**注意:** 此装饰器不支持 `on_retry` 回调和 `max_total_time` 参数。

---

## RetryContext 类

面向对象重试上下文，支持状态跟踪和多次执行。

```python
class RetryContext:
    def __init__(self, func, max_attempts=3, wait_min=0, wait_max=1000,
                 retry_on_exception=None, on_retry=None)
    def execute(self, *args, **kwargs) -> Any
    @property
    def attempt_count(self) -> int
```

**属性:**

| 属性 | 类型 | 只读 | 说明 |
|------|------|------|------|
| `func` | `Callable` | 是 | 被包装的函数 |
| `max_attempts` | `int` | 是 | 最大重试次数 |
| `attempt_count` | `int` | 是 | 当前执行尝试次数 |

**方法:**

#### `execute(*args, **kwargs) -> Any`

执行函数，支持重试。

**返回值:** 函数的返回值

**行为:**

1. 每次调用重置 `attempt_count` 为 0
2. 执行失败时根据配置重试
3. 所有重试耗尽后抛出最后一次异常

---

## 工厂函数

### `create_retry_context`

创建 `RetryContext` 实例的工厂函数。

```python
def create_retry_context(func, max_attempts=3, wait_min=0, wait_max=1000,
                         retry_on_exception=None, on_retry=None) -> RetryContext
```

**参数:**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `func` | `Callable` | - | 要重试的函数 |
| `max_attempts` | `int` | `3` | 最大重试次数 |
| `wait_min` | `int` | `0` | 最小等待时间（毫秒） |
| `wait_max` | `int` | `1000` | 最大等待时间（毫秒） |
| `retry_on_exception` | `Optional[Tuple[type, ...]]` | `None` | 需要重试的异常类型 |
| `on_retry` | `Optional[Callable[[int, Exception], None]]` | `None` | 回调函数 |

**返回值:** 配置好的 `RetryContext` 实例

---

## 异常类

### `RetryError`

重试失败异常。

```python
class RetryError(Exception):
    def __init__(self, message: str, last_exception: Optional[Exception] = None)
    @property
    def last_exception(self) -> Optional[Exception]
```

**属性:**

| 属性 | 类型 | 说明 |
|------|------|------|
| `last_exception` | `Optional[Exception]` | 最后一次捕获的异常 |

**注意:** 当前模块中 `RetryError` 已定义但未在核心函数中使用，主要用于需要自定义重试失败处理的场景。

---

## 类型别名

模块未定义显式类型别名，所有类型注解直接使用标准库类型。

---

## 异常过滤行为

```
                    ┌─────────────────────────────┐
                    │     异常发生                │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │  retry_on_exception is None? │
                    └──────────────┬──────────────┘
                          │                │
                         Yes              No
                          │                │
                          ▼                ▼
              ┌───────────────────┐  ┌───────────────────┐
              │   触发重试逻辑    │  │ isinstance(e,     │
              │                   │  │   retry_on_exception) │
              └───────────────────┘  └─────────┬─────────┘
                                               │
                                    ┌──────────┴──────────┐
                                   Yes                   No
                                    │                    │
                                    ▼                    ▼
                        ┌───────────────────┐  ┌───────────────────┐
                        │   触发重试逻辑    │  │   立即 raise      │
                        └───────────────────┘  └───────────────────┘
```
