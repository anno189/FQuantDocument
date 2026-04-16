---
title: _indicators - 行情数据统计指标 Mixin
description: 提供各类技术指标和统计量计算的 Mixin 类
tag:
  - fqdata
  - datastruct
  - indicators

summary:
  type: data-processing
  complexity: medium
  maturity: stable
  core_classes:
    - QuotationIndicatorsMixin
  features:
    is_pure_function: true
    is_thread_safe: true
  usage_scenarios:
    - "场景1：计算行情数据的统计指标"
    - "场景2：技术分析中的指标计算"
  warnings:
    - "Mixin 类不能直接实例化"
  limitations:
    - "需要与 QuotationDataStructBase 配合使用"

relationships:
  belongs_to:
    - fquant.fqdata.datastruct
  depends_on:
    - pandas

api:
  signatures:
    QuotationIndicatorsMixin:
      max: "self -> pd.Series"
      min: "self -> pd.Series"
      mean: "self -> pd.Series"
      variance: "self -> pd.Series"
      stdev: "self -> pd.Series"
      amplitude: "self -> pd.Series"
      pct_change: "self -> pd.Series"
      close_pct_change: "self -> pd.Series"
      bar_pct_change: "self -> pd.Series"
      bar_amplitude: "self -> pd.Series"
  examples:
    basic: |
      from FQData.DataStruct import StockDayData
      stock = StockDayData(data, dtype='stock_day', if_fq='bfq')
      print(stock.max)
      print(stock.amplitude)
---

# _indicators - 行情数据统计指标 Mixin

## 一句话总览

📌 **行情数据统计指标 Mixin，提供技术分析所需的各类指标计算**

## ⚠️ AI 开发必读

### 使用场景

✅ **应该使用**：
- 场景1：计算行情数据的统计指标
- 场景2：技术分析中的指标计算

❌ **不应该使用**：
- 不应该直接实例化 Mixin 类
- 不应该单独使用，需要与基类配合

### 注意事项

1. **Mixin 类不能直接实例化**
   - 说明：此类仅用于多重继承，必须放在 QuotationDataStructBase 之后

### 依赖

| 依赖类型 | 模块 | 说明 |
|---------|------|------|
| 必须 | pandas | 数据处理 |

**TL;DR**：
- 核心能力：max, min, mean, variance, amplitude, pct_change 等统计指标

## 快速开始

```python
from FQData.DataStruct import StockDayData

stock = StockDayData(data, dtype='stock_day', if_fq='bfq')
print(stock.max)        # 最大值
print(stock.amplitude)  # 振幅
print(stock.pct_change) # 涨跌幅
```

## 指标列表

### 统计类指标

| 指标 | 返回类型 | 描述 |
|------|---------|------|
| max | pd.Series | 最大值 |
| min | pd.Series | 最小值 |
| mean | pd.Series | 均值 |
| variance | pd.Series | 方差 |
| stdev | pd.Series | 标准差 |
| pstdev | pd.Series | 总体标准差 |
| mad | pd.Series | 平均绝对偏差 |

### 技术分析指标

| 指标 | 返回类型 | 描述 |
|------|---------|------|
| amplitude | pd.Series | 振幅（百分比） |
| pct_change | pd.Series | 涨跌幅 |
| close_pct_change | pd.Series | 收盘价涨跌幅 |
| bar_pct_change | pd.Series | 单根K线涨跌幅 |
| bar_amplitude | pd.Series | 单根K线振幅 |
| price_diff | pd.Series | 价格一阶差分 |

### 高级指标

| 指标 | 返回类型 | 描述 |
|------|---------|------|
| skew | pd.Series | 偏度 |
| kurt | pd.Series | 峰度 |
| mode | pd.Series | 众数 |
| normalized | pd.DataFrame | 归一化数据 |

## 常见错误

| 错误 | 原因 | 解决方案 |
|------|------|---------|
| AttributeError | Mixin 未正确继承 | 确保继承顺序正确 |

## 变更日志

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0.0 | 2024-01 | 初始版本 |
