---
title: Core - API参考
description: Core 核心配置模块 API 参考文档
tag:
  - fqbase
  - config

summary:
  purpose: api-reference
  core_classes:
    - EnvManager
    - CacheConfig
    - ConfigWatcher
  core_functions:
    - get_env
    - load_env
    - reload_env
---

# Core - API参考

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [技术架构](./architecture.md) → **[API参考](./api.md)** → [使用指南](./usage.md) |


## 函数

### get_env

```python
from FQBase.Config.core import get_env

value = get_env(key: str, default: Any = None) -> Any
```

**描述：** 获取环境变量值

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| key | str | 是 | - | 环境变量名称 |
| default | Any | 否 | None | 默认值 |

**返回：** 环境变量值或默认值

**示例：**

```python
host = get_env('MONGODB_HOST', 'localhost')
```

---

### get_secure_env

```python
from FQBase.Config.core import get_secure_env

value = get_secure_env(key: str) -> Optional[str]
```

**描述：** 获取敏感环境变量（检测占位符）

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| key | str | 是 | 环境变量名称 |

**返回：** 环境变量值或 None

---

### load_env

```python
from FQBase.Config.core import load_env

result = load_env() -> bool
```

**描述：** 加载 .env 文件

**返回：** 是否成功加载

---

### reload_env

```python
from FQBase.Config.core import reload_env

result = reload_env() -> bool
```

**描述：** 重新加载 .env 文件

**返回：** 是否成功重载

---

### get_cache_config

```python
from FQBase.Config.core import get_cache_config

config = get_cache_config() -> dict
```

**描述：** 获取缓存配置

---

### set_cache_config

```python
from FQBase.Config.core import set_cache_config

set_cache_config(cache_type: str, **kwargs)
```

**描述：** 设置缓存配置

---

### get_cache_kwargs

```python
from FQBase.Config.core import get_cache_kwargs

kwargs = get_cache_kwargs() -> dict
```

**描述：** 获取缓存初始化参数

---

## 类

### EnvManager

**位置：** `FQBase/Config/core/env.py`

**描述：** 环境变量管理器（单例模式）

#### 方法

##### load_env

```python
manager.load_env() -> bool
```

##### reload_env

```python
manager.reload_env() -> bool
```

##### get_env

```python
manager.get_env(key: str, default: Any = None) -> Any
```

---

### CacheConfig

**位置：** `FQBase/Config/core/cache_config.py`

**描述：** 缓存配置类

#### 参数

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| cache_type | str | "memory" | 缓存类型 |

---

### ConfigWatcher

**位置：** `FQBase/Config/core/config_watcher.py`

**描述：** 配置文件监听器

#### 方法

##### start

```python
watcher.start()
```

##### stop

```python
watcher.stop()
```

---

## 常量

### 数据库配置

| 常量 | 类型 | 说明 |
|------|------|------|
| SETTING | dict | 主设置配置 |
| DATABASE | dict | 数据库连接配置 |
| DATABASE_ASYNC | dict | 异步数据库配置 |

### 路径配置

| 常量 | 类型 | 说明 |
|------|------|------|
| FQDATA_PATH | str | FQData 目录路径 |
| SETTING_PATH | str | 设置文件路径 |
| CACHE_PATH | str | 缓存目录路径 |
| LOG_PATH | str | 日志目录路径 |
| DOWNLOAD_PATH | str | 下载目录路径 |
| STRATEGY_PATH | str | 策略目录路径 |

### 缓存类型

| 常量 | 说明 |
|------|------|
| CacheType.MEMORY | 内存缓存 |
| CacheType.REDIS | Redis 缓存 |

---

## 相关文档

- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
