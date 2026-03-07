# CConceptData 模块文档

## 模块概述

CConceptData 提供概念板块数据的处理功能，包括概念数据初始化、扩展数据计算、趋势系数计算等。该模块主要用于分析概念板块的技术指标和趋势状态。

## 核心功能

- **概念数据初始化**: 初始化概念板块列表
- **扩展数据计算**: 计算板块内均线状态、创新高/低等指标
- **趋势系数计算**: 计算概念板块的趋势系数
- **数据保存**: 保存概念数据到数据库

## 依赖模块

- pandas
- numpy
- QAUtil
- FQFactor
- Parameter

---

## 类定义

### class CConceptData()

概念数据类。

#### \_\_init\_\_(self, end_date=None)

初始化类。

**参数:**
- `end_date` (str, optional): 结束日期，默认为今日

---

## 方法详细说明

### conceptData(self, end_date=None, renew=True)

初始化概念数据。

**参数:**
- `end_date` (str, optional): 结束日期
- `renew` (bool, optional): 是否初始化概念数据，默认为True

**返回值:**
- `DataFrame`: 概念数据

**功能说明:**
- 从通达信加载概念数据
- 如果renew为True，保存到Redis的DataFrame_ConceptList

**代码示例:**
```python
from FQMarket.FQUtil.CConceptData import CConceptData

concept = CConceptData()
data = concept.conceptData(renew=True)
print(data.head())
```

### caluicontrcoedata(self, code, days=1000)

计算概念趋势系数数据。

**参数:**
- `code` (str): 概念代码
- `days` (int, optional): 天数，默认为1000

**返回值:**
- `DataFrame`: 包含趋势系数的数据

**功能说明:**
- 计算mac2060（20日在60日之上）的分位数和趋势系数
- 计算ma6020c（60日在20日之下）的分位数和趋势系数
- 计算u60（收盘价在60日之上）的分位数和趋势系数
- 计算h250（创250日新高）的分位数和趋势系数
- 计算lvol（地量）的分位数和趋势系数
- 综合计算trcoe（总趋势系数）

**代码示例:**
```python
from FQMarket.FQUtil.CConceptData import CConceptData

concept = CConceptData()
# 计算某个概念的趋势系数
data = concept.caluicontrcoedata('880507', days=1000)
print(data[['date', 'trcoe']].tail())
```

### InitExtentData(self, date)

计算概念板块的扩展数据，仅供saveInitData函数运算使用。

**参数:**
- `date` (str): 日期

**返回值:**
- `DataFrame`: 概念扩展数据

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
- code: 概念代码
- name: 概念名称
- date: 日期
- type: 类型（'gn'）
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
from FQMarket.FQUtil.CConceptData import CConceptData

concept = CConceptData()
# 计算某日的概念扩展数据
data = concept.InitExtentData('2024-01-31')
print(data[['name', 'count', 'u60', 'h250']].head())
```

### saveInitData(self, end_date=None, client=DATABASE)

保存概念数据到数据库。

**参数:**
- `end_date` (str, optional): 结束日期
- `client` (MongoClient, optional): MongoDB客户端，默认为DATABASE

**功能说明:**
- 创建索引（code和date）
- 从上次更新的日期继续，或从GLOBALMAP.start_date开始
- 对每个交易日调用InitExtentData计算扩展数据
- 保存到concept_data_base集合
- 重新计算所有概念的趋势系数（caluicontrcoedata）

**代码示例:**
```python
from FQMarket.FQUtil.CConceptData import CConceptData

concept = CConceptData()
# 保存概念数据
concept.saveInitData(end_date='2024-01-31')
```

### loadInitData(self, code=None, start_date=None, end_date=None, client=DATABASE)

加载概念数据。

**参数:**
- `code` (str, optional): 概念代码，默认为None
- `start_date` (str, optional): 开始日期
- `end_date` (str, optional): 结束日期
- `client` (MongoClient, optional): MongoDB客户端，默认为DATABASE

**返回值:**
- `DataFrame`: 概念数据

**功能说明:**
- 从concept_data_base集合加载数据
- 支持按概念代码查询
- 支持按日期范围查询

**代码示例:**
```python
from FQMarket.FQUtil.CConceptData import CConceptData

concept = CConceptData()
# 加载所有概念的最新数据
data = concept.loadInitData(end_date='2024-01-31')
print(data.head())

# 加载某个概念的数据
data = concept.loadInitData(code='880507')
print(data.tail())
```
