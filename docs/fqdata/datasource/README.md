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
    │   ├── stock.py     # 股票数据适配器
    │   ├── index.py     # 指数数据适配器
    │   ├── future.py    # 期货数据适配器
    │   ├── bond.py      # 债券数据适配器
    │   ├── hkstock.py   # 港股数据适配器
    │   ├── option.py    # 期权数据适配器
    │   ├── realtime.py  # 实时数据适配器
    │   └── ...
    ├── eastmoney/       # 东方财富适配器
    └── ...
```

## 核心组件

| 组件 | 说明 |
|------|------|
| `DataSource` | 数据源统一入口类 |
| `DataSourceRegistry` | 数据源注册表，单例模式 |
| `DataSourceAdapter` | 数据源适配器基类 |
| `DataSourceHealthCheck` | 数据源健康检查 |
| `TdxStockAdapter` | 通达信股票适配器 |
| `TdxIndexAdapter` | 通达信指数适配器 |
| `TdxFutureAdapter` | 通达信期货适配器 |

## 支持的适配器

### TDX 通达信适配器

```python
from FQData.DataSource import TdxStockAdapter, TdxIndexAdapter, TdxFutureAdapter
```

| 适配器 | 说明 |
|--------|------|
| `TdxBaseAdapter` | 通达信基类适配器 |
| `TdxStockAdapter` | 股票数据适配器 |
| `TdxIndexAdapter` | 指数数据适配器 |
| `TdxFutureAdapter` | 期货数据适配器 |
| `TdxBondAdapter` | 债券数据适配器 |
| `TdxHKStockAdapter` | 港股数据适配器 |
| `TdxOptionAdapter` | 期权数据适配器 |
| `TdxMacroAdapter` | 宏观数据适配器 |
| `TdxExchangeAdapter` | 交易所数据适配器 |
| `TdxRealtimeAdapter` | 实时行情适配器 |
| `TdxTransactionAdapter` | 成交明细适配器 |
| `TdxExtensionAdapter` | 扩展数据适配器 |
| `TdxToolsAdapter` | 工具适配器 |
| `TdxIPSelector` | IP 选择器 |

### AkShare 适配器

```python
from FQData.DataSource import AkShareAdapter
```

| 适配器 | 说明 |
|--------|------|
| `AkShareAdapter` | AkShare 基类适配器 |
| `BondAdapter` | 债券数据适配器 |
| `HKStockAdapter` | 港股数据适配器 |
| `HKFundAdapter` | 港股基金适配器 |
| `HKIndexAdapter` | 港股指数适配器 |
| `USStockAdapter` | 美股数据适配器 |
| `OptionAdapter` | 期权数据适配器 |
| `MacroIndexAdapter` | 宏观指数适配器 |
| `GlobalIndexAdapter` | 全球指数适配器 |
| `GlobalFutureAdapter` | 全球期货适配器 |
| `ExchangeRateAdapter` | 汇率适配器 |
| `CHIBORAdapter` | 银行间拆借利率适配器 |
| `IndexAdapter` | 指数数据适配器 |
| `FutureAdapter` | 期货数据适配器 |

### EFinance 适配器

```python
from FQData.DataSource import EFinanceAdapter
```

## 快速开始

### 基本使用

```python
from FQData.DataSource import get_datasource

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
from FQData.DataSource import get_datasource, DataSourceMode

# 获取数据源
ds = get_datasource()

# 切换到东方财富
ds.set_mode(DataSourceMode.EASTMONEY)

# 获取数据
data = ds.get_stock_day('600000')

# 切换回通达信
ds.set_mode(DataSourceMode.TDX)
```

## 数据类型

### 股票数据

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

# 分钟数据
min_data = adapter.get_security_bars(
    code='600000',
    category=0,  # 1分钟
    start=0,
    count=100
)
```

### 指数数据

```python
from FQData.DataSource import TdxIndexAdapter

adapter = TdxIndexAdapter()

# 获取指数数据
index_data = adapter.get_index_bars(
    code='000001',  # 上证指数
    category=9,
    start=0,
    count=100
)
```

### 期货数据

```python
from FQData.DataSource import TdxFutureAdapter

adapter = TdxFutureAdapter()

# 获取期货日线
future_data = adapter.get_future_daily(
    code='IF2401',
    start='2024-01-01',
    end='2024-12-31'
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

# 检查特定适配器
adapter_health = checker.check_adapter('tdx')
print(f"TDX 适配器: {adapter_health}")
```

## 数据源注册

```python
from FQData.DataSource import DataSourceRegistry, register_source

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
| [API](api.md) | 完整API参考 |
| [使用](usage.md) | 使用指南与示例 |
| [开发指南](development.md) | 开发环境、调试、测试 |
| [最佳实践](best-practices.md) | 开发建议与注意事项 |
| [FAQ](faq.md) | 常见问题解答 |

## 相关文档

- [FQData 模块](../README.md)
- [DataStore 模块](../datastore/README.md)
- [TDX 连接池与健康检查](adapters/tdx/connection_pool.md)