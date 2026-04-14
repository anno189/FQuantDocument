---
title: Date - 核心概念
description: 深入理解 Date 日期时间工具模块的核心概念
tag:
  - fqbase
  - date
---

# Date - 核心概念

## 概念 1: 时间戳

### 概念解释

Unix 时间戳是自 1970年1月1日以来的秒数。

### 代码示例

```python
from FQBase.Date import util_str_to_Unix_timestamp, util_unix_timestamp_to_str

ts = util_str_to_Unix_timestamp('2024-01-01')
s = util_timestamp_to_str(ts)
```

## 概念 2: 交易日

### 概念解释

交易日是指股票市场开市可以进行交易的日子。

### 代码示例

```python
from FQBase.Date import util_if_trade, util_get_next_trade_date

is_trade = util_if_trade('2024-01-01')
next_date = util_get_next_trade_date('2024-01-01')
```

---

## 相关文档

- [README](./README.md)
- [API参考](./api.md)
