# Retry 模块架构

## 1. 模块结构

```
retry.py
├── retry()                           # 固定/随机延迟重试装饰器
├── retry_with_exponential_backoff()  # 指数退避重试装饰器
├── async_retry_with_exponential_backoff()  # 异步指数退避重试
├── RetryError                       # 重试失败异常
├── RetryContext                     # 重试上下文
└── create_retry_context()           # 重试上下文工厂
```

## 2. retry 装饰器流程

```
@retry(stop_max_attempt_number=3, wait_random_min=100, wait_random_max=500)
        │
        ▼
wrapper(*args, **kwargs)
        │
        ▼
┌───────────────────────────────────┐
│  for attempt in range(1, 4):    │
│  ┌─────────────────────────────┐  │
│  │ try:                       │  │
│  │     return func(*args)    │  │
│  │ except Exception as e:     │  │
│  │     ...                    │  │
│  └─────────────────────────────┘  │
└───────────────────────────────────┘
        │
        ├─── 成功 ──► 返回结果
        │
        └─── 异常
                │
                ├─── 非 retry_on_exception ──► 立即抛出
                │
                ├─── 还有重试机会 ──► sleep(wait_time) ──► 继续循环
                │
                └─── 无重试机会 ──► 抛出 last_exception
```

## 3. 指数退避流程

```
@retry_with_exponential_backoff(max_attempts=5, base_wait=100, max_wait=5000)
        │
        ▼
wrapper(*args, **kwargs)
        │
        ▼
┌─────────────────────────────────────────┐
│  for attempt in range(1, 6):           │
│  ┌───────────────────────────────────┐ │
│  │ try:                              │ │
│  │     return func(*args)           │ │
│  │ except Exception as e:            │ │
│  │     ...                           │ │
│  └───────────────────────────────────┘ │
│                                          │
│  计算等待时间:                            │
│  wait_time = min(base * 2^(n-1), max)   │
└─────────────────────────────────────────┘
```

## 4. RetryContext

```python
class RetryContext:
    def __init__(self, func, max_attempts=3, wait_min=0, wait_max=1000, ...):
        self.func = func
        self.attempt_count = 0

    def execute(self, *args, **kwargs):
        self.attempt_count = 0
        while self.attempt_count < self.max_attempts:
            self.attempt_count += 1
            try:
                return self.func(*args, **kwargs)
            except Exception as e:
                if self.retry_on_exception and not isinstance(e, ...):
                    raise
                if self.attempt_count >= self.max_attempts:
                    break
                time.sleep(wait_time)
        raise last_exception
```

## 5. 装饰器实现

### 5.1 标准装饰器

```python
def retry(...):
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs):
            # 重试逻辑
            ...
        return wrapper
    return decorator
```

### 5.2 @wraps 的作用

使用 `@wraps(func)` 保留原函数元数据：

```python
@retry
def fetch_data():
    """Fetch data from API"""
    pass

fetch_data.__name__    # 'fetch_data' (而非 'wrapper')
fetch_data.__doc__     # 'Fetch data from API'
```

## 6. 异常处理

### 6.1 retry_on_exception 过滤

```python
if retry_on_exception and not isinstance(e, retry_on_exception):
    raise  # 非目标异常，立即抛出
```

### 6.2 最后异常

```python
last_exception = None
for attempt in ...:
    try:
        return func()
    except Exception as e:
        last_exception = e

raise last_exception  # 抛出最后一次异常
```

## 7. 依赖关系

```
retry.py
│
├── logging (标准库)
├── random (标准库)
├── time (标准库)
├── functools (wraps)
├── typing (Callable, Optional, Tuple)
│
└── 无外部依赖
```

## 8. 设计权衡

### 8.1 装饰器 vs 上下文管理器

**决策**：使用装饰器模式

| 方案 | 优点 | 缺点 |
|------|------|------|
| 装饰器 | 非侵入、使用简单 | 无法在运行时改变参数 |
| 上下文管理器 | 灵活可控 | 代码较繁琐 |

### 8.2 同步 vs 异步

**决策**：同时提供同步和异步版本

- `retry` - 同步重试
- `retry_with_exponential_backoff` - 同步指数退避
- `async_retry_with_exponential_backoff` - 异步指数退避

### 8.3 异常传播

**决策**：重试耗尽后抛出最后一次异常

```python
try:
    @retry(...)
    def fetch():
        return api.get()
except Exception as e:
    # e 是最后一次捕获的异常
    handle(e)
```

**替代方案**：抛出 `RetryError` 包装异常

```python
# 替代方案 - 需要额外解包
raise RetryError("Retry exhausted", last_exception) from last_exception
```
