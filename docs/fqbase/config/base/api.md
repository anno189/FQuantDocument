---
title: Base - API参考
description: Base 基础配置模块 API 参考文档
tag:
  - fqbase
  - config

summary:
  purpose: api-reference
  core_classes:
    - Setting
    - CacheConfig
    - ConfigWatcher
  core_functions:
    - get_env
    - load_env
    - get_cache_config
    - watch_config
---

# Base - API参考

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → [设计原则](./design.md) → **[API参考](./api.md)** → [开发指南](./development.md) → [最佳实践](./best-practices.md) |

## 函数

### get_env

```python
from FQBase.Config.base import get_env

value = get_env(key, default=None)
```

**描述：** 获取环境变量值

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| key | str | 是 | - | 环境变量名称 |
| default | Any | 否 | None | 默认值 |

**返回：** `Any` - 环境变量值

**示例：**

```python
debug = get_env('DEBUG', False)
db_url = get_env('MONGODB_URL', 'mongodb://localhost:27017')
```

---

### load_env

```python
from FQBase.Config.base import load_env

load_env(env_file=None)
```

**描述：** 加载环境变量配置文件

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| env_file | str | 否 | None | 环境变量文件路径 |

**返回：** `None`

---

### reload_env

```python
from FQBase.Config.base import reload_env

reload_env()
```

**描述：** 重新加载环境变量

**返回：** `None`

---

### get_secure_env

```python
from FQBase.Config.base import get_secure_env

value = get_secure_env(key, default=None)
```

**描述：** 获取安全变量（不记录日志）

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| key | str | 是 | - | 安全变量名称 |
| default | Any | 否 | None | 默认值 |

**返回：** `Any` - 安全变量值

---

## 类

### SETTING

**位置：** `FQBase/Config/base/setting.py`

**描述：** MongoDB 连接配置单例类

```python
from FQBase.Config.base import SETTING

mongo_uri = SETTING.get_mongo()
```

#### 方法

##### get_mongo

```python
mongo_uri = SETTING.get_mongo()
```

**返回：** `str` - MongoDB 连接 URI

---

### DATABASE

**位置：** `FQBase/Config/base/setting.py`

**描述：** MongoDB 数据库实例

```python
from FQBase.Config.base import DATABASE

db = DATABASE
```

---

### CacheConfig

**位置：** `FQBase/Config/base/cache_config.py`

**描述：** 缓存配置类

```python
from FQBase.Config.base import CacheConfig

config = CacheConfig()
```

#### 方法

##### get_type

```python
cache_type = config.get_type()
```

**返回：** `CacheType` - 缓存类型

##### get_kwargs

```python
kwargs = config.get_kwargs()
```

**返回：** `dict` - 缓存配置参数

---

### ConfigWatcher

**位置：** `FQBase/Config/base/config_watcher.py`

**描述：** 配置文件监听器类

```python
from FQBase.Config.base import ConfigWatcher

watcher = ConfigWatcher()
```

#### 方法

##### start

```python
watcher.start()
```

**描述：** 启动监听器

##### stop

```python
watcher.stop()
```

**描述：** 停止监听器

---

## 常量

| 常量 | 类型 | 值 | 描述 |
|------|------|-----|------|
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
| ConfigValidationError | 配置验证错误 | 配置值无效 | 检查配置格式 |
| ConnectionError | 连接错误 | 数据库连接失败 | 检查服务状态 |

## 相关文档

- [使用指南](./usage.md)
- [开发指南](./development.md)
- [最佳实践](./best-practices.md)
