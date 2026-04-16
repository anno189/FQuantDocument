---
title: datetime - 案例库
description: datetime 实际应用场景与示例
tag:
  - fqdata
  - trade
  - datetime
---

# datetime - 案例库

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → **[案例库](./examples.md)** |

## 场景 1: 判断日期是否为交易日

**业务需求：** 判断指定日期是否为A股交易日

```python
from FQData.Trade.datetime import util_if_trade

date = '2024-01-15'
is_trade = util_if_trade(date)
print(f"{date} 是交易日: {is_trade}")
```

## 场景 2: 获取下一个交易日

**业务需求：** 获取指定日期之后的第一个交易日

```python
from FQData.Trade.datetime import util_get_next_trade_date

date = '2024-01-15'
next_trade = util_get_next_trade_date(date)
print(f"{date} 的下一个交易日: {next_trade}")
```

## 场景 3: 日期加减计算

**业务需求：** 计算指定日期前后N天的日期

```python
from FQData.Trade.datetime import util_date_gap

date = '2024-01-15'

# 加3天
result_plus = util_date_gap(date, 3, '+')
print(f"{date} + 3天 = {result_plus}")

# 减5天
result_minus = util_date_gap(date, 5, '-')
print(f"{date} - 5天 = {result_minus}")
```

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
