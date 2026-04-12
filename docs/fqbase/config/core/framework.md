# Config/core 框架文档

**模块路径**: `FQBase.Config.core`
**源码**: [core/](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Config/core)

---

## 一、概述

core 子模块提供基础配置功能，不依赖任何其他模块。

---

## 二、env.py - 环境变量管理

### 2.1 功能

| 功能 | 说明 |
|------|------|
| 加载 .env 文件 | `load_env()` |
| 热重载 | `reload_env()` |
| 读取变量 | `get_env()` |
| 安全读取敏感变量 | `get_secure_env()` |

### 2.2 设计模式

```python
class EnvManager:
    _loaded: bool = False  # 加载状态

    def load_env(self):
        if EnvManager._loaded:
            return True
        # 加载 .env 文件
        load_dotenv()
        EnvManager._loaded = True
```

---

## 三、setting.py - MongoDB 连接配置

### 3.1 Setting 类

```python
@singleton
class Setting:
    """MongoDB 连接配置 - 单例"""

    def get_mongo(self) -> str
    def get_config(self, section, option, default_value) -> Any
    def set_config(self, section, option, default_value) -> None
```

**设计决策**：
- 使用 `@singleton` 装饰器确保全局唯一实例
- 配置读取失败时自动降级到 MongoDB 存储
- 最后降级到默认值，并更新持久化存储

### 3.2 GLOBALMAP 类

```python
@singleton
class GLOBALMAP:
    """路径配置 - 单例"""

    @property
    def FQDATA_PATH(self) -> str

    @property
    def TODAY(self) -> str

    @property
    def LOG_PATH(self) -> str
```

**设计决策**：
- 所有路径基于 `~/.fqdata` 目录
- TODAY 属性自动缓存，8:00 后更新

---

## 四、cache_config.py - 缓存配置

### 4.1 CacheType 枚举

```python
class CacheType(Enum):
    MEMORY = 'memory'    # 内存缓存
    REDIS = 'redis'     # Redis 缓存
    MONGO = 'mongo'     # MongoDB 缓存
```

### 4.2 CacheConfig 数据类

```python
@dataclass
class CacheConfig:
    cache_type: str = 'memory'
    prefix: str = 'fqcache:'
    ttl_default: int = 3600

    @classmethod
    def from_env(cls) -> 'CacheConfig'
    def validate(self) -> bool
```

**设计决策**：
- 使用 `@dataclass` 简化数据类
- `from_env()` 类方法从环境变量读取配置
- `validate()` 方法验证配置合法性

---

## 五、config_watcher.py - 配置监听

### 5.1 ConfigWatcher 类

```python
class ConfigWatcher:
    """配置文件监听器"""

    def check_and_reload(self) -> bool
    def start_watching(self) -> None
    def stop_watching(self) -> None
```

**设计决策**：
- 支持手动检查和后台线程监控两种模式
- 基于文件修改时间判断是否需要重载
- 支持配置变化回调

### 5.2 ConfigWatcherManager 类

```python
@singleton
class ConfigWatcherManager:
    """配置监听器管理器"""

    def register(self, name, config_path, callback) -> ConfigWatcher
    def unregister(self, name) -> None
    def start_all(self) -> None
```

---

## 六、依赖关系

```
env.py           # 无依赖
    ↓
setting.py       # 依赖 env.py
    ↓
cache_config.py   # 依赖 env.py
    ↓
config_watcher.py # 依赖其他模块
```
