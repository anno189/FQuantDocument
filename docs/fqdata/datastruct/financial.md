---
title: financial - 财务数据
description: 上市公司财务数据类
tag:
  - fqdata
  - datastruct
  - financial

summary:
  type: data-processing
  complexity: low
  maturity: stable
  core_classes:
    - FinancialData
  features:
    is_thread_safe: true
  usage_scenarios:
    - "场景1：获取财务指标数据"
    - "场景2：按日期获取财报数据"
  warnings: []
  limitations:
    - "仅支持 A 股财务数据"

relationships:
  belongs_to:
    - fquant.fqdata.datastruct
  depends_on:
    - pandas

api:
  signatures:
    FinancialData:
      __init__: "(self, data: pd.DataFrame) -> None"
      data: "self -> pd.DataFrame"
      code: "self -> List[str]"
      date: "self -> List[pd.Timestamp]"
      get_report_by_date: "(self, code: str, date: Union[str, pd.Timestamp]) -> pd.Series"
      get_key: "(self, code: str, key: str, start: str = None, end: str = None) -> pd.Series"
      get_financial: "(self, code: str, key: str = None) -> pd.DataFrame"
  examples:
    basic: |
      from FQData.DataStruct import FinancialData
      financial = FinancialData(data)
      print(financial.code)
      print(financial.get_key('000001', 'ROE'))
---

# financial - 财务数据

## 一句话总览

📌 **上市公司财务数据管理**

## ⚠️ AI 开发必读

### 使用场景

✅ **应该使用**：
- 场景1：获取财务指标数据
- 场景2：按日期获取财报数据

❌ **不应该使用**：
- 不应该用于非 A 股财务数据

### 依赖

| 依赖类型 | 模块 | 说明 |
|---------|------|------|
| 必须 | pandas | 数据处理 |

**TL;DR**：
- 核心能力：财务指标查询、财报数据获取

## 快速开始

```python
from FQData.DataStruct import FinancialData

financial = FinancialData(data)

# 获取所有股票代码
print(financial.code)

# 获取指定 key 的数据
roa = financial.get_key('000001', 'ROE')

# 获取财务数据
fin_data = financial.get_financial('000001')
```

## 核心类

### FinancialData

#### 属性

| 属性 | 类型 | 描述 |
|------|------|------|
| data | pd.DataFrame | 原始数据 |
| code | List[str] | 股票代码列表 |
| date | List[pd.Timestamp] | 报告日期列表 |

#### 方法

| 方法 | 返回类型 | 描述 |
|------|---------|------|
| get_report_by_date | pd.Series | 按日期获取财报 |
| get_key | pd.Series | 按 key 获取财务指标 |
| get_financial | pd.DataFrame | 获取财务数据 |

## 变更日志

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0.0 | 2024-01 | 初始版本 |
