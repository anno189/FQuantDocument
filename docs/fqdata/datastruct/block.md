---
title: block - 股票板块数据
description: 提供股票板块分类数据的类
tag:
  - fqdata
  - datastruct
  - block

summary:
  type: data-processing
  complexity: low
  maturity: stable
  core_classes:
    - StockBlockData
  features:
    is_thread_safe: true
  usage_scenarios:
    - "场景1：获取股票所属板块"
    - "场景2：按板块筛选股票"
  warnings: []
  limitations:
    - "仅支持 A 股板块数据"

relationships:
  belongs_to:
    - fquant.fqdata.datastruct
  depends_on:
    - pandas

api:
  signatures:
    StockBlockData:
      __init__: "(self, data: pd.DataFrame) -> None"
      data: "self -> pd.DataFrame"
      block_name: "self -> List[str]"
      code: "self -> List[str]"
      view_code: "self -> pd.Series"
      view_block: "self -> pd.Series"
      show: "self -> pd.DataFrame"
      get_code: "(self, code: str) -> StockBlockData"
      get_block: "(self, block_name: str) -> StockBlockData"
  examples:
    basic: |
      from FQData.DataStruct import StockBlockData
      block = StockBlockData(data)
      print(block.block_name)
      print(block.get_block('新能源'))
---

# block - 股票板块数据

## 一句话总览

📌 **股票板块分类数据管理**

## ⚠️ AI 开发必读

### 使用场景

✅ **应该使用**：
- 场景1：获取股票所属板块
- 场景2：按板块筛选股票

❌ **不应该使用**：
- 不应该用于非 A 股数据

### 依赖

| 依赖类型 | 模块 | 说明 |
|---------|------|------|
| 必须 | pandas | 数据处理 |

**TL;DR**：
- 核心能力：板块查询、板块筛选

## 快速开始

```python
from FQData.DataStruct import StockBlockData

block = StockBlockData(data)

# 获取所有板块名称
print(block.block_name)

# 按板块筛选
stocks = block.get_block('新能源')
print(stocks.data)
```

## 核心类

### StockBlockData

#### 属性

| 属性 | 类型 | 描述 |
|------|------|------|
| data | pd.DataFrame | 原始数据 |
| block_name | List[str] | 板块名称列表 |
| code | List[str] | 股票代码列表 |
| view_code | pd.Series | 板块->股票映射 |
| view_block | pd.Series | 股票->板块映射 |

#### 方法

| 方法 | 返回类型 | 描述 |
|------|---------|------|
| show | pd.DataFrame | 显示数据 |
| get_code | StockBlockData | 按股票代码筛选 |
| get_block | StockBlockData | 按板块名称筛选 |

## 变更日志

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0.0 | 2024-01 | 初始版本 |
