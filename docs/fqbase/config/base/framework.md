---
title: Base - 框架集成
description: Base 基础配置模块与其他框架的集成方式
tag:
  - fqbase
  - config
---

# Base - 框架集成

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → **[框架集成](./framework.md)** → [技术架构](./architecture.md) → [设计原则](./design.md) → [API参考](./api.md) → [开发指南](./development.md) → [最佳实践](./best-practices.md) |

## 概述

Base 模块如何与各种框架集成

## 框架集成

### 初始化

```python
from FQBase.Config.base import load_env, get_env

# 加载环境变量
load_env()

# 获取配置
debug = get_env('DEBUG', False)
```

### 生命周期

| 阶段 | 方法 | 说明 |
|------|------|------|
| 初始化 | load_env | 加载环境变量 |
| 配置 | get_env | 获取配置 |
| 运行 | get_cache_config | 使用缓存 |
| 停止 | - | 无需清理 |

### 配置

```yaml
# config.yaml
mongodb:
  url: ${MONGODB_URL}
  database: fquant

cache:
  type: redis
  host: localhost
  port: 6379
```

## 相关文档

- [技术架构](./architecture.md)
- [设计原则](./design.md)
- [API参考](./api.md)
