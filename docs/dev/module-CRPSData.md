# CRPSData 模块文档

## 模块概述

CRPSData 提供RPS（Relative Price Strength，相对价格强度）数据的计算功能。RPS指标用于衡量股票、行业或概念在一定时期内的相对涨幅表现。

## 核心功能

- **RPS计算**: 计算股票、行业、概念的RPS值
- **多周期支持**: 支持10日、20日、60日、120日、250日等多个周期

## 支持的类型

- STOCK: 股票
- INS3: 三级行业
- CON: 概念

## 依赖模块

- pandas
- numpy
- QAUtil

---

## 类定义

### class CRPSData()

RPS数据类。

#### \_\_init\_\_(self, ctype='STOCK', end_date=None)

初始化类。

**参数:**
- `ctype` (str, optional): 类型，默认为'STOCK'
  - 'STOCK': 股票
  - 'INS3': 三级行业
  - 'CON': 概念
- `end_date` (str, optional): 数据截止日期，默认当前最后交易日期 GLOBALMAP.TODAY()

---

## 方法详细说明

### InitDayRPS(self, end_date=None)

初始化日线RPS数据。

**参数:**
- `end_date` (str, optional): 结束日期

**功能说明:**
- 根据类型选择对应的数据库集合
- STOCK类型：从stock_data_extent获取所有股票数据
- INS3类型：从index_data_extent获取三级行业数据
- CON类型：从index_data_extent获取概念数据
- 计算各周期RPS值：
  - RPS10: 10日相对强度
  - RPS20: 20日相对强度
  - RPS60: 60日相对强度
  - RPS120: 120日相对强度
  - RPS250: 250日相对强度
- RPS值范围：0-1，数值越大表示相对强度越高

**计算方法:**
1. 按对应周期的收益率排序
2. 计算累计占比
3. 归一化到0-1范围

**返回数据字段:**
- code: 代码
- date: 日期
- RPS10: 10日RPS值
- RPS20: 20日RPS值
- RPS60: 60日RPS值
- RPS120: 120日RPS值
- RPS250: 250日RPS值

**代码示例:**
```python
from FQMarket.FQUtil.CRPSData import CRPSData

# 计算股票RPS
rps = CRPSData(ctype='STOCK')
rps.InitDayRPS(end_date='2024-01-31')

# 计算行业RPS
rps = CRPSData(ctype='INS3')
rps.InitDayRPS(end_date='2024-01-31')

# 计算概念RPS
rps = CRPSData(ctype='CON')
rps.InitDayRPS(end_date='2024-01-31')
```

## RPS使用说明

RPS（Relative Price Strength）是欧奈尔CANSLIM投资体系中的重要指标，用于识别领涨股票。

**RPS值解读:**
- RPS > 0.9: 前10%，强势股
- RPS > 0.8: 前20%，较强势
- RPS > 0.7: 前30%，中等偏上
- RPS < 0.3: 后30%，弱势

**使用建议:**
- 优先选择RPS60 > 0.8的股票
- 多个周期RPS同时走强更佳
- 配合基本面和技术面分析使用
