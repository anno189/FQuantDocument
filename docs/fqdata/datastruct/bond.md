---
title: bond - 可转债数据
description: 可转债行情数据类
tag:
  - fqdata
  - datastruct
  - bond

summary:
  type: data-processing
  complexity: medium
  maturity: stable
  core_classes:
    - Bond2StockDayData
    - Bond2StockMinData
  features:
    is_thread_safe: true
  usage_scenarios:
    - "场景1：获取可转债日线数据"
    - "场景2：获取可转债分钟数据"
  warnings: []
  limitations:
    - "仅支持可转债数据"

relationships:
  belongs_to:
    - fquant.fqdata.datastruct
  depends_on:
    - fquant.fqbase
    - pandas

api:
  signatures:
    Bond2StockDayData:
      __init__: "(self, data: pd.DataFrame, dtype: str = 'bond_day', if_fq: str = 'bfq', market_type: str = None, frequence: str = None) -> None"
      week: "self -> pd.Series"
      month: "self -> pd.Series"
      quarter: "self -> pd.Series"
      year: "self -> pd.Series"
      resample: "(self, level: str) -> Bond2StockDayData"
    Bond2StockMinData:
      __init__: "(self, data: pd.DataFrame, dtype: str = 'bond_min', if_fq: str = 'bfq', market_type: str = None, frequence: str = None) -> None"
      min5: "self -> pd.Series"
      min15: "self -> pd.Series"
      min30: "self -> pd.Series"
      min60: "self -> pd.Series"
      resample: "(self, level: str) -> Bond2StockMinData"
  examples:
    basic: |
      from FQData.DataStruct import Bond2StockDayData
      bond = Bond2StockDayData(data, dtype='bond_day', if_fq='bfq')
      print(bond.close)
      print(bond.resample('w'))
---

# bond - 可转债数据

## 一句话总览

📌 **可转债行情数据类，支持日线和分钟数据**

## ⚠️ AI 开发必读

### 使用场景

✅ **应该使用**：
- 场景1：获取可转债日线数据
- 场景2：获取可转债分钟数据

❌ **不应该使用**：
- 不应该用于非可转债数据

### 依赖

| 依赖类型 | 模块 | 说明 |
|---------|------|------|
| 必须 | fquant.fqbase | 基础工具 |
| 必须 | pandas | 数据处理 |

**TL;DR**：
- 核心能力：可转债日线、分钟线数据处理

## 快速开始

```python
from FQData.DataStruct import Bond2StockDayData, Bond2StockMinData

# 日线数据
bond_day = Bond2StockDayData(data, dtype='bond_day', if_fq='bfq')
print(bond_day.close)
print(bond_day.resample('w'))  # 周线

# 分钟数据
bond_min = Bond2StockMinData(data, dtype='bond_min', if_fq='bfq')
print(bond_min.min5)
print(bond_min.resample('5min'))
```

## 核心类

### Bond2StockDayData

可转债日线数据类。

#### 属性

| 属性 | 类型 | 描述 |
|------|------|------|
| week | pd.Series | 周数据 |
| month | pd.Series | 月数据 |
| quarter | pd.Series | 季度数据 |
| year | pd.Series | 年数据 |

#### 方法

| 方法 | 返回类型 | 描述 |
|------|---------|------|
| resample | Bond2StockDayData | 重采样 |

### Bond2StockMinData

可转债分钟数据类。

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
| resample | Bond2StockMinData | 重采样 |
| add_funcx | - | 添加自定义函数 |

## 变更日志

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0.0 | 2024-01 | 初始版本 |
