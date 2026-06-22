---
title: FQBase - 配置指南
description: FQBase 配置选项详解与初始化生命周期
tag:
  - fquant
  - fqbase

summary:
  purpose: configuration
---

# FQBase - 配置指南

## 阅读路径

🟡 **运维**：README → configuration → troubleshooting → best-practices

## 初始化与生命周期

### 初始化

```python
from FQBase.Infrastructure import init_logging
from FQBase.Config import load_env

load_env()
init_logging(config_path="logging.yaml")
```

### 生命周期

| 阶段 | 方法 | 说明 |
|------|------|------|
| 加载环境 | `load_env()` | 加载 .env 文件 |
| 初始化日志 | `init_logging()` | 配置日志系统 |
| 创建缓存 | `create_cache()` | 初始化缓存适配器 |
| 连接数据库 | `get_database()` | 建立 MongoDB 连接 |

## 配置选项

### 核心选项

#### MongoDB 配置

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| MONGODB_URI | str | mongodb://localhost:27017 | MongoDB 连接 URI |
| MONGODB_DATABASE | str | quantaxis | 默认数据库名 |
| MONGODB_MAX_POOL_SIZE | int | 50 | 最大连接池大小 |
| MONGODB_MIN_POOL_SIZE | int | 10 | 最小连接池大小 |

#### Redis 缓存配置

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| REDIS_HOST | str | localhost | Redis 主机 |
| REDIS_PORT | int | 6379 | Redis 端口 |
| REDIS_PASSWORD | str | None | Redis 密码 |
| REDIS_DB | int | 0 | Redis 数据库编号 |
| REDIS_MAX_CONNECTIONS | int | 50 | 最大连接数 |

### 高级选项

#### 路径配置

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| FQUANT_ROOT_PATH | str | ~/.fqdata | FQuant 根目录 |
| FQUANT_FQDATA_PATH | str | ~/.fqdata | 数据目录 |
| FQUANT_INDEX_PATH | str | None | 索引目录 |
| FQUANT_START_DATE | str | 2021-01-01 | 数据起始日期 |

#### 日志配置

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| LOG_LEVEL | str | INFO | 日志级别 |
| LOG_PATH | str | ~/.fqdata/log | 日志目录 |

## 环境变量

| 变量 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| FQUANT_ROOT_PATH | str | ~/.fqdata | 根路径 |
| FQUANT_FQDATA_PATH | str | ~/.fqdata | 数据路径 |
| FQUANT_INDEX_PATH | str | None | 索引路径 |
| FQUANT_START_DATE | str | 2021-01-01 | 起始日期 |
| MONGODB_URI | str | mongodb://localhost:27017 | MongoDB URI |
| REDIS_HOST | str | localhost | Redis 主机 |
| REDIS_PORT | int | 6379 | Redis 端口 |
| REDIS_PASSWORD | str | None | Redis 密码 |
| CHROME_DRIVER_PATH | str | /usr/local/bin/chromedriver | ChromeDriver 路径 |

## 配置优先级

1. 环境变量 → 2. .env 文件 → 3. config.ini → 4. 默认值

## 配置示例

### 最小配置

```bash
# .env
MONGODB_URI=mongodb://localhost:27017
```

### 完整配置

```bash
# .env
MONGODB_URI=mongodb://user:pass@host:27017
REDIS_HOST=redis.example.com
REDIS_PORT=6379
REDIS_PASSWORD=secret
FQUANT_ROOT_PATH=/data/fquant
LOG_LEVEL=DEBUG
```

```yaml
# logging.yaml
version: 1
formatters:
  default:
    format: '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
handlers:
  console:
    class: logging.StreamHandler
  file:
    class: logging.handlers.RotatingFileHandler
    filename: /data/fquant/logs/app.log
root:
  level: INFO
  handlers: [console, file]
```

## 动态配置

### 更新缓存配置

```python
from FQBase.Config import CacheConfig, set_cache_config

new_config = CacheConfig(
    cache_type="redis",
    redis_host="new-host",
    redis_port=6379
)
set_cache_config(new_config)
```

### 监听配置变更

```python
from FQBase.Config import ConfigWatcher, watch_config

def on_change(key, value):
    logger.info(f"Config changed: {key} = {value}")

watcher = watch_config(["MONGODB_URI", "REDIS_HOST"])
watcher.add_callback(on_change)
```

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
