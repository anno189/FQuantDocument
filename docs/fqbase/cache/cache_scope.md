# LocalCache 作用域说明

**模块路径**: `FQBase.Cache`
**适用类**: `LocalCache`, `local_cache` 装饰器
**版本**: 2.7.0

---

## 概述

`LocalCache` 是进程内内存缓存，采用**基于 name 的单例模式**管理缓存实例。

**核心澄清**：
- `LocalCache` 的隔离是基于 `name` 参数的单例模式，而非"函数私有"概念
- `@local_cache` 装饰器为每个函数创建独立 `LocalCache` 实例，是因为每个函数的 `name` 不同（默认取函数名）
- `LocalCache` 可以被共享使用（相同 `name` 参数会共享实例），也可以独立使用

---

## 作用域层级

### 1. 缓存数据隔离（基于 name 的单例）

`LocalCache` 通过 `(name, maxsize, ttl, eviction)` 组合作为单例 key：

```
单例 key 格式: {name}:{maxsize}:{ttl}:{eviction}
```

**相同 key** → 共享同一个缓存实例：

```python
# 两次调用，参数完全相同
cache1 = LocalCache(name='shared', maxsize=128, ttl=3600)
cache2 = LocalCache(name='shared', maxsize=128, ttl=3600)

print(cache1 is cache2)  # True - 同一个实例！
```

**不同 name** → 各自独立缓存：

```python
cache_a = LocalCache(name='cache_a', maxsize=128, ttl=3600)
cache_b = LocalCache(name='cache_b', maxsize=128, ttl=3600)

print(cache_a is cache_b)  # False - 不同实例！
```

### 2. @local_cache 装饰器的 name 隔离

`@local_cache` 默认使用函数名作为 `name` 参数，所以不同函数拥有独立缓存：

```python
from FQBase.Cache import local_cache

@local_cache(ttl=3600)
def func_a():
    return "result_a"

@local_cache(ttl=3600)
def func_b():
    return "result_b"

# func_a 和 func_b 拥有独立的缓存空间（因为 name 不同）
print(func_a.cache is func_b.cache)  # False
```

**但如果显式指定相同的 name**：

```python
@local_cache(name='shared_cache', ttl=3600)
def func_c():
    return "result_c"

@local_cache(name='shared_cache', ttl=3600)  # name 相同
def func_d():
    return "result_d"

# func_c 和 func_d 共享同一个缓存实例！
print(func_c.cache is func_d.cache)  # True
```

### 3. LocalCache 与全局适配器的关系

**核心澄清**：

`LocalCache` 可以通过 `set_cache_adapter()` 作为全局适配器使用，通过 `name` 参数来区分不同的 `LocalCache` 实例。

| 场景 | LocalCache 用法 | name 参数 | 说明 |
|------|----------------|----------|------|
| 全局适配器 | `set_cache_adapter(LocalCache(name="fquant_memory"))` | `"fquant_memory"` | 供 `@redis_cache` 使用，所有装饰器函数共享 |
| 装饰器私有 | `@local_cache` 装饰的函数 | `函数名` | 每个函数独立实例，不受全局适配器影响 |

**关键理解**：
- `LocalCache` 本身不是"全局"的，通过 `set_cache_adapter()` 设置后才成为全局适配器
- 作为全局适配器时，使用 `name="fquant_memory"` 与其他 `LocalCache` 实例区分
- `@local_cache` 装饰器使用独立的 `name=函数名`，与全局适配器的 `name="fquant_memory"` 完全隔离

---

## 作用域层级

### 1. 缓存数据隔离（实例级别）

每个 `LocalCache` 实例存储独立的数据，互不干扰：

```python
from FQBase.Cache import local_cache

@local_cache(ttl=3600)
def func_a():
    return "result_a"

@local_cache(ttl=3600)
def func_b():
    return "result_b"

# func_a 和 func_b 拥有独立的缓存空间
print(func_a.cache is func_b.cache)  # False
print(len(func_a.cache))  # 0 或 1
print(len(func_b.cache))  # 0 或 1
```

### 2. 单例 key 的构成

`LocalCache` 通过以下格式生成单例 key：

```
{name}:{maxsize}:{ttl}:{eviction}
```

| 参数 | 说明 | 示例 |
|------|------|------|
| `name` | 缓存名称（默认取函数名） | `func_a` |
| `maxsize` | 最大缓存条目数 | `128` |
| `ttl` | 过期时间（秒） | `3600` |
| `eviction` | 驱逐策略 (`lru`/`fifo`) | `lru` |

**相同参数组合** → 共享同一个缓存实例：

```python
@local_cache(ttl=3600, maxsize=128)
def query_users():
    return get_users()

@local_cache(ttl=3600, maxsize=128)  # 参数完全相同
def query_products():
    return get_products()

# query_users 和 query_products 共享同一个缓存实例！
print(query_users.cache is query_products.cache)  # True
```

**不同参数组合** → 各自独立缓存：

```python
@local_cache(ttl=3600)
def func_c():
    pass

@local_cache(ttl=7200)  # ttl 不同，不会共享
def func_d():
    pass

print(func_c.cache is func_d.cache)  # False
```

---

## 类级别共享资源

以下资源是**类级别共享**的，用于管理所有缓存实例：

```python
class LocalCache:
    _instances: Dict[str, 'LocalCache'] = {}    # 所有缓存实例的注册表
    _lock: threading.Lock                        # 线程安全锁
    _access_order: List[str] = []               # LRU 驱逐顺序
    _last_cleanup: float = 0.0                 # 上次全局清理时间
    _cleanup_thread: threading.Thread           # 后台清理线程
```

| 资源 | 作用域 | 用途 |
|------|--------|------|
| `_instances` | 所有实例共享 | 存储 `{单例key: 实例}` 映射 |
| `_lock` | 所有实例共享 | 保证线程安全 |
| `_access_order` | 所有实例共享 | LRU 驱逐策略的访问顺序 |
| `_cleanup_thread` | 类级别 | 后台过期清理线程 |

---

## 缓存实例创建流程

```python
# 1. @local_cache 装饰器创建 LocalCache 实例
@local_cache(ttl=3600)
def query_stock_list():
    return get_stock_list()

# 内部等价于:
cache = LocalCache(name='query_stock_list', maxsize=128, ttl=3600, eviction='lru')
```

### 单例获取逻辑

```python
def __new__(cls, name, maxsize, ttl, eviction, singleton=True):
    if singleton:
        key = f"{name}:{maxsize}:{ttl}:{eviction}"
        if key not in cls._instances:
            # 创建新实例并注册
            instance = super().__new__(cls)
            cls._instances[key] = instance
        return cls._instances[key]
    else:
        # 非单例模式，每次创建新实例
        return super().__new__(cls)
```

---

## 命名空间隔离策略

### 按函数名隔离（推荐）

```python
@local_cache(ttl=86400)
def query_stock_list():
    """股票列表缓存 - 独立空间"""
    return get_stock_list()

@local_cache(ttl=3600)
def query_realtime_price():
    """实时价格缓存 - 独立空间"""
    return get_price()
```

### 按 TTL 隔离

```python
@local_cache(ttl=300)  # 5 分钟缓存
def query_intraday_data():
    """日内数据 - 短期缓存"""
    pass

@local_cache(ttl=86400)  # 1 天缓存
def query_daily_data():
    """日线数据 - 长期缓存"""
    pass
```

### 按 maxsize 隔离

```python
@local_cache(maxsize=50)  # 小缓存
def query_hot_stocks():
    """热门股票 - 少量缓存"""
    pass

@local_cache(maxsize=5000)  # 大缓存
def query_all_stocks():
    """全部股票 - 大量缓存"""
    pass
```

---

## 调试与监控

### 查看缓存实例

```python
@local_cache(ttl=3600)
def query_stock_list():
    pass

# 查看缓存对象
print(query_stock_list.cache)           # LocalCache 对象
print(query_stock_list.cache._name)     # 缓存名称
print(query_stock_list.cache._ttl)     # TTL 设置
print(query_stock_list.cache._maxsize) # 最大容量
```

### 查看缓存数据

```python
# 查看缓存条目数
print(len(query_stock_list.cache))

# 直接访问内部缓存（OrderedDict）
print(query_stock_list.cache._cache)

# 查看统计信息
print(query_stock_list.cache.stats)
# 输出: {'name': 'query_stock_list', 'size': 1, 'hits': 10, 'misses': 2, 'hit_rate': '83.33%'}
```

### 查看所有缓存实例

```python
# 查看当前所有 LocalCache 实例
print(LocalCache._instances)

# 查看实例数量
print(len(LocalCache._instances))
```

---

## 缓存清除

### 清除单个函数的缓存

```python
@local_cache(ttl=3600)
def query_stock_list():
    pass

# 方式一：通过 cache_clear 方法
query_stock_list.cache_clear()

# 方式二：直接操作缓存对象
query_stock_list.cache.clear()
```

### 清除所有函数的缓存

```python
from FQBase.Cache import LocalCache

# 清除所有实例的缓存
for instance in LocalCache._instances.values():
    instance.clear()
```

---

## 常见问题

### Q: 两个不同函数的缓存会互相影响吗？

**不会**。每个被装饰的函数拥有独立的 `LocalCache` 实例，数据完全隔离。

### Q: 如何让多个函数共享同一个缓存？

让 `local_cache` 的参数完全相同（包括 `name`、`maxsize`、`ttl`、`eviction`）：

```python
@local_cache(name='shared_cache', maxsize=128, ttl=3600, eviction='lru')
def func_a():
    pass

@local_cache(name='shared_cache', maxsize=128, ttl=3600, eviction='lru')
def func_b():
    pass

# func_a 和 func_b 共享同一个缓存
print(func_a.cache is func_b.cache)  # True
```

### Q: LocalCache 是线程安全的吗？

**是的**。`LocalCache` 使用 `threading.Lock` 保证线程安全，支持多线程并发访问。

### Q: 缓存过期后会自动清理吗？

是的，`LocalCache` 采用**惰性清理**策略：
- 每次 `get()` 时检查当前 key 是否过期
- 后台清理线程定期清理所有过期实例（默认 5 分钟间隔）

---

## 进程作用域说明

### 核心特性：进程内缓存

`LocalCache` 是**进程内内存缓存**，缓存数据存储在 Python 进程的内存中。**不同进程拥有独立的缓存空间**，进程之间完全不共享。

```
┌─────────────────────────────────────────────────────────┐
│  Process 1 (开发调试 / Web Server / Celery Worker)      │
│  ┌─────────────────────────────────────────────────┐   │
│  │  LocalCache Instance                             │   │
│  │  _cache: {key1: value1, key2: value2, ...}     │   │
│  │  (进程独占内存)                                   │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Process 2 (另一个 Celery Worker / 新调试会话)         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  LocalCache Instance (独立空缓存)                │   │
│  │  _cache: {}                                      │   │
│  │  (进程独占内存)                                   │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 不同环境的缓存效果

| 环境 | LocalCache 效果 | 说明 |
|------|----------------|------|
| **单进程开发调试** | ❌ 几乎无效 | 每次运行是新进程，缓存为空 |
| **Django/Flask Web 应用** | ✅ 有效 | 请求在同一进程内复用 |
| **Celery (单进程 gevent)** | ✅ 有效 | 任务在同一进程执行 |
| **Celery (prefork 多进程)** | ⚠️ 部分有效 | 每个 worker 子进程有独立缓存 |
| **Jupyter Notebook** | ⚠️ 每内核有效 | 每个内核是新进程 |

### Celery 多进程场景

Celery 默认使用 prefork 模式（多进程），会导致每个 worker 有独立缓存：

```
Celery Master Process
    │
    ├── Worker Process 1  →  独立缓存（进程A的数据）
    │                          cache.clear() 只清空进程A
    │
    ├── Worker Process 2  →  独立缓存（进程B的数据）
    │                          cache.clear() 只清空进程B
    │
    └── Worker Process 3  →  独立缓存（进程C的数据）
                               cache.clear() 只清空进程C
```

**问题**：Worker 1 清除的缓存，Worker 2 和 Worker 3 感知不到。

### 解决方案

#### 方案一：使用 Redis 缓存（推荐）

如果需要**跨进程共享缓存**，使用 `redis_cache` 装饰器：

```python
from FQBase.Cache import redis_cache

@redis_cache(ttl=172800)  # 所有进程共享同一份 Redis 缓存
def query_stock_list_all():
    return get_stock_list()
```

| 对比 | `local_cache` | `redis_cache` |
|------|---------------|---------------|
| 存储位置 | 进程内存 | Redis 服务器 |
| 跨进程共享 | ❌ 否 | ✅ 是 |
| 进程重启后保留 | ❌ 否 | ✅ 是 |

参见：[redis_cache 装饰器](api.md)

#### 方案二：Celery 任务触发回调

在清除缓存时，同时触发所有 worker 的缓存清除：

```python
@app.task
def clear_stock_list_cache():
    """清除缓存并通知所有 worker"""
    from FQData.DataStore.query import refresh_stock_list_all_cache
    refresh_stock_list_all_cache()
    # 可以通过 Redis Pub/Sub 通知其他 worker
```

### 开发调试建议

1. **短期缓存**：`local_cache` 适合在单个请求/会话内有重复调用的场景
2. **跨进程共享**：使用 `redis_cache` 实现真正共享缓存
3. **定时刷新**：结合 Celery Beat 定时任务清除缓存（见 [todo.md](../../FQuant.Server/docs/todo.md)）

### 验证缓存状态

```python
# 检查缓存是否生效
from FQData.DataStore.query import _query_stock_list_all_cached

stats = _query_stock_list_all_cached.cache.stats
print(f"hits: {stats['hits']}, misses: {stats['misses']}")

if stats['misses'] == 1 and stats['hits'] == 0:
    print("刚从数据库读取")
else:
    print("从缓存读取")
```

---

## 相关文档

- [local_cache 装饰器 API](api.md)
- [LocalCache 详细 API](api.md#localcache)
- [缓存最佳实践](development.md)
- [Cache Prefix 使用场景](Cache_Prefix_使用场景.md)
