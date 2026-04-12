# FQBase 开发文档

## 项目概述

FQBase 是 FQuant 项目的基础框架，提供金融量化系统所需的核心基础设施，包括缓存管理、配置系统、数据存储、事件总线、日志记录等。

## 架构设计

### 模块层次

```
┌─────────────────────────────────────────────┐
│                 Util                        │  <- 工具层
├─────────────────────────────────────────────┤
│  Foundation  |  Core  |  Cache  |  Config  │  <- 基础设施层
├─────────────────────────────────────────────┤
│         DataStore  |  Date  |  Crawler     │  <- 数据层
├─────────────────────────────────────────────┤
│               FQuant Server                 │  <- 应用层
└─────────────────────────────────────────────┘
```

### 设计原则

1. **依赖倒置**：核心接口与实现分离
2. **单一职责**：每个模块专注于一件事
3. **开闭原则**：对扩展开放，对修改关闭
4. **接口隔离**：使用协议（Protocol）定义接口

---

## 开发环境配置

### 环境要求

- Python 3.8+
- MongoDB（用于数据存储）
- Redis（可选，用于分布式缓存）

### 安装依赖

```bash
pip install pymongo redis pandas numpy
```

### 环境变量配置

在项目根目录创建 `.env` 文件：

```bash
# MongoDB 配置
MONGODB=mongodb://localhost:27017
MONGODB_URI=mongodb://user:password@localhost:27017

# Redis 配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
REDIS_PASSWORD=

# 缓存配置
CACHE_TYPE=memory  # memory/redis/mongo
CACHE_PREFIX=fqcache:
CACHE_TTL_DEFAULT=3600

# 路径配置
FQUANT_ROOT_PATH=/path/to/root
FQUANT_INDEX_PATH=/path/to/index
FQUANT_FQDATA_PATH=~/.fqdata

# 通知配置
SERVERCHAN_KEY=your_serverchan_key
PUSHBEAR_KEY=your_pushbear_key
WECOM_CORPID=your_corpid
WECOM_AGENTID_DEFAULT=1000010
WECOM_SECRET_DEFAULT=your_secret
```

---

## 模块开发指南

### Cache 模块开发

#### 添加新的缓存适配器

1. 实现 `CacheInterface` 协议
2. 在 `CacheAdapters.py` 中添加适配器类
3. 在 `__init__.py` 的 `create_cache` 函数中添加支持

```python
from FQBase.Cache import CacheInterface

class CustomCacheAdapter:
    """自定义缓存适配器"""

    def __init__(self, config):
        self.config = config

    def get(self, key: str, default=None):
        # 实现获取逻辑
        pass

    def set(self, key: str, value: Any, ttl: int = None) -> bool:
        # 实现设置逻辑
        pass

    # ... 其他接口方法
```

#### 缓存键设计规范

- 使用冒号分隔层级：`user:profile:123`
- 添加前缀避免冲突：`fqcache:user:profile:123`
- 键名小写：`user:profile` 而非 `User:Profile`

---

### Config 模块开发

#### 添加新的配置项

1. 在 `Config/business/constants.py` 添加常量
2. 在相应的 YAML/INI 文件中添加配置
3. 在对应的配置类中添加读取逻辑

```python
# 在 constants.py 添加常量类
class NEW_CONFIG:
    OPTION_A = 'value_a'
    OPTION_B = 'value_b'
```

#### 配置文件监听

配置文件变更时自动重载：

```python
from FQBase.Config.core.config_watcher import watch_config

def on_cache_config_change():
    # 重新加载缓存配置
    cache_config = get_cache_config(reload=True)
    # 重新初始化缓存
    set_cache_adapter(create_cache(cache_config))

watcher = watch_config(
    '/path/to/cache.yaml',
    on_cache_config_change,
    check_interval=5.0
)
```

---

### DataStore 模块开发

#### MongoDB 集合设计

1. 集合命名规范：使用小写字母和下划线
2. 索引设计：根据查询条件创建索引
3. 文档结构：避免深层嵌套

```python
# 集合命名
collection_name = 'user_positions'  # 正确
collection_name = 'UserPositions'  # 避免

# 索引设计
db.create_index('users', [('status', 1), ('created_at', -1)])
db.create_index('users', 'email', unique=True)
```

#### 异常处理

```python
from FQBase.Foundation.exceptions import (
    MongoDBConnectionException,
    MongoDBOperationException
)

try:
    db.insert_one('users', {'name': 'test'})
except MongoDBConnectionException:
    # 连接问题处理
    pass
except MongoDBOperationException:
    # 操作问题处理
    pass
```

---

### EventBus 模块开发

#### 定义事件类型

```python
# 在事件定义文件中
class OrderEvent:
    CREATED = 'order_created'
    FILLED = 'order_filled'
    CANCELLED = 'order_cancelled'
    REJECTED = 'order_rejected'
```

#### 发布事件

```python
from FQBase.Core.event_bus import Event, get_event_bus

bus = get_event_bus()

# 创建并发布事件
event = Event('order_created', data={
    'order_id': order.id,
    'symbol': order.symbol,
    'quantity': order.quantity,
    'price': order.price
})
bus.publish(event)
```

#### 订阅事件

```python
# 基本订阅
def on_order_created(event):
    print(f"订单已创建: {event.data['order_id']}")

bus.subscribe('order_created', on_order_created)

# 带优先级（高优先级先执行）
def on_order_created_high_priority(event):
    # 发送通知等
    pass

bus.subscribe('order_created', on_order_created_high_priority, priority=100)

# 全局订阅
def on_any_event(event):
    print(f"收到事件: {event.event_type}")

bus.subscribe_global(on_any_event)
```

---

### Foundation 模块开发

#### 实现重试逻辑

```python
from FQBase.Foundation.retry import retry, retry_with_exponential_backoff

# 简单重试
@retry(stop_max_attempt_number=3)
def call_api():
    return api.request()

# 指数退避重试
@retry_with_exponential_backoff(
    max_attempts=5,
    base_wait=100,
    max_wait=5000,
    retry_on_exception=(ConnectionError, TimeoutError)
)
def fetch_data():
    return api.get()
```

#### 实现熔断器保护

```python
from FQBase.Foundation.circuit_breaker import circuit_breaker

@circuit_breaker(name='external_api', failure_threshold=5, recovery_timeout=60)
def call_external_service():
    return external_api.get()
```

#### 使用依赖注入容器

```python
from FQBase.Foundation.container import ServiceContainer, ServiceLifetime

container = ServiceContainer()

# 注册服务
container.register_singleton(ICache, RedisCacheAdapter)
container.register_transient(ILogger, FileLogger)
container.register_factory(IDatabase, create_database)

# 获取服务
cache = container.get(ICache)
```

---

## 测试指南

### 单元测试

```python
import pytest
from FQBase.Cache import LocalCache

class TestLocalCache:
    def test_set_and_get(self):
        cache = LocalCache(name='test', singleton=False)
        cache.set('key', 'value')
        assert cache.get('key') == 'value'

    def test_ttl(self):
        cache = LocalCache(name='test', ttl=1, singleton=False)
        cache.set('key', 'value')
        assert cache.ttl('key') <= 1

    def test_not_exists(self):
        cache = LocalCache(name='test', singleton=False)
        assert cache.get('nonexistent') is None
```

### 集成测试

```python
import pytest
from FQBase.DataStore import get_mongo_db

class TestMongoDBIntegration:
    @pytest.fixture
    def db(self):
        return get_mongo_db(database='test_db')

    def test_insert_and_find(self, db):
        db.insert_one('users', {'name': 'test'})
        user = db.find_one('users', {'name': 'test'})
        assert user['name'] == 'test'
```

---

## 性能优化

### 缓存优化

1. **合理设置 TTL**：根据数据更新频率设置
2. **批量操作**：使用 `get_many`/`set_many`
3. **键前缀**：避免键冲突

```python
# 批量获取优于循环单个获取
users = cache.get_many(['user1', 'user2', 'user3'])

# 批量设置
cache.set_many({
    'user:1': user_data_1,
    'user:2': user_data_2
}, ttl=3600)
```

### MongoDB 优化

1. **创建适当索引**
2. **使用投影减少数据传输**
3. **批量操作替代循环**

```python
# 使用投影
users = db.find('users', {'status': 'active'}, projection={'name': 1, 'email': 1})

# 批量插入
db.insert_many('users', user_list)
```

### 并行处理

```python
from FQBase.Util import ParallelProcess

process = ParallelProcess(max_workers=4)
results = process.map(process_stock_data, stock_list)
```

---

## 安全指南

### 敏感信息处理

```python
from FQBase.Config.core.env import get_secure_env

# 安全获取敏感配置
api_key = get_secure_env('API_KEY')
db_password = get_secure_env('DB_PASSWORD')
```

### 安全反序列化

```python
# 不可信数据使用安全模式
value = deserialize_value(data, safe_mode=True)
```

### SQL/NoSQL 注入防护

- 使用参数化查询
- 验证输入数据

---

## 部署指南

### 环境变量配置

```bash
# 生产环境
export MONGODB_URI="mongodb://user:password@prod-mongo:27017"
export REDIS_HOST="prod-redis"
export CACHE_TYPE="redis"
export LOG_LEVEL="WARNING"
```

### 日志配置

```yaml
# logging.yaml
version: 1
formatters:
  default:
    format: '[%(asctime)s] %(levelname)s [%(name)s:%(lineno)d] %(message)s'
handlers:
  console:
    class: logging.StreamHandler
    formatter: default
  file:
    class: logging.handlers.RotatingFileHandler
    filename: /var/log/fquant/app.log
    maxBytes: 10485760
    backupCount: 5
root:
  level: INFO
  handlers: [console, file]
```

---

## 调试指南

### 日志调试

```python
from FQBase.Core.logger import get_logger

logger = get_logger(__name__)
logger.debug(f"查询参数: {params}")
logger.info(f"查询结果: {result}")
```

### 事件总线调试

```python
bus = get_event_bus()

# 查看订阅者
subscribers = bus.get_subscribers('order_created')
print(f"订阅者数量: {len(subscribers)}")

# 查看历史事件
history = bus.get_history('order_created', limit=10)
for event in history:
    print(f"{event.timestamp}: {event.data}")
```

### 缓存调试

```python
# 查看缓存统计
cache = get_cache_adapter()
if hasattr(cache, 'stats'):
    print(cache.stats)

# 列出缓存键
if hasattr(cache, 'keys'):
    keys = cache.keys('user:*')
    print(f"缓存键: {keys[:10]}")
```

---

## 常见问题

### Q: 如何选择缓存后端？

- **本地开发**：使用 Memory 缓存（默认）
- **单机部署**：Redis 缓存
- **分布式/大规模**：MongoDB 缓存

### Q: 如何处理连接失败？

使用重试机制和熔断器：

```python
@retry_with_exponential_backoff(max_attempts=3)
@circuit_breaker(failure_threshold=5)
def connect_with_retry():
    return establish_connection()
```

### Q: 如何确保线程安全？

- 使用模块提供的线程安全类
- 避免共享可变状态
- 使用锁保护共享资源

---

## 版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| 1.0.0 | 2024-01 | 初始版本 |
| 2.0.0 | 2024-06 | 重构缓存层，支持多种后端 |
| 2.7.0 | 2026-03 | 修复缓存键处理和 LRU 驱逐问题 |

---

## 贡献指南

1. Fork 项目仓库
2. 创建功能分支：`git checkout -b feature/new-feature`
3. 提交更改：`git commit -am 'Add new feature'`
4. 推送到分支：`git push origin feature/new-feature`
5. 创建 Pull Request

### 代码规范

- 遵循 PEP 8
- 使用类型注解
- 编写文档字符串
- 添加单元测试
