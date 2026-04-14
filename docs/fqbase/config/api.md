---
title: Config - API参考
description: Config 配置中心 API 参考文档
tag:
  - fqbase
  - config

summary:
  purpose: api-reference
  core_classes:
    - EnvManager
    - CacheConfig
    - ConfigWatcher
    - DataSourceConfig
  core_functions:
    - get_env
    - load_env
    - reload_env
    - get_datasource_priority
---

# Config - API参考

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [技术架构](./architecture.md) → **[API参考](./api.md)** → [使用指南](./usage.md) |


## 函数

### get_env

```python
from FQBase.Config import get_env

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
# 获取环境变量
host = get_env('MONGODB_HOST', 'localhost')

# 获取带默认值的配置
port = get_env('MONGODB_PORT', 27017)
```

---

### get_secure_env

```python
from FQBase.Config import get_secure_env

value = get_secure_env(key: str) -> Optional[str]
```

**描述：** 获取敏感环境变量（会检测占位符）

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| key | str | 是 | 环境变量名称 |

**返回：** 环境变量值，如果是占位符则返回 None

**示例：**

```python
# 获取敏感配置
api_key = get_secure_env('API_KEY')
if api_key is None:
    print("警告: API_KEY 未配置或为占位符")
```

---

### load_env

```python
from FQBase.Config import load_env

result = load_env() -> bool
```

**描述：** 加载 .env 文件

**返回：** 是否成功加载

**示例：**

```python
# 加载环境变量
success = load_env()
if success:
    print("环境变量加载成功")
```

---

### reload_env

```python
from FQBase.Config import reload_env

result = reload_env() -> bool
```

**描述：** 重新加载 .env 文件（清除缓存后重新加载）

**返回：** 是否成功重载

**示例：**

```python
# 重新加载环境变量（用于 Celery 等长期运行进程）
reload_env()
```

---

### get_datasource_priority

```python
from FQBase.Config import get_datasource_priority

priority = get_datasource_priority() -> List[str]
```

**描述：** 获取数据源优先级列表

**返回：** 数据源名称列表，按优先级排序

**示例：**

```python
# 获取数据源优先级
priority = get_datasource_priority()
# ['tushare', 'tonghua', 'wy']
```

---

## 类

### EnvManager

**位置：** `FQBase/Config/core/env.py`

**描述：** 环境变量管理器（单例模式）

```python
from FQBase.Config.core.env import EnvManager

manager = EnvManager()
```

#### 方法

##### load_env

```python
manager.load_env() -> bool
```

**描述：** 加载环境变量

##### reload_env

```python
manager.reload_env() -> bool
```

**描述：** 重新加载环境变量

##### get_env

```python
manager.get_env(key: str, default: Any = None) -> Any
```

**描述：** 获取环境变量

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| key | str | 是 | - | 环境变量名称 |
| default | Any | 否 | None | 默认值 |

**返回：** 环境变量值

---

### CacheConfig

**位置：** `FQBase/Config/core/cache_config.py`

**描述：** 缓存配置类

```python
from FQBase.Config import CacheConfig

config = CacheConfig(cache_type: str = "memory", **kwargs)
```

#### 参数

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| cache_type | str | 否 | "memory" | 缓存类型 |

#### 方法

##### get_cache_config

```python
from FQBase.Config import get_cache_config

config = get_cache_config() -> dict
```

**描述：** 获取缓存配置

---

### ConfigWatcher

**位置：** `FQBase/Config/core/config_watcher.py`

**描述：** 配置文件监听器

```python
from FQBase.Config import ConfigWatcher

watcher = ConfigWatcher(config_path: str)
```

#### 方法

##### start

```python
watcher.start()
```

**描述：** 启动监听

##### stop

```python
watcher.stop()
```

**描述：** 停止监听

---

### DataSourceConfig

**位置：** `FQBase/Config/business/datasource_config.py`

**描述：** 数据源配置类

```python
from FQBase.Config import DataSourceConfig

config = DataSourceConfig(name: str, priority: int = 0, **options)
```

---

## 常量

### 交易常量

| 常量 | 类型 | 说明 |
|------|------|------|
| ORDER_DIRECTION | Enum | 订单方向：BUY, SELL |
| TIME_CONDITION | Enum | 时间条件：GFD, IOC, FOK |
| VOLUME_CONDITION | Enum | 成交量条件：ANY, MIN, ALL |
| EXCHANGE_ID | Enum | 交易所：SH, SZ, CFFEX, DCE, CZCE, SHFE |
| OFFSET | Enum | 开平仓：OPEN, CLOSE |
| ORDER_MODEL | Enum | 订单模式：LIMIT, MARKET, STOP |
| ORDER_STATUS | Enum | 订单状态 |
| MARKET_TYPE | Enum | 市场类型：SH, SZ, BJ |

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

## 相关文档

- [使用指南](./usage.md)
- [开发指南](./development.md)
- [最佳实践](./best-practices.md)
