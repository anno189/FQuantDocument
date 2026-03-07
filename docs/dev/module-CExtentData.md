# CExtentData 模块文档

## 模块概述

CExtentData 是扩展数据基类，用于个股/指数的因子基础数据运算和保存。该类作为基类，结合 Stock/Index 使用，提供技术指标、均线系统、成交量等扩展数据的计算和管理功能。

## 核心功能

- **扩展数据初始化**: 计算各类技术指标和扩展数据
- **扩展数据重新计算**: 重新计算并保存扩展数据
- **数据保存**: 将扩展数据保存到MongoDB数据库
- **数据加载**: 从MongoDB数据库加载扩展数据
- **多频率支持**: 支持日线、周线扩展数据

## 依赖模块

- FQFactor.BaseFunction
- FQMarket.FQUtil.Parameter
- FQData.QAFetch.QAQuery_Advance
- FQData.QAUtil
- pymongo
- pandas
- numpy

---

## 类定义

### class CExtentData()

扩展数据基类。

---

## 方法详细说明

### RecaluExtentData(self)

重新计算扩展数据。

**功能说明:**
- 根据类型选择对应的数据库集合（stock_data_extent、index_data_extent）
- 创建索引（code和date）
- 加载扩展数据
- 计算换手率相关指标（HSL、HS05、HS10、HS25）
- 计算成交额均线（A10、A60、A120、A250）
- 计算切线角度指标（tan3、T34、tan10）
- 删除旧数据并插入新数据

**代码示例:**
```python
from FQMarket.FQUtil.CExtentData import CExtentData

# 注意：CExtentData通常作为基类被其他类继承使用
# 具体使用请参考CStockData或CIndexData
```

### InitExtentData(self, startDay=None, end_date=None, frequence='d')

初始化日线扩展数据。

**参数:**
- `startDay` (str, optional): 开始日期，默认为'2005-01-04'
- `end_date` (str, optional): 结束日期
- `frequence` (str, optional): 频率，默认为'd'（日线）

**功能说明:**
- 根据类型（STOCK/INDEX/FUTURE）获取对应的数据
- 对于股票：使用前复权数据，计算历史最高/最低
- 对于指数：计算相对于大盘的成交量比率和成交额比率
- 计算均线系统（MA3、MA5、MA10、MA20、MA30、MA60、MA120、MA250、MA450）
- 计算切线角度（tan3、T34、tan10，仅股票）
- 计算价格与均线关系（CMA10、CMA20、CMA30、CMA60、CMA120、CMA250、CMA450）
- 计算最高最低价（H3、H5、H20、L20、H60、L60、H120、L120、H250、L250）
- 计算成交量最低值（VL20、V0LLV）
- 计算涨跌幅（RATE、R3、R5、R10、R20、R30、R60、R120、R250）
- 计算开盘/最高/最低涨跌幅（or、hr、lr，仅股票）

**返回数据字段:**
- 基础价格数据：open、high、low、close、volume、amount
- 均线系统：MA3、MA5、MA10、MA20、MA30、MA60、MA120、MA250、MA450
- 换手率指标：HSL、HS05、HS10、HS25、HS250、HHS60、HHS120、HHS250
- 成交额均线：A10、A60、A120、A250
- 切线角度：tan3、T34、tan10
- 价格均线关系：CMA10、CMA20、CMA30、CMA60、CMA120、CMA250、CMA450
- 最高最低价：H3、H5、H20、L20、H60、L60、H120、L120、H250、L250
- 成交量指标：VL20、V0LLV
- 涨跌幅：RATE、R3、R5、R10、R20、R30、R60、R120、R250
- 开盘/最高/最低涨跌幅：or、hr、lr

### saveExtentData(self, end_date=None, frequence='d', renew=False)

保存扩展数据到MongoDB。

**参数:**
- `end_date` (str, optional): 结束日期
- `frequence` (str, optional): 频率，默认为'd'
- `renew` (bool, optional): 是否强制更新，默认为False

**功能说明:**
- 根据类型选择对应的数据库集合
- 创建索引（code和date）
- 如果renew=True，删除该代码的所有旧数据
- 从数据库中查找最新日期，接着上次获取的日期继续更新
- 如果数据库中没有数据，从起始日期开始获取
- 初始化扩展数据并保存到数据库
- 特殊处理指数880812和880863的涨跌幅计算

### loadExtentData(self, start_date=None, end_date=None, frequence='d', client=DATABASE)

从MongoDB加载扩展数据。

**参数:**
- `start_date` (str, optional): 开始日期
- `end_date` (str, optional): 结束日期
- `frequence` (str, optional): 频率，默认为'd'
- `client` (object, optional): 数据库客户端，默认为DATABASE

**返回值:**
- `pd.DataFrame`: 扩展数据DataFrame，如果没有数据则返回空DataFrame

**功能说明:**
- 根据频率选择对应的数据库集合（日线或周线）
- 根据类型选择对应的数据库集合
- 查询指定日期范围的数据
- 返回DataFrame格式的数据（去除_id字段）

### InitExtentData_Week(self, startDay=None, end_date=None)

初始化周线扩展数据。

**参数:**
- `startDay` (str, optional): 开始日期，默认为'2005-01-04'
- `end_date` (str, optional): 结束日期

**功能说明:**
- 根据类型获取日线数据
- 将日线数据重采样为周线数据
- 计算周线均线系统（MA3、MA4、MA5、MA8、MA10、MA12、MA15、MA20、MA30、MA35、MA40、MA45、MA50、MA60、MA100、MA150）

**返回数据字段:**
- 基础价格数据：open、high、low、close、volume、amount
- 均线系统：MA3、MA4、MA5、MA8、MA10、MA12、MA15、MA20、MA30、MA35、MA40、MA45、MA50、MA60、MA100、MA150

### saveExtentData_week(self, end_date=None, renew=False, client=DATABASE)

保存周线扩展数据到MongoDB。

**参数:**
- `end_date` (str, optional): 结束日期
- `renew` (bool, optional): 是否强制更新，默认为False
- `client` (object, optional): 数据库客户端，默认为DATABASE

**功能说明:**
- 根据类型选择对应的数据库集合（stock_data_week_extent、index_data_week_extent）
- 创建索引（code和date）
- 如果renew=True，删除该代码的所有旧数据
- 从数据库中查找最新日期，接着上次获取的日期继续更新
- 如果数据库中没有数据，从起始日期开始获取
- 初始化周线扩展数据并保存到数据库
