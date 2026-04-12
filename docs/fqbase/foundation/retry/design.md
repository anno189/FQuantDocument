# 设计决策

## 重试模块架构

### 装饰器 vs 上下文管理器

FQBase retry 模块同时提供了装饰器和上下文管理器两种接口。这一设计源于不同使用场景的需求。

**装饰器适用场景:**

```python
@retry(stop_max_attempt_number=3)
def simple_operation():
    ...
```

**优点:**
- 声明式，使用简洁
- 函数级别，无需实例化
- 可组合其他装饰器

**上下文管理器适用场景:**

```python
ctx = create_retry_context(func=operation, max_attempts=5)
result = ctx.execute()

# 后续检查
if ctx.attempt_count > 1:
    logger.info(f"Operation succeeded after {ctx.attempt_count} attempts")
```

**优点:**
- 可在执行后查询状态
- 支持多次执行同一逻辑
- 更灵活的错误处理

**设计决策:** 同时保留两种接口，让调用者根据场景选择。装饰器适合简单场景，上下文管理器适合需要状态感知的复杂流程。

---

## 同步 vs 异步支持

### 分层设计

```python
# 同步版本
def retry(...):  # 基于 time.sleep
    ...

# 异步版本
async def async_retry_with_exponential_backoff(...):  # 基于 asyncio.sleep
    ...
```

**为什么不统一成一个装饰器?**

```python
# 理想但不可行的设计
@retry(async_mode=True)  # 需要运行时判断
async def func():
    ...
```

**原因:**

1. **类型系统限制:** Python 装饰器在定义时无法预知函数是同步还是异步
2. **运行时开销:** 在每次调用时检查 `asyncio.iscoroutinefunction()` 会有性能损失
3. **接口清晰性:** `async_retry_xxx` 明确表明这是异步专用

**设计决策:** 提供分离的同步和异步装饰器，在函数定义时就明确选择。这种方式类型安全且性能最优。

---

## 异常过滤机制

### 包含式 vs 排除式

```python
# 包含式：只有这些异常才重试
@retry(retry_on_exception=(ConnectionError, TimeoutError))
def func():
    ...

# 排除式（当前不支持）：除了这些异常都重试
@retry(retry_exceptions=(ValueError,))  # 不支持这种语法
def func():
    ...
```

**设计决策:** 仅支持包含式过滤。

**原因:**

1. **明确性:** 包含式更安全，列出所有已知可恢复异常
2. **防御性:** 排除式可能意外重试未知异常类型
3. **实践验证:** 主流重试库（Tenacity、Backoff）都采用包含式

**可选增强:** 如需排除式，可通过包装实现：

```python
from FQBase.Foundation.retry import retry

class ExcludeRetry:
    def __init__(self, exclude_exceptions):
        self.exclude_exceptions = exclude_exceptions

    def __call__(self, func):
        @retry(retry_on_exception=lambda e: not isinstance(e, self.exclude_exceptions))
        def wrapper(*args, **kwargs):
            return func(*args, **kwargs)
        return wrapper

@ExcludeRetry(exclude_exceptions=(ValueError,))
def func():
    ...
```

---

## 延迟策略设计

### 为什么是随机延迟?

```python
def retry(..., wait_random_min=0, wait_random_max=1000):
    wait_time = random.randint(wait_random_min, wait_random_max) / 1000.0
    time.sleep(wait_time)
```

**场景:** 多个客户端同时访问失败的服务

```
无随机延迟:
Client A ──► │ fail │ │ wait 1s │ │ retry │ ──► │ fail │ │ wait 1s │ ──► ...
Client B ──► │ fail │ │ wait 1s │ │ retry │ ──► │ fail │ │ wait 1s │ ──► ...
Client C ──► │ fail │ │ wait 1s │ │ retry │ ──► │ fail │ │ wait 1s │ ──► ...

所有客户端同步重试，造成惊群效应 (Thundering Herd)
```

```
有随机延迟:
Client A ──► │ fail │ │ wait 0.3s │ │ retry │ ──► │ success │
Client B ──► │ fail │ │ wait 0.8s │ │ retry │ ──► │ success │
Client C ──► │ fail │ │ wait 0.1s │ │ retry │ ──► │ success │

请求分散开，服务压力降低
```

**设计决策:** 默认随机延迟分散重试请求，避免惊群效应。

---

### 为什么是指数退避?

```python
wait_time = min(base_wait * (2 ** (attempt - 1)), max_wait) / 1000.0
```

**问题:** 如果服务暂时不可用，持续以固定频率重试会：

1. 延长服务恢复时间（大量请求冲击）
2. 浪费客户端资源
3. 可能被服务识别为恶意请求并封禁

**指数退避优势:**

| attempt | base_wait=100ms | 服务状态 |
|---------|------------------|----------|
| 1 | 100ms | 可能还在启动 |
| 2 | 200ms | 可能刚恢复 |
| 3 | 400ms | 大概率已恢复 |
| 4 | 800ms | 几乎肯定恢复 |
| 5 | 1000ms (capped) | 极可能长期故障，应报警 |

**设计决策:** 指数退避让重试间隔随失败次数增长，给服务恢复留出时间。

---

## `max_total_time` 参数

### 必要性

```python
@retry_with_exponential_backoff(max_attempts=10, max_total_time=60.0)
def long_retrying():
    ...
```

**问题场景:**

```
服务故障 5 分钟后恢复
- max_attempts=10, base_wait=100, max_wait=60000
- 重试序列: 0.1s, 0.2s, 0.4s, 0.8s, 1.6s, 3.2s, 6.4s, 12.8s, 25.6s, 51.2s
- 总计约 102 秒

客户端期望: 最长等待 60 秒
实际情况: 可能等待 102 秒
```

**设计决策:** 提供 `max_total_time` 参数作为双重保险，即使重试次数未耗尽，超过总时间也停止。

**注意:** 此参数仅在 `retry_with_exponential_backoff` 中支持，因为固定延迟场景下总时间可预估。

---

## `on_retry` 回调设计

### 函数签名

```python
on_retry: Optional[Callable[[int, Exception], None]] = None
```

**为什么不是更复杂的对象?**

```python
# 复杂方案 (Rejected)
class RetryCallback:
    def on_retry(self, context: RetryContext): ...
    def on_success(self, context: RetryContext): ...
    def on_exhausted(self, context: RetryContext): ...

# 简单方案 (Adopted)
on_retry: Callable[[int, Exception], None]
```

**设计决策:** 简单函数签名优于复杂回调对象。

**原因:**

1. **最小接口:** 只需知道重试次数和异常
2. **灵活性:** 调用者可自由实现任何逻辑
3. **可组合性:** 多个回调可通过闭包组合
4. **框架无关:** 不依赖 FQBase 其他组件

**示例: 组合多个回调**

```python
def composed_callback(*callbacks):
    def wrapper(attempt, exception):
        for cb in callbacks:
            cb(attempt, exception)
    return wrapper

@retry(
    stop_max_attempt_number=3,
    on_retry=composed_callback(logging_callback, metrics_callback, alert_callback)
)
def func():
    ...
```

---

## `@wraps` 的使用

```python
from functools import wraps

def decorator(func):
    @wraps(func)  # 保留原函数元信息
    def wrapper(*args, **kwargs):
        ...
    return wrapper
```

**保留的信息:**

| 属性 | 无 @wraps | 有 @wraps |
|------|-----------|-----------|
| `__name__` | `"wrapper"` | `"original_func"` |
| `__doc__` | `None` | 原函数文档 |
| `__module__` | `"FQBase..."` | 原函数模块 |
| 签名 | 隐藏 | 可通过 inspect 访问 |

**重要性:**

```python
@retry(stop_max_attempt_number=3)
def critical_operation():
    """执行关键操作，返回结果"""
    ...

# 调试时
print(critical_operation.__name__)  # "critical_operation"
print(critical_operation.__doc__)    # "执行关键操作，返回结果"

# 反射
import inspect
sig = inspect.signature(critical_operation)  # 可获取参数信息
```

**设计决策:** 使用 `@wraps` 保留函数元信息，支持调试、文档和反射场景。

---

## `RetryError` 异常的设计

```python
class RetryError(Exception):
    def __init__(self, message: str, last_exception: Optional[Exception] = None):
        super().__init__(message)
        self.last_exception = last_exception
```

**为什么需要包装?**

```python
# 问题：直接抛出原始异常丢失上下文
@retry(stop_max_attempt_number=3)
def func():
    raise ConnectionError("service unavailable")

# 调用者只能看到 ConnectionError，不知道重试了多少次

# 解决方案：RetryError 携带额外信息
try:
    ctx.execute()
except RetryError as e:
    print(f"重试耗尽，最后异常: {e.last_exception}")
    print(f"尝试次数: {ctx.attempt_count}")
```

**设计决策:** `RetryError` 可选包装最后一次异常，但核心函数默认直接抛出原异常以保持向后兼容。

---

## 毫秒 vs 秒

```python
# 参数单位：毫秒
wait_random_min: int = 0      # 0ms
wait_random_max: int = 1000    # 1000ms = 1s
base_wait: int = 100           # 100ms

# 内部转换：除以 1000.0 转为秒
wait_time = random.randint(wait_random_min, wait_random_max) / 1000.0
time.sleep(wait_time)
```

**为什么不统一用秒?**

```python
# 方案 A: 秒 (Rejected)
wait_random_max: float = 1.0  # 1.0 秒

# 问题：常见值需要小数
@retry(wait_random_min=0.05, wait_random_max=0.1)  # 不直观

# 方案 B: 毫秒 (Adopted)
wait_random_max: int = 1000   # 1000 毫秒

# 优点：整数更直观
@retry(wait_random_min=50, wait_random_max=100)  # 50-100ms
@retry(wait_random_min=1000, wait_random_max=5000)  # 1-5s
```

**设计决策:** 使用毫秒整数作为参数单位，转换为秒后传给 `time.sleep()`。这样配置更直观，避免小数点混淆。

---

## 不可重试异常的传播策略

```python
try:
    return func(*args, **kwargs)
except Exception as e:
    if retry_on_exception and not isinstance(e, retry_on_exception):
        raise  # 立即向上传播
    # 否则进入重试逻辑
```

**设计决策:** 非目标异常立即抛出，不消耗重试次数。

**理由:**

1. **资源保护:** 不对不可恢复异常浪费重试次数
2. **快速失败:** 调用者可立即处理错误
3. **语义正确:** 明确区分"需要重试"和"不应该重试"

**示例:**

```python
@retry(stop_max_attempt_number=3, retry_on_exception=(ConnectionError,))
def func():
    raise ValueError("Invalid input")  # 不重试，立即抛出

# ValueError 不在 retry_on_exception 中，所以立即传播
# 如果重试 3 次才抛出，会浪费时间和资源
```

---

## 与其他库的权衡

### vs Tenacity

| 特性 | FQBase retry | Tenacity |
|------|-------------|----------|
| API 复杂度 | 简单 | 丰富 |
| 装饰器 | 支持 | 支持 |
| 上下文管理器 | 支持 | 支持 |
| 异步支持 | 分离函数 | 统一接口 |
| 重试条件 | 异常类型 | 任意条件 |
| Jitter | 固定随机 | 多种策略 |

**FQBase 优势:** 轻量、简单、适合内部服务

**Tenacity 优势:** 功能丰富、适合库发布

---

### vs Backoff

| 特性 | FQBase retry | Backoff |
|------|-------------|---------|
| 装饰器 | 支持 | 支持 |
| 指数退避 | 支持 | 支持 |
| 最大时间 | 支持 | 不支持 |
| 异步 | 分离函数 | 统一装饰器 |

**设计原则:** FQBase retry 优先简单性和可维护性，不过度设计。
