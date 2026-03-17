# CDataDay 模块文档

## 模块概述

CDataDay 提供日线数据处理功能，支持股票、指数、期货等各类金融产品的日线数据获取。该类是CBaseData的底层数据提供者。

## 核心功能

- **日线数据获取**: 获取股票、指数、期货的日线数据
- **复权处理**: 支持前复权数据处理
- **多频率支持**: 支持日线、周线、月线数据

## 支持的类型

- STOCK: 股票
- INDEX: 指数
- FUTURE: 期货

## 依赖模块

- Tools
- Parameter
- QAUtil
- QAFetch

---

## 类定义

### class CDataDay()

日线数据处理类。

#### \_\_init\_\_(self, code, ctype='STOCK', end_date=None, days=250, offset=260, category=None)

初始化类。

**参数:**
- `code` (str): 代码
- `ctype` (str, optional): 类型，默认为'STOCK'
- `end_date` (str, optional): 数据截止日期，默认当前最后交易日期 GLOBALMAP.TODAY()
- `days` (int, optional): 天数，默认为250
- `offset` (int, optional): 取数的偏移量，确保250运算正确，默认为260
- `category` (str, optional): 分类，默认为None

---

## 方法详细说明

### getData(self, end_date=None, days=None, offset=DAYOFFSET, frequence='d', online=True, category=None)

获取日线数据。

**参数:**
- `end_date` (str, optional): 结束日期
- `days` (int, optional): 天数
- `offset` (int, optional): 偏移量
- `frequence` (str, optional): 频率，默认为'd'（日线）
  - 'd': 日线
  - 'w': 周线
  - 'm': 月线
- `online` (bool, optional): 是否在线，默认为True
  - False: 从本地数据库取数，支持前复权
  - True: 从网络取数，不支持实时复权
- `category` (str, optional): 分类

**返回值:**
- `DataFrame`: 日线数据

**功能说明:**
- 本地取数（online=False）：
  - STOCK类型：使用QA_fetch_stock_day_adv，支持前复权
  - INDEX类型：使用QA_fetch_index_day_adv
  - FUTURE类型：使用QA_fetch_future_day_adv
  - 计算preclose（昨日收盘）
  
- 网络取数（online=True）：
  - STOCK类型：使用QA_fetch_get_stock_day
  - INDEX类型：使用QA_fetch_get_index_day
  - FUTURE类型：使用QA_fetch_get_future_day
  - 不支持复权，adj=1
  - 计算preclose（昨日收盘）

**返回数据字段:**
- date: 日期
- code: 代码
- open: 开盘价
- close: 收盘价
- low: 最低价
- high: 最高价
- volume: 成交量
- amount: 成交额
- adj: 复权因子（仅本地取数）
- preclose: 昨日收盘

**代码示例:**
```python
from FQMarket.FQUtil.CDataDay import CDataDay

# 获取股票日线数据（本地，前复权）
data_day = CDataDay('000001', ctype='STOCK')
data = data_day.getData(online=False, days=250)
print(data.tail())

# 获取指数日线数据
data_day = CDataDay('000001', ctype='INDEX')
data = data_day.getData(online=False, days=250)
print(data.tail())

# 获取周线数据
data = data_day.getData(frequence='w', days=100)
print(data.tail())
```
