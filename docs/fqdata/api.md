# FQData API 参考

## 模块概述

FQData 是金融数据模块，提供数据获取、存储、数据结构等功能。

```python
import FQData
print(FQData.__version__)
```

---

## 核心导出

### 数据源

```python
from FQData import (
    get_datasource,
    DataSourceMode,
    DataSourceHealthCheck,
    HealthStatus,
)
```

| 导出 | 类型 | 说明 |
|------|------|------|
| `get_datasource` | function | 获取数据源单例 |
| `DataSourceMode` | enum | 数据源模式 |
| `DataSourceHealthCheck` | class | 健康检查类 |
| `HealthStatus` | class | 健康状态 |

### 数据存储

```python
from FQData import (
    get_datastore,
    DataCategory,
    StorageRegistry,
    TransactionManager,
    Transaction,
    UnitOfWork,
)
```

| 导出 | 类型 | 说明 |
|------|------|------|
| `get_datastore` | function | 获取存储单例 |
| `DataCategory` | enum | 数据分类枚举 |
| `StorageRegistry` | class | 存储注册表 |
| `TransactionManager` | class | 事务管理器 |
| `Transaction` | class | 事务类 |
| `UnitOfWork` | class | 工作单元 |

---

## 股票数据 Saver

### 日线数据

```python
from FQData import (
    save_single_stock_day,
    save_stock_day,
    save_stock_week,
    save_stock_month,
    save_stock_year,
)
```

| 函数 | 说明 |
|------|------|
| `save_single_stock_day(code, data)` | 保存单只股票日线 |
| `save_stock_day(codes, data_dict)` | 批量保存股票日线 |
| `save_stock_week(code, data)` | 保存股票周线 |
| `save_stock_month(code, data)` | 保存股票月线 |
| `save_stock_year(code, data)` | 保存股票年线 |

### 分钟数据

```python
from FQData import (
    save_stock_min,
    save_single_stock_min,
)
```

| 函数 | 说明 |
|------|------|
| `save_stock_min(codes, data_dict, freq)` | 批量保存股票分钟线 |
| `save_single_stock_min(code, data, freq)` | 保存单只股票分钟线 |

### 其他股票数据

```python
from FQData import (
    save_stock_xdxr,
    save_stock_list,
    save_stock_block,
    save_stock_info,
    save_stock_transaction,
)
```

| 函数 | 说明 |
|------|------|
| `save_stock_xdxr(codes)` | 保存除权除息数据 |
| `save_stock_list()` | 保存股票列表 |
| `save_stock_block()` | 保存股票板块数据 |
| `save_stock_info(codes)` | 保存股票基本信息 |
| `save_stock_transaction(code, data)` | 保存成交明细 |

---

## 指数/ETF Saver

### 指数数据

```python
from FQData import (
    save_single_index_day,
    save_index_day,
    save_single_index_min,
    save_index_min,
    save_index_list,
)
```

| 函数 | 说明 |
|------|------|
| `save_single_index_day(code, data)` | 保存单只指数日线 |
| `save_index_day(codes)` | 批量保存指数日线 |
| `save_single_index_min(code, data, freq)` | 保存单只指数分钟 |
| `save_index_min(codes, freq)` | 批量保存指数分钟线 |
| `save_index_list()` | 保存指数列表 |

### ETF数据

```python
from FQData import (
    save_single_etf_day,
    save_etf_day,
    save_single_etf_min,
    save_etf_min,
    save_etf_list,
)
```

| 函数 | 说明 |
|------|------|
| `save_single_etf_day(code, data)` | 保存单只ETF日线 |
| `save_etf_day(codes)` | 批量保存ETF日线 |
| `save_single_etf_min(code, data, freq)` | 保存单只ETF分钟 |
| `save_etf_min(codes, freq)` | 批量保存ETF分钟线 |
| `save_etf_list()` | 保存ETF列表 |

---

## 期货 Saver

```python
from FQData import (
    save_single_future_day,
    save_future_day,
    save_single_future_min,
    save_future_min,
    save_future_list,
)
```

| 函数 | 说明 |
|------|------|
| `save_single_future_day(code, data)` | 保存单只期货日线 |
| `save_future_day(codes)` | 批量保存期货日线 |
| `save_single_future_min(code, data, freq)` | 保存单只期货分钟 |
| `save_future_min(codes, freq)` | 批量保存期货分钟线 |
| `save_future_list()` | 保存期货列表 |

---

## 债券 Saver

```python
from FQData import (
    save_single_bond_day,
    save_bond_day,
    save_single_bond_min,
    save_bond_min,
    save_bond_list,
)
```

| 函数 | 说明 |
|------|------|
| `save_single_bond_day(code, data)` | 保存单只债券日线 |
| `save_bond_day(codes)` | 批量保存债券日线 |
| `save_single_bond_min(code, data, freq)` | 保存单只债券分钟 |
| `save_bond_min(codes, freq)` | 批量保存债券分钟线 |
| `save_bond_list()` | 保存债券列表 |

---

## 期权 Saver

```python
from FQData import (
    save_option_commodity_day,
    save_option_50etf_day,
    save_option_50etf_min,
    save_option_300etf_day,
    save_option_300etf_min,
    save_option_contract_list,
)
```

| 函数 | 说明 |
|------|------|
| `save_option_commodity_day(code, data)` | 保存商品期权日线 |
| `save_option_50etf_day()` | 保存50ETF期权日线 |
| `save_option_50etf_min()` | 保存50ETF期权分钟 |
| `save_option_300etf_day()` | 保存300ETF期权日线 |
| `save_option_300etf_min()` | 保存300ETF期权分钟 |
| `save_option_contract_list()` | 保存期权合约列表 |

---

## 并行 Saver

```python
from FQData import (
    save_stock_day_parallel,
    save_index_day_parallel,
    save_etf_day_parallel,
    save_stock_xdxr_parallel,
)
```

| 函数 | 说明 |
|------|------|
| `save_stock_day_parallel(codes, start, end, workers)` | 并行保存股票日线 |
| `save_index_day_parallel(codes, start, end, workers)` | 并行保存指数日线 |
| `save_etf_day_parallel(codes, start, end, workers)` | 并行保存ETF日线 |
| `save_stock_xdxr_parallel(codes, workers)` | 并行保存除权数据 |

---

## 财务数据 Saver

```python
from FQData import (
    save_financial_files,
    save_financial_one,
    check_stock_xdxr,
)
```

| 函数 | 说明 |
|------|------|
| `save_financial_files(codes)` | 保存财务报表文件 |
| `save_financial_one(code, year, quarter)` | 保存单只股票财务报表 |
| `check_stock_xdxr(code)` | 检查除权除息数据 |

---

## 代码工具函数

normalizer.py 模块提供股票代码分类和市场转换工具。

```python
from FQData.normalizer import (
    for_sz,
    for_sh,
    code_to_market,
    code_to_market_full,
    get_stock_market,
    _select_market_code,
    _select_index_code,
    _select_type,
)
```

### 代码分类

```python
for_sz(code) -> str
for_sh(code) -> str
```

根据股票代码返回类型标识：

| 返回值 | 说明 |
|--------|------|
| `stock_cn` | A股股票 |
| `index_cn` | 指数 |
| `etf_cn` | ETF |
| `bond2_cn` | 可转债 |
| `bond_cn` | 债券 |
| `reverse_cn` | 逆回购 |
| `stockB_cn` | B股 |
| `fund_cn` | 基金 |
| `undefined` | 未定义 |

### 市场转换

```python
code_to_market(code) -> Literal['sz', 'sh']
code_to_market_full(code) -> str
get_stock_market(code) -> str
```

| 函数 | 返回值 | 说明 |
|------|--------|------|
| `code_to_market` | `'sz'` / `'sh'` | 简短市场标识 |
| `code_to_market_full` | `'XSHG'` / `'XSHE'` | 完整市场标识 |
| `get_stock_market` | `'SH'` / `'SZ'` / `'BJ'` | 市场名称 |

### 市场代码选择

```python
_select_market_code(code) -> int
_select_index_code(code) -> int
_select_bond_market_code(code) -> int
_select_type(frequence) -> int
```

| 函数 | 返回值 | 说明 |
|------|--------|------|
| `_select_market_code` | `0/1/2` | 股票/期货市场 (深交所/上交所/北交所) |
| `_select_index_code` | `0/1/2` | 指数市场 |
| `_select_bond_market_code` | `0/1` | 债券市场 (银行间/交易所) |
| `_select_type` | `0-11` | K线频率类型 (pytdx格式) |

---

## 常量

```python
from FQData.normalizer import headers
```

HTTP 请求头常量，用于网络请求。

---

## 相关文档

- [README](README.md)
- [使用指南](usage.md)
- [最佳实践](best-practices.md)
- [开发指南](development.md)
- [FAQ](faq.md)
- [DataSource](datasource/README.md)
- [DataStore](datastore/README.md)
- [DataStruct](datastruct/README.md)