---
title: FQBase - 最佳实践
description: FQBase 最佳实践与建议
tag:
  - fquant
  - fqbase

summary:
  purpose: best-practices
---

# FQBase - 最佳实践

## 阅读路径

🔵🟡 **开发者+运维**：README → best-practices → configuration → troubleshooting

## 概述

本文档提供使用 FQBase 的最佳实践，帮助您在生产环境中高效、稳定地使用框架。

## 性能最佳实践

### 技巧 1: 合理使用单例

**建议：** 单例适用于共享资源（数据库连接、缓存），不适用于短期对象。

**代码 - 好：**
```python
@singleton
class DatabaseConnection:
    def __init__(self):
        self.client = create_client()

db = DatabaseConnection()  # 全局共享
```

**代码 - 差：**
```python
@singleton
class RequestHandler:
    def handle(self, request):
        # 每个请求不应该共享实例
        pass
```

### 技巧 2: 善用缓存减少数据库访问

**建议：** 热点数据使用缓存，避免频繁查询数据库。

**代码 - 好：**
```python
from FQBase.Cache import create_cache

cache = create_cache()

def get_user(user_id):
    cache_key = f"user:{user_id}"
    user = cache.get(cache_key)
    if not user:
        user = db.users.find_one({"_id": user_id})
        cache.set(cache_key, user, ttl=3600)
    return user
```

**代码 - 差：**
```python
def get_user(user_id):
    # 每次请求都查数据库
    return db.users.find_one({"_id": user_id})
```

### 技巧 3: 重试机制使用指数退避

**建议：** 网络操作使用指数退避，避免惊群效应。

**代码 - 好：**
```python
from FQBase.Infrastructure.retry import retry_with_exponential_backoff

@retry_with_exponential_backoff(max_attempts=5, base_delay=1000)
def call_api():
    pass
```

## 错误处理最佳实践

### 使用 safe_execute 包装关键操作

```python
from FQBase.Infrastructure.exceptions import safe_execute

result = safe_execute(
    risky_operation,
    default_value=None,
    logger=logger,
    reraise=False
)
```

### 使用 handle_exception 统一异常处理

```python
from FQBase.Infrastructure.exceptions import handle_exception

try:
    operation()
except FQException as e:
    handle_exception(e, logger=logger, context={"operation": "critical"})
```

## 配置最佳实践

### 使用环境变量管理敏感配置

```yaml
# config.yaml
database:
  host: ${DB_HOST}
  port: ${DB_PORT:-5432}
  username: ${DB_USER}
  password: ${DB_PASSWORD}
```

### 使用 ConfigWatcher 监听配置变更

```python
from FQBase.Config import ConfigWatcher, watch_config

def on_config_change(new_config):
    logger.info(f"Config changed: {new_config}")

watcher = ConfigWatcher()
watcher.add_callback(on_config_change)
watcher.start()
```

## 日志最佳实践

### 结构化日志

```python
from FQBase.Infrastructure import get_logger

logger = get_logger(__name__)
logger.info("User action", extra={
    "user_id": user_id,
    "action": "login",
    "ip": request.ip
})
```

### 分级日志

```python
logger.debug("Detailed debug info")   # 开发调试
logger.info("Operation completed")   # 一般信息
logger.warning("Potential issue")    # 警告
logger.error("Error occurred")       # 错误
```

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [配置指南](./configuration.md)
