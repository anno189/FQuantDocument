---
title: Trade 交易模块 - 快速入门
description: 5分钟快速上手 Trade 交易模块
tag:
  - fqdata
  - trade

summary:
  purpose: quick-start
  complexity: low
---

# Trade 交易模块 - 快速入门

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → **[快速入门](./quick-start.md)** → [使用指南](./usage.md) → [案例库](./examples.md) |


## 概述

5分钟快速上手 Trade 交易模块，掌握基本的交易常量、日期时间工具使用。

## 前置要求

- Python 3.8+
- FQData 已安装

## 5分钟上手

### Step 1: 导入模块

```python
from FQData.Trade import (
    # 常量
    ORDER_DIRECTION,
    MARKET_TYPE,
    FREQUENCE,
    # 日期时间
    util_if_trade,
    util_get_next_trade_date,
    util_str_to_datetime,
    # 运行时
    GLOBALDATE,
    get_today,
)
```

### Step 2: 使用交易常量

```python
from FQData.Trade import ORDER_DIRECTION, MARKET_TYPE

# 订单方向
print(f"买入: {ORDER_DIRECTION.BUY}")
print(f"卖出: {ORDER_DIRECTION.SELL}")

# 市场类型
print(f"上海市场: {MARKET_TYPE.SH}")
print(f"深圳市场: {MARKET_TYPE.SZ}")
```

### Step 3: 使用日期时间工具

```python
from FQData.Trade import util_if_trade, util_get_next_trade_date

# 判断是否为交易日
is_trade = util_if_trade("2024-01-02")
print(f"2024-01-02 是否为交易日: {is_trade}")

# 获取后3个交易日
next3 = util_get_next_trade_date("2024-01-02", n=3)
print(f"后3个交易日: {next3}")
```

### Step 4: 使用全局日期

```python
from FQData.Trade import GLOBALDATE, get_today

# 获取当前交易日期
today = get_today()
print(f"当前交易日期: {today}")

# 使用全局日期单例
gd = GLOBALDATE()
trade_date = gd.get_trade_date()
print(f"全局交易日期: {trade_date}")
```

### Step 5: 完成！

恭喜！你已经学会了 Trade 模块的基本用法。

## ⚠️ 常见陷阱

1. **陷阱 1：日期格式必须正确**
   - ❌ 错误做法：`util_if_trade("2024/01/02")`
   - ✅ 正确做法：`util_if_trade("2024-01-02")`

2. **陷阱 2：datetime 子模块依赖静态数据**
   - 说明：交易日数据是静态的，需要定期更新

## 下一步

- 学习 [核心概念](./concepts.md)
- 阅读 [术语表](./glossary.md)
- 查看 [使用指南](./usage.md)

## 相关文档

- [README](./README.md)
- [术语表](./glossary.md)
- [核心概念](./concepts.md)
- [使用指南](./usage.md)
- [API参考](./api.md)
