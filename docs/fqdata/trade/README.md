---
title: Trade 交易模块
description: FQData 交易相关模块，包含交易常量、日期时间工具、全局日期单例和财务指标映射
tag:
  - fqdata
  - trade
  - container

# AI 结构化摘要
summary:
  type: container
  complexity: medium
  maturity: stable
  size: m
  sub_modules:
    - constants
    - datetime
    - runtime
    - financial_mapping
  sub_modules_stats:
    total: 4
    L2_count: 1
    L1_count: 1
    L0_count: 2
  api_exports:
    total: 120
    classes: 2
    functions: 60
    constants: 60
  usage_scenarios:
    - "场景1：量化交易中的日期时间处理"
    - "场景2：交易订单常量定义"
    - "场景3：全局交易日期管理"
    - "场景4：财务指标映射"
  warnings:
    - "警告1：datetime 子模块依赖静态交易日数据"
    - "警告2：runtime 子模块使用单例模式"
  limitations:
    - "限制1：仅支持上交所交易日判断"
    - "限制2：financial_mapping 为静态映射表"

relationships:
  belongs_to:
    - fquant.fqdata
  contains:
    - fquant.fqdata.trade.constants
    - fquant.fqdata.trade.datetime
    - fquant.fqdata.trade.runtime
    - fquant.fqdata.trade.financial_mapping
  used_by:
    - fquant.fqdata
    - fquant.fqdata.datasource

maintenance:
  test_coverage: ""
  change_frequency: quarterly
  last_updated: "2024-01"
---

# Trade 交易模块

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [使用指南](./usage.md) → [案例库](./examples.md) |
| 🔵 开发者 | [README](./README.md) → [技术架构](./architecture.md) → [API参考](./api.md) → [使用指南](./usage.md) → [最佳实践](./best-practices.md) |
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [故障排查](./troubleshooting.md) → [常见问题](./faq.md) |
| 📚 案例库 | **[案例库](./examples.md)** |
| 📖 索引 | [README](./README.md) → [变更日志](./changelog.md) |


## 一句话总览

📌 **FQData 交易相关模块，提供交易常量、日期时间工具、全局日期管理和财务指标映射**

## ⚠️ AI 开发必读

### 使用场景

✅ **应该使用**：
- 量化交易中的日期时间处理
- 交易订单常量定义
- 全局交易日期管理
- 财务指标映射

❌ **不应该使用**：
- 需要动态获取最新交易日数据
- 需要判断除上交所外的其他市场交易日

### 注意事项

1. **datetime 子模块依赖静态交易日数据**
   - 说明：trade_dates_data.py 包含上交所历史交易日数据

2. **runtime 子模块使用单例模式**
   - 说明：GlobalDate 是单例类，用于获取当前交易日期

### 已知限制

- 仅支持上交所交易日判断
- financial_mapping 为静态映射表

**TL;DR**：
- 核心能力：交易常量、日期时间工具、全局日期管理、财务指标映射
- 入门难度：🟢 简单
- 依赖：FQBase

**快速判断**：当您需要处理交易日期、定义交易订单常量、获取全局交易日期时，使用本模块。

## 子模块概览

本模块是一个**容器模块**，聚合了以下核心子模块：

| 子模块 | 说明 | 文档级别 | 文档链接 |
|--------|------|---------|----------|
| constants | 交易常量定义 | L0 | [constants](./constants.md) |
| datetime/ | 日期时间工具 | L2 | [README](./datetime/README.md) |
| runtime | 全局日期单例 | L0 | [runtime](./runtime.md) |
| financial_mapping | 财务指标映射 | L0 | [financial_mapping](./financial_mapping.md) |

## 架构图

```
┌─────────────────────────────────────────────┐
│              Trade 交易模块                    │
├─────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐        │
│  │ constants   │  │  datetime   │        │
│  │  交易常量    │  │  日期时间工具 │        │
│  └──────┬──────┘  └──────┬──────┘        │
│         │                 │                 │
│  ┌──────┴──────┐  ┌──────┴──────┐        │
│  │   runtime   │  │ financial_   │        │
│  │  全局日期    │  │   mapping   │        │
│  └─────────────┘  │  财务指标    │        │
│                   └─────────────┘        │
└─────────────────────────────────────────────┘
```

## 快速链接

| 文档 | 说明 |
|------|------|
| [快速入门](./quick-start.md) | 5分钟快速上手 |
| [术语表](./glossary.md) | 术语定义 |
| [核心概念](./concepts.md) | 核心概念详解 |
| [API参考](./api.md) | API参考文档 |
| [案例库](./examples.md) | 案例库 |
| [故障排查](./troubleshooting.md) | 故障排查指南 |

## 相关文档

| 类型 | 文档 | 链接 |
|------|------|------|
| 项目首页 | FQData首页 | [README](../README.md) |
| 快速入门 | 快速入门 | [快速入门](./quick-start.md) |
