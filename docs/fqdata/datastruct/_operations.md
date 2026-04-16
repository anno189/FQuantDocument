---
title: _operations - 行情数据操作 Mixin
description: 提供数据筛选、转换等操作方法的 Mixin 类
tag:
  - fqdata
  - datastruct
  - operations

summary:
  type: data-processing
  complexity: medium
  maturity: stable
  core_classes:
    - QuotationOperationsMixin
  features:
    is_pure_function: false
    is_thread_safe: true
  usage_scenarios:
    - "场景1：按股票代码筛选数据"
    - "场景2：按时间范围筛选数据"
  warnings:
    - "Mixin 类不能直接实例化"
  limitations:
    - "需要与 QuotationDataStructBase 配合使用"

relationships:
  belongs_to:
    - fquant.fqdata.datastruct
  depends_on:
    - pandas

api:
  signatures:
    QuotationOperationsMixin:
      select_code: "(self, code: str) -> QuotationDataStructBase"
      select_time: "(self, start_date: str, end_date: str) -> QuotationDataStructBase"
      selects: "(self, code: str, start_date: str, end_date: str) -> QuotationDataStructBase"
      select_day: "(self, day: str) -> QuotationDataStructBase"
      select_month: "(self, month: str) -> QuotationDataStructBase"
      select_columns: "(self, columns: Union[str, List[str]])"
      head: "(self, n: int = 5) -> QuotationDataStructBase"
      tail: "(self, n: int = 5) -> QuotationDataStructBase"
      get_bar: "(self, code: str, time: str) -> pd.Series"
      pivot: "(self, column_) -> pd.DataFrame"
  examples:
    basic: |
      from FQData.DataStruct import StockDayData
      stock = StockDayData(data, dtype='stock_day', if_fq='bfq')

      # 按代码筛选
      selected = stock.select_code('000001')

      # 按时间筛选
      selected = stock.select_time('2024-01-01', '2024-12-31')

      # 获取前5条
      head = stock.head()
---

# _operations - 行情数据操作 Mixin

## 一句话总览

📌 **行情数据操作 Mixin，提供数据筛选和转换方法**

## ⚠️ AI 开发必读

### 使用场景

✅ **应该使用**：
- 场景1：按股票代码筛选数据
- 场景2：按时间范围筛选数据

❌ **不应该使用**：
- 不应该直接实例化 Mixin 类
- 不应该单独使用，需要与基类配合

### 注意事项

1. **Mixin 类不能直接实例化**
   - 说明：此类仅用于多重继承，必须放在 QuotationDataStructBase 之后

### 依赖

| 依赖类型 | 模块 | 说明 |
|---------|------|------|
| 必须 | pandas | 数据处理 |

**TL;DR**：
- 核心能力：select_code, select_time, head, tail 等筛选方法

## 快速开始

```python
from FQData.DataStruct import StockDayData

stock = StockDayData(data, dtype='stock_day', if_fq='bfq')

# 按代码筛选
selected = stock.select_code('000001')

# 按时间范围筛选
selected = stock.select_time('2024-01-01', '2024-12-31')

# 获取前5条
head = stock.head(5)

# 获取后5条
tail = stock.tail(5)
```

## 操作方法

### 筛选方法

| 方法 | 返回类型 | 描述 |
|------|---------|------|
| select_code | QuotationDataStructBase | 按股票代码筛选 |
| select_time | QuotationDataStructBase | 按时间范围筛选 |
| selects | QuotationDataStructBase | 按代码和时间筛选 |
| select_day | QuotationDataStructBase | 按日期筛选 |
| select_month | QuotationDataStructBase | 按月份筛选 |
| select_columns | None | 选择指定列 |
| select_single_time | pd.DataFrame | 按具体时间筛选 |
| select_time_with_gap | QuotationDataStructBase | 按时间间隔筛选 |

### 数据获取

| 方法 | 返回类型 | 描述 |
|------|---------|------|
| head | QuotationDataStructBase | 获取前 N 条 |
| tail | QuotationDataStructBase | 获取后 N 条 |
| get_bar | pd.Series | 获取指定 K 线 |

### 数据转换

| 方法 | 返回类型 | 描述 |
|------|---------|------|
| reindex | QuotationDataStructBase | 重新索引 |
| reindex_time | QuotationDataStructBase | 重新索引时间 |
| pivot | pd.DataFrame | 数据透视 |

## 常见错误

| 错误 | 原因 | 解决方案 |
|------|------|---------|
| KeyError | 列名不存在 | 检查数据列名 |
| ValueError | 筛选条件无效 | 检查筛选参数 |
| AttributeError | Mixin 未正确继承 | 确保继承顺序正确 |

## 变更日志

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0.0 | 2024-01 | 初始版本 |
