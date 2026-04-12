# Date 模块

日期时间工具模块，提供时间戳转换、日期格式化和交易日计算等功能。

## 模块结构

```
FQBase/Date/
├── __init__.py           # 模块导出
├── timestamp.py           # 时间戳与日期时间转换
├── trade.py              # 交易日相关算法
└── trade_dates_data.py   # A股交易日历数据
```

## 核心功能

| 子模块 | 功能 |
|--------|------|
| [timestamp](timestamp.md) | Unix时间戳与datetime互转、日期字符串格式化 |
| [trade](trade.md) | 交易日判断、下一个/上一个交易日、交易日间隔计算 |

## 快速开始

### 判断是否为交易日

```python
from FQBase.Date import util_if_trade

# 判断指定日期是否为交易日
result = util_if_trade("2026-01-01")
print(result)  # False (元旦假期)

result = util_if_trade("2026-04-03")
print(result)  # True (普通交易日)
```

### 获取交易日

```python
from FQBase.Date import util_get_next_trade_date, util_get_pre_trade_date

# 获取下一个交易日
next_day = util_get_next_trade_date("2026-04-03", n=1)
print(next_day)  # 2026-04-07 (清明节后第一个交易日)

# 获取前一个交易日
prev_day = util_get_pre_trade_date("2026-04-03", n=1)
print(prev_day)  # 2026-04-02
```

### 时间戳转换

```python
from FQBase.Date import util_datetime_to_Unix_timestamp, util_timestamp_to_str

# datetime转Unix时间戳
ts = util_datetime_to_Unix_timestamp(datetime.now())
print(ts)  # 1743600000.0

# 时间戳转字符串
time_str = util_timestamp_to_str(1743600000)
print(time_str)  # 2026-04-02 12:00:00
```

## API 索引

### timestamp 子模块

| 函数 | 说明 |
|------|------|
| `util_datetime_to_Unix_timestamp` | datetime 转 Unix 时间戳 |
| `util_timestamp_to_str` | 时间戳转字符串 |
| `util_str_to_Unix_timestamp` | 字符串转 Unix 时间戳 |
| `util_str_to_datetime` | 字符串转 datetime |
| `util_stamp2datetime` | 时间戳转 datetime（支持多精度） |
| `util_today_str` | 获取今日日期字符串 |
| `util_date_str2int` | 日期字符串转整数 |
| `util_date_int2str` | 日期整数转字符串 |

### trade 子模块

| 函数 | 说明 |
|------|------|
| `util_if_trade` | 判断是否为交易日 |
| `util_get_next_trade_date` | 获取下一个交易日 |
| `util_get_pre_trade_date` | 获取前一个交易日 |
| `util_date_gap` | 交易日偏移计算 |
| `util_get_trade_gap` | 交易日间隔天数 |
| `util_if_tradetime` | 判断是否在交易时间内 |
| `util_get_real_date` | 获取最近的交易日（二分查找） |

## 文档索引

| 文档 | 说明 |
|------|------|
| [README](README.md) | 本文档，模块索引 |
| [timestamp](timestamp.md) | 时间戳转换子模块 |
| [trade](trade.md) | 交易日算法子模块 |
| [框架](framework.md) | 模块架构与核心概念 |
| [架构](architecture.md) | 设计与工作流程 |
| [API](api.md) | 完整API参考 |
| [使用](usage.md) | 使用指南与示例 |
| [最佳实践](best-practices.md) | 开发建议与注意事项 |
| [设计](design.md) | 设计决策文档 |

## 迁移信息

本模块迁移自 `FQData.QAUtil.QADate`，保持了原有的函数接口。
