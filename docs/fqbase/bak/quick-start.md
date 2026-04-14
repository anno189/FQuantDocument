# FQBase 快速开始指南

## 概述

本指南将帮助您快速上手 FQBase 框架，通过实际示例展示如何使用框架的核心功能。

**版本**: 2.0  
**最后更新**: 2024-01-15

---

## 目录

1. [安装](#安装)
2. [基础配置](#基础配置)
3. [核心功能快速上手](#核心功能快速上手)
4. [完整示例](#完整示例)
5. [常见问题](#常见问题)

---

## 安装

### 环境要求

- Python 3.8+
- MongoDB 4.0+ (可选)
- Redis 6.0+ (可选)

### 安装依赖

```bash
# 基础依赖
pip install pymongo redis pandas numpy

# 可选依赖
pip install selenium beautifulsoup4  # 爬虫功能
```

### 验证安装

```python
import FQBase

# 验证核心模块
from FQBase.Core import EventBus, get_logger
from FQBase.Foundation import singleton, retry
from FQBase.Cache import LocalCache

print("FQBase 安装成功！")
```

---

## 基础配置

### 1. 环境变量配置

创建 `.env` 文件：

```bash
# 数据库配置
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=fquant

# Redis 配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0

# 日志配置
LOG_LEVEL=INFO
LOG_PATH=/var/log/fquant

# 缓存配置
CACHE_TYPE=redis
CACHE_PREFIX=fqcache:
CACHE_TTL=3600
```

### 2. 加载配置

```python
from FQBase.Config.core import load_env, get_env

# 加载环境变量
load_env()

# 获取配置
db_uri = get_env('MONGODB_URI')
log_level = get_env('LOG_LEVEL', 'INFO')
```

### 3. 日志配置

创建 `logging.yaml`：

```yaml
version: 1
formatters:
  standard:
    format: '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
handlers:
  console:
    class: logging.StreamHandler
    formatter: standard
    level: INFO
  file:
    class: logging.handlers.RotatingFileHandler
    filename: /var/log/fquant/app.log
    maxBytes: 10485760
    backupCount: 5
    formatter: standard
    level: DEBUG
root:
  level: INFO
  handlers: [console, file]
```

---

## 核心功能快速上手

### 1. 日志系统

```python
from FQBase.Core import get_logger

# 获取 logger
logger = get_logger('MyApp')

# 基本日志
logger.info("应用启动")
logger.warning("这是一个警告")
logger.error("这是一个错误")

# 进度日志
total = 100
for i in range(total):
    # 处理数据
    logger.progress(i + 1, total, "##JOB01====", f"处理股票 {i}")
```

### 2. 缓存系统

```python
from FQBase.Cache import LocalCache, RedisCacheAdapter

# 本地缓存
cache = LocalCache(name='my_cache', maxsize=1000, ttl=3600)

# 设置缓存
cache.set('stock_000001', {'name': '平安银行', 'price': 12.50})

# 获取缓存
data = cache.get('stock_000001')
print(data)  # {'name': '平安银行', 'price': 12.50}

# 使用装饰器缓存
from FQBase.Cache import local_cache

@local_cache(ttl=300)
def get_stock_info(code):
    # 模拟耗时查询
    return {'code': code, 'name': '平安银行', 'price': 12.50}

# 第一次调用会执行函数
info1 = get_stock_info('000001')

# 第二次调用会从缓存获取
info2 = get_stock_info('000001')
```

### 3. 事件总线

```python
from FQBase.Core import EventBus, Event, get_event_bus

# 获取事件总线
bus = get_event_bus()

# 定义事件处理器
def on_trade_signal(event: Event):
    print(f"收到交易信号: {event.data}")
    # 执行交易逻辑
    execute_trade(event.data)

# 订阅事件
bus.subscribe("trade_signal", on_trade_signal, priority=10)

# 发布事件
bus.publish(Event("trade_signal", data={
    'code': '000001',
    'action': 'BUY',
    'price': 12.50,
    'quantity': 1000
}))

# 异步发布
bus.publish_async(Event("trade_signal", data={...}))
```

### 4. 异常处理

```python
from FQBase.Foundation import (
    FQException,
    DataSourceException,
    retry,
    handle_exception,
)

# 使用重试机制
@retry(stop_max_attempt_number=3, wait_random_min=100, wait_random_max=500)
def fetch_data_from_api():
    # 可能失败的操作
    response = requests.get('https://api.example.com/data')
    response.raise_for_status()
    return response.json()

# 使用异常处理装饰器
@handle_exception(default=None, log_error=True)
def risky_operation():
    # 可能抛出异常的操作
    return 1 / 0

# 自定义异常
class StrategyException(FQException):
    pass

def execute_strategy():
    if not validate_strategy():
        raise StrategyException("策略验证失败")
```

### 5. 熔断器

```python
from FQBase.Foundation import circuit_breaker

# 使用熔断器保护外部调用
@circuit_breaker(name="external_api", failure_threshold=5, recovery_timeout=60)
def call_external_api():
    response = requests.get('https://external-api.example.com/data')
    response.raise_for_status()
    return response.json()

# 当失败次数达到阈值时，熔断器会打开，阻止后续调用
# 等待 recovery_timeout 后，熔断器进入半开状态，允许一次调用测试
```

### 6. 依赖注入

```python
from FQBase.Foundation import ServiceContainer, ServiceLifetime

# 创建容器
container = ServiceContainer()

# 注册服务
container.register_singleton(ICache, RedisCacheAdapter)
container.register_singleton(IDatabase, MongoDB)
container.register_transient(ILogger, lambda: get_logger('MyApp'))

# 解析服务
cache = container.get(ICache)
db = container.get(IDatabase)

# 使用服务
cache.set('key', 'value')
data = db.find('stocks', {'code': '000001'})
```

### 7. 数据存储

```python
from FQBase.DataStore import MongoDB

# 连接数据库
db = MongoDB()

# 插入数据
db.insert('stocks', {
    'code': '000001',
    'name': '平安银行',
    'price': 12.50,
    'volume': 1000000
})

# 查询数据
stocks = db.find('stocks', {'code': '000001'})

# 更新数据
db.update('stocks', {'code': '000001'}, {'$set': {'price': 12.60}})

# 删除数据
db.delete('stocks', {'code': '000001'})

# 带性能分析的查询
result = db.find_with_profiling('stocks', {}, slow_threshold_ms=1000)
print(f"查询耗时: {result['metrics']['elapsed_ms']}ms")
```

### 8. 爬虫工具

```python
from FQBase.Crawler import BaseCrawler, PageParser

# 使用爬虫
with BaseCrawler(use_browser=True) as crawler:
    # 获取页面
    html = crawler.fetch_url_with_browser('https://example.com')
    
    # 解析页面
    links = PageParser.extract_links(html, base_url='https://example.com')
    print(f"找到 {len(links)} 个链接")
    
    # 提取数据
    data = PageParser.extract_by_css(html, '.stock-item', attrs=['code', 'name'])
    print(data)
```

---

## 完整示例

### 示例 1: 股票数据采集系统

```python
from FQBase.Core import get_logger, EventBus, Event
from FQBase.Cache import LocalCache, local_cache
from FQBase.Foundation import retry, circuit_breaker
from FQBase.DataStore import MongoDB

logger = get_logger('StockCollector')
bus = EventBus()
cache = LocalCache(name='stock_cache', ttl=3600)
db = MongoDB()

class StockCollector:
    """股票数据采集器"""
    
    def __init__(self):
        self.logger = get_logger('StockCollector')
        bus.subscribe("collect_stock", self.on_collect)
    
    @retry(stop_max_attempt_number=3)
    @circuit_breaker(name="stock_api", failure_threshold=5, recovery_timeout=60)
    def fetch_stock_data(self, code: str):
        """获取股票数据"""
        # 检查缓存
        cached = cache.get(f"stock_{code}")
        if cached:
            self.logger.info(f"从缓存获取股票数据: {code}")
            return cached
        
        # 从 API 获取
        self.logger.info(f"从 API 获取股票数据: {code}")
        data = self._fetch_from_api(code)
        
        # 缓存数据
        cache.set(f"stock_{code}", data, ttl=300)
        
        return data
    
    def _fetch_from_api(self, code: str):
        """从 API 获取数据（模拟）"""
        # 实际实现中调用真实 API
        return {
            'code': code,
            'name': '平安银行',
            'price': 12.50,
            'volume': 1000000,
            'timestamp': '2024-01-15 15:00:00'
        }
    
    def on_collect(self, event: Event):
        """处理采集事件"""
        code = event.data.get('code')
        try:
            data = self.fetch_stock_data(code)
            
            # 保存到数据库
            db.insert('stocks', data)
            
            # 发布完成事件
            bus.publish(Event("stock_collected", data={
                'code': code,
                'status': 'success'
            }))
            
            self.logger.info(f"股票数据采集成功: {code}")
        except Exception as e:
            self.logger.error(f"股票数据采集失败: {code}, {e}")
            
            # 发布失败事件
            bus.publish(Event("stock_collect_failed", data={
                'code': code,
                'error': str(e)
            }))

# 使用示例
collector = StockCollector()

# 发布采集事件
bus.publish(Event("collect_stock", data={'code': '000001'}))
```

### 示例 2: 交易信号处理系统

```python
from FQBase.Core import get_logger, EventBus, Event, NotificationManager
from FQBase.Foundation import singleton, Initializable, Shutdownable
from FQBase.Cache import RedisCacheAdapter

logger = get_logger('SignalProcessor')

@singleton
class SignalProcessor(Initializable, Shutdownable):
    """交易信号处理器"""
    
    def __init__(self):
        self.bus = EventBus()
        self.cache = RedisCacheAdapter(host='localhost', safe_mode=True)
        self.notifier = NotificationManager()
        self.logger = get_logger('SignalProcessor')
    
    def initialize(self) -> bool:
        """初始化"""
        self.logger.info("初始化信号处理器")
        
        # 订阅事件
        self.bus.subscribe("trade_signal", self.on_trade_signal, priority=10)
        self.bus.subscribe("risk_alert", self.on_risk_alert, priority=20)
        
        return True
    
    def shutdown(self) -> bool:
        """关闭"""
        self.logger.info("关闭信号处理器")
        
        # 取消订阅
        self.bus.unsubscribe_all("trade_signal")
        self.bus.unsubscribe_all("risk_alert")
        
        return True
    
    def on_trade_signal(self, event: Event):
        """处理交易信号"""
        signal = event.data
        
        self.logger.info(f"收到交易信号: {signal}")
        
        # 检查是否已处理
        signal_id = signal.get('id')
        if self.cache.get(f"signal_{signal_id}"):
            self.logger.warning(f"信号已处理: {signal_id}")
            return
        
        # 验证信号
        if not self._validate_signal(signal):
            self.logger.warning(f"信号验证失败: {signal_id}")
            return
        
        # 执行交易
        try:
            result = self._execute_trade(signal)
            
            # 标记已处理
            self.cache.set(f"signal_{signal_id}", result, ttl=3600)
            
            # 发送通知
            self.notifier.send(
                f"交易执行成功: {signal['code']} {signal['action']} {signal['quantity']}",
                channel='LIMIT'
            )
            
            self.logger.info(f"交易执行成功: {signal_id}")
        except Exception as e:
            self.logger.error(f"交易执行失败: {signal_id}, {e}")
            
            # 发送告警
            self.notifier.send(
                f"交易执行失败: {signal_id}, {e}",
                channel='ALERT'
            )
    
    def on_risk_alert(self, event: Event):
        """处理风险告警"""
        alert = event.data
        
        self.logger.warning(f"收到风险告警: {alert}")
        
        # 发送通知
        self.notifier.send(
            f"风险告警: {alert['type']} - {alert['message']}",
            channel='ALERT'
        )
    
    def _validate_signal(self, signal):
        """验证信号"""
        required_fields = ['id', 'code', 'action', 'quantity', 'price']
        return all(field in signal for field in required_fields)
    
    def _execute_trade(self, signal):
        """执行交易"""
        # 实际实现中调用交易接口
        return {
            'signal_id': signal['id'],
            'status': 'success',
            'timestamp': '2024-01-15 15:00:00'
        }

# 使用示例
processor = SignalProcessor()
processor.initialize()

# 发布交易信号
bus.publish(Event("trade_signal", data={
    'id': 'signal_001',
    'code': '000001',
    'action': 'BUY',
    'quantity': 1000,
    'price': 12.50
}))

# 关闭时
processor.shutdown()
```

### 示例 3: 数据分析服务

```python
from FQBase.Core import get_logger
from FQBase.Cache import local_cache
from FQBase.DataStore import MongoDB
from FQBase.Util import ParallelProcess
import pandas as pd

logger = get_logger('DataAnalyzer')

class DataAnalyzer:
    """数据分析服务"""
    
    def __init__(self):
        self.db = MongoDB()
        self.logger = get_logger('DataAnalyzer')
    
    @local_cache(ttl=3600)
    def get_stock_data(self, code: str, start_date: str, end_date: str):
        """获取股票数据"""
        self.logger.info(f"获取股票数据: {code}, {start_date} - {end_date}")
        
        # 从数据库查询
        data = self.db.find('stock_daily', {
            'code': code,
            'date': {'$gte': start_date, '$lte': end_date}
        })
        
        # 转换为 DataFrame
        df = pd.DataFrame(data)
        return df
    
    def analyze_multiple_stocks(self, codes: list):
        """分析多只股票"""
        self.logger.info(f"分析 {len(codes)} 只股票")
        
        # 并行处理
        def analyze(code):
            df = self.get_stock_data(code, '2024-01-01', '2024-12-31')
            return {
                'code': code,
                'mean_price': df['price'].mean(),
                'max_price': df['price'].max(),
                'min_price': df['price'].min(),
            }
        
        # 使用并行处理
        parallel = ParallelProcess(max_workers=4)
        results = parallel.map(analyze, codes)
        
        self.logger.info(f"分析完成: {len(results)} 只股票")
        return results
    
    def generate_report(self, code: str):
        """生成分析报告"""
        self.logger.info(f"生成报告: {code}")
        
        # 获取数据
        df = self.get_stock_data(code, '2024-01-01', '2024-12-31')
        
        # 计算指标
        report = {
            'code': code,
            'total_days': len(df),
            'mean_price': df['price'].mean(),
            'std_price': df['price'].std(),
            'max_price': df['price'].max(),
            'min_price': df['price'].min(),
            'total_volume': df['volume'].sum(),
        }
        
        # 保存报告
        self.db.insert('analysis_reports', report)
        
        return report

# 使用示例
analyzer = DataAnalyzer()

# 分析单只股票
report = analyzer.generate_report('000001')
print(report)

# 分析多只股票
results = analyzer.analyze_multiple_stocks(['000001', '000002', '000003'])
print(results)
```

---

## 常见问题

### 1. 如何处理缓存过期？

```python
# 使用 TTL 自动过期
cache.set('key', value, ttl=3600)  # 1 小时后过期

# 手动删除
cache.delete('key')

# 批量清理过期缓存
LocalCache.cleanup_expired_instances()
```

### 2. 如何处理事件订阅的内存泄漏？

```python
# 使用弱引用订阅
bus.subscribe("event", handler, weak=True)

# 及时取消订阅
subscription_id = bus.subscribe("event", handler)
bus.unsubscribe(subscription_id)

# 使用上下文管理器
from FQBase.Core import EventBusContext

with EventBusContext() as bus:
    bus.subscribe("event", handler)
    # 自动清理
```

### 3. 如何处理数据库连接泄漏？

```python
# 使用引用计数
from FQBase.DataStore import MongoClientManager

manager = MongoClientManager(uri='mongodb://localhost:27017')
try:
    # 使用 manager
    pass
finally:
    MongoClientManager.release(uri)

# 程序退出时自动清理
# MongoClientManager 已注册 atexit
```

### 4. 如何提高性能？

```python
# 1. 使用缓存
@local_cache(ttl=3600)
def expensive_function():
    pass

# 2. 使用批量操作
cache.get_many(['key1', 'key2', 'key3'])

# 3. 使用并行处理
from FQBase.Util import ParallelProcess
parallel = ParallelProcess(max_workers=4)
results = parallel.map(func, items)

# 4. 使用异步事件
bus.publish_async(Event("event", data={}))
```

### 5. 如何保证线程安全？

```python
# FQBase 的核心组件都是线程安全的
# - EventBus: 使用锁保护订阅者
# - LocalCache: 使用锁保护缓存字典
# - ServiceContainer: 使用锁保护注册表
# - MongoDB: PyMongo 本身线程安全

# 使用时无需额外处理
```

---

## 下一步

- 阅读 [架构设计文档](architecture.md) 了解框架设计
- 阅读 [最佳实践指南](best-practices.md) 学习最佳实践
- 查看 [API 参考](logger-api.md) 了解详细 API

---

## 相关文档

- [架构设计文档](architecture.md)
- [最佳实践指南](best-practices.md)
- [Logger API](logger-api.md)
- [EventBus API](eventbus-api.md)
- [Notification API](notification-api.md)
