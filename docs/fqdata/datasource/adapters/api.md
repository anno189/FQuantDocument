# DataSource Adapters 模块 - API 参考

## 相关文档

| 类型 | 文档 | 链接 |
|------|------|------|
| 框架集成 | Adapters 框架集成 | [framework](./framework.md) |
| 架构 | Adapters 架构文档 | [architecture](./architecture.md) |
| 设计 | Adapters 设计文档 | [design](./design.md) |
| 使用指南 | Adapters 使用指南 | [usage](./usage.md) |
| 最佳实践 | Adapters 最佳实践 | [best-practices](./best-practices.md) |

---

## TDX 适配器

### TdxStockAdapter

股票数据适配器。

```python
from FQData.DataSource.adapters.tdx import TdxStockAdapter

adapter = TdxStockAdapter()
```

#### get_security_bars

```python
def get_security_bars(
    code: str,
    category: int,
    start: int,
    count: int
) -> pd.DataFrame
```

获取证券bars数据。

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| code | str | 证券代码 |
| category | int | 周期类型 (0-9) |
| start | int | 起始位置 |
| count | int | 获取数量 |

**返回：** DataFrame

---

#### get_security_list

```python
def get_security_list(
    market: int,
    start: int = 0
) -> pd.DataFrame
```

获取证券列表。

---

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

### TdxRealtimeAdapter

实时行情适配器。

```python
from FQData.DataSource.adapters.tdx import TdxRealtimeAdapter

adapter = TdxRealtimeAdapter()
```

### TdxTransactionAdapter

成交明细适配器。

```python
from FQData.DataSource.adapters.tdx import TdxTransactionAdapter

adapter = TdxTransactionAdapter()
```

---

## 东方财富适配器

### get_stock_fund_flow

```python
def get_stock_fund_flow(code: str) -> pd.DataFrame
```

获取个股资金流向。

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| code | str | 股票代码 |

**返回：** DataFrame

**示例：**

```python
from FQData.DataSource.adapters.eastmoney import get_stock_fund_flow

df = get_stock_fund_flow('600000')
```

---

### get_stock_analysis

```python
def get_stock_analysis(code: str) -> pd.DataFrame
```

获取股票分析数据。

---

### crawl_eastmoney_fund_flow

```python
def crawl_eastmoney_fund_flow(
    start_date: str,
    end_date: str
) -> int
```

爬取资金流向数据。

---

## 同花顺适配器

### get_stock_day

```python
def get_stock_day(
    code: str,
    start_date: str,
    end_date: str
) -> pd.DataFrame
```

获取同花顺日线数据。

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| code | str | 股票代码 |
| start_date | str | 开始日期 |
| end_date | str | 结束日期 |

**返回：** DataFrame

---

### get_stock_block

```python
def get_stock_block(code: str) -> pd.DataFrame
```

获取股票所属板块。

---

## 交易所适配器

### get_sh_margin

```python
def get_sh_margin(date: str) -> pd.DataFrame
```

获取上海融资融券数据。

**参数：**
- date: 日期 (YYYY-MM-DD)

**返回：** DataFrame

---

### get_sz_margin

```python
def get_sz_margin(date: str) -> pd.DataFrame
```

获取深圳融资融券数据。

---

### get_margin_all

```python
def get_margin_all(start_date: str, end_date: str) -> pd.DataFrame
```

获取所有融资融券数据。

---

## 集思录适配器

### create_browser

```python
def create_browser() -> webdriver.Chrome
```

创建 Selenium Chrome 浏览器实例。

**返回：** Chrome WebDriver

---

### login

```python
def login(
    browser: webdriver.Chrome,
    username: str,
    password: str
) -> bool
```

登录集思录。

---

### get_cbnewlist

```python
def get_cbnewlist(browser: webdriver.Chrome) -> pd.DataFrame
```

获取可转债列表。

---

## 常量

### 东方财富 URL 常量

| 常量 | 说明 |
|------|------|
| `GUGU_ZIJIN_URL` | 个股资金流向 URL |
| `BANKUAI_ZIJIN_URL` | 板块资金流向 URL |
| `GAINIAN_ZIJIN_URL` | 概念资金流向 URL |
| `BANKKuai_GEGu_ZIJIN_URL` | 主力持股资金 URL |
| `GEGU_LISHI_ZIJIN_URL` | 个股历史资金 URL |
| `FENZHONG_ZIJIN_URL` | 分钟资金 URL |

---

## 相关文档

- [使用指南](./usage.md)
- [开发指南](./development.md)
- [最佳实践](./best-practices.md)
