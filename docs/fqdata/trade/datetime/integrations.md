---
title: datetime - 集成指南
description: datetime 集成指南
tag:
  - fqdata
  - trade
  - datetime
---

# datetime - 集成指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [技术架构](./architecture.md) → **[集成指南](./integrations.md)** |

---

## 1. 模块内部集成

datetime 模块内部有两个子模块：timestamp.py 和 trade.py

### 1.1 时间戳 + 交易日

```python
from FQData.Trade.datetime import util_str_to_datetime, util_if_trade

dt = util_str_to_datetime('2024-01-15')
is_trade = util_if_trade('2024-01-15')
```

---

## 2. 系统模块间集成

### 2.1 datetime + runtime

```python
from FQData.Trade.datetime import util_get_real_date
from FQData.Trade.runtime import get_today

today = get_today()
trade_date = util_get_real_date(today, 'sse', -1)
```

---

## 3. 跨系统集成

### 3.1 pandas 集成

```python
import pandas as pd
from FQData.Trade.datetime import util_fill_missing_dates

df = pd.DataFrame({'date': ['2024-01-01', '2024-01-03']})
result = util_fill_missing_dates(df)
```

---

## 集成模式总结

| 集成类型 | 典型场景 | 组合方案 |
|----------|----------|----------|
| 模块内部 | 时间戳转日期后判断交易日 | timestamp + trade |
| 系统模块间 | 获取当前交易日后计算 | datetime + runtime |
| 跨系统 | 补全日期序列 | datetime + pandas |

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
