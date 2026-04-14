# TDX 适配器常见问题

## 概述

本文档汇总了 TDX 适配器的常见问题及解决方案。

---

## 基础问题

### Q1: 如何导入 TDX 适配器？

**A:** 使用以下方式导入：

```python
from FQData.DataSource.adapters.tdx import TdxStockAdapter

adapter = TdxStockAdapter()
```

**完整导入：**

```python
from FQData.DataSource.adapters.tdx import (
    TdxBaseAdapter,
    TdxStockAdapter,
    TdxIndexAdapter,
    TdxFutureAdapter,
    TdxBondAdapter,
    TdxHKStockAdapter,
    TdxOptionAdapter,
    TdxRealtimeAdapter,
    TdxTransactionAdapter,
    TdxExtensionAdapter,
    TdxMacroAdapter,
    TdxIPSelector,
)
```

---

### Q2: TDX 适配器需要哪些依赖？

**A:** 主要依赖：

```bash
pip install pytdx>=1.88
```

**可选依赖：**

```bash
pip install pandas
pip install numpy
```

---

### Q3: 如何设置超时时间？

**A:** 三种方式：

**1. 环境变量（全局）：**

```bash
export TDX_DEFAULT_TIMEOUT=0.7
```

**2. 类级别设置：**

```python
from FQData.DataSource.adapters.tdx import TdxBaseAdapter

TdxBaseAdapter.set_default_timeout(1.0)
```

**3. 实例级别设置：**

```python
from FQData.DataSource.adapters.tdx import TdxStockAdapter

adapter = TdxStockAdapter(timeout=2.0)
```

---

## 连接问题

### Q4: 连接失败怎么排查？

**A:** 按以下步骤排查：

**1. 检查网络连接：**

```python
import telnetlib

try:
    telnetlib.Telnet('106.14.201.200', 7709, timeout=5)
    print("网络可达")
except Exception as e:
    print(f"网络不可达: {e}")
```

**2. 检查 IP 是否可用：**

```python
from FQData.DataSource.adapters.tdx import TdxIPSelector

TdxIPSelector.reset()
best_ip = TdxIPSelector.select_best_ip()
print(f"最优 IP: {best_ip}")
```

**3. 测试健康检查：**

```python
adapter = TdxStockAdapter()
if adapter.health_check():
    print("健康检查通过")
else:
    print("健康检查失败")
```

---

### Q5: 如何查看当前使用的 IP？

**A:** 使用以下方式：

```python
from FQData.DataSource.adapters.tdx import TdxIPSelector

ip, port = TdxIPSelector.get_mainmarket_ip()
print(f"当前股票市场 IP: {ip}:{port}")

ip, port = TdxIPSelector.get_extensionmarket_ip()
print(f"当前期货市场 IP: {ip}:{port}")
```

---

### Q6: IP 被封禁怎么办？

**A:** 解决方案：

**1. 重置 IP 缓存：**

```python
from FQData.DataSource.adapters.tdx import TdxIPSelector

TdxIPSelector.reset()
```

**2. 排除问题 IP：**

在配置文件中添加排除列表：

```ini
[IPLIST]
exclude = [{'ip': '1.2.3.4', 'port': 7709}]
```

**3. 设置默认 IP：**

```ini
[IPLIST]
default = {'stock': {'ip': '新的可用IP', 'port': 7709}, 'future': {'ip': '新的可用IP', 'port': 7709}}
```

---

### Q7: 连接池连接数过多怎么办？

**A:** 监控并清理连接：

```python
from FQData.DataSource.adapters.tdx.connection_pool import get_tdx_pool

pool = get_tdx_pool()

print(f"HQ 连接数: {pool.hq_count}")
print(f"EX 连接数: {pool.ex_count}")

pool.close_all()
print("所有连接已关闭")
```

---

## 数据问题

### Q8: 返回 None 或空 DataFrame？

**A:** 可能原因及解决方案：

**1. 代码不存在：**

```python
code = '600000'
stock_list = adapter.get_stock_list('stock')
if code not in stock_list['code'].values:
    print(f"代码 {code} 不存在")
```

**2. 日期范围无数据：**

```python
import pandas as pd

data = adapter.get_stock_day('600000', '2024-01-01', '2024-12-31')
if data is None or data.empty:
    # 尝试获取更大范围
    data = adapter.get_stock_day('600000', '2020-01-01', '2024-12-31')
```

**3. 停牌股票：**

```python
data = adapter.get_stock_day('600000', '2024-01-01', '2024-12-31')
trading_dates = data['date'].tolist() if data is not None else []
print(f"有 {len(trading_dates)} 个交易日")
```

---

### Q9: 数据字段与预期不符？

**A:** 检查返回字段：

```python
data = adapter.get_stock_day('600000', '2024-01-01', '2024-12-31')
print("字段列表:", data.columns.tolist())
print("数据类型:", data.dtypes)
print("前几行:")
print(data.head())
```

**常见字段：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `date` | `str` | 日期 (YYYY-MM-DD) |
| `datetime` | `str` | 日期时间 |
| `open` | `float` | 开盘价 |
| `high` | `float` | 最高价 |
| `low` | `float` | 最低价 |
| `close` | `float` | 收盘价 |
| `volume` | `float` | 成交量 |
| `amount` | `float` | 成交额 |
| `code` | `str` | 证券代码 |
| `date_stamp` | `float` | 日期时间戳 |
| `time_stamp` | `float` | 时间戳 |

---

### Q10: 如何获取期货的连续合约数据？

**A:** 期货主力连续合约需要自行合成：

```python
from FQData.DataSource.adapters.tdx import TdxFutureAdapter

adapter = TdxFutureAdapter()

futures_codes = ['IF2401', 'IF2402', 'IF2403', 'IF2404']

all_data = []
for code in futures_codes:
    try:
        df = adapter.get_future_day(code, '2024-01-01', '2024-06-30')
        if df is not None and not df.empty:
            all_data.append(df)
    except Exception as e:
        print(f"获取 {code} 失败: {e}")

if all_data:
    continuous = pd.concat(all_data)
    continuous = continuous.sort_values('date')
    print(f"合并后数据量: {len(continuous)}")
```

---

### Q11: 除权除息数据如何获取？

**A:** 使用以下方法：

```python
adapter = TdxStockAdapter()

xdxr = adapter.get_stock_xdxr('600000')
print(xdxr)

if xdxr is not None and not xdxr.empty:
    print("除权除息记录数:", len(xdxr))
```

**字段说明：**

| 字段 | 说明 |
|------|------|
| `date` | 日期 |
| `category` | 类型 (1=除权除息, 5=股本变化等) |
| `liquidity_before` | 变动前流通股本 |
| `liquidity_after` | 变动后流通股本 |
| `shares_before` | 变动前总股本 |
| `shares_after` | 变动后总股本 |

---

### Q12: 如何获取退市股票数据？

**A:** 两种方式：

**1. 通过列表获取：**

```python
adapter = TdxStockAdapter()

delist = adapter.get_stock_delist()
print(delist.head())
```

**2. 通过 filter_security_list：**

```python
from FQData.DataSource.adapters.tdx import TdxStockAdapter

adapter = TdxStockAdapter()
delist = adapter.get_stock_list('delist')
```

---

## 性能问题

### Q13: 请求速度慢怎么优化？

**A:** 优化建议：

**1. 使用增量获取：**

```python
def get_stock_data_incremental(code, cache_file):
    import os
    import pandas as pd

    if os.path.exists(cache_file):
        cached = pd.read_csv(cache_file)
        last_date = cached['date'].max()
        new_data = adapter.get_stock_day(code, last_date, '2024-12-31')
        if new_data is not None:
            return pd.concat([cached, new_data]).drop_duplicates()
        return cached
    else:
        return adapter.get_stock_day(code, '2020-01-01', '2024-12-31')
```

**2. 批量请求：**

```python
from concurrent.futures import ThreadPoolExecutor

codes = ['600000', '600036', '601318']

with ThreadPoolExecutor(max_workers=3) as executor:
    results = list(executor.map(
        lambda c: adapter.get_stock_day(c, '2024-01-01', '2024-12-31'),
        codes
    ))
```

**3. 启用缓存：**

```python
from FQData.DataStore import get_cache

cache = get_cache('memory')
cache_key = 'stock_600000_daily'

cached_data = cache.get(cache_key)
if cached_data is None:
    cached_data = adapter.get_stock_day('600000', '2024-01-01', '2024-12-31')
    cache.set(cache_key, cached_data, ttl=300)
```

---

### Q14: 如何避免频繁请求被限流？

**A:** 实现请求限流：

```python
import time
from collections import deque

class TDXRateLimiter:
    def __init__(self, max_per_second=5):
        self._max_per_second = max_per_second
        self._timestamps = deque()

    def wait(self):
        now = time.time()
        while self._timestamps and self._timestamps[0] < now - 1:
            self._timestamps.popleft()

        if len(self._timestamps) >= self._max_per_second:
            sleep_time = 1 - (now - self._timestamps[0])
            if sleep_time > 0:
                time.sleep(sleep_time)

        self._timestamps.append(time.time())

limiter = TDXRateLimiter(max_per_second=5)

for code in codes:
    limiter.wait()
    data = adapter.get_stock_day(code, '2024-01-01', '2024-12-31')
```

---

### Q15: 连接复用不生效？

**A:** 检查实例是否复用：

```python
from FQData.DataSource.adapters.tdx.connection_pool import get_tdx_pool

pool = get_tdx_pool()
print(f"初始 HQ 连接数: {pool.hq_count}")

adapter1 = TdxStockAdapter()
adapter2 = TdxStockAdapter()

data1 = adapter1.get_stock_day('600000', '2024-01-01', '2024-01-10')
data2 = adapter2.get_stock_day('000001', '2024-01-01', '2024-01-10')

print(f"之后 HQ 连接数: {pool.hq_count}")
```

**注意：** 连接池是全局单例，但适配器实例之间共享。

---

## 错误处理

### Q16: 异常类型如何区分？

**A:** 三种主要异常：

```python
from FQData.DataSource.base import (
    DataSourceConnectionError,
    DataNotFoundError,
    DataSourceAPIError
)

try:
    data = adapter.get_stock_day('600000', '2024-01-01', '2024-12-31')
except DataSourceConnectionError as e:
    print(f"连接错误: {e.code}")
except DataNotFoundError as e:
    print(f"数据未找到: {e.code}")
except DataSourceAPIError as e:
    print(f"API 错误: {e.code}")
```

---

### Q17: 重试机制如何工作？

**A:** `@retry` 装饰器自动重试：

```python
@retry(stop_max_attempt_number=3, wait_random_min=50, wait_random_max=100)
def get_stock_day(...)
```

**重试逻辑：**

1. 失败后等待 50-100ms 随机时间
2. 重新选择 IP
3. 最多重试 3 次
4. 3 次都失败则抛出异常

**自定义重试：**

```python
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(
    stop=stop_after_attempt(5),
    wait=wait_exponential(multiplier=1, min=2, max=10)
)
def get_stock_day_with_retry(code, start, end):
    return adapter.get_stock_day(code, start, end)
```

---

### Q18: 如何实现降级切换？

**A:** 多数据源降级：

```python
def get_stock_data_fallback(code, start, end):
    sources = [
        ('TDX', TdxStockAdapter),
        ('AkShare', AkShareStockAdapter),
        ('EastMoney', EastMoneyStockAdapter),
    ]

    for name, AdapterClass in sources:
        try:
            adapter = AdapterClass()
            data = adapter.get_stock_day(code, start, end)
            if data is not None and not data.empty:
                print(f"通过 {name} 获取成功")
                return data
        except Exception as e:
            print(f"{name} 获取失败: {e}")
            continue

    return None
```

---

## 配置问题

### Q19: 如何配置排除的 IP 列表？

**A:** 在配置文件中设置：

```ini
[IPLIST]
exclude = [
    {'ip': '1.2.3.4', 'port': 7709},
    {'ip': '5.6.7.8', 'port': 7709}
]
```

---

### Q20: 如何设置默认 IP？

**A:** 在配置文件中设置：

```ini
[IPLIST]
default = {'stock': {'ip': '106.14.201.200', 'port': 7709}, 'future': {'ip': '112.95.244.183', 'port': 7709}}
```

---

### Q21: 环境变量配置优先级？

**A:** 配置优先级（从高到低）：

1. 代码中直接设置（`adapter = TdxStockAdapter(timeout=2.0)`）
2. 类级别设置（`TdxBaseAdapter.set_default_timeout(1.0)`）
3. 环境变量（`export TDX_DEFAULT_TIMEOUT=0.7`）
4. 默认值（0.7 秒）

---

## 进阶问题

### Q22: 如何实现自定义 IP 选择策略？

**A:** 继承并扩展：

```python
from FQData.DataSource.adapters.tdx import TdxIPSelector

class CustomIPSelector(TdxIPSelector):
    @classmethod
    def select_best_ip(cls):
        best_ip = super().select_best_ip()

        if best_ip['stock']['ip'] is None:
            best_ip['stock'] = {'ip': '自定义IP', 'port': 7709}

        return best_ip

CustomIPSelector.select_best_ip()
```

---

### Q23: 如何添加新的数据适配器？

**A:** 模板代码：

```python
from FQData.DataSource.adapters.tdx import TdxBaseAdapter
from FQData.DataSource.base import DataSourceConnectionError

class TdxNewAdapter(TdxBaseAdapter):
    def __init__(self):
        super().__init__(name="tdx_new")

    def get_new_data(self, code: str):
        if not self._connected:
            raise DataSourceConnectionError(...)

        with self._hq_connection() as api:
            data = api.to_df(api.new_api(...))
            return data
```

---

### Q24: 如何监控 TDX 适配器状态？

**A:** 实现监控：

```python
import time
from prometheus_client import Counter, Gauge

tdx_connection_status = Gauge(
    'tdx_connection_status',
    'TDX connection status',
    ['market']
)

tdx_request_duration = Histogram(
    'tdx_request_duration_seconds',
    'TDX request duration',
    ['method']
)

def monitored_get_stock_day(code, start, end):
    start_time = time.time()

    tdx_connection_status.labels(market='stock').set(1 if adapter.is_connected else 0)

    try:
        with tdx_request_duration.labels(method='get_stock_day').time():
            return adapter.get_stock_day(code, start, end)
    finally:
        tdx_connection_status.labels(market='stock').set(1 if adapter.is_connected else 0)
```

---

### Q25: 如何处理时区问题？

**A:** 通达信数据默认北京时间，无需特别处理。如需转换：

```python
import pytz

data = adapter.get_stock_min('600000', '2024-01-01', '2024-01-02', '5min')

data['datetime'] = pd.to_datetime(data['datetime'])

beijing_tz = pytz.timezone('Asia/Shanghai')
data['datetime_beijing'] = data['datetime'].dt.tz_localize(beijing_tz)

data['datetime_utc'] = data['datetime'].dt.tz_convert('UTC')
```

---

## 相关文档

- [TDX README](README.md)
- [TDX 架构说明](architecture.md)
- [TDX 设计文档](design.md)
- [TDX 框架文档](framework.md)
- [TDX API 参考](api.md)
- [TDX 使用指南](usage.md)
- [TDX 最佳实践](best-practices.md)
- [TDX 开发指南](development.md)
- [TDX 更新日志](changelog.md)
- [TDX 配置说明](config.md)
- [TDX 连接池与健康检查](connection_pool.md)
