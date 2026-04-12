# EastMoney 适配器

东方财富数据适配器模块，提供股票经营分析、资金流向等数据。

## 模块结构

```
eastmoney/
├── __init__.py          # 模块入口
├── analysis.py          # 股票分析
├── fundflow.py          # 资金流向
└── fxs_invest.py        # 投顾数据
```

## 功能

### 股票分析

```python
from FQData.DataSource.adapters.eastmoney import get_stock_analysis

analysis = get_stock_analysis('600000')
```

### 资金流向

```python
from FQData.DataSource.adapters.eastmoney import (
    get_stock_fund_flow,
    get_stock_fund_flow_batch,
    get_fund_flow_all_stocks,
    crawl_eastmoney_fund_flow,
)
```

| 函数 | 说明 |
|------|------|
| `get_stock_fund_flow` | 获取个股资金流向 |
| `get_stock_fund_flow_batch` | 批量获取资金流向 |
| `get_fund_flow_all_stocks` | 获取所有股票资金流向 |
| `crawl_eastmoney_fund_flow` | 爬取东方财富资金流向 |

### 投顾数据

```python
from FQData.DataSource.adapters.eastmoney import get_easymonery_fxs_invest

invest = get_easymonery_fxs_invest()
```

## 常量

| 常量 | 说明 |
|------|------|
| `GUGU_ZIJIN_URL` | 个股资金 URL |
| `BANKUAI_ZIJIN_URL` | 板块资金 URL |
| `GAINIAN_ZIJIN_URL` | 概念资金 URL |
| `BANKKuai_GEGu_ZIJIN_URL` | 板块个股资金 URL |
| `GEGU_LISHI_ZIJIN_URL` | 个股历史资金 URL |
| `FENZHONG_ZIJIN_URL` | 分时资金 URL |

## 快速开始

### 获取个股资金流向

```python
from FQData.DataSource.adapters.eastmoney import get_stock_fund_flow

fund_flow = get_stock_fund_flow('600000')
print(fund_flow.head())
```

### 批量获取资金流向

```python
from FQData.DataSource.adapters.eastmoney import get_stock_fund_flow_batch

codes = ['600000', '000001', '000002']
flows = get_stock_fund_flow_batch(codes)
```

### 获取股票分析

```python
from FQData.DataSource.adapters.eastmoney import get_stock_analysis

analysis = get_stock_analysis('600000')
```

## 相关文档

- [DataSource 模块](../../README.md)
- [适配器索引](../README.md)