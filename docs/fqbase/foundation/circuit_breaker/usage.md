# Circuit Breaker 模块使用指南

## 目录

1. [基础用法](#1-基础用法)
2. [装饰器模式](#2-装饰器模式)
3. [手动调用模式](#3-手动调用模式)
4. [上下文管理器模式](#4-上下文管理器模式)
5. [异步函数](#5-异步函数)
6. [熔断器管理](#6-熔断器管理)
7. [异常处理](#7-异常处理)
8. [监控和调试](#8-监控和调试)
9. [高级用法](#9-高级用法)

---

## 1. 基础用法

### 1.1 快速开始

```python
from FQBase.Foundation import CircuitBreaker

breaker = CircuitBreaker(
    name="my_service",
    failure_threshold=5,
    recovery_timeout=60
)

def call_service():
    return api.get()

result = breaker.call(call_service)
```

### 1.2 默认配置

```python
breaker = CircuitBreaker()  # 使用默认配置
# failure_threshold=5, success_threshold=2, recovery_timeout=60
```

---

## 2. 装饰器模式

### 2.1 基本使用

```python
from FQBase.Foundation import circuit_breaker

@circuit_breaker(name="user_api")
def get_user(user_id):
    return user_service.get(user_id)

user = get_user(123)
```

### 2.2 自定义配置

```python
@circuit_breaker(
    name="payment_api",
    failure_threshold=10,
    success_threshold=3,
    recovery_timeout=120
)
def create_payment(order_id, amount):
    return payment_service.create(order_id, amount)
```

### 2.3 使用默认名称

```python
@circuit_breaker(failure_threshold=3)
def call_api():
    return api.get()
# 熔断器名称默认为 "call_api"
```

### 2.4 排除特定异常

```python
@circuit_breaker(
    name="data_api",
    excluded_exceptions=(ValidationError, AuthError)
)
def fetch_data():
    validate_input()
    return api.get()
# ValidationError 和 AuthError 不计入失败
```

---

## 3. 手动调用模式

### 3.1 基本使用

```python
breaker = CircuitBreaker(name="manual")

try:
    result = breaker.call(some_function)
except CircuitBreakerOpenException:
    print("服务暂时不可用")
```

### 3.2 带参数调用

```python
breaker = CircuitBreaker(name="calculator")

def add(a, b):
    return a + b

result = breaker.call(add, 1, 2)  # pass args
result = breaker.call(add, a=1, b=2)  # pass kwargs
```

### 3.3 带返回值检查

```python
breaker = CircuitBreaker(name="service")

result = breaker.call(call_external_api)
if result is None:
    print("调用返回空值")
```

---

## 4. 上下文管理器模式

### 4.1 基本使用

```python
breaker = CircuitBreaker(name="context_manager")

with breaker:
    result = cache.get("key")
```

### 4.2 自动异常处理

```python
breaker = CircuitBreaker(name="data_access")

with breaker:
    data = database.query("SELECT * FROM users")
    # 如果发生异常且不在排除列表中，会被记录为失败
```

### 4.3 多个熔断器

```python
db_breaker = CircuitBreaker(name="database")
cache_breaker = CircuitBreaker(name="cache")
api_breaker = CircuitBreaker(name="api")

with db_breaker:
    data = db.query()

with cache_breaker:
    cached = cache.get(key)

with api_breaker:
    result = api.call()
```

---

## 5. 异步函数

### 5.1 装饰器模式

```python
@circuit_breaker(name="async_api")
async def fetch_user(user_id):
    return await user_service.get(user_id)

user = await fetch_user(123)
```

### 5.2 手动调用

```python
breaker = CircuitBreaker(name="async_manual")

async def fetch_data():
    return await api.get()

result = await breaker.call_async(fetch_data)
```

### 5.3 混合使用

```python
@circuit_breaker(name="mixed")
async def get_data():
    return await api.fetch()

# 也可以同步调用
result = get_data_sync()
```

---

## 6. 熔断器管理

### 6.1 注册和管理

```python
from FQBase.Foundation import CircuitBreakerManager

manager = CircuitBreakerManager()

manager.register("api", failure_threshold=5)
manager.register("database", failure_threshold=3)
manager.register("cache", failure_threshold=10)

api_breaker = manager.get("api")
```

### 6.2 获取或创建

```python
breaker = manager.get_or_create("new_service")
# 如果不存在则创建
```

### 6.3 注销

```python
if manager.unregister("old_service"):
    print("熔断器已注销")
```

### 6.4 查看所有状态

```python
all_status = manager.get_all_status()
for name, status in all_status.items():
    print(f"{name}: {status['state']}")
```

### 6.5 重置所有

```python
manager.reset_all()
# 所有熔断器重置为 CLOSED 状态
```

---

## 7. 异常处理

### 7.1 捕获熔断器异常

```python
from FQBase.Foundation import CircuitBreakerOpenException

@circuit_breaker(name="reliable_api")
def call_api():
    return api.get()

try:
    result = call_api()
except CircuitBreakerOpenException as e:
    print(f"熔断器 {e.circuit_name} 打开")
    print(f"等待 {e.recovery_timeout} 秒后重试")
    # 可以实现降级逻辑
    return get_cached_result()
```

### 7.2 实现降级逻辑

```python
@circuit_breaker(name="primary_service")
def get_data():
    return primary_api.get()

def get_with_fallback():
    try:
        return get_data()
    except CircuitBreakerOpenException:
        return fallback_service.get()
```

### 7.3 排除异常

```python
@circuit_breaker(
    name="validation_api",
    excluded_exceptions=(ValidationError,)
)
def process_data(data):
    if not validate(data):
        raise ValidationError("Invalid data")
    return api.submit(data)
```

---

## 8. 监控和调试

### 8.1 获取状态

```python
breaker = CircuitBreaker(name="monitored")

status = breaker.get_status()
print(f"名称: {status['name']}")
print(f"状态: {status['state']}")
print(f"失败阈值: {status['failure_threshold']}")
print(f"恢复超时: {status['recovery_timeout']}")
```

### 8.2 获取指标

```python
metrics = breaker.metrics

print(f"总调用: {metrics.total_calls}")
print(f"成功: {metrics.successful_calls}")
print(f"失败: {metrics.failed_calls}")
print(f"拒绝: {metrics.rejected_calls}")
print(f"成功率: {metrics.success_rate:.2%}")
print(f"连续失败: {metrics.consecutive_failures}")
```

### 8.3 健康检查

```python
if not breaker.metrics.is_healthy:
    alert("熔断器不健康!")
    print(f"连续失败: {breaker.metrics.consecutive_failures}")
```

### 8.4 状态变更日志

```python
import logging

logger = logging.getLogger(__name__)

def on_state_change(circuit_breaker):
    logger.warning(
        f"Circuit {circuit_breaker.name} changed to {circuit_breaker.state}"
    )

breaker = CircuitBreaker(
    name="logged",
    on_state_change=on_state_change
)
```

---

## 9. 高级用法

### 9.1 熔断器组合

```python
user_breaker = CircuitBreaker(name="user_service")
order_breaker = CircuitBreaker(name="order_service")
payment_breaker = CircuitBreaker(name="payment_service")

def get_user_with_orders(user_id):
    user = user_breaker.call(get_user, user_id)
    orders = order_breaker.call(get_orders, user_id)
    return {"user": user, "orders": orders}
```

### 9.2 与重试结合

```python
from FQBase.Foundation import circuit_breaker, retry_with_exponential_backoff

@circuit_breaker(name="resilient_api")
@retry_with_exponential_backoff(max_attempts=3)
def call_api():
    return api.get()
# 外层熔断器防止级联故障
# 内层重试处理暂时性故障
```

### 9.3 动态调整阈值

```python
breaker = CircuitBreaker(name="adaptive", failure_threshold=5)

# 根据错误率动态调整
if error_rate > 0.5:
    breaker.failure_threshold = 3
elif error_rate < 0.1:
    breaker.failure_threshold = 10
```

### 9.4 测试熔断器

```python
def test_circuit_breaker_opens():
    breaker = CircuitBreaker(name="test", failure_threshold=3)

    for i in range(3):
        try:
            breaker.call(fail_function)
        except Exception:
            pass

    assert breaker.state == CircuitState.OPEN

    try:
        breaker.call(success_function)
    except CircuitBreakerOpenException:
        pass  # 预期抛出
```

### 9.5 持久化状态

```python
import json

def save_state(breaker, filepath):
    status = breaker.get_status()
    with open(filepath, 'w') as f:
        json.dump(status, f)

def load_state(filepath):
    with open(filepath, 'r') as f:
        status = json.load(f)
    return status
```
