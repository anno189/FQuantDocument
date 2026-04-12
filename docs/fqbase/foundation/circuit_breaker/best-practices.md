# Circuit Breaker 模块最佳实践

## 目录

1. [配置指南](#1-配置指南)
2. [使用场景](#2-使用场景)
3. [性能优化](#3-性能优化)
4. [错误处理](#4-错误处理)
5. [监控告警](#5-监控告警)
6. [测试策略](#6-测试策略)
7. [维护事宜](#7-维护事宜)

---

## 1. 配置指南

### 1.1 失败阈值设置

根据服务类型选择合适的失败阈值：

| 服务类型 | failure_threshold | recovery_timeout | 说明 |
|----------|-------------------|------------------|------|
| 关键服务 | 3-5 | 60s | 快速熔断保护核心功能 |
| 普通API | 5-10 | 120s | 容忍暂时故障 |
| 外部API | 10-20 | 300s | 考虑网络抖动 |
| 缓存服务 | 20+ | 60s | 可容忍更多失败 |

### 1.2 成功阈值设置

```python
GOOD:
breaker = CircuitBreaker(
    success_threshold=2,  # 快速确认恢复
)

BAD:
breaker = CircuitBreaker(
    success_threshold=10,  # 恢复太慢
)
```

### 1.3 恢复超时设置

考虑服务启动时间：

```python
# 快速服务（如本地缓存）
breaker = CircuitBreaker(recovery_timeout=30)

# 标准服务（如数据库）
breaker = CircuitBreaker(recovery_timeout=60)

# 慢速服务（如外部API）
breaker = CircuitBreaker(recovery_timeout=120)
```

### 1.4 异常过滤

```python
GOOD:
@circuit_breaker(
    excluded_exceptions=(
        ValidationError,  # 输入验证错误
        AuthError,       # 认证错误
        RateLimitError,  # 限流错误
    )
)
def process():
    pass

BAD:
@circuit_breaker(
    excluded_exceptions=()  # 所有异常都计入失败
)
def process():
    pass
```

---

## 2. 使用场景

### 2.1 适用场景

**推荐使用**：
- 调用外部 HTTP API
- 调用远程服务
- 数据库连接（当连接池耗尽时）
- 消息队列发布
- 文件系统操作（远程存储）

```python
@circuit_breaker(name="user_api", failure_threshold=5)
def get_user(user_id):
    return user_service.get(user_id)
```

### 2.2 不适用场景

**不推荐**：
- 本地计算（不会失败）
- 确定性操作（已知结果）
- 快速重试能解决的问题
- 不需要熔断保护的场景

```python
BAD:
@circuit_breaker
def calculate_sum(numbers):
    return sum(numbers)  # 本地计算，不需要熔断
```

### 2.3 熔断器粒度

```python
GOOD:
# 按服务粒度
user_breaker = CircuitBreaker(name="user_service")
order_breaker = CircuitBreaker(name="order_service")

BAD:
# 太细的粒度
user_name_breaker = CircuitBreaker(name="user_name")
user_email_breaker = CircuitBreaker(name="user_email")
```

---

## 3. 性能优化

### 3.1 避免过度同步

```python
GOOD:
@circuit_breaker(name="api")
async def fetch_data():
    return await api.get()

BAD:
@circuit_breaker(name="sync_api")
def sync_fetch():
    return sync_api.get()  # 如果有异步版本，应该用异步
```

### 3.2 批量操作

```python
GOOD:
@circuit_breaker(name="batch")
def process_batch(items):
    return [process_one(item) for item in items]

BAD:
for item in items:
    @circuit_breaker(name=f"item_{item.id}")  # 每个item一个熔断器
    def process(item):
        pass
```

### 3.3 热点问题

高频调用的熔断器应使用装饰器模式（已自动复用）：

```python
@circuit_breaker(name="hot_api")
def call_hot_api():
    pass

for i in range(1000):
    call_hot_api()  # 复用同一个熔断器
```

---

## 4. 错误处理

### 4.1 降级策略

```python
def get_user_with_fallback(user_id):
    try:
        return user_breaker.call(get_user, user_id)
    except CircuitBreakerOpenException:
        return get_cached_user(user_id)  # 降级返回
    except Exception:
        return get_default_user()
```

### 4.2 部分可用

```python
def get_multiple_users(user_ids):
    results = []
    for user_id in user_ids:
        try:
            results.append(user_breaker.call(get_user, user_id))
        except CircuitBreakerOpenException:
            results.append(None)  # 单个失败不影响其他
    return results
```

### 4.3 超时配合

```python
import signal

class TimeoutException(Exception):
    pass

def timeout_handler(signum, frame):
    raise TimeoutException()

@circuit_breaker(name="with_timeout")
def call_with_timeout():
    signal.signal(signal.SIGALRM, timeout_handler)
    signal.alarm(5)  # 5秒超时
    try:
        return api.get()
    finally:
        signal.alarm(0)
```

---

## 5. 监控告警

### 5.1 关键指标监控

```python
def monitor_circuit_breakers():
    manager = CircuitBreakerManager()

    for name, status in manager.get_all_status().items():
        metrics = status['metrics']

        # 告警条件
        if metrics['rejected_calls'] > 100:
            alert(f"{name}: 拒绝调用过多")

        success_rate = float(metrics['success_rate'].replace('%', '')) / 100
        if success_rate < 0.8:
            alert(f"{name}: 成功率低于80%")
```

### 5.2 状态变更告警

```python
def on_state_change(breaker):
    logger.warning(f"Circuit {breaker.name} changed to {breaker.state.value}")

    if breaker.state == CircuitState.OPEN:
        alert(f"熔断器 {breaker.name} 已打开")

breaker = CircuitBreaker(
    name="monitored",
    on_state_change=on_state_change
)
```

### 5.3 健康报告

```python
def generate_health_report():
    report = []
    manager = CircuitBreakerManager()

    for name, cb in manager._circuit_breakers.items():
        metrics = cb.metrics
        report.append({
            'name': name,
            'state': cb.state.value,
            'total_calls': metrics.total_calls,
            'success_rate': metrics.success_rate,
            'consecutive_failures': metrics.consecutive_failures,
        })

    return report
```

---

## 6. 测试策略

### 6.1 单元测试

```python
def test_circuit_breaker_opens():
    breaker = CircuitBreaker(
        name="test",
        failure_threshold=3,
        recovery_timeout=1
    )

    def fail():
        raise Exception("fail")

    for _ in range(3):
        with pytest.raises(Exception):
            breaker.call(fail)

    assert breaker.state == CircuitState.OPEN

def test_circuit_breaker_closes_after_success():
    breaker = CircuitBreaker(
        name="test",
        failure_threshold=2,
        success_threshold=1,
        recovery_timeout=0.1
    )

    def succeed():
        return "ok"

    breaker.call(succeed)
    assert breaker.state == CircuitState.CLOSED
```

### 6.2 集成测试

```python
def test_integration_with_real_service():
    @circuit_breaker(name="real_test", failure_threshold=1)
    def call_service():
        return real_api.get()

    # 模拟服务故障
    mock_api.fail = True
    with pytest.raises(Exception):
        call_service()

    assert CircuitBreakerManager().get("real_test").state == CircuitState.OPEN
```

### 6.3 测试隔离

```python
def test_isolation():
    CircuitBreakerManager().reset_all()  # 重置所有熔断器

    breaker = CircuitBreaker(name="isolated")
    breaker.call(success_func)
    breaker.reset()

    assert breaker.state == CircuitState.CLOSED
    assert breaker.metrics.total_calls == 0
```

---

## 7. 维护事宜

### 7.1 阈值调整周期

建议每季度审查一次熔断器配置：

```python
QUARTERLY_REVIEW = {
    "user_api": {
        "failure_threshold": 10,  # 根据历史数据调整
        "success_threshold": 3,
        "recovery_timeout": 120,
    },
    "payment_service": {
        "failure_threshold": 5,  # 关键服务，快速熔断
        "success_threshold": 2,
        "recovery_timeout": 60,
    },
}
```

### 7.2 日志规范

```python
import logging

logger = logging.getLogger("circuit_breaker")

def log_state_change(breaker):
    logger.info(
        "Circuit breaker state change",
        extra={
            "name": breaker.name,
            "old_state": breaker._state.value,
            "metrics": breaker.metrics.to_dict(),
        }
    )
```

### 7.3 检查清单

- [ ] 所有外部服务调用使用熔断器
- [ ] 熔断器阈值根据服务重要性分级
- [ ] 实现了降级逻辑
- [ ] 配置了状态变更告警
- [ ] 定期审查熔断器指标
- [ ] 熔断器异常不在业务代码中广泛传播
- [ ] 测试覆盖熔断器状态转换
- [ ] 熔断器配置有文档记录

---

## 8. 常见问题

### 8.1 熔断器打开后不关闭

检查：
- success_threshold 是否太高
- 实际调用是否成功
- 异常是否被正确记录

### 8.2 性能下降

检查：
- 熔断器粒度是否太细
- 状态检查是否过于频繁
- 是否需要使用异步版本

### 8.3 误报熔断

检查：
- failure_threshold 是否太低
- 网络是否稳定
- 是否需要增加 excluded_exceptions
