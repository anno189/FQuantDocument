# TDX 适配器架构说明

## 概述

TDX 适配器是 FQData 框架中负责对接通达信数据源的模块，提供股票、指数、期货、债券、港股、期权等金融数据的获取能力。本文档详细说明其技术架构和核心设计决策。

---

## 整体架构

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            应用层                                        │
│                    DataStore / DataStruct / API                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         适配器层                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │ TdxStockAdapter │  │ TdxIndexAdapter │  │ TdxFutureAdapter│  │ TdxBondAdapter│ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └────────────┘ │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │TdxHKStockAdapter│ │ TdxOptionAdapter│ │TdxRealtimeAdapter││TdxMacroAdapter│ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └────────────┘ │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                        TdxBaseAdapter                             │  │
│  │  - _hq_connection() / _ex_connection()  连接上下文管理器          │  │
│  │  - _ip_selector  IP 选择器                                        │  │
│  │  - health_check()  健康检查                                        │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         连接池层                                        │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                     TdxConnectionPool (单例)                      │   │
│  │  - HQ 连接池 (_hq_pool)    最大 10 个连接                         │   │
│  │  - EX-HQ 连接池 (_ex_pool)  最大 10 个连接                        │   │
│  │  - 线程安全设计                                                   │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          网络层                                         │
│                    pytdx.hq.TdxHq_API                                  │
│                    pytdx.exhq.TdxExHq_API                               │
│                                                                        │
│                    通达信服务器 (TCP 连接)                                │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 核心组件

### 1. TdxBaseAdapter - 适配器基类

所有 TDX 适配器的父类，负责：

| 职责 | 说明 |
|------|------|
| IP 管理 | 通过 `_ip_selector` 管理服务器 IP 选择 |
| 连接协调 | `_hq_connection()` / `_ex_connection()` 提供连接上下文管理器 |
| 健康检查 | `health_check()` 提供数据源可用性探测 |
| 状态管理 | `_connected` 标志管理连接状态 |

**继承关系：**

```
DataSourceAdapter (抽象基类)
    │
    └── TdxBaseAdapter
            │
            ├── TdxStockAdapter
            ├── TdxIndexAdapter
            ├── TdxFutureAdapter
            ├── TdxBondAdapter
            └── ... (其他具体适配器)
```

### 2. TdxConnectionPool - 连接池

采用**单例模式**管理所有 TDX 连接：

| 组件 | 说明 |
|------|------|
| `_hq_pool` | HQ 连接队列，存储空闲的股票/指数/债券连接 |
| `_ex_pool` | EX-HQ 连接队列，存储空闲的期货/期权连接 |
| `_hq_count` / `_ex_count` | 当前活跃连接数 |
| `_max_connections` | 连接上限，默认 10 |

**连接生命周期：**

```
获取连接
    │
    ▼
┌─────────────────┐
│  池中有空闲连接？  │ ──是──→ 取出连接，返回
└─────────────────┘
         │
         否
         ▼
┌─────────────────┐
│ 连接数 < 上限？   │ ──是──→ 创建新连接，返回
└─────────────────┘
         │
         否
         ▼
    等待或失败
```

### 3. TdxIPSelector - IP 选择器

采用**单例模式**管理服务器 IP：

| 功能 | 说明 |
|------|------|
| `select_best_ip()` | 选择最优 IP（主板 + 期货市场） |
| `get_mainmarket_ip()` | 获取主板市场 IP |
| `get_extensionmarket_ip()` | 获取期货市场 IP |
| `ping()` | 单个 IP 测速 |
| `get_ip_list()` | 获取排序后的 IP 列表 |

**IP 缓存策略：**

- 默认缓存时间：86400 秒（1 天）
- 使用 `ParallelProcess` 并行测速
- 支持配置排除列表和默认 IP

### 4. 具体数据适配器

| 适配器 | 数据类型 | 连接类型 |
|--------|----------|----------|
| `TdxStockAdapter` | 股票列表、日线、分钟线、财务信息 | HQ |
| `TdxIndexAdapter` | 指数、ETF/LOF | HQ |
| `TdxFutureAdapter` | 期货日线、分钟线、成交分笔 | EX-HQ |
| `TdxBondAdapter` | 债券、可转债 | HQ |
| `TdxHKStockAdapter` | 港股数据 | EX-HQ |
| `TdxOptionAdapter` | 期权数据 | EX-HQ |
| `TdxRealtimeAdapter` | 实时行情 | HQ |
| `TdxTransactionAdapter` | 历史成交分笔 | HQ |
| `TdxMacroAdapter` | 宏观数据 | HQ |
| `TdxExtensionAdapter` | 退市股票、扩展市场 | EX-HQ |

---

## 通信协议

TDX 适配器使用两种网络协议：

### HQ 协议（主板市场）

用于：股票、指数、债券、实时行情

```
TdxHq_API.connect(ip, port, time_out)
    │
    ├── get_security_bars()   - K 线数据
    ├── get_security_list()  - 证券列表
    ├── get_finance_info()   - 财务信息
    ├── get_xdxr_info()      - 除权除息
    └── get_instrument_quote() - 行情报价
```

### EX-HQ 协议（扩展市场）

用于：期货、期权、港股、贵金属

```
TdxExHq_API.connect(ip, port, time_out)
    │
    ├── get_instrument_bars()     - 期货 K 线
    ├── get_instrument_count()    - 合约数量
    ├── get_instrument_quote()    - 合约报价
    └── get_history_transaction_data() - 历史分笔
```

---

## 数据流程

### 获取股票日线数据流程

```
用户: adapter.get_stock_day('600000', '2024-01-01', '2024-12-31')
    │
    ▼
TdxStockAdapter.get_stock_day()
    │
    ├── 代码验证 (6 位数字)
    ├── 市场判断 (深圳/上海)
    ├── 计算日期范围
    │
    ▼
with _hq_connection() as api:  ──→ 获取连接
    │
    ├── IP 选择 (TdxIPSelector)
    ├── 从连接池获取 TdxHq_API
    │
    ▼
api.get_security_bars()  ──→ 分段请求 (每段 800 条)
    │
    ▼
数据拼接 + 清洗 + 格式化
    │
    ▼
返回 DataFrame
```

### 分段请求机制

由于单次请求限制为 800 条数据，对于长时间范围采用分段请求：

```python
lens = util_get_trade_gap(start_date, end_date)
data = pd.concat([
    api.to_df(api.get_security_bars(category, market, code, offset, 800))
    for offset in range(0, lens, 800)
], axis=0)
```

---

## 重试机制

### @retry 装饰器

所有数据获取方法都使用 `@retry` 装饰器：

```python
@retry(stop_max_attempt_number=3, wait_random_min=50, wait_random_max=100)
def get_stock_day(self, code, start, end, frequence="day"):
    ...
```

| 参数 | 值 | 说明 |
|------|-----|------|
| `stop_max_attempt_number` | 3 | 最大重试次数 |
| `wait_random_min` | 50ms | 最小等待时间 |
| `wait_random_max` | 100ms | 最大等待时间 |

### 重试流程

```
请求失败
    │
    ▼
第 1 次重试
    │
    ├── 等待 50-100ms
    ├── _ip_selector 重新选择 IP
    │
    ▼
请求失败
    │
    ▼
第 2 次重试
    │
    ├── 等待 50-100ms
    │
    ▼
请求失败
    │
    ▼
第 3 次重试
    │
    ├── 等待 50-100ms
    │
    ▼
请求失败 ──→ 抛出异常
```

---

## 错误处理

### 异常层次

```
DataSourceError (基类)
    │
    ├── DataSourceConnectionError  - 连接错误
    ├── DataNotFoundError          - 数据未找到
    └── DataSourceAPIError         - API 调用错误
```

### 错误代码

| 代码 | 说明 |
|------|------|
| `TDX_NOT_CONNECTED` | TDX 数据源未连接 |
| `TDX_NO_IP` | 无法获取服务器 IP |
| `EMPTY_CODE` | 股票代码为空 |
| `INVALID_CODE` | 股票代码格式错误 |

---

## 线程安全

| 组件 | 线程安全机制 |
|------|-------------|
| `TdxConnectionPool` | `threading.Lock` + `Queue` |
| `TdxIPSelector` | 类变量共享（读），写操作同步 |
| `TdxBaseAdapter` | 每个实例独立连接池客户端 |

---

## 性能优化

### 1. 连接复用

```
请求 1: get_stock_day('600000') → 获取连接 A → 使用 → 归还连接 A
请求 2: get_stock_day('000001') → 获取连接 A（复用）→ 使用 → 归还连接 A
```

### 2. IP 缓存

```
首次请求: 测速所有 IP → 选择最优 → 缓存结果
后续请求: 直接使用缓存的 IP
```

### 3. 数据缓存

部分数据使用 MemoryCache 缓存：

| 数据 | 缓存 key | TTL |
|------|----------|-----|
| 扩展市场列表 | `extension_market_list` | 86400s |
| IP 列表 | `tdx_ip_list_{type}` | 86400s |

---

## 扩展机制

### 新增数据适配器

```python
class TdxNewAdapter(TdxBaseAdapter):
    """新型数据适配器"""

    @retry(stop_max_attempt_number=3, wait_random_min=50, wait_random_max=100)
    def get_new_data(self, code: str) -> pd.DataFrame:
        """获取新类型数据"""
        with self._hq_connection() as api:  # 或 _ex_connection()
            data = api.to_df(api.new_api(...))
            return data
```

### 工具函数

`tools.py` 提供通用工具：

| 函数 | 说明 |
|------|------|
| `get_tdx_freq_params()` | 频率参数转换 |
| `get_market_by_code()` | 代码转市场代码 |
| `fetch_all_security_list()` | 获取全市场证券列表 |
| `filter_security_list()` | 按类型过滤证券 |

---

## 相关文档

- [TDX README](README.md)
- [TDX 框架文档](framework.md)
- [TDX 设计文档](design.md)
- [TDX API 参考](api.md)
- [TDX 使用指南](usage.md)
- [TDX 最佳实践](best-practices.md)
- [TDX 开发指南](development.md)
- [TDX FAQ](faq.md)
- [TDX 更新日志](changelog.md)
- [TDX 配置说明](config.md)
- [TDX 连接池与健康检查](connection_pool.md)
