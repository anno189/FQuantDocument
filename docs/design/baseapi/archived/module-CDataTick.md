# CDataTick 模块文档

## 模块概述

CDataTick 提供分时（Tick）数据处理功能，支持股票、指数、期货等各类金融产品的分时数据获取。该类是CBaseData的底层分时数据提供者。

## 核心功能

- **分时数据获取**: 获取股票、指数、期货的分时数据
- **多频率支持**: 支持不同频率的分时数据

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

### class CDataTick()

分时数据处理类。

#### \_\_init\_\_(self, code, ctype='STOCK', end_date=None, days=1, frequence=1, category=None)

初始化类。

**参数:**
- `code` (str): 代码
- `ctype` (str, optional): 类型，默认为'STOCK'
- `end_date` (str, optional): 数据截止日期，默认当前最后交易日期 GLOBALMAP.TODAY()
- `days` (int, optional): 天数，默认为1
- `frequence` (int, optional): 频率，默认为1
- `category` (str, optional): 分类，默认为None

**功能说明:**
- 初始化代码、类型等基本属性
- 根据代码设置每日分时周期数（dayticks）

---

## 方法详细说明

### getData(self, end_date=None, days=None, frequence=None)

获取分时数据。

**参数:**
- `end_date` (str, optional): 结束日期
- `days` (int, optional): 天数
- `frequence` (int, optional): 频率

**返回值:**
- `DataFrame`: 分时数据

**功能说明:**
- INDEX类型：使用QA_fetch_get_index_min
- STOCK类型：使用QA_fetch_get_stock_min
- FUTURE类型：使用QA_fetch_get_future_min

**代码示例:**
```python
from FQMarket.FQUtil.CDataTick import CDataTick

# 获取股票分时数据
data_tick = CDataTick('000001', ctype='STOCK')
data = data_tick.getData(days=1)
print(data.tail())

# 获取指数分时数据
data_tick = CDataTick('000001', ctype='INDEX')
data = data_tick.getData(days=1)
print(data.tail())
```
