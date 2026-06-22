---
title: Config - 案例库
description: Config 实际应用场景、动手实验与案例研究
tag:
  - fquant
  - fqbase
  - config

summary:
  purpose: examples
---

# Config - 案例库

## 阅读路径

🟢🔵 **新手+开发者**：README → examples → api → usage

## 业务场景案例

### 场景 1: 多环境配置管理

**业务需求：** 在开发、测试、生产环境使用不同配置

```python
from FQBase.Config import get_env, SETTING, GLOBALMAP

# 根据环境切换
env = get_env("ENV", default="development")

if env == "production":
    SETTING.change(ip="prod-mongo.example.com", port=27017)
elif env == "development":
    SETTING.change(ip="localhost", port=27017)
```

### 场景 2: 敏感信息保护

**业务需求：** 避免敏感信息硬编码

```python
from FQBase.Config import get_secure_env

# 从环境变量安全获取
api_key = get_secure_env("THIRD_PARTY_API_KEY")
database_password = get_secure_env("DB_PASSWORD")
```

## 动手实验

### Lab 1: 实现配置热更新

**目标：** 监听配置文件变化并自动重载

```python
from FQBase.Config import watch_config, SETTING
import logging

logger = logging.getLogger(__name__)

def reload_mongo_config(new_config):
    logger.info(f"检测到配置变更: {new_config}")
    # 重新加载配置
    uri = new_config.get("MONGODB_URI")
    if uri:
        host = uri.split("//")[1].split(":")[0]
        port = int(uri.split(":")[-1])
        SETTING.change(ip=host, port=port)

watcher = watch_config(["MONGODB_URI"])
watcher.add_callback(reload_mongo_config)
```

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
