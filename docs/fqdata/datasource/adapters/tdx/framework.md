# TDX 适配器框架文档

## 概述

TDX 适配器是 FQData DataSource 模块中的通达信数据适配器，提供股票、指数、期货、债券、港股、期权等金融数据的获取能力。本文档详细说明其与框架的集成方式、初始化流程和生命周期管理。

---

## 框架集成

### 继承关系

```
DataSourceAdapter (抽象基类，FQData/DataSource/base.py)
    │
    └── TdxBaseAdapter (通达信适配器基类)
            │
            ├── TdxStockAdapter (股票数据)
            ├── TdxIndexAdapter (指数数据)
            ├── TdxFutureAdapter (期货数据)
            ├── TdxBondAdapter (债券数据)
            ├── TdxHKStockAdapter (港股数据)
            ├── TdxOptionAdapter (期权数据)
            ├── TdxRealtimeAdapter (实时行情)
            ├── TdxTransactionAdapter (成交分笔)
            ├── TdxMacroAdapter (宏观数据)
            ├── TdxExchangeAdapter (交易所数据)
            ├── TdxExtensionAdapter (扩展数据)
            └── TdxToolsAdapter (工具类)
```

### 模块位置

```
FQData/
└── DataSource/
    └── adapters/
        └── tdx/
            ├── __init__.py           # 模块导出
            ├── base.py               # TdxBaseAdapter 基类
            ├── stock.py              # TdxStockAdapter
            ├── index.py             # TdxIndexAdapter
            ├── future.py             # TdxFutureAdapter
            ├── bond.py               # TdxBondAdapter
            ├── hkstock.py            # TdxHKStockAdapter
            ├── option.py             # TdxOptionAdapter
            ├── realtime.py           # TdxRealtimeAdapter
            ├── transaction.py        # TdxTransactionAdapter
            ├── macro.py              # TdxMacroAdapter
            ├── exchange.py           # TdxExchangeAdapter
            ├── extension.py          # TdxExtensionAdapter
            ├── tools.py             # 工具函数
            ├── ip_selector.py        # IP 选择器
            ├── connection_pool.py    # 连接池
            ├── block.py             # 板块数据
            └── financial.py         # 财务数据
```

---

## 初始化

### TdxBaseAdapter 初始化

```python
from FQData.DataSource.adapters.tdx import TdxBaseAdapter

adapter = TdxBaseAdapter(
    name="tdx",           # 适配器名称
    timeout=None          # 超时时间，None 则从环境变量读取
)
```

**参数说明：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `name` | `str` | `"tdx"` | 适配器名称 |
| `timeout` | `float` | `None` | 超时时间，None 从 `TDX_DEFAULT_TIMEOUT` 环境变量读取，默认 0.7s |

**初始化流程：**

```python
def __init__(self, name: str = "tdx", timeout: float = None):
    super().__init__(name)                           # 1. 调用父类初始化
    self._ip_selector = TdxIPSelector()               # 2. 初始化 IP 选择器
    self._timeout = timeout or _get_configurable_timeout()  # 3. 设置超时
    self._connect()                                  # 4. 建立连接
```

### 子类初始化

```python
from FQData.DataSource.adapters.tdx import TdxStockAdapter

adapter = TdxStockAdapter(timeout=2.0)
```

子类继承 `TdxBaseAdapter` 的初始化逻辑，同时继承连接管理和 IP 选择功能。

---

## 生命周期

### 实例创建

```python
adapter = TdxStockAdapter()

# 初始化过程：
# 1. 创建 TdxIPSelector 单例
# 2. 设置超时时间
# 3. 调用 _connect() 建立连接
# 4. _connected 标志置为 True
```

### 连接建立 (_connect)

```python
def _connect(self) -> bool:
    try:
        self._ip_selector.select_best_ip()  # 选择最优 IP
        self._connected = True
        return True
    except (ConnectionError, OSError) as e:
        logger.warning(f"Tdx connection failed: {str(e)}")
        self._connected = False
        return False
```

### 健康检查 (health_check)

```python
def health_check(self) -> bool:
    try:
        ip, port = self._get_mainmarket_ip()
        if ip is None:
            return False
        api = TdxHq_API()
        timeout = max(self._timeout, 1.0)
        with api.connect(ip, port, time_out=timeout):
            return api.get_security_list(0, 1) is not None
    except Exception as e:
        logger.warning(f"Tdx health check failed: {str(e)}")
        return False
```

### 连接上下文管理器

TDX 适配器使用上下文管理器管理连接生命周期：

```python
with self._hq_connection() as api:
    data = api.get_security_bars(...)

# 上下文管理器自动：
# 1. 从连接池获取连接
# 2. 执行数据获取
# 3. 归还连接（或在异常时断开）
```

### 断开连接 (disconnect)

```python
def disconnect(self) -> None:
    self._connected = False
```

**注意：** `disconnect()` 只设置 `_connected` 标志为 `False`，不关闭实际的网络连接。实际连接由连接池管理。

---

## 超时管理

### 环境变量配置

```bash
export TDX_DEFAULT_TIMEOUT=0.7
```

### 代码配置

**实例级别：**

```python
adapter = TdxStockAdapter(timeout=2.0)
```

**类级别：**

```python
TdxBaseAdapter.set_default_timeout(1.0)
```

### 超时配置优先级

| 优先级 | 配置方式 | 示例 |
|--------|----------|------|
| 1 | 实例参数 | `TdxStockAdapter(timeout=2.0)` |
| 2 | 类方法 | `TdxBaseAdapter.set_default_timeout(1.0)` |
| 3 | 环境变量 | `export TDX_DEFAULT_TIMEOUT=0.7` |
| 4 | 默认值 | `0.7` 秒 |

---

## IP 选择机制

### IP 选择流程

```python
# 1. __init__ 调用 _connect()
# 2. _connect() 调用 _ip_selector.select_best_ip()
# 3. select_best_ip() 测速并选择最优 IP
# 4. 结果缓存到类变量 _best_ip
```

### IP 选择器单例

```python
class TdxIPSelector:
    _best_ip = None  # 类变量缓存

    @classmethod
    def select_best_ip(cls):
        if cls._best_ip is not None:
            return cls._best_ip

        # 测速所有 IP
        best_stock_ip = cls.get_best_ip(TDX_stock_ip_list, 'stock')
        best_future_ip = cls.get_best_ip(TDX_future_ip_list, 'future')

        cls._best_ip = {'stock': best_stock_ip, 'future': best_future_ip}
        return cls._best_ip
```

### 手动重置 IP 缓存

```python
from FQData.DataSource.adapters.tdx import TdxIPSelector

TdxIPSelector.reset()  # 清除缓存，强制重新选择
```

---

## 连接池集成

### 连接池获取

```python
from FQData.DataSource.adapters.tdx.connection_pool import get_tdx_pool

pool = get_tdx_pool()  # 获取单例
```

### HQ 连接获取

```python
with self._hq_connection() as api:
    # api 是 TdxHq_API 实例
    data = api.get_security_bars(category, market, code, offset, count)
# 连接自动归还
```

### EX-HQ 连接获取

```python
with self._ex_connection() as apix:
    # apix 是 TdxExHq_API 实例
    data = apix.get_instrument_bars(category, market, code, offset, count)
# 连接自动归还
```

---

## 重试机制

### @retry 装饰器

所有数据获取方法都使用 `@retry` 装饰器：

```python
@retry(stop_max_attempt_number=3, wait_random_min=50, wait_random_max=100)
def get_stock_day(self, code, start, end, frequence="day"):
    ...
```

**参数：**

| 参数 | 值 | 说明 |
|------|-----|------|
| `stop_max_attempt_number` | 3 | 最大重试次数 |
| `wait_random_min` | 50ms | 最小等待时间 |
| `wait_random_max` | 100ms | 最大等待时间 |

### 重试流程

```
请求失败
    │
    ▼
等待 50-100ms 随机时间
    │
    ▼
_ip_selector.select_best_ip() 重新选择 IP
    │
    ▼
使用新 IP 重试
    │
    ▼
最多重试 3 次
```

---

## 与其他框架组件的集成

### 与 DataStore 集成

```python
from FQData.DataStore.savers import TdxStockSaver

saver = TdxStockSaver()
saver.save_data(data)  # 保存到 DataStore
```

### 与 DataStruct 集成

```python
from FQData.DataStruct import StockDataFrame

df = StockDataFrame(data)  # 转换为 StockDataFrame
```

### 与 DataSourceFacade 集成

```python
from FQData.DataSource import DataSourceFacade

facade = DataSourceFacade()

# 优先使用 TDX
data = facade.get_stock_day("600000", "2024-01-01", "2024-12-31")
```

---

## 配置

### 配置文件位置

TDX 适配器使用 FQBase 的 SETTING 配置系统：

```ini
# config.ini 或 settings.ini
[IPLIST]
exclude = [{'ip': '1.2.3.4', 'port': 7709}]
default = {'stock': {'ip': '106.14.201.200', 'port': 7709}, 'future': {'ip': '112.95.244.183', 'port': 7709}}
```

### 配置读取

```python
from FQBase.Config import SETTING

exclude_ip = SETTING.get_config(section='IPLIST', option='exclude', default_value=[])
default_ip = SETTING.get_config(section='IPLIST', option='default', default_value={})
```

---

## 依赖

| 依赖 | 版本 | 用途 |
|------|------|------|
| `pytdx` | >=1.88 | 通达信 API 接口 |
| `pandas` | - | 数据处理 |
| `FQBase` | - | 基础组件、配置、日志 |

---

## 相关文档

- [TDX README](README.md)
- [TDX 架构说明](architecture.md)
- [TDX 设计文档](design.md)
- [TDX API 参考](api.md)
- [TDX 使用指南](usage.md)
- [TDX 最佳实践](best-practices.md)
- [TDX FAQ](faq.md)
- [TDX 更新日志](changelog.md)
- [TDX 配置说明](config.md)
- [TDX 连接池与健康检查](connection_pool.md)
- [TDX Base API](base.md)
- [TDX Base 开发指南](base_development.md)
- [TDX Base FAQ](base_faq.md)
- [DataSource 模块](../README.md)
- [DataSource API](../api.md)
- [适配器索引](./README.md)
