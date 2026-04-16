---
title: DataStruct - 数据结构模块
description: FQuant 行情数据核心数据结构模块，提供统一的数据操作接口
tag:
  - fqdata
  - datastruct
  - core

# AI 结构化摘要
summary:
  type: data-processing
  complexity: high
  maturity: stable
  size: xl
  core_classes:
    - QuotationDataStructBase
    - StockDayData
    - StockMinData
    - IndexDayData
    - FutureDayData
  key_functions:
    - select_code
    - select_time
    - to_df
    - resample
  api_coverage:
    total: 60
    covered: 55
    public: 50
    private: 10
  features:
    has_async: false
    has_config: false
    has_security: false
    has_logging: true
    is_thread_safe: true
  usage_scenarios:
    - "场景1：获取股票日线数据并进行技术指标计算"
    - "场景2：获取期货分钟数据并进行周期转换"
    - "场景3：多数据源合并与筛选"
  warnings:
    - "警告1：Mixin 类不能直接实例化"
    - "警告2：@lru_cache 在 property 上使用会导致序列化后缓存失效"
  limitations:
    - "限制1：仅支持 A 股、期货、债券等国内金融市场"
    - "限制2：不支持实时数据推送，仅支持批量查询"

# 模块关系
relationships:
  belongs_to:
    - fquant.fqdata
  depends_on:
    - fquant.fqbase
    - pandas
    - numpy
  used_by:
    - fquant.fqdata.datasource
    - fquant.fqdata.datastore

# API 摘要
api:
  signatures:
    QuotationDataStructBase:
      __init__: "(self, data: pd.DataFrame, dtype: str = None, if_fq: str = 'qfq', market_type: str = None, frequence: str = None)"
      select_code: "(self, code: str) -> 'QuotationDataStructBase'"
      select_time: "(self, start_date: str, end_date: str) -> 'QuotationDataStructBase'"
      to_df: "(self) -> pd.DataFrame"
  exceptions:
    - name: ValueError
      when: "代码或时间筛选无效"
      solution: "检查代码格式和时间范围"
    - name: KeyError
      when: "列名不存在"
      solution: "检查数据列名"
  best_practices:
    - "使用 Mixin 组合获取数据类功能"
    - "优先使用向量化操作而非循环"
    - "序列化时注意 pickle 兼容性问题"

---

# DataStruct - 数据结构模块

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [速查表](./cheatsheet.md) → [使用指南](./usage.md) → [案例库](./examples.md) |
| 🔵 开发者 | [README](./README.md) → [技术架构](./architecture.md) → [设计原则](./design.md) → [API参考](./api.md) → [开发指南](./development.md) → [最佳实践](./best-practices.md) |
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [故障排查](./troubleshooting.md) → [常见问题](./faq.md) |
| 🟠 架构师 | [README](./README.md) → [技术架构](./architecture.md) → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) |
| 📚 案例库 | [案例库](./examples.md) → [案例研究](./case-studies.md) |
| 📖 索引 | [README](./README.md) → [变更日志](./changelog.md) |


## 一句话总览

📌 **FQuant 行情数据核心数据结构，提供统一的数据操作接口**

## ⚠️ AI 开发必读

### 使用场景

✅ **应该使用**：
- 场景1：获取股票日线数据并进行技术指标计算
- 场景2：获取期货分钟数据并进行周期转换
- 场景3：多数据源合并与筛选

❌ **不应该使用**：
- 不应该使用：需要实时数据推送的场景
- 不应该使用：需要直接连接数据库的场景

### 注意事项

1. **Mixin 类不能直接实例化**
   - 说明：Mixin 类是功能组合层，需要与基类一起使用

2. **@lru_cache 在 property 上使用会导致序列化后缓存失效**
   - 说明：已移除 property 上的 lru_cache 装饰器

### 已知限制

- 限制1：仅支持 A 股、期货、债券等国内金融市场
- 限制2：不支持实时数据推送，仅支持批量查询

### 依赖

| 依赖类型 | 模块 | 说明 |
|---------|------|------|
| 必须 | fquant.fqbase | 基础工具 |
| 必须 | pandas | 数据处理 |
| 必须 | numpy | 数值计算 |

**TL;DR**：
- 解决什么问题：统一行情数据操作接口，支持多市场、多周期数据处理
- 核心能力：数据筛选、指标计算、周期转换、序列化导出
- 入门难度：🔵 中等

**快速判断**：当您需要处理股票、期货、债券等行情数据时，使用本模块。

## 知识脉络

🧑‍🎓 **从零到精通的推荐学习顺序**：

1. [快速入门](./quick-start.md) - 10 分钟上手
2. [核心概念](./concepts.md) - 理解基本概念
3. [技术架构](./architecture.md) - 理解设计思路
4. [使用指南](./usage.md) - 深入使用
5. [最佳实践](./best-practices.md) - 升华理解

⏱️ 预计学习时间：2 小时

## 前置知识

在开始学习本模块前，建议先掌握：

| 知识领域 | 建议资源 | 状态 |
|---------|---------|------|
| Python 基础 | [官方教程](https://docs.python.org/zh-cn/3/tutorial/) | ⬜ |
| Pandas 数据处理 | [Pandas 教程](https://pandas.pydata.org/docs/) | ⬜ |

## 适用场景

✅ **推荐使用**：
- 适用场景 1：股票、期货、债券等行情数据处理
- 适用场景 2：数据技术指标计算
- 适用场景 3：数据周期转换（日线、分钟线互转）

❌ **不推荐使用**：
- 不适用场景 1：实时数据推送
- 不适用场景 2：直接数据库操作

💡 **与其他模块的关系**：
- 依赖 [datasource 模块](./datasource/)（数据源）
- 常与 [datastore 模块](./datastore/) 配合使用（数据存储）

## 概述

DataStruct 是 FQuant 的核心数据结构模块，提供统一的行情数据操作接口。该模块采用 Mixin 模式，将数据操作功能（筛选、计算、序列化）分离为独立的 Mixin 类，然后通过多重继承组合到具体的数据类中。

### 核心特性

- **多市场支持**：股票、指数、期货、债券、可转债
- **多周期支持**：Tick、分钟、日线、周线、月线
- **丰富的操作**：数据筛选、指标计算、周期转换、序列化导出
- **统一接口**：通过 Mixin 模式提供一致的 API

## 子模块

| 子模块 | 说明 | 文档 |
|--------|------|------|
| _base.py | 核心基类 QuotationDataStructBase | [L0文档](./_base.md) |
| _indicators.py | 指标计算 Mixin | [L0文档](./_indicators.md) |
| _operations.py | 数据操作 Mixin | [L0文档](./_operations.md) |
| _io.py | 序列化 IO Mixin | [L0文档](./_io.md) |
| stock.py | 股票数据类 | [L0文档](./stock.md) |
| index.py | 指数数据类 | [L0文档](./index.md) |
| future.py | 期货数据类 | [L0文档](./future.md) |
| bond.py | 可转债数据类 | [L0文档](./bond.md) |
| resample.py | 重采样功能 | [L0文档](./resample.md) |
| block.py | 股票板块数据 | [L0文档](./block.md) |
| financial.py | 财务数据 | [L0文档](./financial.md) |
| indicator.py | 指标数据 | [L0文档](./indicator.md) |
| realtime.py | 实时行情数据 | [L0文档](./realtime.md) |
| security_list.py | 证券列表数据 | [L0文档](./security_list.md) |
| series.py | 序列数据 | [L0文档](./series.md) |
| transaction.py | 逐笔成交数据 | [L0文档](./transaction.md) |

## L0 极简文档

本模块为以下单一文件模块生成了 L0 极简文档：

| 文件 | 类型 | 核心类/函数 | 说明 |
|------|------|-------------|------|
| [_base.md](./_base.md) | Mixin | QuotationDataStructBase | 行情数据核心基类 |
| [_indicators.md](./_indicators.md) | Mixin | QuotationIndicatorsMixin | 统计指标计算 |
| [_operations.md](./_operations.md) | Mixin | QuotationOperationsMixin | 数据筛选操作 |
| [_io.md](./_io.md) | Mixin | QuotationIOSMixin | 数据序列化导出 |
| [stock.md](./stock.md) | DataClass | StockDayData, StockMinData | 股票数据 |
| [index.md](./index.md) | DataClass | IndexDayData, IndexMinData | 指数数据 |
| [future.md](./future.md) | DataClass | FutureDayData, FutureMinData | 期货数据 |
| [bond.md](./bond.md) | DataClass | Bond2StockDayData, Bond2StockMinData | 可转债数据 |
| [resample.md](./resample.md) | Functions | tick_resample, min_to_day 等 | 数据重采样 |
| [block.md](./block.md) | DataClass | StockBlockData | 股票板块数据 |
| [financial.md](./financial.md) | DataClass | FinancialData | 财务数据 |
| [indicator.md](./indicator.md) | DataClass | IndicatorData | 指标数据 |
| [realtime.md](./realtime.md) | DataClass | RealtimeBase, StockRealtimeData | 实时行情数据 |
| [security_list.md](./security_list.md) | DataClass | SecurityListData | 证券列表数据 |
| [series.md](./series.md) | DataClass | SeriesData | 序列数据 |
| [transaction.md](./transaction.md) | DataClass | StockTransactionData, IndexTransactionData | 逐笔成交数据 |

## 快速链接

| 文档 | 说明 |
|------|------|
| [快速入门](./quick-start.md) | 10分钟快速上手 |
| [术语表](./glossary.md) | 术语定义 |
| [核心概念](./concepts.md) | 核心概念详解 |
| [技术架构](./architecture.md) | 技术架构说明 |
| [API参考](./api.md) | API参考文档 |
| [案例库](./examples.md) | 案例库 |
| [最佳实践](./best-practices.md) | 最佳实践 |

## 快速定位

我不知道这个，应该去哪找？

| 场景 | 文档 |
|------|------|
| 我不了解这个术语 | [术语表](./glossary.md) |
| 遇到错误/问题 | [故障排查](./troubleshooting.md) |
| 需要参考实际案例 | [案例库](./examples.md) |

## 安装

```bash
pip install fquant-fqdata
```

## 相关文档

| 类型 | 文档 | 链接 |
|------|------|------|
| 项目首页 | FQData 首页 | [README](../README.md) |
| 数据源 | 数据源模块 | [datasource](../datasource/README.md) |
| 数据存储 | 数据存储模块 | [datastore](../datastore/README.md) |
| 架构设计 | Mixin 模式分析 | [mixin-analysis](./mixin-analysis.md) |
