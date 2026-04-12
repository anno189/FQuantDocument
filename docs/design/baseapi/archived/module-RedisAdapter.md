# RedisAdapter - Redis 缓存适配器

> 版本: v1.0
> 更新时间: 2026-03-25

---

## 一、概述

`RedisAdapter` 是 FQuant 系统中的 Redis 缓存适配器，继承自 `CacheAdapter` 接口。

### 核心特性

- **自动序列化/反序列化**：支持任意 Python 数据类型
- **pandas 支持**：原生存储和读取 DataFrame/Series
- **numpy 支持**：优化序列化（struct 头部 + 二进制数据）
- **连接池管理**：基于 `lru_cache` 的单例客户端
- **完善的 Hash/Set/List 操作**

---

## 二、初始化

### 2.1 基本初始化

```python
from FQBase.FQDataStore import RedisAdapter

redis = RedisAdapter(
    host="localhost",
    port=6379,
    db=0,
    password=None,
    name="redis",
    pickle_first=False
)
```

### 2.2 参数说明

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `host` | str | "localhost" | Redis 服务器地址 |
| `port` | int | 6379 | Redis 服务器端口 |
| `db` | int | 0 | 数据库编号 |
| `password` | str | None | 密码（无密码为 None） |
| `name` | str | "redis" | 适配器名称 |
| `pickle_first` | bool | False | 反序列化时是否优先尝试 pickle |

---

## 三、数据类型支持

### 3.1 序列化策略

| 数据类型 | 存储方式 | 说明 |
|----------|----------|------|
| `str` | 直接存储 | UTF-8 编码 |
| `int/float/bool` | pickle | 二进制序列化（保持类型） |
| `list/tuple` | pickle | 二进制序列化 |
| `dict` | pickle | 二进制序列化 |
| `set` | pickle | 二进制序列化 |
| `pandas.DataFrame` | pickle | 二进制序列化 |
| `pandas.Series` | pickle | 二进制序列化 |
| `numpy.ndarray` | struct + bytes | 优化格式，1-3维 |

### 3.2 numpy 序列化格式

```
+----------------- 16 bytes ----------------+
|  dtype (4 bytes)  |  d1 (4 bytes)        |
|  d2 (4 bytes)     |  d3 (4 bytes)        |
+-----------------------------------------+
|              二进制数据                  |
+-----------------------------------------+
```

### 3.3 反序列化策略

```
pickle_first=False (默认):
    1. 尝试 UTF-8 解码
    2. 失败 → 尝试 pickle 反序列化
    3. 失败 → 返回原始 bytes

pickle_first=True:
    1. 尝试 pickle 反序列化
    2. 失败 → 尝试 UTF-8 解码
    3. 失败 → 返回原始 bytes
```

---

## 四、基础操作

### 4.1 String 操作

```python
# 设置值（自动序列化）
redis.set("key1", "hello")
redis.set("key2", 123)
redis.set("key3", 12.5)
redis.set("key4", {"a": 1, "b": 2})
redis.set("key5", [1, 2, 3, 4, 5])

# 设置值并指定 TTL（秒）
redis.set("temp_key", "value", ttl=300)

# 获取值（自动反序列化）
value = redis.get("key1")  # "hello"
value = redis.get("key2")  # "123" (字符串)

# 获取值，强制 pickle 反序列化
value = redis.get("key4", pickle_first=True)  # {"a": 1, "b": 2}
```

### 4.2 批量操作

```python
# 批量设置
redis.mset({
    "stock:000001:close": 10.5,
    "stock:000001:volume": 1000000,
    "stock:000002:close": 20.3,
    "stock:000002:volume": 2000000
})

# 批量设置并指定 TTL
redis.mset({"key1": "v1", "key2": "v2"}, ttl=3600)

# 批量获取
values = redis.mget("stock:000001:close", "stock:000001:volume", "stock:000002:close")
# ["10.5", "1000000", "20.3"]
```

### 4.3 删除和检查

```python
# 删除键
redis.delete("key1")

# 检查键是否存在
exists = redis.exists("key1")  # True/False

# 清空当前数据库
redis.clear()

# 获取所有键
keys = redis.keys("stock:*")  # 返回匹配的所有键
```

---

## 五、Hash 操作

### 5.1 基本 Hash 操作

```python
# 设置单个字段
redis.hset("stock:000001", "close", 10.5)
redis.hset("stock:000001", "open", 10.0)
redis.hset("stock:000001", "volume", 1000000)

# 获取单个字段
close = redis.hget("stock:000001", "close")  # "10.5"

# 批量设置
redis.hmset("stock:000001", {
    "close": 10.5,
    "open": 10.0,
    "high": 11.0,
    "low": 9.8,
    "volume": 1000000
})

# 批量获取
values = redis.hmget("stock:000001", "close", "open", "high", "low")
# ["10.5", "10.0", "11.0", "9.8"]

# 获取所有字段
all_data = redis.hgetall("stock:000001")
# {"close": "10.5", "open": "10.0", "high": "11.0", "low": "9.8", "volume": "1000000"}

# 获取所有值
values = redis.hvals("stock:000001")
# ["10.5", "10.0", "11.0", "9.8", "1000000"]
```

---

## 六、pandas 和 numpy 支持

### 6.1 pandas DataFrame

```python
import pandas as pd

# 存储 DataFrame
df = pd.DataFrame({
    'date': ['2024-01-01', '2024-01-02', '2024-01-03'],
    'close': [10.5, 10.8, 11.0],
    'volume': [1000000, 1200000, 1500000]
})
redis.set("stock:000001:daily", df, ttl=86400)

# 读取 DataFrame（自动还原类型）
retrieved_df = redis.get("stock:000001:daily")
print(type(retrieved_df))  # <class 'pandas.core.frame.DataFrame'>

# Hash 中存储 DataFrame
redis.hset("stock:000001", "history", df)
retrieved_df = redis.hget("stock:000001", "history")
# 类型: pandas.core.frame.DataFrame
```

### 6.2 pandas Series

```python
import pandas as pd

# 存储 Series
series = pd.Series([10.5, 10.8, 11.0], index=['2024-01-01', '2024-01-02', '2024-01-03'])
redis.set("stock:000001:close_series", series)

# 读取 Series
retrieved_series = redis.get("stock:000001:close_series")
print(type(retrieved_series))  # <class 'pandas.core.series.Series'>
```

### 6.3 numpy ndarray

```python
import numpy as np

# 存储 1D 数组
arr_1d = np.array([1, 2, 3, 4, 5])
redis.set("arr:1d", arr_1d)

# 存储 2D 数组
arr_2d = np.array([[1, 2, 3], [4, 5, 6]])
redis.set("arr:2d", arr_2d)

# 存储 3D 数组
arr_3d = np.random.rand(10, 5, 3)
redis.set("arr:3d", arr_3d)

# 读取数组（自动还原类型）
retrieved_1d = redis.get("arr:1d")
retrieved_2d = redis.get("arr:2d")
retrieved_3d = redis.get("arr:3d")
print(type(retrieved_1d))  # <class 'numpy.ndarray'>
print(retrieved_2d.shape)   # (2, 3)
print(retrieved_3d.shape)   # (10, 5, 3)
```

### 6.4 批量存储 DataFrame

```python
# 批量存储多个 DataFrame
dfs = {
    "stock:000001:daily": df1,
    "stock:000002:daily": df2,
    "stock:000003:daily": df3
}
redis.mset(dfs, ttl=86400)
```

---

## 七、Set 操作

```python
# 添加元素
redis.sadd("user:1:tags", "python", "redis", "quant")

# 获取所有元素
tags = redis.smembers("user:1:tags")
# {"python", "redis", "quant"}

# 获取所有元素（强制 pickle）
tags = redis.smembers("user:1:tags", pickle_first=True)
```

---

## 八、List 操作

```python
# 左插入
redis.lpush("queue:tasks", "task1", "task2", "task3")

# 右插入
redis.rpush("queue:tasks", "task4", "task5")

# 获取范围
tasks = redis.lrange("queue:tasks", 0, -1)  # 获取所有
# ["task3", "task2", "task1", "task4", "task5"]

# 获取范围
tasks = redis.lrange("queue:tasks", 0, 2)  # 获取前3个
# ["task3", "task2", "task1"]
```

---

## 九、健康检查

```python
# 检查连接状态
is_healthy = redis.health_check()
print(f"Redis 健康状态: {is_healthy}")  # True/False
```

---

## 十、使用示例

### 10.1 完整示例：股票数据缓存

```python
from FQBase.FQDataStore import RedisAdapter
import pandas as pd

redis = RedisAdapter(host="localhost", port=6379)

def get_stock_data(code: str):
    """获取股票数据，带缓存"""
    cache_key = f"stock:{code}:daily"

    # 尝试从缓存获取
    cached = redis.get(cache_key)
    if cached is not None:
        print(f"从缓存读取: {code}")
        return cached

    # 模拟数据获取
    df = pd.DataFrame({
        'date': ['2024-01-01', '2024-01-02'],
        'close': [10.5, 10.8]
    })

    # 存入缓存，24小时过期
    redis.set(cache_key, df, ttl=86400)
    print(f"从数据源读取: {code}")
    return df

# 使用
data = get_stock_data("000001")  # 从数据源读取
data = get_stock_data("000001")  # 从缓存读取
```

### 10.2 完整示例：实时行情 Hash

```python
# 存储实时行情
redis.hmset("realtime:000001", {
    "code": "000001",
    "name": "平安银行",
    "close": 10.85,
    "change_pct": 1.12,
    "volume": 35000000,
    "update_time": "2024-01-02 15:00:00"
})

# 批量获取多个股票的实时行情
codes = ["000001", "000002", "600000"]
for code in codes:
    data = redis.hgetall(f"realtime:{code}")
    if data:
        print(f"{code}: {data}")
```

### 10.3 Celery 中的使用

```python
from FQDataStore.redis_adapter import RedisAdapter
from FQCore.env import get_env

# Celery 任务
@app.task
def cache_market_data(code: str, data: pd.DataFrame):
    redis = RedisAdapter(
        host=get_env('REDIS_HOST', 'localhost'),
        port=int(get_env('REDIS_PORT', 6379)),
        db=5
    )
    redis.set(f'market:{code}', data, ttl=300)
```

---

## 十一、方法列表

### 基础方法

| 方法 | 说明 | 返回值 |
|------|------|--------|
| `set(key, value, ttl)` | 设置值 | bool |
| `get(key, pickle_first)` | 获取值 | Any |
| `mset(mapping, ttl)` | 批量设置 | bool |
| `mget(*keys, pickle_first)` | 批量获取 | List[Any] |
| `delete(key)` | 删除键 | bool |
| `exists(key)` | 检查键存在 | bool |
| `keys(pattern)` | 获取匹配键 | List[str] |
| `clear()` | 清空数据库 | bool |
| `health_check()` | 健康检查 | bool |

### Hash 方法

| 方法 | 说明 | 返回值 |
|------|------|--------|
| `hset(name, key, value)` | 设置Hash字段 | bool |
| `hget(name, key, pickle_first)` | 获取Hash字段 | Any |
| `hmset(name, mapping)` | 批量设置Hash | bool |
| `hmget(name, *keys, pickle_first)` | 批量获取Hash | List[Any] |
| `hgetall(name, pickle_first)` | 获取所有Hash | Dict |
| `hvals(name, pickle_first)` | 获取所有Hash值 | List[Any] |

### Set 方法

| 方法 | 说明 | 返回值 |
|------|------|--------|
| `sadd(name, *values)` | 添加元素 | int |
| `smembers(name, pickle_first)` | 获取所有元素 | Set |

### List 方法

| 方法 | 说明 | 返回值 |
|------|------|--------|
| `lpush(name, *values)` | 左插入 | int |
| `rpush(name, *values)` | 右插入 | int |
| `lrange(name, start, end, pickle_first)` | 获取范围 | List |

---

## 十二、注意事项

### 12.1 类型保持

RedisAdapter 使用 pickle 序列化 `int/float/bool`，类型会被正确保持：

```python
redis.set("int_key", 123)
redis.set("float_key", 12.5)
redis.set("bool_key", True)

print(redis.get("int_key"))   # 123 (int)
print(redis.get("float_key")) # 12.5 (float)
print(redis.get("bool_key"))  # True (bool)
```

### 12.2 numpy 维度限制

仅支持 1-3 维数组，高维数组会抛出异常。

### 12.3 pickle 安全性

pickle 可以执行任意代码，仅在可信环境中使用。

---

## 十三、Direct-Redis vs RedisAdapter 对比

### 13.1 基础特性对比

| 特性 | Direct-Redis | RedisAdapter |
|------|--------------|--------------|
| 继承自 | `redis.Redis` | 自定义 `CacheAdapter` |
| 连接管理 | 需自行管理 | 自动连接 + `lru_cache` 单例 |
| 连接池 | ❌ 不支持 | ✅ 可配合 `connection_pool.py` |
| 健康检查 | ❌ 不支持 | ✅ `health_check()` |
| 单例模式 | ❌ | ✅ `lru_cache` 客户端单例 |

### 13.2 数据类型支持对比

| 数据类型 | Direct-Redis | RedisAdapter |
|----------|--------------|--------------|
| `str` | ✅ | ✅ |
| `int/float/bool` | ✅ | ✅ (pickle 保持类型) |
| `list/tuple` | ✅ | ✅ |
| `dict` | ✅ | ✅ |
| `set` | ✅ | ✅ |
| `pandas.DataFrame` | ✅ | ✅ |
| `pandas.Series` | ❌ | ✅ |
| `numpy.ndarray` | ✅ | ✅ (优化格式) |
| 其他自定义类型 | ✅ (pickle) | ✅ (pickle) |

### 13.3 Redis 命令支持对比

#### String 操作

| 命令 | Direct-Redis | RedisAdapter |
|------|--------------|--------------|
| `SET` | ✅ | ✅ |
| `GET` | ✅ | ✅ |
| `MSET` | ✅ | ✅ (支持 TTL) |
| `MGET` | ✅ | ✅ |

#### Hash 操作

| 命令 | Direct-Redis | RedisAdapter |
|------|--------------|--------------|
| `HSET` | ✅ | ✅ |
| `HGET` | ✅ | ✅ |
| `HMSET` | ✅ | ✅ |
| `HMGET` | ✅ | ✅ |
| `HGETALL` | ✅ | ✅ |
| `HVALS` | ✅ | ✅ |
| `HKEYS` | ✅ | ❌ |
| `HDEL` | ❌ | ❌ |

#### Set 操作

| 命令 | Direct-Redis | RedisAdapter |
|------|--------------|--------------|
| `SADD` | ✅ | ✅ |
| `SREM` | ✅ | ❌ |
| `SMEMBERS` | ✅ | ✅ |
| `SISMEMBER` | ✅ | ❌ |
| `SPOP` | ✅ | ❌ |
| `SCARD` | ✅ | ❌ |

#### List 操作

| 命令 | Direct-Redis | RedisAdapter |
|------|--------------|--------------|
| `LPUSH` | ✅ | ✅ |
| `RPUSH` | ✅ | ✅ |
| `LPOP` | ✅ | ❌ |
| `RPOP` | ✅ | ❌ |
| `LRANGE` | ✅ | ✅ |
| `LINDEX` | ✅ | ❌ |

### 13.4 特殊功能对比

| 功能 | Direct-Redis | RedisAdapter |
|------|--------------|--------------|
| LRU 缓存装饰器 | ❌ | ❌ (在 `cache_decorator.py`) |
| 事务管理 | ❌ | ❌ (在 `transaction.py`) |
| 工作单元模式 | ❌ | ❌ (在 `transaction.py`) |
| 批量操作管道 | ❌ | ✅ `mset` 内部使用 pipeline |
| TTL 支持 | ✅ | ✅ |

### 13.5 选择建议

| 场景 | 推荐 |
|------|------|
| 需要完整的 Redis 命令支持 | Direct-Redis |
| FQuant 系统内，需要 pandas/numpy 缓存 | RedisAdapter |
| 需要连接池管理 | RedisAdapter |
| 需要与 `transaction.py`/`cache_decorator.py` 配合 | RedisAdapter |
| 快速原型开发 | 两者皆可 |

### 13.6 替换说明

RedisAdapter 已通过 `FQBase/FQConfig/redis.py` 的 `get_redis_connection()` 统一管理，现有 90 个使用 Direct-Redis 的文件**无需任何修改**。

---

## 十四、替代库说明

### 14.1 替代关系

| 被替代库 | 替代方案 | 说明 |
|----------|----------|------|
| `direct_redis` | `RedisAdapter` | 通过 `FQBase/FQConfig/redis.py` 统一管理 |
| `redis_json_storage` | `RedisAdapter` | 功能完全覆盖，可直接替换 |

### 14.2 迁移指南

#### direct_redis 迁移

```python
# 旧代码（direct_redis）
from direct_redis import DirectRedis
r = DirectRedis(host='localhost', port=6379)
r.set('key', 'value')
r.hset('hash', 'field', 'value')

# 新代码（RedisAdapter）- 无需修改，已通过 get_redis_connection() 统一
from FQBase.FQConfig import get_redis_connection
r = get_redis_connection()
r.set('key', 'value')
r.hset('hash', 'field', 'value')
```

#### redis_json_storage 迁移

```python
# 旧代码（redis_json_storage）
from redis_json_storage import JsonStorage
storage = JsonStorage(conn, prefix="user:")
storage.update("123", {"name": "张三", "age": 30})
data = storage.get("123")
storage.delete_field("123", "age")

# 新代码（RedisAdapter）
from FQBase.FQDataStore import RedisAdapter
redis = RedisAdapter(host='localhost', port=6379)
# 前缀需手动处理
redis.hmset(f"user:123", {"name": "张三", "age": 30})
data = redis.hgetall(f"user:123")
# 删除字段需组合操作
redis.hgetall(f"user:123")  # 获取后删除再写回，或使用 delete() 删除整个 key
```

### 14.3 替代优势

| 方面 | direct_redis | redis_json_storage | RedisAdapter |
|------|--------------|---------------------|--------------|
| pandas 支持 | ✅ | ❌ | ✅ |
| numpy 支持 | ✅ | ❌ | ✅ |
| 类型保持 | ⚠️ 部分 | ❌ | ✅ |
| 连接池 | ❌ | ❌ | ✅ |
| 健康检查 | ❌ | ❌ | ✅ |
| 事务管理 | ❌ | ❌ | ✅ |
| 缓存装饰器 | ❌ | ❌ | ✅ |

---

## 十五、相关文档

- [module-FQBase.md](./module-FQBase.md) - FQBase 模块索引
- [module-FQDataStore.md](./module-FQDataStore.md) - 数据存储模块
- [FQConfig/redis.py](./module-FQConfig.md) - Redis 配置