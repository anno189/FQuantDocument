---
title: Config - 案例库
description: FQBase 配置中心实际应用场景与示例
tag:
  - fqbase
  - config
---

# Config - 案例库

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → **[案例库](./examples.md)** |

## 子模块案例库

| 子模块 | 案例库 | 说明 |
|--------|--------|------|
| base | [案例库](./base/examples.md) | 基础配置案例 |
| business | [案例库](./business/examples.md) | 业务配置案例 |


## 场景 1: 应用启动配置加载

**业务需求：** 应用启动时自动加载配置

```python
# config_loader.py
from FQBase.Config import load_env, get_env, SETTING, CacheConfig

def init_app():
    # 加载环境变量
    load_env()
    
    # 获取配置
    debug = get_env('DEBUG', False)
    db_uri = SETTING.get_mongo()
    
    # 配置缓存
    cache_type = get_env('CACHE_TYPE', 'redis')
    cache_config = CacheConfig(cache_type=cache_type)
    
    print(f"应用初始化完成，调试模式: {debug}")

if __name__ == '__main__':
    init_app()
```

---

## 场景 2: 多环境配置管理

**业务需求：** 开发、测试、生产环境使用不同配置

```python
# .env.development
DEBUG=true
MONGODB_URL=mongodb://localhost:27017/fquant_dev

# .env.production
DEBUG=false
MONGODB_URL=mongodb://production-server/fquant_prod

# config.py
import os
from FQBase.Config import load_env, get_env

def load_config():
    env = os.getenv('APP_ENV', 'development')
    load_env(f'.env.{env}')
    
    return {
        'debug': get_env('DEBUG', False),
        'mongo_url': get_env('MONGODB_URL'),
    }
```

---

## 场景 3: 敏感配置安全存储

**业务需求：** API 密钥等敏感配置安全获取

```python
from FQBase.Config import get_secure_env

def init_api_client():
    # 敏感配置不会被记录到日志
    api_key = get_secure_env('API_KEY')
    api_secret = get_secure_env('API_SECRET')
    
    return APIClient(api_key, api_secret)
```

---

## 场景 4: 动态配置监听

**业务需求：** 配置文件变更时自动重载

```python
from FQBase.Config import ConfigWatcher, reload_env

def setup_config_watcher():
    watcher = ConfigWatcher()
    
    def reload_callback():
        print("配置已变更，重新加载...")
        reload_env()
    
    # 监听配置变化
    watcher.watch('database', callback=reload_callback)
    watcher.watch('cache', callback=reload_callback)
    
    return watcher
```

---

## 场景 5: 缓存策略配置

**业务需求：** 根据环境选择缓存策略

```python
from FQBase.Config import CacheConfig, get_cache_config, get_cache_kwargs

def init_cache():
    # 创建缓存配置
    cache_type = 'redis'  # 可根据环境变量切换
    
    config = CacheConfig(
        cache_type=cache_type,
        ttl=3600,
        prefix='fquant:'
    )
    
    # 获取全局配置
    global_config = get_cache_config()
    
    # 获取缓存参数字典
    kwargs = get_cache_kwargs()
    
    return kwargs
```
