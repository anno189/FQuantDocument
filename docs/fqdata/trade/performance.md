---
title: Trade 交易模块 - 性能调优
description: Trade 交易模块性能优化指南
tag:
  - fqdata
  - trade
---

# Trade 交易模块 - 性能调优

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维/安全 | [README](./README.md) → [使用指南](./usage.md) → [故障排查](./troubleshooting.md) → [常见问题](./faq.md) → **[性能调优](./performance.md)** |

## 概述

Trade 模块的性能特性和优化建议。

## 性能特性

### 时间复杂度

| 操作 | 时间复杂度 | 说明 |
|------|-----------|------|
| util_if_trade | O(1) | 使用集合查找 |
| util_get_next_trade_date | O(log n) | 使用二分查找 |
| GLOBALDATE.get_trade_date | O(1) | 使用缓存 |

### 空间复杂度

| 操作 | 空间复杂度 | 说明 |
|------|-----------|------|
| 交易日列表 | O(n) | n 约为 5000+ |

## 优化策略

### 1. 使用集合加速查找

**优化前（低效）：**

```python
# 每次调用 util_if_trade 都需要遍历列表
for date in date_list:
    is_trade = util_if_trade(date)
```

**优化后（高效）：**

```python
from FQData.Trade import trade_date_sse

# 预创建集合
trade_set = set(trade_date_sse)

# 使用集合查找 O(1)
for date in date_list:
    is_trade = date in trade_set
```

### 2. 批量处理日期

**优化前（低效）：**

```python
# 逐个处理
for date in date_list:
    result = util_get_next_trade_date(date)
```

**优化后（高效）：**

```python
# 批量处理 - 利用缓存
def batch_get_next_trade_dates(start_date, count):
    dates = []
    current = start_date
    for _ in range(count):
        next_date = util_get_next_trade_date(current)
        dates.append(next_date)
        current = next_date
    return dates
```

### 3. 使用向量化操作

**优化前（低效）：**

```python
# 逐个处理
for date in dates:
    is_trade = util_if_trade(date)
```

**优化后（高效）：**

```python
import pandas as pd

# 使用 pandas 向量化
df = pd.DataFrame({'date': dates})
df['is_trade'] = df['date'].apply(util_if_trade)
```

## 性能最佳实践

1. 对重复操作使用集合缓存
2. 批量处理日期列表
3. 使用 pandas 向量化操作
4. 预计算常用日期范围
5. 使用全局日期单例避免重复创建

## 相关文档

- [API参考](./api.md)
- [最佳实践](./best-practices.md)
- [使用指南](./usage.md)
