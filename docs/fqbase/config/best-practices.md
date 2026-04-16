---
title: Config - 最佳实践
description: FQBase 配置中心最佳实践与建议
tag:
  - fqbase
  - config
---

# Config - 最佳实践

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → [设计原则](./design.md) → [API参考](./api.md) → [开发指南](./development.md) → [使用指南](./usage.md) → **[最佳实践](./best-practices.md)** |
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → [安全指南](./security.md) → [故障排查](./troubleshooting.md) → [常见问题](./faq.md) → **[最佳实践](./best-practices.md)** |

## 子模块最佳实践

| 子模块 | 最佳实践 | 说明 |
|--------|----------|------|
| base | [最佳实践](./base/best-practices.md) | 基础配置最佳实践 |
| business | [最佳实践](./business/best-practices.md) | 业务配置最佳实践 |


## 概述

有效使用配置中心的最佳实践，提升配置管理的安全性和可维护性。

## 配置管理最佳实践

### 技巧 1: 始终使用 get_env 获取配置

**建议：** 使用统一的 get_env 接口获取环境变量，而不是直接访问 os.environ

**代码 - 好：**

```python
from FQBase.Config import get_env

# 统一获取方式
db_url = get_env('MONGODB_URL', 'mongodb://localhost:27017')
debug = get_env('DEBUG', False)
```

**代码 - 差：**

```python
import os

# 直接访问 os.environ
db_url = os.environ.get('MONGODB_URL')
debug = os.environ.get('DEBUG', 'false')  # 类型不一致
```

### 技巧 2: 敏感配置使用 get_secure_env

**建议：** API 密钥、密码等敏感信息使用 get_secure_env 获取

**代码 - 好：**

```python
from FQBase.Config import get_secure_env

# 敏感信息不会被记录到日志
api_key = get_secure_env('API_KEY')
password = get_secure_env('DB_PASSWORD')
```

**代码 - 差：**

```python
from FQBase.Config import get_env

# 敏感信息可能被记录到日志
api_key = get_env('API_KEY')  # 不安全
```

### 技巧 3: 在应用启动时初始化

**建议：** 在应用启动时调用 load_env() 加载配置

**代码 - 好：**

```python
# app.py
from FQBase.Config import load_env

# 应用入口处加载配置
load_env()

# 后续代码可以安全使用 get_env
from FQBase.Config import get_env
debug = get_env('DEBUG', False)
```

### 技巧 4: 使用单例配置

**建议：** 避免重复创建 SETTING 等单例配置

**代码 - 好：**

```python
from FQBase.Config import SETTING

# 直接使用单例
mongo_uri = SETTING.get_mongo()
```

**代码 - 差：**

```python
# 错误：每次导入可能创建新实例
from FQBase.Config.core.setting import Setting
setting = Setting()  # 不应该这样做
```

## 安全最佳实践

### 技巧 1: 敏感配置不提交到代码库

**建议：** 使用 .env 文件存储敏感配置，并添加到 .gitignore

```bash
# .gitignore
.env
.env.local
*.pem
*.key
```

### 技巧 2: 生产环境使用环境变量覆盖

**建议：** 生产环境使用系统环境变量覆盖文件配置

```python
from FQBase.Config import load_env, get_env

# 加载 .env 文件
load_env()

# 生产环境通过环境变量覆盖
# export MONGODB_URL=mongodb://prod-server
```

## 缓存最佳实践

### 技巧 1: 缓存配置在启动时设置

**建议：** 缓存配置在应用启动时设置，避免运行时频繁更改

```python
from FQBase.Config import CacheConfig

# 应用启动时设置
cache_config = CacheConfig(
    cache_type=get_env('CACHE_TYPE', 'redis'),
    ttl=int(get_env('CACHE_TTL', 3600))
)
```

### 技巧 2: 根据环境选择缓存类型

```python
import os
from FQBase.Config import CacheConfig

env = os.getenv('APP_ENV', 'development')

if env == 'production':
    cache_type = 'redis'  # 生产环境使用 Redis
else:
    cache_type = 'mongo'  # 开发环境使用 MongoDB

config = CacheConfig(cache_type=cache_type)
```

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [开发指南](./development.md)
