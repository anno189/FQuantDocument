---
title: transaction - 逐笔成交数据
description: 逐笔成交数据类
tag:
  - fqdata
  - datastruct
  - transaction

summary:
  type: data-processing
  complexity: medium
  maturity: stable
  core_classes:
    - StockTransactionData
    - IndexTransactionData
  features:
    is_thread_safe: true
  usage_scenarios:
    - "场景1：获取股票逐笔成交"
    - "场景2：分析大单交易"
  warnings: []
  limitations:
    - "仅支持 A 股逐笔数据"

relationships:
  belongs_to:
    - fquant.fqdata.datastruct
  depends_on:
    - pandas

api:
  signatures:
    StockTransactionData:
      __init__: "(self, data: pd.DataFrame) -> None"
      data: "self -> pd.DataFrame"
      buyorsell: "self -> pd.Series"
      price: "self -> pd.Series"
      volume: "self -> pd.Series"
      amount: "self -> pd.Series"
      to_df: "(self) -> pd.DataFrame"
      get_code: "(self, code: str) -> StockTransactionData"
      get_date: "(self, date: str) -> StockTransactionData"
      get_big_orders: "(self, bigamount: int = 1000000) -> StockTransactionData"
      resample: "(self, type_: str = '1min') -> StockTransactionData"
    IndexTransactionData:
      __init__: "(self, data: pd.DataFrame) -> None"
      data: "self -> pd.DataFrame"
      get_code: "(self, code: str) -> IndexTransactionData"
      get_big_orders: "(self, bigamount: int = 1000000) -> IndexTransactionData"
      resample: "(self, type_: str = '1min') -> IndexTransactionData"
  examples:
    basic: |
      from FQData.DataStruct import StockTransactionData
      trans = StockTransactionData(data)
      print(trans.get_big_orders())
---

# transaction - 逐笔成交数据

## 一句话总览

📌 **逐笔成交数据管理**

## ⚠️ AI 开发必读

### 使用场景

✅ **应该使用**：
- 场景1：获取股票逐笔成交
- 场景2：分析大单交易

❌ **不应该使用**：
- 不应该用于非逐笔数据

### 依赖

| 依赖类型 | 模块 | 说明 |
|---------|------|------|
| 必须 | pandas | 数据处理 |

**TL;DR**：
- 核心能力：逐笔数据查询、大单分析

## 快速开始

```python
from FQData.DataStruct import StockTransactionData

trans = StockTransactionData(data)

# 按股票代码筛选
code_data = trans.get_code('000001')

# 按日期筛选
date_data = trans.get_date('2024-01-01')

# 获取大单（默认100万）
big = trans.get_big_orders(1000000)

# 获取中单
medium = trans.get_medium_order(500000)

# 获取小单
small = trans.get_small_order(200000)
```

## 核心类

### StockTransactionData

股票逐笔成交数据类。

#### 属性

| 属性 | 类型 | 描述 |
|------|------|------|
| data | pd.DataFrame | 原始数据 |
| buyorsell | pd.Series | 买卖方向 |
| price | pd.Series | 价格 |
| volume | pd.Series | 成交量 |
| amount | pd.Series | 成交额 |
| date | pd.Series | 日期 |
| code | pd.Series | 股票代码 |

#### 方法

| 方法 | 返回类型 | 描述 |
|------|---------|------|
| to_df | pd.DataFrame | 转换为 DataFrame |
| get_code | StockTransactionData | 按代码筛选 |
| get_date | StockTransactionData | 按日期筛选 |
| get_time_range | StockTransactionData | 按时间范围筛选 |
| get_big_orders | StockTransactionData | 获取大单 |
| get_medium_order | StockTransactionData | 获取中单 |
| get_small_order | StockTransactionData | 获取小单 |
| resample | StockTransactionData | 重采样 |

### IndexTransactionData

指数逐笔成交数据类。

属性和方法与 StockTransactionData 类似。

## 变更日志

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0.0 | 2024-01 | 初始版本 |
