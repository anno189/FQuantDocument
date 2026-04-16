---
title: Trade 交易模块 - API参考
description: Trade 交易模块 API 参考文档
tag:
  - fqdata
  - trade

summary:
  purpose: api-reference
  core_classes:
    - GLOBALDATE
  core_functions:
    - util_if_trade
    - util_get_next_trade_date
    - get_today
---

# Trade 交易模块 - API参考

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [使用指南](./usage.md) → **[API参考](./api.md)** → [最佳实践](./best-practices.md) |

## 概述

本文档列出 Trade 模块的所有子模块及其导出的 API。

## 子模块 API 参考

| 子模块 | API 参考 | 说明 |
|--------|----------|------|
| datetime | [API](./datetime/api.md) | 日期时间工具 |
| constants | - | 交易常量 |
| runtime | - | 全局日期单例 |
| financial_mapping | - | 财务指标映射 |

## 常量

### 订单方向 (ORDER_DIRECTION)

```python
from FQData.Trade import ORDER_DIRECTION

print(ORDER_DIRECTION.BUY)   # 买入
print(ORDER_DIRECTION.SELL)  # 卖出
```

| 常量 | 值 | 描述 |
|------|-----|------|
| BUY | "buy" | 买入 |
| SELL | "sell" | 卖出 |

### 市场类型 (MARKET_TYPE)

```python
from FQData.Trade import MARKET_TYPE

print(MARKET_TYPE.SH)   # 上海
print(MARKET_TYPE.SZ)   # 深圳
print(MARKET_TYPE.BJ)   # 北京
```

### 数据频率 (FREQUENCE)

```python
from FQData.Trade import FREQUENCE

print(FREQUENCE.DAILY)    # 日线
print(FREQUENCE.WEEKLY)    # 周线
print(FREQUENCE.MONTHLY)   # 月线
print(FREQUENCE.MINUTE)    # 分钟
```

### 订单状态 (ORDER_STATUS)

```python
from FQData.Trade import ORDER_STATUS

print(ORDER_STATUS.SUBMITTING)   # 提交中
print(ORDER_STATUS.SUBMITTED)     # 已提交
print(ORDER_STATUS.PARTIAL)      # 部分成交
print(ORDER_STATUS.FILLED)       # 全部成交
print(ORDER_STATUS.CANCELLED)    # 已撤销
print(ORDER_STATUS.REJECTED)     # 已拒绝
```

## 日期时间函数

详见 [datetime 子模块 API](./datetime/api.md)

### util_if_trade

```python
from FQData.Trade import util_if_trade

is_trade = util_if_trade("2024-01-02")
print(is_trade)  # True
```

### util_get_next_trade_date

```python
from FQData.Trade import util_get_next_trade_date

next_date = util_get_next_trade_date("2024-01-02", n=3)
print(next_date)
```

### util_str_to_datetime

```python
from FQData.Trade import util_str_to_datetime

dt = util_str_to_datetime("2024-01-02 10:30:00")
print(dt)
```

## 全局日期

### GLOBALDATE

```python
from FQData.Trade import GLOBALDATE

gd = GLOBALDATE()
trade_date = gd.get_trade_date()
print(f"当前交易日期: {trade_date}")
```

### get_today

```python
from FQData.Trade import get_today

today = get_today()
print(f"今天: {today}")
```

## 财务指标映射

### FINANCIAL_INDICATORS

```python
from FQData.Trade import FINANCIAL_INDICATORS

print(FINANCIAL_INDICATORS)
```

### FINANCIAL_CATEGORIES

```python
from FQData.Trade import FINANCIAL_CATEGORIES

print(FINANCIAL_CATEGORIES)
```

## 完整 API 列表

### constants 子模块导出的常量

| 常量类 | 描述 |
|--------|------|
| ORDER_DIRECTION | 订单方向 |
| TIME_CONDITION | 时间条件 |
| VOLUME_CONDITION | 成交量条件 |
| EXCHANGE_ID | 交易所代码 |
| OFFSET | 开平标志 |
| ORDER_MODEL | 订单模式 |
| ORDER_STATUS | 订单状态 |
| AMOUNT_MODEL | 金额模式 |
| RUNNING_ENVIRONMENT | 运行环境 |
| MARKET_TYPE | 市场类型 |
| DATASOURCE | 数据源 |
| OUTPUT_FORMAT | 输出格式 |
| RUNNING_STATUS | 运行状态 |
| CURRENCY_TYPE | 货币类型 |
| FREQUENCE | 数据频率 |
| DATABASE_TABLE | 数据库表 |

### datetime 子模块导出的函数

详见 [datetime API](./datetime/api.md)

### runtime 子模块导出的类和函数

| 名称 | 类型 | 描述 |
|------|------|------|
| GLOBALDATE | 类 | 全局日期单例类 |
| get_today | 函数 | 获取当前交易日期 |

### financial_mapping 子模块导出的常量

| 名称 | 类型 | 描述 |
|------|------|------|
| FINANCIAL_INDICATORS | dict | 财务指标映射 |
| FINANCIAL_CATEGORIES | dict | 财务指标分类 |

## 相关文档

- [使用指南](./usage.md)
- [开发指南](./development.md)
- [最佳实践](./best-practices.md)
