# Config/core 核心配置文档

**模块路径**: `FQBase.Config.core`
**源码**: [core/](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Config/core)

---

## 一、概述

core 子模块提供基础配置功能，不包含业务逻辑。

---

## 二、子模块

### env.py - 环境变量管理

| 函数 | 说明 |
|------|------|
| `load_env()` | 加载 .env 文件 |
| `reload_env()` | 重新加载 .env 文件 |
| `get_env(key, default)` | 获取环境变量 |
| `get_secure_env(key, default)` | 安全获取敏感配置 |

### setting.py - MongoDB 连接配置

| 类/函数 | 说明 |
|--------|------|
| `Setting` | MongoDB 连接配置（单例） |
| `SETTING` | Setting 全局实例 |
| `DATABASE` | MongoDB 数据库实例 |
| `GLOBALMAP` | 路径配置（单例） |

### cache_config.py - 缓存配置

| 类/函数 | 说明 |
|--------|------|
| `CacheType` | 缓存类型枚举 |
| `CacheConfig` | 缓存配置数据类 |
| `get_cache_config()` | 获取缓存配置 |
| `set_cache_config()` | 设置缓存配置 |
| `get_cache_kwargs()` | 获取缓存适配器参数 |

### config_watcher.py - 配置监听

| 类/函数 | 说明 |
|--------|------|
| `ConfigWatcher` | 配置文件监听器 |
| `ConfigWatcherManager` | 监听器管理器（单例） |
| `watch_config()` | 便捷函数：创建并启动监听 |

---

## 三、快速开始

### 环境变量

```python
from FQBase.Config.core import load_env, get_env

load_env()
api_key = get_env('API_KEY', 'default_value')
```

### MongoDB 配置

```python
from FQBase.Config.core import Setting, GLOBALMAP

setting = Setting()
mongo_uri = setting.get_mongo()

data_path = GLOBALMAP.FQDATA_PATH
```

### 缓存配置

```python
from FQBase.Config.core import get_cache_config, CacheConfig

config = get_cache_config()
print(f"Cache type: {config.cache_type}")
```

### 配置监听

```python
from FQBase.Config.core import watch_config

def on_reload():
    print("配置已重新加载")

watcher = watch_config('/path/to/config.yaml', on_reload)
```
