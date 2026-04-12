# Circuit Breaker 开发指南

## 模块简介

`circuit_breaker` 模块提供熔断器模式实现，用于防止级联故障。当服务连续失败达到阈值时打开熔断器，后续请求直接拒绝而非继续尝试，一段时间后进入半开状态尝试恢复。

### 核心组件

| 组件 | 类型 | 说明 |
|------|------|------|
| `CircuitBreaker` | 类 | 熔断器实现 |
| `CircuitBreakerOpenException` | 异常 | 熔断器打开时抛出的异常 |
| `CircuitBreakerMetrics` | 数据类 | 熔断器指标 |
| `CircuitBreakerManager` | 类 | 熔断器管理器（单例） |
| `CircuitState` | 枚举 | 熔断器状态（CLOSED/OPEN/HALF_OPEN） |
| `circuit_breaker` | 装饰器 | 熔断器装饰器 |

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
python -c "from FQBase.Foundation.circuit_breaker import CircuitBreaker, circuit_breaker; print('OK')"
```

---

## 本地调试

### 基本调试流程

```python
from FQBase.Foundation.circuit_breaker import CircuitBreaker, CircuitBreakerOpenException

breaker = CircuitBreaker(name="test", failure_threshold=3, recovery_timeout=5)

# 模拟失败
for i in range(3):
    try:
        breaker.call(lambda: (_ for _ in ()).throw(Exception("Error")))
    except Exception:
        pass

print(f"State: {breaker.state}")  # OPEN
print(f"Metrics: {breaker.metrics.to_dict()}")
```

### 调试熔断器状态

```python
from FQBase.Foundation.circuit_breaker import CircuitBreaker, CircuitState

breaker = CircuitBreaker(name="debug_test", failure_threshold=2)

# 检查状态
print(f"Initial state: {breaker.state}")  # CLOSED

# 获取详细状态
status = breaker.get_status()
print(f"Status: {status}")
```

### 调试指标

```python
from FQBase.Foundation.circuit_breaker import CircuitBreaker

breaker = CircuitBreaker(name="metrics_test")

# 模拟调用
for _ in range(5):
    try:
        breaker.call(lambda: "success")
    except Exception:
        pass

# 查看指标
metrics = breaker.metrics
print(f"Total calls: {metrics.total_calls}")
print(f"Success rate: {metrics.success_rate}")
print(f"Consecutive failures: {metrics.consecutive_failures}")
```

---

## 测试指南

### 运行测试

```bash
cd /Users/A.D.189/FQuant/FQuant.Server/FQBase
pytest -v FQBase/Foundation/test_circuit_breaker.py
```

### 测试结构

```python
import pytest
from FQBase.Foundation.circuit_breaker import (
    CircuitBreaker,
    CircuitBreakerOpenException,
    CircuitState,
    circuit_breaker
)

class TestCircuitBreaker:
    def test_initial_state(self):
        breaker = CircuitBreaker(name="test", failure_threshold=3)
        assert breaker.state == CircuitState.CLOSED

    def test_open_after_failures(self):
        breaker = CircuitBreaker(name="test", failure_threshold=2)

        for _ in range(2):
            try:
                breaker.call(lambda: (_ for _ in ()).throw(Exception("Error")))
            except Exception:
                pass

        assert breaker.state == CircuitState.OPEN

    def test_half_open_after_timeout(self):
        breaker = CircuitBreaker(name="test", failure_threshold=1, recovery_timeout=0.1)
        breaker.record_failure()
        assert breaker.state == CircuitState.OPEN

        import time
        time.sleep(0.2)
        assert breaker.state == CircuitState.HALF_OPEN
```

### 测试装饰器

```python
class TestCircuitBreakerDecorator:
    def test_decorator_success(self):
        @circuit_breaker(name="test", failure_threshold=3)
        def succeed():
            return "success"

        result = succeed()
        assert result == "success"

    def test_decorator_failure(self):
        call_count = 0

        @circuit_breaker(name="test", failure_threshold=2)
        def fail():
            nonlocal call_count
            call_count += 1
            raise Exception("Error")

        for _ in range(3):
            try:
                fail()
            except Exception:
                pass

        assert call_count == 3  # 前2次失败，第3次被熔断拒绝
```

### 测试上下文管理器

```python
class TestContextManager:
    def test_context_manager_success(self):
        with CircuitBreaker(name="test") as breaker:
            result = breaker.call(lambda: "success")
            assert result == "success"

    def test_context_manager_failure(self):
        with CircuitBreaker(name="test") as breaker:
            try:
                breaker.call(lambda: (_ for _ in ()).throw(Exception("Error")))
            except Exception:
                pass

        assert breaker.state == CircuitState.OPEN
```

---

## 代码规范

### 熔断器命名规范

```python
# 推荐：明确的业务名称
@circuit_breaker(name="user_service", failure_threshold=5)
def get_user(user_id):
    return user_api.get(user_id)

@circuit_breaker(name="payment_gateway", failure_threshold=3)
def process_payment(order):
    return payment_api.charge(order)

# 避免：无意义的名称
@circuit_breaker(name="cb1")
def get_data():
    pass
```

### 异常过滤规范

```python
# 推荐：明确排除不需要熔断的异常
breaker = CircuitBreaker(
    name="api",
    failure_threshold=5,
    excluded_exceptions=(ValidationError, UserNotFoundError)  # 这些异常不计入失败
)

# 使用装饰器
@circuit_breaker(name="api", excluded_exceptions=(ValueError,))
def call_api():
    pass
```

### 状态回调规范

```python
import logging

logger = logging.getLogger(__name__)

def on_state_change(circuit_breaker):
    """状态变更回调"""
    logger.warning(f"Circuit {circuit_breaker.name} changed to {circuit_breaker.state}")

breaker = CircuitBreaker(
    name="monitored",
    failure_threshold=3,
    on_state_change=on_state_change
)
```

---

## 调试技巧

### 打印熔断器状态

```python
from FQBase.Foundation.circuit_breaker import CircuitBreaker

breaker = CircuitBreaker(name="debug")

# 获取完整状态
import json
status = breaker.get_status()
print(json.dumps(status, indent=2))
```

### 手动触发熔断

```python
breaker = CircuitBreaker(name="test", failure_threshold=3)

# 手动记录失败
for _ in range(3):
    breaker.record_failure(Exception("Manual failure"))

print(f"State: {breaker.state}")  # OPEN
```

### 监听状态变化

```python
state_changes = []

def track_state_change(cb):
    state_changes.append({
        'name': cb.name,
        'state': cb.state.value,
        'time': time.time()
    })

breaker = CircuitBreaker(
    name="tracked",
    failure_threshold=1,
    on_state_change=track_state_change
)

breaker.record_failure()
print(f"State changes: {state_changes}")
```

---

## 常见问题

### Q: 熔断器打开后如何恢复？

熔断器会在 `recovery_timeout` 时间后自动进入半开状态：

```python
breaker = CircuitBreaker(name="test", failure_threshold=3, recovery_timeout=60)

# 触发熔断
for _ in range(3):
    breaker.record_failure(Exception("Error"))

print(breaker.state)  # OPEN

# 等待恢复超时
import time
time.sleep(61)

print(breaker.state)  # HALF_OPEN

# 半开状态下如果成功，会关闭熔断器
breaker.record_success()
breaker.record_success()  # 连续成功达到 success_threshold
print(breaker.state)  # CLOSED
```

### Q: 如何获取所有熔断器的状态？

```python
from FQBase.Foundation.circuit_breaker import CircuitBreakerManager

manager = CircuitBreakerManager()

# 注册熔断器
manager.register("service_a", failure_threshold=5)
manager.register("service_b", failure_threshold=3)

# 获取所有状态
all_status = manager.get_all_status()
for name, status in all_status.items():
    print(f"{name}: {status['state']}")
```

### Q: 如何处理熔断器打开时的请求？

```python
from FQBase.Foundation.circuit_breaker import circuit_breaker, CircuitBreakerOpenException

@circuit_breaker(name="user_api", failure_threshold=3)
def get_user(user_id):
    return user_api.get(user_id)

# 调用方处理熔断
def fetch_user(user_id):
    try:
        return get_user(user_id)
    except CircuitBreakerOpenException:
        return get_cached_user(user_id)  # 降级方案
```

---

## 相关文档

- [API 参考](api.md)
- [使用指南](usage.md)
- [最佳实践](best-practices.md)
- [架构设计](architecture.md)
- [设计决策](design.md)
- [FAQ](faq.md)