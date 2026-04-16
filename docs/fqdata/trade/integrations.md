---
title: Trade 交易模块 - 集成指南
description: Trade 交易模块集成指南，包含模块内部集成和跨系统集成
tag:
  - fqdata
  - trade
---

# Trade 交易模块 - 集成指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [使用指南](./usage.md) → **[集成指南](./integrations.md)** |

## 概述

Trade 模块与其他模块的集成方式。

## 1. 模块内部集成

Trade 模块的四个子模块之间相互配合使用。

### 1.1 runtime + datetime

**场景：** 使用全局日期单例获取交易日期

```python
from FQData.Trade import GLOBALDATE, util_if_trade

# 获取当前交易日期
gd = GLOBALDATE()
current_date = gd.get_trade_date()

# 判断是否为交易日
is_trade = util_if_trade(current_date)
print(f"当前日期是否为交易日: {is_trade}")
```

### 1.2 constants + runtime

**场景：** 构建订单时使用常量

```python
from FQData.Trade import ORDER_DIRECTION, MARKET_TYPE, get_today

# 获取当前日期
today = get_today()

# 使用常量构建订单
order = {
    "direction": ORDER_DIRECTION.BUY,
    "market": MARKET_TYPE.SH,
    "date": today,
}
```

---

## 2. 系统模块间集成

Trade 模块与 FQData 其他模块的集成。

### 2.1 Trade + DataSource

**场景：** 数据获取时使用交易日

```python
from FQData.Trade import util_get_real_datelist

# 获取交易日序列用于数据查询
trade_dates = util_get_real_datelist("2024-01-01", "2024-01-31")
print(f"可用交易日: {trade_dates}")

# 使用交易日列表查询数据
# data = data_source.query("stock_daily", dates=trade_dates)
```

### 2.2 Trade + runtime

**场景：** GlobalDate 使用 datetime 模块的交易日数据

```python
from FQData.Trade import GLOBALDATE

# GlobalDate 内部使用 datetime 模块的交易日判断
global_date = GLOBALDATE()
current_trade_date = global_date._get_trade_date()
print(f"当前交易日期: {current_trade_date}")
```

---

## 3. 跨系统集成

与外部系统和框架的集成。

### 3.1 Pandas DataFrame 集成

**场景：** 处理包含日期的 DataFrame

```python
import pandas as pd
from FQData.Trade import util_if_trade

# 创建包含日期的 DataFrame
df = pd.DataFrame({
    'date': ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05'],
    'price': [100, 101, 102, 103, 104]
})

# 筛选交易日
df['is_trade'] = df['date'].apply(util_if_trade)
trade_df = df[df['is_trade']]
print(trade_df)
```

---

## 集成模式总结

| 集成类型 | 典型场景 | 组合方案 |
|----------|----------|----------|
| 模块内部 | 获取交易日期并判断 | runtime + datetime |
| 模块内部 | 构建订单使用常量 | constants + runtime |
| 系统模块间 | 数据获取过滤 | Trade + DataSource |
| 系统模块间 | 全局日期管理 | Trade + runtime |
| 跨系统 | DataFrame 日期处理 | Trade + pandas |

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
