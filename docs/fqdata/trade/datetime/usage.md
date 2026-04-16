---
title: datetime - 使用指南
description: datetime 详细使用指南
tag:
  - fqdata
  - trade
  - datetime
---

# datetime - 使用指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → **[使用指南](./usage.md) |
| 🔵 开发者 | [README](./README.md) → [API参考](./api.md) → **[使用指南](./usage.md)** |

## 概述

datetime 模块的详细使用方法

## 基本用法

### 导入模块

```python
from FQData.Trade.datetime import util_if_trade, util_get_next_trade_date
```

### 判断交易日

```python
# 判断是否为交易日
is_trade = util_if_trade('2024-01-15')
print(is_trade)
```

### 获取交易日

```python
# 获取下一个交易日
next_date = util_get_next_trade_date('2024-01-15')

# 获取前一个交易日
from FQData.Trade.datetime import util_get_pre_trade_date
pre_date = util_get_pre_trade_date('2024-01-15')
```

## 常见用例

### 用例 1: 判断是否为交易日

```python
from FQData.Trade.datetime import util_if_trade

date = '2024-01-15'
if util_if_trade(date):
    print(f"{date} 是交易日")
else:
    print(f"{date} 不是交易日")
```

### 用例 2: 获取连续交易日

```python
from FQData.Trade.datetime import util_get_next_trade_date

date = '2024-01-15'
for i in range(5):
    date = util_get_next_trade_date(date)
    print(date)
```

## 相关文档

- [API参考](./api.md)
- [最佳实践](./best-practices.md)
- [故障排查](./troubleshooting.md)
