# module-FQDataStruct-QADataStruct.md

# 模块迁移报告: FQDataStruct-QADataStruct

## 基本信息

| 项目 | 原模块 | 迁移后 |
|------|--------|--------|
| **模块名称** | FQData.QAData.QADataStruct | FQBase.FQDataStruct |
| **原文件** | `_bak/server/FQData/FQData/QAData/QADataStruct.py` | 分散到多个文件 |
| **功能** | 行情数据结构定义 | 按品种分拆文件 |

## 迁移概览

| 对比项 | 原实现 | 迁移后 |
|--------|--------|--------|
| **架构** | 单文件多类 (1870 行) | 按品种分拆文件 |
| **基类** | `_quotation_base` | `QuotationDataStructBase` |
| **日线类** | `QA_DataStruct_Stock_day` | `StockDayData` |

---

## 类映射

| 原类名 | 迁移后 | 文件 | 状态 |
|--------|--------|------|------|
| `QA_DataStruct_Stock_day` | `StockDayData` | stock.py | ✅ 已迁移 |
| `QA_DataStruct_Stock_min` | `StockMinData` | stock.py | ✅ 已迁移 |
| `QA_DataStruct_Index_day` | `IndexDayData` | index.py | ✅ 已迁移 |
| `QA_DataStruct_Index_min` | `IndexMinData` | index.py | ✅ 已迁移 |
| `QA_DataStruct_Future_day` | `FutureDayData` | future.py | ✅ 已迁移 |
| `QA_DataStruct_Future_min` | `FutureMinData` | future.py | ✅ 已迁移 |
| `QA_DataStruct_Bond2Stock_day` | `Bond2StockDayData` | bond.py | ✅ 已迁移 |
| `QA_DataStruct_Bond2Stock_min` | `Bond2StockMinData` | bond.py | ✅ 已迁移 |
| `QA_DataStruct_Stock_transaction` | `StockTransactionData` | transaction.py | ✅ 已迁移 |
| `QA_DataStruct_Index_transaction` | `IndexTransactionData` | transaction.py | ✅ 已迁移 |
| `QA_DataStruct_Stock_realtime` | `StockRealtimeData` | realtime.py | ✅ 已迁移 |
| `QA_DataStruct_Future_realtime` | `FutureRealtimeData` | realtime.py | ✅ 已迁移 |
| `QA_DataStruct_Security_list` | `SecurityListData` | security_list.py | ✅ 已迁移 |
| `_realtime_base` | `RealtimeBase` | realtime.py | ✅ 已迁移 |
| `QA_DataStruct_Stock_realtime_series` | `RealtimeSeries` | realtime.py | ✅ 已迁移 |
| `QA_DataStruct_Future_tick` | `FutureTickData` | realtime.py | ✅ 已迁移 |
| `_QA_fetch_stock_adj` | `fetch_stock_adj` | adj.py | ✅ 已迁移 |
| `QA_DataStruct_Day` | `DayData` | base.py | ✅ 已迁移 |
| `QA_DataStruct_Min` | `MinData` | base.py | ✅ 已迁移 |

---

## 审计结果 (2026-03-28)

### StockDayData 审计 ✅

| 原属性/方法 | 迁移后 | 状态 |
|-------------|--------|------|
| `__init__(DataFrame, dtype, if_fq)` | `__init__(data, dtype, if_fq)` | ✅ |
| `to_qfq()` | `to_qfq()` | ✅ |
| `to_hfq()` | `to_hfq()` | ✅ |
| `to_liquidity()` | `to_liquidity()` | ✅ |
| `high_limit` | `high_limit` | ✅ |
| `low_limit` | `low_limit` | ✅ |
| `next_day_high_limit` | `next_day_high_limit` | ✅ |
| `next_day_low_limit` | `next_day_low_limit` | ✅ |
| `preclose` / `pre_close` | `preclose` / `pre_close` | ✅ |
| `price_chg` | `price_chg` | ✅ |
| `week` | `week` | ✅ |
| `month` | `month` | ✅ |
| `quarter` | `quarter` | ✅ |
| `year` | `year` | ✅ |
| `resample(level)` | `resample(level)` | ✅ |

### StockMinData 审计 ✅

| 原属性/方法 | 迁移后 | 状态 |
|-------------|--------|------|
| `__init__(DataFrame, dtype, if_fq)` | `__init__(data, dtype, if_fq)` | ✅ |
| `to_qfq()` | `to_qfq()` | ✅ |
| `to_hfq()` | `to_hfq()` | ✅ |
| `min5` | `min5` | ✅ |
| `min15` | `min15` | ✅ |
| `min30` | `min30` | ✅ |
| `min60` | `min60` | ✅ |
| `resample(level)` | `resample(level)` | ✅ |

### StockTransactionData 审计 ✅

| 原属性/方法 | 迁移后 | 状态 |
|-------------|--------|------|
| `__init__(DataFrame)` | `__init__(data)` | ✅ |
| `buyorsell` | `buyorsell` | ✅ |
| `price` | `price` | ✅ |
| `vol` / `volume` | `vol` / `volume` | ✅ |
| `date` | `date` | ✅ |
| `time` | `time` | ✅ |
| `datetime` | `datetime` | ✅ |
| `order` | `order` | ✅ |
| `index` | `index_prop` | ✅ |
| `amount` | `amount` | ✅ |
| `get_big_orders(bigamount)` | `get_big_orders(bigamount)` | ✅ |
| `get_medium_order(lower, higher)` | `get_medium_order(lower, higher)` | ✅ |
| `get_small_order(smallamount)` | `get_small_order(smallamount)` | ✅ |
| `get_time(start, end)` | `get_time_range(start, end)` | ✅ |
| `resample(type_)` | `resample(type_)` | ✅ |

### IndexTransactionData 审计 ✅

| 原属性/方法 | 迁移后 | 状态 |
|-------------|--------|------|
| 所有属性 | 完整实现 | ✅ |
| `get_big_orders` | 已添加 | ✅ |
| `get_medium_order` | 已添加 | ✅ |
| `get_small_order` | 已添加 | ✅ |
| `resample(type_)` | 已添加 | ✅ |

---

## 新增文件

### 1. realtime.py - 实时行情

```python
from FQBase.FQDataStruct.realtime import (
    RealtimeBase,        # 实时行情基类
    StockRealtimeData,   # 股票实时行情
    FutureRealtimeData,  # 期货实时行情
    RealtimeSeries,      # 实时行情序列
    FutureTickData,      # 期货 Tick (CTP)
)
```

### 2. security_list.py - 证券列表

```python
from FQBase.FQDataStruct import SecurityListData

securities = SecurityListData(df)
stock_list = securities.get_stock()
index_list = securities.get_index()
etf_list = securities.get_etf()
```

### 3. adj.py - 复权因子获取

```python
from FQBase.FQDataStruct import fetch_stock_adj

adj_df = fetch_stock_adj(['000001', '000002'], '2020-01-01', '2024-12-31')
```

---

## 使用示例

### 原接口

```python
from FQData.QAData.QADataStruct import (
    QA_DataStruct_Stock_day,
    QA_DataStruct_Stock_min,
    QA_DataStruct_Index_day,
    QA_DataStruct_Future_day,
    QA_DataStruct_Stock_transaction,
    QA_DataStruct_Index_transaction,
    QA_DataStruct_Stock_realtime,
    QA_DataStruct_Security_list,
    _QA_fetch_stock_adj,
)

stock_day = QA_DataStruct_Stock_day(df, dtype='stock_day', if_fq='bfq')
stock_min = QA_DataStruct_Stock_min(df)
stock_tx = QA_DataStruct_Stock_transaction(df)
index_tx = QA_DataStruct_Index_transaction(df)
realtime = QA_DataStruct_Stock_realtime(data)
securities = QA_DataStruct_Security_list(df)
adj = _QA_fetch_stock_adj(['000001'], '2020-01-01', '2024-12-31')
```

### 新接口

```python
from FQBase.FQDataStruct import (
    StockDayData,
    StockMinData,
    IndexDayData,
    FutureDayData,
    StockTransactionData,
    IndexTransactionData,
    StockRealtimeData,
    SecurityListData,
    fetch_stock_adj,
)

stock_day = StockDayData(df, if_fq='bfq')
stock_min = StockMinData(df)
stock_tx = StockTransactionData(df)
index_tx = IndexTransactionData(df)
realtime = StockRealtimeData(data)
securities = SecurityListData(df)
adj = fetch_stock_adj(['000001'], '2020-01-01', '2024-12-31')
```

---

## 迁移状态

| 项目 | 状态 |
|------|------|
| **核心日线类** | ✅ 已完成 |
| **核心分钟类** | ✅ 已完成 |
| **指数类** | ✅ 已完成 |
| **期货类** | ✅ 已完成 |
| **债券类** | ✅ 已完成 |
| **交易数据类** | ✅ 已完成 |
| **实时行情类** | ✅ 已完成 |
| **证券列表类** | ✅ 已完成 |
| **复权因子获取** | ✅ 已完成 |
| **通用日线类** | ✅ 已完成 |
| **通用分钟线类** | ✅ 已完成 |

---

## 相关文件

- [base.md](./module-FQDataStruct-base.md) - 数据结构基类
- [stock.md](./module-FQDataStruct-data_fq.md) - 股票数据结构
- [index.md](./module-FQDataStruct-index.md) - 指数数据结构
- [future.md](./module-FQDataStruct-future.md) - 期货数据结构
- [bond.md](./module-FQDataStruct-bond.md) - 债券数据结构
- [transaction.md](./module-FQDataStruct-transaction.md) - 交易数据结构
- [resample.md](./module-FQDataStruct-data_resample.md) - 重采样函数
- [realtime.md](./module-FQDataStruct-realtime.md) - 实时行情
- [security_list.md](./module-FQDataStruct-security_list.md) - 证券列表