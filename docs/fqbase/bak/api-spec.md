# FQBase API 文档

FQBase 是 FQuant 项目的基础框架，提供缓存、配置、数据存储、日期时间工具等核心功能。

## 目录结构

```
FQBase/
├── Cache/           # 缓存层（支持 Redis/MongoDB/Memory）
├── Config/          # 配置管理（核心配置 + 业务配置）
├── Core/            # 核心服务（事件总线、日志、通知）
├── Crawler/         # 爬虫模块
├── DataStore/       # MongoDB 数据存储
├── Date/            # 日期时间工具
├── Foundation/      # 通用抽象层（设计模式、工具类）
└── Util/            # 跨模块工具
```

---

## Cache 模块

缓存层提供统一的缓存接口，支持多种后端适配器。

### 核心接口

#### CacheInterface

所有缓存适配器必须实现的接口协议。

```python
from FQBase.Cache import CacheInterface

# 方法签名
def get(self, key: str, default: Any = None) -> Any
def set(self, key: str, value: Any, ttl: Optional[int] = None) -> bool
def delete(self, key: str) -> bool
def exists(self, key: str) -> bool
def clear(self) -> bool
def ttl(self, key: str) -> int
def expire(self, key: str, ttl: int) -> bool
def get_many(self, keys: List[str]) -> Dict[str, Any]
def set_many(self, mapping: Dict[str, Any], ttl: Optional[int] = None) -> bool
def delete_many(self, keys: List[str]) -> bool
```

### 本地缓存

#### LocalCache

内存缓存实现，支持 LRU/FIFO 驱逐策略和 TTL 过期。

```python
from FQBase.Cache import LocalCache

# 创建缓存实例（单例模式）
cache = LocalCache(
    name='my_cache',      # 缓存名称
    maxsize=128,          # 最大条目数
    ttl=3600,             # 过期时间（秒），0 表示不过期
    eviction='lru',       # 驱逐策略：'lru' 或 'fifo'
    singleton=True         # 是否启用单例
)

# 基本操作
cache.get(key, default=None)              # 获取缓存
cache.set(key, value, ttl=None)           # 设置缓存
cache.delete(key)                         # 删除缓存
cache.exists(key)                         # 检查键是否存在
cache.ttl(key)                            # 获取剩余生存时间
cache.expire(key, ttl)                    # 设置过期时间
cache.clear()                            # 清空所有缓存

# 批量操作
cache.get_many(['key1', 'key2'])         # 批量获取
cache.set_many({'k1': 'v1', 'k2': 'v2'}) # 批量设置
cache.delete_many(['key1', 'key2'])       # 批量删除

# 统计信息
stats = cache.stats
# {'name': 'my_cache', 'maxsize': 128, 'ttl': 3600, 'hits': 10, 'misses': 2, 'hit_rate': '83.33%'}
```

**后台清理线程**：
```python
LocalCache.start_cleanup_thread(interval=300)  # 启动清理线程
LocalCache.stop_cleanup_thread()                 # 停止清理线程
```

### Redis 缓存适配器

#### RedisCacheAdapter

分布式缓存适配器，支持 Redis 后端。

```python
from FQBase.Cache import RedisCacheAdapter

# 创建适配器
adapter = RedisCacheAdapter(
    host='localhost',           # Redis 主机
    port=6379,                 # Redis 端口
    db=0,                      # 数据库编号
    password=None,             # 密码
    prefix='fqcache:',         # 键前缀
    pickle_first=False,        # 是否优先尝试 pickle 反序列化
    safe_mode=False            # 安全模式
)

# 基本操作（与 LocalCache 相同）
adapter.get(key, default=None)
adapter.set(key, value, ttl=None)
adapter.delete(key)
adapter.exists(key)
adapter.clear()
adapter.ttl(key)
adapter.expire(key, ttl)

# Redis 特有操作
adapter.ping()                              # 健康检查
adapter.keys(pattern='user:*')               # 获取匹配的键
adapter.hget(name, key)                      # 获取 Hash 字段
adapter.hset(name, key, value)              # 设置 Hash 字段
adapter.hmset(name, {'k1': 'v1', 'k2': 'v2'})  # 批量设置 Hash
adapter.hgetall(name)                        # 获取所有 Hash 字段
adapter.hdel(name, *keys)                     # 删除 Hash 字段
adapter.sadd(name, *values)                   # 添加 Set 成员
adapter.smembers(name)                        # 获取 Set 所有成员
adapter.lpush(name, *values)                  # 列表左侧插入
adapter.rpush(name, *values)                 # 列表右侧插入
adapter.lpop(name)                            # 列表左侧弹出
adapter.rpop(name)                            # 列表右侧弹出
```

### MongoDB 缓存适配器

#### MongoCacheAdapter

使用 MongoDB 作为缓存存储。

```python
from FQBase.Cache import MongoCacheAdapter

adapter = MongoCacheAdapter(
    host='localhost',
    port=27017,
    database='fquant_cache',
    collection='cache',
    username=None,
    password=None,
    prefix='fqcache:'
)
```

### 缓存装饰器

#### local_cache

本地缓存装饰器。

```python
from FQBase.Cache import local_cache

@local_cache(maxsize=128, ttl=300)
def expensive_function(arg1, arg2):
    # 结果会被缓存
    return compute_result(arg1, arg2)

# 清除缓存
expensive_function.cache_clear()

# 获取统计
stats = expensive_function.cache_stats()
```

#### redis_cache

Redis 缓存装饰器（支持异步函数）。

```python
from FQBase.Cache import redis_cache

@redis_cache(ttl=300, key_prefix='user_data')
def fetch_user_data(user_id):
    return api.get_user(user_id)

# 异步函数自动支持
@redis_cache(ttl=60)
async def fetch_realtime_data():
    return await api.get_data()
```

### 缓存管理器

```python
from FQBase.Cache import (
    get_cache_adapter,
    set_cache_adapter,
    invalidate_cache,
    CacheContext,
    create_cache,
    init_cache_from_env
)

# 获取/设置全局适配器
adapter = get_cache_adapter()
set_cache_adapter(RedisCacheAdapter(...))

# 使缓存失效
invalidate_cache('user:*')  # 按模式失效
invalidate_cache('*')      # 清空所有

# 上下文管理器
with CacheContext(my_adapter):
    # 在上下文中使用指定的适配器
    pass

# 从配置创建
cache = create_cache(config)           # 从配置创建
cache = init_cache_from_env()          # 从环境变量初始化
```

### 缓存配置

```python
from FQBase.Config.core.cache_config import (
    CacheConfig,
    CacheType,
    get_cache_config,
    set_cache_config
)

# 获取配置
config = get_cache_config()

# 从环境变量创建配置
config = CacheConfig.from_env()

# 手动设置配置
config = CacheConfig(
    cache_type='redis',      # memory/redis/mongo
    prefix='fqcache:',
    ttl_default=3600,
    redis_host='localhost',
    redis_port=6379,
    redis_db=0,
    redis_password=None
)
set_cache_config(config)
```

### 缓存监控

```python
from FQBase.Cache.metrics import CacheMetrics, CacheMetricsCollector

collector = CacheMetricsCollector('my_cache')
collector.record_hit()
collector.record_miss()
collector.record_eviction()
collector.record_error()

metrics = collector.metrics
# CacheMetrics(hits=10, misses=2, evictions=0, errors=0, total_calls=12)

report = collector.get_full_report()
```

---

## Config 模块

### 环境变量管理

```python
from FQBase.Config.core.env import (
    load_env,
    reload_env,
    get_env,
    get_secure_env
)

# 加载 .env 文件
load_env()

# 重新加载（用于 Celery 等长期运行进程）
reload_env()

# 获取环境变量
redis_host = get_env('REDIS_HOST', 'localhost')

# 安全获取（过滤占位符）
api_key = get_secure_env('API_KEY')
```

### 设置管理

```python
from FQBase.Config.core.setting import Setting, GLOBALMAP, SETTING

# Setting - MongoDB 配置
setting = Setting()
mongo_uri = setting.get_mongo()
config = setting.get_config('MONGODB', 'uri')

# GLOBALMAP - 路径配置
gmap = GLOBALMAP()
today = gmap.TODAY       # 当前交易日
now = gmap.NOW           # 当前时间
root_path = gmap.ROOTPATH
fqdata_path = gmap.FQDATA_PATH
setting_path = gmap.SETTING_PATH
cache_path = gmap.CACHE_PATH
log_path = gmap.LOG_PATH
download_path = gmap.DOWNLOAD_PATH
```

### 配置监听

```python
from FQBase.Config.core.config_watcher import (
    ConfigWatcher,
    ConfigWatcherManager,
    watch_config
)

# 创建监听器
def on_config_reload():
    print("配置已重新加载")

watcher = ConfigWatcher(
    config_path='/path/to/config.yaml',
    callback=on_config_reload,
    check_interval=1.0
)
watcher.start_watching()

# 使用便捷函数
watcher = watch_config('/path/to/config.yaml', on_config_reload)

# 管理器
manager = ConfigWatcherManager()
manager.register('my_config', '/path/to/config.yaml', on_config_reload)
manager.start_all()
manager.check_all()  # 检查所有配置
```

### 业务常量

```python
from FQBase.Config.business.constants import (
    ORDER_DIRECTION,
    TIME_CONDITION,
    EXCHANGE_ID,
    MARKET_TYPE,
    DATASOURCE,
    FREQUENCE,
    DATABASE_TABLE
)

# 订单方向
ORDER_DIRECTION.BUY       # 买入
ORDER_DIRECTION.SELL       # 卖出
ORDER_DIRECTION.BUY_OPEN  # 买开
ORDER_DIRECTION.BUY_CLOSE # 买平

# 交易所
EXCHANGE_ID.SSE   # 上海
EXCHANGE_ID.SZSE  # 深圳
EXCHANGE_ID.SHFE # 上海期货
EXCHANGE_ID.DCE  # 大连商品
EXCHANGE_ID.CZCE # 郑州商品
EXCHANGE_ID.CFFEX # 中金所

# 市场类型
MARKET_TYPE.STOCK_CN   # A股
MARKET_TYPE.FUTURE_CN # 期货
MARKET_TYPE.STOCK_HK   # 港股
MARKET_TYPE.STOCK_US   # 美股

# 频率
FREQUENCE.DAY     # 日线
FREQUENCE.ONE_MIN  # 1分钟
FREQUENCE.FIVE_MIN # 5分钟
```

### 数据源配置

```python
from FQBase.Config.business.datasource_config import (
    DataSourceConfig,
    get_datasource_priority,
    get_health_check_config
)

# 获取数据源优先级
priority = get_datasource_priority('stock')
# ['tdx', 'mongo']

# 健康检查配置
health_config = get_health_check_config()
# {'enabled': True, 'timeout': 5, 'startup_check': True}
```

---

## Core 模块

### 事件总线

```python
from FQBase.Core.event_bus import (
    Event,
    EventBus,
    get_event_bus,
    EventBusContext
)

# 获取事件总线（单例）
bus = get_event_bus()

# 发布事件
event = Event('order_created', data={'order_id': 12345})
bus.publish(event)

# 订阅事件
def on_order_created(event):
    print(f"订单创建: {event.data}")

bus.subscribe('order_created', on_order_created)

# 带优先级订阅（数值越大越先执行）
bus.subscribe('order_created', on_order_created_high_priority, priority=10)

# 全局订阅（接收所有事件）
bus.subscribe_global(callback)

# 异步发布
bus.publish_async(event)

# 异步等待发布
await bus.publishAwait(event)

# 获取历史
history = bus.get_history('order_created', limit=100)

# 取消订阅
bus.unsubscribe('order_created', callback)
bus.unsubscribe_by_id(subscriber_id)

# 清理失效订阅
bus.cleanup()
```

### 日志系统

```python
from FQBase.Core.logger import get_logger, FQLogger, init_logging

# 初始化日志系统
init_logging('/path/to/logging.yaml')

# 获取日志记录器
logger = get_logger('my_module')

# 记录日志
logger.debug('调试信息')
logger.info('普通信息')
logger.warning('警告信息')
logger.error('错误信息')
logger.exception('异常信息（包含堆栈）')

# 进度输出
logger.progress(current=50, total=100, job_name='下载数据', job_params='2024-01-01')
```

### 通知服务

```python
from FQBase.Core.notification import (
    NotificationManager,
    sendWechat,
    ServerChan,
    PushBear
)

# 发送企业微信消息
sendWechat('交易提醒：订单已成交', channel='DEFAULT')

# 使用通知管理器
manager = NotificationManager()
manager.send('消息内容', channel='DEFAULT')
manager.send_all('向所有渠道发送')

# Server 酱
serverchan = ServerChan('your_serverchan_key')
serverchan.send('标题', '内容')

# PushBear
pushbear = PushBear('your_send_key')
pushbear.send('标题', '内容')
```

---

## DataStore 模块

### MongoDB 操作

```python
from FQBase.DataStore import MongoDB, get_mongo_db

# 获取实例
db = get_mongo_db(database='mydb')

# 插入文档
db.insert_one('users', {'name': 'test', 'age': 25})
db.insert_many('users', [{'name': 'u1'}, {'name': 'u2'}])

# 查询文档
users = db.find('users', {'age': {'$gte': 18}})
user = db.find_one('users', {'name': 'test'})
df = db.find_as_dataframe('users', {'age': {'$gte': 18}})

# 分页查询
result = db.find_by_page('users', page=1, page_size=20)

# 更新文档
db.update_one('users', {'name': 'test'}, {'$set': {'age': 30}})
db.update_many('users', {'age': {'$lt': 18}}, {'$set': {'status': 'minor'}})

# Upsert
db.upsert('users', {'name': 'test'}, {'$set': {'age': 35}})

# 删除文档
db.delete_one('users', {'name': 'test'})
db.delete_many('users', {'status': 'inactive'})

# 检查存在
exists = db.exists('users', {'name': 'test'})

# 计数
count = db.count('users', {'age': {'$gte': 18}})
```

### 聚合操作

```python
# 聚合管道
pipeline = [
    {'$match': {'age': {'$gte': 18}}},
    {'$group': {'_id': '$city', 'count': {'$sum': 1}}},
    {'$sort': {'count': -1}}
]
result = db.aggregate('users', pipeline)

# 获取唯一值
cities = db.distinct('users', 'city')

# 分组统计
result = db.group('users', 'city', condition={'age': {'$gte': 18}})
```

### 索引管理

```python
# 创建索引
db.create_index('users', 'name', unique=True)
db.create_index('users', [('city', 1), ('age', -1)])

# 批量创建索引
db.create_indexes('users', [
    {'keys': 'email', 'unique': True},
    {'keys': [('city', 1), ('name', 1)]}
])

# 列出索引
indexes = db.list_indexes('users')

# 删除索引
db.drop_index('users', 'name_idx')

# 删除所有索引
db.drop_all_indexes('users')
```

### 集合操作

```python
# 列出所有集合
collections = db.list_collections()

# 创建集合
db.create_collection('new_collection')

# 删除集合
db.drop_collection('old_collection')

# 重命名集合
db.rename_collection('old_name', 'new_name')

# 集合统计
stats = db.collection_stats('users')
```

### 数据库操作

```python
# 执行命令
result = db.command({'ping': 1})

# 获取服务器状态
status = db.get_server_status()

# 获取数据库统计
stats = db.get_database_stats()
```

### 事务支持

```python
def transfer_funds(db):
    db.update_one('accounts', {'_id': 'A'}, {'$inc': {'balance': -100}})
    db.update_one('accounts', {'_id': 'B'}, {'$inc': {'balance': 100}})
    return True

db.with_transaction(transfer_funds, write_concern='majority')
```

### 批量操作

```python
operations = [
    {'type': 'insert_one', 'document': {'name': 'u1'}},
    {'type': 'update_one', 'query': {'name': 'u2'}, 'update': {'$set': {'age': 20}}},
    {'type': 'delete_one', 'query': {'name': 'u3'}}
]
result = db.bulk_write('users', operations)
# {'inserted_count': 1, 'modified_count': 1, 'deleted_count': 1, ...}
```

### MongoDB 客户端管理

```python
from FQBase.DataStore import MongoClientManager, get_mongo_client_manager

manager = get_mongo_client_manager(
    'mongodb://localhost:27017',
    max_pool_size=50,
    min_pool_size=10
)

# 健康检查
is_healthy = manager.ping()

# 详细健康检查
health = manager.health_check_detailed()

# 连接池统计
stats = manager.get_pool_stats()

# 重置连接
manager.reset_client()

# 关闭连接
manager.close()
```

---

## Date 模块

### 时间戳转换

```python
from FQBase.Date import (
    util_datetime_to_Unix_timestamp,
    util_timestamp_to_str,
    util_str_to_Unix_timestamp,
    util_str_to_datetime,
    util_date_stamp,
    util_time_stamp,
    util_tdxtimestamp
)

# datetime 转 Unix 时间戳
ts = util_datetime_to_Unix_timestamp(datetime.now())

# 时间戳转字符串
time_str = util_timestamp_to_str(1234567890)

# 字符串转 Unix 时间戳
ts = util_str_to_Unix_timestamp('2024-01-01 09:30:00')

# 字符串转 datetime
dt = util_str_to_datetime('2024-01-01 09:30:00')

# 日期转时间戳
ds = util_date_stamp('2024-01-01')

# 时间戳转 datetime
dt = util_stamp2datetime(1704067200)
```

### 交易日判断

```python
from FQBase.Date import (
    util_if_trade,
    util_get_next_trade_date,
    util_get_pre_trade_date,
    util_get_real_date,
    util_if_tradetime
)

# 判断是否为交易日
is_trade = util_if_trade('2024-01-01')

# 获取后 n 个交易日
next_trade = util_get_next_trade_date('2024-01-01', n=5)

# 获取前 n 个交易日
pre_trade = util_get_pre_trade_date('2024-01-01', n=5)

# 获取最近的交易日（使用二分查找）
real_date = util_get_real_date('2024-01-03', towards=-1)  # 往左找
real_date = util_get_real_date('2024-01-03', towards=1)   # 往右找

# 判断是否在交易时间内
is_trade_time = util_if_tradetime(datetime.now(), market='stock_cn')
```

### 日期偏移

```python
from FQBase.Date import (
    util_date_gap,
    util_get_next_day,
    util_get_last_day,
    util_get_trade_gap
)

# 交易日偏移
next_day = util_date_gap('2024-01-01', 5, 'gt')   # 后5个交易日
pre_day = util_date_gap('2024-01-01', 5, 'lt')   # 前5个交易日

# 获取后 n 天
next_day = util_get_next_day('2024-01-01', n=5)

# 获取前 n 天
last_day = util_get_last_day('2024-01-01', n=5)

# 交易日间隔
gap = util_get_trade_gap('2024-01-01', '2024-01-10')
```

### 月度/季度处理

```python
from FQBase.Date import (
    util_getBetweenMonth,
    util_add_months,
    util_get_1st_of_next_month,
    util_getBetweenQuarter
)

# 获取月份区间
monthly_data = util_getBetweenMonth('2024-01-01', '2024-06-30')
# {'2024-01': ['2024-01-01', '2024-01-31'], '2024-02': [...]}

# 日期偏移月
new_date = util_add_months('2024-01-15', 3)  # 2024-04-15

# 获取下个月第一天
first_day = util_get_1st_of_next_month(datetime(2024, 1, 15))

# 获取季度区间
quarterly_data = util_getBetweenQuarter('2024-01-01', '2024-06-30')
# {'2024Q1': ['2024-01-01', '2024-03-31'], '2024Q2': [...]}
```

### 时间处理

```python
from FQBase.Date import (
    util_select_hours,
    util_select_min,
    util_time_delay,
    util_calc_time
)

# 判断小时/分钟
is_morning = util_select_hours('2024-01-01 10:30:00', 9, 12)
is_afternoon = util_select_min('2024-01-01 14:30:00', 0, 30)

# 时间延迟
delayed = util_time_delay('2024-01-01 10:00:00', 3600)  # 加1小时

# 计算时间差
diff_seconds = util_calc_time('2024-01-01 10:00:00', '2024-01-01 09:00:00')
```

---

## Foundation 模块

### 单例模式

```python
from FQBase.Foundation import singleton, SingletonMeta

@singleton
class MyService:
    def __init__(self):
        self.value = 0

# 获取实例
instance1 = MyService()
instance2 = MyService()
assert instance1 is instance2  # True

# 重置单例（用于测试）
MyService.reset_singleton()

# 检查是否已有实例
has_instance = MyService.has_instance()

# 获取当前实例（不创建）
instance = MyService.get_instance()
```

### 重试机制

```python
from FQBase.Foundation.retry import (
    retry,
    retry_with_exponential_backoff,
    RetryContext,
    create_retry_context
)

# 基本重试
@retry(stop_max_attempt_number=3, wait_random_min=50, wait_random_max=100)
def fetch_data():
    return api.get()

# 指数退避
@retry_with_exponential_backoff(
    max_attempts=5,
    base_wait=100,
    max_wait=5000,
    max_total_time=30.0
)
def fetch_data():
    return api.get()

# 只重试特定异常
@retry(retry_on_exception=(ConnectionError, TimeoutError))
def fetch_data():
    return api.get()

# 重试回调
def on_retry(attempt, exception):
    logger.warning(f"尝试 {attempt} 失败: {exception}")

@retry(on_retry=on_retry)
def fetch_data():
    return api.get()

# 手动创建重试上下文
ctx = create_retry_context(
    func=fetch_data,
    max_attempts=5,
    on_retry=lambda a, e: logger.warning(f"Attempt {a} failed")
)
result = ctx.execute()
```

### 熔断器

```python
from FQBase.Foundation.circuit_breaker import (
    CircuitBreaker,
    CircuitBreakerOpenException,
    circuit_breaker,
    CircuitBreakerManager
)

# 创建熔断器
breaker = CircuitBreaker(
    name='user_api',
    failure_threshold=5,      # 连续失败次数阈值
    success_threshold=2,     # 半开状态成功次数
    recovery_timeout=60.0     # 恢复超时（秒）
)

# 使用熔断器
try:
    result = breaker.call(remote_api.call)
except CircuitBreakerOpenException:
    print("服务暂时不可用")

# 上下文管理器
with CircuitBreaker(name='api') as breaker:
    result = some_function()

# 装饰器
@circuit_breaker(name='user_service', failure_threshold=3)
def call_user_service(user_id):
    return api.get_user(user_id)

# 获取熔断器管理器
manager = CircuitBreakerManager()
manager.register('api', failure_threshold=5)
breaker = manager.get('api')
status = manager.get_all_status()
```

### 异常处理

```python
from FQBase.Foundation.exceptions import (
    FQException,
    DataSourceException,
    DataFetchException,
    StrategyException,
    ConfigException,
    handle_exception,
    safe_execute
)

# 抛出异常
raise FQException(
    message='错误信息',
    code='ERR001',
    details={'key': 'value'}
)

# 异常处理装饰器
@handle_exception
def my_function():
    pass

# 安全执行装饰器
@safe_execute(default_return=[])
def my_function():
    return []
```

### 验证器

```python
from FQBase.Foundation.validators import (
    validate_code,
    validate_date,
    validate_market,
    validate_frequency,
    Validator,
    ValidationError
)

# 验证股票代码
is_valid = validate_code('600000')  # True

# 验证日期
is_valid = validate_date('2024-01-01')

# 验证市场
is_valid = validate_market('SH')

# 验证频率
is_valid = validate_frequency('1min')

# 使用验证器类
validator = Validator()
validator.validate('value', {
    'required': True,
    'type': str,
    'min': 0,
    'max': 100,
    'pattern': r'^[A-Z]+$',
    'choices': ['A', 'B', 'C']
})

if validator.has_errors():
    errors = validator.get_errors()
```

### 依赖注入容器

```python
from FQBase.Foundation.container import (
    ServiceContainer,
    ServiceLocator,
    ServiceLifetime,
    CircularDependencyException
)

# 创建容器
container = ServiceContainer()

# 注册单例
container.register_singleton(CacheInterface, RedisCacheAdapter)

# 注册瞬态（每次创建新实例）
container.register_transient(LoggerInterface, FQLogger)

# 注册工厂
container.register_factory(DatabaseInterface, lambda: create_db())

# 注册现有实例
container.register_instance(CacheInterface, existing_cache)

# 获取服务
cache = container.get(CacheInterface)

# 尝试获取（不抛出异常）
cache = container.try_get(CacheInterface)

# 检查注册
is_registered = container.is_registered(CacheInterface)

# 注销服务
container.unregister(CacheInterface)

# 使用服务定位器（全局访问）
ServiceLocator.set_container(container)
cache = ServiceLocator.get(CacheInterface)

# 获取依赖图
graph = container.get_dependency_graph()
```

### 嵌套字典访问

```python
from FQBase.Foundation import dotty, Dotty

d = dotty({'user': {'profile': {'name': '张三', 'age': 30}}})

# 点号访问
name = d['user.profile.name']

# 设置值
d['user.profile.age'] = 31

# 属性访问
name = d.user.profile.name

# 存在检查
has_name = 'user.profile.name' in d

# 获取默认值
value = d.get('user.profile.name', 'default')

# 复制
d_copy = d.copy()

# 转 JSON
json_str = d.to_json()
```

### 随机数生成

```python
from FQBase.Foundation.crypto import (
    random_stock_code,
    random_string,
    random_with_topic
)

# 生成随机股票代码
codes = random_stock_code(10, markets=['SH', 'SZ'])

# 生成随机字符串
s = random_string('Acc', length=8)  # 'Acc_K3mX9pL2'

# 生成带主题的随机值
s = random_with_topic('Order')  # 'Order_xY7kM3nQ'
```

### 生命周期管理

```python
from FQBase.Foundation.lifecycle import (
    ServiceStatus,
    HealthCheckable,
    Initializable,
    Shutdownable,
    HealthStatus,
    CompositeHealthCheck
)

# 健康状态
status = HealthStatus(
    status=ServiceStatus.RUNNING,
    message='服务正常',
    details={'connections': 10}
)

# 组合健康检查
checker = CompositeHealthCheck()
checker.register('cache', cache_service)
checker.register('database', db_service)

all_status = checker.check_all()
is_healthy = checker.is_all_healthy

# 单个检查
status = checker.check('cache')
```

---

## Util 模块

### 编码转换

```python
from FQBase.Util import (
    code_to_6digit,
    code_to_jqformat,
    code_adjust_ctp,
    code_to_list
)

# 转换为6位代码
code = code_to_6digit(600000)        # '600000'
code = code_to_6digit('600000.XSHG')  # '600000'

# 转换为聚宽格式
jq_code = code_to_jqformat('600000')  # '600000.XSHG'

# CTP/通达信格式转换
ctp_code = code_adjust_ctp('IF2401', source='tdx')  # 转换为 CTP 格式
tdx_code = code_adjust_ctp('IF2401', source='ctp')  # 转换为通达信格式

# 转换为列表
codes = code_to_list(['600000', '000001'])
```

### 文件操作

```python
from FQBase.Util import (
    file_md5,
    file_sha256,
    file_size,
    file_exists,
    dir_exists,
    ensure_dir
)

# 获取文件哈希
md5 = file_md5('/path/to/file')
sha256 = file_sha256('/path/to/file')

# 获取文件大小
size = file_size('/path/to/file')

# 检查存在
exists = file_exists('/path/to/file')
is_dir = dir_exists('/path/to/dir')

# 确保目录存在
success = ensure_dir('/path/to/dir')
```

### 网络工具

```python
from FQBase.Util import web_ping, check_url_accessible

# Ping URL 获取延迟
latency = web_ping('example.com', count=3)

# 检查 URL 是否可访问
accessible = check_url_accessible('https://api.example.com')
```

### 并行计算

```python
from FQBase.Util import ParallelProcess, ParallelThread

# 多进程
process = ParallelProcess(max_workers=4)
results = process.map(worker_function, data_list)

# 多线程
thread = ParallelThread(max_workers=8)
results = thread.map(worker_function, data_list)

# 获取统计
stats = process.get_stats()
# {'submitted': 100, 'completed': 100, 'failed': 0, 'pending': 0}

# 健康检查
is_healthy = thread.health_check()
```

### 时间索引

```python
from FQBase.Util import (
    util_make_min_index,
    util_make_hour_index,
    util_make_future_min_index,
    util_time_gap
)

# 股票分钟线索引
index = util_make_min_index('2024-01-01', '5min')

# 股票小时线索引
index = util_make_hour_index('2024-01-01', '1h')

# 期货分钟线索引
index = util_make_future_min_index('2024-01-01', '1min')

# 时间间隙计算
next_time = util_time_gap('2024-01-01 09:35:00', 5, '>', '5min')
```

### 数据转换

```python
from FQBase.Util import (
    date_to_str,
    str_to_date,
    normalize_code,
    parse_number,
    safe_divide,
    percentage_change,
    format_percentage
)

# 日期转换
date_str = date_to_str(datetime.now())
dt = str_to_date('2024-01-01')

# 标准化代码
code = normalize_code('  600000  ')  # '600000'

# 安全计算
result = safe_divide(10, 0, default=0)       # 0
result = percentage_change(110, 100)          # 10.0
formatted = format_percentage(0.1)           # '10.00%'
```

### 格式转换

```python
from FQBase.Util import (
    dict_to_df,
    df_to_dict,
    to_json_from_pandas,
    to_pandas_from_json,
    to_list_from_pandas,
    to_numpy_from_list,
    resample_ohlc,
    fill_missing_dates
)

# DataFrame <-> Dict
df = dict_to_df([{'a': 1}, {'a': 2}])
dicts = df_to_dict(df)

# JSON 转换
json_data = to_json_from_pandas(df)
df = to_pandas_from_json(json_data)

# 列表转换
data_list = to_list_from_pandas(df)
arr = to_numpy_from_list([1, 2, 3])

# OHLC 重采样
resampled = resample_ohlc(df, '5T')  # 转换为5分钟线

# 填充缺失日期
filled_df = fill_missing_dates(df, '2024-01-01', '2024-01-31')
```

---

## 导入汇总

### 主要导入路径

```python
# 缓存
from FQBase.Cache import (
    LocalCache, RedisCacheAdapter, MongoCacheAdapter,
    local_cache, redis_cache, get_cache_adapter, create_cache
)

# 配置
from FQBase.Config import (
    get_env, Setting, GLOBALMAP, CacheConfig,
    MARKET_TYPE, EXCHANGE_ID, FREQUENCE, ORDER_DIRECTION
)

# 核心
from FQBase.Core import (
    EventBus, get_event_bus, Event,
    get_logger, NotificationManager,
    sendWechat, sendMessage2ServerChan
)

# 数据存储
from FQBase.DataStore import MongoDB, get_mongo_db

# 日期
from FQBase.Date import (
    util_if_trade, util_get_next_trade_date,
    util_datetime_to_Unix_timestamp, util_timestamp_to_str
)

# 基础
from FQBase.Foundation import (
    singleton, retry, CircuitBreaker,
    validate_code, dotty, ServiceContainer
)

# 工具
from FQBase.Util import (
    code_to_6digit, file_md5, web_ping,
    ParallelProcess, dict_to_df
)
```
