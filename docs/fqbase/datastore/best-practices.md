---
title: DataStore - 最佳实践
description: DataStore 最佳实践与建议
tag:
  - fquant
  - fqbase
  - datastore

summary:
  purpose: best-practices
---

# DataStore - 最佳实践

## 阅读路径

🔵🟡 **开发者+运维**：README → best-practices → configuration → troubleshooting

## 概述

本文档提供使用 DataStore 模块的最佳实践。

## 性能最佳实践

### 技巧 1: 使用批量操作

**建议：** 批量插入优先于单条插入。

```python
db.insert_many("users", [
    {"name": "user1"},
    {"name": "user2"},
    {"name": "user3"}
])
```

### 技巧 2: 合理使用索引

**建议：** 在查询字段上创建索引。

```python
db.ensure_index("users", [("name", 1)])
```

## 安全最佳实践

### 技巧 3: 验证输入

**建议：** 插入前验证数据。

```python
def create_user(name, email, age):
    if not name or not email:
        raise ValueError("Invalid input")
    db.insert_one("users", {"name": name, "email": email, "age": age})
```

## 配置最佳实践

### 技巧 4: 使用连接池

**建议：** 复用数据库连接。

```python
db = get_mongo_db(database="mydb")
```

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [配置指南](./configuration.md)
