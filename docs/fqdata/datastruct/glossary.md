---
title: DataStruct - 术语表
description: DataStruct 数据结构模块术语定义与解释
tag:
  - fqdata
  - datastruct
---

# DataStruct - 术语表

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → **[术语表](./glossary.md)** |

## 概述

DataStruct 模块术语定义。

## 术语

### MultiIndex

**定义：** Pandas 多级索引，用于同时按代码和时间索引数据

**示例：**

```python
data = data.set_index(['code', 'date'])
#                          open  high  low  close  volume
# code     date
# 000001  2024-01-01   10.0  10.5  9.5   10.2  1000000
# 000001  2024-01-02   10.5  11.0  10.0  10.8  1200000
```

### OHLC

**定义：** 开盘价(Open)、最高价(High)、最低价(Low)、收盘价(Close)的缩写

**示例：**

```python
# 标准 OHLC 数据列
data[['open', 'high', 'low', 'close']]
```

### 复权

**定义：** 对历史股价进行调整，分为前复权和后复权

| 类型 | 说明 |
|------|------|
| 前复权 (qfq) | 将历史价格按最新价格复权 |
| 后复权 (hfq) | 将最新价格按历史价格复权 |
| 不复权 (none) | 保持原始价格不变 |

### 重采样

**定义：** 将数据从一种时间频率转换为另一种时间频率

**示例：**

```python
# 分钟转日线
daily = min_data.resample('D')

# 日线转周线
weekly = daily_data.resample('W')
```

### Mixin

**定义：** Python 中的一种代码复用模式，通过多重继承组合功能

**示例：**

```python
class StockDayData(QuotationDataStructBase, QuotationIndicatorsMixin, QuotationOperationsMixin):
    pass
```

### 涨跌幅

**定义：** 股票价格涨跌的百分比

**计算公式：** `(收盘价 - 昨收价) / 昨收价 * 100%`

### 振幅

**定义：** 最高价与最低价之差与昨收价的百分比

**计算公式：** `(最高价 - 最低价) / 昨收价 * 100%`

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [核心概念](./concepts.md)
- [使用指南](./usage.md)
