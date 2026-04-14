---
title: DataStore - 配置指南
description: DataStore MongoDB数据存储模块配置选项详解
tag:
  - fqbase
  - datastore
---

# DataStore - 配置指南

## 概述

DataStore MongoDB数据存储模块的配置选项。

## 配置选项

### 连接参数

```python
from FQBase.DataStore import get_mongo_db

db = get_mongo_db(
    database="mydb",
    host="localhost",
    port=27017,
    username="user",
    password="password"
)
```

### 参数说明

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| database | str | "default" | 数据库名称 |
| host | str | "localhost" | MongoDB 主机 |
| port | int | 27017 | MongoDB 端口 |
| username | str | None | 用户名 |
| password | str | None | 密码 |

---

## 相关文档

- [API参考](./api.md)
