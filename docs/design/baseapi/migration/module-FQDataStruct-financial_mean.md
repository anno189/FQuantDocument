# module-FQDataStruct-financial_mean.md

# 模块迁移报告: FQDataStruct-financial_mean

## 基本信息

| 项目 | 原模块 | 迁移后 |
|------|--------|--------|
| **模块名称** | FQData.QAData.financial_mean | FQConfig |
| **原文件** | `_bak/server/FQData/FQData/QAData/financial_mean.py` | `FQConfig/financial_mapping.py` |
| **功能** | 财务指标中英文字段映射字典 | 配置文件 |

## 迁移概览

| 对比项 | 原实现 | 迁移后 |
|--------|--------|--------|
| **类型** | 全局字典变量 | 常量模块 |
| **变量名** | `financial_dict` | `FINANCIAL_INDICATORS` |
| **位置** | FQData.QAData | FQConfig |

---

## 函数对比

### 原实现 (financial_mean.py)

```python
financial_dict = {
    '001基本每股收益': 'EPS',
    '002扣除非经常性损益每股收益': 'deductEPS',
    '003每股未分配利润': 'undistributedProfitPerShare',
    # ... 600+ 指标
}
```

### 迁移后 (FQConfig/financial_mapping.py)

```python
from FQConfig import FINANCIAL_INDICATORS, FINANCIAL_CATEGORIES

FINANCIAL_INDICATORS = {
    '001基本每股收益': 'EPS',
    '002扣除非经常性损益每股收益': 'deductEPS',
    '003每股未分配利润': 'undistributedProfitPerShare',
    # ... 600+ 指标
}

FINANCIAL_CATEGORIES = {
    'per_share': {'name': '每股指标', 'codes': ['001', ...]},
    'balance_sheet_assets': {'name': '资产负债表-资产', 'codes': [...]},
    # ...
}
```

---

## 使用示例

### 原接口

```python
from FQData.financial_mean import financial_dict

eps = financial_dict['001基本每股收益']
```

### 新接口

```python
from FQConfig import FINANCIAL_INDICATORS, FINANCIAL_CATEGORIES

eps = FINANCIAL_INDICATORS['001基本每股收益']
category = FINANCIAL_CATEGORIES['per_share']
```

---

## 指标分类

| 类别 | 英文键名 | 说明 |
|------|----------|------|
| 每股指标 | `per_share` | EPS、ROE 等 |
| 资产负债表-资产 | `balance_sheet_assets` | 流动/非流动资产 |
| 资产负债表-负债 | `balance_sheet_liabilities` | 流动/非流动负债 |
| 资产负债表-权益 | `balance_sheet_equity` | 所有者权益 |
| 利润表 | `income_statement` | 营收、成本、利润 |
| 现金流量表 | `cash_flow` | 经营/投资/筹资活动 |
| 偿债能力 | `solvency` | 流动/速动比率等 |
| 经营效率 | `efficiency` | 周转率等 |
| 发展能力 | `growth` | 增长率等 |
| 获利能力 | `profitability` | 利润率等 |
| 资本结构 | `capital_structure` | 资产负债率等 |
| 现金流量分析 | `cash_analysis` | 现金回收率等 |
| 单季度指标 | `quarterly` | 季度财务 |
| 股本股东 | `shareholders` | 股东持股 |
| 机构持股 | `institutional` | QFII、基金等 |

---

## 迁移状态

| 项目 | 状态 |
|------|------|
| **功能完整性** | ✅ 完成 |
| **配置模块** | ✅ `FQConfig/financial_mapping.py` |
| **常量导出** | ✅ `FQConfig.__init__` |
| **向后兼容** | ✅ 通过别名支持 |

---

## 相关文件

- [constants.py](./module-FQConfig-constants.md) - 常量定义
- [setting.py](./module-FQConfig-setting.md) - 设置配置