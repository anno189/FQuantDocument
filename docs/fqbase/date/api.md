---
title: Date - API参考
description: Date 日期时间工具模块 API 参考文档
tag:
  - fqbase
  - date

summary:
  purpose: api-reference
---

# Date - API参考

## 时间戳转换

### util_str_to_datetime

```python
from FQBase.Date import util_str_to_datetime

dt = util_str_to_datetime(date_str: str) -> datetime
```

### util_datetime_to_Unix_timestamp

```python
from FQBase.Date import util_datetime_to_Unix_timestamp

ts = util_datetime_to_Unix_timestamp(dt: datetime) -> int
```

### util_str_to_Unix_timestamp

```python
from FQBase.Date import util_str_to_Unix_timestamp

ts = util_str_to_Unix_timestamp(date_str: str) -> int
```

### util_timestamp_to_str

```python
from FQBase.Date import util_timestamp_to_str

s = util_timestamp_to_str(timestamp: int) -> str
```

### util_date_stamp

```python
from FQBase.Date import util_date_stamp

stamp = util_date_stamp(date_str: str) -> float
```

### util_time_stamp

```python
from FQBase.Date import util_time_stamp

stamp = util_time_stamp() -> float
```

## 交易日判断

### util_if_trade

```python
from FQBase.Date import util_if_trade

is_trade = util_if_trade(date_str: str) -> bool
```

### util_get_next_trade_date

```python
from FQBase.Date import util_get_next_trade_date

next_date = util_get_next_trade_date(date_str: str, n: int = 1) -> str
```

### util_get_pre_trade_date

```python
from FQBase.Date import util_get_pre_trade_date

pre_date = util_get_pre_trade_date(date_str: str, n: int = 1) -> str
```

## 日期操作

### util_get_next_day

```python
from FQBase.Date import util_get_next_day

next_day = util_get_next_day(date_str: str) -> str
```

### util_get_last_day

```python
from FQBase.Date import util_get_last_day

last_day = util_get_last_day(date_str: str) -> str
```

### util_date_gap

```python
from FQBase.Date import util_date_gap

gap = util_date_gap(start: str, end: str) -> int
```

### util_get_trade_range

```python
from FQBase.Date import util_get_trade_range

dates = util_get_trade_range(start: str, end: str) -> List[str]
```

## 常量

| 常量 | 说明 |
|------|------|
| QATZInfo_CN | 中国时区信息 |
| trade_date_sse | 上交所交易日历 |
| month_data | 月份数据 |

---

## 相关文档

- [使用指南](./usage.md)
