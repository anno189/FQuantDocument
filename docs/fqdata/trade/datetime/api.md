---
title: datetime - API参考
description: datetime 模块 API 参考文档
tag:
  - fqdata
  - trade
  - datetime

summary:
  purpose: api-reference
  core_functions:
    - util_if_trade
    - util_get_real_date
    - util_get_next_trade_date
    - util_get_pre_trade_date
    - util_date_gap
---

# datetime - API参考

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [API参考](./api.md) |

## 时间戳函数

### util_datetime_to_Unix_timestamp

```python
from FQData.Trade.datetime import util_datetime_to_Unix_timestamp

ts = util_datetime_to_Unix_timestamp()
```

### util_str_to_datetime

```python
from FQData.Trade.datetime import util_str_to_datetime

dt = util_str_to_datetime('2024-01-15 10:30:00')
```

### util_tdxtimestamp

```python
from FQData.Trade.datetime import util_tdxtimestamp

result = util_tdxtimestamp(1705286400)
```

## 交易日函数

### util_if_trade

```python
from FQData.Trade.datetime import util_if_trade

result = util_if_trade('2024-01-15')  # True 或 False
```

### util_get_next_trade_date

```python
from FQData.Trade.datetime import util_get_next_trade_date

result = util_get_next_trade_date('2024-01-15')
```

### util_get_pre_trade_date

```python
from FQData.Trade.datetime import util_get_pre_trade_date

result = util_get_pre_trade_date('2024-01-15')
```

### util_get_real_date

```python
from FQData.Trade.datetime import util_get_real_date

result = util_get_real_date('2024-01-15', 'sse', -1)
```

## 日期计算函数

### util_date_gap

```python
from FQData.Trade.datetime import util_date_gap

# 加3天
result = util_date_gap('2024-01-15', 3, '+')

# 减5天
result = util_date_gap('2024-01-15', 5, '-')
```

### util_get_trade_gap

```python
from FQData.Trade.datetime import util_get_trade_gap

gap = util_get_trade_gap('2024-01-01', '2024-01-31')
```

## 常量

| 常量 | 描述 |
|------|------|
| trade_date_sse | 上交所交易日列表 |
| trade_date_version | 交易日数据版本 |
| trade_date_end_date | 交易日数据结束日期 |

## 相关文档

- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
