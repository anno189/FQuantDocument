---
title: _base - 行情数据结构核心基类
description: 提供基础属性和核心接口的抽象基类
tag:
  - fqdata
  - datastruct
  - base

summary:
  type: data-processing
  complexity: high
  maturity: stable
  core_classes:
    - QuotationDataStructBase
  features:
    is_thread_safe: true
    has_mixin_pattern: true
  usage_scenarios:
    - "场景1：创建自定义行情数据类"
    - "场景2：实现多市场统一数据接口"
  warnings:
    - "Mixin 类不能直接实例化"
    - "pickle 反序列化后需要调用 _init_subclass()"
  limitations:
    - "仅支持 A 股、期货、债券等国内金融市场"
    - "不支持实时数据推送"

relationships:
  belongs_to:
    - fquant.fqdata.datastruct
  depends_on:
    - fquant.fqbase
    - pandas
    - numpy

api:
  signatures:
    QuotationDataStructBase:
      __init__: "(self, data: pd.DataFrame, dtype: str, if_fq: str = 'bfq', market_type: str = None, frequence: str = None) -> None"
      data: "self -> pd.DataFrame"
      dtype: "self -> str"
      if_fq: "self -> str"
      market_type: "self -> str"
      frequence: "self -> str"
      open: "self -> pd.Series"
      high: "self -> pd.Series"
      low: "self -> pd.Series"
      close: "self -> pd.Series"
      volume: "self -> pd.Series"
      price: "self -> pd.Series"
      to_df: "self -> pd.DataFrame"
      select_code: "(self, code: str) -> QuotationDataStructBase"
      select_time: "(self, start_date: str, end_date: str) -> QuotationDataStructBase"
      fillna: "(self, value: Any = None, method: str = None, inplace: bool = False) -> QuotationDataStructBase"
      dropna: "(self, axis: int = 0, how: str = 'any', inplace: bool = False) -> QuotationDataStructBase"
      resample: "(self, level: str) -> QuotationDataStructBase"
  examples:
    __init__: |
      import pandas as pd
      from FQData.DataStruct import StockDayData

      data = pd.DataFrame({
          'open': [10.0, 11.0],
          'high': [10.5, 11.5],
          'low': [9.5, 10.5],
          'close': [10.2, 11.2],
          'volume': [1000, 2000]
      }, index=pd.MultiIndex.from_tuples([
          ('000001', '2024-01-01'),
          ('000001', '2024-01-02')
      ], names=['code', 'date']))

      stock = StockDayData(data, dtype='stock_day', if_fq='bfq')
      print(stock.close)

    select_code: |
      stock = StockDayData(data, dtype='stock_day', if_fq='bfq')
      selected = stock.select_code('000001')
      print(selected.to_df())
---

# _base - 行情数据结构核心基类

## 一句话总览

📌 **行情数据抽象基类，提供统一的数据操作接口**

## ⚠️ AI 开发必读

### 使用场景

✅ **应该使用**：
- 场景1：创建自定义行情数据类
- 场景2：实现多市场统一数据接口

❌ **不应该使用**：
- 不应该直接实例化 Mixin 类
- 不应该用于实时数据推送场景

### 注意事项

1. **Mixin 类不能直接实例化**
   - 说明：Mixin 类是功能组合层，需要与基类一起使用

2. **pickle 反序列化后需要调用 _init_subclass()**
   - 说明：序列化后缓存状态可能失效

### 已知限制

- 限制1：仅支持 A 股、期货、债券等国内金融市场
- 限制2：不支持实时数据推送，仅支持批量查询

### 依赖

| 依赖类型 | 模块 | 说明 |
|---------|------|------|
| 必须 | fquant.fqbase | 基础工具 |
| 必须 | pandas | 数据处理 |
| 必须 | numpy | 数值计算 |

**TL;DR**：
- 核心能力：数据筛选、指标计算、周期转换、序列化导出
- 入门难度：🔵 中等

## 快速开始

```python
from FQData.DataStruct import StockDayData
import pandas as pd

data = pd.DataFrame({
    'open': [10.0],
    'high': [10.5],
    'low': [9.5],
    'close': [10.2],
    'volume': [1000]
}, index=pd.MultiIndex.from_tuples([
    ('000001', '2024-01-01')
], names=['code', 'date']))

stock = StockDayData(data, dtype='stock_day', if_fq='bfq')
print(stock.close)
```

## 核心类

### QuotationDataStructBase

行情数据抽象基类，定义统一的行情数据接口。

#### 属性

| 属性 | 类型 | 描述 |
|------|------|------|
| data | pd.DataFrame | 原始 DataFrame |
| dtype | str | 数据类型标识 |
| if_fq | str | 复权类型 |
| open | pd.Series | 开盘价 |
| high | pd.Series | 最高价 |
| low | pd.Series | 最低价 |
| close | pd.Series | 收盘价 |
| volume | pd.Series | 成交量 |
| price | pd.Series | 价格 |

#### 方法

##### __init__

```python
def __init__(
    self,
    data: pd.DataFrame,
    dtype: str,
    if_fq: str = 'bfq',
    market_type: str = None,
    frequence: str = None
) -> None
```

**参数：**
| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| data | pd.DataFrame | 是 | 行情数据 |
| dtype | str | 是 | 数据类型 |
| if_fq | str | 否 | 复权类型 |
| market_type | str | 否 | 市场类型 |
| frequence | str | 否 | 数据频率 |

##### select_code

```python
def select_code(self, code: str) -> 'QuotationDataStructBase'
```

**描述：** 按股票代码筛选数据

##### fillna

```python
def fillna(
    self,
    value: Any = None,
    method: str = None,
    inplace: bool = False
) -> 'QuotationDataStructBase'
```

**描述：** 填充缺失值

##### resample

```python
def resample(self, level: str) -> Optional['QuotationDataStructBase']
```

**描述：** 数据重采样（周期转换）

## 常见错误

| 错误 | 原因 | 解决方案 |
|------|------|---------|
| KeyError | 列名不存在 | 检查数据列名 |
| ValueError | 代码或时间筛选无效 | 检查筛选参数 |

## 变更日志

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0.0 | 2024-01 | 初始版本 |
