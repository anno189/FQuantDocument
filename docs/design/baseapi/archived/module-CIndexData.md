# CIndexData 模块文档

## 模块概述

CIndexData 是指数数据类，继承自CBaseData。该类提供了指数数据的初始化和管理功能。支持各类指数（上证指数、深证成指、创业板指、沪深300等）的数据获取和处理。

## 核心功能

- **指数信息管理**: 管理指数的基本信息
- **指数数据初始化**: 初始化指数数据

## 继承关系

CIndexData继承自：
- CBaseData: 基础数据类

## 依赖模块

- CBaseData
- FQFactor
- QAUtil

## 主要指数代码说明

### 宽基指数
- 000001: 上证指数
- 399001: 深证成指
- 000016: 上证50
- 000300: 沪深300
- 399005: 中小板指
- 399006: 创业板指
- 000688: 科创50

### 中证指数
- 000903: 中证100
- 000904: 中证200
- 000905: 中证500
- 000852: 中证1000
- 000985: 中证全指
- 930903: 中证A股
- 000902: 中证流通

### 通达信板块分类
- 880201 - 880232: 地区板块
- 880301 - 880497: 行业板块
- 880501 - 880800: 概念板块
- 880899 - 880977: 概念板块
- 880801 - 880898: 风格板块

---

## 类定义

### class CIndexData(CBaseData)

指数数据类。

#### \_\_init\_\_(self, code, name=None, startDay=None, end_date=None, days=250, daysOffset=260, online=False)

初始化类。

**参数:**
- `code` (str): 指数代码
- `name` (str, optional): 指数名称，默认为None
- `startDay` (str, optional): 开始日期，默认为None
- `end_date` (str, optional): 数据截止日期，默认当前最后交易日期 GLOBALMAP.TODAY()
- `days` (int, optional): 取数周期，默认250天，至少满足年线的计算周期
- `daysOffset` (int, optional): 取数周期偏移，默认60天，不少于30天，用于弥补年线运算的周期补偿
- `online` (bool, optional): 取数位置，如无特别需要，建议先同步数据到本地，使用本地数据运算复权
  - True：从网络取数据，当前FQData不支持实时复权，从线上取数只能使用未复权数据
  - False：从本地取数

**功能说明:**
- 初始化指数代码、名称等信息
- 设置取数周期和偏移

---

## 方法详细说明

### InitData(self, online=False)

初始化指数数据。

**参数:**
- `online` (bool, optional): 是否在线，默认为False

**返回值:**
- `DataFrame`: 初始化后的指数数据

**功能说明:**
- 调用dayData获取日线数据
- 清洗空数据
- 填充空值为0

**代码示例:**
```python
from FQMarket.FQUtil.CIndexData import CIndexData

# 初始化上证指数
index = CIndexData('000001')
data = index.InitData()
print(data.tail())

# 初始化沪深300
index = CIndexData('000300')
data = index.InitData(online=False)
print(data.tail())
```
