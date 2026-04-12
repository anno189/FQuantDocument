# module-FQCore-cache.md

# 模块迁移报告: FQCore-cache

## 基本信息

| 项目 | 原模块 | 迁移后 |
|------|--------|--------|
| **模块名称** | QUANTAXIS.QAUtil.QACache | FQCore.cache |
| **原文件** | `_bak/QUANTAXIS/QAUtil/QACache.py` | `FQBase/FQBase/FQCore/cache.py` |
| **功能** | 简单缓存系统 | 统一缓存管理 |

## 迁移对比

### 原实现 (QACache.py)

```python
from time import time
from QUANTAXIS.QAUtil.QASingleton import singleton

@singleton
class QA_util_cache:
    """简单的缓存系统"""
    def __init__(self):
        self.mem = {}
        self.time = {}

    def set(self, key, data, age=-1):
        """保存键为key的值，存活时间为age秒"""
        self.mem[key] = data
        if age == -1:
            self.time[key] = -1
        else:
            self.time[key] = time() + age
        return True

    def get(self, key):
        """获取键key对应的值"""
        if key in self.mem.keys():
            if self.time[key] == -1 or self.time[key] > time():
                return self.mem[key]
            else:
                self.delete(key)
                return None
        return None

    def delete(self, key):
        """删除键为key的条目"""
        del self.mem[key]
        del self.time[key]
        return True

    def clear(self):
        """清空所有缓存"""
        self.mem.clear()
        self.time.clear()
```

### 迁移后 (FQCore/cache.py)

```python
class FQCache:
    """缓存基类 - 支持 maxsize 和统计"""
    _instances: Dict[str, 'FQCache'] = {}
    _lock = threading.Lock()

    def __init__(self, name: str = 'default', maxsize: int = 128):
        self._name = name
        self._maxsize = maxsize
        self._cache: OrderedDict = OrderedDict()
        self._hits = 0
        self._misses = 0

    def get(self, key: str, default: Any = None) -> Any:
        """获取缓存值"""
        if key in self._cache:
            self._hits += 1
            self._cache.move_to_end(key)
            return self._cache[key]
        self._misses += 1
        return default

    def set(self, key: str, value: Any):
        """设置缓存值"""
        if len(self._cache) > self._maxsize:
            self._cache.popitem(last=False)  # LRU淘汰

    def delete(self, key: str):
        """删除缓存值"""
        if key in self._cache:
            del self._cache[key]

    def clear(self):
        """清空缓存"""
        self._cache.clear()
        self._hits = 0
        self._misses = 0

    @property
    def stats(self) -> Dict[str, int]:
        """获取缓存统计"""
        return {'hits': self._hits, 'misses': self._misses, ...}


class TimedCache:
    """定时缓存 - 支持过期时间"""

    def __init__(self, ttl: int = 3600, maxsize: int = 128):
        self._ttl = ttl
        self._cache: OrderedDict = OrderedDict()
        self._timestamps: OrderedDict = OrderedDict()
        self._lock = threading.Lock()

    def get(self, key: str, default: Any = None) -> Any:
        """获取缓存值，过期返回 default"""
        if time.time() - self._timestamps[key] > self._ttl:
            # 删除过期项
            del self._cache[key]
            del self._timestamps[key]
            return default
        return self._cache[key]


class fq_cache:
    """缓存装饰器"""
    @fq_cache(maxsize=128, ttl=3600)
    def expensive_function(x):
        return x * 2
```

## 功能对比

| 功能 | 原实现 | 迁移后 |
|------|--------|--------|
| 缓存存储 | `dict` | `OrderedDict` |
| 线程安全 | ❌ 无 | ✅ `threading.Lock` |
| LRU淘汰 | ❌ 无 | ✅ `FQCache` 支持 |
| TTL过期 | ✅ 简单实现 | ✅ `TimedCache` |
| 统计信息 | ❌ 无 | ✅ `stats` 属性 |
| 装饰器支持 | ❌ 无 | ✅ `fq_cache` |
| 单例模式 | `@singleton` | `__new__` |

## 改进点

### 1. 线程安全
```python
# TimedCache 使用锁保护
with self._lock:
    if key in self._cache:
        del self._cache[key]
```

### 2. LRU淘汰
```python
# FQCache 当超过 maxsize 时自动淘汰最旧的
if len(self._cache) > self._maxsize:
    self._cache.popitem(last=False)
```

### 3. 装饰器支持
```python
@fq_cache(maxsize=128, ttl=3600)
def fetch_data(symbol):
    # 结果会被缓存
    return api.fetch(symbol)
```

## 使用示例

### 新接口 (推荐)
```python
from FQCore.cache import FQCache, TimedCache, fq_cache

# 使用 FQCache (LRU)
cache = FQCache(name='my_cache', maxsize=256)
cache.set('key', 'value')
value = cache.get('key')
print(cache.stats)

# 使用 TimedCache (TTL)
timed_cache = TimedCache(ttl=3600, maxsize=128)  # 1小时过期
timed_cache.set('key', 'value')
value = timed_cache.get('key')

# 使用装饰器
@fq_cache(maxsize=128, ttl=3600)
def get_stock_price(code):
    return fetch_price(code)
```

### 兼容旧接口
```python
# 可以创建兼容层
class QA_util_cache:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = TimedCache(ttl=-1)
        return cls._instance

    def set(self, key, data, age=-1):
        ttl = age if age > 0 else -1
        self._cache[key] = data
        self._timestamps[key] = time.time()
        return True

    def get(self, key):
        # ... 类似实现
```

## 相关文件

- [cache.py](../../FQBase/FQBase/FQCore/cache.py) - 本模块
- [tools.md](module-FQUtil-tools.md) - 单例模式
- [setting.md](module-FQConfig-setting.md) - 配置模块

## 迁移状态

| 项目 | 状态 |
|------|------|
| **功能完整性** | ✅ 完成 |
| **向后兼容** | ⏳ 需添加兼容类 |
| **API文档** | ✅ Docstring完整 |
| **线程安全** | ✅ 支持 |
| **新增功能** | ✅ LRU、装饰器、统计 |
