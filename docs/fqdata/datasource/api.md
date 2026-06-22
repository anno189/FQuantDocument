# DataSource API 参考

## 相关文档

| 类型 | 文档 | 链接 |
|------|------|------|
| 框架集成 | DataSource 框架集成 | [framework](./framework.md) |
| 架构 | DataSource 架构文档 | [architecture](./architecture.md) |
| 设计 | DataSource 设计文档 | [design](./design.md) |
| 使用指南 | DataSource 使用指南 | [usage](./usage.md) |
| 最佳实践 | DataSource 最佳实践 | [best-practices](./best-practices.md) |

---

## DataSource 模块

### facade.py

#### DataSource 类

数据源统一入口类。

```python
from FQData.DataSource import DataSource, get_datasource

ds = DataSource()
ds = get_datasource()  # 获取单例实例
```

| 方法 | 说明 |
|------|------|
| `get_stock_day(code, start, end, adjust)` | 获取股票日线数据 |
| `get_stock_min(code, freq, start, end)` | 获取股票分钟数据 |
| `get_index_day(code, start, end)` | 获取指数日线数据 |
| `get_index_min(code, freq, start, end)` | 获取指数分钟数据 |
| `get_future_day(code, start, end)` | 获取期货日线数据 |
| `get_future_min(code, freq, start, end)` | 获取期货分钟数据 |
| `get_realtime(code)` | 获取实时行情 |
| `set_mode(mode)` | 设置数据源模式 |

#### get_datasource()

获取 DataSource 单例实例。

```python
def get_datasource() -> DataSource
```

**返回**: DataSource 实例

---

#### AsyncDataSource 类

异步数据源类。

```python
from FQData.DataSource import AsyncDataSource, get_async_datasource

async_ds = get_async_datasource()
```

---

### base.py

#### DataSourceAdapter

数据源适配器基类。

```python
from FQData.DataSource import DataSourceAdapter

class MyAdapter(DataSourceAdapter):
    def connect(self):
        pass

    def disconnect(self):
        pass

    def is_connected(self) -> bool:
        pass
```

| 方法 | 说明 |
|------|------|
| `connect()` | 建立连接 |
| `disconnect()` | 断开连接 |
| `is_connected()` | 检查连接状态 |

#### 异常类

| 异常 | 说明 |
|------|------|
| `DataSourceError` | 数据源异常基类 |
| `DataSourceConnectionError` | 连接异常 |
| `DataNotFoundError` | 数据未找到异常 |
| `DataSourceAPIError` | API 调用异常 |

#### 枚举

```python
from FQData.DataSource import MarketType, FrequenceType

# 市场类型
MarketType.SH   # 上海
MarketType.SZ   # 深圳
MarketType.BJ   # 北京
MarketType.HK   # 香港
MarketType.US   # 美国

# 频率类型
FrequenceType.DAY   # 日线
FrequenceType.WEEK  # 周线
FrequenceType.MONTH # 月线
FrequenceType.MIN_1 # 1分钟
FrequenceType.MIN_5 # 5分钟
FrequenceType.MIN_15 # 15分钟
FrequenceType.MIN_30 # 30分钟
FrequenceType.MIN_60 # 60分钟
```

---

### registry.py

#### DataSourceRegistry

数据源注册表（单例）。

```python
from FQData.DataSource import DataSourceRegistry, register_source

registry = DataSourceRegistry()
register_source('tdx', TdxAdapter)
```

| 方法 | 说明 |
|------|------|
| `register(name, adapter_class)` | 注册数据源 |
| `get(name)` | 获取数据源实例 |
| `list_sources()` | 列出所有注册的数据源 |

---

### health_check.py

#### DataSourceHealthCheck

数据源健康检查器。

```python
from FQData.DataSource import DataSourceHealthCheck

checker = DataSourceHealthCheck()
status = checker.check()
```

| 方法 | 说明 |
|------|------|
| `check()` | 检查所有数据源 |
| `check_adapter(name)` | 检查指定适配器 |

#### HealthStatus

健康状态类。

```python
from FQData.DataSource import HealthStatus

status = HealthStatus(
    status='healthy',
    message='OK',
    details={'latency': 10}
)
```

| 属性 | 说明 |
|------|------|
| `status` | 状态 (healthy/unhealthy/unknown) |
| `message` | 状态消息 |
| `details` | 详细信息字典 |
| `is_healthy` | 是否健康 |

---

### adapters/tdx/

#### TdxStockAdapter

通达信股票适配器，提供股票列表、日线、分钟线、基本面、板块等数据获取功能。

```python
from FQData.DataSource.adapters.tdx import TdxStockAdapter

adapter = TdxStockAdapter()
```

| 方法 | 说明 | 参数 |
|------|------|------|
| `get_stock_list(type_)` | 获取股票列表 | type_: 证券类型 (stock/index/etf/bond/fund/delist/all) |
| `get_stock_day(code, start, end, frequence)` | 获取股票日线/周线/月线 | frequence: day/week/month/quarter/year |
| `get_stock_min(code, start, end, frequence)` | 获取股票分钟K线 | frequence: 1min/5min/15min/30min/60min |
| `get_stock_info(code)` | 获取股票财务信息 | code: 6位股票代码 |
| `get_stock_latest(code, frequence)` | 获取最新一根K线 | frequence: 支持日线和分钟线 |
| `get_stock_xdxr(code)` | 获取除权除息信息 | code: 6位股票代码 |
| `get_stock_block()` | 获取股票板块数据 | 无 |
| `get_stock_delist()` | 获取退市股票列表 | 无 |

**支持的证券类型:**

| 类型 | 说明 |
|------|------|
| stock/gp | 股票 |
| index/zs | 指数 |
| etf/ETF | ETF基金 |
| bond | 债券 |
| bond2 | 可转债 |
| fund | 基金 |
| reverse/repo | 逆回购 |
| stockb/b | B股 |
| bj | 北交所 |
| delist/退市 | 退市股票 |
| industry_cn | 行业 |
| all | 所有证券 |

**使用示例:**

```python
# 获取股票列表
df = adapter.get_stock_list('stock')

# 获取日线数据
df = adapter.get_stock_day('600000', '2024-01-01', '2024-12-31', 'day')

# 获取分钟线数据
df = adapter.get_stock_min('600000', '2024-01-01', '2024-01-10', '5min')

# 获取退市股票列表
df = adapter.get_stock_delist()
```

#### TdxIndexAdapter

通达信指数适配器。

```python
from FQData.DataSource.adapters.tdx import TdxIndexAdapter

adapter = TdxIndexAdapter()
data = adapter.get_index_bars(code='000001', category=9, start=0, count=100)
```

#### TdxFutureAdapter

通达信期货适配器。

```python
from FQData.DataSource.adapters.tdx import TdxFutureAdapter

adapter = TdxFutureAdapter()
data = adapter.get_future_daily(code='IF2401', start='2024-01-01', end='2024-12-31')
```

#### TdxBondAdapter

通达信债券适配器。

#### TdxHKStockAdapter

通达信港股适配器。

#### TdxOptionAdapter

通达信期权适配器。

#### TdxRealtimeAdapter

通达信实时行情适配器。

#### TdxTransactionAdapter

通达信成交明细适配器。

---

### datasource_config.py

#### DataSourceConfig

数据源配置单例类。

```python
from FQData.DataSource import DataSourceConfig, get_datasource_priority

# 获取配置
config = DataSourceConfig()
priority = config.get_priority('stock')
```

| 方法 | 说明 |
|------|------|
| `get(key, default)` | 获取配置值，支持点号分隔 |
| `get_priority(asset_type)` | 获取指定资产类型的数据源优先级 |
| `get_health_check_enabled()` | 获取健康检查是否启用 |
| `get_health_check_timeout()` | 获取健康检查超时时间 |

#### get_datasource_priority()

```python
def get_datasource_priority(asset_type: str) -> List[str]
```

获取数据源优先级。

**参数**: `asset_type` - 资产类型 (stock/index/future/bond/option/hk_stock/us_stock)

**返回**: 数据源代号列表

```python
priority = get_datasource_priority('stock')
# ['tdx', 'jq']
```

#### get_health_check_config()

```python
def get_health_check_config() -> Dict[str, Any]
```

获取健康检查配置。

---

### ip_list.py

#### TDXIPListManager

通达信 IP 列表管理器。

```python
from FQData.DataSource import TDXIPListManager, get_TDX_stock_ip_list

# 获取股票服务器列表
stock_ips = TDXIPListManager.get_stock_list()
```

| 方法 | 说明 |
|------|------|
| `get_info_list()` | 获取资讯服务器列表 |
| `get_stock_list()` | 获取股票行情服务器列表 |
| `get_future_list()` | 获取期货行情服务器列表 |
| `exclude_from_stock_ip_list(exclude_list)` | 从股票列表中排除指定 IP |
| `exclude_from_future_ip_list(exclude_list)` | 从期货列表中排除指定 IP |

#### IP 列表函数

```python
from FQData.DataSource import (
    get_TDX_info_ip_list,
    get_TDX_stock_ip_list,
    get_TDX_future_ip_list,
    exclude_from_TDX_stock_ip_list,
    exclude_from_TDX_future_ip_list,
)
```

---

## 相关文档

- [README](README.md)
- [使用指南](usage.md)
- [最佳实践](best-practices.md)
- [开发指南](development.md)
- [FAQ](faq.md)