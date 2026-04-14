---
title: DataStore - MongoDB数据存储
description: FQBase MongoDB 数据存储模块，提供 MongoDB 通用操作接口
tag:
  - fqbase
  - datastore

summary:
  type: data-processing
  complexity: medium
  maturity: stable
  size: xs
  core_classes:
    - MongoDB
    - MongoClientManager
  key_functions:
    - get_mongo_db
    - get_mongo_client_manager
    - reset_mongo_db
  # ⚠️ AI 开发必需信息
  usage_scenarios:
    - "MongoDB 数据库连接管理"
    - "需要通用数据存储接口"
  warnings:
    - "连接池配置需合理"
    - "需注意 MongoDB 连接数限制"
  limitations:
    - "仅支持 MongoDB"

relationships:
  belongs_to:
    - fquant.fqbase
  depends_on:
    - pymongo

concepts:
  provides:
    - name: MongoDB操作
      definition: 提供 MongoDB 的 CRUD 操作接口
    - name: 单例模式
      definition: MongoDB 使用单例模式全局管理连接
    - name: 客户端管理
      definition: MongoClientManager 管理多个数据库连接
---

# DataStore - MongoDB数据存储

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [速查表](./cheatsheet.md) → [使用指南](./usage.md) → [案例库](./examples.md) |
| 🔵 开发者 | [README](./README.md) → [技术架构](./architecture.md) → [API参考](./api.md) → [使用指南](./usage.md) → [最佳实践](./best-practices.md) |
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → [故障排查](./troubleshooting.md) → [常见问题](./faq.md) |


## 一句话总览

📌 **FQBase MongoDB 数据存储模块，提供 MongoDB 通用操作接口**

**TL;DR**：
- 解决什么问题：简化 MongoDB 数据库操作
- 核心能力：CRUD 操作、单例管理、客户端池
- 入门难度：🟢 简单

**快速判断**：当您需要操作 MongoDB 数据库时，使用本模块。

## 知识脉络

🧑‍🎓 **从零到精通的推荐学习顺序**：

1. [快速入门](./quick-start.md) - 5 分钟上手
2. [核心概念](./concepts.md) - 理解基本概念
3. [技术架构](./architecture.md) - 理解设计思路
4. [使用指南](./usage.md) - 深入使用
5. [最佳实践](./best-practices.md) - 升华理解

⏱️ 预计学习时间：0.5 小时

## 前置知识

| 知识领域 | 建议资源 | 状态 |
|---------|---------|------|
| MongoDB 基础 | - | ⬜ |
| Python 基础 | [官方教程](https://docs.python.org/zh-cn/3/tutorial/) | ⬜ |

## 适用场景

✅ **推荐使用**：
- MongoDB 数据库操作
- 数据持久化存储
- 文档型数据管理

❌ **不推荐使用**：
- 关系型数据库操作
- 简单配置存储

## 概述

DataStore 是 FQBase 的 MongoDB 数据存储模块，提供以下功能：

- **MongoDB 操作**：提供 CRUD 操作的封装
- **单例模式**：全局唯一的数据库实例
- **客户端管理**：MongoClientManager 管理多个连接

## 快速链接

| 文档 | 说明 |
|------|------|
| [快速入门](./quick-start.md) | 5分钟快速上手 |
| [术语表](./glossary.md) | 术语定义 |
| [核心概念](./concepts.md) | 核心概念详解 |
| [技术架构](./architecture.md) | 技术架构说明 |
| [API参考](./api.md) | API参考文档 |

## 安装

```bash
pip install fquant-fqbase
pip install pymongo
```

## 相关文档

| 类型 | 文档 | 链接 |
|------|------|------|
| 项目首页 | FQBase首页 | [README](../README.md) |
