---
title: Core - 核心配置
description: Config 核心配置模块，提供环境变量、数据库配置、缓存配置等功能
tag:
  - fqbase
  - config

summary:
  type: infrastructure
  complexity: low
  maturity: stable
  size: s
  core_classes:
    - EnvManager
    - CacheConfig
    - ConfigWatcher
  key_functions:
    - get_env
    - load_env
    - reload_env

relationships:
  belongs_to:
    - fquant.fqbase.config
  depends_on:
    - fquant.foundation
  used_by:
    - fquant.fqbase.config.business

concepts:
  provides:
    - name: 环境变量管理
      definition: 集中管理 .env 文件加载，支持敏感信息占位符
    - name: 缓存配置
      definition: 多种缓存类型的配置管理
    - name: 配置监听
      definition: 监控配置文件变化，支持热更新
---

# Core - 核心配置

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [速查表](./cheatsheet.md) → [使用指南](./usage.md) → [案例库](./examples.md) |
| 🔵 开发者 | [README](./README.md) → [技术架构](./architecture.md) → [API参考](./api.md) → [使用指南](./usage.md) → [最佳实践](./best-practices.md) |
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → [故障排查](./troubleshooting.md) → [常见问题](./faq.md) |


## 一句话总览

📌 **Config 核心配置模块，提供环境变量、数据库配置、缓存配置等基础功能**

**TL;DR**：
- 解决什么问题：提供应用基础配置管理功能
- 核心能力：环境变量、数据库配置、缓存配置、配置监听
- 入门难度：🟢 简单

**快速判断**：当您需要管理环境变量、配置数据库连接、设置缓存时，使用本模块。

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

## 适用场景

✅ **推荐使用**：
- 管理环境变量（数据库连接、API 密钥等）
- 配置数据库连接
- 设置缓存
- 监听配置文件变化

❌ **不推荐使用**：
- 业务逻辑配置（请使用 business 模块）

## 概述

Core 是 Config 的核心配置模块，提供以下功能：

- **环境变量管理**：加载 .env 文件，提供环境变量读取
- **数据库配置**：MongoDB 连接配置和路径配置
- **缓存配置**：多种缓存类型的配置管理
- **配置监听**：监控配置文件变化，支持热更新

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
| 父模块 | Config首页 | [README](../README.md) |
| 业务配置 | Business模块 | [../business](../business/) |
