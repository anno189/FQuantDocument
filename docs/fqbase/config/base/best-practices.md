---
title: Base - 最佳实践
description: Base 基础配置模块最佳实践与建议
tag:
  - fqbase
  - config
---

# Base - 最佳实践

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → [设计原则](./design.md) → [API参考](./api.md) → [开发指南](./development.md) → [使用指南](./usage.md) → **[最佳实践](./best-practices.md)** |
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → [安全指南](./security.md) → [故障排查](./troubleshooting.md) → [常见问题](./faq.md) → **[最佳实践](./best-practices.md)** |

## 概述

有效使用 Base 基础配置模块的最佳实践

## 性能最佳实践

### 技巧 1: 使用单例获取配置

**建议：** 使用 SETTING 单例而不是创建新实例

**代码 - 好：**
```python
from FQBase.Config.base import SETTING
mongo_uri = SETTING.get_mongo()
```

**代码 - 差：**
```python
from FQBase.Config.base import Setting
setting = Setting()  # 每次创建新实例
mongo_uri = setting.get_mongo()
```

### 技巧 2: 缓存配置集中管理

**建议：** 在应用启动时设置好缓存配置

**代码 - 好：**
```python
from FQBase.Config.base import set_cache_config, CacheType

# 启动时配置
set_cache_config(CacheType.REDIS, host='localhost', port=6379)
```

## 安全最佳实践

### 技巧 1: 使用 get_secure_env

**建议：** 敏感信息使用 get_secure_env

**代码 - 好：**

```python
from FQBase.Config.base import get_secure_env

api_key = get_secure_env('API_KEY')
```

**代码 - 差：**

```python
import os
api_key = os.environ['API_KEY']  # 可能被日志记录
```

### 技巧 2: 环境变量文件安全

**建议：** 不要提交 .env 文件到版本控制

```bash
# .gitignore 添加
.env
.env.local
```

## 配置最佳实践

### 技巧 1: 使用默认值

**建议：** 始终为 get_env 提供默认值

```python
debug = get_env('DEBUG', False)
db_url = get_env('MONGODB_URL', 'mongodb://localhost:27017')
```

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [开发指南](./development.md)
