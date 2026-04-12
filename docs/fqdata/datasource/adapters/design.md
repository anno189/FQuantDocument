# DataSource Adapters 模块 - 设计文档

## 设计原则

| 原则 | 应用 |
|------|------|
| **SOLID 原则** | 适配器单一职责，依赖倒置 |
| **DRY 原则** | 抽象基类避免重复代码 |
| **KISS 原则** | 简单直接的接口设计 |
| **适配器模式** | 统一接口封装不同数据源 |
| **组合模式** | 复杂适配器组合简单组件 |

## 核心设计决策

### 决策 1: 按数据源类型垂直切分适配器

**上下文：** 不同数据源（TDX、AkShare、EFinance）提供的数据类型和能力不同。

**决策：** 每个数据源拥有独立的适配器集合，而非按数据类型水平切分。

**实现：**
```
TDX: TdxStockAdapter, TdxIndexAdapter, TdxFutureAdapter, ...
AkShare: AkShareStockAdapter, AkShareIndexAdapter, AkShareFutureAdapter, ...
EFinance: EFinanceAdapter (综合)
```

**后果：**
- ✅ 优点：同一数据源的功能集中，便于维护
- ✅ 优点：接口一致性好
- ❌ 缺点：切换数据源需要切换多个适配器

---

### 决策 2: 连接池管理长连接适配器

**上下文：** TDX 行情需要保持长连接，高频获取数据。

**决策：** 为 TDX 系列适配器实现连接池管理。

**实现：**
```python
class TdxConnectionPool:
    def __init__(self, max_size=10, min_size=2):
        self._pool = Queue(max_size)
        self._create_connections(min_size)

    def acquire(self):
        return self._pool.get(timeout=30)

    def release(self, conn):
        self._pool.put(conn)
```

**后果：**
- ✅ 优点：复用连接，提高性能
- ✅ 优点：控制连接数量，防止资源耗尽
- ❌ 缺点：增加复杂度

---

### 决策 3: AkShare 适配器使用通用请求基类

**上下文：** AkShare 多个适配器有大量重复的 HTTP 请求逻辑。

**决策：** 抽象出 AkShareAdapter 基类处理通用逻辑。

**实现：**
```python
class AkShareAdapter:
    def __init__(self):
        self.rate_limiter = RateLimiter(10)  # 10 req/s

    def _request(self, method, params):
        self.rate_limiter.wait()
        return requests.get(method, params)
```

**后果：**
- ✅ 优点：代码复用
- ✅ 优点：统一限速策略
- ❌ 缺点：所有适配器绑定相同策略

---

### 决策 4: 东方财富使用独立爬虫函数

**上下文：** 东方财富数据需要通过 Web 爬虫获取，无统一 API。

**决策：** 使用独立函数而非类封装。

**实现：**
```python
def get_stock_fund_flow(code: str) -> pd.DataFrame:
    """获取个股资金流向"""
    url = "https://push2.eastmoney.com/api/qt/stock/fflow/kline/get"
    params = {...}
    return pd.DataFrame(requests.get(url, params).json())
```

**后果：**
- ✅ 优点：简单直接
- ✅ 优点：易于使用
- ❌ 缺点：不利于状态管理

---

### 决策 5: 集思录使用 Selenium 浏览器自动化

**上下文：** 集思录可转债数据需要登录后获取，且页面是动态渲染。

**决策：** 使用 Selenium 浏览器自动化。

**实现：**
```python
def create_browser():
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    return webdriver.Chrome(options=options)

def login(browser, username, password):
    browser.get('https://www.jisilu.cn/login')
    # 填写表单并提交
```

**后果：**
- ✅ 优点：支持动态页面和登录
- ❌ 缺点：速度慢，资源消耗大
- ❌ 缺点：需要 ChromeDriver

---

## 设计模式

### 1. 适配器模式 (Adapter Pattern)

```
┌─────────────────┐         ┌─────────────────┐
│   Target       │         │   Client        │
│   (统一接口)    │◄────────│   (DataSource)  │
└─────────────────┘         └─────────────────┘
         │                            │
         │                            │
         ▼                            ▼
┌─────────────────┐         ┌─────────────────┐
│    Adapter      │────────►│    Adaptee     │
│ (TdxStockAdapter)│        │  (pytdx API)   │
└─────────────────┘         └─────────────────┘
```

### 2. 连接池模式 (Connection Pool)

```
┌─────────────────────────────────────┐
│         TdxConnectionPool              │
├─────────────────────────────────────┤
│  _pool: Queue                        │
│  _max_size: 10                      │
├─────────────────────────────────────┤
│  acquire() -> Connection            │
│  release(conn) -> None              │
│  _create_connections()               │
└─────────────────────────────────────┘
```

### 3. 工厂模式 (Factory Pattern)

```python
class DataSourceRegistry:
    _sources = {}

    @classmethod
    def register(cls, name, adapter_class):
        cls._sources[name] = adapter_class

    @classmethod
    def get(cls, name):
        if name not in cls._sources:
            raise KeyError(f"Unknown source: {name}")
        return cls._sources[name]()
```

## 扩展点

### 1. 添加新的 TDX 适配器

```python
from FQData.DataSource.adapters.tdx import TdxBaseAdapter

class TdxMyDataAdapter(TdxBaseAdapter):
    def get_my_data(self, code, start, end):
        """获取自定义数据"""
        connector = self._get_connector()
        # 调用 connector 的 API
        return data
```

### 2. 添加新的 AkShare 适配器

```python
from FQData.DataSource.adapters.akshare import AkShareAdapter

class MyAkShareAdapter(AkShareAdapter):
    def get_my_data(self):
        url = "https://xxx/api"
        return self._request(url, {})
```

### 3. 自定义东方财富爬虫

```python
from FQData.DataSource.adapters.eastmoney import GUGU_ZIJIN_URL

def get_custom_fund_flow(code: str) -> pd.DataFrame:
    params = {
        'secid': code,
        'fields': 'ff1,ff2,ff3',  # 自定义字段
    }
    response = requests.get(GUGU_ZIJIN_URL, params=params)
    return pd.DataFrame(response.json()['data']['klines'])
```

## 异常设计

| 异常 | 继承 | 触发条件 |
|------|------|----------|
| `DataSourceError` | FQBase.DataSourceException | 数据源错误基类 |
| `DataSourceConnectionError` | DataSourceError | 连接失败 |
| `DataNotFoundError` | DataSourceError | 数据不存在 |
| `DataSourceAPIError` | DataSourceError | API 调用失败 |
| `RateLimitError` | DataSourceError | 限速触发 |
| `AuthenticationError` | DataSourceError | 认证失败 |

## 相关文档

- [框架集成](./framework.md)
- [架构文档](./architecture.md)
- [API 参考](./api.md)
- [最佳实践](./best-practices.md)
