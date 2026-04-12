# FQData.fetch.tdx.index - 通达信指数数据

> 版本: v1.0
> 更新时间: 2026-03-27

---

## 一、模块概述

`FQData.fetch.tdx.index` 提供通达信指数数据获取功能，从 `QATdx.py` 迁移而来。

**主要功能**：
- 指数实时行情
- 指数列表查询
- 指数日线数据
- 指数分钟线数据
- 指数最新行情
- 指数分笔成交数据

**迁移状态**: ✅ 已完成迁移，测试通过 6/6

---

## 二、导入方式

```python
from FQData.fetch.tdx.index import (
    TDX_fetch_get_index_realtime,
    TDX_fetch_get_index_list,
    TDX_fetch_get_index_day,
    TDX_fetch_get_index_min,
    TDX_fetch_get_index_latest,
    TDX_fetch_get_index_transaction,
)
```

---

## 三、函数列表

### 3.1 TDX_fetch_get_index_realtime - 获取指数实时行情

```python
def TDX_fetch_get_index_realtime(
    code: list = ['000001'],
    ip: str = None,
    port: int = None
)
```

**参数**：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| code | list | `['000001']` | 指数代码列表 |
| ip | str | None | IP地址（可选） |
| port | int | None | 端口（可选） |

**返回**: `pd.DataFrame` - 实时行情，索引为 `['datetime', 'code']`

**示例**:

```python
data = TDX_fetch_get_index_realtime(['000001', '000300'])
print(data.head())
```

---

### 3.2 TDX_fetch_get_index_list - 获取指数列表

```python
def TDX_fetch_get_index_list(
    ip: str = None,
    port: int = None
)
```

**参数**：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| ip | str | None | IP地址（可选） |
| port | int | None | 端口（可选） |

**返回**: `pd.DataFrame` - 指数列表，包含 code、name、sse、sec 列

**示例**:

```python
indices = TDX_fetch_get_index_list()
print(f"指数数量: {len(indices)}")
print(indices.head())
```

---

### 3.3 TDX_fetch_get_index_day - 获取指数日线数据

```python
def TDX_fetch_get_index_day(
    code,
    start_date,
    end_date,
    frequence: str = 'day',
    ip: str = None,
    port: int = None
)
```

**参数**：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| code | str | - | 指数代码 |
| start_date | str | - | 开始日期，格式 `'2024-01-01'` |
| end_date | str | - | 结束日期，格式 `'2024-03-01'` |
| frequence | str | 'day' | 周期：`'day'`/`'d'` 日线，`'week'`/`'w'` 周线，`'month'`/`'m'` 月线，`'quarter'`/`'q'` 季线，`'year'`/`'y'` 年线 |
| ip | str | None | IP地址（可选） |
| port | int | None | 端口（可选） |

**返回**: `pd.DataFrame` - 指数日线数据

**示例**:

```python
data = TDX_fetch_get_index_day('000300', '2024-01-01', '2024-03-01')
print(data.head())
```

---

### 3.4 TDX_fetch_get_index_min - 获取指数分钟线数据

```python
def TDX_fetch_get_index_min(
    code,
    start,
    end,
    frequence: str = '1min',
    ip: str = None,
    port: int = None
)
```

**参数**：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| code | str | - | 指数代码 |
| start | str | - | 开始时间，格式 `'2024-01-01'` |
| end | str | - | 结束时间，格式 `'2024-03-01'` |
| frequence | str | '1min' | 分钟周期：`'1min'`/`'1m'` 1分钟，`'5min'`/`'5m'` 5分钟，`'15min'`/`'15m'` 15分钟，`'30min'`/`'30m'` 30分钟，`'60min'`/`'60m'` 60分钟 |
| ip | str | None | IP地址（可选） |
| port | int | None | 端口（可选） |

**返回**: `pd.DataFrame` - 指数分钟数据

**示例**:

```python
data = TDX_fetch_get_index_min('000001', '2024-01-01', '2024-03-01', '5min')
print(data.head())
```

---

### 3.5 TDX_fetch_get_index_latest - 获取指数最新行情

```python
def TDX_fetch_get_index_latest(
    code,
    frequence: str = 'day',
    ip: str = None,
    port: int = None
)
```

**参数**：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| code | str/list | - | 指数代码或代码列表 |
| frequence | str | 'day' | 周期，支持日/周/月/季/年及分钟线 |
| ip | str | None | IP地址（可选） |
| port | int | None | 端口（可选） |

**返回**: `pd.DataFrame` - 最新行情数据

**示例**:

```python
data = TDX_fetch_get_index_latest(['000001', '000300'])
print(data.head())
```

---

### 3.6 TDX_fetch_get_index_transaction - 获取指数分笔成交

```python
def TDX_fetch_get_index_transaction(
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
| code | str | - | 指数代码 |
| start | str | - | 开始日期，格式 `'2024-01-01'` |
| end | str | - | 结束日期，格式 `'2024-01-05'` |
| retry | int | 2 | 重试次数 |
| ip | str | None | IP地址（可选） |
| port | int | None | 端口（可选） |

**返回**: `pd.DataFrame` - 分笔成交数据，包含 datetime、price、price_change、volume、成交额、type 列

**示例**:

```python
data = TDX_fetch_get_index_transaction('000001', '2024-02-01', '2024-02-05')
print(f"成交记录数: {len(data)}")
print(data.head())
```

---

## 四、内部函数

### 4.1 _select_index_code - 选择指数市场代码

```python
def _select_index_code(code: str) -> int
```

根据指数代码判断市场：深圳→0，上海→1，北交所→2

### 4.2 __QA_fetch_get_index_transaction - 获取单日指数分笔成交（内部）

```python
def __QA_fetch_get_index_transaction(code, day, retry, api)
```

内部使用，获取单个交易日的指数分笔成交数据

---

## 五、完整函数列表

| 函数 | 说明 |
|------|------|
| `TDX_fetch_get_index_realtime` | 获取指数实时行情 |
| `TDX_fetch_get_index_list` | 获取指数列表 |
| `TDX_fetch_get_index_day` | 获取指数日线数据 |
| `TDX_fetch_get_index_min` | 获取指数分钟线数据 |
| `TDX_fetch_get_index_latest` | 获取指数最新行情 |
| `TDX_fetch_get_index_transaction` | 获取指数分笔成交 |

---

## 六、测试结果

| 测试项 | 状态 | Shape |
|--------|------|--------|
| `TDX_fetch_get_index_realtime` | ✅ PASS | (2, 32) |
| `TDX_fetch_get_index_list` | ✅ PASS | (369, 4) |
| `TDX_fetch_get_index_day` | ✅ PASS | (38, 11) |
| `TDX_fetch_get_index_min` | ✅ PASS | (0, 14) |
| `TDX_fetch_get_index_latest` | ✅ PASS | (2, 11) |
| `TDX_fetch_get_index_transaction` | ✅ PASS | (14240, 7) |

**测试通过率**: 6/6 (100%)

---

## 七、相关文档

- [module-FQData-fetch-tdx-stock.md](./module-FQData-fetch-tdx-stock.md) - 股票数据模块
- [module-FQData-fetch-tdx.md](./module-FQData-fetch-tdx.md) - 通达信模块索引
- [module-FQUtil.md](./module-FQUtil.md) - FQUtil 模块索引
- [QATdx.py 迁移文档](../migration/QATdx_migration.md)
