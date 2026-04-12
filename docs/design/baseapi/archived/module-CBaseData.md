# CBaseData 模块文档

## 模块概述

CBaseData 是基础数据类，继承自CFactorData和CExtentData。该类提供了股票、指数、期货等各类金融产品的基础数据操作功能，包括日线数据、分时数据的获取和管理。通过Redis实现数据持久化。

## 核心功能

- **数据初始化**: 初始化股票、指数、期货等各类数据
- **分时数据获取**: 获取分时（Tick）数据
- **日线数据获取**: 获取日线、周线、月线数据
- **数据补偿**: 提供分时数据补偿功能

## 继承关系

CBaseData继承自：
- CFactorData: 因子数据类
- CExtentData: 扩展数据类

## 依赖模块

- CDataTick
- CDataDay
- CFactorData
- CExtentData
- Parameter
- QAUtil

## 类定义

### class CBaseData(CFactorData, CExtentData)

基础数据类，包括日线数据，分时数据，分析数据等等。通过redis实现数据持久化。

#### \_\_init\_\_(self, code, ctype='STOCK', category=None)

初始化类。

**参数:**
- `code` (str): 代码
- `ctype` (str, optional): 类型，默认为'STOCK'
- `category` (str, optional): 分类，默认为None

**功能说明:**
- 初始化代码、类型等基本属性
- 设置默认天数和偏移量
- 对于期货类型，自动获取期货信息

---

## 方法详细说明

### getName(self, code, ctype='STOCK')

获取代码对应的名称。

**参数:**
- `code` (str): 代码
- `ctype` (str, optional): 类型，默认为'STOCK'

**返回值:**
- `str`: 名称

**功能说明:**
- STOCK类型：从Redis的DataFrame_StockList获取
- INDEX类型：从Redis的DataFrame_IndexList获取
- FUTURE类型：从Redis的DataFrame_IndexList获取

**代码示例:**
```python
from FQMarket.FQUtil.CBaseData import CBaseData

data = CBaseData('000001', ctype='STOCK')
name = data.getName('000001', ctype='STOCK')
print(name)
```

### tickData(self, end_date=None, days=1, frequence=1, category=None)

获取分时数据。

**参数:**
- `end_date` (str, optional): 结束日期，默认为今日
- `days` (int, optional): 天数，默认为1
- `frequence` (int, optional): 频率，默认为1
- `category` (str, optional): 分类，默认为None

**返回值:**
- `DataFrame`: 分时数据

**功能说明:**
- 初始化CDataTick类
- 获取指定日期、天数的分时数据
- 注意：category == 6的时候，取数有问题，未处理

**代码示例:**
```python
from FQMarket.FQUtil.CBaseData import CBaseData

data = CBaseData('000001', ctype='STOCK')
tick_data = data.tickData(days=1)
print(tick_data.head())
```

### tickDataCompensate(self, end_date=None, days=1, frequence=1, compensate=0, data=None)

分时数据补偿，返回指定日期、指定周期的分时数据。

**参数:**
- `end_date` (str, optional): 结束日期
- `days` (int, optional): 天数，默认为1
- `frequence` (int, optional): 频率，默认为1
- `compensate` (int, optional): 补偿参数，默认为0
  - -1: 含上日收盘价格
  - 0: 默认为0，长度为240周期，主要用于指标运算
  - 1: 当前时间，长度为截止到取数的时间周期长度 + 1，包含上日收盘价
  - 2: 当前时间，长度为截止到取数的时间周期长度，不包含上日收盘价
- `data` (DataFrame, optional): 数据，默认为None

**返回值:**
- `DataFrame`: 补偿后的分时数据

**功能说明:**
- 计算涨跌幅（rate）
- 计算累计成交额（sumamount）
- 修正恒生指数（HSI）数据长度

**代码示例:**
```python
from FQMarket.FQUtil.CBaseData import CBaseData

data = CBaseData('000001', ctype='STOCK')
# 获取包含上日收盘价的分时数据
tick_data = data.tickDataCompensate(compensate=1)
print(tick_data[['close', 'rate', 'sumamount']])
```

### dayDataAll(self, online=None)

获取全部日线数据。

**参数:**
- `online` (bool, optional): 是否在线，默认为None

**返回值:**
- `DataFrame`: 全部日线数据

**功能说明:**
- 从GLOBALMAP.start_date开始获取全部数据
- 初始化CDataDay类
- 返回全部历史数据

**代码示例:**
```python
from FQMarket.FQUtil.CBaseData import CBaseData

data = CBaseData('000001', ctype='STOCK')
all_data = data.dayDataAll()
print(f'共 {len(all_data)} 条数据')
```

### dayData(self, end_date=None, days=None, online=None, daysOffset=260, category=None)

获取日线数据。

**参数:**
- `end_date` (str, optional): 结束日期，默认为今日
- `days` (int, optional): 天数，默认为250
- `online` (bool, optional): 是否在线，默认为None
- `daysOffset` (int, optional): 天数偏移，默认为260
- `category` (str, optional): 分类，默认为None

**返回值:**
- `DataFrame`: 日线数据

**功能说明:**
- 初始化CDataDay类
- 获取指定天数的日线数据

**代码示例:**
```python
from FQMarket.FQUtil.CBaseData import CBaseData

data = CBaseData('000001', ctype='STOCK')
day_data = data.dayData(days=250)
print(day_data.tail())
```

### weekData(self, end_date=None, online=None, days=None, daysOffset=260, frequence='w')

获取周线数据。

**参数:**
- `end_date` (str, optional): 结束日期
- `online` (bool, optional): 是否在线
- `days` (int, optional): 天数
- `daysOffset` (int, optional): 天数偏移
- `frequence` (str, optional): 频率，默认为'w'

**返回值:**
- `DataFrame`: 周线数据

**代码示例:**
```python
from FQMarket.FQUtil.CBaseData import CBaseData

data = CBaseData('000001', ctype='STOCK')
week_data = data.weekData(days=100)
print(week_data.tail())
```

### monthData(self, end_date=None, online=None, days=None, daysOffset=260, frequence='m')

获取月线数据。

**参数:**
- `end_date` (str, optional): 结束日期
- `online` (bool, optional): 是否在线
- `days` (int, optional): 天数
- `daysOffset` (int, optional): 天数偏移
- `frequence` (str, optional): 频率，默认为'm'

**返回值:**
- `DataFrame`: 月线数据

**代码示例:**
```python
from FQMarket.FQUtil.CBaseData import CBaseData

data = CBaseData('000001', ctype='STOCK')
month_data = data.monthData(days=60)
print(month_data.tail())
```
