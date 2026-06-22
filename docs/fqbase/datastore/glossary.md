---
title: DataStore - 术语表
description: DataStore 术语定义与解释
tag:
  - fquant
  - fqbase
  - datastore

summary:
  purpose: glossary
---

# DataStore - 术语表

## 阅读路径

🟢 **新手**：README → glossary → quick-start → usage

## 概述

本文档定义了 DataStore 模块中使用的核心术语。

## 术语

### CRUD

**定义：** Create（创建）、Read（读取）、Update（更新）、Delete（删除）四种基本操作。

**示例：** `insert_one`, `find_one`, `update_one`, `delete_one`

### 门面模式 (Facade)

**定义：** 为复杂子系统提供简化接口的设计模式。

**示例：** `MongoDB` 类封装了 `MongoConnection`, `MongoCollection` 等

### 聚合 (Aggregation)

**定义：** 对数据进行 pipeline 处理和统计分析。

**示例：** `$match`, `$group`, `$sort`

### 索引 (Index)

**定义：** 提高查询性能的数据库结构。

**示例：** `ensure_index("users", [("name", 1)])`

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [核心概念](./concepts.md)
