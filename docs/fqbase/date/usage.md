---
title: Date - 使用指南
description: Date 日期时间工具模块详细使用指南
tag:
  - fqbase
  - date
---

# Date - 使用指南

## 时间戳转换

```python
from FQBase.Date import (
    util_str_to_datetime,
    util_str_to_Unix_timestamp,
    util_timestamp_to_str,
)

# 字符串转日期
dt = util_str_to_datetime('2024-01-01')

# 字符串转时间戳
ts = util_str_to_Unix_timestamp('2024-01-01')

# 时间戳转字符串
s = util_timestamp_to_str(1704067200)
```

## 交易日操作

```python
from FQBase.Date import (
    util_if_trade,
    util_get_next_trade_date,
    util_get_pre_trade_date,
    util_get_trade_range,
)

# 判断是否为交易日
is_trade = util_if_trade('2024-01-01')

# 获取下一个交易日
next_date = util_get_next_trade_date('2024-01-01')

# 获取上一个交易日
pre_date = util_get_pre_trade_date('2024-01-01')

# 获取交易日范围
trade_dates = util_get_trade_range('2024-01-01', '2024-01-31')
```

---

## 相关文档

- [API参考](./api.md)
