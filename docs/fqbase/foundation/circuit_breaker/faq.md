# FAQ

## 基础问题

### Q: 什么是熔断器模式？

熔断器模式（Circuit Breaker Pattern）是一种防止级联故障的设计模式。类似于电路保险丝，当检测到故障时"熔断"以防止系统继续尝试失败的操作。

```
正常状态 (CLOSED)
    │
    ▼
┌─────────────────────┐
│  请求 → 执行 → 返回  │
└─────────────────────┘

故障累积
    │
    ▼
打开状态 (OPEN) - 快速失败
    │
    ▼
┌─────────────────────┐
│  请求 → 拒绝（熔断） │
└─────────────────────┘

恢复超时后
    │
    ▼
半开状态 (HALF_OPEN) - 尝试恢复
    │
    ▼
┌─────────────────────┐
│  请求 → 尝试执行    │
└─────────────────────┘
```

---

### Q: 熔断器有哪些状态？

| 状态 | 说明 | 行为 |
|------|------|------|
| `CLOSED` | 关闭 | 正常执行请求，失败累积 |
| `OPEN` | 打开 | 拒绝所有请求，快速失败 |
| `HALF_OPEN` | 半开 | 允许有限请求，测试恢复 |

---

### Q: 如何创建熔断器？

**方式一：使用装饰器（推荐）**

```python
from FQBase.Foundation.circuit_breaker import circuit_breaker

@circuit_breaker(name="user_api", failure_threshold=5, recovery_timeout=60)
def call_user_service(user_id):
    return user_api.get(user_id)
```

**方式二：直接使用类**

```python
from FQBase.Foundation.circuit_breaker import CircuitBreaker

breaker = CircuitBreaker(name="user_api", failure_threshold=5, recovery_timeout=60)
result = breaker.call(call_user_service, user_id)
```

---

## 配置问题

### Q: failure_threshold 和 success_threshold 有什么区别？

```python
breaker = CircuitBreaker(
    name="test",
    failure_threshold=5,   # 连续失败5次后打开熔断器
    success_threshold=2    # 半开状态下连续成功2次后关闭熔断器
)
```

---

### Q: recovery_timeout 设置多少合适？

`recovery_timeout` 取决于下游服务的恢复时间：

| 下游服务 | 推荐值 | 原因 |
|----------|--------|------|
| 数据库 | 30-60秒 | 恢复较快 |
| 外部API | 60-300秒 | 可能需要更长恢复 |
| 第三方服务 | 300+秒 | 高延迟服务 |

```python
# 快速恢复的服务
breaker = CircuitBreaker(name="fast", failure_threshold=3, recovery_timeout=30)

# 慢速恢复的服务
breaker = CircuitBreaker(name="slow", failure_threshold=5, recovery_timeout=300)
```

---

### Q: 如何排除某些异常不计入失败？

```python
from FQBase.Foundation.circuit_breaker import CircuitBreaker

# 排除业务异常，这些不算失败
breaker = CircuitBreaker(
    name="api",
    failure_threshold=5,
    excluded_exceptions=(ValidationError, UserNotFoundError)
)

# 装饰器方式
@circuit_breaker(name="api", excluded_exceptions=(ValueError,))
def call_api():
    pass
```

---

## 使用问题

### Q: 如何处理熔断器打开时的请求？

```python
from FQBase.Foundation.circuit_breaker import (
    circuit_breaker,
    CircuitBreakerOpenException
)

@circuit_breaker(name="user_api")
def get_user(user_id):
    return user_api.get(user_id)

# 降级处理
def fetch_user(user_id):
    try:
        return get_user(user_id)
    except CircuitBreakerOpenException:
        return get_cached_user(user_id)  # 降级方案
```

---

### Q: 如何监控熔断器状态？

```python
from FQBase.Foundation.circuit_breaker import CircuitBreaker

breaker = CircuitBreaker(
    name="monitored",
    failure_threshold=5,
    on_state_change=lambda cb: print(f"State changed to {cb.state}")
)

# 定期检查状态
def check_breaker_health():
    status = breaker.get_status()
    print(f"Circuit {status['name']}: {status['state']}")
    print(f"Metrics: {status['metrics']}")
```

---

### Q: 如何获取熔断器指标？

```python
from FQBase.Foundation.circuit_breaker import CircuitBreaker

breaker = CircuitBreaker(name="metrics_test")

# 模拟一些调用
for _ in range(10):
    try:
        breaker.call(lambda: "success")
    except Exception:
        pass

# 查看指标
metrics = breaker.metrics
print(f"Total calls: {metrics.total_calls}")
print(f"Successful: {metrics.successful_calls}")
print(f"Failed: {metrics.failed_calls}")
print(f"Success rate: {metrics.success_rate:.2%}")
print(f"Consecutive failures: {metrics.consecutive_failures}")
```

---

### Q: 如何使用上下文管理器？

```python
from FQBase.Foundation.circuit_breaker import CircuitBreaker

with CircuitBreaker(name="ctx_test") as breaker:
    result = breaker.call(lambda: api.get_data())
    print(f"Result: {result}")

# 异常会自动记录
with CircuitBreaker(name="ctx_test") as breaker:
    breaker.call(lambda: (_ for _ in ()).throw(Exception("Error")))
```

---

## 多熔断器管理

### Q: 如何管理多个熔断器？

使用 `CircuitBreakerManager`：

```python
from FQBase.Foundation.circuit_breaker import CircuitBreakerManager

manager = CircuitBreakerManager()

# 注册熔断器
manager.register("user_service", failure_threshold=5, recovery_timeout=60)
manager.register("order_service", failure_threshold=3, recovery_timeout=30)
manager.register("payment_service", failure_threshold=2, recovery_timeout=120)

# 获取熔断器
user_breaker = manager.get("user_service")
user_breaker.call(user_api.get)
```

---

### Q: 如何获取所有熔断器的状态？

```python
manager = CircuitBreakerManager()
manager.register("service_a")
manager.register("service_b")

# 获取所有状态
all_status = manager.get_all_status()
for name, status in all_status.items():
    print(f"{name}: {status['state']}")
    print(f"  Metrics: {status['metrics']}")
```

---

### Q: 如何重置所有熔断器？

```python
manager = CircuitBreakerManager()
manager.register("service_a")
manager.register("service_b")

# 重置所有
manager.reset_all()
```

---

## 异步问题

### Q: 如何在异步函数中使用熔断器？

```python
import asyncio
from FQBase.Foundation.circuit_breaker import circuit_breaker

@circuit_breaker(name="async_api")
async def fetch_data():
    await asyncio.sleep(0.1)
    return await api.get()

# 使用
async def main():
    result = await fetch_data()
    print(result)

asyncio.run(main())
```

---

## 状态转换问题

### Q: 熔断器状态转换的完整流程是什么？

```
                    失败次数 ≥ failure_threshold
    ┌────────────────────────────────────────────┐
    │                                            │
    ▼                                            │
CLOSED ──────────────────────────────────────────┼──→ (正常)
    │                                            │
    │  recovery_timeout 后                       │
    │                                            ▼
    │                                      HALF_OPEN
    │                                            │
    │  ┌─────────────────────────────────────────┤
    │  │                                         │
    │  │  连续成功 ≥ success_threshold           │
    │  │                                         │
    │  ▼                                         ▼
    │CLOSED ◀───────────────────────────────── OPEN
    │  ▲                                          │
    │  │                                          │
    │  └──── 一次失败                             │
    └────────────────────────────────────────────┘
```

---

### Q: 为什么需要 HALF_OPEN 状态？

半开状态防止抖动（flapping），即服务刚恢复又被打爆：

```python
# 没有半开状态的问题
CLOSED → OPEN → CLOSED → OPEN → ... (抖动)

# 有半开状态
CLOSED → OPEN → HALF_OPEN → (成功) → CLOSED
                        │
                        └── (失败) → OPEN
```

---

## 常见错误

### Q: 错误：`Circuit breaker 'xxx' is OPEN`

**原因**：熔断器已打开，请求被拒绝

```python
# 触发此错误
breaker = CircuitBreaker(name="test", failure_threshold=1)
breaker.record_failure()
breaker.call(some_function)  # 抛出 CircuitBreakerOpenException

# 解决方法
try:
    breaker.call(some_function)
except CircuitBreakerOpenException:
    return fallback_value  # 使用降级方案
```

---

### Q: 错误：熔断器没有按预期打开

**原因**：异常被 `excluded_exceptions` 排除了

```python
# 异常没有记录为失败
breaker = CircuitBreaker(name="test", failure_threshold=3)
breaker.record_failure(ValueError())  # ValueError 在 excluded_exceptions 中
breaker.record_failure(ValueError())
# 此时熔断器仍然是 CLOSED
```

---

### Q: 错误：装饰器没有生效

**原因**：装饰器与异步函数使用不当

```python
# 正确：装饰器在 async 函数上
@circuit_breaker(name="async")
async def fetch():
    return await api.get()

# 错误：可能没有正确识别为异步函数
# 确保使用 async def 而不是同步函数包装
```

---

## 相关文档

- [API 参考](api.md)
- [使用指南](usage.md)
- [开发指南](development.md)
- [最佳实践](best-practices.md)
- [架构设计](architecture.md)
- [设计决策](design.md)