# FQData 模块

金融数据模块，提供数据获取、存储、数据结构等功能。

## 模块结构

```
FQData/
├── DataSource/           # 数据源抽象
│   ├── base.py          # 数据源基类和协议
│   ├── registry.py      # 数据源注册表
│   ├── facade.py        # 数据源统一入口
│   ├── health_check.py  # 健康检查
│   └── adapters/        # 数据源适配器
│       ├── tdx/         # 通达信适配器
│       ├── eastmoney/   # 东方财富适配器
│       └── ...
├── DataStore/           # 存储抽象
│   ├── base.py         # 存储适配器基类
│   ├── facade.py        # 存储统一入口
│   ├── mongodb_adapter.py  # MongoDB 适配器
│   ├── query.py         # 查询函数
│   ├── query_adv.py    # 高级查询函数
│   ├── query_async.py   # 异步查询函数
│   ├── connection_pool.py  # 连接池
│   ├── transaction.py   # 事务管理
│   └── savers/         # 数据持久化
├── DataStruct/         # 数据结构
│   ├── base.py        # 基础数据类
│   ├── stock.py        # 股票数据
│   ├── index.py        # 指数数据
│   ├── future.py       # 期货数据
│   ├── bond.py         # 债券数据
│   └── ...
└── normalizer.py       # 代码规范化
```

## 核心模块

FQData 采用分层架构，核心模块包括：

| 模块 | 说明 | 文档 |
|------|------|------|
| [DataSource](datasource/README.md) | 数据源模块（通达信、东方财富、同花顺等） | [API](datasource/api.md) |
| [DataStore](datastore/README.md) | 存储模块（MongoDB 适配器、Savers） | [API](datastore/api.md) |
| [DataStruct](datastruct/README.md) | 数据结构模块（股票、指数、期货等） | [API](datastruct/api.md) |
| [Pipeline](pipeline/README.md) | 任务调度模块（Celery 定时任务） | [API](pipeline/api.md) |
| [Processors](processors/README.md) | 数据处理模块（盘后/实时处理） | [API](processors/api.md) |

## 快速开始

### 获取数据

```python
from FQData import get_datasource

# 获取数据源
ds = get_datasource()

# 查询股票日线
data = ds.get_stock_day('600000', start='2024-01-01', end='2024-12-31')
```

### 存储数据

```python
from FQData import save_stock_day

# 保存股票日线数据
save_stock_day('600000', data)
```

### 数据查询

```python
from FQData import query_stock_day, query_stock_min

# 查询股票日线
df = query_stock_day('600000', start='2024-01-01', end='2024-12-31')

# 查询股票分钟线
df = query_stock_min('600000', freq='5min', start='2024-01-01')
```

## 数据类型

| 类型 | 说明 | 数据源 |
|------|------|--------|
| 股票 | A股、B股 | TDX |
| 指数 | 上证、深证 | TDX |
| ETF | 交易型开放式指数基金 | TDX |
| 期货 | 商品期货、金融期货 | TDX |
| 债券 | 国债、企业债 | TDX |
| 期权 | 50ETF期权、300ETF期权 | TDX |
| 港股 | 香港股票 | TDX |

## 文档索引

| 文档 | 说明 |
|------|------|
| [README](README.md) | 本文档，模块索引 |
| [DataSource](datasource/README.md) | 数据源模块 |
| [DataStore](datastore/README.md) | 存储模块 |
| [DataStruct](datastruct/README.md) | 数据结构模块 |
| [API](api.md) | 完整API参考 |
| [使用指南](usage.md) | 使用指南与示例 |
| [最佳实践](best-practices.md) | 开发建议与注意事项 |
| [开发指南](development.md) | 开发环境、调试、测试 |
| [FAQ](faq.md) | 常见问题解答 |

## 依赖

FQData 依赖以下 FQBase 模块：

- `FQBase.Foundation` - 单例、重试、生命周期
- `FQBase.Cache` - 缓存接口
- `FQBase.Util` - 工具函数