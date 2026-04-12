# FAQ

## 基础问题

### Q: retry 模块提供哪些重试策略？

| 装饰器 | 说明 |
|--------|------|
| `retry` | 基础重试，随机等待时间 |
| `retry_with_exponential_backoff` | 指数退避重试 |
| `async_retry_with_exponential_backoff` | 异步指数退避重试 |

---

### Q: 如何使用基础重试？

```python
from FQBase.Foundation.retry import retry

@retry(stop_max_attempt_number=3)
def call_api():
    return api.get()
```

---

### Q: 如何使用指数退避重试？

```python
from FQBase.Foundation.retry import retry_with_exponential_backoff

@retry_with_exponential_backoff(
    max_attempts=5,
    base_wait=100,  # 100ms
    max_wait=5000   # 最大 5s
)
def call_api():
    return api.get()
```

等待时间计算：
- 第1次重试前：100ms
- 第2次重试前：200ms
- 第3次重试前：400ms
- 第4次重试前：800ms
- 第5次重试前：1600ms

---

## 配置问题

### Q: stop_max_attempt_number 和 max_attempts 有什么区别？

没有区别，只是参数名不同：

```python
# retry 装饰器
@retry(stop_max_attempt_number=3)

# retry_with_exponential_backoff 装饰器
@retry_with_exponential_backoff(max_attempts=3)
```

---

### Q: wait_random_min 和 wait_random_max 是什么？

基础重试的等待时间是随机值：

```python
@retry(wait_random_min=100, wait_random_max=500)
def call_api():
    pass

# 每次重试前等待 100-500ms 之间的随机值
```

---

### Q: base_wait 和 max_wait 是什么？

指数退避的参数：

```python
@retry_with_exponential_backoff(
    base_wait=100,  # 基础等待时间（毫秒）
    max_wait=5000   # 最大等待时间（毫秒）
)
def call_api():
    pass
```

等待时间 = min(base_wait × 2^(attempt-1), max_wait)

---

## 异常处理

### Q: 如何指定哪些异常需要重试？

```python
from FQBase.Foundation.retry import retry

# 只重试特定异常
@retry(stop_max_attempt_number=3, retry_on_exception=(ConnectionError, TimeoutError))
def call_api():
    pass

# 其他异常（如 ValueError）会立即抛出，不重试
```

---

### Q: retry_on_exception 为 None 会怎样？

```python
@retry(retry_on_exception=None)  # None 表示重试所有异常
def call_api():
    pass
```

---

### Q: 如何在重试时执行回调？

```python
def on_retry_handler(attempt, exception):
    logger.warning(f"Attempt {attempt} failed: {exception}")
    metrics.increment("retry_count")

@retry(stop_max_attempt_number=3, on_retry=on_retry_handler)
def call_api():
    pass
```

---

## 超时控制

### Q: 如何设置最大总时间限制？

```python
@retry_with_exponential_backoff(
    max_attempts=10,
    max_total_time=30.0  # 30秒内最多重试
)
def call_api():
    pass
```

超过 `max_total_time` 后会停止重试并抛出异常。

---

### Q: 重试耗尽后会抛出什么异常？

```python
@retry(stop_max_attempt_number=3)
def call_api():
    raise Exception("API Error")

try:
    call_api()
except Exception as e:
    print(f"Last exception: {e}")  # "API Error"
```

---

## 异步支持

### Q: 如何在异步函数中使用重试？

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

### Q: 异步重试和同步重试有什么区别？

```python
# 同步重试：阻塞等待
@retry_with_exponential_backoff(max_attempts=3)
def sync_call():
    return requests.get(url)

# 异步重试：不阻塞事件循环
@async_retry_with_exponential_backoff(max_attempts=3)
async def async_call():
    return await aiohttp.get(url)
```

---

## 重试上下文

### Q: RetryContext 是什么？

提供更精细控制的低级别 API：

```python
from FQBase.Foundation.retry import RetryContext

ctx = RetryContext(
    func=fetch_data,
    max_attempts=3,
    wait_min=100,
    wait_max=500
)

# 可以复用上下文
result = ctx.execute()
result = ctx.execute()  # 再次执行
```

---

### Q: 何时使用 RetryContext？

- 需要多次执行同一函数
- 需要手动控制执行流程
- 需要在测试中模拟重试行为

---

## 常见错误

### Q: 错误：永久重试导致程序卡住

**原因**：未设置最大重试次数

```python
# 错误：没有设置重试次数限制
@retry  # 可能无限重试
def unstable_call():
    pass

# 解决：设置最大重试次数
@retry(stop_max_attempt_number=3)
def unstable_call():
    pass
```

---

### Q: 错误：重试风暴（Retry Storm）

**原因**：多个客户端同时重试，造成流量突增

```python
# 错误：多个实例同步重试
@retry_with_exponential_backoff(max_attempts=10)
def call_api():
    pass

# 解决：添加随机抖动
@retry_with_exponential_backoff(
    max_attempts=10,
    base_wait=100,
    max_wait=5000
    # jitter 已经内置在 retry 中
)
def call_api():
    pass
```

---

### Q: 错误：重试了不该重试的异常

**原因**：没有过滤异常类型

```python
# 错误：所有异常都重试
@retry
def validate_input(data):
    if not data:
        raise ValueError("Empty input")  # 不应重试
    return process(data)

# 解决：只重试应该重试的异常
@retry(retry_on_exception=(ConnectionError, TimeoutError))
def call_api():
    if invalid:
        raise ValueError("Invalid")  # 立即失败
    return api.call()
```

---

## 性能问题

### Q: 重试会影响性能吗？

是的，每次重试都会增加延迟：

```python
@retry_with_exponential_backoff(max_attempts=5, base_wait=100)
def call_api():
    pass

# 额外延迟：100 + 200 + 400 + 800 = 1500ms
```

建议：
- 设置合理的重试次数
- 使用指数退避避免频繁重试
- 设置最大等待时间

---

### Q: 如何减少重试开销？

```python
# 方法1：使用连接池复用连接
session = requests.Session()
@retry(stop_max_attempt_number=3)
def call_api():
    return session.get(url)

# 方法2：使用缓存减少调用
cache = {}

@retry(stop_max_attempt_number=3)
def call_with_cache(key):
    if key in cache:
        return cache[key]
    result = api.get(key)
    cache[key] = result
    return result
```

---

## 相关文档

- [API 参考](api.md)
- [使用指南](usage.md)
- [开发指南](development.md)
- [最佳实践](best-practices.md)
- [架构设计](architecture.md)
- [设计决策](design.md)