---
title: Core - 案例库
description: Core 核心配置模块实际应用场景与示例
tag:
  - fqbase
  - config
---

# Core - 案例库

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [使用指南](./usage.md) → **[案例库](./examples.md)** |


## 概述

Core 核心配置模块的实际应用场景。

## 基础示例

### 示例 1：数据库连接配置

**代码：**

```python
from FQBase.Config.core import load_env, get_env

load_env()

db_host = get_env('MONGODB_HOST', 'localhost')
db_port = int(get_env('MONGODB_PORT', 27017))
```

---

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
