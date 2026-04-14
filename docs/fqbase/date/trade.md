---
title: Trade
description: 交易日相关算法模块，提供交易日判断、日期偏移等功能
tag:
  - fqbase
  - date

summary:
  type: utility
  complexity: minimal
  maturity: stable
  functions:
    - util_if_trade
    - util_get_next_trade_date
    - util_get_pre_trade_date
    - util_get_real_date
    - util_format_date2str
    - util_if_tradetime
    - util_get_next_day
    - util_get_last_day
    - util_get_trade_gap
    - util_date_gap
    - util_get_next_period
    - util_get_last_datetime
    - util_get_next_datetime
    - util_get_real_datelist
    - util_get_trade_range
    - util_get_trade_datetime
    - util_get_order_datetime
    - util_future_to_tradedatetime
    - util_future_to_realdatetime
    - util_week_end_day
    - get_weekday_list
    - util_getBetweenMonth
    - util_add_months
    - util_get_1st_of_next_month
    - util_getBetweenQuarter
  # ⚠️ AI 开发必需信息
  usage_scenarios:
    - "判断某日期是否为交易日"
    - "获取前后N个交易日"
    - "获取日期范围内的交易日列表"
    - "判断当前时间是否在交易时间内"
    - "期货日期与交易日期转换"
  warnings:
    - "期货夜盘日期归属需注意（夜盘属于前一交易日）"
    - "util_date_gap 的 methods 参数有多种写法"
    - "A股交易时间为 09:30-11:30, 13:00-15:00"
  limitations:
    - "仅支持A股交易日历"
    - "不支持港股、美股等其他市场"

relationships:
  belongs_to:
    - fquant.fqbase.date
  depends_on: []
  import_path:
    - from FQBase.Date.trade import util_if_trade, util_get_next_trade_date
---

# Trade

## 一句话总览

📌 **交易日相关算法模块，交易日判断、日期偏移、交易时间判断**

**TL;DR**：
- 核心能力：交易日判断、前后交易日计算、日期范围获取
- 入门难度：🟢 简单

## 快速开始

```python
from FQBase.Date.trade import util_if_trade, util_get_next_trade_date

if util_if_trade("2026-04-03"):
    next_day = util_get_next_trade_date("2026-04-03", n=1)
```

## 常量

### trade_date_sse

```python
trade_date_sse: List[str]
```

上海证券交易所历年交易日列表，元素格式 "YYYY-MM-DD"。

## 函数列表

### util_if_trade

```python
from FQBase.Date.trade import util_if_trade

result = util_if_trade(day='2024-01-01')
```

**描述：** 判断日期是否为交易日

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| day | str | 是 | 日期字符串 |

**返回：** `bool` - 是否为交易日

**示例：**

```python
print(util_if_trade("2026-04-03"))  # True
print(util_if_trade("2026-04-05"))  # False (清明节)
```

---

### util_get_next_trade_date

```python
from FQBase.Date.trade import util_get_next_trade_date

result = util_get_next_trade_date(cursor_date=None, n=1)
```

**描述：** 获取后 n 个交易日（不包含当前日期）

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| cursor_date | str \| pd.Timestamp \| datetime \| None | 否 | 当前日期 | 基准日期 |
| n | int | 否 | 1 | 偏移天数 |

**返回：** `str` - 目标日期字符串

**示例：**

```python
next_day = util_get_next_trade_date("2026-04-03", n=5)
print(next_day)  # 2026-04-14
```

---

### util_get_pre_trade_date

```python
from FQBase.Date.trade import util_get_pre_trade_date

result = util_get_pre_trade_date(cursor_date=None, n=1)
```

**描述：** 获取前 n 个交易日（不包含当前日期）

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| cursor_date | str \| pd.Timestamp \| datetime \| None | 否 | 当前日期 | 基准日期 |
| n | int | 否 | 1 | 偏移天数 |

**返回：** `str` - 目标日期字符串

**示例：**

```python
prev_day = util_get_pre_trade_date("2026-04-03", n=1)
print(prev_day)  # 2026-04-02
```

---

### util_get_real_date

```python
from FQBase.Date.trade import util_get_real_date

result = util_get_real_date(date='2024-01-01')
```

**描述：** 获取实际日期（如果是交易日返回自身，否则返回下一个交易日）

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| date | str | 是 | 日期字符串 |

**返回：** `str` - 实际日期 |

---

### util_format_date2str

```python
from FQBase.Date.trade import util_format_date2str

result = util_format_date2str(cursor_date=None)
```

**描述：** 格式化日期为字符串

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| cursor_date | str \| int \| datetime.datetime \| datetime.date | 是 | 日期 |

**返回：** `str` - 格式化后的日期字符串

---

### util_if_tradetime

```python
from FQBase.Date.trade import util_if_tradetime

result = util_if_tradetime(time='2024-01-01 10:00:00')
```

**描述：** 判断是否为交易时间

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| time | str | 是 | 时间字符串 |

**返回：** `bool` - 是否在交易时间内

**交易时间**：
- 上午：09:30 - 11:30
- 下午：13:00 - 15:00

---

### util_get_next_day

```python
from FQBase.Date.trade import util_get_next_day

result = util_get_next_day(date='2024-01-01', n=1)
```

**描述：** 获取后 n 个日历日

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| date | str \| datetime.date | 是 | - | 基准日期 |
| n | int | 否 | 1 | 偏移天数 |

**返回：** `str` - 目标日期字符串

---

### util_get_last_day

```python
from FQBase.Date.trade import util_get_last_day

result = util_get_last_day(date='2024-01-01', n=1)
```

**描述：** 获取前 n 个日历日

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| date | str \| datetime.date | 是 | - | 基准日期 |
| n | int | 否 | 1 | 偏移天数 |

**返回：** `str` - 目标日期字符串

---

### util_get_trade_gap

```python
from FQBase.Date.trade import util_get_trade_gap

result = util_get_trade_gap(start='2024-01-01', end='2024-01-31')
```

**描述：** 计算两个日期之间的交易日天数

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| start | str | 是 | 开始日期 |
| end | str | 是 | 结束日期 |

**返回：** `int` - 交易日天数 |

---

### util_date_gap

```python
from FQBase.Date.trade import util_date_gap

result = util_date_gap(date='2024-01-01', gap=5, methods='+')
```

**描述：** 基于交易日进行日期偏移计算

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| date | str | 是 | 基准日期 |
| gap | int | 是 | 偏移天数 |
| methods | str | 否 | 偏移方向：'+' 或 '-' |

**返回：** `str` - 目标日期字符串

**methods 参数说明**：
- `"gt"` 或 `">"`: 向后偏移
- `"gte"`: 向后偏移（含当前）
- `"lt"` 或 `"<"`: 向前偏移
- `"lte"`: 向前偏移（含当前）
- `"eq"` 或 `"="`: 返回当前日期
- `"+"`: 日历日后 gap 天

---

### util_get_real_datelist

```python
from FQBase.Date.trade import util_get_real_datelist

result = util_get_real_datelist(start='2024-01-01', end='2024-01-31')
```

**描述：** 获取日期范围内的实际交易日列表

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| start | str | 是 | 开始日期 |
| end | str | 是 | 结束日期 |

**返回：** `Optional[Tuple[str, str]]` - (开始日期, 结束日期) |

---

### util_get_trade_range

```python
from FQBase.Date.trade import util_get_trade_range

result = util_get_trade_range(start='2024-01-01', end='2024-01-31')
```

**描述：** 获取日期范围内的交易日列表

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| start | str | 是 | 开始日期 |
| end | str | 是 | 结束日期 |

**返回：** `Optional[List[str]]` - 交易日列表 |

---

### util_week_end_day

```python
from FQBase.Date.trade import util_week_end_day

result = util_week_end_day(end_date='2024-01-01')
```

**描述：** 判断是否为周末（周五）

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| end_date | str | 否 | 日期，默认今天 |

**返回：** `bool` - 是否是周五 |

---

### get_weekday_list

```python
from FQBase.Date.trade import get_weekday_list

result = get_weekday_list(year=2024, weekdays=5)
```

**描述：** 获取一年的工作日列表

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| year | int | 否 | 当前年份 | 年份 |
| weekdays | int | 否 | 5 | 每周工作日数 |

**返回：** `List[str]` - 工作日日期列表 |

---

### util_getBetweenMonth

```python
from FQBase.Date.trade import util_getBetweenMonth

result = util_getBetweenMonth(from_date='2024-01-01', to_date='2024-12-31')
```

**描述：** 获取两个日期之间的月份列表

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| from_date | str | 是 | 开始日期 |
| to_date | str | 是 | 结束日期 |

**返回：** `Dict[str, List[str]]` - 月份与日期列表 |

---

### util_add_months

```python
from FQBase.Date.trade import util_add_months

result = util_add_months(dt='2024-01-01', months=1)
```

**描述：** 日期加减月份

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| dt | str | 是 | 日期字符串 |
| months | int | 是 | 偏移月数 |

**返回：** `datetime.datetime` - 结果日期 |

---

### util_get_1st_of_next_month

```python
from FQBase.Date.trade import util_get_1st_of_next_month

result = util_get_1st_of_next_month(dt='2024-01-15')
```

**描述：** 获取下个月第一天

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| dt | str \| datetime.date | 是 | 日期 |

**返回：** `datetime.datetime` - 下个月第一天 |

---

### util_getBetweenQuarter

```python
from FQBase.Date.trade import util_getBetweenQuarter

result = util_getBetweenQuarter(begin_date='2024-01-01', end_date='2024-12-31')
```

**描述：** 获取两个日期之间的季度列表

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| begin_date | str | 是 | 开始日期 |
| end_date | str | 是 | 结束日期 |

**返回：** `Dict[str, List[str]]` - 季度与日期列表 |

---

## 变更日志

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0.0 | 2024-01-01 | 初始版本 |
