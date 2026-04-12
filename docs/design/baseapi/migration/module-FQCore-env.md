# FQCore.env - 环境变量管理

> 版本: v1.0
> 更新时间: 2026-03-25

---

## 一、模块概述

`FQCore.env` 提供统一的环境变量管理，支持 `.env` 文件加载和敏感信息占位符检测。

---

## 二、函数列表

### 2.1 load_env()

加载 `.env` 文件（仅当未加载时）。

```python
from FQCore.env import load_env

load_env() -> bool
```

**返回值**:
- `True`: 加载成功
- `False`: 文件不存在或加载失败

**示例**:
```python
load_env()  # 从默认路径加载 .env
```

---

### 2.2 reload_env()

重新加载 `.env` 文件，用于 Celery 等长期运行进程动态更新配置。

```python
from FQCore.env import reload_env

reload_env() -> bool
```

**返回值**: 始终返回 `True`

**示例**:
```python
# Celery 任务中动态更新配置
reload_env()
new_redis_host = get_env('REDIS_HOST')
```

---

### 2.3 get_env()

获取环境变量，自动加载 `.env` 文件。

```python
from FQCore.env import get_env

get_env(key: str, default: Any = None) -> Any
```

**参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| `key` | str | 环境变量名 |
| `default` | Any | 默认值（可选） |

**返回值**: 环境变量值或默认值

**示例**:
```python
redis_host = get_env('REDIS_HOST', 'localhost')
redis_port = get_env('REDIS_PORT', '6379')
```

---

### 2.4 get_secure_env()

安全获取敏感配置，自动过滤占位符值。

```python
from FQCore.env import get_secure_env

get_secure_env(key: str, default: Any = None) -> Any
```

**过滤的占位符**:
- `your_*`
- `undefined`
- `none`
- 空字符串

**示例**:
```python
api_key = get_secure_env('WECOM_SECRET', '')  # 过滤占位符
```

---

## 三、使用场景

### 3.1 Celery 动态配置

```python
from FQCore.env import reload_env, get_env

@celery.task
def update_config_task():
    reload_env()
    redis_host = get_env('REDIS_HOST')
    # 使用新配置...
```

### 3.2 模块级加载

```python
# 在模块开头调用
from FQCore.env import load_env
load_env()

# 之后可以安全使用 os.getenv
import os
redis_host = os.getenv('REDIS_HOST')
```

---

## 四、相关文档

- [module-FQBase.md](./module-FQBase.md) - FQBase 模块索引
- [FQConfig](../design/baseapi/module-FQConfig.md) - 配置中心