---
title: Trade 交易模块 - 使用指南
description: Trade 交易模块详细使用指南
tag:
  - fqdata
  - trade
---

# Trade 交易模块 - 使用指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → **[使用指南](./usage.md)** → [案例库](./examples.md) |
| 🔵 开发者 | [README](./README.md) → [使用指南](./usage.md) → [API参考](./api.md) → [最佳实践](./best-practices.md) |

## 概述

详细说明如何使用 Trade 模块的各个子模块。

## 基本用法

### 导入模块

```python
from FQData.Trade import (
    # 常量
    ORDER_DIRECTION,
    MARKET_TYPE,
    FREQUENCE,
    # 日期时间
    util_if_trade,
    util_get_next_trade_date,
    # 运行时
    GLOBALDATE,
    get_today,
)
```

## 常见用例

### 用例 1: 使用交易常量

```python
from FQData.Trade import ORDER_DIRECTION, MARKET_TYPE, FREQUENCE

# 订单方向
direction = ORDER_DIRECTION.BUY
print(f"订单方向: {direction}")

# 市场类型
market = MARKET_TYPE.SH
print(f"市场: {market}")

# 数据频率
freq = FREQUENCE.DAILY
print(f"频率: {freq}")
```

### 用例 2: 判断交易日

```python
from FQData.Trade import util_if_trade

# 判断是否为交易日
is_trade = util_if_trade("2024-01-02")
print(f"2024-01-02 是否为交易日: {is_trade}")

# 判断周末
is_trade = util_if_trade("2024-01-06")
print(f"2024-01-06 是否为交易日: {is_trade}")
```

### 用例 3: 计算前后交易日

```python
from FQData.Trade import util_get_next_trade_date, util_get_pre_trade_date

# 获取后3个交易日
next3 = util_get_next_trade_date("2024-01-02", n=3)
print(f"后3个交易日: {next3}")

# 获取前2个交易日
pre2 = util_get_pre_trade_date("2024-01-02", n=2)
print(f"前2个交易日: {pre2}")
```

### 用例 4: 使用全局日期单例

```python
from FQData.Trade import GLOBALDATE, get_today

# 获取当前交易日期
today = get_today()
print(f"当前交易日期: {today}")

# 使用全局日期单例
gd = GLOBALDATE()
trade_date = gd.get_trade_date()
print(f"全局交易日期: {trade_date}")
```

### 用例 5: 日期时间转换

```python
from FQData.Trade import (
    util_str_to_datetime,
    util_datetime_to_Unix_timestamp,
    util_timestamp_to_str,
)

# 字符串转 datetime
dt = util_str_to_datetime("2024-01-02 10:30:00")
print(f"datetime: {dt}")

# datetime 转时间戳
ts = util_datetime_to_Unix_timestamp(dt)
print(f"时间戳: {ts}")

# 时间戳转字符串
time_str = util_timestamp_to_str(ts)
print(f"时间字符串: {time_str}")
```

## 高级用法

### 与 DataFrame 结合

```python
import pandas as pd
from FQData.Trade import util_if_trade, util_get_real_datelist

# 筛选交易日
df = pd.DataFrame({
    'date': ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05'],
    'value': [100, 101, 102, 103, 104]
})

# 筛选出交易日的数据
df['is_trade'] = df['date'].apply(util_if_trade)
trade_df = df[df['is_trade']]
print(trade_df)
```

## 相关文档

- [API参考](./api.md)
- [最佳实践](./best-practices.md)
- [案例库](./examples.md)
