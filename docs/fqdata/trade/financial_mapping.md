---
title: financial_mapping - 财务指标映射
description: 中文财务指标名称到英文代码的映射，包含资产负债表、利润表、现金流量表等指标
tag:
  - fqdata
  - trade
  - financial_mapping

summary:
  type: utility
  complexity: minimal
  maturity: stable
  data_structures:
    - name: FINANCIAL_INDICATORS
      description: 中文财务指标名称到英文代码的映射字典，包含580+条映射
      size: 580+
    - name: FINANCIAL_CATEGORIES
      description: 财务指标分类字典，按指标类型分组
      categories: 15
  features:
    is_pure_data: true
    is_thread_safe: true
    has_no_side_effect: true
  usage_scenarios:
    - "场景1：将中文财务指标名称转换为英文代码"
    - "场景2：按分类获取财务指标列表"
    - "场景3：数据清洗时的字段标准化"
  warnings:
    - "警告1：映射字典为静态数据，不支持运行时修改"
    - "警告2：部分指标代码可能因版本更新而变化"
  limitations:
    - "限制1：新增指标需要手动更新映射表"
    - "限制2：不提供指标值验证功能"

relationships:
  belongs_to:
    - fquant.fqdata.trade
  used_by:
    - fquant.fqdata
    - fquant.fqalgorithm
    - fquant.fqfactor

api:
  signatures:
    FINANCIAL_INDICATORS:
      type: dict
      description: "中文财务指标名称 -> 英文代码 的映射字典"
      example_keys: "001基本每股收益, 008货币资金, 074其中：营业收入"
    FINANCIAL_CATEGORIES:
      type: dict
      description: "财务指标分类 -> 分类信息的映射字典"
      example_keys: "per_share, balance_sheet_assets, income_statement, cash_flow"
  examples:
    FINANCIAL_INDICATORS: |
      from FQData.Trade.financial_mapping import FINANCIAL_INDICATORS
      
      # 获取中文名称对应的英文代码
      code = FINANCIAL_INDICATORS.get('001基本每股收益')  # 'EPS'
      code = FINANCIAL_INDICATORS.get('008货币资金')      # 'moneyFunds'
    FINANCIAL_CATEGORIES: |
      from FQData.Trade.financial_mapping import FINANCIAL_CATEGORIES
      
      # 获取所有分类
      categories = list(FINANCIAL_CATEGORIES.keys())
      
      # 获取特定分类的指标代码
      income_codes = FINANCIAL_CATEGORIES['income_statement']['codes']

usage:
  quick_example: |
    from FQData.Trade.financial_mapping import FINANCIAL_INDICATORS, FINANCIAL_CATEGORIES
    
    # 中文名称转英文代码
    eps_code = FINANCIAL_INDICATORS['001基本每股收益']  # 'EPS'
    
    # 获取利润表指标代码列表
    income_statement_codes = FINANCIAL_CATEGORIES['income_statement']['codes']
---

# financial_mapping 财务指标映射

## 一句话总览

📌 **中文财务指标名称到英文代码的映射表，包含580+条映射和15个分类**

## ⚠️ AI 开发必读

### 使用场景

✅ **应该使用**：
- 将中文财务指标名称转换为英文代码
- 按分类获取财务指标列表
- 数据清洗时的字段标准化

❌ **不应该使用**：
- 需要运行时修改映射关系
- 需要验证指标值的合法性

### 注意事项

1. **映射字典为静态数据**
   - ❌ 错误做法：在运行时修改 FINANCIAL_INDICATORS 字典
   - ✅ 正确做法：直接查询，不修改原始数据

2. **部分指标代码可能因版本更新而变化**
   - 说明：财务指标标准可能随会计准则更新而变化

### 已知限制

- 新增指标需要手动更新映射表
- 不提供指标值验证功能

### 依赖

| 依赖类型 | 模块 | 说明 |
|---------|------|------|
| 必须 | FQBase | 基础模块 |

**TL;DR**：
- 核心能力：580+ 条财务指标映射、15 个分类
- 入门难度：🟢 简单
- 依赖：无外部依赖

## 快速开始

```python
from FQData.Trade.financial_mapping import FINANCIAL_INDICATORS, FINANCIAL_CATEGORIES

# 中文名称转英文代码
eps_code = FINANCIAL_INDICATORS['001基本每股收益']  # 'EPS'

# 获取利润表指标代码列表
income_statement_codes = FINANCIAL_CATEGORIES['income_statement']['codes']
```

## 数据结构

### FINANCIAL_INDICATORS 映射字典

```python
from FQData.Trade.financial_mapping import FINANCIAL_INDICATORS

# 获取中文名称对应的英文代码
code = FINANCIAL_INDICATORS['001基本每股收益']  # 'EPS'
code = FINANCIAL_INDICATORS['008货币资金']      # 'moneyFunds'
code = FINANCIAL_INDICATORS['074其中：营业收入']  # 'operatingRevenue'
```

### FINANCIAL_CATEGORIES 分类字典

```python
from FQData.Trade.financial_mapping import FINANCIAL_CATEGORIES

# 获取所有分类名称
categories = list(FINANCIAL_CATEGORIES.keys())
# ['per_share', 'balance_sheet_assets', 'balance_sheet_liabilities', ...]

# 获取分类详情
category_info = FINANCIAL_CATEGORIES['per_share']
# {'name': '每股指标', 'codes': ['001', '002', '003', '004', '005', '006', '007']}
```

## 指标分类

### 分类列表

| 分类键 | 中文名称 | 指标数量 |
|--------|----------|----------|
| per_share | 每股指标 | 7 |
| balance_sheet_assets | 资产负债表-资产 | 43 |
| balance_sheet_liabilities | 资产负债表-负债 | 13 |
| balance_sheet_equity | 资产负债表-所有者权益 | 24 |
| income_statement | 利润表 | 24 |
| cash_flow | 现金流量表 | 61 |
| solvency | 偿债能力分析 | 13 |
| efficiency | 经营效率分析 | 12 |
| growth | 发展能力分析 | 9 |
| profitability | 获利能力分析 | 17 |
| capital_structure | 资本结构分析 | 9 |
| cash_analysis | 现金流量分析 | 11 |
| quarterly | 单季度财务指标 | 8 |
| shareholders | 股本股东 | 28 |
| institutional | 机构持股 | 19 |
| new_indicators | 新增指标 | 38 |

### 常用指标示例

```python
# 每股指标
FINANCIAL_INDICATORS['001基本每股收益']  # 'EPS'
FINANCIAL_INDICATORS['004每股净资产']    # 'netAssetsPerShare'
FINANCIAL_INDICATORS['006净资产收益率']  # 'ROE'

# 资产负债表-资产
FINANCIAL_INDICATORS['008货币资金']      # 'moneyFunds'
FINANCIAL_INDICATORS['011应收账款']      # 'accountsReceivables'
FINANCIAL_INDICATORS['040资产总计']      # 'totalAssets'

# 利润表
FINANCIAL_INDICATORS['074其中：营业收入']  # 'operatingRevenue'
FINANCIAL_INDICATORS['086三、营业利润']   # 'operatingProfit'
FINANCIAL_INDICATORS['095五、净利润']     # 'netProfit'

# 现金流量表
FINANCIAL_INDICATORS['107经营活动产生的现金流量净额']  # 'netCashFlowsFromOperatingActivities'

# 财务比率
FINANCIAL_INDICATORS['159流动比率']       # 'currentRatio'
FINANCIAL_INDICATORS['160速动比率']       # 'acidTestRatio'
FINANCIAL_INDICATORS['172应收帐款周转率']  # 'turnoverRatioOfReceivable'
```

## 常见错误

| 错误 | 原因 | 解决方案 |
|------|------|---------|
| KeyError | 指标名称不存在 | 检查名称是否在 FINANCIAL_INDICATORS 中 |
| 导入错误 | 模块路径不正确 | 使用 `from FQData.Trade.financial_mapping import ...` |

## 变更日志

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0.0 | 2024-01 | 初始版本，包含财务指标映射 |
