# module-FQUtil-bar.md

# 模块迁移报告: FQUtil-bar

## 基本信息

| 项目 | 原模块 | 迁移后 |
|------|--------|--------|
| **模块名称** | QUANTAXIS.QAUtil.QABar | FQUtil.bar |
| **原文件** | `_bak/QUANTAXIS/QAUtil/QABar.py` | `FQBase/FQBase/FQUtil/bar.py` |
| **功能** | 股票/期货分钟线时间索引 | 时间索引工具 |

## 迁移对比

### 原实现 (QABar.py)

```python
import datetime
import math
import numpy as np
import pandas as pd
from QUANTAXIS.QAUtil.QADate_trade import (
    QA_util_date_gap, QA_util_get_real_datelist,
    QA_util_get_trade_range, QA_util_if_trade, trade_date_sse
)

def QA_util_make_future_min_index(day, type_='1min'):
    """创建期货分钟线的index"""
    if QA_util_if_trade(day) is True:
        return pd.date_range(
            str(day) + '21:00:00', str(day) + '',
            freq=type_, closed='right'
        ).append(
            pd.date_range(
                str(day) + ' 13:00:00', str(day) + ' 15:00:00',
                freq=type_, closed='right'
            )
        )
    else:
        return pd.DataFrame(['No trade'])

def QA_util_make_min_index(day, type_='1min'):
    """创建股票分钟线的index"""
    if QA_util_if_trade(day) is True:
        return pd.date_range(
            str(day) + ' 09:30:00', str(day) + ' 11:30:00',
            freq=type_, closed='right'
        ).append(
            pd.date_range(
                str(day) + ' 13:00:00', str(day) + ' 15:00:00',
                freq=type_, closed='right'
            )
        )
    else:
        return pd.DataFrame(['No trade'])

def QA_util_time_gap(time, gap, methods, type_):
    """分钟线回测的时候的gap"""
    # ... 复杂实现
```

### 迁移后 (bar.py)

```python
import datetime
import math
import numpy as np
import pandas as pd
from FQBase.FQDate.trade import (
    trade_date_sse, QA_util_if_trade,
    QA_util_date_gap, QA_util_get_real_datelist,
    QA_util_get_trade_range,
)

def FQ_util_make_future_min_index(day, type_='1min'):
    """创建期货分钟线的index"""
    if FQ_util_if_trade(day):
        freq = type_
        morning = pd.date_range(
            str(day) + ' 21:00:00', str(day) + ' 23:59:59', freq=freq
        )
        afternoon = pd.date_range(
            str(day) + ' 13:00:00', str(day) + ' 15:00:00', freq=freq
        )
        return pd.DatetimeIndex(morning).append(pd.DatetimeIndex(afternoon))
    else:
        return pd.DataFrame(['No trade'])

def FQ_util_make_min_index(day, type_='1min'):
    """创建股票分钟线的index"""
    if FQ_util_if_trade(day):
        freq = type_
        morning = pd.date_range(
            str(day) + ' 09:30:00', str(day) + ' 11:30:00',
            freq=freq, inclusive='left'
        )
        afternoon = pd.date_range(
            str(day) + ' 13:00:00', str(day) + ' 15:00:00',
            freq=freq, inclusive='left'
        )
        return pd.DatetimeIndex(morning).append(pd.DatetimeIndex(afternoon))
    else:
        return pd.DataFrame(['No trade'])

def FQ_util_time_gap(time, gap, methods, type_):
    """分钟线回测的时候的gap"""
    # 优化后的实现
```

## 函数映射

| 原函数 | 迁移后 | 状态 |
|--------|--------|------|
| `QA_util_make_future_min_index` | `FQ_util_make_future_min_index` | ✅ |
| `QA_util_make_min_index` | `FQ_util_make_min_index` | ✅ |
| `QA_util_make_hour_index` | `FQ_util_make_hour_index` | ✅ |
| `QA_util_time_gap` | `FQ_util_time_gap` | ✅ |

## 主要改进

### 1. pandas API 兼容性
```python
# 旧版 (pandas < 2.0)
pd.date_range(..., closed='right')

# 新版 (pandas >= 2.0)
pd.date_range(..., inclusive='left')
```

### 2. 导入来源
```python
# 旧版
from QUANTAXIS.QAUtil.QADate_trade import (...)

# 新版
from FQBase.FQDate.trade import (...)
```

### 3. 期货夜盘时间
```python
# 旧版
str(day) + ''  # 结束时间不明确

# 新版
str(day) + ' 23:59:59'  # 明确结束时间
```

## 向后兼容

```python
# 可在 FQUtil/__init__.py 添加
QA_util_make_future_min_index = FQ_util_make_future_min_index
QA_util_make_min_index = FQ_util_make_min_index
QA_util_make_hour_index = FQ_util_make_hour_index
QA_util_time_gap = FQ_util_time_gap
```

## 使用示例

```python
from FQUtil.bar import (
    FQ_util_make_min_index,
    FQ_util_make_future_min_index,
    FQ_util_time_gap
)

# 创建股票分钟线索引
min_index = FQ_util_make_min_index('2026-03-28', '5min')
# DatetimeIndex(['2026-03-28 09:30:00', ...], dtype='datetime64[ns]')

# 创建期货分钟线索引
future_index = FQ_util_make_future_min_index('2026-03-28', '1min')

# 计算时间gap
result = FQ_util_time_gap('2026-03-28 10:00:00', 10, '>', '5min')
```

## 相关文件

- [bar.py](../../FQBase/FQBase/FQUtil/bar.py) - 本模块
- [FQDate/trade.py](module-FQDate.md) - 交易日工具
- [FQDate.md](module-FQDate.md) - 日期模块

## 迁移状态

| 项目 | 状态 |
|------|------|
| **功能完整性** | ✅ 完成 |
| **向后兼容** | ⏳ 需添加兼容别名 |
| **API文档** | ✅ Docstring完整 |
| **pandas兼容性** | ✅ 适配 2.0+ |
