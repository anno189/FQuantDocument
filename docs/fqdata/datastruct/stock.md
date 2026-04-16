---
title: stock - 股票数据
description: 股票行情数据类
tag:
  - fqdata
  - datastruct
  - stock

summary:
  type: data-processing
  complexity: medium
  maturity: stable
  core_classes:
    - StockDayData
    - StockMinData
  features:
    is_thread_safe: true
  usage_scenarios:
    - "场景1：获取股票日线数据"
    - "场景2：获取股票分钟数据"
  warnings: []
  limitations:
    - "仅支持 A 股股票数据"

relationships:
  belongs_to:
    - fquant.fqdata.datastruct
  depends_on:
    - fquant.fqbase
    - pandas

api:
  signatures:
    StockDayData:
      __init__: "(self, data: pd.DataFrame, dtype: str = 'stock_day', if_fq: str = 'bfq', market_type: str = None, frequence: str = None) -> None"
      high_limit: "self -> pd.Series"
      low_limit: "self -> pd.Series"
      next_day_high_limit: "self -> pd.Series"
      next_day_low_limit: "self -> pd.Series"
      preclose: "self -> Optional[pd.Series]"
      week: "self -> pd.Series"
      month: "self -> pd.Series"
      quarter: "self -> pd.Series"
      year: "self -> pd.Series"
      resample: "(self, level: str) -> StockDayData"
      to_qfq: "(self) -> StockDayData"
      to_hfq: "(self) -> StockDayData"
    StockMinData:
      __init__: "(self, data: pd.DataFrame, dtype: str = 'stock_min', if_fq: str = 'bfq', market_type: str = None, frequence: str = None) -> None"
      min5: "self -> pd.Series"
      min15: "self -> pd.Series"
      min30: "self -> pd.Series"
      min60: "self -> pd.Series"
      resample: "(self, level: str) -> StockMinData"
      to_qfq: "(self) -> StockMinData"
      to_hfq: "(self) -> StockMinData"
  examples:
    basic: |
      from FQData.DataStruct import StockDayData
      stock = StockDayData(data, dtype='stock_day', if_fq='bfq')
      print(stock.close)
      print(stock.high_limit)
---

# stock - 股票数据

## 一句话总览

📌 **股票行情数据类，支持日线、分钟线和复权处理**

## ⚠️ AI 开发必读

### 使用场景

✅ **应该使用**：
- 场景1：获取股票日线数据
- 场景2：获取股票分钟数据

❌ **不应该使用**：
- 不应该用于期货、债券等非股票数据

### 依赖

| 依赖类型 | 模块 | 说明 |
|---------|------|------|
| 必须 | fquant.fqbase | 基础工具 |
| 必须 | pandas | 数据处理 |

**TL;DR**：
- 核心能力：股票日线、分钟线、复权数据处理

## 快速开始

```python
from FQData.DataStruct import StockDayData, StockMinData

# 日线数据
stock_day = StockDayData(data, dtype='stock_day', if_fq='bfq')
print(stock_day.close)
print(stock_day.high_limit)  # 涨停价
print(stock_day.resample('w'))  # 周线

# 复权转换
qfq = stock_day.to_qfq()  # 前复权
hfq = stock_day.to_hfq()  # 后复权

# 分钟数据
stock_min = StockMinData(data, dtype='stock_min', if_fq='bfq')
print(stock_min.min5)
```

## 核心类

### StockDayData

股票日线数据类。

#### 属性

| 属性 | 类型 | 描述 |
|------|------|------|
| high_limit | pd.Series | 涨停价 |
| low_limit | pd.Series | 跌停价 |
| next_day_high_limit | pd.Series | 次日涨停价 |
| next_day_low_limit | pd.Series | 次日跌停价 |
| preclose | Optional[pd.Series] | 昨收价 |
| week | pd.Series | 周数据 |
| month | pd.Series | 月数据 |
| quarter | pd.Series | 季度数据 |
| year | pd.Series | 年数据 |

#### 方法

| 方法 | 返回类型 | 描述 |
|------|---------|------|
| resample | StockDayData | 重采样 |
| to_qfq | StockDayData | 转换为前复权 |
| to_hfq | StockDayData | 转换为后复权 |
| to_liquidity | StockDayData | 转换为流动性数据 |

### StockMinData

股票分钟数据类。

#### 属性

| 属性 | 类型 | 描述 |
|------|------|------|
| min5 | pd.Series | 5分钟数据 |
| min15 | pd.Series | 15分钟数据 |
| min30 | pd.Series | 30分钟数据 |
| min60 | pd.Series | 60分钟数据 |

#### 方法

| 方法 | 返回类型 | 描述 |
|------|---------|------|
| resample | StockMinData | 重采样 |
| to_qfq | StockMinData | 转换为前复权 |
| to_hfq | StockMinData | 转换为后复权 |

## 变更日志

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0.0 | 2024-01 | 初始版本 |
