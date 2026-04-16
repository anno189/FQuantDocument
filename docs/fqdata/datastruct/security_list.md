---
title: security_list - 证券列表数据
description: 证券列表数据管理类
tag:
  - fqdata
  - datastruct
  - security_list

summary:
  type: data-processing
  complexity: low
  maturity: stable
  core_classes:
    - SecurityListData
  features:
    is_thread_safe: true
  usage_scenarios:
    - "场景1：获取股票列表"
    - "场景2：筛选特定类型证券"
  warnings: []
  limitations:
    - "仅支持 A 股证券列表"

relationships:
  belongs_to:
    - fquant.fqdata.datastruct
  depends_on:
    - pandas

api:
  signatures:
    SecurityListData:
      __init__: "(self, data: pd.DataFrame) -> None"
      data: "self -> pd.DataFrame"
      code: "self -> List[str]"
      name: "self -> List[str]"
      get_stock: "(self, option: str = None) -> pd.DataFrame"
      get_index: "(self) -> pd.DataFrame"
      get_etf: "(self) -> pd.DataFrame"
      filter_by_name: "(self, keyword: str) -> pd.DataFrame"
      filter_by_code: "(self, prefix: str) -> pd.DataFrame"
  examples:
    basic: |
      from FQData.DataStruct import SecurityListData
      security = SecurityListData(data)
      print(security.get_stock())
      print(security.get_etf())
---

# security_list - 证券列表数据

## 一句话总览

📌 **证券列表数据管理**

## ⚠️ AI 开发必读

### 使用场景

✅ **应该使用**：
- 场景1：获取股票列表
- 场景2：筛选特定类型证券

❌ **不应该使用**：
- 不应该用于非 A 股证券列表

### 依赖

| 依赖类型 | 模块 | 说明 |
|---------|------|------|
| 必须 | pandas | 数据处理 |

**TL;DR**：
- 核心能力：证券列表查询、筛选

## 快速开始

```python
from FQData.DataStruct import SecurityListData

security = SecurityListData(data)

# 获取所有股票
stocks = security.get_stock()

# 获取 ETF
etfs = security.get_etf()

# 获取指数
indices = security.get_index()

# 按名称筛选
filtered = security.filter_by_name('银行')
```

## 核心类

### SecurityListData

#### 属性

| 属性 | 类型 | 描述 |
|------|------|------|
| data | pd.DataFrame | 原始数据 |
| code | List[str] | 证券代码列表 |
| name | List[str] | 证券名称列表 |

#### 方法

| 方法 | 返回类型 | 描述 |
|------|---------|------|
| get_stock | pd.DataFrame | 获取股票列表 |
| get_index | pd.DataFrame | 获取指数列表 |
| get_etf | pd.DataFrame | 获取 ETF 列表 |
| filter_by_name | pd.DataFrame | 按名称筛选 |
| filter_by_code | pd.DataFrame | 按代码前缀筛选 |

## 变更日志

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0.0 | 2024-01 | 初始版本 |
