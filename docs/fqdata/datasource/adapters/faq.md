# DataSource Adapters 模块 - FAQ

## 常见问题

### TDX 适配器

#### Q: TDX 连接超时怎么办？

**A:** 尝试以下解决方案：

1. 更换 TDX 服务器 IP
```python
from FQData.DataSource.adapters.tdx import TdxIPSelector

selector = TdxIPSelector()
new_ips = selector.get_best_ip(count=10)

# 测试新 IP
for ip in new_ips:
    if selector.validate_ip(ip, 7709):
        print(f"Found valid IP: {ip}")
        break
```

2. 增加超时时间
```python
adapter = TdxStockAdapter(timeout=60)  # 60秒超时
```

3. 检查网络连接
```bash
ping 106.14.95.148  # TDX 服务器
```

---

#### Q: 如何获取所有股票列表？

**A:** 使用 `get_security_list` 方法：

```python
from FQData.DataSource.adapters.tdx import TdxStockAdapter

adapter = TdxStockAdapter()

# 获取上海主板股票
sh_list = adapter.get_security_list(market=1, start=0)

# 获取深圳主板股票
sz_list = adapter.get_security_list(market=0, start=0)
```

---

#### Q: 连接池已满怎么办？

**A:** 可以增加连接池大小或确保连接正确释放：

```python
from FQData.DataSource.adapters.tdx import TdxConnectionPool

pool = TdxConnectionPool(max_size=20, min_size=5)

# 使用上下文管理器确保释放
with pool.acquire() as conn:
    data = adapter.do_something(conn)
# 连接自动释放回池中
```

---

### AkShare 适配器

#### Q: 请求被限速怎么办？

**A:** 降低请求频率：

```python
adapter = AkShareAdapter()
adapter.rate_limit = 2  # 降低到 2 请求/秒

for code in codes:
    data = adapter.get_stock_day(code)
    time.sleep(0.6)  # 额外等待
```

---

#### Q: 如何获取宏观数据？

**A:** 使用 `MacroIndexAdapter`：

```python
from FQData.DataSource.adapters.akshare import MacroIndexAdapter

adapter = MacroIndexAdapter()
data = adapter.get_macro_index('CPI')  # CPI 数据
```

---

### 东方财富适配器

#### Q: 资金流向数据为空？

**A:** 检查股票代码是否正确：

```python
from FQData.DataSource.adapters.eastmoney import get_stock_fund_flow

# 使用正确的6位代码
df = get_stock_fund_flow('600000')  # 不要加市场前缀
```

---

#### Q: 如何批量获取资金流向？

**A:** 使用批量接口：

```python
from FQData.DataSource.adapters.eastmoney import get_stock_fund_flow_batch

codes = ['600000', '000001', '000002']
dfs = get_stock_fund_flow_batch(codes)
```

---

### 同花顺适配器

#### Q: 如何获取历史日线数据？

**A:** 使用 `get_stock_day` 并指定日期范围：

```python
from FQData.DataSource.adapters.ths import get_stock_day

data = get_stock_day('600000', '2023-01-01', '2024-12-31')
```

---

### 交易所适配器

#### Q: 融资融券数据更新时间是？

**A:** 融资融券数据通常在交易日 16:00 后更新。

```python
from FQData.DataSource.adapters.exchange import get_margin_all

# 获取最近一个月的融资融券数据
data = get_margin_all('2024-01-01', '2024-01-31')
```

---

### 集思录适配器

#### Q: Selenium 报错 ChromeDriver 找不到？

**A:** 安装 ChromeDriver：

```bash
# macOS
brew install chromedriver

# 或指定路径
browser = create_browser(chromedriver_path='/usr/local/bin/chromedriver')
```

---

#### Q: 登录失败怎么办？

**A:** 检查凭证或使用 cookie 登录：

```python
from FQData.DataSource.adapters.jisilu import create_browser, login

browser = create_browser()
success = login(browser, 'username', 'password')

if not success:
    print("登录失败，请检查用户名密码")
```

---

## 故障排查

### 连接问题

| 症状 | 可能原因 | 解决方案 |
|------|----------|----------|
| 连接超时 | 网络问题/服务器宕机 | 检查网络，更换IP |
| 连接被拒绝 | 端口被封 | 使用代理或更换IP |
| 认证失败 | 凭证错误 | 检查用户名密码 |

### 数据问题

| 症状 | 可能原因 | 解决方案 |
|------|----------|----------|
| 数据为空 | 代码错误/日期错误 | 检查参数 |
| 数据缺失 | 接口限制 | 尝试其他数据源 |
| 数据延迟 | 行情延迟 | 等待数据更新 |

### 性能问题

| 症状 | 可能原因 | 解决方案 |
|------|----------|----------|
| 请求慢 | 网络延迟 | 使用代理 |
| 限速触发 | 请求过快 | 降低频率 |
| 内存占用高 | 连接未释放 | 使用上下文管理器 |

---

## 相关文档

- [API 参考](./api.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
