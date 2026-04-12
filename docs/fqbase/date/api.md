# Date 模块 API 参考

## 目录

- [常量](#1-常量)
- [timestamp.py - 时间戳与日期时间转换](#2-timestamppy---时间戳与日期时间转换)
- [trade.py - 交易日相关算法](#3-tradepy---交易日相关算法)

---

## 1. 常量

### QATZInfo_CN

```python
QATZInfo_CN: str = 'Asia/Shanghai'
```

北京时区常量，用于时间戳转换时指定时区。

---

## 2. timestamp.py - 时间戳与日期时间转换

### util_datetime_to_Unix_timestamp

```python
def util_datetime_to_Unix_timestamp(ts_epoch: datetime = None) -> float
```

datetime对象转换为Unix时间戳。

**参数**：
- `ts_epoch`: datetime对象，默认当前时间

**返回**：`float` - Unix时间戳（秒）

**示例**：

```python
from datetime import datetime, timezone, timedelta

ts = util_datetime_to_Unix_timestamp(datetime.now())
print(ts)  # 1743600000.0

ts = util_datetime_to_Unix_timestamp()  # 默认当前时间
```

---

### util_timestamp_to_str

```python
def util_timestamp_to_str(
    ts_epoch: Union[int, float, datetime, np.int32, np.int64] = None,
    local_tz: timezone = timezone(timedelta(hours=8))
) -> str
```

时间戳转换为可读字符串格式 "YYYY-MM-DD HH:MM:SS"。

**参数**：
- `ts_epoch`: 时间戳或datetime，默认当前时间
- `local_tz`: 时区，默认北京时间

**返回**：`str` - 格式化的时间字符串

**示例**：

```python
result = util_timestamp_to_str(1743600000)
print(result)  # "2026-04-02 12:00:00"
```

---

### util_str_to_Unix_timestamp

```python
def util_str_to_Unix_timestamp(time_: str, tz_str: str = ' +0800') -> float
```

字符串转换为Unix时间戳。

**参数**：
- `time_`: 日期时间字符串，支持10位、16位、19位格式
- `tz_str`: 时区字符串，默认 " +0800"

**返回**：`float` - Unix时间戳

**示例**：

```python
ts = util_str_to_Unix_timestamp("2026-04-03")
print(ts)  # 1743600000.0

ts = util_str_to_Unix_timestamp("2026-04-03 09:30")
print(ts)  # 1743634200.0
```

---

### util_str_to_datetime

```python
def util_str_to_datetime(time: str, tz_str: str = ' +0800') -> datetime
```

字符串转换为datetime对象。

**参数**：
- `time`: 日期时间字符串
- `tz_str`: 时区字符串，默认 " +0800"

**返回**：`datetime` - datetime对象

**示例**：

```python
dt = util_str_to_datetime("2026-04-03")
print(dt)  # 2026-04-03 00:00:00+08:00
```

---

### util_print_timestamp

```python
def util_print_timestamp(ts_epoch: float) -> str
```

打印友好格式的时间戳字符串。

**参数**：
- `ts_epoch`: Unix时间戳

**返回**：`str` - 友好格式 "YY-MM-DD HH:MM(时间戳)"

**示例**：

```python
result = util_print_timestamp(1743600000)
print(result)  # "26-04-02 12:00(1743600000)"
```

---

### util_date_stamp

```python
def util_date_stamp(date: Union[str, int, float]) -> float
```

日期字符串转浮点数时间戳。

**参数**：
- `date`: 日期字符串

**返回**：`float` - 时间戳

---

### util_time_stamp

```python
def util_time_stamp(time_: Union[str, int]) -> float
```

日期时间字符串转浮点数时间戳。

**参数**：
- `time_`: 日期时间字符串，支持多种格式

**返回**：`float` - 时间戳

---

### util_tdxtimestamp

```python
def util_tdxtimestamp(time_stamp: float) -> str
```

转换通达信的realtimeQuote时间戳。

**参数**：
- `time_stamp`: 通达信时间戳

**返回**：`str` - 时间字符串

---

### util_stamp2datetime

```python
def util_stamp2datetime(timestamp: Union[int, float]) -> datetime
```

时间戳转datetime，支持多种精度。

**参数**：
- `timestamp`: Unix时间戳，支持13位、10位、微妙、纳秒

**返回**：`datetime` - datetime对象

---

### util_ms_stamp

```python
def util_ms_stamp(ms: float) -> float
```

直接返回时间戳，不做处理。

**参数**：
- `ms`: 时间戳

**返回**：`float` - 时间戳

---

### util_time_now

```python
def util_time_now() -> datetime
```

获取当前日期时间。

**返回**：`datetime` - 当前datetime

---

### util_date_today

```python
def util_date_today() -> date
```

获取当前日期。

**返回**：`date` - 当前日期

---

### util_today_str

```python
def util_today_str() -> str
```

返回今天的日期字符串 "YYYY-MM-DD"。

**返回**：`str` - 日期字符串

---

### util_date_str2int

```python
def util_date_str2int(date: Union[str, int]) -> int
```

转换日期字符串为整数。

**参数**：
- `date`: "YYYY-MM-DD" 格式字符串

**返回**：`int` - YYYYMMDD 格式整数

**示例**：

```python
result = util_date_str2int("2026-04-03")
print(result)  # 20260403
```

---

### util_date_int2str

```python
def util_date_int2str(int_date: Union[int, float]) -> str
```

转换日期整数为字符串。

**参数**：
- `int_date`: YYYYMMDD 格式整数

**返回**：`str` - "YYYY-MM-DD" 格式字符串

**示例**：

```python
result = util_date_int2str(20260403)
print(result)  # "2026-04-03"
```

---

### util_to_datetime

```python
def util_to_datetime(time: str) -> datetime
```

转换字符串格式的日期为datetime。

**参数**：
- `time`: 日期时间字符串

**返回**：`datetime` - datetime对象

---

### util_datetime_to_strdate

```python
def util_datetime_to_strdate(dt: datetime) -> str
```

转换日期时间为字符串 "YYYY-MM-DD"。

**参数**：
- `dt`: datetime对象

**返回**：`str` - 日期字符串

---

### util_datetime_to_strdatetime

```python
def util_datetime_to_strdatetime(dt: datetime) -> str
```

转换日期时间为字符串 "YYYY-MM-DD HH:MM:SS"。

**参数**：
- `dt`: datetime对象

**返回**：`str` - 日期时间字符串

---

### util_date_valid

```python
def util_date_valid(date: str) -> bool
```

判断字符串是否为有效日期格式。

**参数**：
- `date`: 日期字符串

**返回**：`bool` - 是否有效

---

### util_get_date_index

```python
def util_get_date_index(date: str, trade_list: list) -> int
```

返回日期在trade_list中的索引位置。

**参数**：
- `date`: 日期字符串
- `trade_list`: 日期列表

**返回**：`int` - 索引位置

---

### util_get_index_date

```python
def util_get_index_date(index: int, trade_list: list) -> str
```

根据索引返回trade_list中的日期。

**参数**：
- `index`: 索引
- `trade_list`: 日期列表

**返回**：`str` - 日期字符串

---

### util_select_hours

```python
def util_select_hours(time: Union[datetime, str], start: int, end: int) -> bool
```

判断时间是否在指定小时段内。

**参数**：
- `time`: 时间
- `start`: 开始小时（含）
- `end`: 结束小时（不含）

**返回**：`bool` - 是否在范围内

---

### util_select_min

```python
def util_select_min(time: Union[datetime, str], start: int, end: int) -> bool
```

判断分钟是否在指定时间段内。

**参数**：
- `time`: 时间
- `start`: 开始分钟（含）
- `end`: 结束分钟（不含）

**返回**：`bool` - 是否在范围内

---

### util_time_delay

```python
def util_time_delay(time: Union[datetime, str], delay: int) -> datetime
```

时间延迟指定秒数。

**参数**：
- `time`: 起始时间
- `delay`: 延迟秒数

**返回**：`datetime` - 延迟后的时间

---

### util_calc_time

```python
def util_calc_time(time1: Union[datetime, str], time2: Union[datetime, str]) -> float
```

计算两个时间之间的差值（秒）。

**参数**：
- `time1`: 第一个时间
- `time2`: 第二个时间

**返回**：`float` - 秒数差

---

### month_data

```python
def month_data(year: int = None) -> List[str]
```

获取指定年份的月度日期列表。

**参数**：
- `year`: 年份，默认当前年份

**返回**：`List[str]` - ["YYYY-01-01", "YYYY-02-01", ..., "YYYY-12-01"]

---

## 3. trade.py - 交易日相关算法

### trade_date_sse

```python
trade_date_sse: List[str] = TRADE_DATE_SSE
```

上海证券交易所历年交易日列表，元素格式 "YYYY-MM-DD"。

---

### util_if_trade

```python
def util_if_trade(day: str) -> bool
```

判断日期是否为交易日。

**参数**：
- `day`: 日期字符串，格式 "YYYY-MM-DD"

**返回**：`bool` - 是否为交易日

**示例**：

```python
result = util_if_trade("2026-04-03")
print(result)  # True

result = util_if_trade("2026-04-05")
print(result)  # False (清明节)
```

---

### util_get_next_trade_date

```python
def util_get_next_trade_date(
    cursor_date: Union[str, pd.Timestamp, datetime.datetime, None] = None,
    n: int = 1
) -> str
```

获取后n个交易日。如果当前日期为交易日，则不包含当前日期。

**参数**：
- `cursor_date`: 输入日期，默认当天
- `n`: 回溯交易日数目，默认1

**返回**：`str` - 下一个交易日 "YYYY-MM-DD"

**示例**：

```python
next_day = util_get_next_trade_date("2026-04-03", n=1)
print(next_day)  # "2026-04-07"

next_day = util_get_next_trade_date("2026-04-03", n=5)
print(next_day)  # "2026-04-14"
```

---

### util_get_pre_trade_date

```python
def util_get_pre_trade_date(
    cursor_date: Union[str, pd.Timestamp, datetime.datetime, None] = None,
    n: int = 1
) -> str
```

获取前n个交易日。如果当前日期为交易日，则不包含当前日期。

**参数**：
- `cursor_date`: 输入日期，默认当天
- `n`: 回溯交易日数目，默认1

**返回**：`str` - 前一个交易日 "YYYY-MM-DD"

**示例**：

```python
prev_day = util_get_pre_trade_date("2026-04-03", n=1)
print(prev_day)  # "2026-04-02"
```

---

### util_get_real_date

```python
def util_get_real_date(
    date: Union[str, datetime.datetime],
    trade_list: List[str] = None,
    towards: int = -1
) -> str
```

获取最近的交易日，使用二分查找优化。

**参数**：
- `date`: 输入日期
- `trade_list`: 交易日列表，默认trade_date_sse
- `towards`: 方向，-1表示往左找（小于等于），1表示往右找（大于等于）

**返回**：`str` - 最近的交易日

**性能**：O(log n) 时间复杂度

---

### util_format_date2str

```python
def util_format_date2str(cursor_date: Union[str, int, datetime.datetime, datetime.date]) -> str
```

格式化日期为标准字符串 "YYYY-MM-DD"。

**参数**：
- `cursor_date`: 输入日期，支持多种格式

**返回**：`str` - "YYYY-MM-DD" 格式字符串

---

### util_if_tradetime

```python
def util_if_tradetime(
    time: datetime.datetime = None,
    market: str = None,
    code: str = None
) -> bool
```

判断时间是否在交易时间内。

**参数**：
- `time`: 指定时间，默认当前时间
- `market`: 市场类型，默认MARKET_TYPE.STOCK_CN
- `code`: 合约代码，用于期货

**返回**：`bool` - 是否在交易时间内

**支持市场**：
- `MARKET_TYPE.STOCK_CN` - A股
- `MARKET_TYPE.FUTURE_CN` - 国内期货

---

### util_get_next_day

```python
def util_get_next_day(date: Union[str, datetime.date], n: int = 1) -> str
```

获取后n个日历日（不是交易日）。

**参数**：
- `date`: 起始日期
- `n`: 日历日数量

**返回**：`str` - "YYYY-MM-DD" 格式日期字符串

---

### util_get_last_day

```python
def util_get_last_day(date: Union[str, datetime.date], n: int = 1) -> str
```

获取前n个日历日（不是交易日）。

**参数**：
- `date`: 起始日期
- `n`: 日历日数量

**返回**：`str` - "YYYY-MM-DD" 格式日期字符串

---

### util_get_trade_gap

```python
def util_get_trade_gap(start: str, end: str) -> int
```

获取两个交易日之间的交易日间隔天数。

**参数**：
- `start`: 起始日期
- `end`: 结束日期

**返回**：`int` - 交易日间隔（注意：当start > end时会交换顺序）

---

### util_date_gap

```python
def util_date_gap(date: str, gap: int, methods: str = "+") -> str
```

基于交易日进行日期偏移计算。

**参数**：
- `date`: 起始日期
- `gap`: 偏移交易日数量
- `methods`: 偏移方向
  - `"gt"` 或 `">"`: 向后偏移
  - `"gte"`: 向后偏移（含当前）
  - `"lt"` 或 `"<"`: 向前偏移
  - `"lte"`: 向前偏移（含当前）
  - `"eq"` 或 `"="`: 返回当前日期
  - `"+"`: 日历日后gap天
  - `"-"`: 日历日前gap天

**返回**：`str` - 偏移后的日期

---

### util_get_next_period

```python
def util_get_next_period(datetime_obj: datetime.datetime, frequence: str = "1min") -> datetime.datetime
```

得到给定频率的下一个周期起始时间。

**参数**：
- `datetime_obj`: datetime对象
- `frequence`: 频率，如 "1min", "5min", "30min", "1h", "1d"

**返回**：`datetime.datetime` - 下一周期起始时间

---

### util_get_last_datetime

```python
def util_get_last_datetime(datetime_obj: datetime.datetime, day: int = 1) -> str
```

获取几天前的交易日时间。

**参数**：
- `datetime_obj`: datetime对象
- `day`: 天数

**返回**：`str` - "YYYY-MM-DD HH:MM:SS" 格式

---

### util_get_next_datetime

```python
def util_get_next_datetime(datetime_obj: datetime.datetime, day: int = 1) -> str
```

获取几天后的交易日时间。

**参数**：
- `datetime_obj`: datetime对象
- `day`: 天数

**返回**：`str` - "YYYY-MM-DD HH:MM:SS" 格式

---

### util_get_real_datelist

```python
def util_get_real_datelist(start: str, end: str) -> Optional[Tuple[str, str]]
```

获取数据的真实区间。

**参数**：
- `start`: 起始日期
- `end`: 结束日期

**返回**：`Tuple[str, str]` - (真实起始, 真实结束)，中间无交易日时返回 (None, None)

---

### util_get_trade_range

```python
def util_get_trade_range(start: str, end: str) -> Optional[List[str]]
```

获取交易日范围内的所有日期列表。

**参数**：
- `start`: 起始日期
- `end`: 结束日期

**返回**：`List[str]` - 交易日列表，失败返回None

---

### util_get_trade_datetime

```python
def util_get_trade_datetime(dt: datetime.datetime) -> str
```

获取交易的真实日期。

**参数**：
- `dt`: datetime对象

**返回**：`str` - 日期字符串

---

### util_get_order_datetime

```python
def util_get_order_datetime(dt: Union[str, datetime.datetime]) -> str
```

获取委托的真实日期。

**参数**：
- `dt`: datetime对象或字符串

**返回**：`str` - 日期时间字符串

---

### util_future_to_tradedatetime

```python
def util_future_to_tradedatetime(real_datetime: datetime.datetime) -> datetime.datetime
```

输入是真实交易时间，返回按期货交易所规定的时间。

**参数**：
- `real_datetime`: 真实交易时间

**返回**：`datetime.datetime` - 交易所规定时间

---

### util_future_to_realdatetime

```python
def util_future_to_realdatetime(trade_datetime: datetime.datetime) -> datetime.datetime
```

输入是交易所规定的时间，返回真实时间。

**参数**：
- `trade_datetime`: 交易所规定时间

**返回**：`datetime.datetime` - 真实时间

---

### util_week_end_day

```python
def util_week_end_day(end_date: Optional[str] = None) -> bool
```

判断是否是每周最后一个交易日。

**参数**：
- `end_date`: 日期字符串，默认当天

**返回**：`bool` - 是否为周末最后交易日

---

### get_weekday_list

```python
def get_weekday_list(year: int = 2024, weekdays: int = 5) -> List[str]
```

获取每年指定星期的日期列表。

**参数**：
- `year`: 年份
- `weekdays`: 0=周一, 1=周二, ..., 6=周日

**返回**：`List[str]` - 排序后的日期列表

---

### util_getBetweenMonth

```python
def util_getBetweenMonth(from_date: str, to_date: str) -> Dict[str, List[str]]
```

返回所有月份及每月的起始、结束日期。

**参数**：
- `from_date`: 起始日期 "YYYY-MM-DD"
- `to_date`: 结束日期 "YYYY-MM-DD"

**返回**：`Dict[str, List[str]]` - 键为 "YYYY-MM"，值为 [起始日期, 结束日期]

**示例**：

```python
result = util_getBetweenMonth("2026-01-01", "2026-03-31")
# {
#     '2026-01': ['2026-01-01', '2026-01-31'],
#     '2026-02': ['2026-02-01', '2026-02-28'],
#     '2026-03': ['2026-03-01', '2026-03-31']
# }
```

---

### util_add_months

```python
def util_add_months(dt: str, months: int) -> datetime.datetime
```

返回指定日期隔指定月数后的日期。

**参数**：
- `dt`: 日期字符串 "YYYY-MM-DD"
- `months`: 月份数量（正数为未来，负数为过去）

**返回**：`datetime.datetime` - 偏移后的日期

**示例**：

```python
result = util_add_months("2026-01-15", 3)
print(result)  # datetime.datetime(2026, 4, 15, 0, 0)
```

---

### util_get_1st_of_next_month

```python
def util_get_1st_of_next_month(dt: Union[datetime.datetime, datetime.date]) -> datetime.datetime
```

获取下个月第一天的日期。

**参数**：
- `dt`: 输入日期

**返回**：`datetime.datetime` - 下个月第一天

**示例**：

```python
result = util_get_1st_of_next_month(datetime.datetime(2026, 1, 15))
print(result)  # datetime.datetime(2026, 2, 1, 0, 0)
```

---

### util_getBetweenQuarter

```python
def util_getBetweenQuarter(begin_date: str, end_date: str) -> Dict[str, List[str]]
```

返回所有季度及每季度的起始、结束日期。

**参数**：
- `begin_date`: 起始日期 "YYYY-MM-DD"
- `end_date`: 结束日期 "YYYY-MM-DD"

**返回**：`Dict[str, List[str]]` - 键为 "YYYYQN"，值为 [起始日期, 结束日期]

**示例**：

```python
result = util_getBetweenQuarter("2026-01-01", "2026-06-30")
# {
#     '2026Q1': ['2026-01-01', '2026-03-31'],
#     '2026Q2': ['2026-04-01', '2026-06-30']
# }
```
