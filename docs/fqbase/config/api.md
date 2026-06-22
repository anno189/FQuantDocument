---
title: Config - API参考
description: Config API 参考文档
tag:
  - fquant
  - fqbase
  - config

summary:
  purpose: api-reference
  core_classes:
    - Setting
    - GlobalMap
    - EnvManager
    - CacheConfig
    - ConfigWatcher
  core_functions:
    - load_env
    - reload_env
    - get_env
    - get_secure_env
    - get_database
    - get_cache_config
    - set_cache_config
    - watch_config
---

# Config - API参考

## 阅读路径

🔵 **开发者**：README → api → usage → concepts → examples

## 类

### Setting

**位置：** `Config/setting.py#L36`

**描述：** MongoDB 连接配置类（单例模式）

```python
from FQBase.Config import SETTING

uri = SETTING.get_mongo()
```

#### 方法

##### get_mongo

```python
uri = SETTING.get_mongo()
```

**返回：** `str` - MongoDB 连接 URI

##### get_config

```python
value = SETTING.get_config(section="MONGODB", option="uri", default_value="mongodb://localhost:27017")
```

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| section | str | 否 | MONGODB | 配置节 |
| option | str | 否 | uri | 配置项 |
| default_value | Any | 否 | mongodb://localhost:27017 | 默认值 |

##### set_config

```python
SETTING.set_config(section="MONGODB", option="uri", default_value="mongodb://localhost:27017")
```

##### close_client

```python
SETTING.close_client()
```

**描述：** 安全关闭 MongoDB 客户端

##### change

```python
SETTING.change(ip="newhost", port=27017)
```

**描述：** 动态更改 MongoDB 连接

#### 属性

##### client

```python
client = SETTING.client
```

**返回：** `Optional[MongoClient]` - MongoDB 客户端实例

---

### GlobalMap

**位置：** `Config/setting.py#L218`

**描述：** 路径配置类（单例模式）

```python
from FQBase.Config import GLOBALMAP

data_path = GLOBALMAP.FQDATA_PATH
```

#### 属性

| 属性 | 返回类型 | 描述 |
|------|---------|------|
| FQDATA_PATH | str | 数据目录路径 |
| SETTING_PATH | str | 配置目录路径 |
| CACHE_PATH | str | 缓存目录路径 |
| LOG_PATH | str | 日志目录路径 |
| DOWNLOAD_PATH | str | 下载目录路径 |
| STRATEGY_PATH | str | 策略目录路径 |
| BIN_PATH | str | 二进制目录路径 |
| ROOTPATH | str | 根目录路径 |
| TEMPLATEPATH | str | 模板目录路径 |
| INDEXPATH | str | 索引目录路径 |

---

### CacheConfig

**位置：** `Config/cache_config.py#L42`

**描述：** 缓存配置类

```python
from FQBase.Config import CacheConfig, get_cache_config

config = get_cache_config()
print(config.cache_type)
```

#### 属性

| 属性 | 类型 | 描述 |
|------|------|------|
| cache_type | str | 缓存类型：memory/redis/mongo |
| ttl_default | int | 默认 TTL（秒） |

---

### ConfigWatcher

**位置：** `Config/config_watcher.py#L33`

**描述：** 配置文件监听器

```python
from FQBase.Config import ConfigWatcher

watcher = ConfigWatcher()
watcher.watch_file("config.ini")
```

---

### ConfigWatcherManager

**位置：** `Config/config_watcher.py#L163`

**描述：** 配置监听管理器

```python
from FQBase.Config import ConfigWatcherManager

manager = ConfigWatcherManager()
manager.add_watcher(watcher)
```

---

## 函数

### load_env

**位置：** `Config/env.py#L39`

```python
from FQBase.Config import load_env

load_env()
```

**描述：** 加载 .env 文件中的环境变量

---

### reload_env

**位置：** `Config/env.py#L48`

```python
from FQBase.Config import reload_env

reload_env()
```

**描述：** 重新加载环境变量

---

### get_env

**位置：** `Config/env.py#L69`

```python
from FQBase.Config import get_env

value = get_env("KEY", default="default")
```

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| key | str | 是 | - | 环境变量名 |
| default | Any | 否 | None | 默认值 |

**返回：** `Any` - 环境变量值或默认值

---

### get_secure_env

**位置：** `Config/env.py#L105`

```python
from FQBase.Config import get_secure_env

value = get_secure_env("API_KEY")
```

**描述：** 安全获取敏感配置（过滤占位符）

---

### get_database

**位置：** `Config/setting.py#L181`

```python
from FQBase.Config import get_database

db = get_database()
```

**描述：** 懒加载获取数据库实例

---

### get_cache_config

**位置：** `Config/cache_config.py#L213`

```python
from FQBase.Config import get_cache_config

config = get_cache_config()
```

**描述：** 获取当前缓存配置

---

### set_cache_config

**位置：** `Config/cache_config.py#L228`

```python
from FQBase.Config import set_cache_config, CacheConfig

config = CacheConfig(cache_type="redis")
set_cache_config(config)
```

**描述：** 设置缓存配置

---

### watch_config

**位置：** `Config/config_watcher.py#L249`

```python
from FQBase.Config import watch_config

watcher = watch_config(["MONGODB_URI", "REDIS_HOST"])
```

**描述：** 创建配置监听器

---

## 常量

| 常量 | 类型 | 描述 |
|------|------|------|
| DEFAULT_DB_URI | str | 默认 MongoDB URI |
| DATABASE | Any | 数据库单例实例 |
| DATABASE_ASYNC | Any | 异步数据库实例 |
| GLOBALMAP | GlobalMap | 路径配置单例 |
| SETTING | Setting | MongoDB 配置单例 |

---

## 相关文档

- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
- [配置指南](./configuration.md)
