# FQBase 系统模块集成开发文档

## 概述

本文档详细介绍 FQBase 框架中各模块之间的集成方式、交互模式以及扩展方法。FQBase 采用分层架构，模块之间通过标准接口和依赖注入进行交互，实现高内聚低耦合的设计目标。

***

## 1. 模块架构总览

### 1.1 层次结构

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Application Layer                                  │
│                        (业务应用层 - 用户代码)                             │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            Core Layer                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │ EventBus    │  │ Logger      │  │ Notification│  │ Structured │    │
│  │ 事件总线    │  │ 日志系统    │  │ 通知服务    │  │ Logging     │    │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
          ┌─────────────────────────┼─────────────────────────┐
          ▼                         ▼                         ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│      Cache      │   │    DataStore    │   │     Config      │
│     缓存模块     │   │    数据存储     │   │     配置模块     │
└─────────────────┘   └─────────────────┘   └─────────────────┘
          │                         │                         │
          └─────────────────────────┼─────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         Foundation Layer                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │ Singleton   │  │ Container   │  │ Circuit     │  │ Lifecycle   │  │
│  │ 单例模式    │  │ DI容器      │  │ Breaker     │  │ 生命周期    │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                    │
│  │ Exceptions  │  │ Retry       │  │ Validators  │                    │
│  │ 异常体系    │  │ 重试机制    │  │ 验证器      │                    │
│  └─────────────┘  └─────────────┘  └─────────────┘                    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            Util Layer                                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │ Parallel    │  │ File        │  │ Converters  │  │ Network     │  │
│  │ 并行处理    │  │ 文件工具    │  │ 类型转换    │  │ 网络工具    │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

### 1.2 模块依赖关系

```
Util (工具层 - 无依赖)
    │
    ▼
Foundation (基础设施层 - 依赖 Util)
    │
    ├─→ Singleton (单例模式)
    ├─→ Container (依赖注入)
    ├─→ CircuitBreaker (熔断器)
    ├─→ Lifecycle (生命周期)
    ├─→ Exceptions (异常体系)
    ├─→ Retry (重试机制)
    └─→ Validators (验证器)
    │
    ▼
Cache ──────────────────────→ Foundation
DataStore ──────────────────→ Foundation
Config ─────────────────────→ Foundation
    │
    ▼
Core (核心层)
    │
    ├─→ EventBus ──────────→ Foundation
    ├─→ Logger ─────────────→ Config
    ├─→ Notification ──────→ Config, Foundation
    └─→ StructuredLogging ──→ Logger
```

***

## 2. 核心集成模式

### 2.1 单例模式集成

FQBase 中多个核心组件使用 `@singleton` 装饰器确保全局唯一实例：

| 组件                    | 文件位置                       | 单例方式         | 用途                 |
| --------------------- | -------------------------- | ------------ | ------------------ |
| `NotificationManager` | Core/notification.py       | `@singleton` | 统一通知管理             |
| `EventBus`            | Core/event\_bus\_celery.py | 模块级变量        | Celery Worker 事件管理 |
| `MongoClientManager`  | DataStore/mongo\_client.py | `@singleton` | MongoDB 连接管理       |
| `RedisClientManager`  | Cache/redis\_conn.py       | `@singleton` | Redis 连接管理         |

**典型实现 - NotificationManager：**

```python
# Core/notification.py
@singleton
class NotificationManager:
    """统一通知管理器 - 单例模式"""

    def __init__(self):
        self._handlers: Dict[str, NotificationHandler] = {}
        self._write_lock = threading.Lock()
        self._init_default_handlers()

    def _init_default_handlers(self):
        # 初始化默认处理器
        for channel in WECOM_CHANNELS.keys():
            self._handlers[f'wecom_{channel.lower()}'] = WecomHandler(channel=channel)
        self._handlers['serverchan'] = ServerChanHandler()
        self._handlers['pushbear'] = PushBearHandler()
```

### 2.2 生命周期集成

FQBase 通过 Protocol 接口定义生命周期管理：

```python
# Foundation/lifecycle.py
@runtime_checkable
class Initializable(Protocol):
    """初始化协议"""
    def initialize(self) -> bool: ...
    @property
    def is_initialized(self) -> bool: ...

@runtime_checkable
class Shutdownable(Protocol):
    """关闭协议"""
    def shutdown(self) -> bool: ...
    @property
    def is_shutdown(self) -> bool: ...

@runtime_checkable
class HealthCheckable(Protocol):
    """健康检查协议"""
    def health_check(self) -> HealthStatus: ...
```

**与 Celery 集成的生命周期管理：**

```python
# Core/event_bus_celery.py
_event_bus_instance: Optional[EventBus] = None

def setup_event_bus() -> EventBus:
    """初始化 EventBus（供 Celery Worker 启动时调用）"""
    global _event_bus_instance
    _event_bus_instance = EventBus()
    return _event_bus_instance

def clear_event_bus() -> None:
    """清除 EventBus（供 Celery Worker 关闭时调用）"""
    global _event_bus_instance
    if _event_bus_instance is not None:
        _event_bus_instance.clear_history()
    _event_bus_instance = None

# 注册 Celery 信号
_init_celery_signals()

def _init_celery_signals():
    """注册 Celery 信号处理器"""
    from celery.signals import worker_process_init, worker_shutdown

    @worker_process_init.connect
    def on_worker_init(**kwargs):
        setup_event_bus()

    @worker_shutdown.connect
    def on_worker_shutdown(**kwargs):
        clear_event_bus()
```

***

## 3. 事件驱动集成

### 3.1 EventBus 与通知系统集成

事件总线可以与通知系统联动，实现事件触发通知：

```python
from FQBase.Core import EventBus, Event, NotificationManager, NotificationTemplate

class EventDrivenNotification:
    """事件驱动通知服务"""

    def __init__(self):
        self._bus = EventBus()
        self._manager = NotificationManager()
        self._setup_subscriptions()

    def _setup_subscriptions(self):
        self._bus.subscribe('limit_up', self.on_limit_up, priority=10)
        self._bus.subscribe('risk_alert', self.on_risk_alert, priority=100)
        self._bus.subscribe('system_error', self.on_error, priority=200)

    def on_limit_up(self, event: Event):
        stocks = event.data
        for stock in stocks:
            message = NotificationTemplate.render(
                'trade_signal',
                strategy='涨停监控',
                code=stock['code'],
                price=stock['price'],
                time=stock.get('time', ''),
            )
            self._manager.send(message, channel='LIMIT')

    def on_risk_alert(self, event: Event):
        info = event.data
        message = NotificationTemplate.render(
            'risk_alert',
            risk_type=info['type'],
            details=info['details'],
            time=info.get('time', ''),
        )
        self._manager.send_all(message)
```

### 3.2 EventBus 与熔断器集成

```python
from FQBase.Foundation import CircuitBreaker, CircuitBreakerManager

class ProtectedEventHandler:
    """带熔断保护的事件处理器"""

    def __init__(self, handler_name: str):
        self._bus = EventBus()
        self._breaker_manager = CircuitBreakerManager()
        self._breaker = self._breaker_manager.register(
            name=f"event_handler_{handler_name}",
            failure_threshold=5,
            recovery_timeout=60
        )
        self._setup_subscription()

    def _setup_subscription(self):
        self._bus.subscribe('external_event', self._protected_handler)

    def _protected_handler(self, event: Event):
        def handle():
            # 处理事件的实际逻辑
            return self._process_event(event)

        self._breaker.call(handle)

    def _process_event(self, event: Event):
        # 实际处理逻辑
        pass
```

***

## 4. 缓存与数据存储集成

### 4.1 多级缓存架构

```
┌─────────────────────────────────────────────────────────┐
│                     Application Layer                      │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    Cache Interface                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │   get    │  │   set    │  │  delete  │               │
│  └──────────┘  └──────────┘  └──────────┘               │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│  LocalCache   │   │  RedisCache   │   │  MongoCache   │
│  (L1 - 内存)  │   │  (L2 - Redis) │   │  (L3 - Mongo) │
└───────────────┘   └───────────────┘   └───────────────┘
```

### 4.2 缓存与数据库集成

```python
from FQBase.Cache import create_cache
from FQBase.DataStore import MongoDB
from FQBase.Foundation import Initializable, Shutdownable

class CachedDataStore(Initializable, Shutdownable):
    """带缓存的数据访问层"""

    def __init__(self):
        self._cache = None
        self._db = None

    def initialize(self) -> bool:
        # 初始化缓存
        self._cache = create_cache(cache_type='redis', ttl=300)
        # 初始化数据库
        self._db = MongoDB()
        return True

    def shutdown(self) -> bool:
        if self._cache:
            self._cache.clear()
        return True

    def get_with_cache(self, collection: str, query: dict):
        # 生成缓存键
        cache_key = f"{collection}:{hash(str(query))}"

        # 尝试从缓存获取
        cached = self._cache.get(cache_key)
        if cached is not None:
            return cached

        # 缓存未命中，从数据库获取
        result = self._db.find(collection, query)
        self._cache.set(cache_key, result, ttl=60)
        return result
```

***

## 5. 配置与日志集成

### 5.1 日志系统架构

```
┌─────────────────────────────────────────────────────────┐
│                    FQLogger                              │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                    _instances                       │ │
│  │           (类级别字典，存储各实例)                    │ │
│  └─────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                   _init_lock                         │ │
│  │                    (双重锁)                          │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    Logging Config                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  logging │  │  format  │  │ handlers │             │
│  │   .yaml  │  │  pattern │  │  config   │             │
│  └──────────┘  └──────────┘  └──────────┘             │
└─────────────────────────────────────────────────────────┘
```

### 5.2 配置驱动的日志初始化

```python
# Core/logger.py 模式
class FQLogger:
    _instances: Dict[str, 'FQLogger'] = {}
    _init_lock = threading.Lock()

    def __init__(self, name: str):
        self._name = name
        self._logger = logging.getLogger(name)
        self._setup_handlers()

    @classmethod
    def get_logger(cls, name: str) -> 'FQLogger':
        if name not in cls._instances:
            with cls._init_lock:
                if name not in cls._instances:
                    cls._instances[name] = cls(name)
        return cls._instances[name]

# 初始化入口
def init_logging(config_path: str = None):
    """初始化日志系统"""
    if config_path:
        import yaml
        with open(config_path) as f:
            config = yaml.safe_load(f)
        logging.config.dictConfig(config)
    else:
        # 默认配置
        logging.basicConfig(level=logging.INFO)
```

### 5.3 日志与通知集成

```python
from FQBase.Core import get_logger, NotificationManager, NotificationTemplate

class LoggingNotificationHandler:
    """日志处理器，可选择性地发送通知"""

    def __init__(self, alert_channel: str = 'SYSTEM'):
        self._logger = get_logger('AlertHandler')
        self._manager = NotificationManager()
        self._alert_channel = alert_channel

    def log_and_notify(self, level: str, message: str, notify: bool = False):
        # 记录日志
        getattr(self._logger, level)(message)

        # 可选：发送通知
        if notify and level in ('error', 'critical'):
            self._manager.send(message, channel=self._alert_channel)
```

***

## 6. 熔断器与重试机制集成

### 6.1 熔断器模式

```
CLOSED ──(失败≥阈值)──→ OPEN ──(超时)──→ HALF_OPEN
                              ↑               │
                              │         (成功≥阈值)
                              └─────────────────┘
                              (失败)
```

### 6.2 熔断器与重试集成

```python
from FQBase.Foundation import retry, CircuitBreaker, CircuitBreakerManager
from FQBase.Foundation.retry import retry_with_exponential_backoff

class ResilientService:
    """带熔断和重试的弹性服务"""

    def __init__(self, service_name: str):
        self._name = service_name
        self._breaker_manager = CircuitBreakerManager()
        self._breaker = self._breaker_manager.register(
            name=service_name,
            failure_threshold=5,
            success_threshold=2,
            recovery_timeout=60
        )

    def call_with_protection(self, func: Callable, *args, **kwargs):
        """带熔断和重试的调用"""

        def protected_call():
            @retry_with_exponential_backoff(max_attempts=3, base_wait=1, max_wait=10)
            def with_retry():
                return func(*args, **kwargs)
            return with_retry()

        return self._breaker.call(protected_call)
```

***

## 7. 依赖注入容器集成

### 7.1 容器与生命周期集成

```python
from FQBase.Foundation import ServiceContainer, Initializable, Shutdownable

class ContainerManagedService(Initializable, Shutdownable):
    """由容器管理的服务"""

    def __init__(self, container: ServiceContainer):
        self._container = container
        self._cache = None
        self._db = None

    def initialize(self) -> bool:
        self._cache = self._container.get(ICache)
        self._db = self._container.get(IDatabase)
        return True

    def shutdown(self) -> bool:
        # 清理资源
        if self._cache:
            self._cache.clear()
        return True

# 在容器中注册
container = ServiceContainer()
container.register_singleton(ICache, RedisCacheAdapter)
container.register_singleton(IDatabase, MongoDatabase)
container.register_singleton(IContainerManagedService, ContainerManagedService)

# 获取并自动初始化
service = container.get(IContainerManagedService)
```

### 7.2 循环依赖检测

```python
from FQBase.Foundation import ServiceContainer, CircularDependencyException

class CircularDependencyDemo:
    """循环依赖检测示例"""

    def __init__(self):
        self._container = ServiceContainer()

    def setup_with_circular_check(self):
        """设置服务，自动检测循环依赖"""
        self._container.register_singleton('ServiceA', self._create_service_a)
        self._container.register_singleton('ServiceB', self._create_service_b)

    def _create_service_a(self):
        # ServiceA 依赖 ServiceB
        service_b = self._container.get('ServiceB')
        return ServiceA(service_b)

    def _create_service_b(self):
        # ServiceB 依赖 ServiceA
        service_a = self._container.get('ServiceA')
        return ServiceB(service_a)
```

***

## 8. Celery 异步任务集成

### 8.1 EventBus 与 Celery 集成架构

```
┌─────────────────────────────────────────────────────────────────┐
│                     Celery Worker Process                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   @worker_process_init ──→ setup_event_bus()                     │
│         │                         │                             │
│         │                         ▼                             │
│         │                  ┌─────────────┐                      │
│         │                  │  EventBus  │                      │
│         │                  │  Instance  │                      │
│         │                  └─────────────┘                      │
│         │                         │                             │
│         ▼                         ▼                             │
│   @worker_shutdown ────── clear_event_bus()                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 任务中使用 EventBus

```python
# tasks.py
from FQBase.Core.event_bus_celery import get_event_bus
from FQBase.Core import Event

@celery_app.task
def process_limit_up(stocks: list):
    """处理涨停股票"""
    event_bus = get_event_bus()
    if event_bus:
        event_bus.publish(Event("limit_up", data=stocks))
    return {'processed': len(stocks)}
```

### 8.3 事件驱动任务链

```python
# 定义任务链
from celery import chain, group

# 同步任务
sync_workflow = chain(
    fetch_data.s(),
    process_data.s(),
    publish_results.s()
)

# 并行任务
parallel_workflow = group(
    task_a.s(),
    task_b.s(),
    task_c.s()
)

# 事件触发任务
class EventTriggeredWorkflow:
    def __init__(self):
        self._bus = get_event_bus()
        self._bus.subscribe('data_ready', self.on_data_ready)

    def on_data_ready(self, event: Event):
        sync_workflow.delay(event.data)
```

***

## 9. 综合集成示例

### 9.1 完整的微服务架构

```python
from FQBase.Core import (
    EventBus, Event, get_logger, NotificationManager,
    NotificationTemplate
)
from FQBase.Foundation import (
    singleton, ServiceContainer, CircuitBreaker,
    Initializable, Shutdownable, HealthCheckable, HealthStatus,
    ServiceStatus
)
from FQBase.Cache import create_cache
from FQBase.DataStore import MongoDB

@singleton
class TradingService(Initializable, Shutdownable, HealthCheckable):
    """交易服务 - 完整集成示例"""

    def __init__(self):
        self._status = ServiceStatus.UNKNOWN
        self._cache = None
        self._db = None
        self._event_bus = None
        self._notification_manager = None
        self._circuit_breakers = {}

    def initialize(self) -> bool:
        try:
            # 初始化缓存
            self._cache = create_cache(cache_type='redis', ttl=300)

            # 初始化数据库
            self._db = MongoDB()

            # 初始化事件总线
            self._event_bus = EventBus()
            self._setup_event_handlers()

            # 初始化通知管理器
            self._notification_manager = NotificationManager()

            # 初始化熔断器
            self._init_circuit_breakers()

            self._status = ServiceStatus.RUNNING
            return True
        except Exception as e:
            self._status = ServiceStatus.ERROR
            return False

    def shutdown(self) -> bool:
        try:
            if self._cache:
                self._cache.clear()
            self._status = ServiceStatus.STOPPED
            return True
        except Exception:
            return False

    def health_check(self) -> HealthStatus:
        checks = {
            'cache': self._check_cache(),
            'database': self._check_database(),
        }

        all_healthy = all(c.is_healthy for c in checks.values())
        status = ServiceStatus.RUNNING if all_healthy else ServiceStatus.DEGRADED

        return HealthStatus(
            status=status,
            details={k: v.to_dict() for k, v in checks.items()}
        )

    def _setup_event_handlers(self):
        self._event_bus.subscribe('trade_signal', self.on_trade_signal)
        self._event_bus.subscribe('risk_alert', self.on_risk_alert)

    def on_trade_signal(self, event: Event):
        signal = event.data
        message = NotificationTemplate.render(
            'trade_signal',
            strategy=signal['strategy'],
            code=signal['code'],
            price=signal['price'],
            time=signal.get('time', '')
        )
        self._notification_manager.send(message, channel='DEFAULT')

    def on_risk_alert(self, event: Event):
        alert = event.data
        message = NotificationTemplate.render(
            'risk_alert',
            risk_type=alert['type'],
            details=alert['details'],
            time=alert.get('time', '')
        )
        self._notification_manager.send_all(message)
```

### 9.2 健康检查聚合

```python
from FQBase.Foundation import CompositeHealthCheck

class ApplicationHealthCheck:
    """应用健康检查聚合"""

    def __init__(self):
        self._checker = CompositeHealthCheck()

    def register_services(self, services: Dict[str, HealthCheckable]):
        for name, service in services.items():
            self._checker.register(name, service)

    def check_all(self) -> Dict[str, HealthStatus]:
        return self._checker.check_all()

    def is_healthy(self) -> bool:
        return self._checker.is_all_healthy

    def get_health_report(self) -> dict:
        results = self.check_all()
        return {
            'healthy': self.is_healthy(),
            'services': {
                name: status.to_dict()
                for name, status in results.items()
            }
        }


# 使用
health_check = ApplicationHealthCheck()
health_check.register_services({
    'trading': trading_service,
    'cache': cache_service,
    'database': db_service,
})

report = health_check.get_health_report()
```

***

## 10. 模块集成检查清单

### 10.1 初始化顺序

| 顺序 | 模块         | 说明      |
| -- | ---------- | ------- |
| 1  | Config     | 加载配置    |
| 2  | Foundation | 基础设施就绪  |
| 3  | Cache      | 缓存层初始化  |
| 4  | DataStore  | 数据库连接   |
| 5  | Core       | 核心服务初始化 |
| 6  | EventBus   | 事件总线订阅  |

### 10.2 关闭顺序

| 顺序 | 模块        | 说明      |
| -- | --------- | ------- |
| 1  | EventBus  | 取消事件订阅  |
| 2  | Core      | 关闭通知服务  |
| 3  | DataStore | 关闭数据库连接 |
| 4  | Cache     | 清空缓存    |
| 5  | Config    | 保存配置    |

### 10.3 依赖检查

```python
class DependencyChecker:
    """依赖检查工具"""

    REQUIRED_MODULES = {
        'FQBase.Core': ['EventBus', 'NotificationManager', 'get_logger'],
        'FQBase.Foundation': ['singleton', 'ServiceContainer', 'CircuitBreaker'],
        'FQBase.Cache': ['create_cache'],
        'FQBase.DataStore': ['MongoDB'],
        'FQBase.Config': ['get_env', 'load_env'],
    }

    def check_imports(self) -> Dict[str, List[str]]:
        """检查模块导入"""
        results = {}
        for module, components in self.REQUIRED_MODULES.items():
            missing = []
            for comp in components:
                if not self._can_import(module, comp):
                    missing.append(comp)
            results[module] = missing
        return results

    def _can_import(self, module: str, component: str) -> bool:
        try:
            mod = __import__(module, fromlist=[component])
            return hasattr(mod, component)
        except ImportError:
            return False
```

***

## 11. 最佳实践

### 11.1 模块间通信

**推荐：事件驱动**

```python
# ✅ 推荐：使用 EventBus 解耦
self._bus.publish(Event('trade_executed', data=trade_info))

# ❌ 不推荐：直接调用
other_service.handle_trade(trade_info)
```

**推荐：依赖注入**

```python
# ✅ 推荐：容器注入
service = container.get(ITradeService)

# ❌ 不推荐：直接实例化
service = TradeService()
```

### 11.2 错误处理

**推荐：异常链**

```python
try:
    result = self._db.find('trades', query)
except MongoDBConnectionException as e:
    raise ServiceException("Database unavailable") from e
```

**推荐：熔断保护**

```python
@circuit_breaker(name='external_api', failure_threshold=3)
def call_external_api():
    return external_service.get_data()
```

### 11.3 资源管理

**推荐：上下文管理器**

```python
with self._circuit_breaker as cb:
    result = do_something()
```

**推荐：生命周期协议**

```python
class ManagedService(Initializable, Shutdownable):
    def initialize(self) -> bool:
        self._resource = acquire()
        return True

    def shutdown(self) -> bool:
        self._resource.release()
        return True
```

***

## 12. 相关文档

### API 参考

- [EventBus API](eventbus-api.md)
- [Notification API](notification-api.md)
- [Circuit Breaker API](circuit-breaker-api.md)
- [Lifecycle API](lifecycle-api.md)
- [Container API](container-api.md)
- [Logger API](logger-api.md)

### 应用指南

- [EventBus 使用指南](eventbus_usage_guide.md)
- [Notification 使用指南](notification-usage.md)
- [Circuit Breaker 使用指南](circuit-breaker-usage.md)
- [Container 使用指南](container-usage.md)

### 架构文档

- [FQBase 架构概述](architecture.md)

