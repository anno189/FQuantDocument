---
title: DataStruct - 核心概念
description: 深入理解 DataStruct 数据结构模块的核心概念
tag:
  - fqdata
  - datastruct
---

# DataStruct - 核心概念

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [术语表](./glossary.md) → **[核心概念](./concepts.md)** |
| 🔵 开发者 | [README](./README.md) → [技术架构](./architecture.md) → **[核心概念](./concepts.md)** |

## 概述

深入理解 DataStruct 数据结构模块的核心概念。

## 概念 1: Mixin 模式

### 概念解释

Mixin 模式是一种代码复用技术，允许类从多个 Mixin 类中继承方法，而不需要多重继承的复杂性。

### 原理

DataStruct 模块使用 Mixin 模式将功能分离为独立的类：
- `QuotationIndicatorsMixin` - 指标计算
- `QuotationOperationsMixin` - 数据操作
- `QuotationIOSMixin` - 序列化 IO

### 代码示例

```python
# 通过 Mixin 组合获取完整功能
class StockDayData(
    QuotationDataStructBase,      # 核心基类
    QuotationIndicatorsMixin,     # 指标计算
    QuotationOperationsMixin,     # 数据操作
    QuotationIOSMixin           # 序列化
):
    pass
```

## 概念 2: MultiIndex 数据结构

### 概念解释

行情数据使用 Pandas MultiIndex 进行索引，包含代码(code)和时间(date)两个维度。

### 原理

```python
# 创建 MultiIndex 数据
data = data.set_index(['code', 'date'])
#                   code       date        open  high  low  close  volume
# 000001  2024-01-01  10.0   10.5  9.5   10.2  1000000
# 000001  2024-01-02  10.5   11.0  10.0  10.8  1200000
```

### 代码示例

```python
import pandas as pd

data = pd.DataFrame({
    'code': ['000001', '000001'],
    'date': ['2024-01-01', '2024-01-02'],
    'close': [10.0, 10.5],
})
data['date'] = pd.to_datetime(data['date'])
data = data.set_index(['code', 'date'])
```

## 概念 3: 前后复权

### 概念解释

前后复权是股票行情数据处理中的重要概念，用于调整历史价格。

### 原理

| 类型 | 说明 |
|------|------|
| qfq | 前复权：将历史价格按最新价格复权 |
| hfq | 后复权：将最新价格按历史价格复权 |
| none | 不复权：保持原始价格 |

### 代码示例

```python
# 创建前复权数据
stock_qfq = StockDayData(data, if_fq='qfq')

# 创建后复权数据  
stock_hfq = StockDayData(data, if_fq='hfq')
```

## 概念 4: 重采样

### 概念解释

重采样是将数据从一种时间频率转换为另一种时间频率的过程。

### 原理

```
Tick数据 → 1分钟 → 5分钟 → 15分钟 → 30分钟 → 60分钟 → 日线 → 周线 → 月线
```

### 代码示例

```python
# 分钟线转日线
daily_data = min_data.resample('D')

# 日线转周线
weekly_data = daily_data.resample('W')
```

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [术语表](./glossary.md)
- [使用指南](./usage.md)
