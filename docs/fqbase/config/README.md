# Config 模块文档

**模块路径**: `FQBase.Config`
**源码**: [FQBase/Config](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Config)

---

## 文档索引

### 主文档

| 文档 | 说明 |
|------|------|
| [README.md](README.md) | 模块首页（本文档） |
| [framework.md](framework.md) | 框架概述、设计原则 |
| [architecture.md](architecture.md) | 整体架构 |

### 核心配置 (core/)

| 文档 | 说明 |
|------|------|
| [core/README.md](core/README.md) | core 子模块首页 |
| [core/framework.md](core/framework.md) | 环境变量、Setting、GLOBALMAP |
| [core/api.md](core/api.md) | API 参考 |

### 业务配置 (business/)

| 文档 | 说明 |
|------|------|
| [business/README.md](business/README.md) | business 子模块首页 |
| [business/framework.md](business/framework.md) | 常量、数据源配置 |
| [business/api.md](business/api.md) | API 参考 |

---

## 模块结构

```
FQBase.Config
│
├── core/                          # 核心配置
│   ├── env.py                    # 环境变量管理
│   ├── setting.py                # MongoDB 连接配置、路径配置
│   ├── cache_config.py           # 缓存配置
│   └── config_watcher.py         # 配置监听器
│
└── business/                      # 业务配置
    ├── constants.py              # 交易常量定义
    ├── datasource_config.py       # 数据源配置
    ├── financial_mapping.py       # 财务指标映射
    └── ip_list.py                # IP 列表配置
```

---

## 设计原则

| 原则 | 说明 |
|------|------|
| 核心配置不依赖业务配置 | core 模块独立 |
| 业务配置可以依赖核心配置 | 业务配置依赖核心配置 |
| 公共 API 保持向后兼容 | 旧的导入方式继续支持 |

---

## 快速开始

### 导入核心配置

```python
from FQBase.Config import get_env, GLOBALMAP, Setting

# 获取环境变量
mongo_uri = get_env('MONGODB', 'localhost')

# 获取路径配置
data_path = GLOBALMAP.FQDATA_PATH

# 获取 MongoDB 配置
setting = Setting()
```

### 导入业务配置

```python
from FQBase.Config import MARKET_TYPE, ORDER_DIRECTION

# 使用交易常量
direction = ORDER_DIRECTION.BUY
market = MARKET_TYPE.STOCK
```

### 导入缓存配置

```python
from FQBase.Config.core import CacheConfig, get_cache_config

config = get_cache_config()
print(f"Cache type: {config.cache_type}")
```
