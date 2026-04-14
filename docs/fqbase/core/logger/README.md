---
title: 统一日志系统
description: FQBase 统一日志系统模块，提供多实例单例模式的日志记录器
tag:
  - fqbase
  - logger

summary:
  type: infrastructure
  complexity: medium
  maturity: stable
  size: s
  core_classes:
    - FQLogger
  key_functions:
    - get_logger
    - init_logging

relationships:
  belongs_to:
    - fqbase.core
  depends_on: []
  used_by:
    - fqbase.all_modules

concepts:
  provides:
    - name: 多实例单例模式
      definition: 每个 name 对应一个独立的日志记录器实例
    - name: 日志轮转
      definition: 使用 RotatingFileHandler 自动轮转日志文件
    - name: 第三方库日志控制
      definition: 自动降低 pymongo、asyncio、matplotlib 日志级别
---

# 统一日志系统

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [速查表](./cheatsheet.md) → [使用指南](./usage.md) → [案例库](./examples.md) |
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → [设计原则](./design.md) → [API参考](./api.md) → [开发指南](./development.md) → [最佳实践](./best-practices.md) |
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → [故障排查](./troubleshooting.md) → [常见问题](./faq.md) |

## 一句话总览

📌 **FQBase 统一日志记录器，支持日志轮转和多实例单例**

**TL;DR**：
- 解决什么问题：统一管理项目日志，支持文件轮转和日志级别控制
- 核心能力：日志轮转、多实例单例、配置文件支持
- 入门难度：🟢 简单

**快速判断**：当您需要统一日志输出、文件日志管理时，使用本模块。

## 适用场景

✅ **推荐使用**：
- 统一项目日志输出
- 需要日志文件轮转
- 需要按模块区分日志
- 需要自定义日志配置

❌ **不推荐使用**：
- 简单脚本不需要复杂日志配置

💡 **与其他模块的关系**：
- 被 FQBase 所有模块使用
- 依赖 PyYAML 进行配置加载

## 概述

统一日志系统是 FQBase 框架的日志基础设施，提供：

- **FQLogger**：多实例单例模式的日志记录器类
- **get_logger**：获取日志记录器实例的工厂函数
- **init_logging**：显式初始化日志系统

核心特性包括多实例单例（按 name 区分）、配置文件支持、日志轮转（10MB/文件，保留5个备份）、线程安全和第三方库日志控制。

## 快速链接

| 文档 | 说明 |
|------|------|
| [快速入门](./quick-start.md) | 快速上手 |
| [API参考](./api.md) | API 文档 |
| [使用指南](./usage.md) | 详细用法 |
| [配置指南](./configuration.md) | 配置详解 |
| [案例库](./examples.md) | 使用案例 |

## 相关文档

| 类型 | 文档 | 链接 |
|------|------|------|
| 项目首页 | FQBase 首页 | [README](../README.md) |
| 核心模块 | 事件总线 | [event_bus](./event_bus/README.md) |
