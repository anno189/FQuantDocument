# DataSource 模块 - 框架集成

## 概述

DataSource 模块是 FQData 框架的核心数据获取组件，提供统一的数据源接口，支持多数据源动态切换和回退机制。

## 框架集成架构

```
┌─────────────────────────────────────────────────────────────┐
│                      FQData 应用层                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │              DataSource Facade                       │   │
│   │  (统一入口，自动路由，负载均衡，回退机制)              │   │
│   └─────────────────────────────────────────────────────┘   │
│                              │                              │
│   ┌──────────────────────────┼──────────────────────────┐   │
│   │                          ▼                          │   │
│   │   ┌─────────────────────────────────────────────┐    │   │
│   │   │         DataSourceRegistry                  │    │   │
│   │   │  (单例注册表，动态适配器管理)                │    │   │
│   │   └─────────────────────────────────────────────┘    │   │
│   │                          │                          │   │
│   └──────────────────────────┼──────────────────────────┘   │
│                              │                              │
└──────────────────────────────┼──────────────────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        ▼                      ▼                      ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│  TDX Adapter  │    │ AkShare      │    │ EFinance      │
│               │    │ Adapter      │    │ Adapter       │
└───────────────┘    └───────────────┘    └───────────────┘
```

## 核心组件

### 1. DataSourceFacade

统一入口类，负责：
- 多数据源自动路由
- 回退机制实现
- 数据格式化处理
- 连接池管理

### 2. DataSourceRegistry

单例注册表，负责：
- 适配器注册/注销
- 动态适配器选择
- 健康状态跟踪

### 3. DataSourceAdapter

抽象基类，定义适配器接口规范。

### 4. 协议类 (Protocols)

运行时协议检查：
- `StockDataSource` - 股票数据协议
- `FutureDataSource` - 期货数据协议
- `IndexDataSource` - 指数数据协议
- `RealtimeDataSource` - 实时数据协议

## 初始化流程

### 1. 默认初始化

```python
from FQData import get_datasource

ds = get_datasource()
```

默认使用 TDX 适配器，自动检测最佳连接。

### 2. 自定义模式初始化

```python
from FQData import get_datasource, DataSourceMode

ds = get_datasource()
ds.set_mode(DataSourceMode.AKSHARE)
```

### 3. 多数据源配置

```python
ds = get_datasource()

ds.set_primary_source('tdx')
ds.add_fallback_source('akshare')
ds.add_fallback_source('efinance')
```

## 生命周期

| 阶段 | 方法 | 说明 |
|------|------|------|
| 初始化 | `__init__` | 创建实例，初始化注册表 |
| 配置 | `set_mode` | 设置数据源模式 |
| 使用 | `get_data`, `get_info` | 数据获取 |
| 监控 | `health_check` | 健康检查 |
| 关闭 | `close` | 释放资源（AsyncDataSource） |

## 配置选项

### 环境变量配置

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `FQDATA_TDX_HOST` | TDX 服务器地址 | 自动选择 |
| `FQDATA_TDX_PORT` | TDX 服务器端口 | 7709 |
| `FQDATA_CACHE_ENABLE` | 是否启用缓存 | true |
| `FQDATA_CACHE_TTL` | 缓存 TTL（秒） | 300 |

### 代码配置

```python
ds = get_datasource()

ds.set_mode('tdx')
ds.set_timeout(30)
ds.set_retry_count(3)
```

## 集成点

### 与 DataStore 集成

```python
from FQData import get_datasource
from FQData.DataStore.savers import save_single_stock_day

ds = get_datasource()

data = ds.get_stock_day('600000', '2024-01-01', '2024-12-31')

save_single_stock_day('600000', start_date='2024-01-01')
```

### 与 Pipeline 集成

```python
from FQData.Pipeline import save_daily

save_daily(source='tdx')
```

### 与 Processors 集成

```python
from FQData.Processors import MarketCollector

collector = MarketCollector(source='tdx')
collector.collect()
```

## 健康检查集成

```python
from FQData.DataSource import DataSourceHealthCheck

checker = DataSourceHealthCheck()

status = checker.check('tdx')

if status.is_healthy:
    print(f"数据源正常，延迟: {status.latency_ms}ms")
else:
    print(f"数据源异常: {status.message}")
```

## 异常处理

```python
from FQData.DataSource import (
    DataSourceError,
    DataSourceConnectionError,
    DataNotFoundError,
    DataSourceAPIError,
)

try:
    data = ds.get_stock_day('600000', '2024-01-01', '2024-12-31')
except DataSourceConnectionError:
    ds.add_fallback_source('akshare')
except DataNotFoundError:
    print("数据未找到")
except DataSourceAPIError as e:
    print(f"API错误: {e}")
```

## 相关文档

- [架构文档](./architecture.md)
- [设计文档](./design.md)
- [API 参考](./api.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
