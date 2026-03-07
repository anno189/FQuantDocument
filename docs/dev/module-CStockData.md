# CStockData 模块文档

## 模块概述

CStockData 是个股数据类，继承自CBaseData。该类提供了个股基本信息的管理、初始化数据运算、数据保存和加载等功能。主要用于处理个股的基础数据，包括涨跌停计算、连板统计、股性评分等。

## 核心功能

- **个股信息管理**: 管理个股的基本信息
- **初始化数据运算**: 计算涨跌停、连板、股性等指标
- **数据保存**: 保存初始化数据到数据库
- **数据加载**: 从数据库加载基础数据

## 继承关系

CStockData继承自：
- CBaseData: 基础数据类

## 依赖模块

- CBaseData
- Tools
- FQFactor
- QAUtil

## 类定义

### class CStockData(CBaseData)

个股基本信息类。

#### \_\_init\_\_(self, code, name=None, end_date=None, days=250, daysOffset=260, online=False)

初始化类。

**参数:**
- `code` (str): 股票代码
- `name` (str, optional): 股票名称，默认为None
- `end_date` (str, optional): 数据截止日期，默认当前最后交易日期 GLOBALMAP.TODAY()
- `days` (int, optional): 取数周期，默认250天，至少满足年线的计算周期
- `daysOffset` (int, optional): 取数周期偏移，默认60天，不少于30天，用于弥补年线运算及新股未开板周期补偿
- `online` (bool, optional): 取数位置，如无特别需要，建议先同步数据到本地，使用本地数据运算复权
  - True：从网络取数据，当前FQData不支持实时复权，从线上取数只能使用未复权数据
  - False：从本地取数

**功能说明:**
- 初始化股票代码、名称等信息
- 判断是否为ST股票
- 判断是否为创业板（CY）、科创板、北交所（BJ）股票

---

## 方法详细说明

### RecaluBaseData(self)

重新计算基础数据。

**功能说明:**
- 加载基础数据
- 计算5日每分钟平均成交量
- 删除旧数据并插入新数据

**代码示例:**
```python
from FQMarket.FQUtil.CStockData import CStockData

stock = CStockData('000001')
stock.RecaluBaseData()
```

### getBaseInformation(self, code)

获取基础信息。

**参数:**
- `code` (str): 信息字段名

**返回值:**
- `any`: 信息值

**功能说明:**
- 从Redis的DataFrame_StockList获取股票信息
- 临时处理退市股

**代码示例:**
```python
from FQMarket.FQUtil.CStockData import CStockData

stock = CStockData('000001')
name = stock.getBaseInformation('name')
print(name)
```

### InitBaseData(self, startDay=None, end_date=None)

初始化基础数据，盘后/开盘前的数据运算。

**参数:**
- `startDay` (str, optional): 开始日期
- `end_date` (str, optional): 结束日期

**返回值:**
- `DataFrame`: 初始化后的基础数据

**功能说明:**
- 使用前复权数据计算
- 计算涨跌停价格（考虑注册制、ST、创业板、科创板、北交所等不同规则）
- 计算涨跌停标识（hprice）
- 计算连板数量（hcount）
- 计算涨停开板（hstop）、跌停开板（lstop）
- 计算股性评分（gx5, gx20）
- 计算5日每分钟平均成交量（mvm5d）

**返回数据字段:**
- date: 日期
- code: 代码
- open: 开盘价
- last_close: 收盘价
- low: 最低价
- high: 最高价
- volume: 成交量
- amount: 成交额
- mvm5d: 5日每分钟平均成交量
- limitup: 涨停价
- limitdo: 跌停价
- hprice: 涨跌停标识（1涨停，-1跌停，0正常）
- hcount: 连板数量
- hstop: 涨停开板
- lstop: 跌停开板
- gx5: 5日股性
- gx20: 20日股性

**代码示例:**
```python
from FQMarket.FQUtil.CStockData import CStockData

stock = CStockData('000001')
base_data = stock.InitBaseData(end_date='2024-01-31')
print(base_data[['date', 'last_close', 'hprice', 'hcount']].tail())
```

### saveInitData(self, client=DATABASE, end_date=None, renew=False)

保存初始化数据到数据库。

**参数:**
- `client` (MongoClient, optional): MongoDB客户端，默认为DATABASE
- `end_date` (str, optional): 结束日期
- `renew` (bool, optional): 是否更新，默认为False

**功能说明:**
- 创建索引（code和date）
- 如果renew为True，删除该代码的所有数据
- 接着上次获取的日期继续更新，或从GLOBALMAP.start_date开始
- 调用InitBaseData计算数据
- 保存到stock_data_base集合

**代码示例:**
```python
from FQMarket.FQUtil.CStockData import CStockData

stock = CStockData('000001')
# 首次保存或更新
stock.saveInitData()
# 强制重新保存
stock.saveInitData(renew=True)
```

### loadBaseData(self, startDay=None, end_date=None, client=DATABASE)

加载基础信息。

**参数:**
- `startDay` (str, optional): 开始日期
- `end_date` (str, optional): 结束日期
- `client` (MongoClient, optional): MongoDB客户端，默认为DATABASE

**返回值:**
- `DataFrame`: 基础数据

**功能说明:**
- 从stock_data_base集合加载数据
- 支持日期范围查询

**代码示例:**
```python
from FQMarket.FQUtil.CStockData import CStockData

stock = CStockData('000001')
# 加载全部数据
data = stock.loadBaseData()
# 加载日期范围数据
data = stock.loadBaseData(startDay='2024-01-01', end_date='2024-01-31')
print(data.tail())
```
