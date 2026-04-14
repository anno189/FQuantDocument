---
title: Date - 快速入门
description: 5分钟快速上手 FQBase 日期时间工具
tag:
  - fqbase
  - date

summary:
  purpose: quick-start
  complexity: low
---

# Date - 快速入门

## 概述

本指南将帮助您在 5 分钟内掌握 FQBase 日期时间工具的基本用法。

## 前置要求

- Python 3.8+
- fquant-fqbase

## 安装

```bash
pip install fquant-fqbase
```

## 5分钟上手

### Step 1: 导入模块

```python
from FQBase.Date import util_if_trade, util_str_to_datetime
```

### Step 2: 判断交易日

```python
# 判断是否为交易日
is_trade = util_if_trade("2024-01-01")
print(f"是否为交易日: {is_trade}")
```

### Step 3: 日期时间转换

```python
# 字符串转 datetime
dt = util_str_to_datetime("2024-01-01 10:30:00")
print(f"转换结果: {dt}")
```

### Step 4: 获取交易日

```python
from FQBase.Date import util_get_next_trade_date, util_get_trade_range

# 获取下一个交易日
next_day = util_get_next_trade_date("2024-01-01", n=1)
print(f"下一个交易日: {next_day}")

# 获取交易日列表
trade_days = util_get_trade_range("2024-01-01", "2024-01-31")
print(f"交易日列表: {trade_days[:5]}")  # 前5个
```

### Step 5: 时间戳转换

```python
from FQBase.Date import util_datetime_to_Unix_timestamp, util_timestamp_to_str

# datetime 转时间戳
ts = util_datetime_to_Unix_timestamp()
print(f"当前时间戳: {ts}")

# 时间戳转字符串
time_str = util_timestamp_to_str(ts)
print(f"时间字符串: {time_str}")
```

### 完成！

恭喜！您已经掌握了 Date 模块的基本用法。

## 常见陷阱

1. **时区问题**：默认使用北京时间 (+0800)
2. **日期格式**：字符串格式必须为 "YYYY-MM-DD" 或 "YYYY-MM-DD HH:MM:SS"
3. **非交易日**：周末和节假日返回 False

## 下一步

- 学习 [核心概念](./concepts.md)
- 阅读 [术语表](./glossary.md)
- 查看 [使用指南](./usage.md)

## 相关文档

- [README](./README.md)
- [API参考](./api.md)
- [使用指南](./usage.md)
