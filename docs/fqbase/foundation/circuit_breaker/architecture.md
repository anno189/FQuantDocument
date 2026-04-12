# Circuit Breaker 模块架构

## 1. 模块结构

```
circuit_breaker.py
├── CircuitState (Enum)              # 熔断器状态枚举
├── CircuitBreakerOpenException     # 熔断器打开异常
├── CircuitBreakerMetrics          # 指标数据类
├── CircuitBreaker                 # 熔断器核心类
├── CircuitBreakerManager          # 熔断器管理器
└── circuit_breaker               # 装饰器工厂函数
```

## 2. 核心组件

### 2.1 CircuitState

```python
class CircuitState(Enum):
    CLOSED = "closed"      # 正常状态
    OPEN = "open"         # 熔断打开
    HALF_OPEN = "half_open"  # 半开尝试恢复
```

### 2.2 CircuitBreakerMetrics

```python
@dataclass
class CircuitBreakerMetrics:
    total_calls: int = 0           # 总调用数
    successful_calls: int = 0      # 成功次数
    failed_calls: int = 0          # 失败次数
    rejected_calls: int = 0        # 拒绝次数
    state_changes: int = 0         # 状态变更次数
    last_failure_time: float = None
    last_success_time: float = None
    consecutive_failures: int = 0  # 连续失败
    consecutive_successes: int = 0 # 连续成功
```

### 2.3 CircuitBreaker

```python
class CircuitBreaker:
    def __init__(
        self,
        name: str = "default",
        failure_threshold: int = 5,
        success_threshold: int = 2,
        recovery_timeout: float = 60.0,
        excluded_exceptions: tuple = (),
        on_state_change: Callable = None,
    ):
        self.name = name
        self._state = CircuitState.CLOSED
        self._lock = threading.Lock()
        self._metrics = CircuitBreakerMetrics()
```

### 2.4 CircuitBreakerManager

```python
class CircuitBreakerManager:
    _instance = None  # 单例实例
    _lock = threading.Lock()

    def __init__(self):
        self._circuit_breakers: Dict[str, CircuitBreaker] = {}
        self._instance_lock = threading.Lock()
```

## 3. 调用流程

### 3.1 同步调用流程

```
breaker.call(func, *args, **kwargs)
        │
        ▼
┌───────────────────┐
│ can_execute()?    │
│ (检查状态转换)     │
└───────────────────┘
        │
        ├─── NO ──► record_rejection()
        │              │
        │              ▼
        │         CircuitBreakerOpenException
        │
        YES
        │
        ▼
┌───────────────────┐
│   try: func()    │
└───────────────────┘
        │
        ├─── 成功 ──► record_success()
        │              │
        │              └───► 返回结果
        │
        └─── 异常 ──► record_failure(exception)
                              │
                              ├─── 达到阈值 ──► transition_to(OPEN)
                              │
                              └───► 抛出异常
```

### 3.2 状态转换流程

```
_check_state_transition()
        │
        ▼
┌───────────────────┐
│ state == OPEN?   │
└───────────────────┘
        │
        YES
        │
        ▼
┌───────────────────────────┐
│ elapsed >= recovery_timeout?│
└───────────────────────────┘
        │
        ├─── YES ──► transition_to(HALF_OPEN)
        │
        NO
        │
        └───► 保持 OPEN
```

## 4. 线程安全

### 4.1 锁机制

所有状态修改和指标记录都使用 `threading.Lock`：

```python
def record_success(self):
    with self._lock:
        self._metrics.total_calls += 1
        self._metrics.successful_calls += 1
        ...

def _transition_to(self, new_state):
    with self._lock:
        old_state = self._state
        self._state = new_state
        self._state_change_time = time.time()
        self._metrics.state_changes += 1
```

### 4.2 双检锁单例

```python
class CircuitBreakerManager:
    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
        return cls._instance
```

## 5. 装饰器实现

```python
def circuit_breaker(...):
    def decorator(func: Callable) -> Callable:
        cb_name = name or func.__name__
        _breaker = CircuitBreakerManager().get_or_create(cb_name)

        @wraps(func)
        def wrapper(*args, **kwargs):
            return _breaker.call(func, *args, **kwargs)

        @wraps(func)
        async def async_wrapper(*args, **kwargs):
            return await _breaker.call_async(func, *args, **kwargs)

        # 根据函数类型返回不同包装器
        if asyncio.iscoroutinefunction(func):
            return async_wrapper
        return wrapper

    return decorator
```

## 6. 数据流图

```
┌─────────────────────────────────────────────────────────────────┐
│                         调用方                                   │
│                    breaker.call(func)                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CircuitBreaker                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    _lock (threading.Lock)               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│              ┌───────────────┼───────────────┐                 │
│              ▼               ▼               ▼                   │
│  ┌─────────────────┐ ┌─────────────┐ ┌─────────────────┐     │
│  │     state       │ │   metrics   │ │state_change_time │     │
│  │ CircuitState    │ │   Metrics   │ │     float        │     │
│  └─────────────────┘ └─────────────┘ └─────────────────┘     │
│                              │                                   │
│              ┌───────────────┴───────────────┐                 │
│              ▼                               ▼                 │
│  ┌─────────────────────────┐ ┌─────────────────────────────┐   │
│  │  record_success()       │ │  record_failure()          │   │
│  │  record_rejection()     │ │  (检查阈值，决定状态转换)    │   │
│  └─────────────────────────┘ └─────────────────────────────┘   │
│                              │                                   │
│              ┌───────────────┴───────────────┐                 │
│              ▼                               ▼                   │
│  ┌─────────────────────────┐ ┌─────────────────────────────┐   │
│  │   transition_to()       │ │  _check_state_transition()  │   │
│  │   状态变更               │ │  (检查是否需要转换到半开)     │   │
│  └─────────────────────────┘ └─────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CircuitBreakerManager                      │
│              (单例，管理所有熔断器实例)                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              _circuit_breakers: Dict                   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## 7. 依赖关系

```
circuit_breaker.py
│
├── threading (标准库)
├── time (标准库)
├── logging (标准库)
├── typing (标准库)
├── enum (标准库)
├── dataclasses (标准库)
├── functools (标准库)
│
└── exceptions (FQBase.Foundation.exceptions)
    └── FQException
```

## 8. 设计权衡

### 8.1 连续失败 vs 失败率

**决策**：使用连续失败计数，而非滑动窗口失败率

**原因**：
- 实现简单，易于调试
- 适合服务突然完全不可用的情况
- 无需维护历史数据

**权衡**：
- 无法区分「偶尔失败」和「持续失败」
- 对逐渐降级的服务响应较慢

### 8.2 同步 vs 异步

**决策**：同时支持同步和异步

**实现**：
- `call()` - 同步执行
- `call_async()` - 异步执行
- 装饰器自动根据函数类型选择

### 8.3 单例管理器

**决策**：使用单例模式的 `CircuitBreakerManager`

**原因**：
- 全局管理所有熔断器
- 便于监控和配置
- 自动复用同名熔断器
