---
title: Config - 配置指南
description: Config 配置中心配置选项详解
tag:
  - fqbase
  - config
---

# Config - 配置指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → **[配置指南](./configuration.md)** → [故障排查](./troubleshooting.md) |


## 概述

Config 配置中心的所有配置选项详细说明。

## 配置文件

### 文件位置

```yaml
# 默认位置
.env

# 自定义位置
通过 FQ_ENV_PATH 环境变量指定
```

### .env 文件格式

```bash
# 数据库配置
MONGODB_HOST=localhost
MONGODB_PORT=27017
MONGODB_DATABASE=fquant

# Redis 配置
REDIS_HOST=localhost
REDIS_PORT=6379

# API 配置
API_KEY=your_api_key_here
```

## 配置选项

### 核心选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| FQ_ENV_PATH | str | .env | 环境变量文件路径 |
| MONGODB_HOST | str | localhost | MongoDB 主机 |
| MONGODB_PORT | int | 27017 | MongoDB 端口 |
| MONGODB_DATABASE | str | fquant | 数据库名称 |

### Redis 选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| REDIS_HOST | str | localhost | Redis 主机 |
| REDIS_PORT | int | 6379 | Redis 端口 |
| REDIS_DB | int | 0 | Redis 数据库编号 |

### API 选项

| 选项 | 类型 | 描述 |
|------|------|------|
| API_KEY | str | API 密钥（敏感） |
| SECRET_KEY | str | 密钥（敏感） |

## 环境变量

| 变量 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| RUNNING_ENVIRONMENT | str | development | 运行环境 |
| LOG_LEVEL | str | INFO | 日志级别 |

## 配置示例

### 最小配置

```bash
# 只需数据库配置
MONGODB_HOST=localhost
MONGODB_DATABASE=fquant
```

### 完整配置

```bash
# 数据库
MONGODB_HOST=localhost
MONGODB_PORT=27017
MONGODB_DATABASE=fquant

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# API
API_KEY=your_key_here

# 环境
RUNNING_ENVIRONMENT=production
LOG_LEVEL=DEBUG
```

### 开发环境配置

```bash
# 开发环境
MONGODB_HOST=localhost
MONGODB_DATABASE=fquant_dev
RUNNING_ENVIRONMENT=development
LOG_LEVEL=DEBUG
```

### 生产环境配置

```bash
# 生产环境
MONGODB_HOST=prod.mongodb.com
MONGODB_PORT=27017
MONGODB_DATABASE=fquant_prod
RUNNING_ENVIRONMENT=production
LOG_LEVEL=INFO
```

## 配置优先级

配置值按以下顺序解析（从高到低）：

1. 系统环境变量
2. .env 文件
3. 代码默认值

## 动态配置

### 运行时更新

```python
from FQBase.Config import reload_env

# 重新加载配置
reload_env()
```

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
