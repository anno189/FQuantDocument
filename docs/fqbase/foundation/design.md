# Foundation 模块设计决策

## 目录

1. [设计目标](#1-设计目标)
2. [架构决策](#2-架构决策)
3. [单例模式决策](#3-单例模式决策)
4. [依赖注入决策](#4-依赖注入决策)
5. [熔断器决策](#5-熔断器决策)
6. [重试策略决策](#6-重试策略决策)
7. [异常体系决策](#7-异常体系决策)

---

## 1. 设计目标

### 1.1 核心目标

Foundation 模块旨在为 FQBase 框架提供：

- **通用性**：不包含任何业务逻辑的通用抽象
- **独立性**：不依赖 Core 层（Logger、EventBus等）
- **线程安全**：所有组件支持多线程环境
- **可测试**：设计考虑单元测试和集成测试需求

### 1.2 非目标

- 不提供具体的业务实现
- 不提供具体的网络请求、数据库操作
- 不提供具体的日志记录、事件处理

---

## 2. 架构决策

### 2.1 分层设计

**决策**：Foundation 层位于基础层，不依赖任何其他 FQBase 模块

```
FQBase
├── Foundation (基础层)
│   ├── 设计模式 (singleton, container)
│   ├── 容错 (retry, circuit_breaker)
│   ├── 工具 (validators, crypto, dotty)
│   └── 异常 (exceptions)
│
├── Core (核心服务层)
│   ├── Logger
│   ├── EventBus
│   ├── Notification
│   └── Config
│
├── DataStore (数据层)
│   ├── MongoDB
│   └── Redis
│
└── Trading (交易层)
    ├── Broker
    └── Strategy
```

**原因**：
- Foundation 提供的抽象可能被 Core 层使用
- 避免循环依赖
- 提高模块内聚性

### 2.2 导入规范

**决策**：Foundation 模块内部组件可以通过 `FQBase.Foundation` 一站式导入

```python
from FQBase.Foundation import (
    singleton,
    ServiceContainer,
    circuit_breaker,
    retry,
    FQException,
)
```

**原因**：
- 减少导入路径层级
- 统一命名空间
- 便于重构（内部模块路径变更不影响用户代码）

---

## 3. 单例模式决策

### 3.1 元类 vs 装饰器

**决策**：同时提供元类 `SingletonMeta` 和装饰器 `singleton`

**元类方式**：
```python
class MyClass(metaclass=SingletonMeta):
    pass
```

**装饰器方式**：
```python
@singleton
class MyClass:
    pass
```

**原因**：
- 元类方式适合框架开发者，直接继承即可
- 装饰器方式适合应用开发者，非侵入式
- 两者底层实现相同，都是双检锁

### 3.2 双检锁 (Double-Checked Locking)

**决策**：使用双检锁实现线程安全的单例

```python
def __call__(cls, *args, **kwargs):
    if cls._singleton_instance is None:
        with cls._singleton_lock:
            if cls._singleton_instance is None:
                cls._singleton_instance = super().__call__(*args, **kwargs)
    return cls._singleton_instance
```

**原因**：
- 性能优化：大部分情况下不需要获取锁
- 线程安全：多个线程同时检查时只有一个能创建实例
- 避免每次调用都加锁的性能开销

### 3.3 测试重置支持

**决策**：提供 `reset_singleton()` 方法支持测试隔离

**原因**：
- 单元测试需要隔离环境
- 集成测试需要重置全局状态
- 不提供重置会导致测试顺序依赖

---

## 4. 依赖注入决策

### 4.1 构造函数注入 vs Setter注入

**决策**：使用构造函数注入，不支持 Setter 注入

**构造函数注入**：
```python
class DataService:
    def __init__(self, cache: ICache, logger: ILogger):
        self.cache = cache
        self.logger = logger
```

**原因**：
- 强制依赖声明，不可绕过
- 便于静态分析依赖关系
- 避免运行时才发现依赖缺失
- 与 Python 类型提示配合良好

### 4.2 生命周期类型

**决策**：支持三种生命周期：Singleton、Transient、Scoped

| 生命周期 | 适用场景 |
|----------|----------|
| SINGLETON | 无状态服务、全局配置、连接池 |
| TRANSIENT | 有状态对象、请求级对象 |
| SCOPED | Web请求、会话级对象 |

**原因**：
- 覆盖主流需求
- 实现简洁高效
- 便于扩展（如 Web 请求作用域）

### 4.3 循环依赖检测

**决策**：在运行时检测循环依赖，抛出 `CircularDependencyException`

**原因**：
- Python 语言层面没有循环依赖保护
- 循环依赖会导致栈溢出或难以调试的错误
- 提前检测可以快速定位问题

---

## 5. 熔断器决策

### 5.1 三态状态机

**决策**：采用 CLOSED → OPEN → HALF_OPEN 三态模型

| 状态 | 行为 |
|------|------|
| CLOSED | 正常执行，失败计数 |
| OPEN | 拒绝所有请求，等待恢复 |
| HALF_OPEN | 允许有限请求，尝试恢复 |

**原因**：
- 三态模型是熔断器的标准实现
- CLOSED 保护系统不过载
- OPEN 快速失败防止级联故障
- HALF_OPEN 渐进恢复验证服务状态

### 5.2 失败计数 vs 失败率

**决策**：使用连续失败计数，而非滑动窗口失败率

**连续失败计数**：
```python
if consecutive_failures >= failure_threshold:
    transition_to(OPEN)
```

**原因**：
- 实现简单，易于理解和调试
- 适合服务突然完全不可用的情况
- 失败率计算复杂度高，且需要维护历史数据

**权衡**：
- 无法区分「偶尔失败」和「持续失败」
- 对服务逐渐降级的情况响应较慢

### 5.3 装饰器 vs 手动管理

**决策**：同时提供装饰器 `@circuit_breaker` 和手动管理 `CircuitBreaker`

**装饰器**：
```python
@circuit_breaker(name="api")
def call_api():
    return api.get()
```

**手动管理**：
```python
breaker = CircuitBreaker(name="api")
result = breaker.call(call_api)
```

**原因**：
- 装饰器适合简单场景
- 手动管理适合需要细粒度控制的场景
- 两者底层共享 `CircuitBreaker` 实现

---

## 6. 重试策略决策

### 6.1 装饰器 vs 上下文管理器

**决策**：使用装饰器模式，不提供上下文管理器

**装饰器**：
```python
@retry(max_attempts=3)
def fetch_data():
    return api.get()
```

**原因**：
- Python 装饰器是主流做法
- 非侵入式，使用简单
- 与函数签名兼容良好

### 6.2 固定延迟 vs 指数退避

**决策**：同时支持固定延迟和指数退避

| 策略 | 公式 | 适用场景 |
|------|------|----------|
| 固定延迟 | random(min, max) | 已知故障时间 |
| 指数退避 | min(base * 2^n, max) | 网络抖动、限流 |

**原因**：
- 不同场景需要不同策略
- 指数退避是 API 限流的推荐做法
- 两者实现复杂度相当

### 6.3 异常过滤

**决策**：支持 `retry_on_exception` 参数过滤异常类型

```python
@retry(retry_on_exception=(ConnectionError, TimeoutError))
def fetch_data():
    return api.get()
```

**原因**：
- 并非所有异常都值得重试
- `ValidationError` 等业务异常不应重试
- 避免重试导致的数据不一致

---

## 7. 异常体系决策

### 7.1 异常层次设计

**决策**：采用分层异常体系，按模块分类

```
FQException (基类)
├── DataSourceException
├── StrategyException
├── ConfigException
├── NetworkException
├── RedisException
├── MongoDBException
└── CeleryException
```

**原因**：
- 便于按模块捕获和处理
- 异常编码便于日志归类和监控
- 与业务领域划分一致

### 7.2 错误码前缀

**决策**：每个异常子类有独立的错误码前缀

| 前缀 | 模块 |
|------|------|
| FQ | 通用 |
| FQ-DS | 数据源 |
| FQ-ST | 策略 |
| FQ-CF | 配置 |
| FQ-NET | 网络 |
| FQ-REDIS | Redis |
| FQ-MONGO | MongoDB |
| FQ-CELERY | Celery |
| FQ-CB | 熔断器 |

**原因**：
- 便于监控系统归类
- 错误码全局唯一
- 便于日志检索和告警

### 7.3 异常属性

**决策**：每个异常包含 `message`、`code`、`details`

```python
raise DataSourceException(
    message="Failed to fetch data",
    code="FQ-DS-FETCH",
    details={'symbol': '600000', 'reason': 'timeout'}
)
```

**原因**：
- `message`：人类可读的错误描述
- `code`：机器可读的错误码
- `details`：调试所需的上下文信息

---

## 8. 验证器决策

### 8.1 函数 vs 类

**决策**：同时提供简单函数和 `Validator` 类

**函数**：
```python
validate_code("600000")  # 快速验证
```

**类**：
```python
validator = Validator()
validator.validate(data, rules)  # 复杂验证
```

**原因**：
- 函数适合简单验证场景
- 类适合需要批量验证和错误收集的场景

### 8.2 规则引擎设计

**决策**：`Validator.validate()` 使用声明式规则

```python
rules = {
    'required': True,
    'type': str,
    'min': 0,
    'max': 100,
    'pattern': r'^\d{6}$',
    'choices': ['SH', 'SZ']
}
```

**原因**：
- 规则声明清晰，易于维护
- 与表单验证库设计一致
- 便于序列化和配置化

---

## 9. 未来演进方向

### 9.1 可能的变化

| 变化 | 触发条件 |
|------|----------|
| 添加 Scope 生命周期 | Web 框架集成需求 |
| AOP 切面支持 | 复杂拦截需求 |
| 验证规则配置化 | 规则外部化需求 |
| 更多验证类型 | 业务扩展 |

### 9.2 不纳入的设计

- ORM/数据库抽象（属于 DataStore 层）
- HTTP 客户端（属于工具层）
- 缓存抽象（属于 Core 层）
- 消息队列抽象（属于 Core 层）
