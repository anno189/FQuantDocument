# TDX 适配器最佳实践

## 概述

本文档汇集了 TDX 适配器的最佳实践建议，帮助开发者更高效、更稳定地使用该模块。

---

## 性能优化

### 1. 合理设置超时时间

**反例：** 使用过短的超时时间

```python
adapter = TdxStockAdapter(timeout=0.1)  # 太短，容易超时
```

**正例：** 根据网络状况设置合理的超时

```python
adapter = TdxStockAdapter(timeout=2.0)  # 2 秒，适合大多数网络
```

**建议：**

| 网络环境 | 建议超时 |
|----------|----------|
| 本地网络 | 0.5-1.0s |
| 国内网络 | 1.0-2.0s |
| 海外网络 | 3.0-5.0s |
| 不稳定网络 | 5.0s+ |

### 2. 批量请求优化

**反例：** 循环内逐个请求

```python
codes = ['600000', '600036', '601318', '000001', '000002']
for code in codes:
    df = adapter.get_stock_day(code, '2024-01-01', '2024-12-31')
    # 每个代码单独请求，效率低
```

**正例：** 批量处理

```python
codes = ['600000', '600036', '601318', '000001', '000002']

def fetch_stock(code):
    try:
        return adapter.get_stock_day(code, '2024-01-01', '2024-12-31')
    except Exception:
        return None

from concurrent.futures import ThreadPoolExecutor

with ThreadPoolExecutor(max_workers=5) as executor:
    results = list(executor.map(fetch_stock, codes))
```

### 3. 使用最新 K 线而非完整回溯

**反例：** 每次获取全量数据

```python
df = adapter.get_stock_day('600000', '2020-01-01', '2024-12-31')
```

**正例：** 仅获取必要数据 + 增量更新

```python
import os

cache_file = '600000_daily.csv'

if os.path.exists(cache_file):
    cached = pd.read_csv(cache_file, parse_dates=['date'])
    last_date = cached['date'].max()
    new_data = adapter.get_stock_day('600000', str(last_date.date()), '2024-12-31')
    df = pd.concat([cached, new_data]).drop_duplicates()
else:
    df = adapter.get_stock_day('600000', '2024-01-01', '2024-12-31')
    df.to_csv(cache_file, index=False)
```

### 4. 避免频繁小量请求

**反例：** 频繁请求少量数据

```python
for i in range(100):
    df = adapter.get_stock_latest('600000')  # 每次都请求
```

**正例：** 批量请求后缓存

```python
from datetime import datetime, timedelta

cache_timeout = 60  # 缓存 60 秒

if not hasattr(self, '_cache') or \
   (datetime.now() - self._cache_time).total_seconds() > cache_timeout:
    self._cache = adapter.get_stock_latest(['600000', '000001', '000002'])
    self._cache_time = datetime.now()
```

---

## 连接管理

### 1. 复用适配器实例

**反例：** 每次调用创建新实例

```python
def get_data(code):
    adapter = TdxStockAdapter()  # 每次创建新实例
    return adapter.get_stock_day(code, '2024-01-01', '2024-12-31')
```

**正例：** 单例或全局实例

```python
_adapter = None

def get_adapter():
    global _adapter
    if _adapter is None:
        _adapter = TdxStockAdapter()
    return _adapter

def get_data(code):
    adapter = get_adapter()
    return adapter.get_stock_day(code, '2024-01-01', '2024-12-31')
```

### 2. 健康检查策略

```python
from functools import lru_cache

@lru_cache(maxsize=1)
def get_health_status():
    adapter = TdxStockAdapter()
    return adapter.health_check()

if not get_health_status():
    print("警告: 数据源不可用")
    get_health_status.cache_clear()  # 重置缓存
```

### 3. 连接池监控

```python
from FQData.DataSource.adapters.tdx.connection_pool import get_tdx_pool

pool = get_tdx_pool()

def log_pool_status():
    logger.info(f"HQ 连接数: {pool.hq_count}")
    logger.info(f"EX 连接数: {pool.ex_count}")

log_pool_status()
```

---

## 错误处理

### 1. 区分不同异常类型

```python
from FQData.DataSource.base import (
    DataSourceConnectionError,
    DataNotFoundError,
    DataSourceAPIError
)

def safe_get_stock_day(code, start, end):
    try:
        return adapter.get_stock_day(code, start, end)
    except DataSourceConnectionError:
        logger.error(f"连接失败，请检查网络: {code}")
        return None
    except DataNotFoundError as e:
        logger.warning(f"数据未找到: {code}, {e.code}")
        return None
    except DataSourceAPIError as e:
        logger.error(f"API 错误: {code}, {e.code}")
        return None
    except Exception as e:
        logger.exception(f"未知错误: {code}")
        return None
```

### 2. 重试机制

```python
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=1, max=10)
)
def robust_get_stock_day(code, start, end):
    return adapter.get_stock_day(code, start, end)
```

### 3. 降级策略

```python
def get_stock_data_with_fallback(code, start, end):
    from FQData.DataSource.adapters.tdx import TdxStockAdapter
    from FQData.DataSource.adapters.akshare import AkShareStockAdapter

    try:
        tdx_adapter = TdxStockAdapter()
        data = tdx_adapter.get_stock_day(code, start, end)
        if data is not None and not data.empty:
            return data
    except Exception as e:
        logger.warning(f"TDX 获取失败，切换到 AkShare: {e}")

    try:
        akshare_adapter = AkShareStockAdapter()
        return akshare_adapter.get_stock_day(code, start, end)
    except Exception as e:
        logger.error(f"AkShare 也失败: {e}")
        return None
```

---

## 数据处理

### 1. 数据验证

```python
def validate_kline_data(df):
    if df is None or df.empty:
        return False

    required_columns = ['date', 'open', 'high', 'low', 'close', 'volume']
    if not all(col in df.columns for col in required_columns):
        return False

    if (df['high'] < df['low']).any():
        return False

    if (df['close'] > df['high']).any() or (df['close'] < df['low']).any():
        return False

    return True
```

### 2. 数据清洗

```python
def clean_kline_data(df):
    if df is None or df.empty:
        return df

    df = df.copy()

    df = df[df['open'] != 0]
    df = df[df['volume'] >= 0]
    df = df[df['high'] >= df['low']]

    for col in ['open', 'high', 'low', 'close', 'volume', 'amount']:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')

    df = df.dropna()

    return df
```

### 3. 数据类型优化

```python
def optimize_data_types(df):
    df = df.copy()

    df['date'] = pd.to_datetime(df['date'])

    numeric_cols = ['open', 'high', 'low', 'close', 'volume', 'amount']
    for col in numeric_cols:
        if col in df.columns:
            df[col] = df[col].astype('float32')

    if 'code' in df.columns:
        df['code'] = df['code'].astype('category')

    return df
```

---

## 缓存策略

### 1. 证券列表缓存

```python
from FQData.DataStore import get_cache

@cache_manager.cache('stock_list', ttl=86400)
def get_cached_stock_list():
    adapter = TdxStockAdapter()
    return adapter.get_stock_list('stock')
```

### 2. IP 选择缓存

```python
TdxIPSelector.select_best_ip()

ip, port = TdxIPSelector.get_mainmarket_ip()
print(f"使用 IP: {ip}:{port}")
```

### 3. 数据结果缓存

```python
from datetime import datetime, timedelta

class StockDataCache:
    def __init__(self, ttl_seconds=300):
        self._cache = {}
        self._ttl = timedelta(seconds=ttl_seconds)

    def get(self, key):
        if key in self._cache:
            data, timestamp = self._cache[key]
            if datetime.now() - timestamp < self._ttl:
                return data
            del self._cache[key]
        return None

    def set(self, key, data):
        self._cache[key] = (data, datetime.now())

_cache = StockDataCache(ttl_seconds=300)

def get_stock_data(code, start, end):
    cache_key = f"{code}_{start}_{end}"
    data = _cache.get(cache_key)
    if data is not None:
        return data
    data = adapter.get_stock_day(code, start, end)
    _cache.set(cache_key, data)
    return data
```

---

## 日志记录

### 1. 结构化日志

```python
import structlog

logger = structlog.get_logger()

def log_api_call(method, code, start, end, result_count):
    logger.info(
        "tdx_api_call",
        method=method,
        code=code,
        start=start,
        end=end,
        result_count=result_count,
        duration=time.time() - start_time
    )
```

### 2. 错误日志

```python
def log_error(code, method, error):
    logger.error(
        "tdx_api_error",
        code=code,
        method=method,
        error_type=type(error).__name__,
        error_message=str(error)
    )
```

### 3. 性能日志

```python
import time

def timed_call(code):
    start = time.time()
    result = adapter.get_stock_day(code, '2024-01-01', '2024-12-31')
    duration = time.time() - start
    logger.info(f"获取 {code} 耗时: {duration:.3f}s, 数据量: {len(result) if result else 0}")
    return result
```

---

## 安全建议

### 1. 避免硬编码敏感信息

**反例：**

```python
API_KEY = "sk-xxxxxx"  # 不要硬编码
```

**正例：**

```python
import os

API_KEY = os.getenv('API_KEY')
```

### 2. 限制请求频率

```python
import time
from collections import deque

class RateLimiter:
    def __init__(self, max_calls=10, period=1.0):
        self._calls = deque()
        self._max_calls = max_calls
        self._period = period

    def __call__(self, func):
        def wrapper(*args, **kwargs):
            now = time.time()
            while self._calls and self._calls[0] < now - self._period:
                self._calls.popleft()

            if len(self._calls) >= self._max_calls:
                sleep_time = self._period - (now - self._calls[0])
                if sleep_time > 0:
                    time.sleep(sleep_time)

            self._calls.append(time.time())
            return func(*args, **kwargs)
        return wrapper

rate_limiter = RateLimiter(max_calls=10, period=1.0)

@rate_limiter
def get_stock_data(code):
    return adapter.get_stock_day(code, '2024-01-01', '2024-12-31')
```

### 3. 网络隔离

```python
import os

if os.getenv('PRODUCTION'):
    TDX_DEFAULT_TIMEOUT = 2.0
    pool = get_tdx_pool()
    pool._max_connections = 5  # 生产环境限制连接数
else:
    TDX_DEFAULT_TIMEOUT = 5.0
    pool = get_tdx_pool()
    pool._max_connections = 20  # 开发环境可多用
```

---

## 生产环境建议

### 1. 监控告警

```python
from prometheus_client import Counter, Histogram

tdx_requests = Counter(
    'tdx_requests_total',
    'Total TDX requests',
    ['method', 'status']
)

tdx_duration = Histogram(
    'tdx_request_duration_seconds',
    'TDX request duration',
    ['method']
)

def monitored_get_stock_day(code, start, end):
    start_time = time.time()
    try:
        result = adapter.get_stock_day(code, start, end)
        tdx_requests.labels(method='get_stock_day', status='success').inc()
        return result
    except Exception as e:
        tdx_requests.labels(method='get_stock_day', status='error').inc()
        raise
    finally:
        duration = time.time() - start_time
        tdx_duration.labels(method='get_stock_day').observe(duration)
```

### 2. 连接池隔离

```python
pool = get_tdx_pool()
pool._max_connections = 10

import atexit
atexit.register(pool.close_all)
```

### 3. 优雅关闭

```python
import signal
import sys

def graceful_shutdown(signum, frame):
    logger.info("收到关闭信号，正在关闭...")
    pool = get_tdx_pool()
    pool.close_all()
    sys.exit(0)

signal.signal(signal.SIGTERM, graceful_shutdown)
signal.signal(signal.SIGINT, graceful_shutdown)
```

---

## 测试建议

### 1. Mock IP Selector

```python
import unittest
from unittest.mock import patch

class TestTdxStockAdapter(unittest.TestCase):
    @patch('FQData.DataSource.adapters.tdx.ip_selector.TdxIPSelector.select_best_ip')
    def test_get_stock_day(self, mock_select):
        mock_select.return_value = {
            'stock': {'ip': '127.0.0.1', 'port': 7709},
            'future': {'ip': '127.0.0.1', 'port': 7709}
        }
        adapter = TdxStockAdapter()
        data = adapter.get_stock_day('600000', '2024-01-01', '2024-01-31')
        self.assertIsNotNone(data)
```

### 2. 测试数据验证

```python
def test_kline_data_integrity():
    df = adapter.get_stock_day('600000', '2024-01-01', '2024-12-31')

    assert df is not None
    assert len(df) > 0
    assert all(df['high'] >= df['low'])
    assert all(df['close'] <= df['high'])
    assert all(df['close'] >= df['low'])
```

---

## 相关文档

- [TDX README](README.md)
- [TDX 架构说明](architecture.md)
- [TDX 设计文档](design.md)
- [TDX 框架文档](framework.md)
- [TDX API 参考](api.md)
- [TDX 使用指南](usage.md)
- [TDX 开发指南](development.md)
- [TDX FAQ](faq.md)
- [TDX 更新日志](changelog.md)
- [TDX 配置说明](config.md)
- [TDX 连接池与健康检查](connection_pool.md)
