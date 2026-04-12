# DataSource Adapters 模块 - 使用指南

## 概述

本指南介绍如何使用 DataSource Adapters 模块获取各类金融数据。

## 基本使用

### 1. TDX 股票数据

```python
from FQData.DataSource.adapters.tdx import TdxStockAdapter

adapter = TdxStockAdapter()

data = adapter.get_security_bars(
    code='600000',
    category=9,  # 日线
    start=0,
    count=100
)
print(data.head())
```

### 2. TDX 指数数据

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

### 3. TDX 期货数据

```python
from FQData.DataSource.adapters.tdx import TdxFutureAdapter

adapter = TdxFutureAdapter()

data = adapter.get_future_bars(
    code='IF2401',
    category=9,
    start=0,
    count=100
)
```

## 东方财富数据

### 资金流向

```python
from FQData.DataSource.adapters.eastmoney import get_stock_fund_flow

df = get_stock_fund_flow('600000')
print(df.head())
```

### 批量资金流向

```python
from FQData.DataSource.adapters.eastmoney import get_stock_fund_flow_batch

codes = ['600000', '000001', '000002']
dfs = get_stock_fund_flow_batch(codes)
```

### 爬取历史资金流向

```python
from FQData.DataSource.adapters.eastmoney import crawl_eastmoney_fund_flow

count = crawl_eastmoney_fund_flow('2024-01-01', '2024-12-31')
print(f"爬取了 {count} 条数据")
```

## 同花顺数据

### 日线数据

```python
from FQData.DataSource.adapters.ths import get_stock_day

data = get_stock_day('600000', '2024-01-01', '2024-12-31')
print(data.head())
```

### 板块数据

```python
from FQData.DataSource.adapters.ths import get_stock_block

blocks = get_stock_block('600000')
print(blocks)
```

## 交易所数据

### 融资融券

```python
from FQData.DataSource.adapters.exchange import get_margin_all

data = get_margin_all('2024-01-01', '2024-12-31')
print(data.head())
```

### 分市场获取

```python
from FQData.DataSource.adapters.exchange import get_sh_margin, get_sz_margin

sh_data = get_sh_margin('2024-01-15')
sz_data = get_sz_margin('2024-01-15')
```

## 集思录数据

### 可转债列表

```python
from FQData.DataSource.adapters.jisilu import (
    create_browser,
    login,
    get_cbnewlist
)

browser = create_browser()
login(browser, 'username', 'password')
cb_list = get_cbnewlist(browser)
print(cb_list.head())
browser.quit()
```

## 通过 Facade 使用

### 使用统一入口

```python
from FQData import get_datasource

ds = get_datasource()
ds.set_mode('tdx')

data = ds.get_stock_day('600000', '2024-01-01', '2024-12-31')
```

## 错误处理

```python
from FQData.DataSource import (
    DataSourceError,
    DataSourceConnectionError,
    DataNotFoundError,
)

try:
    from FQData.DataSource.adapters.tdx import TdxStockAdapter

    adapter = TdxStockAdapter()
    data = adapter.get_security_bars('600000', 9, 0, 100)
except DataSourceConnectionError as e:
    print(f"连接失败: {e}")
except DataNotFoundError as e:
    print(f"数据不存在: {e}")
except DataSourceError as e:
    print(f"数据源错误: {e}")
```

## 配置

### TDX 连接池配置

```python
from FQData.DataSource.adapters.tdx import TdxConnectionPool

pool = TdxConnectionPool(max_size=10, min_size=2)
```

### AkShare 限速配置

```python
from FQData.DataSource.adapters.akshare import AkShareAdapter

adapter = AkShareAdapter()
adapter.rate_limit = 5  # 5 请求/秒
```

## 相关文档

- [API 参考](./api.md)
- [开发指南](./development.md)
- [最佳实践](./best-practices.md)
