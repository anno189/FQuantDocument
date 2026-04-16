---
title: Base - 配置指南
description: Base 基础配置模块配置选项详解
tag:
  - fqbase
  - config
---

# Base - 配置指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → **[配置指南](./configuration.md)** → [安全指南](./security.md) → [故障排查](./troubleshooting.md) → [常见问题](./faq.md) |

## 概述

Base 模块所有配置选项的详细说明

## 环境变量配置

### 必需变量

| 变量 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| MONGODB_URL | str | mongodb://localhost:27017 | MongoDB 连接地址 |

### 可选变量

| 变量 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| DEBUG | bool | False | 调试模式 |
| REDIS_HOST | str | localhost | Redis 主机 |
| REDIS_PORT | int | 6379 | Redis 端口 |

## 配置示例

### 最小配置

```yaml
mongodb:
  url: mongodb://localhost:27017
```

### 完整配置

```yaml
mongodb:
  url: mongodb://localhost:27017
  database: fquant

cache:
  type: redis
  host: localhost
  port: 6379
  db: 0

paths:
  fqdata: ./data
  cache: ./cache
  logs: ./logs
```

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
