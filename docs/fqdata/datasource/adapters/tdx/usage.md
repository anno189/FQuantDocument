# TDX 适配器使用指南

## 概述

本文档提供 TDX 适配器的详细使用指南，包括快速入门、常见使用场景和进阶用法。

---

## 快速入门

### 安装依赖

```bash
pip install pytdx
```

### 基本使用

```python
from FQData.DataSource.adapters.tdx import TdxStockAdapter

adapter = TdxStockAdapter()

df = adapter.get_stock_day(
    code='600000',
    start='2024-01-01',
    end='2024-12-31',
    frequence='day'
)

print(f"获取 {len(df)} 条数据")
print(df.head())
```

---

## 股票数据

### 获取股票列表

```python
from FQData.DataSource.adapters.tdx import TdxStockAdapter

adapter = TdxStockAdapter()

# 获取所有 A 股列表
stock_list = adapter.get_stock_list('stock')

# 获取所有 ETF
etf_list = adapter.get_stock_list('etf')

# 获取所有债券
bond_list = adapter.get_stock_list('bond')

# 获取可转债
cb_list = adapter.get_stock_list('bond2')

# 获取北交所股票
bj_list = adapter.get_stock_list('bj')

# 获取退市股票
delist = adapter.get_stock_list('delist')
```

### 获取日线数据

```python
adapter = TdxStockAdapter()

# 日线
daily = adapter.get_stock_day(
    code='600000',
    start='2024-01-01',
    end='2024-12-31',
    frequence='day'
)

# 周线
weekly = adapter.get_stock_day(
    code='600000',
    start='2023-01-01',
    end='2024-12-31',
    frequence='week'
)

# 月线
monthly = adapter.get_stock_day(
    code='600000',
    start='2020-01-01',
    end='2024-12-31',
    frequence='month'
)
```

### 获取分钟数据

```python
adapter = TdxStockAdapter()

# 1 分钟线
min1 = adapter.get_stock_min(
    code='600000',
    start='2024-01-15',
    end='2024-01-16',
    frequence='1min'
)

# 5 分钟线
min5 = adapter.get_stock_min(
    code='600000',
    start='2024-01-01',
    end='2024-01-31',
    frequence='5min'
)

# 15 分钟线
min15 = adapter.get_stock_min(
    code='600000',
    start='2024-01-01',
    end='2024-01-31',
    frequence='15min'
)

# 30 分钟线
min30 = adapter.get_stock_min(
    code='600000',
    start='2024-01-01',
    end='2024-01-31',
    frequence='30min'
)

# 60 分钟线
min60 = adapter.get_stock_min(
    code='600000',
    start='2024-01-01',
    end='2024-01-31',
    frequence='60min'
)
```

### 获取股票基本信息

```python
adapter = TdxStockAdapter()

info = adapter.get_stock_info('600000')
print(info)
```

### 获取除权除息信息

```python
adapter = TdxStockAdapter()

xdxr = adapter.get_stock_xdxr('600000')
print(xdxr)
```

### 获取最新 K 线

```python
adapter = TdxStockAdapter()

# 单只股票
latest = adapter.get_stock_latest('600000')

# 多只股票
latest = adapter.get_stock_latest(['600000', '000001', '000002'])
```

### 获取板块数据

```python
adapter = TdxStockAdapter()

blocks = adapter.get_stock_block()
print(blocks)

# 过滤概念板块
gn_blocks = blocks[blocks['type'] == 'gn']

# 过滤地区板块
zs_blocks = blocks[blocks['type'] == 'zs']

# 过滤行业板块
hy_blocks = blocks[blocks['type'] == 'fg']
```

---

## 指数数据

### 获取指数列表

```python
from FQData.DataSource.adapters.tdx import TdxIndexAdapter

adapter = TdxIndexAdapter()

index_list = adapter.get_index_list()
print(index_list.head())
```

### 获取指数日线

```python
adapter = TdxIndexAdapter()

# 上证指数
daily = adapter.get_index_day(
    code='000001',
    start='2024-01-01',
    end='2024-12-31'
)

# 沪深 300
daily = adapter.get_index_day(
    code='000300',
    start='2024-01-01',
    end='2024-12-31'
)
```

### 获取指数分钟数据

```python
adapter = TdxIndexAdapter()

min_data = adapter.get_index_min(
    code='000001',
    start='2024-01-15',
    end='2024-01-16',
    frequence='5min'
)
```

### 获取 ETF 数据

```python
adapter = TdxIndexAdapter()

# ETF 列表
etf_list = adapter.get_etf_list()

# ETF 日线
etf_daily = adapter.get_index_day(
    code='510300',
    start='2024-01-01',
    end='2024-12-31'
)
```

---

## 期货数据

### 获取期货列表

```python
from FQData.DataSource.adapters.tdx import TdxFutureAdapter

adapter = TdxFutureAdapter()

# 获取所有期货合约
future_list = adapter.get_extensionmarket_list()
print(future_list.head())

# 过滤特定品种
if_list = future_list[future_list['code'].str.startswith('IF')]
```

### 获取期货日线

```python
adapter = TdxFutureAdapter()

# 股指期货
daily = adapter.get_future_day(
    code='IF2401',
    start='2024-01-01',
    end='2024-12-31',
    frequence='day'
)

# 商品期货
daily = adapter.get_future_day(
    code='CU2401',
    start='2024-01-01',
    end='2024-12-31',
    frequence='day'
)
```

### 获取期货分钟数据

```python
adapter = TdxFutureAdapter()

min_data = adapter.get_future_min(
    code='IF2401',
    start='2024-01-15',
    end='2024-01-16',
    frequence='5min'
)
```

### 获取期货实时行情

```python
adapter = TdxFutureAdapter()

realtime = adapter.get_future_realtime('IF2401')
print(realtime)
```

### 获取期货成交分笔

```python
adapter = TdxFutureAdapter()

# 历史分笔
transaction = adapter.get_future_transaction(
    code='IF2401',
    start='2024-01-15',
    end='2024-01-15'
)

# 实时分笔
realtime_tx = adapter.get_future_transaction_realtime('IF2401')
```

---

## 债券数据

### 获取债券日线

```python
from FQData.DataSource.adapters.tdx import TdxBondAdapter

adapter = TdxBondAdapter()

daily = adapter.get_bond_day(
    code='019540',
    start='2024-01-01',
    end='2024-12-31'
)
```

### 获取债券分钟数据

```python
adapter = TdxBondAdapter()

min_data = adapter.get_bond_min(
    code='019540',
    start='2024-01-15',
    end='2024-01-16',
    frequence='5min'
)
```

### 获取可转债数据

```python
adapter = TdxBondAdapter()

# 可转债列表
cb_list = adapter.get_bond2stock_list()

# 可转债转股日线
cb_daily = adapter.get_bond2stock_day(
    code='113009',
    start='2024-01-01',
    end='2024-12-31'
)
```

---

## 实时行情

### 获取多只股票实时行情

```python
from FQData.DataSource.adapters.tdx import TdxRealtimeAdapter

adapter = TdxRealtimeAdapter()

data = adapter.get_realtime(['600000', '000001', '000002'])
print(data)
```

### 获取今日全部行情

```python
from FQData.DataSource.adapters.tdx import get_today_all

data = get_today_all()
print(data.head())
```

---

## 历史成交分笔

### 获取股票历史分笔

```python
from FQData.DataSource.adapters.tdx import TdxTransactionAdapter

adapter = TdxTransactionAdapter()

data = adapter.get_transaction(
    code='600000',
    start='2024-01-15',
    end='2024-01-15'
)
```

### 获取股票实时分笔

```python
adapter = TdxTransactionAdapter()

data = adapter.get_transaction_realtime('600000')
```

---

## IP 选择器

### 手动选择最优 IP

```python
from FQData.DataSource.adapters.tdx import TdxIPSelector

best_ip = TdxIPSelector.select_best_ip()
print(f"股票最优 IP: {best_ip['stock']}")
print(f"期货最优 IP: {best_ip['future']}")
```

### 获取指定类型 IP 列表

```python
# 获取前 5 个最优股票 IP
stock_ips = TdxIPSelector.get_ip_list(type_='stock', n=5)

# 获取前 3 个最优期货 IP
future_ips = TdxIPSelector.get_ip_list(type_='future', n=3)
```

### 测试 IP 响应时间

```python
from datetime import timedelta

delay = TdxIPSelector.ping('1.2.3.4', 7709, 'stock')
print(f"响应时间: {delay.total_seconds():.3f}s")
```

### 重置 IP 缓存

```python
TdxIPSelector.reset()
```

---

## 超时设置

### 设置实例超时

```python
from FQData.DataSource.adapters.tdx import TdxStockAdapter

adapter = TdxStockAdapter(timeout=2.0)
```

### 设置类默认超时

```python
from FQData.DataSource.adapters.tdx import TdxBaseAdapter

TdxBaseAdapter.set_default_timeout(1.0)
```

### 环境变量设置

```bash
export TDX_DEFAULT_TIMEOUT=0.7
```

---

## 错误处理

### 基本错误处理

```python
from FQData.DataSource.adapters.tdx import TdxStockAdapter
from FQData.DataSource.base import (
    DataSourceConnectionError,
    DataNotFoundError,
    DataSourceAPIError
)

adapter = TdxStockAdapter()

try:
    data = adapter.get_stock_day('600000', '2024-01-01', '2024-12-31')
except DataSourceConnectionError as e:
    print(f"连接错误: {e.code}, {e.details}")
except DataNotFoundError as e:
    print(f"数据未找到: {e.code}")
except DataSourceAPIError as e:
    print(f"API 错误: {e.code}")
except Exception as e:
    print(f"其他错误: {e}")
```

### 检查连接状态

```python
from FQData.DataSource.adapters.tdx import TdxStockAdapter

adapter = TdxStockAdapter()

if adapter.is_connected:
    print("已连接")
    data = adapter.get_stock_day('600000', '2024-01-01', '2024-12-31')
else:
    print("未连接")
```

### 健康检查

```python
from FQData.DataSource.adapters.tdx import TdxStockAdapter

adapter = TdxStockAdapter()

if adapter.health_check():
    print("数据源健康")
else:
    print("数据源不可用")
```

---

## 数据处理示例

### 计算收益率

```python
import pandas as pd

df = adapter.get_stock_day('600000', '2024-01-01', '2024-12-31')

df['returns'] = df['close'].pct_change()
df['cum_returns'] = (1 + df['returns']).cumprod()

print(df[['date', 'close', 'returns', 'cum_returns']].tail())
```

### 计算移动平均

```python
df['MA5'] = df['close'].rolling(window=5).mean()
df['MA10'] = df['close'].rolling(window=10).mean()
df['MA20'] = df['close'].rolling(window=20).mean()
```

### 多只股票对比

```python
stocks = ['600000', '600036', '601318']

data_dict = {}
for code in stocks:
    data_dict[code] = adapter.get_stock_day(
        code,
        '2024-01-01',
        '2024-12-31'
    )

for code, df in data_dict.items():
    df['normalized'] = df['close'] / df['close'].iloc[0] * 100
```

### 保存到文件

```python
df = adapter.get_stock_day('600000', '2024-01-01', '2024-12-31')

df.to_csv('600000_daily.csv', index=False)

df.to_excel('600000_daily.xlsx', index=False)
```

---

## 进阶用法

### 连接池管理

```python
from FQData.DataSource.adapters.tdx.connection_pool import get_tdx_pool

pool = get_tdx_pool()

print(f"HQ 连接数: {pool.hq_count}")
print(f"EX 连接数: {pool.ex_count}")

pool.close_all()
```

### 批量获取多只股票

```python
from FQData.DataSource.adapters.tdx import TdxStockAdapter

adapter = TdxStockAdapter()

codes = ['600000', '600036', '601318', '000001', '000002']

results = {}
for code in codes:
    try:
        data = adapter.get_stock_day(code, '2024-01-01', '2024-12-31')
        results[code] = data
    except Exception as e:
        print(f"获取 {code} 失败: {e}")
        results[code] = None
```

### 数据重采样

```python
df = adapter.get_stock_min('600000', '2024-01-01', '2024-01-31', '1min')

df['datetime'] = pd.to_datetime(df['datetime'])
df.set_index('datetime', inplace=True)

df_resampled = df.resample('5min').agg({
    'open': 'first',
    'high': 'max',
    'low': 'min',
    'close': 'last',
    'volume': 'sum'
})
```

---

## 常见问题

### 1. 返回 None 或空 DataFrame

可能原因：
- 股票代码不存在
- 日期范围无交易数据
- 网络连接问题

解决方案：
```python
data = adapter.get_stock_day('600000', '2024-01-01', '2024-12-31')
if data is None or data.empty:
    print("无数据，请检查代码和日期")
```

### 2. 连接超时

可能原因：
- 网络问题
- TDX 服务器繁忙
- IP 被封禁

解决方案：
```python
adapter = TdxStockAdapter(timeout=5.0)
```

### 3. 数据不完整

可能原因：
- 停牌期间无数据
- 刚上市股票数据不全

解决方案：
```python
df = adapter.get_stock_day('600000', '2020-01-01', '2024-12-31')
df = df.dropna()
```

---

## 相关文档

- [TDX README](README.md)
- [TDX 架构说明](architecture.md)
- [TDX 设计文档](design.md)
- [TDX 框架文档](framework.md)
- [TDX API 参考](api.md)
- [TDX 最佳实践](best-practices.md)
- [TDX 开发指南](development.md)
- [TDX FAQ](faq.md)
- [TDX 更新日志](changelog.md)
- [TDX 配置说明](config.md)
- [TDX 连接池与健康检查](connection_pool.md)
