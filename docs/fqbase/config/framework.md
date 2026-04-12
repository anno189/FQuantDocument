# Config 框架文档

**模块路径**: `FQBase.Config`
**源码**: [FQBase/Config](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Config)

---

## 一、模块概述

### 1.1 什么是 Config 模块

Config 是 FQBase 框架的**统一配置中心**，管理所有环境变量、MongoDB 连接、路径配置、缓存配置、交易常量等。

**解决的问题**：
- 配置分散在各处，难以统一管理
- 缺乏配置验证机制
- 配置变更无法自动感知
- 敏感信息（如密码）管理不规范

**核心价值**：
- **分层设计**：核心配置与业务配置分离
- **单例模式**：全局共享配置实例
- **配置验证**：自动验证配置值合法性
- **热更新**：支持配置文件监听和动态重载
- **向后兼容**：保留旧的导入方式

### 1.2 核心配置 (core/)

| 子模块 | 说明 |
|--------|------|
| `env.py` | 环境变量管理，支持 .env 文件加载 |
| `setting.py` | MongoDB 连接配置和路径配置 |
| `cache_config.py` | 缓存配置（内存/Redis/MongoDB） |
| `config_watcher.py` | 配置文件监听器 |

### 1.3 业务配置 (business/)

| 子模块 | 说明 |
|--------|------|
| `constants.py` | 交易常量（订单方向、交易所、订单状态等） |
| `datasource_config.py` | 数据源配置 |
| `financial_mapping.py` | 财务指标映射 |
| `ip_list.py` | IP 列表配置 |

---

## 二、设计原则

### 2.1 分层架构

```
┌─────────────────────────────────────────────────────────────────┐
│                      业务配置 (business)                          │
│   constants.py, datasource_config.py, financial_mapping.py        │
│   - 依赖核心配置                                                 │
│   - 包含特定领域配置                                            │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      核心配置 (core)                              │
│   env.py, setting.py, cache_config.py, config_watcher.py       │
│   - 不依赖业务配置                                              │
│   - 提供通用配置管理                                            │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 单例模式

```python
@singleton
class Setting:
    """MongoDB 连接配置 - 单例"""

@singleton
class GLOBALMAP:
    """路径配置 - 单例"""

@singleton
class EnvManager:
    """环境变量管理 - 单例"""
```

### 2.3 配置验证

```python
@dataclass
class CacheConfig:
    cache_type: str = "memory"

    def _validate(self):
        if self.cache_type not in [e.value for e in CacheType]:
            raise ConfigValidationError(...)
```

### 2.4 热更新机制

```python
class ConfigWatcher:
    def check_and_reload(self):
        if current_mtime > self._last_mtime:
            self._callback()  # 触发重新加载
```

---

## 三、核心组件

### 3.1 EnvManager

```python
class EnvManager:
    def load_env(self) -> bool
    def reload_env(self) -> bool
    def get_env(self, key, default=None) -> Any
    def get_secure_env(self, key, default=None) -> Any
```

### 3.2 Setting

```python
class Setting:
    def get_mongo(self) -> str
    def get_config(self, section, option, default_value) -> Any
    def set_config(self, section, option, default_value) -> None
    @property
    def client(self) -> MongoClient
```

### 3.3 GLOBALMAP

```python
class GLOBALMAP:
    @property
    def FQDATA_PATH(self) -> str

    @property
    def TODAY(self) -> str

    @property
    def LOG_PATH(self) -> str
```

### 3.4 CacheConfig

```python
@dataclass
class CacheConfig:
    cache_type: str = "memory"
    prefix: str = "fqcache:"
    ttl_default: int = 3600

    @classmethod
    def from_env(cls) -> 'CacheConfig'
    def validate(self) -> bool
```

### 3.5 ConfigWatcher

```python
class ConfigWatcher:
    def check_and_reload(self) -> bool
    def start_watching(self) -> None
    def stop_watching(self) -> None

class ConfigWatcherManager:
    def register(self, name, config_path, callback) -> ConfigWatcher
    def start_all(self) -> None
```
