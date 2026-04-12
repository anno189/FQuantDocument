# FQBase 项目应用场景示例

本文档展示 FQBase 框架在量化交易系统中的实际应用场景，包括数据服务、缓存管理、事件驱动架构等典型场景。

---

## 目录

1. [量化数据服务](#1-量化数据服务)
2. [缓存管理服务](#2-缓存管理服务)
3. [事件驱动交易系统](#3-事件驱动交易系统)
4. [健康检查与监控](#4-健康检查与监控)
5. [依赖注入与服务组合](#5-依赖注入与服务组合)
6. [测试隔离与单例重置](#6-测试隔离与单例重置)

---

## 1. 量化数据服务

### 场景描述

量化交易系统需要从多个数据源获取行情数据，包括股票行情、财务数据、龙虎榜数据等。使用 FQBase 的生命周期管理接口，可以实现数据服务的标准化管理。

### 实现示例

```python
from typing import Protocol, List, Dict, Any, Optional
from datetime import datetime
from FQBase.Foundation import (
    HealthCheckable,
    Initializable,
    Shutdownable,
    HealthStatus,
    ServiceStatus,
    singleton,
)

# 数据源接口
class IDataSource(Protocol):
    def get_stock_daily(self, code: str, start_date: str, end_date: str) -> List[Dict]:
        """获取股票日线数据"""
        ...
    
    def get_financial_data(self, code: str) -> Dict[str, Any]:
        """获取财务数据"""
        ...

# 数据服务实现
@singleton
class QuantDataService(HealthCheckable, Initializable, Shutdownable):
    """量化数据服务 - 统一数据访问层"""
    
    def __init__(self):
        self._initialized = False
        self._shutdown = False
        self._data_sources: Dict[str, IDataSource] = {}
        self._cache_hit_rate = 0.0
        self._query_count = 0
    
    def initialize(self) -> bool:
        """初始化数据源连接"""
        try:
            self._connect_primary_source()
            self._connect_backup_source()
            self._initialized = True
            return True
        except Exception as e:
            print(f"数据服务初始化失败: {e}")
            return False
    
    @property
    def is_initialized(self) -> bool:
        return self._initialized
    
    def shutdown(self) -> bool:
        """关闭数据源连接"""
        try:
            self._data_sources.clear()
            self._shutdown = True
            return True
        except Exception as e:
            print(f"数据服务关闭失败: {e}")
            return False
    
    @property
    def is_shutdown(self) -> bool:
        return self._shutdown
    
    def health_check(self) -> HealthStatus:
        """健康检查"""
        if self._shutdown:
            return HealthStatus(
                status=ServiceStatus.STOPPED,
                message="数据服务已关闭"
            )
        
        if not self._initialized:
            return HealthStatus(
                status=ServiceStatus.INITIALIZING,
                message="数据服务初始化中"
            )
        
        if len(self._data_sources) == 0:
            return HealthStatus(
                status=ServiceStatus.ERROR,
                message="无可用数据源"
            )
        
        if len(self._data_sources) == 1:
            return HealthStatus(
                status=ServiceStatus.DEGRADED,
                message="仅主数据源可用",
                details={'sources': list(self._data_sources.keys())}
            )
        
        return HealthStatus(
            status=ServiceStatus.RUNNING,
            message="数据服务正常",
            details={
                'sources': list(self._data_sources.keys()),
                'cache_hit_rate': f"{self._cache_hit_rate:.2%}",
                'query_count': self._query_count
            }
        )
    
    def get_stock_daily(
        self, 
        code: str, 
        start_date: str, 
        end_date: str
    ) -> List[Dict]:
        """获取股票日线数据"""
        self._query_count += 1
        
        for source_name, source in self._data_sources.items():
            try:
                data = source.get_stock_daily(code, start_date, end_date)
                if data:
                    return data
            except Exception as e:
                print(f"数据源 {source_name} 查询失败: {e}")
        
        return []
    
    def _connect_primary_source(self):
        self._data_sources['primary'] = PrimaryDataSource()
    
    def _connect_backup_source(self):
        self._data_sources['backup'] = BackupDataSource()


class PrimaryDataSource:
    def get_stock_daily(self, code: str, start_date: str, end_date: str) -> List[Dict]:
        return [{'date': '2024-01-01', 'close': 10.0}]

class BackupDataSource:
    def get_stock_daily(self, code: str, start_date: str, end_date: str) -> List[Dict]:
        return []


# 使用示例
if __name__ == "__main__":
    data_service = QuantDataService()
    
    if data_service.initialize():
        print("数据服务初始化成功")
        
        # 获取数据
        data = data_service.get_stock_daily("000001", "2024-01-01", "2024-01-31")
        print(f"获取到 {len(data)} 条数据")
        
        # 健康检查
        status = data_service.health_check()
        print(f"服务状态: {status.status.value}")
        
        # 关闭服务
        data_service.shutdown()
```

---

## 2. 缓存管理服务

### 场景描述

量化系统需要频繁访问历史数据、财务数据等，使用缓存可以显著提升性能。FQBase 提供多种缓存适配器，支持 Redis、MongoDB 和本地缓存。

### 实现示例

```python
from typing import Optional, Any, Dict
from datetime import datetime, timedelta
from FQBase.Cache import (
    CacheInterface,
    RedisCacheAdapter,
    MongoCacheAdapter,
    LocalCache,
    get_cache_adapter,
)
from FQBase.Foundation import (
    HealthCheckable,
    HealthStatus,
    ServiceStatus,
    ServiceContainer,
    ServiceLocator,
)

class CacheService(HealthCheckable):
    """缓存管理服务"""
    
    def __init__(self):
        self._cache: Optional[CacheInterface] = None
        self._stats = {
            'hits': 0,
            'misses': 0,
        }
    
    def initialize(self, use_redis: bool = True) -> bool:
        """初始化缓存
        
        Args:
            use_redis: 是否使用 Redis，False 则使用本地缓存
        """
        try:
            if use_redis:
                self._cache = RedisCacheAdapter()
                if not self._cache.ping():
                    print("Redis 连接失败，降级到本地缓存")
                    self._cache = LocalCache(max_size=10000)
            else:
                self._cache = LocalCache(max_size=10000)
            return True
        except Exception as e:
            print(f"缓存初始化失败: {e}")
            self._cache = LocalCache(max_size=10000)
            return True
    
    def health_check(self) -> HealthStatus:
        if self._cache is None:
            return HealthStatus(
                status=ServiceStatus.ERROR,
                message="缓存未初始化"
            )
        
        total = self._stats['hits'] + self._stats['misses']
        hit_rate = self._stats['hits'] / total if total > 0 else 0
        
        cache_type = type(self._cache).__name__
        
        if isinstance(self._cache, LocalCache):
            return HealthStatus(
                status=ServiceStatus.DEGRADED,
                message="使用本地缓存",
                details={
                    'type': cache_type,
                    'hit_rate': f"{hit_rate:.2%}",
                    'stats': self._stats
                }
            )
        
        return HealthStatus(
            status=ServiceStatus.RUNNING,
            message="缓存服务正常",
            details={
                'type': cache_type,
                'hit_rate': f"{hit_rate:.2%}",
                'stats': self._stats
            }
        )
    
    def get(self, key: str) -> Optional[Any]:
        """获取缓存"""
        value = self._cache.get(key)
        if value is not None:
            self._stats['hits'] += 1
        else:
            self._stats['misses'] += 1
        return value
    
    def set(self, key: str, value: Any, ttl: int = 3600) -> bool:
        """设置缓存"""
        return self._cache.set(key, value, ttl=ttl)
    
    def get_or_set(
        self, 
        key: str, 
        factory: callable, 
        ttl: int = 3600
    ) -> Any:
        """获取或设置缓存"""
        value = self.get(key)
        if value is not None:
            return value
        
        value = factory()
        self.set(key, value, ttl=ttl)
        return value


class StockDataCache:
    """股票数据缓存"""
    
    def __init__(self, cache_service: CacheService):
        self._cache = cache_service
    
    def get_daily_data(
        self, 
        code: str, 
        date: str
    ) -> Optional[Dict]:
        """获取日线数据（带缓存）"""
        cache_key = f"daily:{code}:{date}"
        return self._cache.get(cache_key)
    
    def set_daily_data(
        self, 
        code: str, 
        date: str, 
        data: Dict,
        ttl: int = 86400
    ) -> bool:
        """设置日线数据缓存"""
        cache_key = f"daily:{code}:{date}"
        return self._cache.set(cache_key, data, ttl=ttl)
    
    def get_financial_data(self, code: str) -> Optional[Dict]:
        """获取财务数据（带缓存）"""
        cache_key = f"financial:{code}"
        return self._cache.get(cache_key)
    
    def set_financial_data(
        self, 
        code: str, 
        data: Dict,
        ttl: int = 86400 * 7
    ) -> bool:
        """设置财务数据缓存（缓存一周）"""
        cache_key = f"financial:{code}"
        return self._cache.set(cache_key, data, ttl=ttl)


# 使用依赖注入
def setup_services():
    container = ServiceContainer()
    
    cache_service = CacheService()
    cache_service.initialize(use_redis=True)
    
    container.register_instance(CacheService, cache_service)
    container.register_factory(
        StockDataCache,
        lambda: StockDataCache(container.get(CacheService))
    )
    
    ServiceLocator.set_container(container)

# 使用示例
if __name__ == "__main__":
    setup_services()
    
    cache = ServiceLocator.get(StockDataCache)
    
    # 设置数据
    cache.set_daily_data("000001", "2024-01-01", {
        'open': 10.0, 'close': 10.5, 'high': 10.8, 'low': 9.9
    })
    
    # 获取数据
    data = cache.get_daily_data("000001", "2024-01-01")
    print(f"日线数据: {data}")
    
    # 健康检查
    cache_service = ServiceLocator.get(CacheService)
    status = cache_service.health_check()
    print(f"缓存状态: {status}")
```

---

## 3. 事件驱动交易系统

### 场景描述

量化交易系统需要响应多种事件，如行情更新、信号触发、订单状态变化等。使用 FQBase 的 EventBus 可以实现松耦合的事件驱动架构。

### 实现示例

```python
from dataclasses import dataclass
from typing import Optional
from enum import Enum
from FQBase.Core import EventBus, Event, EventHistory
from FQBase.Foundation import singleton

class EventType(str, Enum):
    MARKET_DATA = "market_data"
    SIGNAL_GENERATED = "signal_generated"
    ORDER_SUBMITTED = "order_submitted"
    ORDER_FILLED = "order_filled"
    POSITION_UPDATED = "position_updated"

@dataclass
class MarketDataEvent(Event):
    """行情数据事件"""
    code: str
    price: float
    volume: int
    timestamp: str

@dataclass
class SignalEvent(Event):
    """信号事件"""
    code: str
    signal_type: str  # buy, sell
    price: float
    quantity: int

@dataclass
class OrderEvent(Event):
    """订单事件"""
    order_id: str
    code: str
    direction: str
    price: float
    quantity: int
    status: str

@singleton
class TradingEngine:
    """交易引擎"""
    
    def __init__(self):
        self._event_bus = EventBus()
        self._positions: Dict[str, int] = {}
        self._setup_handlers()
    
    def _setup_handlers(self):
        """设置事件处理器"""
        self._event_bus.subscribe(EventType.MARKET_DATA, self._on_market_data)
        self._event_bus.subscribe(EventType.SIGNAL_GENERATED, self._on_signal)
        self._event_bus.subscribe(EventType.ORDER_FILLED, self._on_order_filled)
    
    def _on_market_data(self, event: MarketDataEvent):
        """处理行情数据"""
        print(f"[行情] {event.code}: {event.price}")
        
        # 简单策略：价格突破均线时生成信号
        if self._check_signal(event):
            signal = SignalEvent(
                event_type=EventType.SIGNAL_GENERATED,
                code=event.code,
                signal_type="buy",
                price=event.price,
                quantity=100
            )
            self._event_bus.publish(signal)
    
    def _on_signal(self, event: SignalEvent):
        """处理信号"""
        print(f"[信号] {event.code}: {event.signal_type} @ {event.price}")
        
        # 提交订单
        order = OrderEvent(
            event_type=EventType.ORDER_SUBMITTED,
            order_id=f"ORD-{event.code}-{event.timestamp}",
            code=event.code,
            direction=event.signal_type,
            price=event.price,
            quantity=event.quantity,
            status="submitted"
        )
        self._event_bus.publish(order)
    
    def _on_order_filled(self, event: OrderEvent):
        """处理订单成交"""
        print(f"[成交] {event.order_id}: {event.code} {event.direction}")
        
        # 更新持仓
        if event.code not in self._positions:
            self._positions[event.code] = 0
        
        if event.direction == "buy":
            self._positions[event.code] += event.quantity
        else:
            self._positions[event.code] -= event.quantity
    
    def _check_signal(self, event: MarketDataEvent) -> bool:
        """检查是否生成信号"""
        return event.price > 10.0
    
    def publish_market_data(self, code: str, price: float, volume: int):
        """发布行情数据"""
        event = MarketDataEvent(
            event_type=EventType.MARKET_DATA,
            code=code,
            price=price,
            volume=volume,
            timestamp=datetime.now().isoformat()
        )
        self._event_bus.publish(event)
    
    def get_positions(self) -> Dict[str, int]:
        return self._positions
    
    def get_event_history(self, event_type: str = None) -> list:
        """获取事件历史"""
        return self._event_bus.get_history(event_type=event_type)

# 使用示例
if __name__ == "__main__":
    engine = TradingEngine()
    
    # 模拟行情数据
    engine.publish_market_data("000001", 10.5, 10000)
    engine.publish_market_data("000002", 9.8, 5000)
    engine.publish_market_data("000003", 11.2, 8000)
    
    # 查看持仓
    print(f"持仓: {engine.get_positions()}")
    
    # 查看事件历史
    history = engine.get_event_history()
    print(f"事件数量: {len(history)}")
```

---

## 4. 健康检查与监控

### 场景描述

生产环境需要对所有服务进行健康监控，FQBase 的 CompositeHealthCheck 可以统一管理多个服务的健康检查。

### 实现示例

```python
import json
from datetime import datetime
from FQBase.Foundation import (
    CompositeHealthCheck,
    HealthCheckable,
    HealthStatus,
    ServiceStatus,
)

class SystemMonitor:
    """系统监控"""
    
    def __init__(self):
        self._health_checker = CompositeHealthCheck()
        self._check_history: list = []
    
    def register_service(self, name: str, service: HealthCheckable):
        """注册服务"""
        self._health_checker.register(name, service)
    
    def check_all(self) -> Dict[str, HealthStatus]:
        """检查所有服务"""
        results = self._health_checker.check_all()
        
        # 记录历史
        self._check_history.append({
            'timestamp': datetime.now().isoformat(),
            'results': {k: v.to_dict() for k, v in results.items()}
        })
        
        return results
    
    def is_system_healthy(self) -> bool:
        """系统是否健康"""
        return self._health_checker.is_all_healthy
    
    def get_unhealthy_services(self) -> list:
        """获取不健康的服务"""
        results = self._health_checker.check_all()
        return [
            name for name, status in results.items() 
            if not status.is_healthy
        ]
    
    def generate_report(self) -> str:
        """生成健康报告"""
        results = self.check_all()
        
        report = {
            'timestamp': datetime.now().isoformat(),
            'system_healthy': self.is_system_healthy(),
            'services': {}
        }
        
        for name, status in results.items():
            report['services'][name] = {
                'status': status.status.value,
                'healthy': status.is_healthy,
                'message': status.message,
                'details': status.details
            }
        
        return json.dumps(report, indent=2, ensure_ascii=False)
    
    def alert_if_unhealthy(self):
        """如果不健康则告警"""
        unhealthy = self.get_unhealthy_services()
        if unhealthy:
            self._send_alert(unhealthy)
    
    def _send_alert(self, unhealthy_services: list):
        """发送告警"""
        from FQBase.Core import NotificationManager
        notification = NotificationManager()
        notification.send_message(
            f"【告警】以下服务不健康: {', '.join(unhealthy_services)}"
        )

# 使用示例
if __name__ == "__main__":
    monitor = SystemMonitor()
    
    # 注册服务
    monitor.register_service('data_service', QuantDataService())
    monitor.register_service('cache', CacheService())
    
    # 检查所有服务
    results = monitor.check_all()
    for name, status in results.items():
        print(f"{name}: {status.status.value}")
    
    # 生成报告
    report = monitor.generate_report()
    print(report)
    
    # 告警
    monitor.alert_if_unhealthy()
```

---

## 5. 依赖注入与服务组合

### 场景描述

复杂系统需要管理多个服务的依赖关系，使用 FQBase 的 ServiceContainer 可以实现松耦合的服务组合。

### 实现示例

```python
from typing import Protocol, runtime_checkable
from FQBase.Foundation import ServiceContainer, ServiceLocator

# 定义接口
@runtime_checkable
class IDataProvider(Protocol):
    def get_data(self, code: str) -> dict: ...

@runtime_checkable
class IStrategy(Protocol):
    def generate_signal(self, data: dict) -> str: ...

@runtime_checkable
class IOrderExecutor(Protocol):
    def execute(self, code: str, signal: str, quantity: int) -> bool: ...

# 实现类
class TushareDataProvider:
    def get_data(self, code: str) -> dict:
        return {'code': code, 'price': 10.0}

class MAStrategy:
    def __init__(self, data_provider: IDataProvider):
        self._data_provider = data_provider
    
    def generate_signal(self, data: dict) -> str:
        # 使用数据提供者获取更多数据
        more_data = self._data_provider.get_data(data['code'])
        return 'buy' if more_data['price'] > 10 else 'sell'

class SimulatedExecutor:
    def execute(self, code: str, signal: str, quantity: int) -> bool:
        print(f"模拟执行: {code} {signal} {quantity}")
        return True

# 服务配置
def configure_services():
    container = ServiceContainer()
    
    # 注册基础服务
    container.register_singleton(IDataProvider, TushareDataProvider)
    container.register_singleton(IOrderExecutor, SimulatedExecutor)
    
    # 注册依赖其他服务的服务
    container.register_factory(
        IStrategy,
        lambda: MAStrategy(container.get(IDataProvider))
    )
    
    ServiceLocator.set_container(container)

# 交易系统
class TradingSystem:
    def __init__(self):
        self._data_provider = ServiceLocator.get(IDataProvider)
        self._strategy = ServiceLocator.get(IStrategy)
        self._executor = ServiceLocator.get(IOrderExecutor)
    
    def run(self, code: str):
        # 获取数据
        data = self._data_provider.get_data(code)
        
        # 生成信号
        signal = self._strategy.generate_signal(data)
        
        # 执行交易
        self._executor.execute(code, signal, 100)

# 使用示例
if __name__ == "__main__":
    configure_services()
    
    system = TradingSystem()
    system.run("000001")
```

---

## 6. 测试隔离与单例重置

### 场景描述

测试单例服务时需要隔离测试环境，FQBase 的单例重置功能可以确保每个测试用例独立运行。

### 实现示例

```python
import pytest
from FQBase.Foundation import singleton

@singleton
class CounterService:
    def __init__(self):
        self.count = 0
    
    def increment(self):
        self.count += 1
        return self.count
    
    def reset(self):
        self.count = 0

# 测试类
class TestCounterService:
    
    def setup_method(self):
        """每个测试前重置单例"""
        CounterService.reset_singleton()
    
    def test_increment(self):
        service = CounterService()
        assert service.increment() == 1
        assert service.increment() == 2
    
    def test_isolation(self):
        """测试隔离验证"""
        service = CounterService()
        assert service.count == 0  # 新实例，count 为 0
    
    def test_has_instance(self):
        """测试实例检查"""
        assert not CounterService.has_instance()
        
        service = CounterService()
        assert CounterService.has_instance()
        
        CounterService.reset_singleton()
        assert not CounterService.has_instance()

# 使用 pytest 运行
if __name__ == "__main__":
    pytest.main([__file__, "-v"])
```

---

## 更多示例

- [Foundation 模块示例](examples/foundation-examples.html) - 单例、重试、熔断、验证器、依赖注入容器、生命周期管理
- [Util 模块示例](examples/util-examples.html) - 代码转换、文件操作、网络工具、并行计算、数据转换、格式转换、时间索引
- [基础示例](examples.html) - 各模块快速示例

## 相关文档

- [Foundation 模块文档](../foundation/README.html)
- [Util 模块文档](../util/README.html)
- [Cache 模块文档](../cache/README.html)
- [Core 模块文档](../core/README.html)
- [DataStore 模块文档](../datastore/README.html)
- [Config 模块文档](../config/README.html)
