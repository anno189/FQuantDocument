---
title: Base - 案例库
description: Base 基础配置模块实际应用场景与示例
tag:
  - fqbase
  - config
---

# Base - 案例库

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → **[案例库](./examples.md)** |

## 场景 1: 应用初始化

**业务需求**：应用启动时初始化所有配置

```python
from FQBase.Config.base import load_env, SETTING, set_cache_config, CacheType

# 应用初始化
def init_app():
    # 1. 加载环境变量
    load_env('.env')
    
    # 2. 获取数据库配置
    mongo_uri = SETTING.get_mongo()
    
    # 3. 配置缓存
    set_cache_config(CacheType.REDIS, host='localhost', port=6379)
    
    print("应用初始化完成")

init_app()
```

---

## 场景 2: 多环境配置切换

**业务需求**：根据环境切换不同配置

```python
from FQBase.Config.base import load_env, get_env

# 加载对应环境的配置
env = get_env('ENV', 'dev')
load_env(f'.env.{env}')

print(f"当前环境: {env}")
```

---

## 场景 3: 敏感信息管理

**业务需求**：安全管理 API 密钥等敏感信息

```python
from FQBase.Config.base import get_secure_env

# 获取敏感信息（不记录日志）
api_key = get_secure_env('API_KEY')
db_password = get_secure_env('DB_PASSWORD')

print("敏感信息已获取")
```

---

## 场景 4: 配置热更新

**业务需求**：运行时更新配置

```python
from FQBase.Config.base import reload_env, set_cache_config, CacheType

# 重新加载环境变量
reload_env()

# 更新缓存配置
set_cache_config(CacheType.MONGODB, db_name='new_cache')

print("配置已更新")
```

---

## 场景 5: 配置监听

**业务需求**：监听配置文件变化并自动重载

```python
from FQBase.Config.base import watch_config

@watch_config('config.yaml')
def on_config_change(new_config):
    print(f"配置已更新: {new_config}")
    # 重新加载配置
```

---

## 场景 6: 统一配置接口

**业务需求**：为多个模块提供统一配置接口

```python
from FQBase.Config.base import SETTING, get_cache_config, CACHE_PATH

# 统一配置接口
class ConfigProvider:
    @staticmethod
    def get_db_uri():
        return SETTING.get_mongo()
    
    @staticmethod
    def get_cache_config():
        return get_cache_config()
    
    @staticmethod
    def get_cache_path():
        return CACHE_PATH

# 使用
provider = ConfigProvider()
db_uri = provider.get_db_uri()
```

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
