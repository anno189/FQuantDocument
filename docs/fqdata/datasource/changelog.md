# DataSource 模块 - 更新日志

## v1.0.0 (2026-04-12)

### 新增功能

- 完整的 DataSource 模块文档
- 框架集成文档
- 架构设计文档
- 设计决策文档
- API 参考文档
- 使用指南文档
- 最佳实践文档
- 开发指南文档
- FAQ 文档

### 模块结构

- `DataSource` - 统一入口类
- `DataSourceRegistry` - 单例注册表
- `DataSourceAdapter` - 抽象基类
- `DataSourceHealthCheck` - 健康检查
- `AsyncDataSource` - 异步数据获取

### 适配器支持

| 适配器 | 状态 | 说明 |
|--------|------|------|
| TDX 通达信 | ✅ 稳定 | 股票、指数、期货、债券、期权等 |
| AkShare | ✅ 稳定 | 开源金融数据接口 |
| EFinance | ✅ 稳定 | 东方财富数据接口 |
| 东方财富 | ✅ 稳定 | 资金流向、股票分析 |
| 同花顺 | ✅ 稳定 | 日线、板块数据 |
| 交易所 | ✅ 稳定 | 融资融券数据 |
| 集思录 | ✅ 稳定 | 可转债数据 |

### 架构改进

- 协议模式 (Protocol) 替代继承约束
- Facade 模式统一入口
- 回退机制提高可用性
- 延迟加载优化性能

---

## v0.9.0 (2026-01-15)

### 新增功能

- 添加异步数据获取支持 (`AsyncDataSource`)
- 添加连接池管理
- 添加 IP 选择器优化

### 改进

- 优化回退机制
- 改进错误处理
- 提高数据获取稳定性

---

## v0.8.0 (2025-10-20)

### 新增功能

- 支持多数据源动态切换
- 支持健康检查
- 支持自定义适配器注册

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
- 基本数据获取功能
- 通达信适配器

---

## 版本兼容性

| 版本 | Python 版本 | FQBase 版本 |
|------|-------------|-------------|
| 1.0.0 | >= 3.8 | >= 1.0.0 |
| 0.9.0 | >= 3.8 | >= 0.9.0 |
| 0.8.0 | >= 3.7 | >= 0.8.0 |

## 迁移指南

### 从 v0.8 升级到 v0.9

```python
# v0.8
from FQData.DataSource import Fetcher
fetcher = Fetcher()
data = fetcher.fetch('stock', '600000')

# v0.9
from FQData import get_datasource
ds = get_datasource()
data = ds.get_stock_day('600000', start, end)
```

### 从 v0.9 升级到 v1.0

```python
# v0.9
ds = get_datasource()
ds.set_mode(1)  # 使用数字

# v1.0
ds = get_datasource()
ds.set_mode('tdx')  # 推荐使用字符串
# 或
ds.set_mode(DataSourceMode.TDX)  # 或使用枚举
```

---

## 未来计划

- [ ] 支持更多国际市场数据
- [ ] 增强缓存机制
- [ ] 支持数据订阅推送
- [ ] 增加更多技术指标适配器
