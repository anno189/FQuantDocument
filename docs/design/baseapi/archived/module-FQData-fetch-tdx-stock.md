# FQData.fetch.tdx.stock - 通达信股票数据

> 版本: v1.0
> 更新时间: 2026-03-27

---

## 一、模块概述

`FQData.fetch.tdx.stock` 提供通达信股票数据获取功能，从 `QATdx.py` 迁移而来。

**主要功能**：
- 股票行情数据（日线、分钟线）
- 股票列表查询
- 除权除息信息
- 股票基本信息
- 终止上市股票查询
- 股票分笔成交数据

**迁移状态**: ✅ 已完成迁移，测试通过 10/10

---

## 二、导入方式

```python
from FQData.fetch.tdx.stock import (
    TDX_fetch_get_security_bars,
    TDX_fetch_get_stock_day,
    TDX_fetch_get_stock_min,
    TDX_fetch_get_stock_latest,
    TDX_fetch_get_stock_realtime,
    TDX_fetch_get_stock_list,
    TDX_fetch_get_stock_xdxr,
    TDX_fetch_get_stock_info,
    TDX_fetch_get_stock_terminated,
    TDX_fetch_get_stock_transaction,
)
```

---

## 三、函数列表

### 3.1 TDX_fetch_get_security_bars - 按Bar长度获取数据

```python
def TDX_fetch_get_security_bars(
    code: str,
    _type: str,
    lens: int,
    ip: str = None,
    port: int = None
) -> pd.DataFrame
```

**参数**：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| code | str | - | 股票代码 |
| _type | str | - | 类型，如 `'stock_cn'`、`'index_cn'`、`'bond_cn'`、`'fund_cn'` |
| lens | int | - | 获取的bar数量 |
| ip | str | None | IP地址（可选） |
| port | int | None | 端口（可选） |

**返回**: `pd.DataFrame` - 包含 datetime、open、close、high、low、vol、amount、date、date_stamp、time_stamp、type、code 列

**示例**:

```python
data = TDX_fetch_get_security_bars('000001', 'stock_cn', 10)
print(data.head())
```

---

### 3.2 TDX_fetch_get_stock_day - 获取股票日线数据

```python
def TDX_fetch_get_stock_day(
    code: str,
    start_date: str,
    end_date: str,
    if_fq: str = '00',
    frequence: str = 'day',
    ip: str = None,
    port: int = None
) -> pd.DataFrame
```

**参数**：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| code | str | - | 股票代码（6位） |
| start_date | str | - | 开始日期，格式 `'2017-01-01'` |
| end_date | str | - | 结束日期，格式 `'2018-01-01'` |
| if_fq | str | '00' | 复权类型：`'00'`/`'bfq'` 不复权，`'01'`/`'qfq'` 前复权，`'02'`/`'hfq'` 后复权 |
| frequence | str | 'day' | 周期：`'day'`/`'d'` 日线，`'week'`/`'w'` 周线，`'month'`/`'m'` 月线，`'quarter'`/`'q'` 季线，`'year'`/`'y'` 年线 |
| ip | str | None | IP地址（可选） |
| port | int | None | 端口（可选） |

**返回**: `pd.DataFrame` - 日线数据，或 None（复权暂不支持）

**示例**:

```python
data = TDX_fetch_get_stock_day('000001', '2024-01-01', '2024-03-01')
print(data.head())
```

---

### 3.3 TDX_fetch_get_stock_min - 获取股票分钟线数据

```python
def TDX_fetch_get_stock_min(
    code: str,
    start: str,
    end: str,
    frequence: str = '1min',
    ip: str = None,
    port: int = None
) -> pd.DataFrame
```

**参数**：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| code | str | - | 股票代码 |
| start | str | - | 开始时间，格式 `'2024-01-01'` |
| end | str | - | 结束时间，格式 `'2024-03-01'` |
| frequence | str | '1min' | 分钟周期：`'1min'`/`'1m'` 1分钟，`'5min'`/`'5m'` 5分钟，`'15min'`/`'15m'` 15分钟，`'30min'`/`'30m'` 30分钟，`'60min'`/`'60m'` 60分钟 |
| ip | str | None | IP地址（可选） |
| port | int | None | 端口（可选） |

**返回**: `pd.DataFrame` - 分钟数据

**示例**:

```python
data = TDX_fetch_get_stock_min('000001', '2024-01-01', '2024-03-01', '5min')
print(data.head())
```

---

### 3.4 TDX_fetch_get_stock_latest - 获取股票最新行情

```python
def TDX_fetch_get_stock_latest(
    code,
    frequence: str = 'day',
    ip: str = None,
    port: str = None
)
```

**参数**：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| code | str/list | - | 股票代码或代码列表 |
| frequence | str | 'day' | 周期，支持日/周/月/季/年及分钟线 |
| ip | str | None | IP地址（可选） |
| port | str | None | 端口（可选） |

**返回**: `pd.DataFrame` - 最新行情数据

**示例**:

```python
data = TDX_fetch_get_stock_latest(['000001', '000002'])
print(data.head())
```

---

### 3.5 TDX_fetch_get_stock_realtime - 获取股票实时行情

```python
def TDX_fetch_get_stock_realtime(
    code: list = ['000001', '000002'],
    ip: str = None,
    port: int = None
)
```

**参数**：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| code | list | `['000001', '000002']` | 股票代码列表 |
| ip | str | None | IP地址（可选） |
| port | int | None | 端口（可选） |

**返回**: `pd.DataFrame` - 实时行情，索引为 `['datetime', 'code']`

**示例**:

```python
data = TDX_fetch_get_stock_realtime(['000001', '000002'])
print(data.head())
```

---

### 3.6 TDX_fetch_get_stock_list - 获取股票列表

```python
def TDX_fetch_get_stock_list(
    type_: str = 'stock',
    ip: str = None,
    port: int = None
)
```

**参数**：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| type_ | str | 'stock' | 类型：`'stock'`/`'gp'` 股票，`'index'`/`'zs'` 指数，`'fund'`/`'etf'`/`'lof'` 基金 |
| ip | str | None | IP地址（可选） |
| port | int | None | 端口（可选） |

**返回**: `pd.DataFrame` - 股票列表，包含 code、name、sse、sec 列

**示例**:

```python
stocks = TDX_fetch_get_stock_list('stock')
print(f"股票数量: {len(stocks)}")
print(stocks.head())
```

---

### 3.7 TDX_fetch_get_stock_xdxr - 获取除权除息数据

```python
def TDX_fetch_get_stock_xdxr(
    code,
    ip: str = None,
    port: int = None
)
```

**参数**：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| code | str | - | 股票代码 |
| ip | str | None | IP地址（可选） |
| port | int | None | 端口（可选） |

**返回**: `pd.DataFrame` - 除权除息数据，包含 category_meaning、liquidity_after、liquidity_before、shares_after、shares_before 等列

**示例**:

```python
data = TDX_fetch_get_stock_xdxr('000001')
print(data.head())
```

---

### 3.8 TDX_fetch_get_stock_info - 获取股票基本信息

```python
def TDX_fetch_get_stock_info(
    code,
    ip: str = None,
    port: int = None
)
```

**参数**：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| code | str | - | 股票代码 |
| ip | str | None | IP地址（可选） |
| port | int | None | 端口（可选） |

**返回**: `pd.DataFrame` - 股票基本面信息（37项财务指标）

**示例**:

```python
info = TDX_fetch_get_stock_info('000001')
print(info)
```

---

### 3.9 TDX_fetch_get_stock_terminated - 获取终止上市股票

```python
def TDX_fetch_get_stock_terminated(
    ip: str = None,
    port: int = None
)
```

**参数**：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| ip | str | None | IP地址（可选） |
| port | int | None | 端口（可选） |

**返回**: `pd.DataFrame` - 终止上市的股票列表，包含 code、name 列

**示例**:

```python
data = TDX_fetch_get_stock_terminated()
print(f"终止上市股票数量: {len(data)}")
print(data.head())
```

---

### 3.10 TDX_fetch_get_stock_transaction - 获取股票分笔成交

```python
def TDX_fetch_get_stock_transaction(
    code,
    start,
    end,
    retry: int = 2,
    ip: str = None,
    port: int = None
)
```

**参数**：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| code | str | - | 股票代码 |
| start | str | - | 开始日期，格式 `'2024-01-01'` |
| end | str | - | 结束日期，格式 `'2024-01-05'` |
| retry | int | 2 | 重试次数 |
| ip | str | None | IP地址（可选） |
| port | int | None | 端口（可选） |

**返回**: `pd.DataFrame` - 分笔成交数据，包含 datetime、price、price_change、volume、成交额、type 列

**示例**:

```python
data = TDX_fetch_get_stock_transaction('000001', '2024-02-01', '2024-02-05')
print(f"成交记录数: {len(data)}")
print(data.head())
```

---

## 四、内部函数

### 4.1 _select_market_code - 选择市场代码

```python
def _select_market_code(code: str) -> int
```

根据股票代码判断市场：深圳返回 0，上海返回 1

### 4.2 _select_type - 选择类型代码

```python
def _select_type(_type: str) -> int
```

将类型字符串转换为通达信类型代码：stock_cn→0, index_cn→1, bond_cn→2, fund_cn→3

### 4.3 _get_extensionmarket_list_cached - 获取期货市场列表（缓存）

```python
def _get_extensionmarket_list_cached(ip=None, port=None, renew=False)
```

内部使用，带缓存的期货市场合约列表获取

---

## 五、完整函数列表

| 函数 | 说明 |
|------|------|
| `TDX_fetch_get_security_bars` | 按Bar长度获取数据 |
| `TDX_fetch_get_stock_day` | 获取股票日线数据 |
| `TDX_fetch_get_stock_min` | 获取股票分钟线数据 |
| `TDX_fetch_get_stock_latest` | 获取股票最新行情 |
| `TDX_fetch_get_stock_realtime` | 获取股票实时行情 |
| `TDX_fetch_get_stock_list` | 获取股票列表 |
| `TDX_fetch_get_stock_xdxr` | 获取除权除息数据 |
| `TDDX_fetch_get_stock_info` | 获取股票基本信息 |
| `TDX_fetch_get_stock_terminated` | 获取终止上市股票 |
| `TDX_fetch_get_stock_transaction` | 获取股票分笔成交 |

---

## 六、测试结果

| 测试项 | 状态 |  Shape |
|--------|------|--------|
| `TDX_fetch_get_security_bars` | ✅ PASS | (10, 12) |
| `TDX_fetch_get_stock_day` | ✅ PASS | (38, 9) |
| `TDX_fetch_get_stock_min` | ✅ PASS | (0, 12) |
| `TDX_fetch_get_stock_latest` | ✅ PASS | (2, 11) |
| `TDX_fetch_get_stock_realtime` | ✅ PASS | (2, 32) |
| `TDX_fetch_get_stock_list` | ✅ PASS | (5196, 4) |
| `TDX_fetch_get_stock_xdxr` | ✅ PASS | (78, 16) |
| `TDX_fetch_get_stock_info` | ✅ PASS | (1, 37) |
| `TDX_fetch_get_stock_terminated` | ✅ PASS | (352, 2) |
| `TDX_fetch_get_stock_transaction` | ✅ PASS | (13882, 7) |

**测试通过率**: 10/10 (100%)

---

## 七、相关文档

- [module-FQUtil.md](./module-FQUtil.md) - FQUtil 模块索引
- [module-TdxAdapter.md](./module-TdxAdapter.md) - TdxAdapter 适配器
- [module-FQDate.md](./module-FQDate.md) - 日期工具
- [QATdx.py 迁移文档](../migration/QATdx_migration.md)
