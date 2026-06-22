# ADR-004: 熔断器模式 (Circuit Breaker)

## 状态
**Accepted** | 2024-04-22

## 背景
远程服务调用可能失败或响应缓慢。如果持续调用不可用服务，会导致：
- 资源耗尽（线程池满）
- 级联故障（影响依赖服务）
- 用户体验差（长时间等待）

## 决策
实现熔断器模式，保护远程调用：

### 状态机
```
         ┌─────────────────────────────────────┐
         │                                     │
         ▼                                     │
    ┌────────┐    failure_threshold    ┌────────┐
    │ CLOSED │ ──────────────────────► │  OPEN  │
    └────────┘                         └────────┘
         ▲                                   │
         │                                   │ recovery_timeout
         │    success_threshold              │
         │ ◄────────────────────────────────┘
         │                        ┌───────────┐
         └──────────────────────►  │ HALF_OPEN │
              failure_threshold   └───────────┘
```

### 状态说明
| 状态 | 行为 |
|------|------|
| CLOSED | 正常执行，失败累计 |
| OPEN | 直接拒绝，快速失败 |
| HALF_OPEN | 允许试探性请求 |

## 实施方案

```python
class CircuitBreaker:
    def __init__(
        self,
        name: str = "default",
        failure_threshold: int = 5,
        success_threshold: int = 2,
        recovery_timeout: float = 60.0,
    ):
        ...

    def call(self, func, *args, **kwargs):
        """执行函数，带熔断保护"""
        if not self.can_execute():
            raise CircuitBreakerOpenException(...)
        try:
            result = func(*args, **kwargs)
            self.record_success()
            return result
        except Exception as e:
            self.record_failure(e)
            raise
```

## 装饰器支持
```python
@circuit_breaker(name="user_api", failure_threshold=3)
def get_user(user_id):
    return user_service.get(user_id)
```

## 后果

### 正面
- 快速失败，防止资源耗尽
- 自动恢复，无需人工干预
- 状态可视化，便于监控

### 负面
- 增加复杂度
- 误判可能导致暂时不可用
- 恢复 timeout 需要调优

## 相关决策
- ADR-005: 重试机制 (Retry)

## 维护记录
| 日期 | 变更 |
|------|------|
| 2024-04-22 | 初始版本 |
