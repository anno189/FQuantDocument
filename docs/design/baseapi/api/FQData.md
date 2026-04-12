# FQData 模块 API 文档

**模块路径**: `FQData/`
**生成时间**: 2026-03-28

---

## 一、模块概述

FQData 是数据处理模块，包含数据获取、存储、数据结构等功能。

### 1.1 模块结构

```
FQData/
├── fetch/                    # 数据获取
│   ├── tdx/                  # 通达信在线数据
│   ├── local/                # 本地数据库查询
│   ├── advance.py            # 高级封装
│   └── fetcher.py            # 统一门面
├── storage/                  # 数据存储
│   ├── savers/               # 存储函数
│   └── parallelism.py         # 并行存储
└── __init__.py
```

---

## 二、fetch 子模块

详见 [FQData-fetch.md](./FQData-fetch.md)

**总计**: 120+ API函数

### 2.1 主要导出

```python
# 数据获取
from FQData.fetch.tdx import TDX_fetch_get_stock_day
from FQData.fetch.local import DB_fetch_stock_day
from FQData.fetch.advance import fetch_stock_day_adv
from FQData.fetch.fetcher import Fetcher, quotation_adv
```

---

## 三、storage 子模块

**路径**: `FQData/storage/`

详见 [FQData-storage.md](./FQData-storage.md)

**总计**: 100+ API函数

### 3.1 savers 子模块 (存储函数)

| 类别 | 函数数量 |
|------|----------|
| main.py (统一入口) | 40 |
| stock.py (股票) | 13 |
| stock_info.py (股票信息) | 12 |
| stock_position.py (基金持仓) | 3 |
| index.py (指数) | 6 |
| future.py (期货) | 5 |
| bond.py (债券) | 8 |
| bond_cb.py (可转债) | 4 |
| option.py (期权) | 2 |
| etf.py (ETF) | 5 |
| hkstock.py (港股) | 5 |
| usstock.py (美股) | 5 |
| parallelism.py (并行) | 6 |
| financial.py (财务) | 1 |
| crawler.py (爬虫) | 1 |
| industry.py (行业) | 5 |
| concept.py (概念) | 4 |
| province.py (地区) | 3 |
| index_stocks.py (指数成分) | 3 |
| **总计** | **~130** |

**使用示例**:
from FQData.storage.savers import TDX_save_10jqka_position

# 批量保存基金持仓
TDX_save_10jqka_position(date='2021-12-31')
```

### 3.2 parallelism 子模块 (并行存储)

| 类/函数 | 说明 |
|---------|------|
| `MongoConnectionPool` | MongoDB连接池 |
| `ProcessPoolExecutor` | 进程池执行器 |
| `parallel_save_stock_day` | 并行保存股票日线 |
| `parallel_save_stock_min` | 并行保存股票分钟线 |

---

## 四、迁移对照表

### 4.1 模块迁移对照

| 原始模块 | 迁移后 | 状态 |
|----------|--------|------|
| `QATdx` | `FQData.fetch.tdx` | ✅ |
| `QAQuery` | `FQData.fetch.local` | ✅ |
| `QAQuery_Advance` | `FQData.fetch.advance` | ✅ |
| `Fetcher` | `FQData.fetch.fetcher` | ✅ |
| `QASU` (部分) | `FQData.storage.savers` | ✅ |

### 4.2 函数命名对照

| 原始 | 新 | 模块 |
|------|-----|------|
| `QA_fetch_get_stock_day` | `TDX_fetch_get_stock_day` | tdx |
| `QA_fetch_stock_day` | `DB_fetch_stock_day` | local |
| `QA_fetch_stock_day_adv` | `fetch_stock_day_adv` | advance |
| `QA_quotation_adv` | `quotation_adv` | fetcher |
| `QA_SU_save_10jqka_position` | `TDX_save_10jqka_position` | savers |

---

## 五、完整导出示例

```python
# ============ 数据获取 ============
# 通达信在线数据
from FQData.fetch.tdx import (
    TDX_fetch_get_stock_day,
    TDX_fetch_get_index_day,
    TDX_fetch_get_future_day,
    TDX_fetch_get_option_list,
    TdxExecutor,
)

# 本地数据库查询
from FQData.fetch.local import (
    DB_fetch_stock_day,
    DB_fetch_stock_min,
    DB_fetch_index_day,
    DB_fetch_stock_list,
)

# 高级封装 (返回DataStruct)
from FQData.fetch.advance import (
    fetch_stock_day_adv,
    fetch_stock_min_adv,
    fetch_index_day_adv,
)

# 统一门面
from FQData.fetch.fetcher import (
    Fetcher,
    quotation_adv,
    quotation,
)

# ============ 数据存储 ============
from FQData.storage.savers import (
    TDX_save_10jqka_position,
    TDX_save_position_data,
)

from FQData.storage.parallelism import (
    MongoConnectionPool,
    TDX_save_stock_day_parallelism,
)
```
