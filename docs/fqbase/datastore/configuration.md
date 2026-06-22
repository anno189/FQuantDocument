---
title: DataStore - 配置指南
description: DataStore 配置选项详解与初始化生命周期
tag:
  - fquant
  - fqbase
  - datastore

summary:
  purpose: configuration
---

# DataStore - 配置指南

## 阅读路径

🟡 **运维**：README → configuration → troubleshooting → best-practices

## 初始化与生命周期

### 初始化

```python
from FQBase.DataStore import get_mongo_db

db = get_mongo_db(database="mydb")
```

### 生命周期

| 阶段 | 方法 | 说明 |
|------|------|------|
| 连接 | `get_mongo_db()` | 获取数据库实例 |
| 操作 | `insert_one/find_one/update_one/delete_one` | CRUD 操作 |
| 关闭 | 自动管理 | 连接池自动管理 |

## 环境变量

| 变量 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| MONGODB_URI | str | mongodb://localhost:27017 | MongoDB 连接 URI |

## 配置示例

### 最小配置

```bash
MONGODB_URI=mongodb://localhost:27017
```

### 完整配置

```bash
MONGODB_URI=mongodb://user:password@host:27017/?authSource=admin
```

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
