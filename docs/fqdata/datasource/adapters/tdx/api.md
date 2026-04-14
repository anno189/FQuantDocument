# TDX 适配器 API 参考

## 概述

本文档提供 TDX 适配器完整的 API 参考，包括所有类、方法和函数的详细说明。

---

## 模块导入

```python
from FQData.DataSource.adapters.tdx import (
    TdxBaseAdapter,
    TdxStockAdapter,
    TdxIndexAdapter,
    TdxFutureAdapter,
    TdxBondAdapter,
    TdxHKStockAdapter,
    TdxOptionAdapter,
    TdxMacroAdapter,
    TdxExchangeAdapter,
    TdxRealtimeAdapter,
    TdxTransactionAdapter,
    TdxExtensionAdapter,
    TdxToolsAdapter,
    TdxIPSelector,
    TdxDataManager,
    TdxHistoryFinancialCrawler,
    TdxHistoryFinancialReader,
)
```

---

## TdxBaseAdapter

### 类签名

```python
class TdxBaseAdapter(DataSourceAdapter)
```

所有 TDX 适配器的基类。

### 属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `name` | `str` | 适配器名称 |
| `is_connected` | `bool` | 是否已连接 |
| `_timeout` | `float` | 超时时间（秒） |

### 类方法

#### `set_default_timeout(timeout: float) -> None`

设置默认超时时间。

```python
TdxBaseAdapter.set_default_timeout(1.0)
```

**参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `timeout` | `float` | 是 | 超时时间（秒） |

### 实例方法

#### `health_check() -> bool`

健康检查。

```python
adapter = TdxStockAdapter()
if adapter.health_check():
    print("数据源健康")
```

**返回值：** `bool` - 数据源是否可用

#### `disconnect() -> None`

断开连接。

```python
adapter.disconnect()
```

---

## TdxStockAdapter

### 类签名

```python
class TdxStockAdapter(TdxBaseAdapter)
```

股票数据适配器。

### 方法

#### `get_stock_list(type_: str = 'stock') -> pd.DataFrame`

获取股票列表。

```python
adapter = TdxStockAdapter()
df = adapter.get_stock_list('stock')
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `type_` | `str` | `'stock'` | 证券类型 |

**type_ 可选值：**

| 值 | 说明 |
|----|------|
| `'stock'` / `'gp'` | 股票 |
| `'index'` / `'zs'` | 指数 |
| `'etf'` / `'ETF'` | ETF 基金 |
| `'bond'` | 债券 |
| `'bond2'` | 可转债 |
| `'fund'` | 基金 |
| `'reverse'` / `'repo'` | 逆回购 |
| `'stockb'` / `'b'` | B 股 |
| `'bj'` | 北交所 |
| `'delist'` / `'退市'` | 退市股票 |
| `'industry_cn'` | 行业 |
| `'all'` | 所有证券 |

**返回值：** `pd.DataFrame`

**DataFrame 字段：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `code` | `str` | 证券代码 |
| `name` | `str` | 证券名称 |
| `sse` | `str` | 交易所 (`sh`/`sz`/`bj`) |
| `sec` | `str` | 证券类型 |

---

#### `get_stock_day(code: Union[str, List[str]], start: str, end: str, frequence: str = 'day') -> Optional[pd.DataFrame]`

获取股票日线/周期线数据。

```python
df = adapter.get_stock_day(
    code='600000',
    start='2024-01-01',
    end='2024-12-31',
    frequence='day'
)
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `code` | `str` 或 `List[str]` | 必填 | 股票代码 |
| `start` | `str` | 必填 | 开始日期 (YYYY-MM-DD) |
| `end` | `str` | 必填 | 结束日期 (YYYY-MM-DD) |
| `frequence` | `str` | `'day'` | K 线频率 |

**frequence 可选值：**

| 值 | 说明 |
|----|------|
| `'day'` | 日线 |
| `'week'` | 周线 |
| `'month'` | 月线 |
| `'quarter'` | 季线 |
| `'year'` | 年线 |

**返回值：** `Optional[pd.DataFrame]` - 无数据时返回 `None`

**DataFrame 字段：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `date` | `str` | 日期 (YYYY-MM-DD) |
| `open` | `float` | 开盘价 |
| `high` | `float` | 最高价 |
| `low` | `float` | 最低价 |
| `close` | `float` | 收盘价 |
| `volume` | `float` | 成交量 |
| `amount` | `float` | 成交额 |
| `code` | `str` | 股票代码 |
| `date_stamp` | `float` | 日期时间戳 |

---

#### `get_stock_min(code: Union[str, List[str]], start: str, end: str, frequence: str = '1min') -> Optional[pd.DataFrame]`

获取股票分钟数据。

```python
df = adapter.get_stock_min(
    code='600000',
    start='2024-01-01',
    end='2024-01-31',
    frequence='5min'
)
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `code` | `str` 或 `List[str]` | 必填 | 股票代码 |
| `start` | `str` | 必填 | 开始日期 (YYYY-MM-DD) |
| `end` | `str` | 必填 | 结束日期 (YYYY-MM-DD) |
| `frequence` | `str` | `'1min'` | K 线频率 |

**frequence 可选值：**

| 值 | 说明 |
|----|------|
| `'1min'` | 1 分钟 |
| `'5min'` | 5 分钟 |
| `'15min'` | 15 分钟 |
| `'30min'` | 30 分钟 |
| `'60min'` | 60 分钟 |

**返回值：** `Optional[pd.DataFrame]`

**DataFrame 字段：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `datetime` | `str` | 日期时间 |
| `date` | `str` | 日期 |
| `open` | `float` | 开盘价 |
| `high` | `float` | 最高价 |
| `low` | `float` | 最低价 |
| `close` | `float` | 收盘价 |
| `volume` | `float` | 成交量 |
| `amount` | `float` | 成交额 |
| `code` | `str` | 股票代码 |
| `date_stamp` | `float` | 日期时间戳 |
| `time_stamp` | `float` | 时间戳 |
| `type` | `str` | 频率类型 |

---

#### `get_stock_info(code: str) -> Optional[pd.DataFrame]`

获取股票财务信息。

```python
df = adapter.get_stock_info('600000')
```

**参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `code` | `str` | 是 | 股票代码（6 位） |

**返回值：** `Optional[pd.DataFrame]`

---

#### `get_stock_latest(code: Union[str, List[str]], frequence: str = 'day') -> pd.DataFrame`

获取股票最新一根 K 线。

```python
df = adapter.get_stock_latest('600000', 'day')
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `code` | `str` 或 `List[str]` | 必填 | 股票代码 |
| `frequence` | `str` | `'day'` | K 线频率 |

**返回值：** `pd.DataFrame`

---

#### `get_stock_xdxr(code: str) -> Optional[pd.DataFrame]`

获取除权除息信息。

```python
df = adapter.get_stock_xdxr('600000')
```

**返回值：** `Optional[pd.DataFrame]`

---

#### `get_stock_block() -> pd.DataFrame`

获取股票板块数据。

```python
df = adapter.get_stock_block()
```

**返回值：** `pd.DataFrame`

**字段：** `code`, `name`, `type` (gn/zs/fg)

---

#### `get_stock_delist() -> pd.DataFrame`

获取退市股票列表。

```python
df = adapter.get_stock_delist()
```

**返回值：** `pd.DataFrame`

---

## TdxIndexAdapter

### 类签名

```python
class TdxIndexAdapter(TdxBaseAdapter)
```

指数数据适配器。

### 方法

#### `get_index_day(code, start, end, frequence='day') -> Optional[pd.DataFrame]`

获取指数日线数据。

```python
adapter = TdxIndexAdapter()
df = adapter.get_index_day('000001', '2024-01-01', '2024-12-31')
```

---

#### `get_index_min(code, start, end, frequence='1min') -> Optional[pd.DataFrame]`

获取指数分钟数据。

```python
df = adapter.get_index_min('000001', '2024-01-01', '2024-01-31', '5min')
```

---

#### `get_index_list() -> pd.DataFrame`

获取指数列表。

```python
df = adapter.get_index_list()
```

---

#### `get_etf_list() -> pd.DataFrame`

获取 ETF/LOF 基金列表。

```python
df = adapter.get_etf_list()
```

---

#### `get_index_latest(code, frequence='day') -> pd.DataFrame`

获取指数最新 K 线。

```python
df = adapter.get_index_latest('000001')
```

---

## TdxFutureAdapter

### 类签名

```python
class TdxFutureAdapter(TdxBaseAdapter)
```

期货数据适配器。

### 方法

#### `get_future_day(code, start, end, frequence='day', category=None) -> Optional[pd.DataFrame]`

获取期货日线数据。

```python
adapter = TdxFutureAdapter()
df = adapter.get_future_day('IF2401', '2024-01-01', '2024-12-31')
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `code` | `str` | 必填 | 期货代码 |
| `start` | `str` | 必填 | 开始日期 |
| `end` | `str` | 必填 | 结束日期 |
| `frequence` | `str` | `'day'` | 频率 |
| `category` | `int` | `None` | 市场类别 |

---

#### `get_future_min(code, start, end, frequence='1min', category=None) -> Optional[pd.DataFrame]`

获取期货分钟数据。

```python
df = adapter.get_future_min('IF2401', '2024-01-01', '2024-01-31', '5min')
```

---

#### `get_extensionmarket_list(renew=False) -> pd.DataFrame`

获取扩展市场代码列表。

```python
df = adapter.get_extensionmarket_list()
```

---

#### `get_future_realtime(code: str) -> pd.DataFrame`

获取期货实时行情。

```python
df = adapter.get_future_realtime('IF2401')
```

---

#### `get_future_transaction(code, start, end, retry=4) -> Optional[pd.DataFrame]`

获取期货历史成交分笔。

```python
df = adapter.get_future_transaction('IF2401', '2024-01-01', '2024-01-31')
```

---

#### `get_future_transaction_realtime(code: str) -> pd.DataFrame`

获取期货实时分笔。

```python
df = adapter.get_future_transaction_realtime('IF2401')
```

---

## TdxBondAdapter

### 类签名

```python
class TdxBondAdapter(TdxBaseAdapter)
```

债券数据适配器。

### 方法

#### `get_bond_day(code, start, end, frequence='day') -> Optional[pd.DataFrame]`

获取债券日线数据。

```python
adapter = TdxBondAdapter()
df = adapter.get_bond_day('019540', '2024-01-01', '2024-12-31')
```

---

#### `get_bond_min(code, start, end, frequence='1min') -> Optional[pd.DataFrame]`

获取债券分钟数据。

```python
df = adapter.get_bond_min('019540', '2024-01-01', '2024-01-31', '5min')
```

---

#### `get_bond_list() -> pd.DataFrame`

获取债券列表。

```python
df = adapter.get_bond_list()
```

---

#### `get_bond2stock_list() -> pd.DataFrame`

获取可转债列表。

```python
df = adapter.get_bond2stock_list()
```

---

## TdxIPSelector

### 类签名

```python
class TdxIPSelector
```

服务器 IP 选择器（单例模式）。

### 类方法

#### `select_best_ip() -> Dict[str, Dict[str, Optional[int]]]`

选择最优 IP（主板和期货市场）。

```python
from FQData.DataSource.adapters.tdx import TdxIPSelector

best_ip = TdxIPSelector.select_best_ip()
# {'stock': {'ip': '1.2.3.4', 'port': 7709}, 'future': {'ip': '5.6.7.8', 'port': 7709}}
```

**返回值：**

```python
Dict[str, Dict[str, Optional[int]]]
```

---

#### `get_mainmarket_ip(ip=None, port=None) -> Tuple[str, int]`

获取主板市场 IP。

```python
ip, port = TdxIPSelector.get_mainmarket_ip()
```

---

#### `get_extensionmarket_ip(ip=None, port=None) -> Tuple[str, int]`

获取期货市场 IP。

```python
ip, port = TdxIPSelector.get_extensionmarket_ip()
```

---

#### `get_ip_list(ip_list=None, n=0, type_='stock', cache_age=86400) -> List[Dict]`

获取排序后的 IP 列表。

```python
ip_list = TdxIPSelector.get_ip_list(type_='stock', n=5)
```

---

#### `ping(ip: str, port: int = 7709, type_: str = 'stock') -> timedelta`

测试 IP 响应时间。

```python
from datetime import timedelta

delay = TdxIPSelector.ping('1.2.3.4', 7709, 'stock')
print(f"响应时间: {delay.total_seconds():.3f}s")
```

---

#### `reset() -> None`

重置 IP 缓存。

```python
TdxIPSelector.reset()
```

---

## TdxConnectionPool

### 类签名

```python
class TdxConnectionPool
```

连接池（单例模式）。

### 方法

#### `get_hq_connection(ip: str, port: int, timeout: float = 10) -> Optional[TdxHq_API]`

获取 HQ 连接。

```python
from FQData.DataSource.adapters.tdx.connection_pool import get_tdx_pool

pool = get_tdx_pool()
api = pool.get_hq_connection('1.2.3.4', 7709, 10)
```

---

#### `return_hq_connection(api: TdxHq_API) -> None`

归还 HQ 连接。

```python
pool.return_hq_connection(api)
```

---

#### `get_ex_connection(ip: str, port: int, timeout: float = 10) -> Optional[TdxExHq_API]`

获取 EX-HQ 连接。

---

#### `return_ex_connection(api: TdxExHq_API) -> None`

归还 EX-HQ 连接。

---

#### `close_all() -> None`

关闭所有连接。

```python
pool.close_all()
```

---

### 属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `hq_count` | `int` | 当前 HQ 连接数 |
| `ex_count` | `int` | 当前 EX-HQ 连接数 |

---

## 工具函数

### `get_tdx_freq_params(frequence: str, is_future: bool = False) -> tuple`

获取通达信频率参数。

```python
from FQData.DataSource.adapters.tdx.tools import get_tdx_freq_params

category, type_, lens_multiplier = get_tdx_freq_params('5min')
# category=0, type_='5min', lens_multiplier=48
```

**返回值：** `tuple` - (category, type_, lens_multiplier)

---

### `get_market_by_code(code: str) -> int`

根据股票代码获取市场代码。

```python
from FQData.DataSource.adapters.tdx.tools import get_market_by_code

market = get_market_by_code('600000')  # 返回 1 (上海)
market = get_market_by_code('000001')  # 返回 0 (深圳)
```

**返回值：** `int` - 市场代码 (0=深圳, 1=上海)

---

### `fetch_all_security_list(api: TdxHq_API) -> pd.DataFrame`

获取所有证券列表。

---

### `filter_security_list(data: pd.DataFrame, type_: str) -> pd.DataFrame`

过滤证券列表。

---

## 异常类

### DataSourceConnectionError

数据源连接错误。

```python
from FQData.DataSource.base import DataSourceConnectionError

try:
    adapter.get_stock_day('600000', '2024-01-01', '2024-12-31')
except DataSourceConnectionError as e:
    print(f"连接错误: {e.code}")  # TDX_NOT_CONNECTED
```

**属性：**

| 属性 | 类型 | 说明 |
|------|------|------|
| `code` | `str` | 错误码 |
| `details` | `dict` | 详细信息 |

---

### DataNotFoundError

数据未找到错误。

```python
from FQData.DataSource.base import DataNotFoundError

try:
    adapter.get_stock_day('000000', '2024-01-01', '2024-12-31')
except DataNotFoundError as e:
    print(f"未找到: {e.code}")  # INVALID_CODE
```

---

### DataSourceAPIError

API 调用错误。

```python
from FQData.DataSource.base import DataSourceAPIError
```

---

## 常量

### K 线频率 category 值

| 频率 | category |
|------|-----------|
| 日线 | 9 |
| 周线 | 5 |
| 月线 | 6 |
| 季线 | 10 |
| 年线 | 11 |
| 1 分钟 | 8 |
| 5 分钟 | 0 |
| 15 分钟 | 1 |
| 30 分钟 | 2 |
| 60 分钟 | 3 |

---

## 相关文档

- [TDX README](README.md)
- [TDX 架构说明](architecture.md)
- [TDX 设计文档](design.md)
- [TDX 框架文档](framework.md)
- [TDX 使用指南](usage.md)
- [TDX 最佳实践](best-practices.md)
- [TDX 开发指南](development.md)
- [TDX FAQ](faq.md)
- [TDX 更新日志](changelog.md)
- [TDX 配置说明](config.md)
- [TDX 连接池与健康检查](connection_pool.md)
