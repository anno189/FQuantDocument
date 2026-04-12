# module-FQDataStruct-dsmethods.md

# 模块迁移报告: FQDataStruct-dsmethods

## 基本信息

| 项目 | 原模块 | 迁移后 |
|------|--------|--------|
| **模块名称** | FQData.QAData.dsmethods | FQBase.FQDataStruct |
| **原文件** | `_bak/server/FQData/FQData/QAData/dsmethods.py` | `FQBase/FQBase/FQDataStruct/stock.py` |
| **功能** | DataStruct 工具函数 | 数据结构类方法 |

## 迁移概览

| 对比项 | 原实现 | 迁移后 |
|--------|--------|--------|
| **架构** | 函数式 | 面向对象 |
| **合并方式** | `concat(lists)` 函数 | `data1 + data2` 运算符 |
| **格式化器** | `datastruct_formater()` | 构造函数直接创建 |
| **装饰器** | `QDS_*Warpper` 装饰器 | 数据类实例化 |

---

## 函数对比

### 原实现 (dsmethods.py)

```python
from FQData.QAData.QADataStruct import (
    QA_DataStruct_Index_day,
    QA_DataStruct_Index_min,
    QA_DataStruct_Future_day,
    QA_DataStruct_Future_min,
    QA_DataStruct_Stock_day,
    QA_DataStruct_Stock_min
)

def concat(lists):
    """合并多个 DataStruct，自动去重"""
    return lists[0].new(
        pd.concat([lists.data for lists in lists]).drop_duplicates()
    )

def datastruct_formater(data, frequence, market_type):
    """任意格式转化为 DataStruct"""
    if isinstance(data, list):
        return QA_DataStruct_Stock_day(res.assign(...))
    elif isinstance(data, np.ndarray):
        return QA_DataStruct_Stock_day(res.assign(...))
    return None

def from_tushare(dataframe, dtype='day'):
    """从 tushare 转化"""
    if dtype == 'day':
        return QA_DataStruct_Stock_day(dataframe.assign(...))
    elif dtype == 'min':
        return QA_DataStruct_Stock_min(dataframe.assign(...))

# QDS 装饰器
def QDS_StockDayWarpper(func):
    def warpper(*args, **kwargs):
        data = func(*args, **kwargs)
        if isinstance(data.index, pd.MultiIndex):
            return QA_DataStruct_Stock_day(data)
        else:
            return QA_DataStruct_Stock_day(data.assign(...).set_index(...))
    return warpper
```

### 迁移后 (FQDataStruct)

```python
from FQBase.FQDataStruct import (
    StockDayData,
    StockMinData,
    IndexDayData,
    IndexMinData,
    FutureDayData,
    FutureMinData,
)

# 合并: 使用 + 运算符
combined = data1 + data2  # 等价于 concat([data1, data2])

# 创建: 直接实例化
stock_day = StockDayData(df, if_fq='bfq')
stock_min = StockMinData(df)

# 从 tushare 转化
stock_day = StockDayData.from_tushare(df)
stock_min = StockMinData.from_tushare(df)

# 装饰器: 已不需要
# 原始函数返回值直接传入数据结构类构造函数即可
```

---

## 函数映射

| 原函数 | 迁移后方法 | 状态 |
|--------|------------|------|
| `concat(lists)` | `data1 + data2` 或 `pd.concat([...])` | ✅ 封装在 `__add__` |
| `datastruct_formater()` | 直接实例化 `StockDayData(df)` 等 | ✅ 已不需要 |
| `from_tushare(dtype='day')` | `StockDayData.from_tushare()` | ✅ 已完成 |
| `from_tushare(dtype='min')` | `StockMinData.from_tushare()` | ✅ 已完成 |
| `QDS_StockDayWarpper` | 不需要装饰器 | ✅ 已不需要 |
| `QDS_StockMinWarpper` | 不需要装饰器 | ✅ 已不需要 |
| `QDS_IndexDayWarpper` | 不需要装饰器 | ✅ 已不需要 |
| `QDS_IndexMinWarpper` | 不需要装饰器 | ✅ 已不需要 |

---

## 使用示例

### 原接口

```python
from FQData.QAData.dsmethods import concat, datastruct_formater, from_tushare

# 合并 DataStruct
result = concat([stock_day1, stock_day2])

# 格式化任意数据
data_struct = datastruct_formater(raw_data, FREQUENCE.DAY, MARKET_TYPE.STOCK_CN)

# 从 tushare 转化
data_struct = from_tushare(df, dtype='day')
```

### 新接口

```python
from FQBase.FQDataStruct import StockDayData, StockMinData

# 合并 DataStruct - 使用 + 运算符
combined = stock_day1 + stock_day2

# 或使用 pandas concat
import pandas as pd
combined_df = pd.concat([stock_day1.data, stock_day2.data]).drop_duplicates()
stock_day = StockDayData(combined_df)

# 创建 DataStruct - 直接实例化
stock_day = StockDayData(df, if_fq='bfq')
stock_min = StockMinData(df)

# 从 tushare 转化
stock_day = StockDayData.from_tushare(df)
stock_min = StockMinData.from_tushare(df)
```

---

## 迁移状态

| 项目 | 状态 |
|------|------|
| **功能完整性** | ✅ 全部完成 |
| **合并功能** | ✅ 已封装在 `__add__` 方法 |
| **装饰器** | ✅ 已不需要装饰器模式 |
| **格式化器** | ✅ 已不需要 |
| **tushare 适配** | ✅ `StockDayData.from_tushare()` / `StockMinData.from_tushare()` |

---

## 相关文件

- [stock.py](./module-FQDataStruct-data_fq.md) - 股票数据结构
- [base.md](./module-FQDataStruct-base.md) - 数据结构基类