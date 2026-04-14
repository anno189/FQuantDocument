---
title: TradeDatesData
description: 沪深A股交易日历数据
tag:
  - fqbase
  - date
  - data

summary:
  type: data
  complexity: minimal
  maturity: stable
  constants:
    - TRADE_DATE_SSE
---

# TradeDatesData

## 一句话总览

📌 **沪深A股交易日历数据，包含历史交易日列表**

**TL;DR**：
- 核心能力：A股交易日期数据
- 入门难度：🟢 简单

## 常量

### TRADE_DATE_SSE

```python
TRADE_DATE_SSE: list = [...]
```

**描述：** 沪深证券交易所（A 股）历史交易日列表

**类型：** `list[str]` - 日期字符串列表，格式为 "YYYY-MM-DD"

**示例：**

```python
from FQBase.Date.trade_dates_data import TRADE_DATE_SSE

print(TRADE_DATE_SSE[:5])  # ['1990-12-19', '1990-12-20', ...]
print(len(TRADE_DATE_SSE))  # 交易日总数
```

**用途：**
- 判断某日期是否为交易日
- 计算交易日之间的间隔
- 获取历史交易日列表

**相关函数：**

| 函数 | 说明 |
|------|------|
| `util_if_trade` | 判断是否为交易日 |
| `util_get_trade_range` | 获取日期范围内的交易日列表 |

---

## 变更日志

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0.0 | 2024-01-01 | 初始版本 |
