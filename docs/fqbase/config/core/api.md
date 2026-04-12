# Config/core API 参考

**模块路径**: `FQBase.Config.core`
**源码**: [core/](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Config/core)

---

## 一、环境变量 API

### load_env() -> bool

加载 .env 文件。

**返回值**: 是否加载成功

### reload_env() -> bool

重新加载 .env 文件。

**返回值**: 是否重新加载成功

### get_env(key: str, default=None) -> Any

获取环境变量。

| 参数 | 类型 | 说明 |
|------|------|------|
| `key` | `str` | 环境变量名 |
| `default` | `Any` | 默认值 |

**返回值**: 环境变量值或默认值

### get_secure_env(key: str, default=None) -> Any

安全获取敏感配置（带日志记录）。

| 参数 | 类型 | 说明 |
|------|------|------|
| `key` | `str` | 环境变量名 |
| `default` | `Any` | 默认值 |

---

## 二、Setting API

### Setting 类

MongoDB 连接配置（单例）。

### `Setting.get_mongo() -> str`

获取 MongoDB 连接 URI。

**返回值**: MongoDB URI

### `Setting.get_config(section: str, option: str, default_value: Any) -> Any`

获取配置值。

| 参数 | 类型 | 说明 |
|------|------|------|
| `section` | `str` | 配置节点 |
| `option` | `str` | 配置项 |
| `default_value` | `Any` | 默认值 |

**返回值**: 配置值

### `Setting.set_config(section: str, option: str, default_value: Any) -> None`

设置配置值。

### `Setting.client -> MongoClient`

获取 MongoDB 客户端。

---

## 三、GLOBALMAP API

### GLOBALMAP 类

路径配置（单例）。

### `GLOBALMAP.FQDATA_PATH -> str`

获取 FQData 根目录路径。

**默认值**: `~/.fqdata`

### `GLOBALMAP.SETTING_PATH -> str`

获取设置文件目录路径。

### `GLOBALMAP.CACHE_PATH -> str`

获取缓存目录路径。

### `GLOBALMAP.LOG_PATH -> str`

获取日志目录路径。

### `GLOBALMAP.DOWNLOAD_PATH -> str`

获取下载目录路径。

### `GLOBALMAP.STRATEGY_PATH -> str`

获取策略目录路径。

### `GLOBALMAP.BIN_PATH -> str`

获取二进制文件目录路径。

### `GLOBALMAP.TODAY -> str`

获取当前交易日。

---

## 四、缓存配置 API

### CacheType 枚举

缓存类型。

| 值 | 说明 |
|----|------|
| `MEMORY` | 内存缓存 |
| `REDIS` | Redis 缓存 |
| `MONGO` | MongoDB 缓存 |

### CacheConfig 数据类

缓存配置。

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `cache_type` | `str` | `"memory"` | 缓存类型 |
| `prefix` | `str` | `"fqcache:"` | 键前缀 |
| `ttl_default` | `int` | `3600` | 默认过期时间（秒） |
| `host` | `str` | `None` | Redis/MongoDB 主机 |
| `port` | `int` | `None` | 端口 |
| `db` | `int` | `None` | 数据库编号 |
| `password` | `str` | `None` | 密码 |

### `get_cache_config() -> CacheConfig`

获取缓存配置。

### `set_cache_config(config: CacheConfig) -> None`

设置缓存配置。

### `get_cache_kwargs() -> Dict[str, Any]`

获取缓存适配器参数。

---

## 五、配置监听 API

### ConfigWatcher 类

配置文件监听器。

### `ConfigWatcher(config_path: str, callback: Callable = None)`

构造函数。

| 参数 | 类型 | 说明 |
|------|------|------|
| `config_path` | `str` | 配置文件路径 |
| `callback` | `Callable` | 变化回调函数 |

### `ConfigWatcher.check_and_reload() -> bool`

检查并重新加载配置。

**返回值**: 是否重新加载

### `ConfigWatcher.start_watching(interval: int = 1.0) -> None`

启动后台监听。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `interval` | `float` | `1.0` | 检查间隔（秒） |

### `ConfigWatcher.stop_watching() -> None`

停止监听。

---

### ConfigWatcherManager 类

监听器管理器（单例）。

### `ConfigWatcherManager.register(name: str, config_path: str, callback: Callable = None) -> ConfigWatcher`

注册监听器。

| 参数 | 类型 | 说明 |
|------|------|------|
| `name` | `str` | 监听器名称 |
| `config_path` | `str` | 配置文件路径 |
| `callback` | `Callable` | 回调函数 |

### `ConfigWatcherManager.unregister(name: str) -> None`

注销监听器。

### `ConfigWatcherManager.start_all() -> None`

启动所有监听器。

### `ConfigWatcherManager.check_all() -> bool`

检查所有监听器。

---

### `watch_config(config_path: str, callback: Callable = None, check_interval: float = 1.0) -> ConfigWatcher`

便捷函数：创建并启动配置监听器。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `config_path` | `str` | - | 配置文件路径 |
| `callback` | `Callable` | `None` | 回调函数 |
| `check_interval` | `float` | `1.0` | 检查间隔（秒） |

**返回值**: ConfigWatcher 实例（已启动）