---
title: Trade 交易模块 - 案例库
description: Trade 交易模块实际应用场景与示例
tag:
  - fqdata
  - trade
---

# Trade 交易模块 - 案例库

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → **[案例库](./examples.md)** |

## 概述

Trade 模块的实际应用场景与完整代码示例。

## 场景 1: 量化策略回测日期处理

**业务需求：** 在量化策略回测中，需要根据交易信号生成实际的下单日期序列

**代码实现：**

```python
from FQData.Trade import (
    util_if_trade,
    util_get_next_trade_date,
    util_get_real_datelist,
)

# 假设策略在 2024-01-02 产生信号
signal_date = "2024-01-02"

# 检查信号日是否为交易日
if util_if_trade(signal_date):
    # 获取下一个交易日作为下单日
    order_date = util_get_next_trade_date(signal_date, n=1)
    print(f"信号日期: {signal_date}, 下单日期: {order_date}")

# 生成回测区间的交易日序列
backtest_dates = util_get_real_datelist("2024-01-01", "2024-01-31")
print(f"回测交易日序列: {backtest_dates}")
```

---

## 场景 2: 交易订单常量使用

**业务需求：** 构建交易订单时使用标准常量

**代码实现：**

```python
from FQData.Trade import (
    ORDER_DIRECTION,
    MARKET_TYPE,
    FREQUENCE,
    ORDER_STATUS,
)

# 构建订单参数
order_params = {
    "direction": ORDER_DIRECTION.BUY,  # 买入
    "market": MARKET_TYPE.SH,  # 上海市场
    "freq": FREQUENCE.DAILY,  # 日线
}

# 订单状态判断
if order_status == ORDER_STATUS.FILLED:
    print("订单已全部成交")
elif order_status == ORDER_STATUS.PARTIAL:
    print("订单部分成交")
```

---

## 场景 3: 全局日期管理

**业务需求：** 在整个应用程序中统一获取当前交易日期

**代码实现：**

```python
from FQData.Trade import GLOBALDATE, get_today

# 方法1：使用快捷函数
today = get_today()
print(f"当前交易日期: {today}")

# 方法2：使用单例
gd = GLOBALDATE()
trade_date = gd.get_trade_date()
print(f"全局交易日期: {trade_date}")

# 获取上一个交易日
last_trade = gd.get_pre_trade_date(n=1)
print(f"上一个交易日: {last_trade}")
```

---

## 场景 4: 日期时间格式转换

**业务需求：** 在时间戳和日期字符串之间转换

**代码实现：**

```python
from FQData.Trade import (
    util_str_to_datetime,
    util_datetime_to_Unix_timestamp,
    util_timestamp_to_str,
    util_date_str2int,
    util_date_int2str,
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

# 日期字符串转整数
date_int = util_date_str2int("2024-01-02")
print(f"整数日期: {date_int}")

# 整数转日期字符串
date_str = util_date_int2str(20240102)
print(f"字符串日期: {date_str}")
```

---

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
