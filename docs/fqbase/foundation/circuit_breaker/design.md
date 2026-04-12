# Circuit Breaker 模块设计决策

## 目录

1. [设计目标](#1-设计目标)
2. [状态机设计](#2-状态机设计)
3. [线程安全设计](#3-线程安全设计)
4. [API 设计](#4-api-设计)
5. [性能决策](#5-性能决策)

---

## 1. 设计目标

### 1.1 核心目标

Circuit Breaker 模块旨在提供：

- **故障隔离**：防止级联故障扩散
- **快速失败**：熔断打开时立即返回，避免等待
- **自动恢复**：半开状态尝试检测服务恢复
- **可观测性**：详细记录调用指标

### 1.2 非目标

- 不提供超时管理（应配合超时机制使用）
- 不提供请求排队或缓冲
- 不提供流量限制

---

## 2. 状态机设计

### 2.1 三态模型

**决策**：采用 CLOSED → OPEN → HALF_OPEN 三态模型

| 状态 | 说明 | 行为 |
|------|------|------|
| CLOSED | 正常 | 执行请求，失败计数 |
| OPEN | 打开 | 拒绝请求，快速失败 |
| HALF_OPEN | 半开 | 允许有限请求，尝试恢复 |

**原因**：
- 三态模型是熔断器模式的经典实现
- CLOSED 保护系统正常运作
- OPEN 快速失败防止级联故障
- HALF_OPEN 渐进恢复验证服务状态

### 2.2 失败计数策略

**决策**：使用连续失败计数，而非滑动窗口失败率

```python
if self._state == CircuitState.CLOSED:
    if self._metrics.consecutive_failures >= self.failure_threshold:
        self._transition_to(CircuitState.OPEN)
```

**替代方案考虑**：

| 方案 | 优点 | 缺点 |
|------|------|------|
| 连续失败计数 | 实现简单、易调试 | 无法区分偶尔失败和持续失败 |
| 滑动窗口失败率 | 精确反映失败率 | 实现复杂、需要维护历史数据 |
| 时间衰减失败率 | 对近期失败更敏感 | 权重调整困难 |

**选择原因**：
- 实现简洁，易于理解和调试
- 适合服务突然完全不可用的情况
- 无需维护历史数据，内存开销小

### 2.3 状态转换规则

```python
# CLOSED → OPEN
if failure_count >= failure_threshold:
    transition(OPEN)

# OPEN → HALF_OPEN
if elapsed >= recovery_timeout:
    transition(HALF_OPEN)

# HALF_OPEN → CLOSED
if consecutive_success >= success_threshold:
    transition(CLOSED)

# HALF_OPEN → OPEN
if failure:
    transition(OPEN)
```

---

## 3. 线程安全设计

### 3.1 粗粒度锁

**决策**：所有状态修改使用单一 `threading.Lock`

```python
self._lock = threading.Lock()

def record_success(self):
    with self._lock:
        self._metrics.total_calls += 1
        self._metrics.consecutive_successes += 1
        ...
```

**原因**：
- 实现简单，不易死锁
- 性能足够（熔断器调用频率不高）
- 避免复杂的状态机竞态条件

**替代方案考虑**：

| 方案 | 优点 | 缺点 |
|------|------|------|
| 单一锁 | 简单、不死锁 | 并发度低 |
| 分段锁 | 并发度高 | 可能死锁 |
| 无锁 | 最高并发 | 实现复杂、易出错 |

### 3.2 双重检查锁定

**决策**：状态转换使用双重检查

```python
@property
def state(self):
    with self._lock:
        self._check_state_transition()
        return self._state
```

**原因**：
- 保证状态检查和获取的原子性
- 避免在检查和返回之间发生状态转换

---

## 4. API 设计

### 4.1 三种使用模式

**决策**：同时支持装饰器、手动调用、上下文管理器

**装饰器模式**：
```python
@circuit_breaker(name="api")
def call_api():
    return api.get()
```

**手动调用模式**：
```python
breaker = CircuitBreaker(name="api")
result = breaker.call(func)
```

**上下文管理器模式**：
```python
with CircuitBreaker(name="api") as breaker:
    result = breaker.call(func)
```

**原因**：
- 装饰器适合简单场景
- 手动调用适合需要细粒度控制的场景
- 上下文管理器适合资源管理场景

### 4.2 装饰器工厂函数

**决策**：`@circuit_breaker(...)` 语法糖

```python
@circuit_breaker(name="api", failure_threshold=5)
def call_api():
    pass
```

**实现**：
```python
def circuit_breaker(...):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            return _breaker.call(func, *args, **kwargs)
        return wrapper
    return decorator
```

### 4.3 异常过滤

**决策**：通过 `excluded_exceptions` 参数排除特定异常

```python
breaker = CircuitBreaker(
    excluded_exceptions=(ValidationError, AuthError)
)
```

**原因**：
- 并非所有异常都值得重试
- 业务异常（如验证错误）不应触发熔断
- 提高熔断器的准确性

---

## 5. 性能决策

### 5.1 单例管理器

**决策**：`CircuitBreakerManager` 使用单例模式

```python
class CircuitBreakerManager:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
        return cls._instance
```

**原因**：
- 全局管理所有熔断器
- 便于监控和配置
- 自动复用同名熔断器

### 5.2 装饰器缓存

**决策**：装饰器自动复用同名熔断器

```python
_breaker = CircuitBreakerManager().get_or_create(cb_name)
```

**效果**：
```python
@circuit_breaker(name="api")
def call1(): pass

@circuit_breaker(name="api")
def call2(): pass

# call1 和 call2 共用同一个熔断器
```

### 5.3 指标存储

**决策**：使用 `@dataclass` 存储指标

```python
@dataclass
class CircuitBreakerMetrics:
    total_calls: int = 0
    successful_calls: int = 0
    failed_calls: int = 0
    ...
```

**原因**：
- 代码简洁
- 自动实现 `__init__`
- 便于序列化和调试

---

## 6. 错误编码

### 6.1 异常错误码

**决策**：熔断器相关异常使用 `FQ-CB-*` 前缀

| 错误码 | 说明 |
|--------|------|
| `FQ-CB-OPEN` | 熔断器打开 |
| `FQ-CB-*` | 其他熔断器错误 |

### 6.2 异常属性

**决策**：异常包含 `circuit_name` 和 `recovery_timeout`

```python
class CircuitBreakerOpenException(FQException):
    def __init__(self, circuit_name: str, recovery_timeout: float):
        self.circuit_name = circuit_name
        self.recovery_timeout = recovery_timeout
```

**原因**：
- 便于调用方决定重试策略
- 便于日志记录和问题定位

---

## 7. 未来演进方向

### 7.1 可能的变化

| 变化 | 触发条件 |
|------|----------|
| 滑动窗口失败率 | 需要精确失败率控制 |
| 半开状态请求数限制 | 高并发场景需要限流 |
| 自适应阈值 | 基于历史数据自动调整 |
| 事件订阅 | 需要更灵活的事件处理 |

### 7.2 不纳入的设计

- **请求缓冲**：增加复杂度，可能导致内存问题
- **主动探测**：需要额外的探测逻辑
- **分布式熔断**：需要协调机制（如 Redis）
