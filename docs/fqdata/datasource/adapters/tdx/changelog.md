# TDX 适配器更新日志

## 概述

本文档记录 TDX 适配器的版本历史和变更内容。

---

## 版本格式

```
[版本号] - YYYY-MM-DD
### 新增
### 优化
### 修复
### 变更
```

---

## [v3.2.0] - 2024-12-01

### 新增

- 新增 `TdxHistoryFinancialCrawler` 和 `TdxHistoryFinancialReader` 支持历史财务数据获取
- 新增 `download_financialzip()` 和 `download_financialzip_fromtdx()` 函数
- 新增 `parse_filelist()` 和 `parse_all()` 财务数据解析函数
- 新增 `financialmeans()` 财务指标计算函数

### 优化

- 优化连接池管理，减少连接泄漏
- 优化 IP 选择器缓存机制
- 优化数据分段请求逻辑

### 修复

- 修复部分证券名称编码问题
- 修复期货分钟数据日期过滤问题

---

## [v3.1.0] - 2024-09-15

### 新增

- 新增北交所（BJ）股票支持
- 新增 `get_bond2stock_day()` 和 `get_bond2stock_min()` 可转债转股数据方法
- 新增 `get_bond2stock_list()` 可转债列表方法

### 优化

- 优化除权除息数据解析逻辑
- 优化板块数据获取（概念/地区/行业）

### 修复

- 修复退市股票列表获取问题

---

## [v3.0.0] - 2024-06-01

### 新增

- 引入连接池机制 (`TdxConnectionPool`)
- 引入 IP 选择器 (`TdxIPSelector`)
- 添加健康检查功能 (`health_check()`)
- 添加 `@retry` 装饰器实现自动重试
- 新增期货实时分笔数据获取
- 新增期货历史成交分笔获取

### 优化

- 重构适配器基类架构
- 优化连接复用策略
- 提升并发性能

### 变更

- `get_stock_day()` 等方法现在会在失败时自动重试（最多 3 次）
- 超时默认值从 1.0s 调整为 0.7s

---

## [v2.2.0] - 2024-03-20

### 新增

- 新增港股数据适配器 (`TdxHKStockAdapter`)
- 新增期权数据适配器 (`TdxOptionAdapter`)
- 新增宏观数据适配器 (`TdxMacroAdapter`)
- 新增交易所数据适配器 (`TdxExchangeAdapter`)

### 优化

- 优化板块数据获取功能
- 优化证券列表分类逻辑

---

## [v2.1.0] - 2024-01-15

### 新增

- 新增实时行情适配器 (`TdxRealtimeAdapter`)
- 新增 `get_today_all()` 全市场行情函数
- 新增历史成交分笔适配器 (`TdxTransactionAdapter`)

### 优化

- 优化实时行情数据解析

---

## [v2.0.0] - 2023-11-01

### 新增

- 新增期货数据适配器 (`TdxFutureAdapter`)
- 新增债券数据适配器 (`TdxBondAdapter`)
- 新增扩展数据适配器 (`TdxExtensionAdapter`)
- 新增板块数据管理器 (`TdxDataManager`)

### 优化

- 分离 HQ 和 EX-HQ 连接类型
- 优化多市场数据获取逻辑

### 变更

- 适配器初始化参数调整

---

## [v1.3.0] - 2023-08-10

### 新增

- 新增指数分钟数据获取 (`get_index_min()`)
- 新增 ETF/LOF 数据支持
- 新增 `get_index_latest()` 最新指数 K 线

### 优化

- 优化分钟数据时间戳处理
- 优化 K 线数据精度

---

## [v1.2.0] - 2023-05-22

### 新增

- 新增股票除权除息数据获取 (`get_stock_xdxr()`)
- 新增股票板块数据获取 (`get_stock_block()`)
- 新增退市股票列表获取 (`get_stock_delist()`)

### 优化

- 优化 `get_stock_info()` 返回字段

---

## [v1.1.0] - 2023-03-18

### 新增

- 新增股票基本信息获取 (`get_stock_info()`)
- 新增股票最新 K 线获取 (`get_stock_latest()`)
- 新增指数列表获取 (`get_index_list()`)
- 新增 ETF 列表获取 (`get_etf_list()`)

### 优化

- 优化股票列表分类逻辑

---

## [v1.0.0] - 2023-01-01

### 新增

- 初始版本
- 支持股票日线数据获取
- 支持股票分钟数据获取
- 支持指数日线数据获取
- 支持证券列表获取

---

## 迁移指南

### v3.0 迁移 (v2.x -> v3.0)

**变更点：**

1. 超时默认值变化

```python
# v2.x
adapter = TdxStockAdapter()  # timeout = 1.0s

# v3.0
adapter = TdxStockAdapter()  # timeout = 0.7s
```

2. 方法自动重试

```python
# v2.x - 需要自行处理重试
try:
    data = adapter.get_stock_day(...)
except Exception:
    time.sleep(1)
    data = adapter.get_stock_day(...)

# v3.0 - 自动重试
data = adapter.get_stock_day(...)  # 自动重试 3 次
```

### v2.0 迁移 (v1.x -> v2.0)

**变更点：**

1. 适配器实例化方式

```python
# v1.x
from FQData.DataSource.adapters.tdx import TdxStockAdapter
adapter = TdxStockAdapter(name='stock')

# v2.0
adapter = TdxStockAdapter()  # 无需 name 参数
```

---

## 即将废弃

### 废弃预告

| 功能 | 废弃版本 | 移除版本 | 替代方案 |
|------|----------|----------|----------|
| `TdxToolsAdapter` | v3.2.0 | v4.0.0 | 具体数据适配器 |
| `_fix_security_name_encoding_v2` | v3.2.0 | v4.0.0 | 自动编码处理 |

---

## 相关文档

- [TDX README](README.md)
- [TDX 架构说明](architecture.md)
- [TDX 设计文档](design.md)
- [TDX 框架文档](framework.md)
- [TDX API 参考](api.md)
- [TDX 使用指南](usage.md)
- [TDX 最佳实践](best-practices.md)
- [TDX 开发指南](development.md)
- [TDX FAQ](faq.md)
- [TDX 配置说明](config.md)
- [TDX 连接池与健康检查](connection_pool.md)
