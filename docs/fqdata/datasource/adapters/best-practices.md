# DataSource Adapters 模块 - 最佳实践

## 概述

本最佳实践指南帮助开发者高效、稳定地使用 Adapters 模块。

## TDX 适配器最佳实践

### 连接池使用

**推荐做法：**

```python
from FQData.DataSource.adapters.tdx import TdxConnectionPool

pool = TdxConnectionPool(max_size=10, min_size=2)

with pool.acquire() as connector:
    data = adapter.get_security_bars(connector, code, category, start, count)
```

**不推荐做法：**

```python
# 每次请求都创建新连接
for i in range(100):
    adapter = TdxStockAdapter()  # 错误！
    data = adapter.get_security_bars(...)
```

### IP 选择

**推荐做法：**

```python
from FQData.DataSource.adapters.tdx import TdxIPSelector

selector = TdxIPSelector()
best_ips = selector.get_best_ip(count=5)

for ip in best_ips:
    if selector.validate_ip(ip, 7709):
        print(f"Using IP: {ip}")
        break
```

## AkShare 适配器最佳实践

### 限速控制

**推荐做法：**

```python
adapter = AkShareAdapter()
adapter.rate_limit = 5  # 5 请求/秒

for code in codes:
    data = adapter.get_stock_day(code)
    time.sleep(0.2)  # 额外等待
```

**不推荐做法：**

```python
# 无限制请求会被封禁
for code in codes:
    adapter = AkShareAdapter()  # 每次新建
    adapter.get_stock_day(code)  # 快速请求
```

## 东方财富适配器最佳实践

### 批量请求

**推荐做法：**

```python
from FQData.DataSource.adapters.eastmoney import get_stock_fund_flow_batch

codes = ['600000', '000001', '000002', ...]
dfs = get_stock_fund_flow_batch(codes)  # 批量获取
```

**不推荐做法：**

```python
# 逐个请求效率低
for code in codes:
    df = get_stock_fund_flow(code)  # 低效
```

### 缓存结果

```python
from functools import lru_cache
from FQData.DataSource.adapters.eastmoney import get_stock_fund_flow

@lru_cache(maxsize=100)
def cached_fund_flow(code: str) -> pd.DataFrame:
    return get_stock_fund_flow(code)
```

## 集思录适配器最佳实践

### 复用浏览器实例

**推荐做法：**

```python
browser = create_browser()
try:
    login(browser, username, password)
    for i in range(10):
        data = get_cbnewlist(browser)
        # 处理数据
finally:
    browser.quit()  # 确保关闭
```

**不推荐做法：**

```python
# 每次都创建新浏览器
for i in range(10):
    browser = create_browser()  # 资源浪费
    data = get_cbnewlist(browser)
    browser.quit()
```

### 无头模式

```python
def create_browser(headless=True):
    options = webdriver.ChromeOptions()
    if headless:
        options.add_argument('--headless')
    return webdriver.Chrome(options=options)
```

## 错误处理最佳实践

### 重试机制

```python
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def fetch_with_retry(adapter, code):
    return adapter.get_security_bars(code, 9, 0, 100)
```

### 优雅降级

```python
try:
    from FQData.DataSource.adapters.tdx import TdxStockAdapter
    adapter = TdxStockAdapter()
    data = adapter.get_security_bars(...)
except Exception as e:
    logger.warning(f"TDX failed, fallback to AkShare: {e}")
    from FQData.DataSource.adapters.akshare import AkShareAdapter
    adapter = AkShareAdapter()
    data = adapter.get_stock_day(...)
```

## 性能优化

### 1. 并行请求

```python
from concurrent.futures import ThreadPoolExecutor

def fetch_parallel(codes, adapter_class):
    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = [executor.submit(adapter_class().get_stock_day, code) for code in codes]
        return [f.result() for f in futures]
```

### 2. 数据缓存

```python
from functools import lru_cache

@lru_cache(maxsize=1000)
def get_cached_stock_info(code: str):
    return adapter.get_stock_info(code)
```

### 3. 批量操作

```python
# 好：一次性获取多只股票
adapter.get_security_list(market=1, start=0, count=1000)

# 差：循环获取
for i in range(100):
    adapter.get_security_bars(...)
```

## 安全最佳实践

### 凭证管理

```python
# 好：使用环境变量
import os
username = os.environ.get('JISILU_USERNAME')
password = os.environ.get('JISILU_PASSWORD')

# 差：硬编码
username = 'my_username'  # 危险！
password = 'my_password'
```

### 请求验证

```python
def validate_response(response):
    if response.status_code != 200:
        raise DataSourceAPIError(f"HTTP {response.status_code}")
    if not response.json():
        raise DataNotFoundError("Empty response")
    return response.json()
```

## 相关文档

- [API 参考](./api.md)
- [使用指南](./usage.md)
- [开发指南](./development.md)
