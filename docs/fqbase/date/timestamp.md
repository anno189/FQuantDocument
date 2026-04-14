---
title: Timestamp
description: 时间戳与日期时间转换工具
tag:
  - fqbase
  - date
  - utility

summary:
  type: utility
  complexity: minimal
  maturity: stable
  functions:
    - util_datetime_to_Unix_timestamp
    - util_timestamp_to_str
    - util_str_to_Unix_timestamp
    - util_str_to_datetime
    - util_print_timestamp
    - util_date_stamp
    - util_time_stamp
    - util_tdxtimestamp
    - util_stamp2datetime
    - util_ms_stamp
    - util_time_now
    - util_date_today
    - util_today_str
    - util_date_str2int
    - util_date_int2str
    - util_to_datetime
    - util_datetime_to_strdate
    - util_datetime_to_strdatetime
    - util_date_valid
    - util_get_date_index
    - util_get_index_date
    - util_select_hours
    - util_select_min
    - util_time_delay
    - util_calc_time
    - month_data
  # ⚠️ AI 开发必需信息
  usage_scenarios:
    - "Unix时间戳与datetime互转"
    - "日期字符串与datetime互转"
    - "获取当前时间戳或日期"
    - "通达信时间戳格式转换"
  warnings:
    - "注意秒级 timestamp 和毫秒级 timestamp 的区别"
    - "通达信使用特殊时间戳格式"
  limitations:
    - "仅支持标准时间格式"

relationships:
  belongs_to:
    - fquant.fqbase.date
  depends_on: []
  import_path:
    - from FQBase.Date.timestamp import util_datetime_to_Unix_timestamp, util_timestamp_to_str
---

# Timestamp

## 一句话总览

📌 **时间戳与日期时间转换工具，Unix时间戳、字符串、datetime 互转**

**TL;DR**：
- 核心能力：时间戳转换、日期计算、时间段判断
- 入门难度：🟢 简单

## 快速开始

```python
from FQBase.Date.timestamp import util_datetime_to_Unix_timestamp, util_timestamp_to_str

ts = util_datetime_to_Unix_timestamp()
time_str = util_timestamp_to_str(ts)
```

## 常量

### QATZInfo_CN

```python
QATZInfo_CN: str = 'Asia/Shanghai'
```

北京时区常量，用于时间戳转换时指定时区。

## 函数列表

### util_datetime_to_Unix_timestamp

```python
from FQBase.Date.timestamp import util_datetime_to_Unix_timestamp

result = util_datetime_to_Unix_timestamp(ts_epoch=None)
```

**描述：** datetime 转 Unix 时间戳，默认时区为北京时间

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| ts_epoch | datetime | 否 | 当前时间 | datetime 对象 |

**返回：** `float` - Unix 时间戳

**示例：**

```python
from datetime import datetime
ts = util_datetime_to_Unix_timestamp(datetime.now())
print(ts)  # 1743600000.0
```

---

### util_timestamp_to_str

```python
from FQBase.Date.timestamp import util_timestamp_to_str

result = util_timestamp_to_str(ts_epoch=None, local_tz=None)
```

**描述：** 时间戳转字符串格式时间

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| ts_epoch | int \| float \| datetime \| np.int32 \| np.int64 | 否 | 当前时间 | 时间戳或 datetime |
| local_tz | timezone | 否 | 北京时间 | 时区 |

**返回：** `str` - "YYYY-MM-DD HH:MM:SS" 格式字符串

**示例：**

```python
time_str = util_timestamp_to_str(1743600000)
print(time_str)  # 2026-04-02 12:00:00
```

---

### util_str_to_Unix_timestamp

```python
from FQBase.Date.timestamp import util_str_to_Unix_timestamp

result = util_str_to_Unix_timestamp(time_='2024-01-01', tz_str=' +0800')
```

**描述：** 字符串转 Unix 时间戳，默认时区为北京时间

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| time_ | str | 是 | 日期时间字符串 |
| tz_str | str | 否 | 时区字符串，默认 ' +0800' |

**返回：** `float` - Unix 时间戳

---

### util_str_to_datetime

```python
from FQBase.Date.timestamp import util_str_to_datetime

result = util_str_to_datetime(time='2024-01-01', tz_str=' +0800')
```

**描述：** 字符串转 datetime

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| time | str | 是 | 日期时间字符串 |
| tz_str | str | 否 | 时区字符串，默认 ' +0800' |

**返回：** `datetime` - datetime 对象

---

### util_print_timestamp

```python
from FQBase.Date.timestamp import util_print_timestamp

result = util_print_timestamp(ts_epoch=1743600000.0)
```

**描述：** 打印友好阅读的时间格式

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| ts_epoch | float | 是 | Unix 时间戳 |

**返回：** `str` - 友好格式字符串

**示例：**

```python
print(util_print_timestamp(1743600000.0))  # 24-04-02 12:00:00(1743600000)
```

---

### util_date_stamp

```python
from FQBase.Date.timestamp import util_date_stamp

result = util_date_stamp(date='2024-01-01')
```

**描述：** 日期时间字符串转浮点数时间戳

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| date | str \| int \| float | 是 | 日期字符串 |

**返回：** `Optional[float]` - 时间戳，失败返回 None

---

### util_time_stamp

```python
from FQBase.Date.timestamp import util_time_stamp

result = util_time_stamp(time_='2024-01-01 10:30:00')
```

**描述：** 日期时间字符串转浮点数时间戳，支持多种格式

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| time_ | str \| int | 是 | 日期时间字符串 |

**返回：** `Optional[float]` - 时间戳，失败返回 None

---

### util_tdxtimestamp

```python
from FQBase.Date.timestamp import util_tdxtimestamp

result = util_tdxtimestamp(time_stamp=93560000)
```

**描述：** 转换通达信的 realtimeQuote 时间戳

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| time_stamp | float | 是 | 通达信时间戳 |

**返回：** `str` - 时间字符串

---

### util_stamp2datetime

```python
from FQBase.Date.timestamp import util_stamp2datetime

result = util_stamp2datetime(timestamp=1743600000)
```

**描述：** 时间戳转 datetime，支持13位、10位、微秒、纳秒

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| timestamp | int \| float | 是 | Unix 时间戳 |

**返回：** `datetime` - datetime 对象

---

### util_ms_stamp

```python
from FQBase.Date.timestamp import util_ms_stamp

result = util_ms_stamp(ms=1743600000.0)
```

**描述：** 直接返回时间戳，不做处理

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| ms | float | 是 | 时间戳 |

**返回：** `float` - 时间戳

---

### util_time_now

```python
from FQBase.Date.timestamp import util_time_now

result = util_time_now()
```

**描述：** 获取当前日期时间

**返回：** `datetime` - 当前 datetime

---

### util_date_today

```python
from FQBase.Date.timestamp import util_date_today

result = util_date_today()
```

**描述：** 获取当前日期

**返回：** `date` - 当前日期

---

### util_today_str

```python
from FQBase.Date.timestamp import util_today_str

result = util_today_str()
```

**描述：** 返回今天的日期字符串

**返回：** `str` - "YYYY-MM-DD" 格式字符串

---

### util_date_str2int

```python
from FQBase.Date.timestamp import util_date_str2int

result = util_date_str2int(date='2024-01-01')
```

**描述：** 转换日期字符串为整数

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| date | str \| int | 是 | 日期字符串或整数 |

**返回：** `int` - 日期整数

---

### util_date_int2str

```python
from FQBase.Date.timestamp import util_date_int2str

result = util_date_int2str(int_date=20240101)
```

**描述：** 转换日期整数为字符串

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| int_date | int \| float | 是 | 日期整数 |

**返回：** `str` - "YYYY-MM-DD" 格式字符串

---

### util_to_datetime

```python
from FQBase.Date.timestamp import util_to_datetime

result = util_to_datetime(time='2024-01-01')
```

**描述：** 转换字符串格式的日期为 datetime

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| time | str | 是 | 日期时间字符串 |

**返回：** `datetime` - datetime 对象

---

### util_datetime_to_strdate

```python
from FQBase.Date.timestamp import util_datetime_to_strdate

result = util_datetime_to_strdate(dt=datetime.now())
```

**描述：** 转换日期时间为字符串

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| dt | datetime | 是 | datetime 对象 |

**返回：** `str` - "YYYY-MM-DD" 格式字符串

---

### util_datetime_to_strdatetime

```python
from FQBase.Date.timestamp import util_datetime_to_strdatetime

result = util_datetime_to_strdatetime(dt=datetime.now())
```

**描述：** 转换日期时间为字符串格式

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| dt | datetime | 是 | datetime 对象 |

**返回：** `str` - "YYYY-MM-DD HH:MM:SS" 格式字符串

---

### util_date_valid

```python
from FQBase.Date.timestamp import util_date_valid

result = util_date_valid(date='2024-01-01')
```

**描述：** 判断字符串格式是否有效

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| date | str | 是 | 日期字符串 |

**返回：** `bool` - 是否有效

---

### util_get_date_index

```python
from FQBase.Date.timestamp import util_get_date_index

result = util_get_date_index(date='2024-01-05', trade_list=['2024-01-01', '2024-01-02', '2024-01-03'])
```

**描述：** 返回日期在 trade_list 中的 index 位置

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| date | str | 是 | 日期字符串 |
| trade_list | list | 是 | 日期列表 |

**返回：** `int` - 索引位置

---

### util_get_index_date

```python
from FQBase.Date.timestamp import util_get_index_date

result = util_get_index_date(index=2, trade_list=['2024-01-01', '2024-01-02', '2024-01-03'])
```

**描述：** 根据 index 返回 trade_list 中的日期

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| index | int | 是 | 索引位置 |
| trade_list | list | 是 | 日期列表 |

**返回：** `str` - 日期字符串

---

### util_select_hours

```python
from FQBase.Date.timestamp import util_select_hours

result = util_select_hours(time='2024-01-01 10:30:00', start=9, end=12)
```

**描述：** 判断时间是否在指定时间段内（小时）

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| time | datetime \| str | 是 | 时间 |
| start | int | 是 | 开始小时 |
| end | int | 是 | 结束小时 |

**返回：** `bool` - 是否在时间段内

---

### util_select_min

```python
from FQBase.Date.timestamp import util_select_min

result = util_select_min(time='2024-01-01 10:30:00', start=0, end=30)
```

**描述：** 判断分钟是否在指定时间段内

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| time | datetime \| str | 是 | 时间 |
| start | int | 是 | 开始分钟 |
| end | int | 是 | 结束分钟 |

**返回：** `bool` - 是否在时间段内

---

### util_time_delay

```python
from FQBase.Date.timestamp import util_time_delay

result = util_time_delay(time='2024-01-01 10:00:00', delay=3600)
```

**描述：** 时间延迟

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| time | datetime \| str | 是 | 时间 |
| delay | int | 是 | 延迟秒数 |

**返回：** `datetime` - 延迟后的时间

---

### util_calc_time

```python
from FQBase.Date.timestamp import util_calc_time

result = util_calc_time('2024-01-01 12:00:00', '2024-01-01 10:00:00')
```

**描述：** 计算两个时间之间的差值（秒）

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| time1 | datetime \| str | 是 | 时间1 |
| time2 | datetime \| str | 是 | 时间2 |

**返回：** `float` - 时间差（秒）

---

### month_data

```python
from FQBase.Date.timestamp import month_data

result = month_data(year=2024)
```

**描述：** 获取月份数据列表

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| year | int | 否 | 当前年份 | 年份 |

**返回：** `List[str]` - ["YYYY-01-01", "YYYY-02-01", ..., "YYYY-12-01"] 格式的日期列表

**示例：**

```python
months = month_data(2024)
print(months)  # ['2024-01-01', '2024-02-01', ..., '2024-12-01']
```

---

## 变更日志

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0.0 | 2024-01-01 | 初始版本 |
