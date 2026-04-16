---
title: resample - 数据重采样
description: 行情数据周期转换函数
tag:
  - fqdata
  - datastruct
  - resample

summary:
  type: data-processing
  complexity: low
  maturity: stable
  core_functions:
    - tick_resample
    - min_resample
    - stockmin_resample
    - min_to_day
    - day_resample
    - futuremin_resample
    - futureday_resample
  features:
    is_pure_function: true
    is_thread_safe: true
  usage_scenarios:
    - "场景1：分钟线转换为日线"
    - "场景2：日线转换为周线/月线"
  warnings: []
  limitations:
    - "需要正确的时间索引"

relationships:
  belongs_to:
    - fquant.fqdata.datastruct
  depends_on:
    - pandas

api:
  signatures:
    tick_resample: "(tick: pd.DataFrame, type_: str = '1min') -> pd.DataFrame"
    min_resample: "(min_data: pd.DataFrame, type_: str = '5min') -> pd.DataFrame"
    stockmin_resample: "(min_data: pd.DataFrame, period: Union[int, str] = 5) -> pd.DataFrame"
    min_to_day: "(min_data: pd.DataFrame, type_: str = '1D') -> pd.DataFrame"
    day_resample: "(day_data: pd.DataFrame, type_: str = 'w') -> pd.DataFrame"
    futuremin_resample: "(min_data: pd.DataFrame, period: Union[int, str] = 5) -> pd.DataFrame"
    futureday_resample: "(day_data: pd.DataFrame, type_: str = 'w') -> pd.DataFrame"
  examples:
    basic: |
      from FQData.DataStruct.resample import min_to_day, day_resample

      # 分钟线转日线
      daily = min_to_day(min_data)

      # 日线转周线
      weekly = day_resample(daily, 'w')
---

# resample - 数据重采样

## 一句话总览

📌 **行情数据周期转换工具函数**

## ⚠️ AI 开发必读

### 使用场景

✅ **应该使用**：
- 场景1：分钟线转换为日线
- 场景2：日线转换为周线/月线

❌ **不应该使用**：
- 不应该用于非时间序列数据

### 注意事项

1. **需要正确的时间索引**
   - 说明：数据必须包含正确的时间索引

### 依赖

| 依赖类型 | 模块 | 说明 |
|---------|------|------|
| 必须 | pandas | 数据处理 |

**TL;DR**：
- 核心能力：tick_resample, min_resample, day_resample 等转换函数

## 快速开始

```python
from FQData.DataStruct.resample import (
    min_to_day,
    day_resample,
    stockmin_resample
)

# 分钟线转日线
daily = min_to_day(min_data)

# 日线转周线
weekly = day_resample(daily, 'w')

# 日线转月线
monthly = day_resample(daily, 'm')

# 股票分钟重采样
resampled = stockmin_resample(min_data, 5)
```

## 函数列表

### Tick 数据

| 函数 | 描述 |
|------|------|
| tick_resample | Tick 数据重采样为分钟线 |

### 分钟数据

| 函数 | 描述 |
|------|------|
| min_resample | 分钟数据重采样 |
| stockmin_resample | 股票分钟数据重采样 |
| futuremin_resample | 期货分钟数据重采样 |
| min_to_day | 分钟线转日线 |

### 日线数据

| 函数 | 描述 |
|------|------|
| day_resample | 日线重采样（周线、月线） |
| futureday_resample | 期货日线重采样 |

## 常见错误

| 错误 | 原因 | 解决方案 |
|------|------|---------|
| KeyError | 时间列不存在 | 检查数据索引 |
| ValueError | 重采样参数无效 | 检查 type 参数 |

## 变更日志

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0.0 | 2024-01 | 初始版本 |
