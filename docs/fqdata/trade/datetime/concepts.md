---
title: datetime - 核心概念
description: 深入理解 datetime 模块的核心概念
tag:
  - fqdata
  - trade
  - datetime
---

# datetime - 核心概念

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → **[核心概念](./concepts.md)** → [API参考](./api.md) |

## 概述

datetime 模块的核心概念详解

## 概念 1: 交易日

### 概念解释

交易日是指证券交易所开市进行交易的日子。中国A股市场的交易日为周一至周五（节假日除外）。

### 原理

模块通过静态数据 `trade_dates_data.py` 存储上交所历史交易日列表，查询时遍历列表判断日期是否在列表中。

### 代码示例

```python
from FQData.Trade.datetime import util_if_trade

# 判断是否为交易日
result = util_if_trade('2024-01-15')  # 返回 True 或 False
```

## 概念 2: 时间戳

### 概念解释

时间戳是自 1970年1月1日 00:00:00 UTC 到指定日期/时间的秒数。模块支持 Unix 时间戳和毫秒时间戳。

### 原理

使用 Python 的 datetime 模块进行转换，支持时区处理。

### 代码示例

```python
from FQData.Trade.datetime import util_datetime_to_Unix_timestamp, util_str_to_datetime

# 日期转时间戳
ts = util_datetime_to_Unix_timestamp()
print(ts)

# 字符串转日期
dt = util_str_to_datetime('2024-01-15 10:30:00')
```

## 概念 3: 日期偏移

### 概念解释

日期偏移是指在给定日期基础上加上或减去一定天数，得到新的日期。

### 原理

使用 datetime.timedelta 进行日期计算。

### 代码示例

```python
from FQData.Trade.datetime import util_date_gap

# 加3天
result = util_date_gap('2024-01-15', 3, '+')

# 减5天
result = util_date_gap('2024-01-15', 5, '-')
```

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [API参考](./api.md)
- [使用指南](./usage.md)
