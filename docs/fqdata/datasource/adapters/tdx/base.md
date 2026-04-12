# TDX Base API 参考

## TdxBaseAdapter

通达信适配器基类，所有 TDX 适配器的父类，提供公共功能和接口定义。

```python
from FQData.DataSource.adapters.tdx.base import TdxBaseAdapter

adapter = TdxBaseAdapter()
```

### 类属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `_default_timeout` | float | 0.7 | 默认超时时间（秒） |
| `_default_timeout_init` | float | 1.0 | 初始化超时时间（秒） |

### 实例属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `is_connected` | bool | 检查是否已连接 |
| `_ip_selector` | TdxIPSelector | IP 选择器实例 |
| `_timeout` | float | 当前超时时间（秒） |

### 类方法

#### set_default_timeout

设置默认超时时间。

```python
TdxBaseAdapter.set_default_timeout(timeout: float) -> None
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `timeout` | float | 超时时间（秒） |

**示例：**

```python
TdxBaseAdapter.set_default_timeout(1.0)
```

#### get_default_timeout

获取默认超时时间。

```python
TdxBaseAdapter.get_default_timeout() -> float
```

**返回：** float - 超时时间（秒）

---

### 实例方法

#### \_\_init\_\_

初始化适配器。

```python
def __init__(self, name: str = "tdx", timeout: float = None)
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `name` | str | "tdx" | 适配器名称 |
| `timeout` | float | None | 超时时间，为 None 时从环境变量读取 |

**示例：**

```python
adapter = TdxBaseAdapter(name="tdx", timeout=1.0)
```

#### _connect

建立连接。

```python
def _connect(self) -> bool
```

**返回：** bool - 连接是否成功

#### disconnect

断开连接。

```python
def disconnect(self) -> None
```

#### health_check

健康检查。

```python
def health_check(self) -> bool
```

**返回：** bool - 健康状态

#### _get_mainmarket_ip

获取主板市场 IP。

```python
def _get_mainmarket_ip(self, ip: str = None, port: int = None) -> Tuple[str, int]
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `ip` | str | None | IP 地址（可选） |
| `port` | int | None | 端口（可选） |

**返回：** Tuple[str, int] - (ip, port)

#### _get_extensionmarket_ip

获取扩展市场 IP。

```python
def _get_extensionmarket_ip(self, ip: str = None, port: int = None) -> Tuple[str, int]
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `ip` | str | None | IP 地址（可选） |
| `port` | int | None | 端口（可选） |

**返回：** Tuple[str, int] - (ip, port)

---

### 抽象方法（子类必须实现）

以下方法在基类中抛出 `NotImplementedError`，子类必须实现：

#### get_stock_day

获取股票日线数据。

```python
def get_stock_day(
    self,
    code: str,
    start: str,
    end: str,
    frequence: str = "day"
) -> Optional[pd.DataFrame]
```

#### get_stock_min

获取股票分钟数据。

```python
def get_stock_min(
    self,
    code: str,
    start: str,
    end: str,
    frequence: str = "1min"
) -> Optional[pd.DataFrame]
```

#### get_index_day

获取指数日线数据。

```python
def get_index_day(
    self,
    code: str,
    start: str,
    end: str
) -> Optional[pd.DataFrame]
```

#### get_index_min

获取指数分钟数据。

```python
def get_index_min(
    self,
    code: str,
    start: str,
    end: str,
    frequence: str = "1min"
) -> Optional[pd.DataFrame]
```

#### get_future_day

获取期货日线数据。

```python
def get_future_day(
    self,
    code: str,
    start: str,
    end: str,
    frequence: str = "day",
    category: int = None
) -> Optional[pd.DataFrame]
```

#### get_future_min

获取期货分钟数据。

```python
def get_future_min(
    self,
    code: str,
    start: str,
    end: str,
    frequence: str = "1min",
    category: int = None
) -> Optional[pd.DataFrame]
```

#### get_realtime

获取实时行情。

```python
def get_realtime(self, code: str) -> Optional[pd.DataFrame]
```

#### get_stock_info

获取股票基本信息。

```python
def get_stock_info(self, code: str) -> Optional[dict]
```

#### get_stock_realtime

获取股票实时行情。

```python
def get_stock_realtime(self, code: Union[str, List[str]]) -> Optional[pd.DataFrame]
```

#### get_index_realtime

获取指数实时行情。

```python
def get_index_realtime(self, code: Union[str, List[str]]) -> Optional[pd.DataFrame]
```

#### get_bond_realtime

获取债券实时行情。

```python
def get_bond_realtime(self, code: Union[str, List[str]]) -> Optional[pd.DataFrame]
```

#### get_depth_market_data

获取深度市场数据。

```python
def get_depth_market_data(self, code: Union[str, List[str]]) -> Optional[pd.DataFrame]
```

---

## 异常类

### DataSourceConnectionError

连接异常。

```python
from FQData.DataSource.adapters.tdx.base import DataSourceConnectionError

raise DataSourceConnectionError("连接失败", code="TDX_NOT_CONNECTED")
```

### DataNotFoundError

数据未找到异常。

```python
from FQData.DataSource.adapters.tdx.base import DataNotFoundError

raise DataNotFoundError("数据不存在", code="DATA_NOT_FOUND")
```

### DataSourceAPIError

API 调用异常。

```python
from FQData.DataSource.adapters.tdx.base import DataSourceAPIError

raise DataSourceAPIError("API 调用失败", code="API_ERROR")
```

---

## 工具函数

### _get_configurable_timeout

获取可配置的超时时间。

```python
from FQData.DataSource.adapters.tdx.base import _get_configurable_timeout

timeout = _get_configurable_timeout()  # 从环境变量 TDX_DEFAULT_TIMEOUT 读取
```

**环境变量：**

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `TDX_DEFAULT_TIMEOUT` | 0.7 | 默认超时时间（秒） |

---

## 相关文档

- [TDX README](README.md)
- [TDX 开发指南](base_development.md)
- [TDX 连接池与健康检查](connection_pool.md)
- [TDX FAQ](base_faq.md)
- [适配器索引](../README.md)