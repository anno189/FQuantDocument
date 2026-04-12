# 使用指南

## 基础用法

### 简单重试

```python
from FQBase.Foundation.retry import retry

@retry(stop_max_attempt_number=3)
def fetch_data():
    response = http_client.get("https://api.example.com/data")
    return response.json()
```

### 随机延迟重试

```python
@retry(stop_max_attempt_number=5, wait_random_min=100, wait_random_max=500)
def call_api():
    return api.request()
```

### 指数退避重试

```python
from FQBase.Foundation.retry import retry_with_exponential_backoff

@retry_with_exponential_backoff(max_attempts=4, base_wait=200, max_wait=5000)
def get_stock_price():
    return stock_api.get_price("AAPL")
```

---

## 异常过滤

### 只重试特定异常

```python
@retry(stop_max_attempt_number=3, retry_on_exception=(ConnectionError, TimeoutError))
def network_call():
    return http_client.get(url)
```

### 多异常类型过滤

```python
from requests.exceptions import ConnectionError, Timeout
from FQBase.Foundation.retry import retry

@retry(stop_max_attempt_number=5, retry_on_exception=(ConnectionError, Timeout))
def fetch_with_retry():
    return requests.get("https://api.example.com/data")
```

### 区分可恢复和不可恢复异常

```python
@retry(stop_max_attempt_number=3, retry_on_exception=(TemporaryError, RateLimitError))
def fragile_operation():
    if resource_not_found():
        raise PermanentError("Cannot recover")  # 不会重试，立即抛出
    return operation()
```

---

## 回调函数

### 日志记录

```python
import logging

logger = logging.getLogger(__name__)

def log_retry(attempt: int, exception: Exception):
    logger.warning(f"Attempt {attempt} failed: {type(exception).__name__}: {exception}")

@retry(stop_max_attempt_number=3, on_retry=log_retry)
def unreliable_service():
    return service.call()
```

### 指标收集

```python
from prometheus_client import Counter

retry_counter = Counter('retry_attempts_total', 'Total retry attempts', ['function'])

def count_retry(attempt: int, exception: Exception):
    retry_counter.labels(function='unreliable_service').inc()

@retry(stop_max_attempt_number=5, on_retry=count_retry)
def unreliable_service():
    return service.call()
```

### 告警通知

```python
import alerts

def notify_retry(attempt: int, exception: Exception):
    if attempt >= 3:
        alerts.send(f"Persistent failure after {attempt} attempts: {exception}")

@retry(stop_max_attempt_number=5, on_retry=notify_retry)
def critical_operation():
    return trading_engine.execute(order)
```

---

## 异步重试

### 异步指数退避

```python
import asyncio
from FQBase.Foundation.retry import async_retry_with_exponential_backoff

@async_retry_with_exponential_backoff(max_attempts=3, base_wait=100, max_wait=2000)
async def fetch_data_async():
    async with aiohttp.ClientSession() as session:
        async with session.get('https://api.example.com/data') as resp:
            return await resp.json()
```

### 异步上下文管理器

```python
@retry_with_exponential_backoff(max_attempts=3)
async def process_queue():
    async with RedisClient() as client:
        task = await client.dequeue()
        return await process(task)
```

---

## RetryContext 用法

### 手动控制重试

```python
from FQBase.Foundation.retry import create_retry_context

ctx = create_retry_context(
    func=fragile_operation,
    max_attempts=5,
    wait_min=100,
    wait_max=1000
)

# 检查执行前状态
print(f"Will attempt up to {ctx.max_attempts} times")

# 执行
result = ctx.execute()

# 检查执行后状态
print(f"Completed after {ctx.attempt_count} attempts")
```

### 多次执行同一上下文

```python
ctx = create_retry_context(func=batch_job, max_attempts=3)

for item in items:
    ctx.execute(item)  # 每次执行重置 attempt_count
    print(f"Processed item after {ctx.attempt_count} attempts")
```

### 带回调的上下文

```python
from FQBase.Foundation.retry import create_retry_context

def on_retry(attempt: int, exc: Exception):
    logger.info(f"Retry {attempt}: {exc}")

ctx = create_retry_context(
    func=api_call,
    max_attempts=5,
    wait_min=200,
    wait_max=2000,
    on_retry=on_retry
)
```

---

## 超时控制

### 最大总时间限制

```python
@retry_with_exponential_backoff(max_attempts=10, max_total_time=30.0)
def long_running_operation():
    return service.call()
```

### 结合其他超时机制

```python
import signal
from functools import wraps

class TimeoutError(Exception):
    pass

def timeout(seconds):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            def handler(signum, frame):
                raise TimeoutError(f"{func.__name__} timed out after {seconds}s")
            signal.signal(signal.SIGALRM, handler)
            signal.alarm(seconds)
            try:
                return func(*args, **kwargs)
            finally:
                signal.alarm(0)
        return wrapper
    return decorator

@timeout(5)
@retry_with_exponential_backoff(max_attempts=3, max_total_time=3.0)
def timed_retry_operation():
    return service.call()
```

---

## 装饰器组合

### 重试 + 日志

```python
def retry_with_logging(func):
    logger = logging.getLogger(func.__module__)

    def log_retry(attempt, exc):
        logger.debug(f"{func.__name__} retry {attempt}: {exc}")

    return retry(
        stop_max_attempt_number=3,
        wait_random_min=50,
        wait_random_max=200,
        on_retry=log_retry
    )(func)

@retry_with_logging
def unreliable_operation():
    return service.call()
```

### 自定义重试装饰器工厂

```python
def create_retry_decorator(max_attempts=3, base_wait=100, exceptions=(Exception,)):
    def decorator(func):
        return retry_with_exponential_backoff(
            max_attempts=max_attempts,
            base_wait=base_wait,
            retry_on_exception=exceptions
        )(func)
    return decorator

# 使用
@create_retry_decorator(max_attempts=5, base_wait=200, exceptions=(ConnectionError,))
def network_call():
    return http.get(url)
```

---

## 实际应用场景

### 数据库连接重试

```python
from FQBase.Foundation.retry import retry_with_exponential_backoff

@retry_with_exponential_backoff(max_attempts=5, base_wait=100, max_wait=3000,
                                 retry_on_exception=(ConnectionError, OperationalError))
def get_database_connection():
    return engine.connect()
```

### 第三方 API 调用

```python
@retry_with_exponential_backoff(max_attempts=3, base_wait=500, max_wait=5000,
                                 retry_on_exception=(RateLimitError, ServiceUnavailable))
def call_market_data_api():
    return market_data.get_quotes(symbols)
```

### 分布式锁获取

```python
@retry(stop_max_attempt_number=10, wait_random_min=50, wait_random_max=200,
       retry_on_exception=(LockNotAvailableError,))
def acquire_lock_with_retry(lock_key: str):
    return distributed_lock.acquire(lock_key, timeout=30)
```

### 消息队列消费

```python
@retry_with_exponential_backoff(max_attempts=3, base_wait=1000, max_wait=10000)
def process_message(msg):
    try:
        return handler.handle(msg)
    except ValidationError:
        msg.nack()  # 不重试
        raise
    except ProcessingError:
        msg.nack(requeue=True)  # 重试
        raise
```
