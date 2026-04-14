---
title: Date - 日期时间工具
description: FQBase 日期时间工具模块，提供时间戳转换、交易日计算等功能
tag:
  - fqbase
  - date

summary:
  type: utility
  complexity: low
  maturity: stable
  size: xs
  core_classes: []
  key_functions:
    - util_str_to_datetime
    - util_if_trade
    - util_get_trade_range
  # ⚠️ AI 开发必需信息
  usage_scenarios:
    - "任何与日期时间相关的处理"
    - "交易日判断和计算"
    - "时间戳转换"
  warnings:
    - "仅支持A股交易日历"
    - "期货夜盘日期归属特殊处理"
  limitations:
    - "不支持港股、美股等其他市场"

relationships:
  belongs_to:
    - fquant.fqbase
  depends_on: []
  import_path:
    - from FQBase.Date import trade, timestamp

concepts:
  provides:
    - name: 时间戳转换
      definition: Unix 时间戳与日期时间字符串的相互转换
    - name: 交易日计算
      definition: 判断是否为交易日、获取前后交易日等
    - name: 日期操作
      definition: 日期加减、格式化、解析等
---

# Date - 日期时间工具

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [速查表](./cheatsheet.md) → [使用指南](./usage.md) → [案例库](./examples.md) |
| 🔵 开发者 | [README](./README.md) → [技术架构](./architecture.md) → [API参考](./api.md) → [使用指南](./usage.md) → [最佳实践](./best-practices.md) |


## 一句话总览

📌 **FQBase 日期时间工具模块，提供时间戳转换、交易日计算等功能**

**TL;DR**：
- 解决什么问题：处理日期时间相关的常见操作
- 核心能力：时间戳转换、交易日判断、日期操作
- 入门难度：🟢 简单

**快速判断**：当您需要处理日期时间、计算交易日时，使用本模块。

## 适用场景

✅ **推荐使用**：
- 时间戳与日期字符串转换
- 判断是否为交易日
- 获取交易日列表
- 日期加减计算

## 概述

Date 是 FQBase 的日期时间工具模块，提供以下功能：

- **时间戳转换**：Unix 时间戳与日期时间的相互转换
- **交易日计算**：判断交易日、获取前后交易日
- **日期操作**：日期加减、格式化、解析

## 快速链接

| 文档 | 说明 |
|------|------|
| [快速入门](./quick-start.md) | 5分钟快速上手 |
| [API参考](./api.md) | API参考文档 |

## 子模块

Date 容器包含以下单一文件模块（极简文档）：

| 模块 | 说明 | 文档 |
|------|------|------|
| timestamp.py | 时间戳与日期时间转换工具 | [timestamp.md](./timestamp.md) |
| trade.py | 交易日相关算法 | [trade.md](./trade.md) |
| trade_dates_data.py | 沪深A股交易日历数据 | [trade_dates_data.md](./trade_dates_data.md) |

## 安装

```bash
pip install fquant-fqbase
```

## 相关文档

| 类型 | 文档 | 链接 |
|------|------|------|
| 项目首页 | FQBase首页 | [README](../README.md) |
