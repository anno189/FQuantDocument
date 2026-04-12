# 最佳实践

## 装饰器选择

### 根据延迟策略选择

| 场景 | 推荐装饰器 | 原因 |
|------|-----------|------|
| 快速失败的瞬时错误 | `retry` | 随机延迟快速重试 |
| 网络波动场景 | `retry_with_exponential_backoff` | 避免重试风暴 |
| 异步 IO 操作 | `async_retry_with_exponential_backoff` | 非阻塞等待 |
| 需要状态跟踪 | `RetryContext` | 可查询 attempt_count |

### 延迟时间设置

```python
# 最佳实践：设置合理的延迟范围
@retry(stop_max_attempt_number=3, wait_random_min=100, wait_random_max=500)
def fast_operation():
    ...

# 避免：过长的默认延迟
@retry(stop_max_attempt_number=3, wait_random_min=0, wait_random_max=10000)  # 10秒可能过长
def slow_default():
    ...

# 指数退避：合理的 base_wait
@retry_with_exponential_backoff(max_attempts=5, base_wait=100, max_wait=5000)
def reasonable_backoff():
    ...
```

---

## 重试次数配置

### 根据操作重要性调整

```python
# 关键交易操作：更多重试
@retry_with_exponential_backoff(max_attempts=5, base_wait=200, max_wait=5000)
def execute_trade():
    return trading_engine.execute(order)

# 非关键日志：更少重试
@retry(stop_max_attempt_number=2, wait_random_min=10, wait_random_max=100)
def send_analytics():
    analytics.track(event)
```

### 根据成功率调整

```python
# 高可靠性服务（>99%）
@retry(stop_max_attempt_number=3)
def reliable_service():
    ...

# 中等可靠性服务（95-99%）
@retry(stop_max_attempt_number=5, wait_random_min=100, wait_random_max=500)
def moderate_service():
    ...

# 低可靠性服务（<95%）
@retry_with_exponential_backoff(max_attempts=10, base_wait=500, max_wait=30000)
def unreliable_service():
    ...
```

---

## 异常过滤最佳实践

### 明确区分可恢复异常

```python
from enum import Enum

class ErrorType(Enum):
    RECOVERABLE = "recoverable"
    PERMANENT = "permanent"

# 方案 1：在函数内部判断
@retry(retry_on_exception=(TemporaryError, NetworkError))
def operation():
    error = do_work()
    if error.is_permanent:
        raise PermanentError(error.message)  # 不重试
    raise TemporaryError(error.message)  # 重试

# 方案 2：使用异常层次结构
class RecoverableError(Exception):
    pass

class PermanentError(Exception):
    pass

@retry(retry_on_exception=(RecoverableError,))
def fragile_operation():
    result = do_work()
    if not result.success:
        if result.permanent_failure:
            raise PermanentError(result.message)
        raise RecoverableError(result.message)
```

### 异常白名单 vs 黑名单

```python
# 白名单（推荐）：明确指定需要重试的异常
@retry(retry_on_exception=(ConnectionError, TimeoutError, ServiceUnavailable))
def api_call():
    ...

# 黑名单：明确指定不需要重试的异常
@retry(retry_on_exception=lambda e: not isinstance(e, (ValueError, TypeError)))
def data_processing():
    ...
```

---

## 日志记录策略

### 分层日志

```python
import logging

logger = logging.getLogger(__name__)

def retry_logger(attempt: int, exception: Exception):
    if attempt <= 2:
        logger.debug(f"Attempt {attempt} failed: {exception}")
    elif attempt <= 4:
        logger.warning(f"Attempt {attempt} failed: {exception}")
    else:
        logger.error(f"Attempt {attempt} failed after multiple retries: {exception}")

@retry(stop_max_attempt_number=5, on_retry=retry_logger)
def logged_operation():
    ...
```

### 避免日志泄露敏感信息

```python
def safe_retry_logger(attempt: int, exception: Exception):
    # 不记录异常详情中的敏感信息
    logger.warning(
        f"Attempt {attempt} failed: {type(exception).__name__} "
        f"(message: {str(exception)[:50]}...)"  # 截断敏感内容
    )

@retry(on_retry=safe_retry_logger)
def operation_with_sensitive_data():
    ...
```

---

## 超时控制

### 设置最大总时间

```python
# 避免无限重试
@retry_with_exponential_backoff(
    max_attempts=10,
    max_total_time=60.0,  # 最多重试60秒
    retry_on_exception=(ConnectionError,)
)
def bounded_retry():
    ...
```

### 优雅降级

```python
from FQBase.Foundation.retry import retry_with_exponential_backoff

class FallbackCache:
    def get(self, key):
        return cache.get(key)  # 可能返回 None

@retry_with_exponential_backoff(max_attempts=3, max_total_time=5.0)
def get_with_fallback(key):
    try:
        return primary_source.fetch(key)
    except ServiceError:
        return FallbackCache().get(key)  # 降级到缓存
```

---

## 幂等性考虑

### 确保重试安全

```python
# 错误示例：非幂等操作重试可能有问题
@retry(stop_max_attempt_number=3)
def debit_account():
    # 每次重试都会扣款！
    return payment_service.charge(customer_id, amount)

# 正确示例：使用幂等键
@retry(stop_max_attempt_number=3)
def idempotent_debit():
    idempotency_key = f"charge_{customer_id}_{order_id}"
    return payment_service.charge(customer_id, amount, idempotency_key=idempotency_key)
```

### 状态检查点

```python
from FQBase.Foundation.retry import RetryContext, create_retry_context

ctx = create_retry_context(func=resumeable_operation, max_attempts=5)

# 检查点保存
def save_checkpoint(state):
    persistent_storage.save("operation_checkpoint", state)

# 可恢复操作
def resumeable_operation(item):
    checkpoint = load_checkpoint(item.id)
    if checkpoint:
        operation.restore_state(checkpoint)
    result = operation.process(item)
    if operation.has_more_work():
        save_checkpoint(operation.get_state())
        raise TemporaryHalt("Checkpoint saved")
    return result
```

---

## 性能优化

### 避免重试期间的阻塞

```python
# 异步场景使用异步重试
@async_retry_with_exponential_backoff(max_attempts=3, base_wait=100)
async def async_operation():
    await some_async_service.call()

# 批量操作：重试整个批次而非单个
@retry(stop_max_attempt_number=3, retry_on_exception=(BatchError,))
def process_batch(items):
    return batch_processor.process(items)  # 重试整个批次
```

### 减少重试开销

```python
# 合并小请求
@retry_with_exponential_backoff(max_attempts=3)
def batched_request():
    if not request_queue.is_full():
        request_queue.add(current_request)
    if request_queue.should_flush():
        return request_queue.flush()  # 批量处理减少重试次数
    return None
```

---

## 测试策略

### 模拟重试行为

```python
import pytest
from unittest.mock import Mock, patch
from FQBase.Foundation.retry import retry

def test_retry_succeeds_on_second_attempt():
    mock_func = Mock(side_effect=[ConnectionError("fail"), "success"])

    with patch('FQBase.Foundation.retry.time.sleep'):
        result = retry(stop_max_attempt_number=3)(mock_func)()

    assert result == "success"
    assert mock_func.call_count == 2

def test_retry_exhausted_raises():
    error = ConnectionError("persistent failure")
    mock_func = Mock(side_effect=error)

    with pytest.raises(ConnectionError):
        with patch('FQBase.Foundation.retry.time.sleep'):
            retry(stop_max_attempt_number=3)(mock_func)()

    assert mock_func.call_count == 3
```

### 测试异常过滤

```python
def test_non_matching_exception_not_retried():
    mock_func = Mock(side_effect=[ValueError("ignored"), "success"])

    @retry(stop_max_attempt_number=3, retry_on_exception=(ConnectionError,))
    def func():
        return mock_func()

    result = func()
    assert result == "success"
    assert mock_func.call_count == 1  # ValueError 立即抛出，不重试
```

---

## 监控和告警

### Prometheus 指标

```python
from prometheus_client import Counter, Histogram, Gauge

retry_attempts = Counter('retry_attempts_total', 'Total retry attempts',
                         ['function', 'exception_type'])
retry_failures = Counter('retry_failures_total', 'Total retry failures',
                        ['function'])
retry_duration = Histogram('retry_duration_seconds', 'Retry duration',
                           ['function'])

def metrics_retry_callback(attempt: int, exception: Exception):
    retry_attempts.labels(
        function='api_call',
        exception_type=type(exception).__name__
    ).inc()

@retry(stop_max_attempt_number=5, on_retry=metrics_retry_callback)
def monitored_api_call():
    ...
```

### 结构化日志

```python
import json
import logging

class StructuredRetryLogger:
    def __init__(self, logger):
        self.logger = logger

    def __call__(self, attempt: int, exception: Exception):
        self.logger.warning(json.dumps({
            "event": "retry_attempt",
            "attempt": attempt,
            "exception_type": type(exception).__name__,
            "exception_message": str(exception),
            "timestamp": time.time()
        }))

@retry(on_retry=StructuredRetryLogger(logging.getLogger(__name__)))
def api_call():
    ...
```

---

## 反模式

### 避免在重试中做永久性改变

```python
# 反模式
@retry(stop_max_attempt_number=3)
def unsafe_operation():
    state.commit()  # 每次重试都会提交！
    return service.process()

# 正确做法
def safe_operation():
    result = service.process()
    state.commit()  # 只在成功后提交
    return result

retry_safe = retry(stop_max_attempt_number=3)(safe_operation)
```

### 避免重试副作用

```python
# 反模式：重试发送通知
@retry(stop_max_attempt_number=3)
def send_notification():
    notification_service.send_alert()  # 用户可能收到多条通知！

# 正确做法：使用幂等通知
@retry(stop_max_attempt_number=3)
def send_idempotent_notification():
    notification_service.send_alert(idempotency_key=alert_id)  # 相同 key 只发送一次
```

### 避免嵌套重试

```python
# 反模式
@retry(stop_max_attempt_number=3)
def outer_operation():
    @retry(stop_max_attempt_number=3)  # 嵌套重试
    def inner_operation():
        ...
    return inner_operation()

# 正确做法
@retry(stop_max_attempt_number=9)  # 单层重试
def flat_operation():
    ...
```
