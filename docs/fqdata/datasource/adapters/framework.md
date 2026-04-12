# DataSource Adapters 模块 - 框架集成

## 概述

Adapters 模块是 DataSource 数据源系统的具体实现层，每个适配器对应一个特定的数据源提供方。

## 框架集成架构

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FQData 应用层                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │                    DataSource Facade                        │   │
│   │            (统一入口，自动路由，回退机制)                     │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                                │                                     │
│                                ▼                                     │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │               DataSourceRegistry (Singleton)                  │   │
│   │              (适配器注册与管理)                              │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                                │                                     │
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
│ TdxTransactionAdapter │ │ ...              │    │                  │
└───────────────┘    └─────────────────────┘    └───────────────┘
```

## 适配器继承结构

### TDX 适配器

```
DataSourceAdapter (ABC)
    │
    └── TdxBaseAdapter
            │
            ├── TdxStockAdapter       # 股票日线/分钟线
            ├── TdxIndexAdapter      # 指数日线/分钟线
            ├── TdxFutureAdapter     # 期货日线/分钟线
            ├── TdxBondAdapter       # 债券数据
            ├── TdxHKStockAdapter    # 港股数据
            ├── TdxOptionAdapter     # 期权数据
            ├── TdxMacroAdapter      # 宏观数据
            ├── TdxExchangeAdapter    # 交易所数据
            ├── TdxRealtimeAdapter   # 实时行情
            ├── TdxTransactionAdapter # 成交明细
            ├── TdxExtensionAdapter  # 扩展数据
            └── TdxToolsAdapter      # 工具函数
```

### AkShare 适配器

```
AkShareAdapter (ABC)
    │
    ├── BondAdapter         # 债券
    ├── HKStockAdapter     # 港股
    ├── HKFundAdapter      # 港股基金
    ├── HKIndexAdapter     # 港股指数
    ├── USStockAdapter     # 美股
    ├── OptionAdapter      # 期权
    ├── MacroIndexAdapter  # 宏观指数
    ├── GlobalIndexAdapter # 全球指数
    ├── GlobalFutureAdapter # 全球期货
    ├── ExchangeRateAdapter # 汇率
    ├── CHIBORAdapter      # 银行间拆借利率
    ├── IndexAdapter       # A股指数
    └── FutureAdapter      # A股期货
```

## 初始化流程

### 1. 默认初始化

```python
from FQData.DataSource import get_datasource

ds = get_datasource()
ds.set_mode('tdx')

adapter = ds._get_adapter('stock')
```

### 2. 直接初始化适配器

```python
from FQData.DataSource.adapters.tdx import TdxStockAdapter

adapter = TdxStockAdapter()
data = adapter.get_security_bars(code='600000', category=9, start=0, count=100)
```

### 3. 使用工厂模式

```python
from FQData.DataSource import DataSourceRegistry

registry = DataSourceRegistry()
adapter = registry.get('tdx_stock')
```

## 生命周期

| 阶段 | 方法 | 说明 |
|------|------|------|
| 初始化 | `__init__` | 创建适配器实例 |
| 连接 | `connect` | 建立连接（如需要） |
| 健康检查 | `health_check` | 检查连接状态 |
| 数据获取 | `get_*` | 获取数据 |
| 断开 | `disconnect` | 关闭连接 |

## 适配器配置

### TDX 配置

```yaml
tdx:
  host: auto        # 自动选择最优IP
  port: 7709        # 端口
  timeout: 30      # 超时时间
  pool_size: 10    # 连接池大小
```

### AkShare 配置

```yaml
akshare:
  rate_limit: 10   # 限速（请求/秒）
  retry: 3         # 重试次数
  timeout: 30       # 超时时间
```

## 集成点

### 与 DataSource Facade 集成

```python
class DataSource:
    def get_stock_day(self, code, start, end):
        adapter = self._get_adapter('stock')
        return adapter.get_stock_day(code, start, end)

    def _get_adapter(self, data_type):
        return DataSourceRegistry().get(f'{self._mode}_{data_type}')
```

### 与缓存层集成

```python
class DataSourceAdapter:
    def __init__(self):
        self._cache = None

    def get_data(self, key):
        if self._cache and key in self._cache:
            return self._cache[key]
        data = self._fetch(key)
        if self._cache:
            self._cache[key] = data
        return data
```

### 与健康检查集成

```python
class DataSourceHealthCheck:
    def check(self, name):
        adapter = DataSourceRegistry().get(name)
        return adapter.health_check()
```

## 异常处理

```python
from FQData.DataSource import DataSourceAdapter

class MyAdapter(DataSourceAdapter):
    def get_stock_day(self, code, start, end):
        try:
            return self._fetch_data(code, start, end)
        except ConnectionError as e:
            raise DataSourceConnectionError(f"连接失败: {e}") from e
        except DataNotFoundError as e:
            raise DataNotFoundError(f"数据不存在: {code}") from e
```

## 相关文档

- [架构文档](./architecture.md)
- [设计文档](./design.md)
- [API 参考](./api.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
