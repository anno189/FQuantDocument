---
title: Trade 交易模块 - 术语表
description: Trade 交易模块术语定义与解释
tag:
  - fqdata
  - trade
---

# Trade 交易模块 - 术语表

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → **[术语表](./glossary.md)** → [核心概念](./concepts.md) |

## 概述

Trade 模块涉及的术语定义。

## 术语

### 交易日

**定义：** 证券交易所开市可以进行股票交易的日子。中国股市交易日为周一至周五，排除法定节假日和周末。

**示例：** 2024-01-02（周二）是交易日，2024-01-01（周一·元旦）不是交易日

### 交易常量

**定义：** 量化交易系统中定义的各种枚举值，用于表示订单方向、市场类型、订单状态等。

**示例：** ORDER_DIRECTION.BUY, MARKET_TYPE.SH, FREQUENCE.DAILY

### 全局日期单例

**定义：** 一个全局唯一的日期管理实例，用于在整个应用程序中统一管理当前交易日期。

**示例：** GLOBALDATE 是单例类，通过 get_today() 获取当前交易日期

### 财务指标

**定义：** 用于评估上市公司财务状况的量化指标，如市盈率、净利润等。

**示例：** FINANCIAL_INDICATORS, FINANCIAL_CATEGORIES

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [核心概念](./concepts.md)
