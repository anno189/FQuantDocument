# module-FQUtil-date_tools.md

# 模块迁移报告: FQUtil-date_tools

## 基本信息

| 项目 | 原模块 | 迁移后 |
|------|--------|--------|
| **模块名称** | QUANTAXIS.QAUtil.QADateTools | FQUtil.date_tools |
| **原文件** | `_bak/QUANTAXIS/QAUtil/QADateTools.py` | `FQBase/FQBase/FQUtil/date_tools.py` |
| **功能** | 日期工具函数 | 日期工具函数 |

## 迁移对比

### 原实现 (QADateTools.py)

```python
import datetime
import calendar
from dateutil.relativedelta import relativedelta
from QUANTAXIS.QAUtil.QASetting import (DATABASE)
import pymongo
import pandas as pd

def QA_util_getBetweenMonth(from_date, to_date):
    """返回所有月份，以及每月的起始日期、结束日期"""
    date_list = {}
    begin_date = datetime.datetime.strptime(from_date, "%Y-%m-%d")
    end_date = datetime.datetime.strptime(to_date, "%Y-%m-%d")
    while begin_date <= end_date:
        date_str = begin_date.strftime("%Y-%m")
        date_list[date_str] = ['%d-%d-01' % (begin_date.year, begin_date.month),
                               '%d-%d-%d' % (begin_date.year, begin_date.month,
                                             calendar.monthrange(begin_date.year, begin_date.month)[1])]
        begin_date = QA_util_get_1st_of_next_month(begin_date)
    return(date_list)

def QA_util_add_months(dt, months):
    """返回dt隔months个月后的日期"""
    dt = datetime.datetime.strptime(dt, "%Y-%m-%d") + relativedelta(months=months)
    return(dt)

def QA_util_get_1st_of_next_month(dt):
    """获取下个月第一天的日期"""
    year = dt.year
    month = dt.month
    if month == 12:
        month = 1
        year += 1
    else:
        month += 1
    res = datetime.datetime(year, month, 1)
    return res

def QA_util_getBetweenQuarter(begin_date, end_date):
    """获取季度区间"""
    quarter_list = {}
    month_list = QA_util_getBetweenMonth(begin_date, end_date)
    for value in month_list:
        tempvalue = value.split("-")
        year = tempvalue[0]
        if tempvalue[1] in ['01', '02', '03']:
            quarter_list[year + "Q1"] = ['%s-01-01' % year, '%s-03-31' % year]
        elif tempvalue[1] in ['04', '05', '06']:
            quarter_list[year + "Q2"] = ['%s-04-01' % year, '%s-06-30' % year]
        elif tempvalue[1] in ['07', '08', '09']:
            quarter_list[year + "Q3"] = ['%s-07-31' % year, '%s-09-30' % year]
        elif tempvalue[1] in ['10', '11', '12']:
            quarter_list[year + "Q4"] = ['%s-10-01' % year, '%s-12-31' % year]
    return(quarter_list)

def QA_util_firstDayTrading(codelist: list):
    """获取交易品种的第一个上市日期"""
    coll_stock_day = DATABASE.stock_day
    coll_index_day = DATABASE.index_day
    # ... MongoDB 查询逻辑
```

### 迁移后 (date_tools.py)

```python
import datetime
import calendar
from dateutil.relativedelta import relativedelta
from typing import Dict, List, Union

def FQ_util_getBetweenMonth(from_date: str, to_date: str) -> Dict[str, List[str]]:
    """返回所有月份，以及每月的起始日期、结束日期"""
    date_list = {}
    begin_date = datetime.datetime.strptime(from_date, "%Y-%m-%d")
    end_date = datetime.datetime.strptime(to_date, "%Y-%m-%d")
    while begin_date <= end_date:
        date_str = begin_date.strftime("%Y-%m")
        date_list[date_str] = [
            '%d-%d-01' % (begin_date.year, begin_date.month),
            '%d-%d-%d' % (begin_date.year, begin_date.month,
                          calendar.monthrange(begin_date.year, begin_date.month)[1])
        ]
        begin_date = FQ_util_get_1st_of_next_month(begin_date)
    return date_list

def FQ_util_add_months(dt: str, months: int) -> datetime.datetime:
    """返回dt隔months个月后的日期"""
    dt = datetime.datetime.strptime(dt, "%Y-%m-%d") + relativedelta(months=months)
    return dt

def FQ_util_get_1st_of_next_month(dt: Union[datetime.datetime, datetime.date]) -> datetime.datetime:
    """获取下个月第一天的日期"""
    if isinstance(dt, datetime.date) and not isinstance(dt, datetime.datetime):
        dt = datetime.datetime(dt.year, dt.month, dt.day)
    year = dt.year
    month = dt.month
    if month == 12:
        month = 1
        year += 1
    else:
        month += 1
    return datetime.datetime(year, month, 1)

def FQ_util_getBetweenQuarter(begin_date: str, end_date: str) -> Dict[str, List[str]]:
    """获取季度区间"""
    quarter_list = {}
    month_list = FQ_util_getBetweenMonth(begin_date, end_date)
    for value in month_list:
        tempvalue = value.split("-")
        year = tempvalue[0]
        if tempvalue[1] in ['01', '02', '03']:
            quarter_list[year + "Q1"] = ['%s-01-01' % year, '%s-03-31' % year]
        elif tempvalue[1] in ['04', '05', '06']:
            quarter_list[year + "Q2"] = ['%s-04-01' % year, '%s-06-30' % year]
        elif tempvalue[1] in ['07', '08', '09']:
            quarter_list[year + "Q3"] = ['%s-07-31' % year, '%s-09-30' % year]
        elif tempvalue[1] in ['10', '11', '12']:
            quarter_list[year + "Q4"] = ['%s-10-01' % year, '%s-12-31' % year]
    return quarter_list

# 向后兼容别名
QA_util_getBetweenMonth = FQ_util_getBetweenMonth
QA_util_add_months = FQ_util_add_months
QA_util_get_1st_of_next_month = FQ_util_get_1st_of_next_month
QA_util_getBetweenQuarter = FQ_util_getBetweenQuarter
```

## 函数映射

| 原函数 | 迁移后 | 状态 |
|--------|--------|------|
| `QA_util_getBetweenMonth` | `FQ_util_getBetweenMonth` | ✅ 已迁移 |
| `QA_util_add_months` | `FQ_util_add_months` | ✅ 已迁移 |
| `QA_util_get_1st_of_next_month` | `FQ_util_get_1st_of_next_month` | ✅ 已迁移 |
| `QA_util_getBetweenQuarter` | `FQ_util_getBetweenQuarter` | ✅ 已迁移 |
| `QA_util_firstDayTrading` | - | ❌ 未迁移 (依赖MongoDB) |

## 功能改进

| 改进项 | 说明 |
|--------|------|
| 类型注解 | ✅ 所有函数添加了类型注解 |
| dateime.date 支持 | `FQ_util_get_1st_of_next_month` 支持 `datetime.date` 输入 |
| 向后兼容 | ✅ 提供 `QA_util_*` 别名 |

## 未迁移函数

### QA_util_firstDayTrading
- **原因**: 依赖 MongoDB `DATABASE.stock_day` 和 `DATABASE.index_day`
- **建议**: 如需此功能，应在数据访问层实现，不应放在工具层

## 使用示例

```python
from FQUtil.date_tools import (
    FQ_util_getBetweenMonth,
    FQ_util_add_months,
    FQ_util_get_1st_of_next_month,
    FQ_util_getBetweenQuarter
)

# 获取月份区间
months = FQ_util_getBetweenMonth("2026-01-01", "2026-06-30")
# {'2026-01': ['2026-1-1', '2026-1-31'], '2026-02': [...], ...}

# 添加月份
date = FQ_util_add_months("2026-01-15", 3)  # 2026-04-15

# 获取下月第一天
first = FQ_util_get_1st_of_next_month(datetime.datetime(2026, 1, 15))

# 获取季度区间
quarters = FQ_util_getBetweenQuarter("2026-01-01", "2026-06-30")
# {'2026Q1': ['2026-01-01', '2026-03-31'], '2026Q2': ['2026-04-01', '2026-06-30']}

# 兼容旧接口
months = QA_util_getBetweenMonth("2026-01-01", "2026-06-30")
```

## 相关文件

- [date_tools.py](../../FQBase/FQBase/FQUtil/date_tools.py) - 本模块
- [FQDate.md](module-FQDate.md) - 日期模块
- [logger.md](module-FQUtil-logger.md) - 日志模块

## 迁移状态

| 项目 | 状态 |
|------|------|
| **功能完整性** | ⚠️ 部分完成 (4/5) |
| **向后兼容** | ✅ 提供兼容别名 |
| **API文档** | ✅ Docstring完整 |
| **类型注解** | ✅ 完整 |
| **未迁移** | `firstDayTrading` (依赖MongoDB) |
