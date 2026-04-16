---
title: Business - 术语表
description: Business 业务配置模块术语定义与解释
tag:
  - fqbase
  - config
---

# Business - 术语表

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → **[术语表](./glossary.md)** → [核心概念](./concepts.md) |

## 概述

Business 模块术语定义

## 术语

### 数据源

**定义：** 提供行情数据的外部服务或接口

**示例：** TDX（通达信）、Tushare（ Choice数据）

### 数据源优先级

**定义：** 多数据源同时可用时的使用顺序

**示例：** `['tdx', 'tushare']` 表示优先使用通达信，失败时使用Tushare

### IP列表

**定义：** 通达信行情服务器的IP地址和端口列表

**示例：** `[{'ip': '115.238.56.198', 'port': 7709}]`

### 健康检查

**定义：** 定期检查数据源服务可用性的机制

**配置项：** enabled、timeout、startup_check、on_demand_check

### 延迟加载

**定义：** 模块导入时不加载数据，首次访问时才加载的机制

**优点：** 减少启动时间，按需加载

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [核心概念](./concepts.md)
- [使用指南](./usage.md)
