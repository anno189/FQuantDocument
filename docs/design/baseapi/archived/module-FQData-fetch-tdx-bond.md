# FQData.fetch.tdx.bond - 通达信债券数据

> 版本: v1.0
> 更新时间: 2026-03-27

---

## 一、模块概述

`FQData.fetch.tdx.bond` 提供通达信债券数据获取功能，从 `QATdx.py` 迁移而来。

**主要功能**：
- 可转债实时行情
- 可转债列表
- 可转债日线/分钟线数据
- 国债实时/列表/日线/分钟线数据

**迁移状态**: ⚠️ 部分函数存在问题，需要修复

---

## 二、导入方式

```python
from FQData.fetch.tdx.bond import (
    TDX_fetch_get_bond_realtime,
    TDX_fetch_get_bond_list,
    TDX_fetch_get_bond_day,
    TDX_fetch_get_bond_min,
    TDX_fetch_get_bond2stock_realtime,
    TDX_fetch_get_bond2stock_list,
    TDX_fetch_get_bond2stock_day,
    TDX_fetch_get_bond2stock_min,
)
```

---

## 三、函数列表

### 3.1 TDX_fetch_get_bond_realtime - 获取可转债实时行情

```python
def TDX_fetch_get_bond_realtime(
    code: list = ['010107'],
    ip: str = None,
    port: int = None
)
```

**参数**：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| code | list | `['010107']` | 债券代码列表 |
| ip | str | None | IP地址（可选） |
| port | int | None | 端口（可选） |

**返回**: `pd.DataFrame` - 实时行情，索引为 `['datetime', 'code']`

**注意**: 价格字段需要除以10（债券报价以0.001元为单位）

**示例**:

```python
data = TDX_fetch_get_bond_realtime(['010107', '020'])
print(data.head())
```

---

### 3.2 TDX_fetch_get_bond_list - 获取可转债列表

```python
def TDX_fetch_get_bond_list(
    ip: str = None,
    port: int = None
)
```

**参数**：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| ip | str | None | IP地址（可选） |
| port | int | None | 端口（可选） |

**返回**: `pd.DataFrame` - 可转债列表，包含 code、name、sse、sec 列

**示例**:

```python
data = TDX_fetch_get_bond_list()
print(f"可转债数量: {len(data)}")
print(data.head())
```

---

### 3.3 TDX_fetch_get_bond_day - 获取可转债日线数据

```python
def TDX_fetch_get_bond_day(
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
| code | str | - | 债券代码 |
| start_date | str | - | 开始日期，格式 `'2024-01-01'` |
| end_date | str | - | 结束日期，格式 `'2024-03-01'` |
| frequence | str | 'day' | 周期：`'day'`/`'d'` 日线，`'week'`/`'w'` 周线，`'month'`/`'m'` 月线 |
| ip | str | None | IP地址（可选） |
| port | int | None | 端口（可选） |

**返回**: `pd.DataFrame` - 可转债日线数据

**示例**:

```python
data = TDX_fetch_get_bond_day('010107', '2024-01-01', '2024-03-01')
print(data.head())
```

---

### 3.4 TDX_fetch_get_bond_min - 获取可转债分钟线数据

```python
def TDX_fetch_get_bond_min(
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
| code | str | - | 债券代码 |
| start | str | - | 开始时间，格式 `'2024-01-01'` |
| end | str | - | 结束时间，格式 `'2024-03-01'` |
| frequence | str | '1min' | 分钟周期：`'1min'`/`'1m'` 1分钟，`'5min'`/`'5m'` 5分钟，`'15min'`/`'15m'` 15分钟，`'30min'`/`'30m'` 30分钟，`'60min'`/`'60m'` 60分钟 |
| ip | str | None | IP地址（可选） |
| port | int | None | 端口（可选） |

**返回**: `pd.DataFrame` - 可转债分钟数据

**示例**:

```python
data = TDX_fetch_get_bond_min('010107', '2024-01-01', '2024-03-01', '5min')
print(data.head())
```

---

### 3.5 TDX_fetch_get_bond2stock_realtime - 获取国债转股票实时行情

```python
def TDX_fetch_get_bond2stock_realtime(
    code,
    ip: str = None,
    port: int = None
)
```

**参数**：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| code | pd.DataFrame | - | 包含 `sse` 和 `code` 列的DataFrame |
| ip | str | None | IP地址（可选） |
| port | int | None | 端口（可选） |

**返回**: `pd.DataFrame` - 合并的实时行情

**示例**:

```python
# 需要先获取国债列表
bond_list = TDX_fetch_get_bond2stock_list()
data = TDX_fetch_get_bond2stock_realtime(bond_list)
```

---

### 3.6 TDX_fetch_get_bond2stock_list - 获取国债列表

```python
def TDX_fetch_get_bond2stock_list(
    ip: str = None,
    port: int = None
)
```

**参数**：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| ip | str | None | IP地址（可选） |
| port | int | None | 端口（可选） |

**返回**: `pd.DataFrame` - 国债列表，包含 code、name、sse、sec 列

**示例**:

```python
data = TDX_fetch_get_bond2stock_list()
print(f"国债数量: {len(data)}")
print(data.head())
```

---

### 3.7 TDX_fetch_get_bond2stock_day - 获取国债日线数据

```python
def TDX_fetch_get_bond2stock_day(
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
| code | str | - | 国债代码 |
| start_date | str | - | 开始日期，格式 `'2024-01-01'` |
| end_date | str | - | 结束日期，格式 `'2024-03-01'` |
| frequence | str | 'day' | 周期：`'day'`/`'d'` 日线，`'week'`/`'w'` 周线等 |
| ip | str | None | IP地址（可选） |
| port | int | None | 端口（可选） |

**返回**: `pd.DataFrame` - 国债日线数据

**示例**:

```python
data = TDX_fetch_get_bond2stock_day('020', '2024-01-01', '2024-03-01')
print(data.head())
```

---

### 3.8 TDX_fetch_get_bond2stock_min - 获取国债分钟线数据

```python
def TDX_fetch_get_bond2stock_min(
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
| code | str | - | 国债代码 |
| start | str | - | 开始时间，格式 `'2024-01-01'` |
| end | str | - | 结束时间，格式 `'2024-03-01'` |
| frequence | str | '1min' | 分钟周期 |
| ip | str | None | IP地址（可选） |
| port | int | None | 端口（可选） |

**返回**: `pd.DataFrame` - 国债分钟数据

**示例**:

```python
data = TDX_fetch_get_bond2stock_min('020', '2024-01-01', '2024-03-01', '5min')
print(data.head())
```

---

## 四、内部函数

### 4.1 _select_bond_market_code - 选择债券市场代码

```python
def _select_bond_market_code(code: str) -> int
```

根据债券代码判断市场：深圳→0，上海→1

---

## 五、完整函数列表

| 函数 | 说明 | 状态 |
|------|------|------|
| `TDX_fetch_get_bond_realtime` | 获取可转债实时行情 | ⚠️ 待修复 |
| `TDX_fetch_get_bond_list` | 获取可转债列表 | ✅ PASS |
| `TDX_fetch_get_bond_day` | 获取可转债日线数据 | ⚠️ 待修复 |
| `TDX_fetch_get_bond_min` | 获取可转债分钟线数据 | ⚠️ 待修复 |
| `TDX_fetch_get_bond2stock_realtime` | 获取国债转股票实时行情 | ⚠️ 待修复 |
| `TDX_fetch_get_bond2stock_list` | 获取国债列表 | ✅ PASS |
| `TDX_fetch_get_bond2stock_day` | 获取国债日线数据 | ⚠️ 待修复 |
| `TDX_fetch_get_bond2stock_min` | 获取国债分钟线数据 | ⚠️ 待修复 |

---

## 六、测试结果

| 测试项 | 状态 | Shape |
|--------|------|-------|
| `TDX_fetch_get_bond_realtime` | ⚠️ ERROR | KeyError: 'reversed_bytes0' |
| `TDX_fetch_get_bond_list` | ✅ PASS | (23942, 4) |
| `TDX_fetch_get_bond_day` | ⚠️ ERROR | KeyError: 'datetime' |
| `TDX_fetch_get_bond_min` | ⚠️ ERROR | KeyError on drop |
| `TDX_fetch_get_bond2stock_list` | ✅ PASS | (366, 4) |

**测试通过率**: 2/5 (40%)

---

## 七、已知问题

### 7.1 datetime 处理问题

债券函数中存在链式赋值导致的 `datetime` 列访问问题：

```python
# 错误写法
data = data.assign(
    datetime=pd.to_datetime(data['datetime'], utc=False),
    date=data['datetime'].dt.strftime('%Y-%m-%d'))  # datetime 还未更新

# 正确写法
data['datetime'] = pd.to_datetime(data['datetime'], utc=False)
data = data.assign(
    date=data['datetime'].apply(lambda x: str(x)[0:10]))
```

### 7.2 reversed_bytes0 列问题

`TDX_fetch_get_bond_realtime` 中访问 `reversed_bytes0` 列失败，需要检查 pytdx 返回的列名。

---

## 八、相关文档

- [module-FQData-fetch-tdx-stock.md](./module-FQData-fetch-tdx-stock.md) - 股票数据模块
- [module-FQData-fetch-tdx-index.md](./module-FQData-fetch-tdx-index.md) - 指数数据模块
- [module-FQData-fetch-tdx-future.md](./module-FQData-fetch-tdx-future.md) - 期货数据模块
- [QATdx.py 迁移文档](../migration/QATdx_migration.md)
