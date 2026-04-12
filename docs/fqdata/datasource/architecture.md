# DataSource 模块 - 架构文档

## 概述

DataSource 模块采用适配器模式（Adapter Pattern）设计，提供统一的数据获取接口，支持多数据源动态切换和回退机制。

## 架构图

```
┌─────────────────────────────────────────────────────────────────────┐
│                           DataSource 模块                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                     DataSource (Facade)                       │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │   │
│  │  │ set_mode() │  │ get_data()  │  │ health_check()      │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘  │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │           回退机制 (Fallback Mechanism)             │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                │                                    │
│                                ▼                                    │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                  DataSourceRegistry (Singleton)              │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │   │
│  │  │  register   │  │    get     │  │  unregister │        │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘        │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                │                                    │
└────────────────────────────────┼────────────────────────────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        ▼                        ▼                        ▼
┌───────────────┐    ┌─────────────────────┐    ┌───────────────┐
│   TDX         │    │    AkShare         │    │   EFinance    │
│   Adapters    │    │    Adapters        │    │   Adapters    │
├───────────────┤    ├─────────────────────┤    ├───────────────┤
│ TdxStockAdapter    │ │ AkShareAdapter    │    │ EFinanceAdapter   │
│ TdxIndexAdapter    │ │ BondAdapter       │    │                  │
│ TdxFutureAdapter   │ │ HKStockAdapter    │    │                  │
│ TdxBondAdapter    │ │ IndexAdapter      │    │                  │
│ TdxOptionAdapter   │ │ FutureAdapter     │    │                  │
│ TdxRealtimeAdapter │ │ USStockAdapter   │    │                  │
│ ...               │ │ ...              │    │                  │
└───────────────┘    └─────────────────────┘    └───────────────┘
```

## 核心组件

### 1. DataSource (Facade)

**职责：** 统一入口，对外提供一致的数据获取接口

**关键特性：**
- 自动数据源选择
- 回退机制
- 连接池管理
- 异步支持

**位置：** `FQData/DataSource/facade.py`

### 2. DataSourceRegistry (Singleton)

**职责：** 管理所有注册的适配器

**关键特性：**
- 单例模式
- 动态注册/注销
- 适配器查找

**位置：** `FQData/DataSource/registry.py`

### 3. DataSourceAdapter (Abstract Base)

**职责：** 定义适配器接口规范

**关键特性：**
- 抽象方法定义
- 健康检查接口
- 连接状态管理

**位置：** `FQData/DataSource/base.py`

### 4. 协议类 (Protocols)

**职责：** 运行时类型检查

| 协议 | 用途 |
|------|------|
| `StockDataSource` | 股票数据获取 |
| `FutureDataSource` | 期货数据获取 |
| `IndexDataSource` | 指数数据获取 |
| `RealtimeDataSource` | 实时行情获取 |
| `StockInfoSource` | 股票基本信息 |

**位置：** `FQData/DataSource/base.py`

## 数据流

### 同步数据获取流程

```
用户调用
    │
    ▼
DataSource.get_data()
    │
    ▼
验证参数 (code, start, end, frequence)
    │
    ▼
查找方法映射 (method_map)
    │
    ▼
调用 _fetch_with_fallback()
    │
    ├──► 尝试主数据源
    │       │
    │       ▼
    │    成功 ──► 返回数据
    │       │
    │       ▼
    │    失败 ──► 记录日志，尝试回退源
    │
    ▼
遍历回退源列表
    │
    ▼
全部失败 ──► 返回 None
```

### 异步数据获取流程

```
用户调用
    │
    ▼
AsyncDataSource.get_quotation()
    │
    ▼
获取事件循环 (asyncio.get_event_loop)
    │
    ▼
获取线程池执行器
    │
    ▼
run_in_executor() 提交任务到线程池
    │
    ▼
在线程中执行同步获取
    │
    ▼
返回 asyncio.Future
    │
    ▼
用户 await 结果
```

## 适配器结构

### TDX 适配器继承层次

```
DataSourceAdapter (ABC)
    │
    └── TdxBaseAdapter
            │
            ├── TdxStockAdapter
            ├── TdxIndexAdapter
            ├── TdxFutureAdapter
            ├── TdxBondAdapter
            ├── TdxHKStockAdapter
            ├── TdxOptionAdapter
            ├── TdxMacroAdapter
            ├── TdxExchangeAdapter
            ├── TdxRealtimeAdapter
            ├── TdxTransactionAdapter
            ├── TdxExtensionAdapter
            └── TdxToolsAdapter
```

### AkShare 适配器继承层次

```
AkShareAdapter (ABC)
    │
    ├── BondAdapter
    ├── HKStockAdapter
    ├── HKFundAdapter
    ├── HKIndexAdapter
    ├── USStockAdapter
    ├── OptionAdapter
    ├── MacroIndexAdapter
    ├── GlobalIndexAdapter
    ├── GlobalFutureAdapter
    ├── ExchangeRateAdapter
    ├── CHIBORAdapter
    ├── IndexAdapter
    └── FutureAdapter
```

## 连接管理

### 连接池架构

```
┌─────────────────────────────────────┐
│         TdxConnectionPool           │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐   │
│  │    Connection Manager        │   │
│  │  - max_size: 10            │   │
│  │  - min_size: 2              │   │
│  │  - acquire_timeout: 30s    │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │    IP Selector              │   │
│  │  - get_best_ip()           │   │
│  │  - validate_ip()           │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### IP 选择器

```python
class TdxIPSelector:
    def get_best_ip(self, count: int = 1) -> List[str]:
        """获取最优IP列表"""

    def validate_ip(self, ip: str, port: int) -> bool:
        """验证IP可用性"""
```

## 健康检查架构

```
┌─────────────────────────────────────┐
│      DataSourceHealthCheck          │
├─────────────────────────────────────┤
│  check(name: str) -> HealthStatus  │
│  check_all() -> Dict[str, Status]  │
│  get_healthy_sources() -> List     │
│  get_unhealthy_sources() -> List   │
└─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│          HealthStatus              │
├─────────────────────────────────────┤
│  status: ServiceStatus             │
│  message: str                      │
│  latency_ms: float                 │
│  error_count: int                 │
│  timestamp: float                 │
└─────────────────────────────────────┘
```

## 依赖关系

| 组件 | 依赖 | 说明 |
|------|------|------|
| DataSource | FQBase.Registry | 单例模式 |
| DataSource | FQBase.Logger | 日志记录 |
| TdxBaseAdapter | pytdx | TDX 行情接口 |
| AkShareAdapter | akshare | 开源金融数据 |
| EFinanceAdapter | efinance | 东方财富数据 |
| All Adapters | FQBase.Exceptions | 异常体系 |

## 相关文档

- [框架集成](./framework.md)
- [设计文档](./design.md)
- [API 参考](./api.md)
- [使用指南](./usage.md)
