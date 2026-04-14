---
title: Config - 统一配置中心
description: FQBase 统一配置中心，提供环境变量、数据库配置、缓存配置等功能
tag:
  - fqbase
  - config

summary:
  type: infrastructure
  complexity: medium
  maturity: stable
  size: m
  core_classes:
    - EnvManager
    - CacheConfig
    - ConfigWatcher
    - DataSourceConfig
  key_functions:
    - get_env
    - load_env
    - get_datasource_priority

relationships:
  belongs_to:
    - fquant.fqbase
  depends_on:
    - fquant.foundation
  used_by:
    - fquant.fqdata
    - fquant.fqfactor

concepts:
  provides:
    - name: 环境变量管理
      definition: 集中管理 .env 文件加载，支持敏感信息占位符
    - name: 配置监听
      definition: 监控配置文件变化，支持热更新
    - name: 交易常量
      definition: 量化交易相关的枚举常量定义
---

# Config - 统一配置中心

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [速查表](./cheatsheet.md) → [使用指南](./usage.md) → [案例库](./examples.md) |
| 🔵 开发者 | [README](./README.md) → [技术架构](./architecture.md) → [API参考](./api.md) → [使用指南](./usage.md) → [最佳实践](./best-practices.md) |
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → [故障排查](./troubleshooting.md) → [常见问题](./faq.md) |
| 📖 索引 | [README](./README.md) → [变更日志](./changelog.md) |


## 一句话总览

📌 **FQBase 统一配置中心，管理环境变量、数据库配置、缓存配置等**

**TL;DR**：
- 解决什么问题：集中管理应用配置，支持热更新
- 核心能力：环境变量、数据库配置、缓存配置、交易常量
- 入门难度：🟢 简单

**快速判断**：当您需要管理应用配置、使用交易常量、连接数据库时，使用本模块。

## 知识脉络

🧑‍🎓 **从零到精通的推荐学习顺序**：

1. [快速入门](./quick-start.md) - 5 分钟上手
2. [核心概念](./concepts.md) - 理解基本概念
3. [技术架构](./architecture.md) - 理解设计思路
4. [使用指南](./usage.md) - 深入使用
5. [最佳实践](./best-practices.md) - 升华理解

⏱️ 预计学习时间：0.5 小时

## 前置知识

在开始学习本模块前，建议先掌握：

| 知识领域 | 建议资源 | 状态 |
|---------|---------|------|
| Python 基础 | [官方教程](https://docs.python.org/zh-cn/3/tutorial/) | ⬜ |
| 环境变量概念 | - | ⬜ |

## 适用场景

✅ **推荐使用**：
- 管理应用配置（数据库连接、缓存设置等）
- 使用交易常量（订单方向、交易所ID等）
- 配置数据源优先级
- 监听配置文件变化

❌ **不推荐使用**：
- 需要复杂业务逻辑的配置

💡 **与其他模块的关系**：
- 依赖 [Foundation](../foundation/)（单例模式）
- 被 [FQData](../fqdata/) 等模块使用

## 概述

Config 是 FQBase 的统一配置中心，提供以下功能：

- **核心配置**：环境变量管理、数据库配置、缓存配置、配置监听
- **业务配置**：交易常量、数据源配置、财务指标映射、IP列表

## 子模块

| 子模块 | 说明 | 文档 |
|--------|------|------|
| [core/](./core/) | 核心配置：环境变量、数据库、缓存、监听 | L2 |
| [business/](./business/) | 业务配置：交易常量、数据源、映射 | L2 |

## 快速链接

| 文档 | 说明 |
|------|------|
| [快速入门](./quick-start.md) | 5分钟快速上手 |
| [术语表](./glossary.md) | 术语定义 |
| [核心概念](./concepts.md) | 核心概念详解 |
| [技术架构](./architecture.md) | 技术架构说明 |
| [API参考](./api.md) | API参考文档 |
| [案例库](./examples.md) | 案例库 |

## 安装

```bash
pip install fquant-fqbase
```

## 相关文档

| 类型 | 文档 | 链接 |
|------|------|------|
| 项目首页 | FQBase首页 | [README](../README.md) |
| 快速入门 | 快速入门 | [快速入门](./quick-start.md) |
| 核心模块 | Core模块 | [core](./core/) |
| 业务模块 | Business模块 | [business](./business/) |
