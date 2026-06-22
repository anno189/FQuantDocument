---
title: Config - 配置指南
description: Config 配置选项详解与初始化生命周期
tag:
  - fquant
  - fqbase
  - config

summary:
  purpose: configuration
---

# Config - 配置指南

## 阅读路径

🟡 **运维**：README → configuration → troubleshooting → best-practices

## 初始化与生命周期

### 初始化

```python
from FQBase.Config import load_env, SETTING, GLOBALMAP

# 1. 加载环境变量
load_env()

# 2. 获取配置
uri = SETTING.get_mongo()
path = GLOBALMAP.FQDATA_PATH
```

### 生命周期

| 阶段 | 方法 | 说明 |
|------|------|------|
| 加载环境 | `load_env()` | 加载 .env 文件 |
| 获取配置 | `SETTING.get_mongo()` | 获取 MongoDB 配置 |
| 获取路径 | `GLOBALMAP.FQDATA_PATH` | 获取路径配置 |
| 监听变更 | `watch_config()` | 监听配置变更 |

## 环境变量

| 变量 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| MONGODB_URI | str | mongodb://localhost:27017 | MongoDB 连接 URI |
| REDIS_HOST | str | localhost | Redis 主机 |
| REDIS_PORT | int | 6379 | Redis 端口 |
| REDIS_PASSWORD | str | None | Redis 密码 |
| FQUANT_ROOT_PATH | str | ~/.fqdata | 根目录路径 |
| FQUANT_FQDATA_PATH | str | ~/.fqdata | 数据目录路径 |
| CACHE_TYPE | str | memory | 缓存类型 |
| LOG_LEVEL | str | INFO | 日志级别 |

## 配置优先级

1. 环境变量 → 2. .env 文件 → 3. config.ini → 4. 默认值

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
