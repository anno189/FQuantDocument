# CIndustryData 模块文档

## 模块概述

CIndustryData 提供行业板块数据的处理功能，包括行业数据初始化、扩展数据计算等。该模块主要用于分析行业板块的技术指标和趋势状态，与CConceptData类似但针对行业板块。

## 核心功能

- **行业数据初始化**: 初始化行业板块列表
- **扩展数据计算**: 计算行业板块内均线状态、创新高/低等指标

## 依赖模块

- pandas
- numpy
- QAUtil
- FQFactor
- Parameter

---

## 类定义

### class CIndustryData()

行业数据类。

#### \_\_init\_\_(self, end_date=None)

初始化类。

**参数:**
- `end_date` (str, optional): 结束日期，默认为今日

---

## 方法详细说明

### InitExtentData(self, date)

计算行业板块的扩展数据，仅供saveInitData函数运算使用。

**参数:**
- `date` (str): 日期

**返回值:**
- `DataFrame`: 行业扩展数据

**功能说明:**
- 计算板块内60日均线状态：
  - mac2060: 20日均线在60日均线之上的股票数
  - ma6020c: 60日均线在20日均线之下的股票数
  - u60: 收盘价在MA60之上的股票数
  - d60: 收盘价在MA60之下的股票数
  - s60: 收盘价在MA60的股票数
  - cu60: CMA60为1（突破）的股票数
  - cd60: CMA60为-1（跌破）的股票数
  - h250: 创250日新高的股票数
  - l250: 创250日新低的股票数
  - lvol: 地量的股票数
- 统计板块内股票总数（count）
- 计算板块的成交量、成交额、流通股本、流通市值

**返回数据字段:**
- code: 行业代码
- name: 行业名称
- date: 日期
- type: 类型
- count: 板块内股票数
- ma6020c: 60日在20日之下的股票数
- mac2060: 20日在60日之上的股票数
- u60: 收盘价在MA60之上的股票数
- d60: 收盘价在MA60之下的股票数
- s60: 收盘价在MA60的股票数
- cu60: CMA60为1的股票数
- cd60: CMA60为-1的股票数
- h250: 创250日新高的股票数
- l250: 创250日新低的股票数
- lvol: 地量的股票数
- volume: 成交量
- amount: 成交额
- liutongguben: 流通股本
- liutongshizhi: 流通市值

**代码示例:**
```python
from FQMarket.FQUtil.CIndustryData import CIndustryData

industry = CIndustryData()
# 计算某日的行业扩展数据
data = industry.InitExtentData('2024-01-31')
print(data[['name', 'count', 'u60', 'h250']].head())
```
