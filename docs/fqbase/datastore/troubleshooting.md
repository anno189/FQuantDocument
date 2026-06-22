---
title: DataStore - 故障排查
description: DataStore 常见问题与解决方案
tag:
  - fquant
  - fqbase
  - datastore

summary:
  purpose: troubleshooting
---

# DataStore - 故障排查

## 阅读路径

🟡🔵 **运维+开发者**：README → troubleshooting → configuration → best-practices

## 概述

本文档帮助您诊断和解决使用 DataStore 模块时的常见问题。

## 常见问题

### 问题 1: MongoDB 连接失败

**症状：**
- 连接超时
- 服务不可达

**解决方案：**

1. 检查 MongoDB 服务
```bash
mongosh --eval "db.adminCommand('ping')"
```

2. 检查连接配置
```python
from FQBase.Config import SETTING
print(SETTING.get_mongo())
```

### 问题 2: 查询性能差

**症状：**
- 查询响应慢
- 超时

**解决方案：**

1. 创建索引
```python
db.ensure_index("users", [("name", 1)])
```

2. 使用投影减少返回字段
```python
db.find_one("users", {"name": "test"}, projection={"password": 0})
```

## FAQ

### Q: 如何查看集合列表？

```python
from FQBase.DataStore import get_mongo_db

db = get_mongo_db(database="mydb")
print(db.list_collection_names())
```

## 相关文档

- [最佳实践](./best-practices.md)
- [API参考](./api.md)
- [配置指南](./configuration.md)
