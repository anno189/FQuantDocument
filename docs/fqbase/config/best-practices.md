---
title: Config - 最佳实践
description: Config 最佳实践与建议
tag:
  - fquant
  - fqbase
  - config

summary:
  purpose: best-practices
---

# Config - 最佳实践

## 阅读路径

🔵🟡 **开发者+运维**：README → best-practices → configuration → troubleshooting

## 概述

本文档提供使用 Config 模块的最佳实践。

## 安全最佳实践

### 技巧 1: 使用环境变量存储敏感信息

**建议：** 敏感配置（密码、API Key）必须通过环境变量获取。

```python
# ✅ 正确
api_key = get_secure_env("API_KEY")

# ❌ 错误
api_key = "hardcoded_key_12345"
```

### 技巧 2: 使用 get_secure_env 获取敏感配置

**建议：** 使用 get_secure_env 过滤占位符，避免占位符泄露。

```python
from FQBase.Config import get_secure_env

# 安全获取
password = get_secure_env("DB_PASSWORD")
```

## 配置管理最佳实践

### 技巧 3: 集中管理配置

**建议：** 所有配置通过 Config 模块获取，避免硬编码。

```python
from FQBase.Config import SETTING, GLOBALMAP, get_cache_config

# 统一配置入口
mongo_uri = SETTING.get_mongo()
data_path = GLOBALMAP.FQDATA_PATH
cache_config = get_cache_config()
```

### 技巧 4: 使用默认值

**建议：** 为配置项提供合理的默认值。

```python
from FQBase.Config import get_env

timeout = get_env("TIMEOUT", default="30")
debug = get_env("DEBUG", default="false")
```

## 性能最佳实践

### 技巧 5: 懒加载数据库连接

**建议：** 使用 get_database() 懒加载，避免启动时建立连接。

```python
from FQBase.Config import get_database

# 首次使用时才建立连接
db = get_database()
```

### 技巧 6: 单例使用

**建议：** 不要创建 Setting 或 GlobalMap 的新实例，直接使用单例。

```python
# ✅ 正确
from FQBase.Config import SETTING
uri = SETTING.get_mongo()

# ❌ 错误
from FQBase.Config import Setting
s = Setting()  # 不要这样做
```

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [配置指南](./configuration.md)
