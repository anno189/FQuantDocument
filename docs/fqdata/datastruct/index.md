---
title: index - 指数数据
description: 指数行情数据类
tag:
  - fqdata
  - datastruct
  - index

summary:
  type: data-processing
  complexity: medium
  maturity: stable
  core_classes:
    - IndexDayData
    - IndexMinData
  features:
    is_thread_safe: true
  usage_scenarios:
    - "场景1：获取指数日线数据"
    - "场景2：获取指数分钟数据"
  warnings: []
  limitations:
    - "仅支持国内指数数据"

relationships:
  belongs_to:
    - fquant.fqdata.datastruct
  depends_on:
    - fquant.fqbase
    - pandas

api:
  signatures:
    IndexDayData:
      __init__: "(self, data: pd.DataFrame, dtype: str = 'index_day', if_fq: str = 'bfq', market_type: str = None, frequence: str = None) -> None"
      week: "self -> pd.Series"
      month: "self -> pd.Series"
      quarter: "self -> pd.Series"
      year: "self -> pd.Series"
      resample: "(self, level: str) -> IndexDayData"
    IndexMinData:
      __init__: "(self, data: pd.DataFrame, dtype: str = 'index_min', if_fq: str = 'bfq', market_type: str = None, frequence: str = None) -> None"
      min5: "self -> pd.Series"
      min15: "self -> pd.Series"
      min30: "self -> pd.Series"
      min60: "self -> pd.Series"
      resample: "(self, level: str) -> IndexMinData"
  examples:
    basic: |
      from FQData.DataStruct import IndexDayData
      index = IndexDayData(data, dtype='index_day', if_fq='bfq')
      print(index.close)
---

# index - 指数数据

## 一句话总览

📌 **指数行情数据类，支持日线和分钟数据**

## ⚠️ AI 开发必读

### 使用场景

✅ **应该使用**：
- 场景1：获取指数日线数据
- 场景2：获取指数分钟数据

❌ **不应该使用**：
- 不应该用于股票、期货等非指数数据

### 依赖

| 依赖类型 | 模块 | 说明 |
|---------|------|------|
| 必须 | fquant.fqbase | 基础工具 |
| 必须 | pandas | 数据处理 |

**TL;DR**：
- 核心能力：指数日线、分钟线数据处理

## 快速开始

```python
from FQData.DataStruct import IndexDayData, IndexMinData

# 日线数据
index_day = IndexDayData(data, dtype='index_day', if_fq='bfq')
print(index_day.close)
print(index_day.resample('w'))  # 周线

# 分钟数据
index_min = IndexMinData(data, dtype='index_min', if_fq='bfq')
print(index_min.min5)
print(index_min.resample('5min'))
```

## 核心类

### IndexDayData

指数日线数据类。

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
| resample | IndexDayData | 重采样 |

### IndexMinData

指数分钟数据类。

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
| resample | IndexMinData | 重采样 |
| add_funcx | - | 添加自定义函数 |

## 变更日志

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0.0 | 2024-01 | 初始版本 |
