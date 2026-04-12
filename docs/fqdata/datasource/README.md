# DataSource 模块

数据源抽象模块，提供统一的数据源接口，支持多数据源动态切换。

## 模块结构

```
DataSource/
├── base.py              # 数据源基类和协议
├── registry.py          # 数据源注册表
├── facade.py            # 数据源统一入口
├── health_check.py      # 健康检查
└── adapters/            # 数据源适配器
    ├── tdx/             # 通达信适配器
    │   ├── base.py          # 基类
    │   ├── stock.py         # 股票数据
    │   ├── index.py         # 指数数据
    │   ├── future.py        # 期货数据
    │   ├── bond.py          # 债券数据
    │   ├── hkstock.py      # 港股数据
    │   ├── option.py        # 期权数据
    │   ├── macro.py         # 宏观数据
    │   ├── exchange.py      # 交易所数据
    │   ├── extension.py     # 扩展数据
    │   ├── realtime.py      # 实时行情
    │   ├── transaction.py   # 成交明细
    │   ├── tools.py         # 工具函数
    │   ├── financial.py     # 财务数据
    │   ├── block.py         # 板块数据
    │   ├── company.py       # 公司数据
    │   ├── connection_pool.py  # 连接池
    │   ├── executor.py       # 执行器
    │   └── ip_selector.py   # IP 选择器
    ├── akshare/         # AkShare 适配器
    │   ├── base.py      # 适配器基类
    │   ├── stock.py     # 股票数据
    │   ├── index.py     # 指数数据
    │   ├── future.py    # 期货数据
    │   ├── bond.py      # 债券数据
    │   ├── hkstock.py   # 港股数据
    │   ├── option.py    # 期权数据
    │   ├── macroindex.py # 宏观指数
    │   └── usstock.py   # 美股数据
    ├── efinance/        # EFinance 适配器
    │   └── base.py      # 适配器基类
    ├── eastmoney/       # 东方财富适配器
    │   ├── analysis.py  # 股票分析
    │   ├── fundflow.py # 资金流向
    │   └── fxs_invest.py  # 投顾数据
    ├── ths/            # 同花顺适配器
    │   ├── stock_day.py  # 日线数据
    │   ├── block.py    # 板块数据
    │   └── fund_position.py  # 持仓数据
    ├── exchange/       # 交易所适配器
    │   └── margin.py   # 融资融券
    └── jisilu/         # 集思录适配器
```

## 导入

### 基类和协议

```python
from FQData.DataSource import (
    DataSourceAdapter,
    DataSourceError,
    DataSourceConnectionError,
    DataNotFoundError,
    DataSourceAPIError,
    MarketType,
    FrequenceType,
    StockDataSource,
    FutureDataSource,
    IndexDataSource,
    RealtimeDataSource,
    StockInfoSource,
    supports_stock,
    supports_future,
    supports_index,
    supports_realtime,
)
```

### 注册表

```python
from FQData.DataSource import (
    DataSourceRegistry,
    register_source,
)
```

### 主入口

```python
from FQData.DataSource import (
    DataSource,
    get_datasource,
    get_async_datasource,
    AsyncDataSource,
    DataSourceMode,
)
```

### 健康检查

```python
from FQData.DataSource import (
    DataSourceHealthCheck,
    HealthStatus,
)
```

### TDX 适配器

```python
from FQData.DataSource import (
    TdxBaseAdapter,
    TdxStockAdapter,
    TdxIndexAdapter,
    TdxFutureAdapter,
    TdxBondAdapter,
    TdxHKStockAdapter,
    TdxOptionAdapter,
    TdxMacroAdapter,
    TdxExchangeAdapter,
    TdxRealtimeAdapter,
    TdxTransactionAdapter,
    TdxExtensionAdapter,
    TdxToolsAdapter,
    TdxIPSelector,
)
```

### AkShare 适配器

```python
from FQData.DataSource import (
    AkShareAdapter,
    BondAdapter,
    HKStockAdapter,
    HKFundAdapter,
    HKIndexAdapter,
    USStockAdapter,
    OptionAdapter,
    MacroIndexAdapter,
    GlobalIndexAdapter,
    GlobalFutureAdapter,
    ExchangeRateAdapter,
    CHIBORAdapter,
    IndexAdapter,
    FutureAdapter,
)
```

### EFinance 适配器

```python
from FQData.DataSource import (
    EFinanceAdapter,
)
```

## 核心组件

| 组件 | 说明 |
|------|------|
| `DataSourceAdapter` | 数据源适配器基类 |
| `DataSourceRegistry` | 数据源注册表，单例模式 |
| `DataSource` | 数据源统一入口类 |
| `DataSourceHealthCheck` | 数据源健康检查 |
| `DataSourceMode` | 数据源模式枚举 |
| `AsyncDataSource` | 异步数据源入口 |

## 异常类

| 异常 | 说明 |
|------|------|
| `DataSourceError` | 数据源错误基类 |
| `DataSourceConnectionError` | 连接错误 |
| `DataNotFoundError` | 数据未找到错误 |
| `DataSourceAPIError` | API 调用错误 |

## 快速开始

### 基本使用

```python
from FQData import get_datasource

# 获取数据源实例
ds = get_datasource()

# 设置数据源模式
ds.set_mode('tdx')  # 或 'eastmoney'

# 获取股票日线数据
data = ds.get_stock_day(
    code='600000',
    start='2024-01-01',
    end='2024-12-31'
)
```

### 多数据源切换

```python
from FQData import get_datasource, DataSourceMode

# 获取数据源
ds = get_datasource()

# 切换到东方财富
ds.set_mode(DataSourceMode.EASTMONEY)

# 获取数据
data = ds.get_stock_day('600000')

# 切换回通达信
ds.set_mode(DataSourceMode.TDX)
```

### 直接使用适配器

```python
from FQData.DataSource import TdxStockAdapter

adapter = TdxStockAdapter()

# 日线数据
daily_data = adapter.get_security_bars(
    code='600000',
    category=9,  # 日线
    start=0,
    count=100
)
```

## 健康检查

```python
from FQData.DataSource import DataSourceHealthCheck, HealthStatus

# 创建健康检查器
checker = DataSourceHealthCheck()

# 检查数据源状态
status = checker.check()

print(f"状态: {status.status}")
print(f"消息: {status.message}")
print(f"详情: {status.details}")
```

## 数据源注册

```python
from FQData.DataSource import DataSourceRegistry, register_source, DataSourceAdapter

# 创建自定义适配器
class MyAdapter(DataSourceAdapter):
    def get_stock_day(self, code, start, end):
        # 自定义实现
        return data

# 注册数据源
register_source('my_adapter', MyAdapter)

# 使用注册的数据源
ds = get_datasource()
ds.set_mode('my_adapter')
```

## 文档索引

| 文档 | 说明 |
|------|------|
| [README](README.md) | 本文档，模块索引 |
| [框架集成](framework.md) | 框架集成与生命周期 |
| [架构文档](architecture.md) | 系统架构与技术架构 |
| [设计文档](design.md) | 设计原则与决策 |
| [API](api.md) | 完整API参考 |
| [使用指南](usage.md) | 使用指南与示例 |
| [开发指南](development.md) | 开发环境、调试、测试 |
| [最佳实践](best-practices.md) | 开发建议与注意事项 |
| [FAQ](faq.md) | 常见问题解答 |
| [更新日志](changelog.md) | 版本历史与迁移指南 |
| [Adapters](adapters/README.md) | 适配器模块索引 |

## 相关文档

- [FQData 模块](../README.md)
- [DataStore 模块](../datastore/README.md)
- [TDX 连接池与健康检查](adapters/tdx/connection_pool.md)
