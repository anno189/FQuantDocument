---
title: Trade 交易模块 - 核心概念
description: 深入理解 Trade 交易模块的核心概念
tag:
  - fqdata
  - trade
---

# Trade 交易模块 - 核心概念

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [术语表](./glossary.md) → **[核心概念](./concepts.md)** → [使用指南](./usage.md) |
| 🔵 开发者 | [README](./README.md) → [使用指南](./usage.md) → **[核心概念](./concepts.md)** → [API参考](./api.md) |

## 概述

深入理解 Trade 交易模块的核心概念。

## 概念 1: 交易常量

### 概念解释

交易常量是量化交易系统中定义的各种枚举值，用于表示订单方向、市场类型、订单状态等。

### 包含的常量类

- **ORDER_DIRECTION**: 订单方向（买入、卖出）
- **MARKET_TYPE**: 市场类型（上交所、深交所、北交所）
- **FREQUENCE**: 数据频率（日线、分钟线等）
- **ORDER_STATUS**: 订单状态
- **EXCHANGE_ID**: 交易所代码

### 代码示例

```python
from FQData.Trade import ORDER_DIRECTION, MARKET_TYPE, FREQUENCE

# 订单方向
print(ORDER_DIRECTION.BUY)   # 买入
print(ORDER_DIRECTION.SELL)  # 卖出

# 市场类型
print(MARKET_TYPE.SH)   # 上海
print(MARKET_TYPE.SZ)   # 深圳
print(MARKET_TYPE.BJ)  # 北京

# 数据频率
print(FREQUENCE.DAILY)   # 日线
print(FREQUENCE.MINUTE)  # 分钟线
```

## 概念 2: 交易日

### 概念解释

交易日是指证券交易所开市可以进行股票交易的日子。中国股市的交易日一般为周一至周五，排除法定节假日和周末。

### 原理

- 交易日数据存储在 `trade_dates_data.py` 中
- 使用二分查找算法快速定位交易日
- 数据来源为上海证券交易所（SSE）

### 代码示例

```python
from FQData.Trade import util_if_trade, util_get_next_trade_date

# 判断是否为交易日
print(util_if_trade("2024-01-02"))  # True
print(util_if_trade("2024-01-01"))  # False (元旦)

# 获取后N个交易日
print(util_get_next_trade_date("2024-01-02", n=3))
```

## 概念 3: 全局日期单例

### 概念解释

GlobalDate 是一个单例类，用于在整个应用程序中统一管理当前交易日期。它会根据当前时间自动判断是否需要更新缓存的交易日期。

### 原理

- 使用单例模式确保全局唯一
- 缓存机制：在交易时段内不会重复查询
- 自动更新：每天交易时间（8:00后）自动更新

### 代码示例

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

## 概念 4: 财务指标映射

### 概念解释

财务指标映射提供财务指标的名称和分类信息，用于数据展示和处理。

### 包含的内容

- **FINANCIAL_INDICATORS**: 财务指标名称映射
- **FINANCIAL_CATEGORIES**: 财务指标分类

### 代码示例

```python
from FQData.Trade import FINANCIAL_INDICATORS, FINANCIAL_CATEGORIES

# 查看财务指标
print(FINANCIAL_INDICATORS)
print(FINANCIAL_CATEGORIES)
```

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [术语表](./glossary.md)
- [使用指南](./usage.md)
- [API参考](./api.md)
