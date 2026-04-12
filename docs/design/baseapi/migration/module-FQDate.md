# module-FQDate.md

# 模块迁移报告: FQDate

## 基本信息

| 项目 | 原模块 | 迁移后 |
|------|--------|--------|
| **模块名称** | QUANTAXIS.QAUtil.QADate | FQBase.FQDate |
| **原文件** | `_bak/QUANTAXIS/QAUtil/QADate.py` | `FQBase/FQBase/FQDate/` |
| **功能** | 日期时间工具 | 日期时间工具 |
| **结构** | 单文件 (~700行) | 模块化 (timestamp.py + trade.py) |

## 迁移对比

### 原实现 (QADate.py)

```python
import datetime
import threading
import time
import pandas as pd
from QUANTAXIS.QAUtil.QALogs import QA_util_log_info
import numpy as np

QATZInfo_CN = 'Asia/Shanghai'

def QA_util_time_now():
    return datetime.datetime.now()

def QA_util_date_today():
    return datetime.date.today()

def QA_util_today_str():
    return QA_util_datetime_to_strdate(QA_util_date_today())

def QA_util_date_str2int(date):
    if isinstance(date, str):
        return int(str().join(date.split('-')))
    elif isinstance(date, int):
        return date

def QA_util_date_int2str(int_date):
    date = str(int_date)
    if len(date) == 8:
        return str(date[0:4] + '-' + date[4:6] + '-' + date[6:8])

def QA_util_to_datetime(time):
    if len(str(time)) == 10:
        _time = '{} 00:00:00'.format(time)
    elif len(str(time)) == 19:
        _time = str(time)
    else:
        QA_util_log_info('WRONG DATETIME FORMAT {}'.format(time))
    return datetime.datetime.strptime(_time, '%Y-%m-%d %H:%M:%S')

def QA_util_datetime_to_strdate(dt):
    return "%04d-%02d-%02d" % (dt.year, dt.month, dt.day)

def QA_util_datetime_to_strdatetime(dt):
    return "%04d-%02d-%02d %02d:%02d:%02d" % (...)

def QA_util_date_stamp(date):
    if not date:
        return date
    datestr = pd.Timestamp(date).strftime("%Y-%m-%d")
    return time.mktime(time.strptime(datestr, '%Y-%m-%d'))

def QA_util_time_stamp(time_):
    if len(str(time_)) == 10:
        return time.mktime(time.strptime(time_, '%Y-%m-%d'))
    elif len(str(time_)) == 16:
        return time.mktime(time.strptime(time_, '%Y-%m-%d %H:%M'))
    else:
        timestr = str(time_)[0:19]
        return time.mktime(time.strptime(timestr, '%Y-%m-%d %H:%M:%S'))

def QA_util_tdxtimestamp(time_stamp):
    # 通达信时间戳转换
    ...

def QA_util_stamp2datetime(timestamp):
    try:
        return datetime.datetime.fromtimestamp(timestamp)
    except:
        try:
            return datetime.datetime.fromtimestamp(timestamp / 1000)
        except:
            ...
```

### 迁移后架构

```
FQBase/FQBase/FQDate/
├── __init__.py          # 统一导出
├── timestamp.py         # 时间戳与日期转换
│   ├── FQ_util_datetime_to_Unix_timestamp
│   ├── FQ_util_timestamp_to_str
│   ├── FQ_util_str_to_Unix_timestamp
│   ├── FQ_util_str_to_datetime
│   ├── FQ_util_print_timestamp
│   ├── FQ_util_date_stamp
│   ├── FQ_util_time_stamp
│   ├── FQ_util_tdxtimestamp
│   ├── FQ_util_stamp2datetime
│   ├── FQ_util_ms_stamp
│   ├── FQ_util_time_now
│   ├── FQ_util_date_today
│   ├── FQ_util_today_str
│   ├── FQ_util_date_str2int
│   ├── FQ_util_date_int2str
│   ├── FQ_util_to_datetime
│   ├── FQ_util_datetime_to_strdate
│   ├── FQ_util_datetime_to_strdatetime
│   ├── FQ_util_date_valid
│   ├── FQ_util_get_date_index
│   ├── FQ_util_get_index_date
│   ├── FQ_util_select_hours
│   ├── FQ_util_select_min
│   ├── FQ_util_time_delay
│   ├── FQ_util_calc_time
│   └── month_data
└── trade.py             # 交易日相关
    ├── FQ_util_if_trade
    ├── FQ_util_get_next_trade_date
    ├── FQ_util_get_pre_trade_date
    ├── FQ_util_get_real_date
    ├── FQ_util_format_date2str
    ├── FQ_util_if_tradetime
    ├── FQ_util_get_next_day
    ├── FQ_util_get_last_day
    ├── FQ_util_get_trade_gap
    ├── FQ_util_date_gap
    └── ...
```

## 主要改进

### 1. 模块化结构
- 将大文件拆分为 `timestamp.py` 和 `trade.py`
- 便于维护和扩展

### 2. 时区支持增强
```python
# 新增时区转换功能
FQ_util_datetime_to_Unix_timestamp(ts_epoch: datetime = None) -> float
FQ_util_timestamp_to_str(ts_epoch, local_tz: timezone = timezone(timedelta(hours=8))) -> str
```

### 3. 类型注解
- 添加了函数参数和返回值的类型注解
- 改善了代码提示和可维护性

### 4. 向后兼容
```python
# 所有函数都提供 QA_util_* 别名
QA_util_time_now = FQ_util_time_now
QA_util_date_today = FQ_util_date_today
# ... 完整兼容
```

## 未迁移函数

以下函数依赖 MongoDB，未迁移：
- `QA_util_realtime` - 查询数据库中的数据
- `QA_util_id2date` - 从数据库查询
- `QA_util_is_trade` - 从数据库判断是否为交易日

## 使用示例

### 新接口 (推荐)
```python
from FQBase.FQDate import (
    FQ_util_time_now,
    FQ_util_date_today,
    FQ_util_today_str,
    FQ_util_date_str2int,
    FQ_util_datetime_to_strdate,
    FQ_util_time_stamp,
    FQ_util_if_trade,
    FQ_util_get_next_trade_date,
)

now = FQ_util_time_now()
today = FQ_util_date_today()
today_str = FQ_util_today_str()
stamp = FQ_util_time_stamp('2026-03-28 10:00:00')
is_trade = FQ_util_if_trade('2026-03-28')
next_trade = FQ_util_get_next_trade_date('2026-03-28')
```

### 兼容旧接口
```python
from FQBase.FQDate import (
    QA_util_time_now,
    QA_util_date_today,
    QA_util_today_str,
)

now = QA_util_time_now()  # 与 FQ_util_time_now 等效
```

## 相关文件

- [FQDate/__init__.py](../../FQBase/FQBase/FQDate/__init__.py) - 模块入口
- [FQDate/timestamp.py](../../FQBase/FQBase/FQDate/timestamp.py) - 时间戳转换
- [FQDate/trade.py](../../FQBase/FQBase/FQDate/trade.py) - 交易日工具
- [date_tools.md](module-FQUtil-date_tools.md) - 日期工具
- [logger.md](module-FQUtil-logger.md) - 日志模块

## 迁移状态

| 项目 | 状态 |
|------|------|
| **功能完整性** | ✅ 完成 |
| **向后兼容** | ✅ 提供完整 `QA_util_*` 别名 |
| **API文档** | ✅ Docstring完整 |
| **模块化** | ✅ 拆分为 timestamp/trade |
| **类型注解** | ✅ 部分添加 |
| **时区支持** | ✅ 增强 |
