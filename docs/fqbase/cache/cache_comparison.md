# 三种缓存机制的场景化对比分析

> 文档类型：技术决策分析
> 创建日期：2026-04-05
> 关联模块：FQBase/Cache

---

## 1. 概述

本文档对比分析 FQuant 项目中三种缓存机制的特点、适用场景及选型建议：

| 缓存类型 | 来源 | 定位 |
|----------|------|------|
| `@lru_cache` | Python 内置 (`functools`) | 单进程方法级缓存 |
| `@local_cache` | FQBase 自定义 (`CacheAdapters`) | 单进程可配置缓存 |
| `@redis_cache` | FQBase 自定义 (`CacheAdapters`) | 分布式多进程共享缓存 |

### 1.1 架构层级图

```
┌─────────────────────────────────────────────────────────────────┐
│                         缓存层级架构                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   @lru_cache        ←→  单进程内、方法级缓存                    │
│         ↓                                                       │
│   @local_cache      ←→  单进程内、可配置缓存 (TTL/统计)          │
│         ↓                                                       │
│   @redis_cache      ←→  分布式、多进程共享缓存                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. 核心功能对比

### 2.1 功能特性矩阵

| 功能特性 | `@lru_cache` | `@local_cache` | `@redis_cache` |
|----------|:------------:|:--------------:|:--------------:|
| LRU 驱逐策略 | ✅ | ✅ | ✅ |
| FIFO 驱逐策略 | ❌ | ✅ | ❌ |
| TTL 过期 | ❌ | ✅ | ✅ |
| Per-key TTL | ❌ | ✅ | ✅ |
| 线程安全 | ✅ | ✅ | ✅ |
| 批量操作 | ❌ | ✅ | ✅ |
| 惰性清理 | ❌ | ✅ | ✅ |
| 缓存统计 | ✅ (`cache_info`) | ✅ (`stats`) | ✅ |
| 缓存清除 | ✅ (`cache_clear`) | ✅ (`cache_clear`) | ✅ |
| 跨进程共享 | ❌ | ❌ | ✅ |
| 异步支持 | ❌ | ❌ | ✅ |

### 2.2 性能对比

| 性能指标 | `@lru_cache` | `@local_cache` | `@redis_cache` |
|----------|:------------:|:--------------:|:--------------:|
| 命中延迟 | ~10ns | ~100ns | ~1-10ms |
| 未命中开销 | 极低 | 中等 | 高（网络往返） |
| 内存占用 | 按需 | 可控 | Redis 服务器内存 |
| 序列化开销 | 无 | 无 | msgpack/pickle |
| 实现方式 | C 实现 | Python + 线程锁 | Python + 网络 |

### 2.3 使用复杂度

| 维度 | `@lru_cache` | `@local_cache` | `@redis_cache` |
|------|:------------:|:--------------:|:--------------:|
| 语法简洁性 | ✅ 极简 | ✅ 简洁 | ✅ 简洁 |
| 配置项数量 | 1 (`maxsize`) | 3 (`maxsize`, `ttl`, `key_ttl_func`) | 3 (`ttl`, `key_prefix`, `key_ttl_func`) |
| 基础设施依赖 | 无 | 无 | Redis 服务器 |

---

## 3. API 对比

### 3.1 装饰器语法

**`@lru_cache`**
```python
from functools import lru_cache

@lru_cache(maxsize=128)
def get_data(x):
    return expensive_computation(x)
```

**`@local_cache`**
```python
from FQBase.Cache import local_cache

@local_cache(maxsize=128, ttl=300)
def get_data(x):
    return expensive_computation(x)

# 支持 per-key TTL
@local_cache(ttl=300, key_ttl_func=get_ttl_by_key)
def get_data(x):
    return expensive_computation(x)
```

**`@redis_cache`**
```python
from FQBase.Cache import redis_cache

@redis_cache(ttl=3600, key_prefix='stock_price')
def get_stock_price(code):
    return fetch_from_db(code)

# 支持 per-key TTL
@redis_cache(ttl=300, key_ttl_func=get_ttl_by_data_type)
def get_market_data(data_type):
    return fetch_from_api(data_type)
```

### 3.2 缓存管理方法

| 方法 | `@lru_cache` | `@local_cache` | `@redis_cache` |
|------|:------------:|:--------------:|:--------------:|
| `cache_clear()` | ✅ | ✅ | ✅ |
| `cache_info()` | ✅ | ❌ | ❌ |
| `cache_stats()` | ❌ | ✅ | ❌ |
| `cache_parameters()` | ✅ | ❌ | ❌ |

### 3.3 LocalCache 类直接使用

```python
from FQBase.Cache import LocalCache

# 创建实例
cache = LocalCache(name='my_cache', maxsize=128, ttl=300, eviction='lru')

# 基本操作
cache.get(key, default=None)
cache.set(key, value, ttl=None)
cache.delete(key)
cache.clear()

# 批量操作
cache.get_many(keys)
cache.set_many(mapping)
cache.delete_many(keys)

# 状态查询
cache.exists(key)
cache.ttl(key)
cache.expire(key, ttl)
cache.stats  # {'hits': 0, 'misses': 0, 'hit_rate': '0.00%', ...}
```

---

## 4. 场景化选型分析

### 4.1 典型场景对比

| 场景 | `@lru_cache` | `@local_cache` | `@redis_cache` | 推荐 |
|------|:------------:|:--------------:|:--------------:|:----:|
| 单进程内简单属性缓存 | ✅ | ⚠️ | ❌ | **`@lru_cache`** |
| 需要 TTL 过期 | ❌ | ✅ | ✅ | `@local_cache` / `@redis_cache` |
| 多进程/多实例共享 | ❌ | ❌ | ✅ | **`@redis_cache`** |
| 高频调用场景 | ✅ | ⚠️ | ❌ | **`@lru_cache`** |
| 低频调用+长缓存 | ✅ | ✅ | ✅ | `@lru_cache` / `@redis_cache` |
| 分布式定时任务 | ❌ | ❌ | ✅ | **`@redis_cache`** |
| Celery 任务结果缓存 | ❌ | ❌ | ✅ | **`@redis_cache`** |
| 对象属性缓存 | ✅ | ⚠️ | ❌ | **`@lru_cache`** |
| 数据库查询结果缓存 | ⚠️ | ⚠️ | ✅ | **`@redis_cache`** |
| 因子计算结果缓存 | ❌ | ⚠️ | ✅ | **`@redis_cache`** |

### 4.2 详细场景分析

#### 场景 1：DataStruct 对象属性缓存

**示例代码（`transaction.py`）**
```python
class StockTransactionData:
    @property
    @lru_cache(maxsize=128)
    def buyorsell(self) -> pd.Series:
        return self._data.buyorsell
```

| 缓存类型 | 推荐度 | 原因 |
|----------|:------:|------|
| `@lru_cache` | ✅ **最佳** | 性能极快、语义匹配单实例 |
| `@local_cache` | ❌ 不推荐 | 需为每个实例创建独立 cache，开销大 |
| `@redis_cache` | ❌ 不适合 | 跨进程无意义，网络开销大 |

#### 场景 2：数据库查询结果缓存

**示例代码（`query.py`）**
```python
@redis_cache(ttl=172800)  # 2天过期
def query_stock_list_all():
    return fetch_from_mongodb()
```

| 缓存类型 | 推荐度 | 原因 |
|----------|:------:|------|
| `@lru_cache` | ❌ 不适合 | 多进程无法共享 |
| `@local_cache` | ❌ 不适合 | 多进程各有一份，无法同步失效 |
| `@redis_cache` | ✅ **最佳** | 多进程共享、统一失效 |

#### 场景 3：因子计算结果缓存

**示例代码（`factor_calculator.py`）**
```python
@redis_cache(ttl=3600, key_prefix='factor')
def calculate_factor(code, date, factor_name):
    return compute_intensive_factor(code, date, factor_name)
```

| 缓存类型 | 推荐度 | 原因 |
|----------|:------:|------|
| `@lru_cache` | ❌ 不适合 | 因子计算耗时长，分布式服务需共享结果 |
| `@local_cache` | ⚠️ 勉强 | 多实例重复计算，浪费资源 |
| `@redis_cache` | ✅ **最佳** | 一次计算，多实例复用 |

#### 场景 4：需要按条件设置不同 TTL

**示例代码**
```python
@local_cache(ttl=300, key_ttl_func=get_ttl_by_data_type)
@redis_cache(ttl=300, key_ttl_func=get_ttl_by_data_type)
def get_market_data(data_type):
    ...
```

| 缓存类型 | 支持度 | 原因 |
|----------|:------:|------|
| `@lru_cache` | ❌ | 固定参数，无法动态 TTL |
| `@local_cache` | ✅ | `key_ttl_func` 支持 |
| `@redis_cache` | ✅ | `key_ttl_func` 支持 |

### 4.3 选型决策树

```
需要缓存?
    │
    ├── 是否跨多进程/实例共享?
    │   ├── YES → @redis_cache
    │   └── NO
    │       │
    │       是否需要 TTL?
    │       ├── YES → @local_cache
    │       └── NO
    │           │
    │           是对象属性/高频场景?
    │           ├── YES → @lru_cache ✅
    │           └── NO → @lru_cache 或 @local_cache 均可
```

---

## 5. 项目实际使用情况

### 5.1 使用统计

| 缓存类型 | 使用处数 | 主要文件 |
|----------|:--------:|----------|
| `@lru_cache` | ~50 处 | `transaction.py`, `stock.py`, `bond.py`, `index.py`, `future.py` |
| `@local_cache` | ~0 处 | （几乎无实际使用） |
| `@redis_cache` | ~15 处 | `query.py`, `factor_calculator.py`, 各类 API 模块 |

### 5.2 典型使用位置

| 文件 | 缓存类型 | 场景说明 |
|------|:--------:|----------|
| [transaction.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQData/FQData/DataStruct/transaction.py) | `@lru_cache` | 分时成交数据属性缓存 |
| [stock.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQData/FQData/DataStruct/stock.py) | `@lru_cache` | 股票日线数据属性缓存 |
| [query.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQData/FQData/DataStore/query.py) | `@local_cache` / `@redis_cache` | 数据库查询结果缓存 |
| [factor_calculator.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQFactor/core/factor_calculator.py) | `@redis_cache` | 因子计算结果缓存 |

---

## 6. 关于 `local_cache` 的定位讨论

### 6.1 "意义不大"观点的支持理由

| 观点 | 解释 |
|------|------|
| **性能不如 `@lru_cache`** | SHA256 哈希 + 线程锁，比 C 实现慢 5-10 倍 |
| **功能不如 `@redis_cache`** | 不支持跨进程，多实例各有一份 |
| **可替代性** | 如果需要 TTL，可以考虑 Redis 本地实例 |
| **使用频率低** | 项目中几乎看不到 `@local_cache` 的实际使用 |

### 6.2 "仍有价值"观点的支持理由

| 场景 | `@local_cache` 的价值 |
|------|------------------------|
| **轻量级 TTL 需求** | 不依赖 Redis，减少基础设施依赖 |
| **避免网络开销** | 纯内存操作，无网络延迟 |
| **快速原型开发** | 不需要搭建 Redis 也能用 TTL |
| **隔离性要求** | 每个进程独立缓存，不互相干扰 |
| **调试场景** | 独立缓存，调试时容易隔离问题 |

### 6.3 结论

`@local_cache` 处于一个**尴尬位置**：

- 比 `@lru_cache` **慢且复杂**
- 比 `@redis_cache` **功能弱**

**但仍有存在价值**：
1. 作为 `@redis_cache` 的**降级方案**（当 Redis 不可用时）
2. 单进程场景下**轻量级 TTL** 的简单选择
3. 减少对 Redis 基础设施的**强依赖**

**建议**：
- 如果项目中**从未使用** `@local_cache`，可考虑标记为**弃用**
- 如保留，建议在**确实需要 TTL 但又不想引入 Redis 依赖**的场景使用

---

## 7. 总结

### 7.1 一句话推荐

| 缓存类型 | 一句话推荐 |
|----------|-----------|
| `@lru_cache` | 单进程高速缓存的首选，性能最优 |
| `@local_cache` | 单进程 + TTL 的轻量选择，介于两者之间 |
| `@redis_cache` | 分布式/跨进程共享缓存的唯一选择 |

### 7.2 选型总结表

| 需求 | 推荐 | 替代方案 |
|------|------|----------|
| 单进程 + 无 TTL | **`@lru_cache`** | 唯一选择 |
| 单进程 + 需要 TTL | `@local_cache` | 可用 Redis（但较重） |
| 多进程共享 | **`@redis_cache`** | 唯一选择 |
| 快速原型 + TTL | `@local_cache` | 可跳过 |

### 7.3 设计原则

1. **简单优先**：能用 `@lru_cache` 解决的，不用更复杂的方案
2. **按需选择**：根据是否跨进程、是否需要 TTL 来选择
3. **避免过度设计**：不要为了"万一以后用得上"而引入不必要的复杂度
4. **统一规范**：同类场景使用同一种缓存机制，便于维护

---

## 8. 参考资料

- [FQBase/Cache 模块](../fqbase/cache/README.md)
- [CacheAdapters.py 源码](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Cache/CacheAdapters.py)
- Python `functools.lru_cache` 官方文档
