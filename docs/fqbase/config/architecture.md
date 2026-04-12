# Config 架构文档

**模块路径**: `FQBase.Config`
**源码**: [FQBase/Config](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Config)

---

## 一、整体架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        应用层代码                                 │
│   from FQBase.Config import get_env, Setting, GLOBALMAP          │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Config 模块                                    │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                    核心配置 (core)                          │ │
│  │   ├── env.py: 环境变量管理                                 │ │
│  │   ├── setting.py: MongoDB 连接、路径配置                   │ │
│  │   ├── cache_config.py: 缓存配置                            │ │
│  │   └── config_watcher.py: 配置监听                         │ │
│  └───────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                    业务配置 (business)                     │ │
│  │   ├── constants.py: 交易常量                              │ │
│  │   ├── datasource_config.py: 数据源配置                     │ │
│  │   ├── financial_mapping.py: 财务指标映射                  │ │
│  │   └── ip_list.py: IP 列表配置                            │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 二、核心配置架构

### 2.1 环境变量加载流程

```
应用启动
    │
    ▼
EnvManager.load_env()
    │
    ▼
┌───────────────────────────────────────────────────────────────┐
│ 1. 检查是否已加载 (_loaded)                                   │
│ 2. 获取 .env 文件路径                                        │
│    - FQ_ENV_PATH 环境变量                                    │
│    - 默认: {FQuant}/.env                                     │
│ 3. 调用 load_dotenv()                                        │
│ 4. 设置 _loaded = True                                       │
└───────────────────────────────────────────────────────────────┘
    │
    ▼
get_env() / get_secure_env() 可用
```

### 2.2 Setting 配置管理

```
Setting.get_config(section, option, default)
    │
    ▼
┌───────────────────────────────────────────────────────────────┐
│ 1. 尝试从 config.ini 读取                                    │
│    - 路径: {FQDATA_PATH}/setting/config.ini                  │
│    - 缓存: 5 秒过期                                           │
└───────────────────────────────────────────────────────────────┘
    │
    ▼
┌───────────────────────────────────────────────────────────────┐
│ 2. 如果读取失败，从 MongoDB 读取                              │
│    - collection: quantaxis.usersetting                       │
└───────────────────────────────────────────────────────────────┘
    │
    ▼
┌───────────────────────────────────────────────────────────────┐
│ 3. 如果都失败，设置默认值                                     │
│    - 更新 config.ini                                          │
│    - 更新 MongoDB                                             │
└───────────────────────────────────────────────────────────────┘
```

### 2.3 GLOBALMAP 路径管理

```
GLOBALMAP (单例)
    │
    ├── FQDATA_PATH      → ~/.fqdata 或 FQUANT_FQDATA_PATH
    ├── SETTING_PATH     → {FQDATA_PATH}/setting
    ├── CACHE_PATH       → {FQDATA_PATH}/cache
    ├── LOG_PATH         → {FQDATA_PATH}/log
    ├── DOWNLOAD_PATH    → {FQDATA_PATH}/downloads
    ├── STRATEGY_PATH    → {FQDATA_PATH}/strategy
    ├── BIN_PATH         → {FQDATA_PATH}/bin
    │
    └── TODAY            → 当前交易日（自动缓存，8:00 更新）
```

---

## 三、缓存配置架构

```
CacheConfig.from_env()
    │
    ▼
┌───────────────────────────────────────────────────────────────┐
│ 从环境变量读取配置                                             │
│                                                               │
│ CACHE_TYPE: memory/redis/mongo                              │
│ CACHE_PREFIX: 键前缀                                         │
│ CACHE_TTL_DEFAULT: 默认过期时间                              │
│                                                               │
│ REDIS_HOST/PORT/DB/PASSWORD                                 │
│ MONGO_HOST/PORT/DATABASE/USERNAME/PASSWORD                   │
└───────────────────────────────────────────────────────────────┘
    │
    ▼
CacheConfig.validate()
    │
    ▼
get_cache_config() → 返回配置实例
```

---

## 四、配置监听架构

```
ConfigWatcher
    │
    ├── 文件状态监控
    │   ├── _last_mtime: 修改时间
    │   └── _last_size: 文件大小
    │
    └── 监听模式
        ├── check_and_reload()  # 手动检查
        └── start_watching()    # 后台线程监控

ConfigWatcherManager
    │
    ├── register()     # 注册监听器
    ├── unregister()   # 注销监听器
    ├── start_all()    # 启动所有
    └── check_all()    # 检查所有
```

---

## 五、业务配置架构

```
business/
│
├── constants.py       # 交易常量
│   ├── ORDER_DIRECTION    # 订单方向
│   ├── TIME_CONDITION    # 时间条件
│   ├── EXCHANGE_ID       # 交易所
│   ├── MARKET_TYPE       # 市场类型
│   └── ...
│
├── datasource_config.py  # 数据源配置
│   ├── DataSourceConfig
│   ├── get_datasource_priority()
│   └── get_health_check_config()
│
├── financial_mapping.py  # 财务指标映射
│   ├── FINANCIAL_INDICATORS
│   └── FINANCIAL_CATEGORIES
│
└── ip_list.py        # IP 列表
    ├── TDX_info_ip_list
    ├── TDX_stock_ip_list
    └── TDX_future_ip_list
```
