# FQBase 最佳实践指南

## 概述

本文档提供 FQBase 框架的最佳实践指南，帮助开发者正确、高效地使用框架的各项功能。

**版本**: 2.0  
**最后更新**: 2024-01-15

---

## 目录

1. [模块导入最佳实践](#模块导入最佳实践)
2. [配置管理最佳实践](#配置管理最佳实践)
3. [缓存使用最佳实践](#缓存使用最佳实践)
4. [事件总线最佳实践](#事件总线最佳实践)
5. [日志记录最佳实践](#日志记录最佳实践)
6. [异常处理最佳实践](#异常处理最佳实践)
7. [资源管理最佳实践](#资源管理最佳实践)
8. [性能优化最佳实践](#性能优化最佳实践)
9. [安全性最佳实践](#安全性最佳实践)
10. [测试最佳实践](#测试最佳实践)

---

## 模块导入最佳实践

### ✅ 推荐做法

```python
# 1. 使用明确的导入路径
from FQBase.Core import EventBus, get_logger
from FQBase.Foundation import singleton, retry
from FQBase.Cache import LocalCache, RedisCacheAdapter
from FQBase.Config.core import get_env, Setting
from FQBase.Config.business import MARKET_TYPE, FREQUENCE

# 2. 按模块分组导入
from FQBase.Foundation import (
    singleton,
    retry,
    CircuitBreaker,
)

from FQBase.Core import (
    EventBus,
    get_logger,
    NotificationManager,
)

# 3. 使用类型提示
from typing import Optional, Dict, Any
from FQBase.Cache import CacheInterface

def get_data(cache: CacheInterface) -> Optional[Dict[str, Any]]:
    pass
```

### ❌ 不推荐做法

```python
# 1. 避免使用通配符导入
from FQBase.Core import *  # ❌

# 2. 避免导入不必要的模块
from FQBase import (  # ❌ 导入太多
    EventBus,
    Logger,
    Notification,
    Cache,
    Config,
    # ... 其他不需要的模块
)

# 3. 避免循环导入
# module_a.py
from module_b import func_b  # ❌ 如果 module_b 也导入 module_a

# module_b.py
from module_a import func_a  # ❌ 循环导入
```

---

## 配置管理最佳实践

### ✅ 推荐做法

```python
# 1. 使用环境变量存储敏感信息
from FQBase.Config.core import get_secure_env, get_env

# 敏感配置
db_password = get_secure_env('DATABASE_PASSWORD')
api_key = get_secure_env('API_KEY')

# 非敏感配置
log_level = get_env('LOG_LEVEL', 'INFO')

# 2. 使用配置类管理配置
from FQBase.Config.core import CacheConfig

config = CacheConfig.from_env()
config.validate()  # 自动验证

# 3. 核心配置和业务配置分离
# 核心配置
from FQBase.Config.core import Setting, GLOBALMAP

# 业务配置
from FQBase.Config.business import MARKET_TYPE, FREQUENCE

# 4. 配置热重载
from FQBase.Config.core import ConfigWatcher, watch_config

def on_config_change():
    # 重新加载配置
    reload_config()

watcher = watch_config('/path/to/config.yaml', on_config_change)
```

### ❌ 不推荐做法

```python
# 1. 避免硬编码敏感信息
password = "my_password"  # ❌ 应该使用环境变量

# 2. 避免直接访问环境变量
import os
password = os.getenv('PASSWORD')  # ❌ 应该使用 get_secure_env

# 3. 避免配置项过多
class MyConfig:  # ❌ 配置项太多
    setting1 = ...
    setting2 = ...
    # ... 100 个配置项
```

---

## 缓存使用最佳实践

### ✅ 推荐做法

```python
# 1. 使用安全模式处理不可信数据
from FQBase.Cache import RedisCacheAdapter

adapter = RedisCacheAdapter(
    host='localhost',
    safe_mode=True  # ✅ 启用安全模式
)

# 2. 使用缓存装饰器
from FQBase.Cache import local_cache

@local_cache(ttl=300)
def expensive_computation(param):
    # 耗时计算
    return result

# 3. 合理设置 TTL
cache.set('key', value, ttl=3600)  # ✅ 明确设置过期时间

# 4. 使用批量操作
keys = ['key1', 'key2', 'key3']
values = cache.get_many(keys)  # ✅ 批量获取

# 5. 监控缓存性能
from FQBase.Cache import CacheMetricsCollector

metrics = CacheMetricsCollector('my_cache')
metrics.record_hit()
metrics.record_miss()
report = metrics.get_full_report()
print(f"Hit rate: {report['metrics']['hit_rate']}")

# 6. 清理资源
LocalCache.cleanup_expired_instances()  # ✅ 定期清理
```

### ❌ 不推荐做法

```python
# 1. 避免缓存过大的对象
large_data = load_huge_dataset()
cache.set('large_key', large_data)  # ❌ 占用大量内存

# 2. 避免不设置 TTL
cache.set('key', value)  # ❌ 没有过期时间，可能内存泄漏

# 3. 避免频繁创建缓存实例
def get_data():
    cache = LocalCache()  # ❌ 每次都创建新实例
    return cache.get('key')

# 4. 避免忽略缓存异常
try:
    value = cache.get('key')
except Exception:  # ❌ 吞掉异常
    pass
```

---

## 事件总线最佳实践

### ✅ 推荐做法

```python
from FQBase.Core import EventBus, Event, get_event_bus

# 1. 使用弱引用订阅（防止内存泄漏）
bus = get_event_bus()

def on_trade_signal(event: Event):
    print(f"Trade signal: {event.data}")

bus.subscribe("trade_signal", on_trade_signal, weak=True)  # ✅

# 2. 使用优先级控制执行顺序
bus.subscribe("order", on_order_high, priority=10)  # 高优先级
bus.subscribe("order", on_order_low, priority=1)    # 低优先级

# 3. 使用事件上下文
from FQBase.Core import EventBusContext

with EventBusContext() as bus:
    bus.publish(Event("test", data={"key": "value"}))

# 4. 及时取消订阅
subscription_id = bus.subscribe("event", handler)
# ... 使用后
bus.unsubscribe(subscription_id)  # ✅ 清理订阅

# 5. 使用类型化事件
class TradeEvent(Event):
    def __init__(self, code: str, price: float):
        super().__init__("trade", data={
            'code': code,
            'price': price
        })

event = TradeEvent("000001", 12.50)
bus.publish(event)
```

### ❌ 不推荐做法

```python
# 1. 避免在订阅者中阻塞
def on_event(event):
    time.sleep(10)  # ❌ 阻塞事件处理
    process(event)

# 2. 避免循环发布事件
def on_event(event):
    bus.publish(Event("event"))  # ❌ 可能导致无限循环

# 3. 避免忘记取消订阅
bus.subscribe("event", handler)
# ❌ 没有取消订阅，可能导致内存泄漏

# 4. 避免在订阅者中抛出未捕获的异常
def on_event(event):
    result = 1 / 0  # ❌ 未捕获的异常
```

---

## 日志记录最佳实践

### ✅ 推荐做法

```python
from FQBase.Core import get_logger

logger = get_logger('MyModule')

# 1. 使用适当的日志级别
logger.debug("调试信息")
logger.info("一般信息")
logger.warning("警告信息")
logger.error("错误信息")

# 2. 使用结构化日志
logger.info("User action", extra={
    'user_id': 123,
    'action': 'login',
    'ip': '192.168.1.1'
})

# 3. 使用进度日志
total = 100
for i in range(total):
    logger.progress(i + 1, total, "##JOB01====", f"Processing {i}")

# 4. 使用异常日志
try:
    risky_operation()
except Exception as e:
    logger.error(f"Operation failed: {e}", exc_info=True)  # ✅ 记录堆栈

# 5. 使用日志上下文
from FQBase.Core import LogContext

with LogContext(request_id='12345'):
    logger.info("Processing request")  # 自动包含 request_id
```

### ❌ 不推荐做法

```python
# 1. 避免在循环中频繁记录日志
for item in items:
    logger.debug(f"Processing {item}")  # ❌ 可能产生大量日志

# 2. 避免记录敏感信息
logger.info(f"User password: {password}")  # ❌ 泄露敏感信息

# 3. 避免使用 print
print("Debug message")  # ❌ 应该使用 logger

# 4. 避免过度使用日志
logger.debug("Step 1")
logger.debug("Step 2")
logger.debug("Step 3")  # ❌ 太多调试日志
```

---

## 异常处理最佳实践

### ✅ 推荐做法

```python
from FQBase.Foundation import (
    FQException,
    DataSourceException,
    retry,
    handle_exception,
)

# 1. 使用框架提供的异常类
def fetch_data():
    try:
        return api.get()
    except ConnectionError as e:
        raise DataSourceException(f"Failed to fetch data: {e}")

# 2. 使用异常处理装饰器
@handle_exception(default=None, log_error=True)
def risky_operation():
    return 1 / 0

# 3. 使用重试机制
@retry(stop_max_attempt_number=3, wait_random_min=100, wait_random_max=500)
def fetch_with_retry():
    return api.get()

# 4. 捕获特定异常
try:
    result = operation()
except DataSourceException:
    # 处理数据源异常
    pass
except FQException:
    # 处理框架异常
    pass

# 5. 提供详细的错误信息
raise DataSourceException(
    "Failed to connect to database",
    error_code="DB_001",
    details={"host": "localhost", "port": 27017}
)
```

### ❌ 不推荐做法

```python
# 1. 避免捕获所有异常
try:
    operation()
except Exception:  # ❌ 太宽泛
    pass

# 2. 避免吞掉异常
try:
    operation()
except Exception:
    pass  # ❌ 异常被忽略

# 3. 避免使用裸 except
try:
    operation()
except:  # ❌ 会捕获 KeyboardInterrupt 等
    pass

# 4. 避免过度嵌套
try:
    try:
        try:
            operation()
        except Exception:
            pass
    except Exception:
        pass
except Exception:  # ❌ 过度嵌套
    pass
```

---

## 资源管理最佳实践

### ✅ 推荐做法

```python
# 1. 使用上下文管理器
from FQBase.Crawler import BaseCrawler

with BaseCrawler(use_browser=True) as crawler:  # ✅ 自动清理
    html = crawler.fetch_url('https://example.com')

# 2. 显式释放资源
from FQBase.DataStore import MongoClientManager

manager = MongoClientManager(uri='mongodb://localhost:27017')
try:
    # 使用 manager
    pass
finally:
    MongoClientManager.release(uri)  # ✅ 显式释放

# 3. 使用生命周期管理
from FQBase.Foundation import Initializable, Shutdownable

class MyService(Initializable, Shutdownable):
    def initialize(self) -> bool:
        # 初始化资源
        return True
    
    def shutdown(self) -> bool:
        # 清理资源
        return True

# 4. 监控资源使用
count = LocalCache.get_instance_count()
if count > 50:
    logger.warning(f"Too many cache instances: {count}")
    LocalCache.cleanup_expired_instances()
```

### ❌ 不推荐做法

```python
# 1. 避免忘记释放资源
crawler = BaseCrawler(use_browser=True)
html = crawler.fetch_url('https://example.com')
# ❌ 忘记调用 crawler.close()

# 2. 避免创建过多实例
for i in range(1000):
    cache = LocalCache()  # ❌ 创建太多实例

# 3. 避免在循环中创建资源
while True:
    manager = MongoClientManager()  # ❌ 每次循环都创建
    # 使用 manager
```

---

## 性能优化最佳实践

### ✅ 推荐做法

```python
# 1. 使用缓存减少计算
from FQBase.Cache import local_cache

@local_cache(ttl=3600)
def expensive_computation(param):
    # 耗时计算
    return result

# 2. 使用批量操作
from FQBase.Util import ParallelProcess

def process_item(item):
    return item * 2

items = list(range(1000))
results = ParallelProcess(max_workers=4).map(process_item, items)  # ✅

# 3. 使用异步操作
from FQBase.Core import EventBus

bus = EventBus()
bus.publish_async(Event("event", data={}))  # ✅ 异步发布

# 4. 使用连接池
from FQBase.DataStore import MongoDB

db = MongoDB()  # ✅ 自动使用连接池

# 5. 避免重复计算
# ❌
for i in range(100):
    result = expensive_computation(i)

# ✅
results = [expensive_computation(i) for i in range(100)]
```

### ❌ 不推荐做法

```python
# 1. 避免在循环中重复计算
for i in range(100):
    result = expensive_computation(constant_param)  # ❌ 每次都计算

# ✅ 应该缓存结果
result = expensive_computation(constant_param)
for i in range(100):
    use_result(result)

# 2. 避免同步等待异步操作
result = bus.publish_sync(Event("event"))  # ❌ 阻塞

# 3. 避免创建不必要的对象
for i in range(10000):
    obj = MyClass()  # ❌ 创建太多对象
    obj.process()
```

---

## 安全性最佳实践

### ✅ 推荐做法

```python
# 1. 使用安全模式处理不可信数据
from FQBase.Cache import RedisCacheAdapter

adapter = RedisCacheAdapter(safe_mode=True)  # ✅

# 2. 使用安全的环境变量获取
from FQBase.Config.core import get_secure_env

password = get_secure_env('DATABASE_PASSWORD')  # ✅

# 3. 使用安全的随机数生成
from FQBase.Foundation import random_string

token = random_string(length=32)  # ✅ 使用 secrets 模块

# 4. 验证输入
from FQBase.Foundation import validate_code, validate_date

code = validate_code(stock_code)  # ✅
date = validate_date(date_str)    # ✅

# 5. 使用熔断器保护外部调用
from FQBase.Foundation import circuit_breaker

@circuit_breaker(failure_threshold=5, recovery_timeout=60)
def call_external_api():
    return api.request()  # ✅
```

### ❌ 不推荐做法

```python
# 1. 避免使用不安全的反序列化
import pickle
data = pickle.loads(untrusted_data)  # ❌ 危险

# 2. 避免硬编码敏感信息
password = "my_password"  # ❌

# 3. 避免使用不安全的随机数
import random
token = str(random.random())  # ❌ 不安全

# 4. 避免信任所有输入
code = input("Enter stock code: ")
# ❌ 没有验证直接使用
```

---

## 测试最佳实践

### ✅ 推荐做法

```python
import pytest
from FQBase.Foundation import reset_singleton
from FQBase.Cache import LocalCache

# 1. 使用 fixture 管理测试资源
@pytest.fixture
def cache():
    cache = LocalCache(name='test_cache')
    yield cache
    cache.clear()  # ✅ 清理资源

# 2. 重置单例
def test_singleton():
    reset_singleton(MyService)  # ✅ 测试隔离
    service = MyService()
    assert service is not None

# 3. 使用 Mock 隔离依赖
from unittest.mock import Mock, patch

def test_with_mock():
    mock_cache = Mock()
    mock_cache.get.return_value = 'test_value'
    
    service = MyService(cache=mock_cache)
    result = service.get_data()
    
    assert result == 'test_value'
    mock_cache.get.assert_called_once()

# 4. 测试异常
def test_exception():
    with pytest.raises(DataSourceException):
        raise DataSourceException("Test error")

# 5. 参数化测试
@pytest.mark.parametrize("input,expected", [
    (1, 2),
    (2, 4),
    (3, 6),
])
def test_multiply(input, expected):
    assert input * 2 == expected
```

### ❌ 不推荐做法

```python
# 1. 避免测试依赖全局状态
cache = LocalCache()  # ❌ 全局状态

def test_1():
    cache.set('key', 'value')

def test_2():
    # ❌ 可能受到 test_1 的影响
    value = cache.get('key')

# 2. 避免测试之间有依赖
def test_1():
    global result
    result = compute()

def test_2():
    # ❌ 依赖 test_1 的结果
    use_result(result)

# 3. 避免过度 Mock
def test_over_mock():
    mock = Mock()
    mock.method1.return_value = 1
    mock.method2.return_value = 2
    mock.method3.return_value = 3
    # ❌ 过度 Mock，测试价值低
```

---

## 总结

遵循这些最佳实践可以帮助您：

1. ✅ **提高代码质量** - 遵循规范，减少错误
2. ✅ **提升性能** - 合理使用缓存、批量操作
3. ✅ **增强安全性** - 保护敏感信息，验证输入
4. ✅ **便于维护** - 清晰的代码结构，良好的文档
5. ✅ **易于测试** - 模块化设计，依赖注入

---

## 相关文档

- [架构设计文档](architecture.md)
- [快速开始指南](quick-start.md)
- [API 参考](logger-api.md)
