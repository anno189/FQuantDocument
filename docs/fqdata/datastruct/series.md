---
title: series - 序列数据
description: 数据序列封装类
tag:
  - fqdata
  - datastruct
  - series

summary:
  type: data-processing
  complexity: low
  maturity: stable
  core_classes:
    - SeriesData
  features:
    is_thread_safe: true
  usage_scenarios:
    - "场景1：封装单列数据"
    - "场景2：序列数据筛选"
  warnings: []
  limitations:
    - "仅支持单列数据处理"

relationships:
  belongs_to:
    - fquant.fqdata.datastruct
  depends_on:
    - pandas

api:
  signatures:
    SeriesData:
      __init__: "(self, series: pd.Series) -> None"
      series: "self -> pd.Series"
      index: "self -> Any"
      code: "self -> Optional[List[str]]"
      datetime: "self -> Optional[List[pd.Timestamp]]"
      select_code: "(self, code: str) -> SeriesData"
      select_time: "(self, start: str, end: Optional[str] = None) -> SeriesData"
      to_series: "(self) -> pd.Series"
      to_dataframe: "(self) -> pd.DataFrame"
  examples:
    basic: |
      from FQData.DataStruct import SeriesData
      series = SeriesData(pd.Series([1, 2, 3]))
      print(series.to_dataframe())
---

# series - 序列数据

## 一句话总览

📌 **数据序列封装类**

## ⚠️ AI 开发必读

### 使用场景

✅ **应该使用**：
- 场景1：封装单列数据
- 场景2：序列数据筛选

❌ **不应该使用**：
- 不应该用于多列数据处理

### 依赖

| 依赖类型 | 模块 | 说明 |
|---------|------|------|
| 必须 | pandas | 数据处理 |

**TL;DR**：
- 核心能力：序列封装、筛选、转换

## 快速开始

```python
from FQData.DataStruct import SeriesData
import pandas as pd

series = SeriesData(pd.Series([1, 2, 3], index=['a', 'b', 'c']))

# 转换为 DataFrame
df = series.to_dataframe()

# 按代码筛选
filtered = series.select_code('000001')
```

## 核心类

### SeriesData

#### 属性

| 属性 | 类型 | 描述 |
|------|------|------|
| series | pd.Series | 原始序列 |
| index | Any | 索引 |
| code | Optional[List[str]] | 代码列表 |
| datetime | Optional[List[pd.Timestamp]] | 时间列表 |

#### 方法

| 方法 | 返回类型 | 描述 |
|------|---------|------|
| select_code | SeriesData | 按代码筛选 |
| select_time | SeriesData | 按时间筛选 |
| to_series | pd.Series | 转换为 Series |
| to_dataframe | pd.DataFrame | 转换为 DataFrame |

## 变更日志

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0.0 | 2024-01 | 初始版本 |
