# Date 模块框架

## 1. 概述

Date 模块是 FQBase 框架中的日期时间处理核心模块，提供：

- **时间戳转换**：Unix时间戳与Python datetime对象之间的相互转换
- **日期格式化**：多种日期字符串格式的支持与转换
- **交易日算法**：判断是否交易日、计算相邻交易日、交易日间隔等
- **时区处理**：默认支持北京时间（Asia/Shanghai）

### 1.1 模块与交易系统的关系

在量化交易系统中，日期时间处理至关重要：

```
数据采集 → 时间戳记录 → 交易日判断 → 策略执行 → 结算归档
    ↓           ↓            ↓           ↓           ↓
timestamp   datetime     is_trade    trading    settlement
  module      module       module      logic      date
```

### 1.2 何时使用 Date 模块

- 处理K线数据的时间索引
- 计算策略持仓时间
- 判断当前是否为交易时间
- 获取历史交易日列表
- 期货夜盘时间处理

## 2. 子模块

### 2.1 timestamp - 时间戳与日期时间转换

| 函数 | 功能 |
|------|------|
| `util_datetime_to_Unix_timestamp()` | datetime转Unix时间戳 |
| `util_timestamp_to_str()` | 时间戳转可读字符串 |
| `util_str_to_Unix_timestamp()` | 字符串转Unix时间戳 |
| `util_str_to_datetime()` | 字符串转datetime |
| `util_stamp2datetime()` | 时间戳转datetime |
| `util_tdxtimestamp()` | 通达信时间戳转换 |

**时区常量**：
- `QATZInfo_CN = 'Asia/Shanghai'` - 北京时区

### 2.2 trade - 交易日相关算法

| 函数 | 功能 |
|------|------|
| `util_if_trade()` | 判断是否为交易日 |
| `util_get_next_trade_date()` | 获取后n个交易日 |
| `util_get_pre_trade_date()` | 获取前n个交易日 |
| `util_get_real_date()` | 获取最近的交易日（二分查找） |
| `util_if_tradetime()` | 判断是否在交易时间内 |
| `util_get_trade_gap()` | 计算交易日间隔 |
| `util_date_gap()` | 基于交易日的日期偏移 |

**市场支持**：
- `MARKET_TYPE.STOCK_CN` - A股
- `MARKET_TYPE.FUTURE_CN` - 国内期货

## 3. 核心数据结构

### 3.1 交易日历 `trade_date_sse`

```python
from FQBase.Date import trade_date_sse

# 上海证券交易所历年交易日列表
print(trade_date_sse[:5])
# ['1990-12-19', '1990-12-20', '1990-12-21', '1990-12-24', '1990-12-25']
```

### 3.2 时间戳格式

| 格式 | 示例 | 说明 |
|------|------|------|
| 秒时间戳 | `1743600000` | 10位Unix时间戳 |
| 毫秒时间戳 | `1743600000000` | 13位时间戳 |
| 微秒时间戳 | `1743600000000000` | 16位时间戳 |
| 纳秒时间戳 | `1743600000000000000` | 19位时间戳 |

## 4. 交易时间段

### 4.1 A股交易时间

| 阶段 | 时间 | 说明 |
|------|------|------|
| 集合竞价 | 09:15-09:30 | 开盘集合竞价 |
| 早市 | 09:30-11:30 | 连续竞价 |
| 午间休市 | 11:30-13:00 | 休市 |
| 午市 | 13:00-15:00 | 连续竞价 |

### 4.2 国内期货交易时间

**日盘**：
| 品种 | 交易时间段 |
|------|-----------|
| 商品期货 | 09:00-10:15, 10:30-11:30, 13:30-15:00 |
| IH/IF/IC | 09:30-11:30, 13:00-15:00 |
| T/TF(国债) | 09:15-11:30, 13:00-15:15 |

**夜盘**：
| 品种 | 交易时间段 |
|------|-----------|
| AU/AG/SC(贵金属/原油) | 21:00-02:30(次日) |
| CU/AL/ZN/PB/SN/NI(基本金属) | 21:00-01:00(次日) |
| RU/RB/HC/BU/FU/SP(黑色/化工) | 21:00-23:00(当日) |

## 5. 日期格式支持

| 输入格式 | 输出格式 | 示例 |
|----------|----------|------|
| YYYY-MM-DD | YYYY-MM-DD | "2026-04-03" |
| YYYYMMDD | YYYY-MM-DD | 20260403 → "2026-04-03" |
| YYYY-MM-DD HH:MM:SS | YYYY-MM-DD HH:MM:SS | "2026-04-03 09:30:00" |
| YYYY-MM-DD HH:MM | YYYY-MM-DD HH:MM:SS | "2026-04-03 09:30" → "2026-04-03 09:30:00" |

## 6. 迁移说明

本模块迁移自 `FQData.QAUtil.QADate`，主要变更：

1. 模块路径变更：`FQData.QAUtil.QADate` → `FQBase.Date`
2. 函数命名保持一致
3. 内部实现进行了性能优化（二分查找替代线性搜索）
