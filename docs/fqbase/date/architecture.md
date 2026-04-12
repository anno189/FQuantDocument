# Date 模块架构

## 1. 模块架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        Date 模块                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐     ┌─────────────────────────────┐   │
│  │  timestamp.py   │     │         trade.py            │   │
│  ├─────────────────┤     ├─────────────────────────────┤   │
│  │ 时间戳转换      │     │ 交易日算法                   │   │
│  │ • Unix时间戳    │     │ • is_trade判断              │   │
│  │ • datetime互转  │     │ • next/prev trade date     │   │
│  │ • 字符串格式化  │     │ • trade gap计算             │   │
│  │ • 通达信格式    │     │ • 二分查找优化               │   │
│  └─────────────────┘     └─────────────────────────────┘   │
│           │                         │                      │
│           │                         │                      │
│           ▼                         ▼                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              trade_dates_data.py                     │   │
│  │              (TRADE_DATE_SSE 列表)                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 2. 核心组件

### 2.1 timestamp.py 组件

```
timestamp.py
├── 时区常量
│   └── QATZInfo_CN = 'Asia/Shanghai'
├── Unix时间戳转换
│   ├── util_datetime_to_Unix_timestamp()  # datetime → Unix
│   ├── util_str_to_Unix_timestamp()       # 字符串 → Unix
│   └── util_timestamp_to_str()            # Unix → 字符串
├── datetime互转
│   ├── util_str_to_datetime()             # 字符串 → datetime
│   ├── util_stamp2datetime()             # 时间戳 → datetime
│   └── util_to_datetime()                # 通用 → datetime
├── 日期字符串操作
│   ├── util_date_str2int()               # "2026-04-03" → 20260403
│   ├── util_date_int2str()               # 20260403 → "2026-04-03"
│   ├── util_datetime_to_strdate()        # datetime → "YYYY-MM-DD"
│   ├── util_datetime_to_strdatetime()    # datetime → "YYYY-MM-DD HH:MM:SS"
│   └── util_today_str()                  # 今日 → "YYYY-MM-DD"
├── 验证函数
│   └── util_date_valid()                 # 验证日期格式
└── 辅助函数
    ├── util_print_timestamp()            # 友好格式打印
    ├── util_tdxtimestamp()               # 通达信时间戳
    ├── util_select_hours()               # 小时筛选
    ├── util_select_min()                 # 分钟筛选
    ├── util_time_delay()                 # 时间延迟
    ├── util_calc_time()                  # 时间差计算
    └── month_data()                      # 月度数据列表
```

### 2.2 trade.py 组件

```
trade.py
├── 核心数据结构
│   └── trade_date_sse  # A股全年交易日列表
├── 交易日判断
│   └── util_if_trade()  # O(1) 查询
├── 交易日获取
│   ├── util_get_next_trade_date()  # 后n个交易日
│   ├── util_get_pre_trade_date()    # 前n个交易日
│   └── util_get_real_date()         # 最近交易日(二分查找)
├── 交易时间判断
│   └── util_if_tradetime()          # A股/期货交易时间
├── 日期偏移
│   ├── util_get_next_day()          # 日历日后n天
│   ├── util_get_last_day()          # 日历日前n天
│   └── util_date_gap()              # 交易日偏移
├── 间隔计算
│   ├── util_get_trade_gap()         # 交易日间隔天数
│   └── util_date_gap()              # 交易日偏移计算
├── 周期计算
│   ├── util_get_next_period()       # 下一周期起始
│   ├── util_get_next_datetime()     # 几天后交易时间
│   └── util_get_last_datetime()     # 几天前交易时间
├── 日期范围
│   ├── util_get_real_datelist()     # 真实起止日期
│   ├── util_get_trade_range()       # 交易日范围列表
│   └── util_get_trade_datetime()    # 真实交易日期
├── 月度/季度
│   ├── util_getBetweenMonth()       # 月份区间
│   ├── util_getBetweenQuarter()     # 季度区间
│   └── util_add_months()            # 月份偏移
└── 其他
    ├── util_week_end_day()          # 周末最后交易日
    ├── get_weekday_list()           # 固定星期列表
    └── trade_date_sse               # 交易日数据
```

## 3. 数据流

### 3.1 交易日查询流程

```
用户输入日期
     │
     ▼
util_if_trade("2026-04-03")
     │
     ▼
normalize = "2026-04-03"  # 标准化处理
     │
     ▼
查询 trade_date_sse (list)
     │
     ▼
返回 True/False
```

### 3.2 下一交易日查询流程

```
用户输入日期
     │
     ├─── 日期在列表中? ───┬ YES ──→ index + n ──→ 返回 trade_date_sse[index]
     │                    │
     │                    NO
     │                    │
     ▼                    ▼
util_get_real_date()     二分查找定位
(向左找最近的)               │
     │                         │
     └──────────┬──────────────┘
                ▼
         index + n
                │
                ▼
         返回 trade_date_sse[index]
```

## 4. 性能设计

### 4.1 二分查找优化

`util_get_real_date()` 使用 `bisect.bisect_left()` 实现 O(log n) 查找：

```python
pos = bisect.bisect_left(trade_list, date_str)
if towards == -1:
    return trade_list[pos - 1]  # 向左找
else:
    return trade_list[pos]       # 向右找
```

### 4.2 交易日列表

- 使用预生成的 `TRADE_DATE_SSE` 列表
- 列表元素：`List[str]` 格式 "YYYY-MM-DD"
- 数据范围：1990-12-19（上证成立）至今

## 5. 依赖关系

```
FQBase.Date
├── Python 标准库
│   ├── datetime
│   ├── time
│   ├── calendar
│   ├── bisect
│   └── typing
├── 第三方库
│   ├── pandas (Timestamp转换)
│   ├── numpy (类型支持)
│   └── dateutil (relativedelta)
└── FQBase 内部
    └── FQBase.Config.business.constants (MARKET_TYPE, FREQUENCE)
```
