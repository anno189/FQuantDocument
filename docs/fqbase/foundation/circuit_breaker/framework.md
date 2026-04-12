# Circuit Breaker 模块框架

## 1. 概述

Circuit Breaker（熔断器）是一种防止级联故障的设计模式。当服务连续失败达到阈值时，熔断器会"打开"，后续请求直接拒绝而非继续尝试失败的服务。一段时间后，熔断器进入"半开"状态，允许有限请求尝试恢复。

### 1.1 解决的问题

```
用户请求 → 服务A → 服务B → 服务C
                           ↓
                       服务C故障
                           ↓
                    服务B等待超时
                           ↓
                    服务A等待超时
                           ↓
                       系统崩溃
```

使用熔断器后：

```
用户请求 → 服务A → 服务B → [熔断器 OPEN]
                           ↓
                    快速失败返回
                           ↓
                    系统保持稳定
```

### 1.2 何时使用熔断器

- 调用外部 API 或微服务
- 调用可能暂时不可用的资源
- 需要防止级联故障的场景
- 需要优雅降级的系统

## 2. 三态状态机

### 2.1 状态说明

| 状态 | 说明 | 行为 |
|------|------|------|
| CLOSED | 关闭 | 正常执行请求，失败计数 |
| OPEN | 打开 | 拒绝所有请求，快速失败 |
| HALF_OPEN | 半开 | 允许有限请求，尝试恢复 |

### 2.2 状态转换

```
                         失败次数 ≥ failure_threshold
        ┌────────────────────────────────────────────┐
        │                                            │
        ▼                                            │
    ┌───────┐    超时 (recovery_timeout)    ┌────────────────┐
    │ CLOSED│ ───────────────────────────► │      OPEN       │
    └───────┘                              └────────────────┘
        ▲                                          │
        │                                          │
        │           成功次数 ≥ success_threshold   │
        │                                          │
        │  ┌────────────────┐                      │
        └──│   HALF_OPEN    │◄─────────────────────┤
           └────────────────┘                      │
                   │                               │
                   │          失败                 │
                   │                               │
                   └──────────────► ───────────────┘
```

### 2.3 详细转换规则

| 当前状态 | 事件 | 下一状态 |
|----------|------|----------|
| CLOSED | 连续失败 ≥ threshold | OPEN |
| CLOSED | 成功 | CLOSED |
| OPEN | 超时 | HALF_OPEN |
| HALF_OPEN | 连续成功 ≥ threshold | CLOSED |
| HALF_OPEN | 失败 | OPEN |

## 3. 核心概念

### 3.1 失败阈值 (failure_threshold)

连续失败次数达到此阈值时，熔断器打开。

```python
breaker = CircuitBreaker(failure_threshold=5)
# 连续5次失败后打开
```

### 3.2 恢复超时 (recovery_timeout)

熔断器打开后，等待此时间后进入半开状态。

```python
breaker = CircuitBreaker(recovery_timeout=60)
# 打开后60秒进入HALF_OPEN
```

### 3.3 成功阈值 (success_threshold)

半开状态下，连续成功次数达到此阈值时，熔断器关闭。

```python
breaker = CircuitBreaker(success_threshold=2)
# 半开状态下连续2次成功则关闭
```

### 3.4 排除异常 (excluded_exceptions)

这些异常类型不计入失败统计。

```python
breaker = CircuitBreaker(
    excluded_exceptions=(ValidationError, AuthError)
)
# 验证错误和认证错误不计入失败
```

## 4. 指标

### 4.1 CircuitBreakerMetrics

| 指标 | 说明 |
|------|------|
| total_calls | 总调用次数 |
| successful_calls | 成功调用次数 |
| failed_calls | 失败调用次数 |
| rejected_calls | 被拒绝调用次数 |
| consecutive_failures | 连续失败次数 |
| consecutive_successes | 连续成功次数 |
| success_rate | 成功率 |
| last_failure_time | 上次失败时间 |
| last_success_time | 上次成功时间 |
| state_changes | 状态变更次数 |

### 4.2 健康状态

```python
metrics = breaker.metrics
if metrics.success_rate < 0.8:
    alert("成功率低于80%")
if metrics.consecutive_failures > 3:
    alert("连续失败超过3次")
```

## 5. 使用模式

### 5.1 装饰器模式

```python
@circuit_breaker(name="user_api", failure_threshold=5)
def get_user(user_id):
    return user_service.get(user_id)
```

### 5.2 手动调用模式

```python
breaker = CircuitBreaker(name="payment")
result = breaker.call(call_payment_service)
```

### 5.3 上下文管理器模式

```python
with CircuitBreaker(name="cache") as breaker:
    result = cache.get("key")
```

### 5.4 异步模式

```python
@circuit_breaker(name="async_api")
async def fetch_data():
    return await api.get()
```

## 6. 异常处理

### 6.1 熔断器打开异常

当熔断器打开时，会抛出 `CircuitBreakerOpenException`：

```python
try:
    result = breaker.call(call_service)
except CircuitBreakerOpenException as e:
    print(f"熔断器打开: {e.circuit_name}")
    print(f"等待时间: {e.recovery_timeout}秒")
```

### 6.2 异常过滤

排除的异常不计入失败统计：

```python
@circuit_breaker(excluded_exceptions=(ValidationError,))
def validate_and_call():
    validate_input()  # ValidationError 不计入失败
    return api.call()
```

## 7. 状态变更回调

```python
def on_state_change(breaker):
    logger.warning(f"Circuit {breaker.name} changed to {breaker.state}")

breaker = CircuitBreaker(
    name="api",
    on_state_change=on_state_change
)
```
