# Foundation 模块架构

## 1. 模块架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                         Foundation                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  singleton   │  │  lifecycle   │  │  container   │         │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤         │
│  │ 单例模式     │  │ 生命周期协议 │  │ 依赖注入容器  │         │
│  │ • singleton  │  │ • HealthCheck│  │ • Container  │         │
│  │ • MetaClass  │  │ • Initializable│ │ • Locator   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │     retry     │  │circuit_breaker│ │   dotty     │         │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤         │
│  │ 重试装饰器   │  │ 熔断器       │  │ 嵌套字典访问  │         │
│  │ • retry      │  │ • CircuitBreaker│ │ • dotty     │         │
│  │ • backoff    │  │ • State Machine│ │ • Dotty     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  validators  │  │ exceptions   │  │    crypto    │         │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤         │
│  │ 输入验证器   │  │ 统一异常体系  │  │ 随机数生成   │         │
│  │ • code      │  │ • FQException │  │ • random_str │         │
│  │ • date      │  │ • hierarchy   │  │ • random_code│         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 2. 组件详细架构

### 2.1 单例模式 (singleton.py)

```
singleton.py
├── SingletonMeta (元类)
│   ├── __new__()           # 创建类时初始化锁和实例
│   ├── __call__()          # 控制实例创建，双检锁
│   ├── reset_singleton()   # 重置单例（测试用）
│   ├── get_instance()      # 获取当前实例（不创建）
│   └── has_instance()      # 检查实例是否存在
│
└── singleton (装饰器)
    └── 包装类继承原类和元类
```

### 2.2 依赖注入容器 (container.py)

```
container.py
├── CircularDependencyException
│   └── dependency_chain    # 循环依赖路径
│
├── ServiceLifetime (枚举)
│   ├── SINGLETON           # 单例
│   ├── TRANSIENT           # 瞬态（每次创建新实例）
│   └── SCOPED              # 作用域
│
├── ServiceDescriptor
│   ├── service_type        # 服务类型
│   ├── implementation     # 实现类或工厂
│   ├── lifetime           # 生命周期
│   ├── dependencies       # 依赖列表
│   └── get_instance()     # 获取实例
│
├── ServiceContainer
│   ├── register_singleton()
│   ├── register_transient()
│   ├── register_factory()
│   ├── register_instance()
│   ├── get()               # 获取服务
│   ├── try_get()           # 尝试获取
│   ├── _detect_cycle()    # 循环依赖检测
│   └── get_dependency_graph()
│
└── ServiceLocator
    ├── set_container()     # 设置全局容器
    ├── get_container()    # 获取全局容器
    ├── get()               # 获取服务
    └── reset()            # 重置
```

### 2.3 熔断器 (circuit_breaker.py)

```
circuit_breaker.py
├── CircuitState (枚举)
│   ├── CLOSED              # 正常
│   ├── OPEN                # 打开
│   └── HALF_OPEN           # 半开
│
├── CircuitBreakerOpenException
│   └── circuit_name, recovery_timeout
│
├── CircuitBreakerMetrics
│   ├── total_calls
│   ├── successful_calls
│   ├── failed_calls
│   ├── rejected_calls
│   ├── consecutive_failures
│   └── success_rate (property)
│
├── CircuitBreaker
│   ├── state               # 当前状态（property）
│   ├── metrics             # 指标（property）
│   ├── record_success()    # 记录成功
│   ├── record_failure()    # 记录失败
│   ├── record_rejection()  # 记录拒绝
│   ├── can_execute()       # 检查是否可执行
│   ├── call()              # 同步执行
│   ├── call_async()        # 异步执行
│   ├── reset()            # 重置
│   └── get_status()       # 获取状态
│
├── CircuitBreakerManager
│   ├── register()         # 注册熔断器
│   ├── get()              # 获取熔断器
│   ├── get_or_create()   # 获取或创建
│   └── get_all_status()  # 所有状态
│
└── circuit_breaker (装饰器)
    └── @circuit_breaker(name="xxx")
```

### 2.4 重试装饰器 (retry.py)

```
retry.py
├── retry (装饰器)
│   ├── stop_max_attempt_number
│   ├── wait_random_min/max
│   ├── retry_on_exception
│   └── on_retry callback
│
├── retry_with_exponential_backoff (装饰器)
│   ├── max_attempts
│   ├── base_wait
│   ├── max_wait
│   ├── max_total_time
│   └── exponential formula: min(base * 2^(n-1), max)
│
├── RetryError
│
├── RetryContext
│   └── execute()          # 手动重试控制
│
├── create_retry_context()
│
└── async_retry_with_exponential_backoff
```

### 2.5 生命周期管理 (lifecycle.py)

```
lifecycle.py
├── ServiceStatus (枚举)
│   ├── UNKNOWN
│   ├── INITIALIZING
│   ├── RUNNING
│   ├── DEGRADED
│   ├── STOPPING
│   ├── STOPPED
│   └── ERROR
│
├── HealthCheckable (Protocol)
│   └── health_check() -> HealthStatus
│
├── Initializable (Protocol)
│   ├── initialize() -> bool
│   └── is_initialized (property)
│
├── Shutdownable (Protocol)
│   ├── shutdown() -> bool
│   └── is_shutdown (property)
│
├── HealthStatus
│   ├── status
│   ├── message
│   ├── details
│   ├── timestamp
│   └── is_healthy (property)
│
└── CompositeHealthCheck
    ├── register()
    ├── unregister()
    ├── check()
    ├── check_all()
    └── is_all_healthy
```

### 2.6 验证器 (validators.py)

```
validators.py
├── validate_code()         # 6位数字
├── validate_date()         # 日期格式
├── validate_date_range()   # 日期范围
├── validate_date_range_with_tz()  # 带时区
├── validate_market()       # 市场代码
├── validate_frequency()   # K线周期
├── validate_dict()         # 字典键
├── validate_positive_number()
├── validate_percentage()
│
├── ValidationError
│
└── Validator
    ├── add_error()
    ├── has_errors()
    ├── get_errors()
    ├── clear_errors()
    └── validate()
```

### 2.7 异常 (exceptions.py)

```
exceptions.py
├── FQException (基类)
│   ├── message
│   ├── code
│   ├── details
│   └── to_dict()
│
├── DataSourceException
│   ├── DataFetchException
│   ├── DataParseException
│   ├── DataSaveException
│   ├── DataSourceConnectionError
│   ├── DataNotFoundError
│   └── DataSourceAPIError
│
├── StrategyException
│   ├── StrategyInitException
│   └── StrategyExecuteException
│
├── ConfigException
│   ├── ConfigLoadException
│   └── ConfigValidationException
│
├── NetworkException
├── RedisException
├── MongoDBException
│   ├── MongoDBConnectionException
│   └── MongoDBOperationException
└── CeleryException
```

### 2.8 Dotty (dotty.py)

```
dotty.py
├── dotty()               # 工厂函数
│
├── Dotty
│   ├── __getitem__()     # 点号访问
│   ├── __setitem__()    # 点号赋值
│   ├── __contains__()   # 深度包含检查
│   ├── __getattr__()    # 属性访问
│   ├── copy()
│   ├── get()
│   ├── pop()
│   ├── setdefault()
│   ├── to_dict()
│   └── to_json()
│
└── DottyEncoder
    └── JSONEncoder default
```

## 3. 数据流

### 3.1 熔断器状态机

```
                    失败次数 >= threshold
        ┌────────────────────────────────┐
        │                                │
        ▼                                │
    ┌───────┐    超时     ┌────────────┐   │   成功次数 >= threshold
    │ CLOSED│ ─────────► │    OPEN    │   │   ┌───────────────┐
    └───────┘            └────────────┘   └──►│   HALF_OPEN   │
        ▲                       │            │   └───────────────┘
        │                       │            │          │
        │                       └────────────┘          │
        │              (recovery_timeout)              │
        │                                            ▼
        └──────────────────────────────────── (失败) ┌───┐
                                                     │OPEN│
                                                     └───┘
```

### 3.2 依赖注入容器

```
register_singleton(ICache, RedisCache)
        │
        ▼
ServiceDescriptor(ICache, RedisCache, SINGLETON)
        │
        ▼
    get(ICache)
        │
        ├─── 实例已存在? ─── YES ──► 返回缓存实例
        │
        NO
        │
        ├─── 检测循环依赖 ── 循环 ──► CircularDependencyException
        │
        ▼
    创建实例
        │
        ├─── 有依赖? ─── YES ──► 先解析依赖
        │
        ▼
    缓存并返回实例
```

### 3.3 重试装饰器流程

```
调用函数
    │
    ▼
try: 函数执行
    │
    ├─── 成功 ───► 返回结果
    │
    └─── 异常
            │
            ├─── 在 retry_on_exception 中? ─── NO ──► 立即抛出
            │
            YES
            │
            ▼
        尝试次数 < max?
            │
            ├─── YES
            │       │
            │       ▼
            │   计算等待时间
            │       │
            │       ├─── 固定延迟: random(min, max)
            │       │
            │       └─── 指数退避: min(base * 2^(n-1), max)
            │       │
            │       ▼
            │   sleep(wait_time)
            │       │
            │       ▼
            │   重试 ──► try: 函数执行
            │
            └─── NO ──► 抛出最后一次异常
```

## 4. 依赖关系

```
Foundation (无外部依赖，仅标准库)
│
├── validators.py
│   └── re, datetime, typing
│
├── exceptions.py
│   └── logging, typing, functools
│
├── retry.py
│   └── logging, random, time, functools, typing
│
├── dotty.py
│   └── collections.abc, functools, json
│
├── crypto.py
│   └── random, secrets, typing
│
├── singleton.py
│   └── threading, typing
│
├── lifecycle.py
│   └── typing, enum
│
├── container.py
│   └── threading, typing, enum
│
└── circuit_breaker.py
    └── threading, time, logging, typing, enum, dataclasses, functools
```

## 5. 线程安全

所有组件都考虑了线程安全：

| 组件 | 线程安全机制 |
|------|--------------|
| SingletonMeta | 双检锁 (Double-Checked Locking) |
| ServiceContainer | threading.Lock |
| CircuitBreaker | threading.Lock |
| CircuitBreakerManager | threading.Lock + 单例模式 |
| ServiceLocator | threading.Lock + 单例模式 |
