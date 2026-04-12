# Retry 开发指南

## 模块简介

`retry` 模块提供重试装饰器，支持固定延迟、随机延迟、指数退避等多种重试策略。

### 核心组件

| 组件 | 类型 | 说明 |
|------|------|------|
| `retry` | 装饰器 | 基础重试装饰器 |
| `retry_with_exponential_backoff` | 装饰器 | 指数退避重试 |
| `async_retry_with_exponential_backoff` | 装饰器 | 异步指数退避重试 |
| `RetryContext` | 类 | 重试上下文 |
| `RetryError` | 异常 | 重试失败异常 |
| `create_retry_context` | 函数 | 创建重试上下文工厂 |

---

## 开发环境

### 环境要求

- Python 3.8+
- pytest（用于测试）

### 安装

```bash
cd /Users/A.D.189/FQuant/FQuant.Server/FQBase
pip install -e .
```

### 验证安装

```bash
python -c "from FQBase.Foundation.retry import retry, retry_with_exponential_backoff; print('OK')"
```

---

## 本地调试

### 基本调试流程

```python
from FQBase.Foundation.retry import retry, retry_with_exponential_backoff
import logging

# 启用调试日志
logging.getLogger().setLevel(logging.DEBUG)

@retry(stop_max_attempt_number=3, wait_random_min=100, wait_random_max=500)
def fetch_data():
    print("Fetching data...")
    return api.get()

# 测试
result = fetch_data()
```

### 调试重试上下文

```python
from FQBase.Foundation.retry import RetryContext, RetryError

ctx = RetryContext(
    func=fetch_data,
    max_attempts=3,
    wait_min=100,
    wait_max=500
)

try:
    result = ctx.execute()
except RetryError as e:
    print(f"Retry failed: {e}")
    print(f"Last exception: {e.last_exception}")
```

### 调试指数退避

```python
from FQBase.Foundation.retry import retry_with_exponential_backoff

@retry_with_exponential_backoff(
    max_attempts=5,
    base_wait=100,  # 100ms
    max_wait=5000   # 5s
)
def fetch_with_backoff():
    # 等待时间: 100ms, 200ms, 400ms, 800ms, 1600ms
    return api.get()
```

---

## 测试指南

### 运行测试

```bash
cd /Users/A.D.189/FQuant/FQuant.Server/FQBase
pytest -v FQBase/Foundation/test_retry.py
```

### 测试结构

```python
import pytest
from FQBase.Foundation.retry import retry, retry_with_exponential_backoff, RetryContext

class TestRetry:
    def test_success_without_retry(self):
        call_count = 0

        @retry(stop_max_attempt_number=3)
        def succeed():
            nonlocal call_count
            call_count += 1
            return "success"

        result = succeed()
        assert result == "success"
        assert call_count == 1

    def test_retry_on_failure(self):
        call_count = 0

        @retry(stop_max_attempt_number=3)
        def fail_twice():
            nonlocal call_count
            call_count += 1
            if call_count < 3:
                raise Exception("Temporary error")
            return "success"

        result = fail_twice()
        assert result == "success"
        assert call_count == 3

    def test_exhausted_retries(self):
        call_count = 0

        @retry(stop_max_attempt_number=3)
        def always_fail():
            nonlocal call_count
            call_count += 1
            raise Exception("Permanent error")

        with pytest.raises(Exception) as exc_info:
            always_fail()

        assert call_count == 3
        assert str(exc_info.value) == "Permanent error"
```

### 测试异常过滤

```python
class TestExceptionFilter:
    def test_retry_specific_exceptions(self):
        call_count = 0

        @retry(stop_max_attempt_number=3, retry_on_exception=(ConnectionError, TimeoutError))
        def fail_with_connection():
            nonlocal call_count
            call_count += 1
            if call_count < 3:
                raise ConnectionError("Connection failed")
            return "success"

        result = fail_with_connection()
        assert result == "success"

    def test_non_retryable_exception(self):
        call_count = 0

        @retry(stop_max_attempt_number=3, retry_on_exception=(ConnectionError,))
        def fail_with_value_error():
            nonlocal call_count
            call_count += 1
            raise ValueError("Not retryable")

        with pytest.raises(ValueError):
            fail_with_value_error()

        assert call_count == 1  # 立即失败，不重试
```

### 测试指数退避

```python
class TestExponentialBackoff:
    def test_backoff_timing(self):
        import time

        call_count = 0
        timings = []

        @retry_with_exponential_backoff(max_attempts=4, base_wait=100)
        def fail_three_times():
            nonlocal call_count
            call_count += 1
            start = time.time()
            if call_count < 4:
                raise Exception("Error")
            timings.append(time.time() - start)
            return "success"

        succeed = fail_three_times()

        # 等待时间: 100ms, 200ms, 400ms
        assert call_count == 4
        assert len(timings) == 4
```

---

## 代码规范

### 重试次数规范

```python
# 推荐：合理的重试次数
@retry(stop_max_attempt_number=3)  # 最多3次
def call_api():
    pass

# 避免：过多重试
@retry(stop_max_attempt_number=10)  # 可能导致长时间阻塞
def unreliable_call():
    pass
```

### 等待时间规范

```python
# 推荐：设置合理的等待时间
@retry_with_exponential_backoff(
    max_attempts=5,
    base_wait=100,  # 100ms 起步
    max_wait=5000   # 最多等 5 秒
)
def call_api():
    pass

# 避免：等待时间过长
@retry_with_exponential_backoff(
    base_wait=10000,  # 10秒起步太长
    max_wait=60000    # 最多等1分钟
)
def call_api():
    pass
```

### 异常过滤规范

```python
# 推荐：明确指定可重试的异常
@retry(retry_on_exception=(ConnectionError, TimeoutError, HTTPError))
def call_api():
    pass

# 避免：重试所有异常（包括业务异常）
@retry  # 会重试所有异常，包括 ValueError, KeyError 等
def call_api():
    if invalid_input:
        raise ValueError("Invalid input")  # 不应重试
    pass
```

---

## 调试技巧

### 打印重试日志

```python
import logging

logging.basicConfig(level=logging.DEBUG)

@retry(stop_max_attempt_number=3, on_retry=lambda attempt, exc: print(f"Retry {attempt}: {exc}"))
def failing_func():
    raise Exception("Error")
```

### 自定义重试回调

```python
from FQBase.Foundation.retry import retry

def log_retry(attempt, exception):
    """自定义重试日志"""
    logger.warning(f"Attempt {attempt} failed: {exception}")
    metrics.increment("retry_count")

@retry(stop_max_attempt_number=5, on_retry=log_retry)
def call_service():
    pass
```

### 测试重试上下文

```python
ctx = create_retry_context(
    func=fetch_data,
    max_attempts=3,
    wait_min=100,
    wait_max=500,
    on_retry=lambda attempt, exc: print(f"Retry {attempt}")
)

result = ctx.execute()
```

---

## 常见问题

### Q: 如何选择重试策略？

| 场景 | 推荐策略 |
|------|----------|
| 快速失败场景 | `@retry(stop_max_attempt_number=2)` |
| 网络调用 | `@retry_with_exponential_backoff(base_wait=100)` |
| 外部 API | `@retry_with_exponential_backoff(base_wait=500, max_wait=30000)` |
| 数据库操作 | `@retry(stop_max_attempt_number=3, wait_random_min=50, wait_random_max=200)` |

### Q: 如何避免重试风暴？

当多个实例同时失败时，可能导致重试风暴：

```python
# 添加抖动（jitter）避免同步重试
@retry_with_exponential_backoff(
    max_attempts=5,
    base_wait=100,
    max_wait=5000
)
def call_api():
    pass

# 装饰器已内置 jitter 支持
```

### Q: 如何在异步函数中使用？

```python
import asyncio
from FQBase.Foundation.retry import async_retry_with_exponential_backoff

@async_retry_with_exponential_backoff(max_attempts=3)
async def fetch_data():
    return await api.get()

# 使用
async def main():
    result = await fetch_data()

asyncio.run(main())
```

---

## 相关文档

- [API 参考](api.md)
- [使用指南](usage.md)
- [最佳实践](best-practices.md)
- [架构设计](architecture.md)
- [设计决策](design.md)
- [FAQ](faq.md)