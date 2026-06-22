---
title: DataStore
description: FQBase MongoDB 数据存储模块，提供 CRUD、聚合、索引管理等
tag:
  - fquant
  - fqbase
  - datastore

summary:
  type: data_store
  complexity: medium
  maturity: stable
  size: small
  is_container: false
  api_exports:
    total: 11
    classes: 7
    functions: 4
    constants: 0
  core_functions:
    - get_mongo_db
    - reset_mongo_db
    - get_mongo_client_manager
  features:
    has_async: false
    is_thread_safe: true
    has_config: true
    has_logging: true
    has_security: false
  usage_scenarios:
    - "MongoDB CRUD 操作"
    - "聚合查询"
    - "索引管理"
    - "数据库运维"
  warnings:
    - "连接池耗尽会导致性能下降"
    - "索引操作需要谨慎，影响性能"
  limitations:
    - "需要 MongoDB 服务支持"
  design_patterns:
    - facade

relationships:
  belongs_to:
    - fquant.fqbase
  depends_on:
    - fquant.fqbase.infrastructure
  used_by:
    - fquant.fqdata

documentation_progress:
  status: complete
  level: L2
  total_expected: 12
  total_generated: 12
  generated:
    - README.md
    - quick-start.md
    - concepts.md
    - api.md
    - usage.md
    - examples.md
    - glossary.md
    - changelog.md
    - best-practices.md
    - integrations.md
    - troubleshooting.md
    - configuration.md
  missing: []

maintenance:
  source_hash: "2e7b0e2e4b90759534cfc5785989f2850a43afce6ebb08d9de18771474ea555d"
  source_mtime: 1776812430
  source_files:
    - "__init__.py"
    - "_collection.py"
    - "_connection.py"
    - "_database_admin.py"
    - "_index_manager.py"
    - "mongo_db.py"
  last_updated: "2026-04"
---

# DataStore

## 阅读路径

🟢 **新手入门**：README → quick-start → examples → concepts → glossary → usage

🔵 **开发者**：README → api → usage → concepts → examples

🟡 **运维/安全**：README → changelog → configuration → troubleshooting → best-practices

## 一句话总览

📌 **FQBase MongoDB 数据存储模块，提供门面模式封装的 CRUD、聚合、索引管理等操作。**

## ⚠️ AI 开发必读

### 使用场景

✅ **应该使用**：
- MongoDB 数据库操作 → 使用 `MongoDB` 门面类
- 需要聚合查询 → 使用 `MongoCollection.aggregate()`
- 需要索引管理 → 使用 `MongoIndexManager`
- 数据库运维操作 → 使用 `MongoDatabaseAdmin`

❌ **不应该使用**：
- 直接使用 pymongo（应通过 DataStore 门面）
- 在循环中进行单条插入（应使用批量操作）

### 注意事项

1. **门面模式**
   - `MongoDB` 是统一入口，封装了底层复杂性
   - 不要直接实例化 `MongoConnection` 等内部类

2. **连接管理**
   - 使用 `get_mongo_db()` 获取数据库实例
   - 避免频繁创建和关闭连接

3. **性能优化**
   - 批量操作优先于单条操作
   - 合理使用索引

### 依赖

| 依赖类型 | 模块 | 说明 |
|---------|------|------|
| 必须 | pymongo | MongoDB 驱动 |
| 必须 | FQBase.Infrastructure | 日志、异常 |

**TL;DR**：
- 解决什么问题：统一 MongoDB 数据存储操作
- 核心能力：CRUD、聚合、索引管理、运维
- 入门难度：🟢 简单

**快速判断**：当您需要 MongoDB 数据操作 时，使用 DataStore。

## 架构图

```mermaid
graph TB
    subgraph DataStore["DataStore"]
        facade["MongoDB - 门面类"]
        connection["MongoConnection - 连接管理"]
        collection["MongoCollection - 数据操作"]
        index["MongoIndexManager - 索引管理"]
        admin["MongoDatabaseAdmin - 运维管理"]
    end
```

## 组件

| 组件 | 说明 |
|------|------|
| MongoDB | 门面类，统一入口 |
| MongoConnection | MongoDB 连接管理 |
| MongoCollection | CRUD 和聚合操作 |
| MongoIndexManager | 索引管理 |
| MongoDatabaseAdmin | 运维命令 |

## 快速链接

| 需求 | 文档 |
|------|------|
| 快速入门 | [快速入门](./quick-start.md) |
| 查看 API | [API参考](./api.md) |
| 配置指南 | [配置指南](./configuration.md) |
| 故障排查 | [故障排查](./troubleshooting.md) |

## 相关文档

- [FQBase README](../README.md)
