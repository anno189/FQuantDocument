---
title: realtime - 实时行情数据
description: 实时行情和 Tick 数据类
tag:
  - fqdata
  - datastruct
  - realtime

summary:
  type: data-processing
  complexity: medium
  maturity: stable
  core_classes:
    - RealtimeBase
    - StockRealtimeData
    - FutureRealtimeData
    - RealtimeSeries
    - FutureTickData
  features:
    is_thread_safe: false
  usage_scenarios:
    - "场景1：获取实时行情数据"
    - "场景2：获取期货 Tick 数据"
  warnings:
    - "实时数据非线程安全"
  limitations:
    - "仅支持实时数据场景"

relationships:
  belongs_to:
    - fquant.fqdata.datastruct
  depends_on:
    - pandas

api:
  signatures:
    RealtimeBase:
      open: "self -> Optional[float]"
      price: "self -> Optional[float]"
      high: "self -> Optional[float]"
      low: "self -> Optional[float]"
      code: "self -> Optional[str]"
      to_dict: "self -> Dict"
    StockRealtimeData:
      to_dataframe: "self -> pd.DataFrame"
      resample: "self -> None"
    RealtimeSeries:
      data: "self -> pd.DataFrame"
      series: "self -> List[RealtimeBase]"
    FutureTickData:
      trading_day: "self -> Optional[str]"
      last_price: "self -> Optional[float]"
      volume: "self -> Optional[int]"
  examples:
    basic: |
      from FQData.DataStruct import StockRealtimeData
      realtime = StockRealtimeData(data)
      print(realtime.price)
---

# realtime - 实时行情数据

## 一句话总览

📌 **实时行情和 Tick 数据管理**

## ⚠️ AI 开发必读

### 使用场景

✅ **应该使用**：
- 场景1：获取实时行情数据
- 场景2：获取期货 Tick 数据

❌ **不应该使用**：
- 不应该用于批量数据处理场景

### 注意事项

1. **实时数据非线程安全**
   - 说明：实时数据对象不建议在多线程环境下共享

### 依赖

| 依赖类型 | 模块 | 说明 |
|---------|------|------|
| 必须 | pandas | 数据处理 |

**TL;DR**：
- 核心能力：实时行情、Tick 数据获取

## 快速开始

```python
from FQData.DataStruct import StockRealtimeData, FutureTickData

# 股票实时数据
realtime = StockRealtimeData(data)
print(realtime.price)
print(realtime.to_dataframe())

# 期货 Tick 数据
tick = FutureTickData(tick_data)
print(tick.last_price)
```

## 核心类

### RealtimeBase

实时行情基类。

#### 属性

| 属性 | 类型 | 描述 |
|------|------|------|
| open | Optional[float] | 开盘价 |
| price | Optional[float] | 当前价 |
| high | Optional[float] | 最高价 |
| low | Optional[float] | 最低价 |
| code | Optional[str] | 股票代码 |
| bid1-5 | Optional[float] | 买1-5价 |
| ask1-5 | Optional[float] | 卖1-5价 |

### StockRealtimeData

股票实时数据类。

#### 方法

| 方法 | 返回类型 | 描述 |
|------|---------|------|
| to_dataframe | pd.DataFrame | 转换为 DataFrame |
| resample | None | 重采样 |

### FutureRealtimeData

期货实时数据类。

### RealtimeSeries

实时数据序列类。

### FutureTickData

期货 Tick 数据类。

#### 属性

| 属性 | 类型 | 描述 |
|------|------|------|
| trading_day | Optional[str] | 交易日期 |
| last_price | Optional[float] | 最新价 |
| volume | Optional[int] | 成交量 |

## 变更日志

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0.0 | 2024-01 | 初始版本 |
