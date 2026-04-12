# FQData.fetch.tdx.future - 通达信期货/海外市场数据

> 版本: v1.0
> 更新时间: 2026-03-27

---

## 一、模块概述

`FQData.fetch.tdx.future` 提供通达信期货及海外市场数据获取功能，从 `QATdx.py` 迁移而来。

**主要功能**：
- 期货市场信息
- 期货合约列表
- 全球指数列表
- 港股/美股/港基金列表
- 宏观指数列表
- 期权列表（50ETF等）

**迁移状态**: ✅ 已完成迁移，测试通过 11/11

---

## 二、导入方式

```python
from FQData.fetch.tdx.future import (
    TDX_fetch_get_extensionmarket_info,
    TDX_fetch_get_extensionmarket_list,
    TDX_fetch_get_future_list,
    TDX_fetch_get_globalindex_list,
    TDX_fetch_get_hkstock_list,
    TDX_fetch_get_hkindex_list,
    TDX_fetch_get_hkfund_list,
    TDX_fetch_get_usstock_list,
    TDX_fetch_get_macroindex_list,
    TDX_fetch_get_option_list,
    TDX_fetch_get_option_50etf_list,
)
```

---

## 三、函数列表

### 3.1 TDX_fetch_get_extensionmarket_info - 获取期货市场信息

```python
def TDX_fetch_get_extensionmarket_info(ip=None, port=None)
```

**参数**：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| ip | str | None | IP地址（可选） |
| port | int | None | 端口（可选） |

**返回**: `pd.DataFrame` - 期货市场信息

**示例**:

```python
data = TDX_fetch_get_extensionmarket_info()
print(data.head())
```

---

### 3.2 TDX_fetch_get_extensionmarket_list - 获取期货市场合约列表

```python
def TDX_fetch_get_extensionmarket_list(ip=None, port=None, renew=False)
```

**参数**：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| ip | str | None | IP地址（可选） |
| port | int | None | 端口（可选） |
| renew | bool | False | 是否强制刷新缓存 |

**返回**: `pd.DataFrame` - 期货市场合约列表

**示例**:

```python
data = TDX_fetch_get_extensionmarket_list()
print(f"合约数量: {len(data)}")
print(data.head())
```

---

### 3.3 TDX_fetch_get_future_list - 获取期货列表

```python
def TDX_fetch_get_future_list(ip=None, port=None)
```

**参数**：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| ip | str | None | IP地址（可选） |
| port | int | None | 端口（可选） |

**返回**: `pd.DataFrame` - 期货合约列表（国内期货）

**示例**:

```python
data = TDX_fetch_get_future_list()
print(f"期货数量: {len(data)}")
print(data.head())
```

---

### 3.4 TDX_fetch_get_globalindex_list - 获取全球指数列表

```python
def TDX_fetch_get_globalindex_list(ip=None, port=None)
```

**参数**：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| ip | str | None | IP地址（可选） |
| port | int | None | 端口（可选） |

**返回**: `pd.DataFrame` - 全球指数列表

**示例**:

```python
data = TDX_fetch_get_globalindex_list()
print(data.head())
```

---

### 3.5 TDX_fetch_get_hkstock_list - 获取港股列表

```python
def TDX_fetch_get_hkstock_list(ip=None, port=None)
```

**参数**：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| ip | str | None | IP地址（可选） |
| port | int | None | 端口（可选） |

**返回**: `pd.DataFrame` - 港股列表

**示例**:

```python
data = TDX_fetch_get_hkstock_list()
print(f"港股数量: {len(data)}")
print(data.head())
```

---

### 3.6 TDX_fetch_get_hkindex_list - 获取港指列表

```python
def TDX_fetch_get_hkindex_list(ip=None, port=None)
```

**参数**：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| ip | str | None | IP地址（可选） |
| port | int | None | 端口（可选） |

**返回**: `pd.DataFrame` - 恒生指数系列列表

**示例**:

```python
data = TDX_fetch_get_hkindex_list()
print(data.head())
```

---

### 3.7 TDX_fetch_get_hkfund_list - 获取港基金列表

```python
def TDX_fetch_get_hkfund_list(ip=None, port=None)
```

**参数**：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| ip | str | None | IP地址（可选） |
| port | int | None | 端口（可选） |

**返回**: `pd.DataFrame` - 港股基金列表

**示例**:

```python
data = TDX_fetch_get_hkfund_list()
print(data.head())
```

---

### 3.8 TDX_fetch_get_usstock_list - 获取美股列表

```python
def TDX_fetch_get_usstock_list(ip=None, port=None)
```

**参数**：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| ip | str | None | IP地址（可选） |
| port | int | None | 端口（可选） |

**返回**: `pd.DataFrame` - 美股列表

**示例**:

```python
data = TDX_fetch_get_usstock_list()
print(f"美股数量: {len(data)}")
print(data.head())
```

---

### 3.9 TDX_fetch_get_macroindex_list - 获取宏观指数列表

```python
def TDX_fetch_get_macroindex_list(ip=None, port=None)
```

**参数**：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| ip | str | None | IP地址（可选） |
| port | int | None | 端口（可选） |

**返回**: `pd.DataFrame` - 宏观指数列表

**示例**:

```python
data = TDX_fetch_get_macroindex_list()
print(data.head())
```

---

### 3.10 TDX_fetch_get_option_list - 获取期权列表

```python
def TDX_fetch_get_option_list(ip=None, port=None)
```

**参数**：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| ip | str | None | IP地址（可选） |
| port | int | None | 端口（可选） |

**返回**: `pd.DataFrame` - 期权合约列表

**示例**:

```python
data = TDX_fetch_get_option_list()
print(f"期权数量: {len(data)}")
print(data.head())
```

---

### 3.11 TDX_fetch_get_option_50etf_list - 获取50ETF期权列表

```python
def TDX_fetch_get_option_50etf_list()
```

**参数**: 无

**返回**: `pd.DataFrame` - 50ETF期权列表，包含以下字段：
- `putcall`: 认购/认沽
- `expireMonth`: 到期月份
- `adjust`: 调整次数
- `price`: 行权价
- `meaningful_name`: 格式化名称

**示例**:

```python
data = TDX_fetch_get_option_50etf_list()
print(f"50ETF期权数量: {len(data)}")
print(data[['code', 'meaningful_name']].head())
```

---

## 四、内部变量

| 变量 | 类型 | 说明 |
|------|------|------|
| `_extension_market_list` | pd.DataFrame | 缓存的期货市场列表 |
| `_extension_market_info` | pd.DataFrame | 缓存的期货市场信息 |

---

## 五、完整函数列表

| 函数 | 说明 |
|------|------|
| `TDX_fetch_get_extensionmarket_info` | 获取期货市场信息 |
| `TDX_fetch_get_extensionmarket_list` | 获取期货市场合约列表 |
| `TDX_fetch_get_future_list` | 获取期货列表 |
| `TDX_fetch_get_globalindex_list` | 获取全球指数列表 |
| `TDX_fetch_get_hkstock_list` | 获取港股列表 |
| `TDX_fetch_get_hkindex_list` | 获取港指列表 |
| `TDX_fetch_get_hkfund_list` | 获取港基金列表 |
| `TDX_fetch_get_usstock_list` | 获取美股列表 |
| `TDX_fetch_get_macroindex_list` | 获取宏观指数列表 |
| `TDX_fetch_get_option_list` | 获取期权列表 |
| `TDX_fetch_get_option_50etf_list` | 获取50ETF期权列表 |

---

## 六、测试结果

| 测试项 | 状态 | Shape |
|--------|------|-------|
| `TDX_fetch_get_extensionmarket_info` | ✅ PASS | (1, 1) |
| `TDX_fetch_get_extensionmarket_list` | ✅ PASS | (109627, 5) |
| `TDX_fetch_get_future_list` | ✅ PASS | (30442, 5) |
| `TDX_fetch_get_globalindex_list` | ✅ PASS | (64, 5) |
| `TDX_fetch_get_hkstock_list` | ✅ PASS | (2813, 5) |
| `TDX_fetch_get_hkindex_list` | ✅ PASS | (316, 5) |
| `TDX_fetch_get_hkfund_list` | ✅ PASS | (413, 5) |
| `TDX_fetch_get_usstock_list` | ✅ PASS | (12795, 5) |
| `TDX_fetch_get_macroindex_list` | ✅ PASS | (0, 5) |
| `TDX_fetch_get_option_list` | ✅ PASS | (28834, 5) |
| `TDX_fetch_get_option_50etf_list` | ✅ PASS | (122, 10) |

**测试通过率**: 11/11 (100%)

---

## 七、相关文档

- [module-FQData-fetch-tdx-stock.md](./module-FQData-fetch-tdx-stock.md) - 股票数据模块
- [module-FQData-fetch-tdx-index.md](./module-FQData-fetch-tdx-index.md) - 指数数据模块
- [module-FQData-fetch-tdx.md](./module-FQData-fetch-tdx.md) - 通达信模块索引
- [module-FQUtil.md](./module-FQUtil.md) - FQUtil 模块索引
- [QATdx.py 迁移文档](../migration/QATdx_migration.md)
