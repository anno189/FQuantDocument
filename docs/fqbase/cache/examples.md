# Cache 模块应用示例

## 示例 1：本地缓存加速计算

使用 `@local_cache` 装饰器缓存耗时计算结果：

```python
from FQBase.Cache import local_cache
import time

@local_cache(maxsize=1000, ttl=3600)
def calculate_indicator(symbol: str, date: str):
    """
    计算技术指标（带缓存）
    首次调用后，结果会被缓存1小时
    """
    time.sleep(1)  # 模拟耗时计算
    return {
        'symbol': symbol,
        'date': date,
        'ma5': 12.5,
        'ma10': 12.3,
        'ma20': 12.1
    }

# 首次调用（耗时约1秒）
start = time.time()
result1 = calculate_indicator('600000', '2024-01-01')
print(f"首次调用: {time.time() - start:.2f}s")

# 后续调用（从缓存返回）
start = time.time()
result2 = calculate_indicator('600000', '2024-01-01')
print(f"缓存命中: {time.time() - start:.4f}s")

# 查看统计
print(calculate_indicator.cache_stats)

# 清空缓存
calculate_indicator.cache_clear()
```

---

## 示例 2：多级缓存架构

实现 L1（本地）+ L2（Redis）的多级缓存：

```python
from FQBase.Cache import LocalCache, RedisCacheAdapter

class MultiLevelCache:
    """多级缓存：本地(L1) + Redis(L2)"""

    def __init__(self):
        self.l1 = LocalCache(name='l1', maxsize=1000, ttl=60)
        self.l2 = RedisCacheAdapter(host='localhost', port=6379, prefix='cache:')

    def get(self, key: str):
        # L1 查询
        value = self.l1.get(key)
        if value is not None:
            return value

        # L2 查询
        value = self.l2.get(key)
        if value is not None:
            # 回填 L1
            self.l1.set(key, value, ttl=30)
            return value

        return None

    def set(self, key: str, value, ttl: int = 3600):
        # 同时写入两级缓存
        self.l1.set(key, value, ttl=min(60, ttl))
        self.l2.set(key, value, ttl=ttl)

    def delete(self, key: str):
        self.l1.delete(key)
        self.l2.delete(key)

    def clear(self):
        self.l1.clear()
        self.l2.clear()

# 使用
cache = MultiLevelCache()

# 缓存股票数据
cache.set('stock:600000', {
    'price': 12.50,
    'volume': 1000000,
    'change': 2.5
}, ttl=300)

# 获取（先查L1，再查L2）
data = cache.get('stock:600000')
print(f"价格: {data['price']}")
```

---

## 示例 3：Redis 分布式会话缓存

使用 Redis 缓存实现分布式会话：

```python
from FQBase.Cache import RedisCacheAdapter

# 创建 Redis 会话缓存
session_cache = RedisCacheAdapter(
    host='localhost',
    port=6379,
    prefix='session:',
    ttl=7200  # 2小时过期
)

# 存储会话数据
def create_session(user_id: int):
    session_id = f"session_{user_id}_{int(time.time())}"
    session_cache.set(session_id, {
        'user_id': user_id,
        'login_time': datetime.now().isoformat(),
        'permissions': ['read', 'write']
    }, ttl=7200)
    return session_id

# 获取会话
def get_session(session_id: str):
    session = session_cache.get(session_id)
    if session is None:
        raise ValueError("Session expired or not found")

    # 延长过期时间
    session_cache.expire(session_id, 7200)
    return session

# 删除会话（登出）
def destroy_session(session_id: str):
    session_cache.delete(session_id)
```

---

## 示例 4：股票行情数据缓存

```python
from FQBase.Cache import RedisCacheAdapter
import pandas as pd

# 创建行情缓存
quote_cache = RedisCacheAdapter(
    host='localhost',
    port=6379,
    prefix='quote:',
    ttl=60  # 1分钟有效期
)

def cache_realtime_quote(symbol: str, quote_data: dict):
    """缓存实时行情"""
    quote_cache.set(f"realtime:{symbol}", quote_data, ttl=60)

def get_cached_quote(symbol: str):
    """获取缓存的实时行情"""
    return quote_cache.get(f"realtime:{symbol}")

def cache_daily_bars(symbol: str, bars: pd.DataFrame):
    """缓存日线数据"""
    quote_cache.set(f"daily:{symbol}", bars.to_dict(), ttl=3600)

def get_cached_daily_bars(symbol: str) -> pd.DataFrame:
    """获取缓存的日线数据"""
    data = quote_cache.get(f"daily:{symbol}")
    if data:
        return pd.DataFrame(data)
    return None

# 使用
cache_realtime_quote('600000', {
    'price': 12.50,
    'volume': 1000000,
    'change': 2.5
})

quote = get_cached_quote('600000')
print(f"当前价格: {quote['price']}")
```

---

## 示例 5：缓存装饰器的高级用法

### 动态 TTL

```python
from FQBase.Cache import redis_cache, init_cache_adapter

# 初始化全局缓存适配器（从 .env 读取 CACHE_TYPE）
init_cache_adapter()

def get_ttl_by_data_type(data_type: str, *args, **kwargs) -> int:
    """根据数据类型返回不同的 TTL"""
    ttl_map = {
        'realtime': 10,      # 实时数据 10 秒
        'minute': 60,         # 分钟数据 1 分钟
        'daily': 3600,        # 日线数据 1 小时
        'historical': 86400   # 历史数据 1 天
    }
    return ttl_map.get(data_type, 60)

@redis_cache(ttl=60, key_ttl_func=get_ttl_by_data_type)
def get_market_data(data_type: str, symbol: str):
    """根据数据类型自动设置不同 TTL"""
    return fetch_from_api(data_type, symbol)

# 调用 - 自动使用对应 TTL
get_market_data('realtime', '600000')      # TTL = 10s
get_market_data('daily', '600000')         # TTL = 3600s
```

### 自定义缓存键

```python
@redis_cache(ttl=3600, key_prefix='stock')
def get_stock_info(symbol: str, exchange: str = 'SH'):
    """
    缓存股票信息
    key = 'stock:<hash(symbol, exchange)>'
    """
    return fetch_stock_info(symbol, exchange)

# 调用
get_stock_info('600000', exchange='SH')
get_stock_info('000001', exchange='SZ')
```

---

## 示例 6：Hash 结构存储用户数据

```python
from FQBase.Cache import RedisCacheAdapter

redis = RedisCacheAdapter(host='localhost', port=6379, prefix='user:')

# 存储用户信息
def save_user_profile(user_id: int, profile: dict):
    """使用 Hash 存储用户资料"""
    redis.hmset(f"profile:{user_id}", profile)

def get_user_profile(user_id: int) -> dict:
    """获取用户资料"""
    return redis.hgetall(f"profile:{user_id}")

def update_user_field(user_id: int, field: str, value):
    """更新用户字段"""
    redis.hset(f"profile:{user_id}", field, value)

def increment_user_metric(user_id: int, metric: str, delta: int = 1):
    """递增用户指标"""
    key = f"metrics:{user_id}"
    if not redis.exists(key):
        redis.hset(key, metric, 0)
    redis.hincrby(key, metric, delta)

# 使用
save_user_profile(12345, {
    'name': '张三',
    'age': 30,
    'city': '北京',
    'balance': 10000.0
})

profile = get_user_profile(12345)
print(f"用户: {profile['name']}, 余额: {profile['balance']}")

update_user_field(12345, 'age', 31)
increment_user_metric(12345, 'login_count')
```

---

## 示例 7：List 结构实现任务队列

```python
from FQBase.Cache import RedisCacheAdapter

redis = RedisCacheAdapter(host='localhost', port=6379, prefix='queue:')

class TaskQueue:
    """基于 Redis List 的任务队列"""

    def enqueue(self, task_type: str, task_data: dict):
        """入队"""
        import json
        task = json.dumps({'type': task_type, 'data': task_data})
        redis.lpush(f"tasks:{task_type}", task)

    def dequeue(self, task_type: str, timeout: int = 0):
        """出队"""
        import json
        if timeout > 0:
            result = redis.brpop(f"tasks:{task_type}", timeout)
            if result:
                return json.loads(result)
        else:
            result = redis.rpop(f"tasks:{task_type}")
            if result:
                return json.loads(result)
        return None

    def get_queue_length(self, task_type: str) -> int:
        """获取队列长度"""
        import redis
        client = redis.Redis()
        return client.llen(f"tasks:{task_type}")

# 使用
queue = TaskQueue()

# 添加任务
queue.enqueue('download', {'symbol': '600000', 'date': '2024-01-01'})
queue.enqueue('process', {'symbol': '600000', 'indicators': ['MA5', 'MA10']})

# 获取任务
task = queue.dequeue('download')
print(f"处理任务: {task}")
```

---

## 示例 8：Set 结构实现标签系统

```python
from FQBase.Cache import RedisCacheAdapter

redis = RedisCacheAdapter(host='localhost', port=6379, prefix='tag:')

def add_tags(object_type: str, object_id: str, *tags):
    """为对象添加标签"""
    key = f"{object_type}:{object_id}"
    redis.sadd(key, *tags)

def remove_tags(object_type: str, object_id: str, *tags):
    """移除标签"""
    key = f"{object_type}:{object_id}"
    redis.srem(key, *tags)

def get_tags(object_type: str, object_id: str):
    """获取对象的所有标签"""
    key = f"{object_type}:{object_id}"
    return redis.smembers(key)

def has_tag(object_type: str, object_id: str, tag: str) -> bool:
    """检查是否有特定标签"""
    key = f"{object_type}:{object_id}"
    return redis.sismember(key, tag)

def find_objects_by_tag(object_type: str, tag: str, all_object_ids: list):
    """根据标签查找对象"""
    result = []
    for object_id in all_object_ids:
        if has_tag(object_type, object_id, tag):
            result.append(object_id)
    return result

# 使用
add_tags('article', '101', 'python', 'redis', 'cache')
add_tags('article', '102', 'python', 'mongodb')
add_tags('article', '103', 'java', 'redis')

print(get_tags('article', '101'))  # {'python', 'redis', 'cache'}
print(has_tag('article', '101', 'python'))  # True

# 查找同时有 python 和 redis 标签的文章
python_articles = find_objects_by_tag('article', 'python', ['101', '102', '103'])
redis_articles = find_objects_by_tag('article', 'redis', ['101', '102', '103'])
common = set(python_articles) & set(redis_articles)
print(f"Python + Redis 文章: {common}")  # {'101', '102'}
```

---

## 示例 9：缓存监控

```python
from FQBase.Cache import LocalCache, RedisCacheAdapter
from FQBase.Cache.metrics import CacheMetricsCollector

# 创建本地缓存
cache = LocalCache(name='monitored_cache', ttl=3600)

# 创建监控收集器
collector = CacheMetricsCollector('my_app_cache')

# 记录操作
for i in range(100):
    if cache.get(f'key_{i % 10}'):
        collector.record_hit()
    else:
        cache.set(f'key_{i % 10}', f'value_{i}')
        collector.record_miss()

# 获取监控报告
report = collector.get_full_report()
print(f"命中率: {report['metrics']['hit_rate']}")
print(f"总请求: {report['metrics']['total_requests']}")

# Redis 缓存健康检查
redis = RedisCacheAdapter(host='localhost', port=6379)

def check_cache_health():
    """检查缓存健康状态"""
    checks = {
        'redis': redis.ping(),
    }

    all_healthy = all(checks.values())
    if not all_healthy:
        print("警告: 部分缓存节点不可用")
        for name, status in checks.items():
            if not status:
                print(f"  - {name}: 离线")
    return all_healthy

check_cache_health()
```

---

## 示例 10：全局缓存上下文

```python
from FQBase.Cache import (
    CacheContext,
    get_cache_adapter,
    set_cache_adapter,
    init_cache_adapter,
    RedisCacheAdapter,
    LocalCache,
)

# 初始化全局缓存适配器（从 .env 读取配置）
init_cache_adapter()

def process_with_local_cache():
    """在特定代码块中使用本地缓存"""
    # 使用上下文管理器临时切换到独立 LocalCache
    with CacheContext(LocalCache(name='temp')):
        adapter = get_cache_adapter()
        adapter.set('temp_key', 'temp_value')
        print(f"获取: {adapter.get('temp_key')}")

    # 离开上下文后，恢复为初始化时的适配器
    adapter = get_cache_adapter()
    print(f"恢复: {adapter.get('temp_key')}")  # None (临时缓存中)

# 使用
process_with_local_cache()
```

---

## 相关文档

- [Cache API](./api.md)
- [Cache 开发指南](./development.md)
- [Cache Prefix 使用场景](./Cache_Prefix_使用场景.md)
