---
title: Config - API参考
description: FQBase 配置中心 API 参考文档
tag:
  - fqbase
  - config

summary:
  purpose: api-reference
  type: container
  core_classes:
    - SETTING
    - DATABASE
    - CacheConfig
    - ConfigWatcher
  core_functions:
    - get_env
    - load_env
    - get_cache_config
---

# Config - API参考

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → [设计原则](./design.md) → **[API参考](./api.md)** → [开发指南](./development.md) → [最佳实践](./best-practices.md) |

## 子模块 API 参考

| 子模块 | API 参考 | 说明 |
|--------|----------|------|
| base | [API参考](./base/api.md) | 基础配置 API |
| business | [API参考](./business/api.md) | 业务配置 API |


## 概述

本文档介绍配置中心的核心 API，包括环境变量管理、数据库配置、缓存配置和配置监听的完整接口。

## 函数

### get_env

```python
from FQBase.Config import get_env

value = get_env(key: str, default: Any = None) -> Any
```

**描述：** 获取环境变量值，支持默认值

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| key | str | 是 | - | 环境变量名称 |
| default | Any | 否 | None | 默认值 |

**返回：** `Any` - 环境变量值或默认值

**示例：**

```python
debug = get_env('DEBUG', False)
db_url = get_env('MONGODB_URL', 'mongodb://localhost:27017')
```

---

### load_env

```python
from FQBase.Config import load_env

load_env(env_file: str = '.env') -> None
```

**描述：** 加载 .env 文件到环境变量

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| env_file | str | 否 | '.env' | 环境变量文件路径 |

**示例：**

```python
load_env()  # 加载默认 .env 文件
load_env('/path/to/custom.env')  # 加载自定义文件
```

---

### reload_env

```python
from FQBase.Config import reload_env

reload_env(env_file: str = '.env') -> None
```

**描述：** 重新加载环境变量文件

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| env_file | str | 否 | '.env' | 环境变量文件路径 |

---

### get_secure_env

```python
from FQBase.Config import get_secure_env

value = get_secure_env(key: str, default: Any = None) -> Any
```

**描述：** 安全获取环境变量，不会被记录到日志

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| key | str | 是 | - | 环境变量名称 |
| default | Any | 否 | None | 默认值 |

---

## 类

### SETTING

**描述：** MongoDB 连接配置单例

```python
from FQBase.Config import SETTING

uri = SETTING.get_mongo()
```

#### 方法

##### get_mongo

```python
uri = SETTING.get_mongo() -> str
```

**返回：** `str` - MongoDB 连接 URI

---

### DATABASE

**描述：** MongoDB 数据库实例（懒加载）

```python
from FQBase.Config import DATABASE

db = DATABASE
collection = db['my_collection']
```

---

### CacheConfig

**描述：** 缓存配置类

```python
from FQBase.Config import CacheConfig, get_cache_config

config = CacheConfig(cache_type='redis', ttl=3600)
```

#### 参数

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| cache_type | str | 否 | 'mongo' | 缓存类型：'redis' 或 'mongo' |
| ttl | int | 否 | 3600 | 缓存过期时间（秒） |

#### 方法

##### get_cache_type

```python
cache_type = config.get_cache_type() -> str
```

**返回：** `str` - 缓存类型

##### get_ttl

```python
ttl = config.get_ttl() -> int
```

**返回：** `int` - 缓存过期时间

---

### ConfigWatcher

**描述：** 配置监听器

```python
from FQBase.Config import ConfigWatcher

watcher = ConfigWatcher()
watcher.watch('database', callback=lambda: print("配置已变更"))
```

#### 方法

##### watch

```python
watcher.watch(key: str, callback: Callable) -> None
```

**描述：** 监听配置变化

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| key | str | 是 | 配置键名 |
| callback | Callable | 是 | 回调函数 |

---

### ConfigWatcherManager

**描述：** 配置监听管理器

```python
from FQBase.Config import ConfigWatcherManager

manager = ConfigWatcherManager()
manager.add_watcher(watcher)
```

---

## 常量

| 常量 | 类型 | 值 | 描述 |
|------|------|-----|------|
| CacheType | Enum | 'redis', 'mongo' | 缓存类型枚举 |
| FQDATA_PATH | str | - | FQData 目录路径 |
| SETTING_PATH | str | - | 设置文件路径 |
| CACHE_PATH | str | - | 缓存目录路径 |
| LOG_PATH | str | - | 日志目录路径 |
| DOWNLOAD_PATH | str | - | 下载目录路径 |
| STRATEGY_PATH | str | - | 策略目录路径 |
| BIN_PATH | str | - | 二进制文件路径 |

## 异常

| 异常 | 描述 | 触发条件 | 解决方案 |
|------|------|---------|---------|
| ConfigValidationError | 配置验证错误 | 配置值格式或类型不正确 | 检查配置格式 |
| ConnectionError | 数据库连接失败 | MongoDB 服务不可用 | 检查服务状态 |

## 子模块 API 索引

各子模块的详细 API 文档请参考：

| 子模块 | 主要类/函数 | 文档 |
|--------|-------------|------|
| base | get_env, SETTING, DATABASE, CacheConfig, ConfigWatcher | [API](./base/api.md) |
| business | get_datasource_priority, DataSourceConfig, TDXIPListManager | [API](./business/api.md) |

## 相关文档

- [使用指南](./usage.md)
- [开发指南](./development.md)
- [最佳实践](./best-practices.md)
