# FQUtil.retry - 重试装饰器

> 版本: v1.0
> 更新时间: 2026-03-27

---

## 一、模块概述

`FQUtil.retry` 提供重试装饰器功能，支持：
- 重试次数限制
- 重试延迟策略（固定/随机/指数退避）
- 异常类型过滤
- 回调函数支持

**迁移状态**: ✅ 已完成从 `retrying` 库的迁移，Python 3 优化版本

---

## 二、导入方式

```python
# 推荐：使用新名称
from FQBase.FQUtil import retry, retry_with_exponential_backoff, RetryError, RetryContext

# 兼容：仍可使用旧名称
from FQBase.FQUtil import retry as retry_decorator
```

---

## 三、函数列表

### 3.1 retry - 基本重试装饰器

```python
def retry(
    stop_max_attempt_number: int = 3,
    wait_random_min: int = 0,
    wait_random_max: int = 1000,
    retry_on_exception: Optional[Tuple[type, ...]] = None,
) -> Callable:
```

**参数**:

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| stop_max_attempt_number | int | 3 | 最大重试次数 |
| wait_random_min | int | 0 | 最小等待时间（毫秒） |
| wait_random_max | int | 1000 | 最大等待时间（毫秒） |
| retry_on_exception | Tuple[type, ...] | None | 需要重试的异常类型元组 |

**返回值**: 装饰器函数

**示例**:

```python
from FQBase.FQUtil import retry

# 基本重试（失败后等待 50-100ms）
@retry(stop_max_attempt_number=3, wait_random_min=50, wait_random_max=100)
def fetch_data():
    return api.get()

# 只在特定异常时重试
@retry(stop_max_attempt_number=5, retry_on_exception=(ConnectionError, TimeoutError))
def connect():
    return network.connect()
```

---

### 3.2 retry_with_exponential_backoff - 指数退避重试

```python
def retry_with_exponential_backoff(
    max_attempts: int = 3,
    base_wait: int = 100,
    max_wait: int = 10000,
    retry_on_exception: Optional[Tuple[type, ...]] = None,
) -> Callable:
```

**参数**:

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| max_attempts | int | 3 | 最大重试次数 |
| base_wait | int | 100 | 基础等待时间（毫秒） |
| max_wait | int | 10000 | 最大等待时间（毫秒） |
| retry_on_exception | Tuple[type, ...] | None | 需要重试的异常类型元组 |

**等待时间计算**: `min(base_wait * 2^(attempt-1), max_wait)`

**示例**:

```python
from FQBase.FQUtil import retry_with_exponential_backoff

@retry_with_exponential_backoff(max_attempts=5, base_wait=100, max_wait=5000)
def fetch_with_backoff():
    return api.get()
# 等待序列: 100ms, 200ms, 400ms, 800ms, 1600ms
```

---

### 3.3 RetryError - 重试失败异常

```python
class RetryError(Exception):
    def __init__(self, message: str, last_exception: Optional[Exception] = None):
```

**参数**:

| 参数 | 类型 | 说明 |
|------|------|------|
| message | str | 异常消息 |
| last_exception | Exception | 最后一次发生的异常 |

**属性**:

| 属性 | 类型 | 说明 |
|------|------|------|
| last_exception | Exception | 最后一次发生的异常 |

**示例**:

```python
from FQBase.FQUtil import retry, RetryError

@retry(stop_max_attempt_number=3)
def fragile_operation():
    raise ConnectionError("Network failure")

try:
    fragile_operation()
except RetryError as e:
    print(f"重试失败，最后异常: {e.last_exception}")
except ConnectionError as e:
    print(f"非重试异常: {e}")
```

---

### 3.4 RetryContext - 重试上下文

```python
class RetryContext:
    def __init__(
        self,
        func: Callable,
        max_attempts: int = 3,
        wait_min: int = 0,
        wait_max: int = 1000,
        retry_on_exception: Optional[Tuple[type, ...]] = None,
        on_retry: Optional[Callable[[int, Exception], None]] = None,
    ):
```

**参数**:

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| func | Callable | - | 要重试的函数 |
| max_attempts | int | 3 | 最大重试次数 |
| wait_min | int | 0 | 最小等待时间（毫秒） |
| wait_max | int | 1000 | 最大等待时间（毫秒） |
| retry_on_exception | Tuple[type, ...] | None | 需要重试的异常类型元组 |
| on_retry | Callable | None | 重试回调函数 (attempt_count, exception) |

**方法**:

| 方法 | 说明 |
|------|------|
| `execute(*args, **kwargs)` | 执行重试 |

**属性**:

| 属性 | 类型 | 说明 |
|------|------|------|
| attempt_count | int | 当前尝试次数 |

**示例**:

```python
from FQBase.FQUtil import RetryContext

def on_retry_attempt(attempt, exception):
    print(f"Attempt {attempt} failed: {exception}")

ctx = RetryContext(
    func=fragile_operation,
    max_attempts=5,
    wait_min=100,
    wait_max=1000,
    on_retry=on_retry_attempt
)

try:
    result = ctx.execute()
except Exception as e:
    print(f"All attempts failed: {e}")
```

---

### 3.5 create_retry_context - 创建重试上下文

```python
def create_retry_context(
    func: Callable,
    max_attempts: int = 3,
    wait_min: int = 0,
    wait_max: int = 1000,
    retry_on_exception: Optional[Tuple[type, ...]] = None,
    on_retry: Optional[Callable[[int, Exception], None]] = None,
) -> RetryContext:
```

**参数**: 同 RetryContext构造函数

**返回值**: RetryContext 实例

**示例**:

```python
from FQBase.FQUtil import create_retry_context

ctx = create_retry_context(
    func=fetch_data,
    max_attempts=5,
    wait_min=100,
    wait_max=1000,
    on_retry=lambda attempt, ex: logger.warning(f"Attempt {attempt} failed: {ex}")
)

result = ctx.execute()
```

---

## 四、完整函数列表

| 函数/类 | 说明 |
|---------|------|
| `retry` | 基本重试装饰器 |
| `retry_with_exponential_backoff` | 指数退避重试装饰器 |
| `RetryError` | 重试失败异常类 |
| `RetryContext` | 重试上下文类 |
| `create_retry_context` | 创建重试上下文辅助函数 |

---

## 五、迁移说明

### 与原 retrying 库的对比

| 原参数 | 新参数 | 说明 |
|--------|--------|------|
| `stop_max_attempt_number` | `stop_max_attempt_number` | 保持不变 |
| `wait_random_min` | `wait_random_min` | 保持不变 |
| `wait_random_max` | `wait_random_max` | 保持不变 |
| `retry_on_exception` | `retry_on_exception` | 保持不变 |

### 迁移示例

```python
# 旧代码 (retrying)
from retrying import retry

@retry(stop_max_attempt_number=3, wait_random_min=50, wait_random_max=100)
def fetch_data():
    return api.get()

# 新代码
from FQBase.FQUtil import retry

@retry(stop_max_attempt_number=3, wait_random_min=50, wait_random_max=100)
def fetch_data():
    return api.get()
```

### 主要变化

1. **移除 Python 2 支持**: 不再使用 `six` 库
2. **简化 API**: 移除复杂的状态机，保留核心功能
3. **类型注解**: 完整的 Python 3 类型注解
4. **移除依赖**: 不再依赖 `six` 库

---

## 六、最佳实践

### 6.1 网络请求重试

```python
from FQBase.FQUtil import retry, retry_with_exponential_backoff
import requests

@retry_with_exponential_backoff(max_attempts=5, base_wait=100, max_wait=5000,
                                  retry_on_exception=(requests.RequestException,))
def fetch_with_retry(url):
    response = requests.get(url, timeout=10)
    response.raise_for_status()
    return response.json()
```

### 6.2 数据库连接重试

```python
from FQBase.FQUtil import retry
import pymongo

@retry(stop_max_attempt_number=3, wait_random_min=100, wait_random_max=500,
       retry_on_exception=(pymongo.ConnectionFailure, pymongo.AutoReconnect))
def connect_db():
    return pymongo.MongoClient(host='localhost', port=27017)
```

### 6.3 带日志的重试

```python
from FQBase.FQUtil import create_retry_context
import logging

logger = logging.getLogger(__name__)

def log_retry(attempt, exception):
    logger.warning(f"Attempt {attempt} failed with {type(exception).__name__}: {exception}")

ctx = create_retry_context(
    func=fragile_operation,
    max_attempts=5,
    on_retry=log_retry
)

result = ctx.execute()
```

---

## 七、相关文档

- [module-FQUtil.md](./module-FQUtil.md) - FQUtil 模块索引
- [module-FQUtil-parallel.md](./module-FQUtil-parallel.md) - 并行计算工具
- [module-FQUtil-bar.md](./module-FQUtil-bar.md) - 时间索引工具
