# ToolsCRCData 模块文档

## 模块概述

ToolsCRCData 模块提供数据校验功能，主要用于校验股票流通市值等数据的正确性。该模块每周末执行数据校验，可以自动修复发现的数据错误。

## 核心功能

- **CRCStockData**: 校验股票数据，特别是流通市值数据，发现错误时自动修复

## 函数列表

| 函数名 | 功能描述 |
|--------|----------|
| CRCStockData | 校验股票数据，包括流通市值等，发现错误自动修复 |

---

## 函数详细说明

### CRCStockData(end_date=None)

校验股票数据，可以不在使用了。每周末校验流通市值的数据。

**参数:**
- `end_date` (str, optional): 结束日期，默认为今日

**返回值:**
- `bool`: True表示有错误并已修复，False表示无错误

**功能说明:**
- 从Redis获取股票列表
- 获取最近60天的数据进行校验
- 对比数据库中的流通市值和计算得出的流通市值
- 如果差异超过0.0002，则认为数据错误
- 错误时自动重新保存初始化数据、相关数据、扩展数据和因子数据
- 完成后通过企业微信发送校验结果通知

**代码示例:**
```python
from FQMarket.FQUtil.ToolsCRCData import CRCStockData

# 校验今日数据
has_error = CRCStockData()

# 校验指定日期数据
has_error = CRCStockData(end_date='2024-01-31')
```
