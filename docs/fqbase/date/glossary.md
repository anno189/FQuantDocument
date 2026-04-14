---
title: Date - 术语表
description: FQBase Date 模块术语定义与解释
tag:
  - fqbase
  - date
---

# Date - 术语表

## 概述

本文档提供 Date 模块的术语定义和解释。

## 术语

### 时间戳 (Timestamp)

**定义：** Unix 时间戳，表示自 1970-01-01 00:00:00 UTC 起的秒数。

**示例：** `1704067200` 表示 `2024-01-01 00:00:00`

### 交易日 (Trade Day)

**定义：** 证券交易所开市交易的日子，排除周末和节假日。

**示例：** 2024-01-02（周二）是交易日，2024-01-01（周一 holiday）不是交易日

### 北京时间 (Beijing Time)

**定义：** 中国标准时间，时区为 +0800。

**代码示例：**
```python
QATZInfo_CN = 'Asia/Shanghai'
```

### 交易日列表 (Trade Date List)

**定义：** 存储所有历史交易日期的列表。

**代码示例：**
```python
from FQBase.Date import trade_date_sse
print(trade_date_sse[:5])  # ['1990-12-19', '1990-12-20', ...]
```

### 日期偏移 (Date Gap)

**定义：** 基于交易日进行日期计算，跨越非交易日。

**示例：** 从周五向后偏移 1 个交易日 = 下周一

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [核心概念](./concepts.md)
- [使用指南](./usage.md)
