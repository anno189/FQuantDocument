# DataSource Adapters 模块

数据适配器模块，按数据源分类提供多种适配器实现。

## 模块结构

```
adapters/
├── tdx/              # 通达信适配器
│   ├── stock.py     # 股票数据
│   ├── index.py     # 指数数据
│   ├── future.py    # 期货数据
│   ├── bond.py      # 债券数据
│   ├── hkstock.py  # 港股数据
│   ├── option.py    # 期权数据
│   ├── realtime.py # 实时行情
│   ├── transaction.py  # 成交明细
│   ├── macro.py    # 宏观数据
│   ├── exchange.py # 交易所数据
│   ├── extension.py  # 扩展数据
│   ├── tools.py    # 工具函数
│   ├── ip_selector.py  # IP 选择器
│   ├── financial.py  # 财务数据
│   └── base.py     # 基类
├── local/            # 本地文件适配器
│   ├── base.py      # 适配器基类
│   └── csv_reader.py  # CSV 读取器
├── akshare/         # AkShare 适配器
│   ├── base.py      # 适配器基类
│   ├── stock.py     # 股票数据
│   ├── index.py     # 指数数据
│   ├── future.py    # 期货数据
│   ├── bond.py      # 债券数据
│   ├── hkstock.py  # 港股数据
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
    └── ...
```

## 适配器类型

### 通达信 (TDX)

通达信是国内主流的证券交易软件数据接口。

```python
from FQData.DataSource.adapters.tdx import (
    TdxStockAdapter,
    TdxIndexAdapter,
    TdxFutureAdapter,
    TdxBondAdapter,
    TdxRealtimeAdapter,
)
```

| 适配器 | 说明 |
|--------|------|
| `TdxStockAdapter` | 股票数据适配器 |
| `TdxIndexAdapter` | 指数数据适配器 |
| `TdxFutureAdapter` | 期货数据适配器 |
| `TdxBondAdapter` | 债券数据适配器 |
| `TdxHKStockAdapter` | 港股数据适配器 |
| `TdxOptionAdapter` | 期权数据适配器 |
| `TdxRealtimeAdapter` | 实时行情适配器 |
| `TdxTransactionAdapter` | 成交明细适配器 |
| `TdxMacroAdapter` | 宏观数据适配器 |
| `TdxExchangeAdapter` | 交易所数据适配器 |

### 本地文件 (Local)

本地文件数据适配器，用于读取本地 CSV 文件。

```python
from FQData.DataSource.adapters.local import (
    LocalAdapter,
    CSVReader,
)

adapter = LocalAdapter(base_path="/data")
df = adapter.read_csv("stock_data.csv")

reader = CSVReader(base_path="/data")
df = reader.read_with_date_parse("daily.csv")
```

| 适配器 | 说明 |
|--------|------|
| `LocalAdapter` | 本地文件适配器基类 |
| `CSVReader` | CSV 文件读取器 |

### AkShare

AkShare 是开源的 Python 金融数据接口库。

```python
from FQData.DataSource.adapters.akshare import (
    AkShareAdapter,
    AkShareStockAdapter,
    AkShareIndexAdapter,
    AkShareFutureAdapter,
    AkShareBondAdapter,
)
```

| 适配器 | 说明 |
|--------|------|
| `AkShareAdapter` | AkShare 适配器基类 |
| `AkShareStockAdapter` | 股票数据适配器 |
| `AkShareIndexAdapter` | 指数数据适配器 |
| `AkShareFutureAdapter` | 期货数据适配器 |
| `AkShareBondAdapter` | 债券数据适配器 |
| `AkShareHKStockAdapter` | 港股数据适配器 |
| `AkShareOptionAdapter` | 期权数据适配器 |
| `AkShareMacroIndexAdapter` | 宏观指数数据适配器 |
| `AkShareUSStockAdapter` | 美股数据适配器 |

### EFinance

EFinance 金融数据接口。

```python
from FQData.DataSource.adapters.efinance import EFinanceAdapter

adapter = EFinanceAdapter()
```

### 东方财富 (EastMoney)

```python
from FQData.DataSource.adapters.eastmoney import (
    get_stock_fund_flow,
    get_stock_analysis,
    crawl_eastmoney_fund_flow,
)
```

| 函数 | 说明 |
|------|------|
| `get_stock_fund_flow` | 获取个股资金流向 |
| `get_stock_analysis` | 获取股票分析数据 |
| `crawl_eastmoney_fund_flow` | 爬取资金流向数据 |

### 同花顺 (THS)

```python
from FQData.DataSource.adapters.ths import (
    get_stock_day,
    get_stock_block,
    get_fund_position_from_ths,
)
```

| 函数 | 说明 |
|------|------|
| `get_stock_day` | 获取同花顺日线数据 |
| `get_stock_block` | 获取板块数据 |
| `get_fund_position_from_ths` | 获取基金持仓 |

### 交易所

```python
from FQData.DataSource.adapters.exchange import (
    get_sh_margin,
    get_sz_margin,
    get_margin_all,
)
```

| 函数 | 说明 |
|------|------|
| `get_sh_margin` | 获取上海融资融券 |
| `get_sz_margin` | 获取深圳融资融券 |
| `get_margin_all` | 获取所有融资融券数据 |

### 集思录

```python
from FQData.DataSource.adapters.jisilu import (
    create_browser,
    login,
    get_cbnewlist,
)
```

| 函数 | 说明 |
|------|------|
| `create_browser` | 创建浏览器实例 |
| `login` | 登录集思录 |
| `get_cbnewlist` | 获取可转债列表 |

## 快速开始

### 使用 TDX 适配器

```python
from FQData.DataSource.adapters.tdx import TdxStockAdapter

adapter = TdxStockAdapter()

data = adapter.get_security_bars(
    code='600000',
    category=9,
    start=0,
    count=100
)
```

### 使用东方财富

```python
from FQData.DataSource.adapters.eastmoney import get_stock_fund_flow

fund_flow = get_stock_fund_flow('600000')
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

### 子适配器文档

| 适配器 | 文档 |
|--------|------|
| 通达信 | [tdx/README](tdx/README.md) |
| 本地文件 | [local/README](local/README.md) |
| AkShare | [akshare/README](akshare/README.md) |
| EFinance | [efinance/README](efinance/README.md) |
| 东方财富 | [eastmoney/README](eastmoney/README.md) |
| 同花顺 | [ths/README](ths/README.md) |
| 交易所 | [exchange/README](exchange/README.md) |
| 集思录 | [jisilu/README](jisilu/README.md) |

## 相关文档

- [DataSource 模块](../README.md)
- [DataSource API](../api.md)
- [DataSource 框架集成](../framework.md)
- [FQData 模块](../../README.md)