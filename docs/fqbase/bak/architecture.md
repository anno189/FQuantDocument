# FQBase 架构设计文档

## 概述

FQBase 是 FQuant 量化框架的基础设施层，提供了一系列核心组件以支持量化交易的开发和运行。框架采用分层架构设计，强调模块化、可扩展性和可测试性。

**版本**: 2.0  
**最后更新**: 2024-01-15

---

## 整体架构

### 架构分层图

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          Application Layer                                │
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
├─────────────────┤   ├─────────────────┤   ├─────────────────┤
│ LocalCache      │   │ MongoDB Client │   │ core/           │
│ RedisCache      │   │ MongoDB        │   │  - env          │
│ MongoCache      │   │                │   │  - setting      │
│ Metrics         │   │                │   │  - cache_config │
└─────────────────┘   └─────────────────┘   │ business/       │
          │                         │       │  - constants    │
          │                         │       │  - datasource   │
          │                         │       └─────────────────┘
          │                         │                         │
          └─────────────────────────┼─────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         Foundation Layer                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │ Singleton   │  │ Container   │  │ Circuit     │  │ Lifecycle   │  │
│  │ 单例模式    │  │ DI容器      │  │ Breaker    │  │ 生命周期    │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                    │
│  │ Exceptions  │  │ Retry      │  │ Validators │                    │
│  │ 异常体系    │  │ 重试机制    │  │ 验证器     │                    │
│  └─────────────┘  └─────────────┘  └─────────────┘                    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
          ┌─────────────────────────┼─────────────────────────┐
          ▼                         ▼                         ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│      Util       │   │      Date       │   │     Crawler     │
│     工具层      │   │    日期处理     │   │    爬虫工具     │
├─────────────────┤   ├─────────────────┤   ├─────────────────┤
│ Parallel        │   │ TradeCalendar  │   │ BaseCrawler     │
│ File            │   │ Timestamp      │   │ PageParser      │
│ Converters      │   │ get_trade_dates│   │ BrowserPool     │
│ Network         │   │                │   │                 │
│ Transformer     │   │                │   │                 │
└─────────────────┘   └─────────────────┘   └─────────────────┘
```

---

## 模块详解

### 1. Foundation Layer - 基础抽象层

**职责**: 提供基础设计模式、工具和抽象，不包含业务逻辑

**设计原则**:
- Foundation 层不依赖 Core 层
- Foundation 层提供通用的、可复用的抽象
- Foundation 层不包含业务逻辑

#### 1.1 Singleton（单例模式）

```python
from FQBase.Foundation import singleton

@singleton
class MyService:
    pass

# 全局只有一个实例
a = MyService()
b = MyService()
assert a is b  # True
```

**特性**:
- ✅ 线程安全
- ✅ 支持测试隔离（`reset_singleton`）
- ✅ 自动资源清理

#### 1.2 Container（依赖注入容器）

```python
from FQBase.Foundation import (
    ServiceContainer,
    ServiceLocator,
    ServiceLifetime,
)

container = ServiceContainer()
container.register_singleton(ICache, RedisCache)
container.register_singleton(IDatabase, MongoDatabase)

# 自动依赖注入
cache = container.get(ICache)
```

**特性**:
- ✅ 支持三种生命周期（Singleton, Transient, Scoped）
- ✅ 自动解析依赖关系
- ✅ 检测循环依赖
- ✅ 线程安全

#### 1.3 Circuit Breaker（熔断器）

```python
from FQBase.Foundation import circuit_breaker

@circuit_breaker(name="api_service", failure_threshold=5, recovery_timeout=30)
def call_api():
    return remote_api.request()
```

**状态转换**:
```
CLOSED → (失败次数 >= 阈值) → OPEN → (恢复超时) → HALF_OPEN → (成功) → CLOSED
                                              ↓
                                              (失败)
                                              ↓
                                            OPEN
```

#### 1.4 Lifecycle（生命周期管理）

```python
from FQBase.Foundation import (
    HealthCheckable,
    Initializable,
    Shutdownable,
)

class MyService(HealthCheckable, Initializable, Shutdownable):
    def initialize(self) -> bool:
        # 初始化资源
        return True

    def shutdown(self) -> bool:
        # 释放资源
        return True

    def health_check(self) -> bool:
        # 健康检查
        return True
```

#### 1.5 Retry（重试机制）

```python
from FQBase.Foundation import retry, retry_with_exponential_backoff

# 固定间隔重试
@retry(stop_max_attempt_number=3, wait_random_min=100, wait_random_max=500)
def fetch_data():
    return api.get()

# 指数退避重试
@retry_with_exponential_backoff(max_attempts=5, base_wait=100, max_wait=10000)
def fetch_data_with_backoff():
    return api.get()
```

**特性**:
- ✅ 支持多种重试策略
- ✅ 支持异步重试
- ✅ 可配置重试条件
- ✅ 详细的文档说明

---

### 2. Core Layer - 核心业务层

**职责**: 提供核心业务服务，包含事件驱动、日志、通知等核心功能

**设计原则**:
- Core 层依赖 Foundation 层
- Core 层提供核心业务服务
- Core 层不依赖业务配置

#### 2.1 EventBus（事件总线）

```python
from FQBase.Core import EventBus, Event, get_event_bus

bus = get_event_bus()

# 订阅
bus.subscribe("trade_signal", on_trade_signal, priority=10)

# 发布
bus.publish(Event("trade_signal", data={"code": "000001"}))
```

**特性**:
- ✅ 支持同步/异步发布
- ✅ 支持优先级处理
- ✅ 支持弱引用订阅（防止内存泄漏）
- ✅ 事件历史记录（环形缓冲区）
- ✅ 自动清理失效订阅者

**内存优化**:
- 默认保留 100 条事件历史（可配置）
- 使用环形缓冲区自动丢弃旧事件
- 弱引用订阅防止内存泄漏

#### 2.2 Logger（日志系统）

```python
from FQBase.Core import get_logger

logger = get_logger('MarketData')
logger.info("行情数据获取成功")
logger.progress(50, 100, "##JOB01====", "Stock 000001")
```

**特性**:
- ✅ 多实例单例模式
- ✅ 支持 YAML 配置
- ✅ 进度条显示
- ✅ 结构化日志支持

#### 2.3 Notification（通知服务）

```python
from FQBase.Core import NotificationManager, sendWechat

# 使用模板
message = NotificationTemplate.render('trade_signal',
    strategy='均值回归',
    code='000001',
    price=12.50,
)

sendWechat(message, channel='LIMIT')
```

**支持渠道**:
- 企业微信（Wecom）
- Server 酱
- PushBear

---

### 3. Cache Layer - 缓存层

**职责**: 提供统一的缓存管理，支持多种后端

#### 3.1 架构图

```
┌─────────────────────────────────────────────────────────┐
│                      Cache Layer                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│   ┌─────────────┐      ┌─────────────┐                 │
│   │ LocalCache  │      │ RedisCache  │                 │
│   │ (内存缓存)  │      │ (分布式缓存) │                 │
│   └─────────────┘      └─────────────┘                 │
│          │                    │                       │
│          └──────────┬──────────┘                      │
│                      │                                 │
│                      ▼                                 │
│   ┌─────────────────────────────────────┐             │
│   │         CacheInterface               │             │
│   │  ┌─────────┐  ┌─────────┐           │             │
│   │  │   get   │  │   set   │           │             │
│   │  │  delete │  │  clear  │           │             │
│   │  └─────────┘  └─────────┘           │             │
│   └─────────────────────────────────────┘             │
└─────────────────────────────────────────────────────────┘
```

#### 3.2 缓存适配器

| 适配器 | 说明 | 适用场景 |
|--------|------|---------|
| `LocalCache` | 内存缓存，线程安全 | 单进程、本地开发 |
| `RedisCache` | Redis 分布式缓存 | 多进程、生产环境 |
| `MongoCache` | MongoDB 缓存 | 大容量缓存需求 |

#### 3.3 安全特性

```python
# 安全模式（推荐用于不可信数据）
adapter = RedisCacheAdapter(host='localhost', safe_mode=True)

# 或使用便捷函数
from FQBase.Cache._serializers import safe_deserialize_value
value = safe_deserialize_value(untrusted_data)
```

**安全说明**:
- ✅ Pickle 反序列化安全保护
- ✅ 白名单机制限制可反序列化的类型
- ✅ 向后兼容

#### 3.4 资源管理

```python
# LocalCache 自动清理
LocalCache.cleanup_expired_instances()  # 手动清理
LocalCache.get_instance_count()  # 获取实例数量

# 后台自动清理（默认 300 秒）
LocalCache.start_cleanup_thread(interval=300)
```

---

### 4. DataStore Layer - 数据存储层

**职责**: 提供统一的数据访问接口

#### 4.1 核心功能

```python
from FQBase.DataStore import MongoDB, MongoClientManager

# 使用 MongoDB
db = MongoDB()
db.insert('stocks', {'code': '000001', 'name': '平安银行'})
db.find('stocks', {'code': '000001'})

# 客户端管理
MongoClientManager.get_instance_count()  # 获取实例数量
MongoClientManager.release(uri)  # 释放引用
```

**资源管理**:
- ✅ 引用计数机制
- ✅ 自动释放资源
- ✅ 程序退出时自动清理

---

### 5. Config Layer - 配置层

**职责**: 集中化配置管理，拆分为核心配置和业务配置

#### 5.1 目录结构

```
Config/
├── __init__.py              # 统一入口
├── core/                    # 核心配置
│   ├── env.py              # 环境变量管理
│   ├── setting.py          # MongoDB 连接配置和路径配置
│   ├── cache_config.py     # 缓存配置
│   ├── config_watcher.py   # 配置监听
│   └── logging.yaml        # 日志配置文件
└── business/                # 业务配置
    ├── constants.py        # 交易常量定义
    ├── datasource_config.py # 数据源配置
    ├── financial_mapping.py # 财务指标映射
    ├── ip_list.py          # IP 列表配置
    └── datasource.yaml     # 数据源配置文件
```

#### 5.2 使用方式

```python
# 核心配置
from FQBase.Config.core import get_env, Setting, CacheConfig
from FQBase.Config.core.env import load_env, reload_env

# 业务配置
from FQBase.Config.business import MARKET_TYPE, FREQUENCE
from FQBase.Config.business.constants import ORDER_DIRECTION

# 向后兼容
from FQBase.Config import get_env, GLOBALMAP, MARKET_TYPE
```

**设计原则**:
- ✅ 核心配置不依赖业务配置
- ✅ 业务配置可以依赖核心配置
- ✅ 所有公共 API 保持向后兼容

---

### 6. Crawler Layer - 爬虫层

**职责**: 提供浏览器自动化和网页抓取功能

#### 6.1 核心组件

```python
from FQBase.Crawler import BaseCrawler, PageParser, BrowserPool

# 基础爬虫
with BaseCrawler(use_browser=True) as crawler:
    html = crawler.fetch_url_with_browser('https://example.com')

# 页面解析
links = PageParser.extract_links(html, base_url='https://example.com')

# 浏览器池
pool = BrowserPool(max_browsers=3)
browser = pool.get_browser()
```

#### 6.2 特性

- ✅ 支持无头浏览器（Chrome, Firefox）
- ✅ 支持多种页面解析方式（正则、CSS选择器、XPath）
- ✅ 自动重试机制
- ✅ 浏览器池管理

---

### 7. Date Layer - 日期层

**职责**: 提供日期和时间处理功能

```python
from FQBase.Date import TradeCalendar, Timestamp, get_trade_dates

# 判断是否交易日
is_trading_day('2024-01-15')  # True/False

# 获取交易日列表
trade_dates = get_trade_dates('2024-01-01', '2024-12-31')
```

---

### 8. Util Layer - 工具层

**职责**: 提供跨模块的通用工具函数

```python
from FQBase.Util import (
    ParallelProcess,
    ParallelThread,
    dict_to_df,
    df_to_dict,
    normalize_code,
    resample_ohlc,
)
```

---

## 设计模式应用

### 1. 单例模式

```python
from FQBase.Foundation import singleton

@singleton
class ConfigManager:
    pass
```

### 2. 工厂模式

```python
from FQBase.Cache import create_cache

cache = create_cache(config)  # 根据配置创建缓存适配器
```

### 3. 适配器模式

```python
from FQBase.Cache import CacheInterface

class MyCacheAdapter(CacheInterface):
    def get(self, key: str) -> Any:
        pass
    
    def set(self, key: str, value: Any, ttl: int = None) -> bool:
        pass
```

### 4. 观察者模式

```python
from FQBase.Core import EventBus

bus = EventBus()
bus.subscribe("order", on_order)
bus.publish(Event("order", data=order_data))
```

### 5. 装饰器模式

```python
from FQBase.Foundation import circuit_breaker, retry

@circuit_breaker(failure_threshold=3)
@retry(max_attempts=3)
def call_service():
    return api.request()
```

### 6. 策略模式

```python
# 缓存策略可切换
if use_redis:
    cache = RedisCacheAdapter()
else:
    cache = LocalCache()
```

### 7. 依赖注入

```python
from FQBase.Foundation import ServiceContainer

container = ServiceContainer()
container.register_singleton(ICache, RedisCache)
cache = container.get(ICache)
```

### 8. 模板方法模式

```python
from FQBase.Foundation import Initializable, Shutdownable

class MyService(Initializable, Shutdownable):
    def initialize(self) -> bool:
        # 初始化逻辑
        return True
    
    def shutdown(self) -> bool:
        # 关闭逻辑
        return True
```

### 9. 熔断器模式

```python
from FQBase.Foundation import circuit_breaker

@circuit_breaker(failure_threshold=5, recovery_timeout=60)
def call_external_service():
    pass
```

---

## 模块依赖关系

```
┌─────────────────────────────────────────────────────────┐
│                    Application Layer                     │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                      Core Layer                          │
│        EventBus / Logger / Notification                  │
│                   ↓ 依赖 Foundation                      │
└─────────────────────────────────────────────────────────┘
                           ↓
┌──────────┬──────────┬──────────┬──────────┬──────────┐
│  Cache   │DataStore │  Config  │ Crawler  │   Date   │
│          │          │          │          │          │
│          │          │ ├─ core  │          │          │
│          │          │ └─business│          │          │
└──────────┴──────────┴──────────┴──────────┴──────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                   Foundation Layer                       │
│   Singleton / Container / CircuitBreaker / Lifecycle    │
│              不依赖 Core 层                               │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                     Util Layer                           │
│        Parallel / File / Converters / Network           │
└─────────────────────────────────────────────────────────┘
```

**依赖原则**:
- ✅ 上层依赖下层
- ✅ Foundation 不依赖 Core
- ✅ Config 分为核心配置和业务配置
- ✅ 业务配置可以依赖核心配置

---

## 线程安全

框架各组件的线程安全性：

| 组件 | 线程安全 | 说明 |
|------|---------|------|
| `FQLogger` | ✅ | 双锁保护（`_init_lock`, `_instances_lock`） |
| `EventBus` | ✅ | `threading.Lock` 保护订阅者 |
| `ServiceContainer` | ✅ | `threading.Lock` 保护注册表 |
| `LocalCache` | ✅ | `threading.Lock` 保护缓存字典 |
| `MongoDB` | ✅ | PyMongo 本身线程安全 |
| `CircuitBreaker` | ✅ | `threading.Lock` 保护状态 |
| `MongoClientManager` | ✅ | 引用计数 + 锁保护 |

---

## 扩展指南

### 1. 添加新的缓存适配器

```python
from FQBase.Cache import CacheInterface

class MemcachedAdapter(CacheInterface):
    def get(self, key: str) -> Any:
        # 实现获取逻辑
        pass

    def set(self, key: str, value: Any, ttl: int = None) -> bool:
        # 实现设置逻辑
        pass
```

### 2. 添加新的通知渠道

```python
from FQBase.Core import NotificationHandler

class DingTalkHandler(NotificationHandler):
    def send(self, content: str, **kwargs) -> bool:
        # 实现发送逻辑
        pass

manager.register('dingtalk', DingTalkHandler())
```

### 3. 添加新的数据源

```python
from FQBase.DataStore import DataStoreInterface

class MySQLDatabase(DataStoreInterface):
    def insert_one(self, collection: str, document: Dict) -> str:
        # 实现插入逻辑
        pass
    
    def find(self, collection: str, query: Dict) -> List[Dict]:
        # 实现查询逻辑
        pass
```

---

## 性能优化

### 1. 缓存优化

- ✅ LocalCache 支持 LRU/FIFO 驱逐策略
- ✅ 惰性清理过期缓存项
- ✅ 批量操作支持（`get_many/set_many`）

### 2. 事件总线优化

- ✅ 环形缓冲区限制事件历史
- ✅ 弱引用订阅防止内存泄漏
- ✅ 自动清理失效订阅者

### 3. 资源管理优化

- ✅ ThreadPoolExecutor 自动关闭
- ✅ MongoClient 引用计数管理
- ✅ LocalCache 实例自动清理

---

## 安全性

### 1. Pickle 反序列化安全

```python
# 安全模式（推荐用于不可信数据）
adapter = RedisCacheAdapter(safe_mode=True)
```

**安全白名单**:
- Python 内置模块: `builtins`, `collections`, `datetime`, `decimal`, `fractions`, `functools`, `itertools`, `operator`, `typing`
- 数据分析模块: `pandas`, `numpy` 及其子模块

### 2. 敏感信息保护

```python
from FQBase.Config.core import get_secure_env

# 检测占位符，防止使用默认值
value = get_secure_env('DATABASE_PASSWORD')
```

### 3. 安全随机数生成

```python
from FQBase.Foundation import random_string

# 使用 secrets 模块生成安全随机数
token = random_string(length=32)
```

---

## 相关文档

### API 参考
- [Logger API](logger-api.md)
- [EventBus API](eventbus-api.md)
- [Notification API](notification-api.md)
- [Container API](container-api.md)
- [Circuit Breaker API](circuit-breaker-api.md)
- [Lifecycle API](lifecycle-api.md)

### 应用指南
- [Logger 使用指南](logger-usage.md)
- [EventBus 使用指南](eventbus_usage_guide.md)
- [Notification 使用指南](notification-usage.md)
- [Container 使用指南](container-usage.md)
- [Circuit Breaker 使用指南](circuit-breaker-usage.md)
- [Lifecycle 使用指南](lifecycle-usage.md)

### 开发文档
- [Logger 开发文档](logger.md)
- [最佳实践指南](best-practices.md)
- [快速开始指南](quick-start.md)
