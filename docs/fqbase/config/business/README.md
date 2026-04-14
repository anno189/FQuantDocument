---
title: Business - 业务配置
description: Config 业务配置模块，提供交易常量、数据源配置、财务指标映射等功能
tag:
  - fqbase
  - config

summary:
  type: infrastructure
  complexity: low
  maturity: stable
  size: s
  core_classes:
    - DataSourceConfig
  key_functions:
    - get_datasource_priority
    - get_health_check_config
  # ⚠️ AI 开发必需信息
  usage_scenarios:
    - "获取数据源优先级配置"
    - "健康检查配置"
    - "业务常量管理"
  warnings:
    - "业务配置通常不需要修改"
  limitations:
    - "仅支持预定义配置"

relationships:
  belongs_to:
    - fquant.fqbase.config
  depends_on:
    - fquant.fqbase.config.core

concepts:
  provides:
    - name: 交易常量
      definition: 量化交易相关的枚举常量（订单方向、交易所、订单状态等）
    - name: 数据源配置
      definition: 多个数据源的优先级和健康检查配置
    - name: 财务指标映射
      definition: 财务指标与数据库字段的映射关系
---

# Business - 业务配置

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [速查表](./cheatsheet.md) → [使用指南](./usage.md) → [案例库](./examples.md) |
| 🔵 开发者 | [README](./README.md) → [技术架构](./architecture.md) → [API参考](./api.md) → [使用指南](./usage.md) → [最佳实践](./best-practices.md) |


## 一句话总览

📌 **Config 业务配置模块，提供交易常量、数据源配置、财务指标映射等业务功能**

**TL;DR**：
- 解决什么问题：提供量化交易业务相关的配置
- 核心能力：交易常量、数据源配置、财务指标映射、IP列表
- 入门难度：🟢 简单

**快速判断**：当您需要使用交易常量、配置数据源、管理财务指标时，使用本模块。

## 适用场景

✅ **推荐使用**：
- 下单时指定订单参数（订单方向、交易所等）
- 配置数据源优先级
- 财务指标映射
- IP 列表管理

❌ **不推荐使用**：
- 基础配置管理（请使用 core 模块）

## 概述

Business 是 Config 的业务配置模块，提供以下功能：

- **交易常量**：订单方向、交易所、订单状态等枚举
- **数据源配置**：多数据源优先级和健康检查
- **财务指标映射**：财务指标与数据库字段的映射
- **IP 列表配置**：通达信行情服务器 IP 列表

## 快速链接

| 文档 | 说明 |
|------|------|
| [快速入门](./quick-start.md) | 5分钟快速上手 |
| [术语表](./glossary.md) | 术语定义 |
| [核心概念](./concepts.md) | 核心概念详解 |
| [技术架构](./architecture.md) | 技术架构说明 |
| [API参考](./api.md) | API参考文档 |
| [案例库](./examples.md) | 案例库 |

## 相关文档

| 类型 | 文档 | 链接 |
|------|------|------|
| 父模块 | Config首页 | [README](../README.md) |
| 核心配置 | Core模块 | [../core](../core/) |
