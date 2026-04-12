# Date 模块使用指南

## 目录

1. [基础环境](#1-基础环境)
2. [时间戳处理](#2-时间戳处理)
3. [日期格式化](#3-日期格式化)
4. [交易日判断](#4-交易日判断)
5. [获取交易日](#5-获取交易日)
6. [交易时间判断](#6-交易时间判断)
7. [日期偏移](#7-日期偏移)
8. [日期区间](#8-日期区间)
9. [月度和季度](#9-月度和季度)

---

## 1. 基础环境

### 1.1 导入模块

```python
from FQBase.Date import (
    util_if_trade,
    util_get_next_trade_date,
    util_get_pre_trade_date,
    util_datetime_to_Unix_timestamp,
    util_timestamp_to_str,
    util_str_to_datetime,
    util_format_date2str,
    util_date_gap,
    trade_date_sse,
)
```

### 1.2 时区设置

```python
from FQBase.Date import QATZInfo_CN

print(QATZInfo_CN)  # "Asia/Shanghai"
```

---

## 2. 时间戳处理

### 2.1 datetime 转 Unix 时间戳

```python
from datetime import datetime

ts = util_datetime_to_Unix_timestamp(datetime.now())
print(ts)  # 1743600000.0
```

### 2.2 Unix 时间戳转字符串

```python
time_str = util_timestamp_to_str(1743600000)
print(time_str)  # "2026-04-02 12:00:00"
```

### 2.3 字符串转 Unix 时间戳

```python
ts = util_str_to_Unix_timestamp("2026-04-03")
print(ts)  # 1743686400.0

ts = util_str_to_Unix_timestamp("2026-04-03 09:30:00")
print(ts)  # 1743715800.0
```

### 2.4 字符串转 datetime

```python
dt = util_str_to_datetime("2026-04-03")
print(dt)  # 2026-04-03 00:00:00+08:00
```

### 2.5 时间戳转 datetime（自动识别精度）

```python
dt = util_stamp2datetime(1743600000)
print(dt)  # 2026-04-02 12:00:00

dt = util_stamp2datetime(1743600000000)  # 毫秒级
print(dt)  # 2026-04-02 12:00:00
```

### 2.6 打印友好格式

```python
friendly = util_print_timestamp(1743600000)
print(friendly)  # "26-04-02 12:00(1743600000)"
```

---

## 3. 日期格式化

### 3.1 获取当前日期

```python
today = util_date_today()
print(today)  # 2026-04-03

today_str = util_today_str()
print(today_str)  # "2026-04-03"
```

### 3.2 日期字符串与整数互转

```python
date_int = util_date_str2int("2026-04-03")
print(date_int)  # 20260403

date_str = util_date_int2str(20260403)
print(date_str)  # "2026-04-03"
```

### 3.3 通用日期字符串格式化

```python
date_str = util_format_date2str("20260403")
print(date_str)  # "2026-04-03"

date_str = util_format_date2str(20260403)
print(date_str)  # "2026-04-03"

date_str = util_format_date2str(datetime.now())
print(date_str)  # "2026-04-03"
```

### 3.4 datetime 转字符串

```python
dt = datetime.now()

date_only = util_datetime_to_strdate(dt)
print(date_only)  # "2026-04-03"

datetime_str = util_datetime_to_strdatetime(dt)
print(datetime_str)  # "2026-04-03 12:00:00"
```

### 3.5 验证日期格式

```python
is_valid = util_date_valid("2026-04-03")
print(is_valid)  # True

is_valid = util_date_valid("2026-13-45")
print(is_valid)  # False
```

---

## 4. 交易日判断

### 4.1 判断是否为交易日

```python
is_trade = util_if_trade("2026-04-03")
print(is_trade)  # True (普通交易日)

is_trade = util_if_trade("2026-04-05")
print(is_trade)  # False (清明节)

is_trade = util_if_trade("2026-04-04")
print(is_trade)  # False (清明节假期)
```

### 4.2 批量判断

```python
dates = ["2026-04-01", "2026-04-02", "2026-04-03", "2026-04-07"]
trade_dates = [d for d in dates if util_if_trade(d)]
print(trade_dates)  # ["2026-04-01", "2026-04-02", "2026-04-03", "2026-04-07"]
```

---

## 5. 获取交易日

### 5.1 获取下一个交易日

```python
next_trade = util_get_next_trade_date("2026-04-03")
print(next_trade)  # "2026-04-07"

next_trade = util_get_next_trade_date("2026-04-07", n=5)
print(next_trade)  # "2026-04-14"
```

### 5.2 获取前一个交易日

```python
prev_trade = util_get_pre_trade_date("2026-04-03")
print(prev_trade)  # "2026-04-02"

prev_trade = util_get_pre_trade_date("2026-04-07", n=3)
print(prev_trade)  # "2026-04-02"
```

### 5.3 获取最近的交易日

```python
real_date = util_get_real_date("2026-04-04")
print(real_date)  # "2026-04-03" (清明节后，向左找最近的)

real_date = util_get_real_date("2026-04-06")
print(real_date)  # "2026-04-07" (清明节后，向右找最近的)
```

### 5.4 获取真实日期区间

```python
real_start, real_end = util_get_real_datelist("2026-04-01", "2026-04-07")
print(real_start, real_end)  # "2026-04-01", "2026-04-07"

real_start, real_end = util_get_real_datelist("2026-04-04", "2026-04-06")
print(real_start, real_end)  # None, None (清明节假期)
```

### 5.5 获取交易日范围

```python
trade_range = util_get_trade_range("2026-03-30", "2026-04-10")
print(trade_range)
# ["2026-03-31", "2026-04-01", "2026-04-02", "2026-04-03", "2026-04-07"]
```

---

## 6. 交易时间判断

### 6.1 A股交易时间判断

```python
from datetime import datetime
from FQBase.Config.business.constants import MARKET_TYPE

dt = datetime(2026, 4, 3, 9, 30)  # 2026-04-03 09:30
is_trade_time = util_if_tradetime(dt, market=MARKET_TYPE.STOCK_CN)
print(is_trade_time)  # True

dt = datetime(2026, 4, 3, 12, 30)  # 午休时间
is_trade_time = util_if_tradetime(dt, market=MARKET_TYPE.STOCK_CN)
print(is_trade_time)  # False

dt = datetime(2026, 4, 5, 9, 30)  # 清明节
is_trade_time = util_if_tradetime(dt, market=MARKET_TYPE.STOCK_CN)
print(is_trade_time)  # False
```

### 6.2 期货交易时间判断

```python
from FQBase.Config.business.constants import MARKET_TYPE

dt = datetime(2026, 4, 3, 21, 0)  # 夜盘时间
is_trade_time = util_if_tradetime(dt, market=MARKET_TYPE.FUTURE_CN)
print(is_trade_time)  # True

is_trade_time = util_if_tradetime(dt, market=MARKET_TYPE.FUTURE_CN, code="AU")
print(is_trade_time)  # True (黄金期货)

is_trade_time = util_if_tradetime(dt, market=MARKET_TYPE.FUTURE_CN, code="RU")
print(is_trade_time)  # True (橡胶期货)
```

---

## 7. 日期偏移

### 7.1 交易日偏移

```python
next_day = util_date_gap("2026-04-03", 1, ">")
print(next_day)  # "2026-04-07"

next_day = util_date_gap("2026-04-03", 1, ">=")
print(next_day)  # "2026-04-03" (含当前)

prev_day = util_date_gap("2026-04-03", 1, "<")
print(prev_day)  # "2026-04-02"
```

### 7.2 日历日偏移

```python
next_day = util_date_gap("2026-04-03", 1, "+")
print(next_day)  # "2026-04-04"

prev_day = util_date_gap("2026-04-03", 1, "-")
print(prev_day)  # "2026-04-02"
```

### 7.3 获取日历日后n天

```python
next_day = util_get_next_day("2026-04-03", 5)
print(next_day)  # "2026-04-08"
```

### 7.4 获取日历日前n天

```python
last_day = util_get_last_day("2026-04-03", 5)
print(last_day)  # "2026-03-29"
```

### 7.5 交易日间隔天数

```python
gap = util_get_trade_gap("2026-04-01", "2026-04-10")
print(gap)  # 6 (清明节假期占用，实际只有6个交易日)
```

---

## 8. 日期区间

### 8.1 获取月度区间

```python
monthly = util_getBetweenMonth("2026-01-01", "2026-03-31")
print(monthly)
# {
#     '2026-01': ['2026-01-01', '2026-01-31'],
#     '2026-02': ['2026-02-01', '2026-02-28'],
#     '2026-03': ['2026-03-01', '2026-03-31']
# }
```

### 8.2 获取季度区间

```python
quarterly = util_getBetweenQuarter("2026-01-01", "2026-06-30")
print(quarterly)
# {
#     '2026Q1': ['2026-01-01', '2026-03-31'],
#     '2026Q2': ['2026-04-01', '2026-06-30']
# }
```

---

## 9. 月度和季度

### 9.1 月份偏移

```python
next_month = util_add_months("2026-01-15", 3)
print(next_month)  # datetime.datetime(2026, 4, 15, 0, 0)

prev_month = util_add_months("2026-01-15", -2)
print(prev_month)  # datetime.datetime(2025, 11, 15, 0, 0)
```

### 9.2 获取下个月第一天

```python
first_day = util_get_1st_of_next_month(datetime(2026, 1, 15))
print(first_day)  # datetime.datetime(2026, 2, 1, 0, 0)
```

### 9.3 每周固定星期列表

```python
fridays = get_weekday_list(2026, weekdays=4)
print(fridays[:5])  # ["2026-01-02", "2026-01-09", "2026-01-16", ...]
```

### 9.4 判断周末最后交易日

```python
is_weekend_end = util_week_end_day("2026-04-03")
print(is_weekend_end)  # True (如果4月3日是周五且是最后交易日)
```

---

## 10. 高级用法

### 10.1 计算策略持仓时间

```python
entry_date = "2026-03-25"
exit_date = "2026-04-03"

trade_days = util_get_trade_gap(entry_date, exit_date)
print(f"持仓交易日数: {trade_days}")

total_days = util_calc_time(exit_date, entry_date) / 86400
print(f"持仓日历日数: {total_days:.1f}")
```

### 10.2 期货交易时间转换

```python
real_dt = datetime(2026, 4, 3, 21, 30)
trade_dt = util_future_to_tradedatetime(real_dt)
print(trade_dt)  # 转换后的交易时间

real_dt2 = util_future_to_realdatetime(trade_dt)
print(real_dt2)  # 2026-04-03 21:30:00
```

### 10.3 获取交易时间段

```python
from FQBase.Config.business.constants import FREQUENCE

dt = datetime(2026, 4, 3, 9, 30)

next_period = util_get_next_period(dt, FREQUENCE.FIVE_MIN)
print(next_period)  # 2026-04-03 09:35:00

next_period = util_get_next_period(dt, FREQUENCE.THIRTY_MIN)
print(next_period)  # 2026-04-03 10:00:00
```
