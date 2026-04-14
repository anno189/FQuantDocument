# FQBase 框架文档

FQBase 是 FQuant 系统的基础框架，提供金融量化系统所需的核心基础设施组件。

## 文档索引

### 综合文档

| 类型 | 文档 | 链接 |
|------|------|------|
| 快速开始 | 快速开始 | [quick-start](./quick-start) |
| 架构 | 系统架构 | [architecture](./architecture) |
| 设计 | 设计原则 | [design](./design) |
| 开发 | 开发指南 | [development](./development) |
| 最佳实践 | 最佳实践 | [best-practices](./best-practices) |
| API 规范 | API 规范 | [api-spec](./api-spec) |
| 应用示例 | 应用示例 | [application-examples](./application-examples) |
| 系统集成 | 系统集成 | [system-integration](./system-integration) |

## 核心模块

FQBase 采用分层架构，核心模块包括：

| 模块 | 说明 | 文档 |
|------|------|------|
| [Foundation](./foundation/) | 底层基础组件（熔断器、重试、生命周期等） | [API](./foundation/api) |
| [Core](./core/) | 核心服务（事件总线、日志、通知） | [API](./core/) |
| [Config](./config/) | 配置管理（环境变量、缓存配置等） | [API](./config/core/api) |
| [Cache](./cache/) | 缓存层（LocalCache、Redis、MongoDB） | [API](./cache/api) |
| [DataStore](./datastore/) | 数据存储（MongoDB 操作） | [API](./datastore/) |
| [Date](./date/) | 日期工具（交易日判断等） | [API](./date/api) |
| [Crawler](./crawler/) | 爬虫功能（BrowserPool） | [API](./crawler/browser/api) |
| [Util](./util/) | 工具函数（并行处理、数据转换等） | [API](./util/) |

## 架构分层

```
┌─────────────────────────────────────────────┐
│                 Util                        │  <- 工具层
├─────────────────────────────────────────────┤
│  Foundation  |  Core  |  Cache  |  Config │  <- 基础设施层
├─────────────────────────────────────────────┤
│         DataStore  |  Date  |  Crawler     │  <- 数据层
├─────────────────────────────────────────────┤
│               FQuant Server                 │  <- 应用层
└─────────────────────────────────────────────┘
```

**层次说明：**

- **工具层 (Util)** - 提供通用工具函数，不依赖其他 FQBase 模块
- **基础设施层** - Foundation 提供底层模式，Core 提供核心服务，Cache 提供缓存，Config 提供配置
- **数据层** - DataStore 数据持久化，Date 日期处理，Crawler 网页爬取

## 设计原则

1. **依赖倒置** - 核心接口与实现分离
2. **单一职责** - 每个模块专注于一件事
3. **开闭原则** - 对扩展开放，对修改关闭
4. **接口隔离** - 使用协议定义接口

## 快速开始

### 安装

```bash
pip install FQBase
```

### 缓存使用

```python
from FQBase.Cache import LocalCache

cache = LocalCache(name='my_cache', ttl=3600)
cache.set('key', 'value')
value = cache.get('key')
```

### 事件总线

```python
from FQBase.Core import Event, get_event_bus

bus = get_event_bus()

@bus.subscribe('order.created')
def on_order_created(event):
    print(f"Order created: {event.data}")

bus.publish(Event('order.created', data={'order_id': 1}))
```

### 熔断器

```python
from FQBase.Foundation import circuit_breaker

@circuit_breaker(failure_threshold=5, recovery_timeout=60)
def call_remote_service():
    # 可能失败的服务调用
    return remote_call()
```

### 配置管理

```python
from FQBase.Config.core import get_env, get_cache_config

# 获取环境变量
debug = get_env('DEBUG', 'false')

# 获取缓存配置
cache_config = get_cache_config()
```

## API 索引

### Cache 模块
- [LocalCache](./cache/api.md#localcache) - 本地内存缓存
- [RedisCacheAdapter](./cache/api.md#rediscacheadapter) - Redis 缓存适配器
- [MongoCacheAdapter](./cache/api.md#mongocacheadapter) - MongoDB 缓存适配器

### Core 模块
- [EventBus](./core/eventbus/api.md) - 事件总线
- [Event](./core/eventbus/api.md#event) - 事件对象
- [get_logger](./core/logger/api.md#get_logger) - 获取日志记录器
- [NotificationManager](./core/notification/api.md) - 通知管理器

### Foundation 模块
- [retry](./foundation/retry/api.md) - 重试装饰器
- [circuit_breaker](./foundation/circuit_breaker/api.md) - 熔断器装饰器
- [Validator](./foundation/validators/api.md) - 验证器类
- [dotty](./foundation/dotty/api.md) - 嵌套字典访问
- [ServiceContainer](./foundation/container/api.md) - 依赖注入容器
- [singleton](./foundation/singleton/api.md) - 单例装饰器

### Config 模块
- [cache_config](./config/core/api.md#cacheconfig) - 缓存配置
- [get_env](./config/core/api.md#get_env) - 获取环境变量
- [EnvManager](./config/core/api.md#envmanager) - 环境管理器

### DataStore 模块
- [MongoClientManager](./datastore/mongo_client/api.md) - MongoDB 客户端管理器
- [MongoDB](./datastore/mongo_db/api.md) - MongoDB 操作类

### Util 模块
- [ParallelProcess](./util/parallel.md) - 多进程并行处理
- [dict_to_df](./util/converters.md#dict_to_df) - 字典转 DataFrame

### Date 模块
- [util_if_trade](./date/api.md#util_if_trade) - 判断是否为交易日
- [util_get_next_trade_date](./date/api.md#util_get_next_trade_date) - 获取下一个交易日

### Crawler 模块
- [BrowserPool](./crawler/browser/api.md#browserpool) - 浏览器池
- [BaseCrawler](./crawler/browser/api.md#basecrawler) - 基础爬虫类

## 系统集成

FQBase 与 FQData、FQFactor 等项目集成：

- [FQData](../fqdata/) - FQData 使用 FQBase 的缓存和配置管理
- [FQFactor](../fqfactor/) - FQFactor 使用 FQBase 的容器和熔断器

## 文档导航

```
FQBase/
├── README.md                  # 本文档（索引）
├── quick-start.md           # 快速开始
├── architecture.md          # 架构说明
├── design.md               # 设计原则
├── development.md          # 开发指南
├── best-practices.md      # 最佳实践
├── api-spec.md           # API 规范
├── application-examples.md # 应用示例
├── system-integration.md  # 系统集成
├── foundation/            # Foundation 模块文档
├── core/                 # Core 模块文档
├── config/               # Config 模块文档
├── cache/                # Cache 模块文档
├── datastore/             # DataStore 模块文档
├── date/                 # Date 模块文档
├── crawler/              # Crawler 模块文档
└── util/                 # Util 模块文档
```
