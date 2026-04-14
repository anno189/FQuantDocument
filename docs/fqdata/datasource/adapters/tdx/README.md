# TDX 适配器

通达信数据适配器模块，提供股票、指数、期货、债券、港股、期权等数据的通达信接口。

## 文档索引

| 文档 | 说明 |
|------|------|
| [README](README.md) | 模块总览和快速开始 |
| [框架文档](framework.md) | 框架集成、初始化、生命周期 |
| [架构说明](architecture.md) | 技术架构、核心组件、数据流程 |
| [设计文档](design.md) | 设计决策、模式应用、接口规范 |
| [API 参考](api.md) | 完整 API 文档 |
| [使用指南](usage.md) | 详细使用教程和示例 |
| [最佳实践](best-practices.md) | 性能优化、错误处理、缓存策略 |
| [开发指南](development.md) | 二次开发、扩展指南 |
| [FAQ](faq.md) | 常见问题解答 |
| [更新日志](changelog.md) | 版本历史和变更内容 |
| [配置说明](config.md) | 环境变量和配置文件 |
| [连接池与健康检查](connection_pool.md) | 连接管理、容错机制 |
| [Base API](base.md) | TdxBaseAdapter 详细文档 |
| [Base 开发指南](base_development.md) | TdxBaseAdapter 开发参考 |
| [Base FAQ](base_faq.md) | TdxBaseAdapter 常见问题 |

## 模块结构

```
tdx/
├── __init__.py              # 模块入口
├── base.py                  # 适配器基类
├── stock.py                 # 股票数据适配器
├── index.py                 # 指数数据适配器
├── future.py                # 期货数据适配器
├── bond.py                  # 债券数据适配器
├── hkstock.py              # 港股数据适配器
├── option.py                # 期权数据适配器
├── realtime.py              # 实时行情适配器
├── transaction.py           # 成交明细适配器
├── macro.py                 # 宏观数据适配器
├── exchange.py              # 交易所数据适配器
├── extension.py             # 扩展数据适配器
├── tools.py                 # 工具函数
├── ip_selector.py            # IP 选择器
├── connection_pool.py        # 连接池管理
├── pytdx_patch.py           # pytdx 补丁
├── block.py                 # 板块数据管理器
└── financial.py             # 历史财务数据
```

## 核心适配器

### TdxBaseAdapter

所有 TDX 适配器的基类，提供通用功能：

```python
from FQData.DataSource.adapters.tdx import TdxBaseAdapter

adapter = TdxBaseAdapter()

adapter.is_connected  # 检查连接状态
adapter.health_check()  # 健康检查
TdxBaseAdapter.set_default_timeout(1.0)  # 设置超时
```

### TdxStockAdapter

股票数据适配器。

```python
from FQData.DataSource.adapters.tdx import TdxStockAdapter

adapter = TdxStockAdapter()
```

| 方法 | 说明 |
|------|------|
| `get_stock_list(type_)` | 获取股票列表 |
| `get_stock_day(code, start, end, frequence)` | 获取股票日线/周线/月线 |
| `get_stock_min(code, start, end, frequence)` | 获取股票分钟线 |
| `get_stock_info(code)` | 获取股票基本信息 |
| `get_stock_latest(code, frequence)` | 获取股票最新一根K线 |
| `get_stock_xdxr(code)` | 获取除权除息信息 |
| `get_stock_block()` | 获取股票板块数据 |
| `get_stock_delist()` | 获取退市股票列表 |

### TdxIndexAdapter

指数数据适配器。

```python
from FQData.DataSource.adapters.tdx import TdxIndexAdapter

adapter = TdxIndexAdapter()
```

| 方法 | 说明 |
|------|------|
| `get_index_list()` | 获取指数列表 |
| `get_index_day(code, start, end, frequence)` | 获取指数日线 |
| `get_index_min(code, start, end, frequence)` | 获取指数分钟线 |
| `get_etf_list()` | 获取ETF/LOF基金列表 |
| `get_index_latest(code, frequence)` | 获取指数最新K线 |

### TdxFutureAdapter

期货数据适配器。

```python
from FQData.DataSource.adapters.tdx import TdxFutureAdapter

adapter = TdxFutureAdapter()
```

| 方法 | 说明 |
|------|------|
| `get_extensionmarket_list()` | 获取扩展市场代码列表 |
| `get_future_day(code, start, end, frequence)` | 获取期货日线 |
| `get_future_min(code, start, end, frequence)` | 获取期货分钟线 |
| `get_future_realtime(code)` | 获取期货实时行情 |
| `get_future_transaction(code, start, end)` | 获取期货历史成交分笔 |

### TdxBondAdapter

债券数据适配器。

```python
from FQData.DataSource.adapters.tdx import TdxBondAdapter

adapter = TdxBondAdapter()
```

| 方法 | 说明 |
|------|------|
| `get_bond_list()` | 获取债券列表 |
| `get_bond_day(code, start, end, frequence)` | 获取债券日线 |
| `get_bond_min(code, start, end, frequence)` | 获取债券分钟线 |
| `get_bond2stock_list()` | 获取可转债列表 |
| `get_bond2stock_day(code, start, end, frequence)` | 获取可转债转股日线 |

### TdxIPSelector

IP 选择器（单例模式）。

```python
from FQData.DataSource.adapters.tdx import TdxIPSelector

best_ip = TdxIPSelector.select_best_ip()
print(f"股票最优 IP: {best_ip['stock']}")
print(f"期货最优 IP: {best_ip['future']}")
```

| 方法 | 说明 |
|------|------|
| `select_best_ip()` | 选择最优 IP |
| `get_mainmarket_ip()` | 获取主板市场 IP |
| `get_extensionmarket_ip()` | 获取期货市场 IP |
| `get_ip_list(type_, n)` | 获取排序后的 IP 列表 |
| `reset()` | 重置 IP 缓存 |

### TdxConnectionPool

连接池（单例模式）。

```python
from FQData.DataSource.adapters.tdx.connection_pool import get_tdx_pool

pool = get_tdx_pool()
print(f"HQ 连接数: {pool.hq_count}")
print(f"EX 连接数: {pool.ex_count}")

pool.close_all()  # 关闭所有连接
```

### TdxDataManager

板块数据管理器。

```python
from FQData.DataSource.adapters.tdx import TdxDataManager

manager = TdxDataManager()
manager.download_and_extract()
df = manager.get_industry_block()
```

### 历史财务数据

```python
from FQData.DataSource.adapters.tdx import (
    TdxHistoryFinancialCrawler,
    TdxHistoryFinancialReader,
)

crawler = TdxHistoryFinancialCrawler()
crawler.download_and_parse()

reader = TdxHistoryFinancialReader()
df = reader.get_df('financial_data.zip')
```

## 快速开始

### 安装依赖

```bash
pip install pytdx>=1.88
```

### 获取股票日线

```python
from FQData.DataSource.adapters.tdx import TdxStockAdapter

adapter = TdxStockAdapter()

data = adapter.get_stock_day(
    code='600000',
    start='2024-01-01',
    end='2024-12-31',
    frequence='day'
)

print(f"获取 {len(data)} 条数据")
```

### 获取股票分钟线

```python
data = adapter.get_stock_min(
    code='600000',
    start='2024-01-01',
    end='2024-01-31',
    frequence='5min'
)
```

### 获取指数数据

```python
from FQData.DataSource.adapters.tdx import TdxIndexAdapter

adapter = TdxIndexAdapter()

data = adapter.get_index_day(
    code='000001',
    start='2024-01-01',
    end='2024-12-31'
)
```

### 获取期货数据

```python
from FQData.DataSource.adapters.tdx import TdxFutureAdapter

adapter = TdxFutureAdapter()

data = adapter.get_future_day(
    code='IF2401',
    start='2024-01-01',
    end='2024-12-31'
)
```

### 获取实时行情

```python
from FQData.DataSource.adapters.tdx import TdxRealtimeAdapter

adapter = TdxRealtimeAdapter()

data = adapter.get_realtime(['600000', '000001'])
```

## 频率类型

### 日线频率

| 频率 | category 值 |
|------|-------------|
| 日线 (day) | 9 |
| 周线 (week) | 5 |
| 月线 (month) | 6 |
| 季线 (quarter) | 10 |
| 年线 (year) | 11 |

### 分钟频率

| 频率 | category 值 |
|------|-------------|
| 1分钟 | 8 |
| 5分钟 | 0 |
| 15分钟 | 1 |
| 30分钟 | 2 |
| 60分钟 | 3 |

## 配置

### 超时设置

```python
from FQData.DataSource.adapters.tdx import TdxBaseAdapter

TdxBaseAdapter.set_default_timeout(1.0)
```

### 环境变量

```bash
export TDX_DEFAULT_TIMEOUT=0.7
```

### 配置文件

```ini
[IPLIST]
exclude = [{'ip': '1.2.3.4', 'port': 7709}]
default = {'stock': {'ip': '106.14.201.200', 'port': 7709}, 'future': {'ip': '112.95.244.183', 'port': 7709}}
```

## 错误处理

```python
from FQData.DataSource.adapters.tdx.base import (
    DataSourceConnectionError,
    DataNotFoundError,
    DataSourceAPIError,
)

try:
    data = adapter.get_stock_day('600000', '2024-01-01', '2024-12-31')
except DataSourceConnectionError:
    print("连接失败")
except DataNotFoundError:
    print("数据未找到")
except DataSourceAPIError:
    print("API 调用失败")
```

## 相关文档

- [DataSource 模块](../README.md)
- [DataSource API](../api.md)
- [适配器索引](../adapters/README.md)
