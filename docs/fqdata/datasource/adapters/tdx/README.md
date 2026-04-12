# TDX 适配器

通达信数据适配器模块，提供股票、指数、期货、债券、港股、期权等数据的通达信接口。

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

### TdxFutureAdapter

期货数据适配器。

```python
from FQData.DataSource.adapters.tdx import TdxFutureAdapter

adapter = TdxFutureAdapter()
```

### TdxBondAdapter

债券数据适配器。

```python
from FQData.DataSource.adapters.tdx import TdxBondAdapter

adapter = TdxBondAdapter()
```

### TdxHKStockAdapter

港股数据适配器。

```python
from FQData.DataSource.adapters.tdx import TdxHKStockAdapter

adapter = TdxHKStockAdapter()
```

### TdxOptionAdapter

期权数据适配器。

```python
from FQData.DataSource.adapters.tdx import TdxOptionAdapter

adapter = TdxOptionAdapter()
```

### TdxRealtimeAdapter

实时行情适配器。

```python
from FQData.DataSource.adapters.tdx import TdxRealtimeAdapter, get_today_all

adapter = TdxRealtimeAdapter()
data = get_today_all()
```

### TdxTransactionAdapter

成交明细适配器。

```python
from FQData.DataSource.adapters.tdx import TdxTransactionAdapter

adapter = TdxTransactionAdapter()
```

### TdxExtensionAdapter

扩展数据适配器。

```python
from FQData.DataSource.adapters.tdx import TdxExtensionAdapter

adapter = TdxExtensionAdapter()
```

### TdxMacroAdapter

宏观数据适配器。

```python
from FQData.DataSource.adapters.tdx import TdxMacroAdapter

adapter = TdxMacroAdapter()
```

### TdxDataManager

板块数据管理器，提供板块数据的下载、解析功能。

```python
from FQData.DataSource.adapters.tdx import TdxDataManager

manager = TdxDataManager()
manager.download_and_extract()  # 下载并解压缩
manager.move_readable_files()  # 移动可读取文件
df = manager.get_industry_block()  # 获取行业板块
df = manager.get_block_data()  # 获取板块数据
```

| 方法 | 说明 |
|------|------|
| `download_and_extract()` | 下载并解压板块数据文件 |
| `move_readable_files()` | 移动可读取文件到 BASEDATAPATH |
| `get_industry_block()` | 获取行业板块数据 |
| `get_block_data()` | 获取板块数据文件内容 |
| `get_stock_info()` | 获取股票基本信息 |

### 历史财务数据

提供历史财务数据的下载和解析功能。

```python
from FQData.DataSource.adapters.tdx import (
    TdxHistoryFinancialCrawler,
    TdxHistoryFinancialReader,
    download_financialzip,
    parse_filelist,
)

# 爬取财务数据
crawler = TdxHistoryFinancialCrawler()
crawler.download_and_parse()

# 读取财务数据
reader = TdxHistoryFinancialReader()
df = reader.get_df('financial_data.zip')
```

| 函数 | 说明 |
|------|------|
| `TdxHistoryFinancialCrawler` | 历史财务数据爬虫类 |
| `TdxHistoryFinancialReader` | 历史财务数据读取器类 |
| `download_financialzip()` | 下载财务数据包 |
| `download_financialzip_fromtdx()` | 从通达信下载财务数据 |
| `parse_filelist()` | 解析文件列表 |
| `parse_all()` | 解析所有文件 |
| `financialmeans()` | 财务指标计算 |

## 快速开始

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

data = adapter.get_index_bars(
    code='000001',
    category=9,
    start=0,
    count=100
)
```

### 获取期货数据

```python
from FQData.DataSource.adapters.tdx import TdxFutureAdapter

adapter = TdxFutureAdapter()

data = adapter.get_future_daily(
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

## IP 选择器

TdxIPSelector 自动选择最优服务器 IP：

```python
from FQData.DataSource.adapters.tdx import TdxIPSelector

selector = TdxIPSelector()
ip, port = selector.select_best_ip()
```

## 相关文档

- [DataSource 模块](../README.md)
- [DataSource API](../api.md)
- [适配器索引](../adapters/README.md)
- [TDX 连接池与健康检查](connection_pool.md)