---
title: indicator - 指标数据
description: 技术指标数据类
tag:
  - fqdata
  - datastruct
  - indicator

summary:
  type: data-processing
  complexity: low
  maturity: stable
  core_classes:
    - IndicatorData
  features:
    is_thread_safe: true
  usage_scenarios:
    - "场景1：获取技术指标数据"
    - "场景2：计算自定义指标"
  warnings: []
  limitations:
    - "仅支持指标数据处理"

relationships:
  belongs_to:
    - fquant.fqdata.datastruct
  depends_on:
    - pandas

api:
  signatures:
    IndicatorData:
      __init__: "(self, data: pd.DataFrame) -> None"
      data: "self -> pd.DataFrame"
      index: "self -> pd.MultiIndex"
      code: "self -> List[str]"
      datetime: "self -> List[pd.Timestamp]"
      get_indicator: "(self, indicator_name: str) -> pd.DataFrame"
      get_code: "(self, code: str) -> pd.DataFrame"
      get_timerange: "(self, start: str, end: str) -> pd.DataFrame"
      groupby: "(self, level: str) -> pd.DataFrame"
      to_df: "(self) -> pd.DataFrame"
      to_dict: "(self, orient: str = 'index') -> dict"
  examples:
    basic: |
      from FQData.DataStruct import IndicatorData
      indicator = IndicatorData(data)
      print(indicator.get_indicator('MA5'))
---

# indicator - 指标数据

## 一句话总览

📌 **技术指标数据管理**

## ⚠️ AI 开发必读

### 使用场景

✅ **应该使用**：
- 场景1：获取技术指标数据
- 场景2：计算自定义指标

❌ **不应该使用**：
- 不应该用于行情数据处理

### 依赖

| 依赖类型 | 模块 | 说明 |
|---------|------|------|
| 必须 | pandas | 数据处理 |

**TL;DR**：
- 核心能力：指标查询、指标计算

## 快速开始

```python
from FQData.DataStruct import IndicatorData

indicator = IndicatorData(data)

# 获取指标
ma5 = indicator.get_indicator('MA5')

# 按代码筛选
code_data = indicator.get_code('000001')

# 按时间范围筛选
range_data = indicator.get_timerange('2024-01-01', '2024-12-31')
```

## 核心类

### IndicatorData

#### 属性

| 属性 | 类型 | 描述 |
|------|------|------|
| data | pd.DataFrame | 原始数据 |
| index | pd.MultiIndex | 索引 |
| code | List[str] | 股票代码列表 |
| datetime | List[pd.Timestamp] | 时间戳列表 |

#### 方法

| 方法 | 返回类型 | 描述 |
|------|---------|------|
| get_indicator | pd.DataFrame | 获取指标数据 |
| get_code | pd.DataFrame | 按代码筛选 |
| get_timerange | pd.DataFrame | 按时间范围筛选 |
| groupby | pd.DataFrame | 分组 |
| to_df | pd.DataFrame | 转换为 DataFrame |
| to_dict | dict | 转换为字典 |

## 变更日志

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0.0 | 2024-01 | 初始版本 |
