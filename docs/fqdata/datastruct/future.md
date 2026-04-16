---
title: future - 期货数据
description: 期货行情数据类
tag:
  - fqdata
  - datastruct
  - future

summary:
  type: data-processing
  complexity: medium
  maturity: stable
  core_classes:
    - FutureDayData
    - FutureMinData
  features:
    is_thread_safe: true
  usage_scenarios:
    - "场景1：获取期货日线数据"
    - "场景2：获取期货分钟数据"
  warnings: []
  limitations:
    - "仅支持国内期货市场"

relationships:
  belongs_to:
    - fquant.fqdata.datastruct
  depends_on:
    - fquant.fqbase
    - pandas

api:
  signatures:
    FutureDayData:
      __init__: "(self, data: pd.DataFrame, dtype: str = 'future_day', if_fq: str = 'bfq', market_type: str = None, frequence: str = None) -> None"
      position: "self -> pd.Series"
      tradedate: "self -> pd.Series"
      tradetime: "self -> pd.Series"
      week: "self -> pd.Series"
      month: "self -> pd.Series"
      quarter: "self -> pd.Series"
      year: "self -> pd.Series"
      resample: "(self, level: str) -> FutureDayData"
    FutureMinData:
      __init__: "(self, data: pd.DataFrame, dtype: str = 'future_min', if_fq: str = 'bfq', market_type: str = None, frequence: str = None) -> None"
      tradedate: "self -> pd.Series"
      tradetime: "self -> pd.Series"
      position: "self -> pd.Series"
      min5: "self -> pd.Series"
      min15: "self -> pd.Series"
      min30: "self -> pd.Series"
      min60: "self -> pd.Series"
      resample: "(self, level: str) -> FutureMinData"
  examples:
    basic: |
      from FQData.DataStruct import FutureDayData
      future = FutureDayData(data, dtype='future_day', if_fq='bfq')
      print(future.close)
      print(future.position)
---

# future - 期货数据

## 一句话总览

📌 **期货行情数据类，支持日线和分钟数据**

## ⚠️ AI 开发必读

### 使用场景

✅ **应该使用**：
- 场景1：获取期货日线数据
- 场景2：获取期货分钟数据

❌ **不应该使用**：
- 不应该用于股票、债券等非期货数据

### 依赖

| 依赖类型 | 模块 | 说明 |
|---------|------|------|
| 必须 | fquant.fqbase | 基础工具 |
| 必须 | pandas | 数据处理 |

**TL;DR**：
- 核心能力：期货日线、分钟线、持仓数据处理

## 快速开始

```python
from FQData.DataStruct import FutureDayData, FutureMinData

# 日线数据
future_day = FutureDayData(data, dtype='future_day', if_fq='bfq')
print(future_day.close)
print(future_day.position)  # 持仓量
print(future_day.resample('w'))  # 周线

# 分钟数据
future_min = FutureMinData(data, dtype='future_min', if_fq='bfq')
print(future_min.min5)
print(future_min.resample('5min'))
```

## 核心类

### FutureDayData

期货日线数据类。

#### 属性

| 属性 | 类型 | 描述 |
|------|------|------|
| position | pd.Series | 持仓量 |
| tradedate | pd.Series | 交易日期 |
| tradetime | pd.Series | 交易时间 |
| week | pd.Series | 周数据 |
| month | pd.Series | 月数据 |
| quarter | pd.Series | 季度数据 |
| year | pd.Series | 年数据 |

#### 方法

| 方法 | 返回类型 | 描述 |
|------|---------|------|
| resample | FutureDayData | 重采样 |

### FutureMinData

期货分钟数据类。

#### 属性

| 属性 | 类型 | 描述 |
|------|------|------|
| tradedate | pd.Series | 交易日期 |
| tradetime | pd.Series | 交易时间 |
| position | pd.Series | 持仓量 |
| min5 | pd.Series | 5分钟数据 |
| min15 | pd.Series | 15分钟数据 |
| min30 | pd.Series | 30分钟数据 |
| min60 | pd.Series | 60分钟数据 |

#### 方法

| 方法 | 返回类型 | 描述 |
|------|---------|------|
| resample | FutureMinData | 重采样 |

## 变更日志

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0.0 | 2024-01 | 初始版本 |
