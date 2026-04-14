---
title: Core - 集成指南
description: Core 核心配置模块第三方集成指南
tag:
  - fqbase
  - config
---

# Core - 集成指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [API参考](./api.md) → [使用指南](./usage.md) → **[集成指南](./integrations.md)** |


## 概述

Core 核心配置模块的集成指南。

## 数据库集成

### MongoDB

```python
from FQBase.Config.core import DATABASE
from pymongo import MongoClient

client = MongoClient(
    host=DATABASE.get('host'),
    port=DATABASE.get('port'),
)
```

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
