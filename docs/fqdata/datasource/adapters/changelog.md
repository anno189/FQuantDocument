# DataSource Adapters 模块 - 更新日志

## v1.0.0 (2026-04-12)

### 新增功能

- 完整的 Adapters 模块文档
- 框架集成文档
- 架构设计文档
- 设计决策文档
- API 参考文档
- 使用指南文档
- 最佳实践文档
- 开发指南文档
- FAQ 文档

### 模块结构

- `TdxBaseAdapter` - TDX 适配器基类
- `TdxStockAdapter` - 股票数据适配器
- `TdxIndexAdapter` - 指数数据适配器
- `TdxFutureAdapter` - 期货数据适配器
- `TdxBondAdapter` - 债券数据适配器
- `TdxRealtimeAdapter` - 实时行情适配器
- `TdxTransactionAdapter` - 成交明细适配器
- `AkShareAdapter` - AkShare 适配器基类
- `EastMoney` - 东方财富适配器（资金流向、股票分析）
- `THS` - 同花顺适配器
- `Exchange` - 交易所适配器（融资融券）
- `Jisilu` - 集思录适配器（可转债）

---

## v0.9.0 (2026-01-15)

### 新增功能

- 添加 TdxConnectionPool 连接池管理
- 添加 TdxIPSelector IP 选择器
- 添加 AkShare 宏观指数适配器
- 添加全球指数和期货适配器

### 改进

- 优化东方财富资金流向爬虫
- 提高 TDX 连接稳定性

---

## v0.8.0 (2025-10-20)

### 新增功能

- 添加 AkShare 适配器系列
- 添加 EFinance 适配器
- 添加东方财富分析数据适配器
- 添加同花顺板块数据适配器

### TDX 适配器更新

- `TdxStockAdapter` - 股票数据
- `TdxIndexAdapter` - 指数数据
- `TdxFutureAdapter` - 期货数据
- `TdxBondAdapter` - 债券数据
- `TdxOptionAdapter` - 期权数据
- `TdxHKStockAdapter` - 港股数据
- `TdxRealtimeAdapter` - 实时行情
- `TdxTransactionAdapter` - 成交明细

---

## v0.7.0 (2025-07-10)

### 新增功能

- 初始版本发布
- TDX 基础适配器
- 集思录可转债适配器

---

## 版本兼容性

| 版本 | Python 版本 | 依赖 |
|------|-------------|------|
| 1.0.0 | >= 3.8 | pytdx>=1.80, akshare>=1.10 |
| 0.9.0 | >= 3.8 | pytdx>=1.80, akshare>=1.10 |
| 0.8.0 | >= 3.7 | pytdx>=1.70 |

## 迁移指南

### 从 v0.8 升级到 v0.9

```python
# v0.8
from FQData.DataSource import TdxFetcher
fetcher = TdxFetcher()
data = fetcher.fetch_stock('600000')

# v0.9
from FQData.DataSource.adapters.tdx import TdxStockAdapter
adapter = TdxStockAdapter()
data = adapter.get_security_bars('600000', 9, 0, 100)
```

### 从 v0.9 升级到 v1.0

```python
# v0.9
adapter = TdxStockAdapter()
data = adapter.get_data('600000')

# v1.0 - 接口更明确
data = adapter.get_security_bars('600000', category=9, start=0, count=100)
```

---

## 未来计划

- [ ] 支持更多国际市场数据适配器
- [ ] 增强 AkShare 适配器覆盖范围
- [ ] 添加异步适配器支持
- [ ] 支持数据订阅推送模式
