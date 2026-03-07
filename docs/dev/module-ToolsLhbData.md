# ToolsLhbData 模块文档

## 模块概述

ToolsLhbData 模块提供龙虎榜数据的获取、保存、加载和分析功能。龙虎榜数据是A股市场重要的交易信息，包含每日涨跌幅偏离值达到7%的股票、振幅达到15%的股票、换手率达到20%的股票等交易公开信息。

## 核心功能

- **龙虎榜数据获取**: 从交易所获取每日龙虎榜数据
- **数据保存**: 将龙虎榜数据保存到MongoDB数据库
- **数据加载**: 从数据库加载龙虎榜数据
- **数据分析**: 分析龙虎榜数据，识别营业部动向、主力资金流向等

## 依赖模块

- akshare
- pandas
- ToolsGetData
- ToolsSaveData
- CStockData

## 函数列表

| 函数名 | 功能描述 |
|--------|----------|
| getLhbDataFromAkshare | 从Akshare获取龙虎榜数据 |
| saveLhbData | 保存龙虎榜数据到数据库 |
| loadLhbData | 从数据库加载龙虎榜数据 |
| getStockLhbHistory | 获取某只股票的龙虎榜历史 |
| getYYBHistory | 获取某个营业部的龙虎榜历史 |
| analyzeLhbData | 分析龙虎榜数据 |

---

## 函数详细说明

### getLhbDataFromAkshare(date=None)

从Akshare财经数据接口获取指定日期的龙虎榜数据。

**参数:**
- `date` (str, optional): 日期，格式为'YYYYMMDD'，默认为今日

**返回值:**
- `pandas.DataFrame`: 龙虎榜数据DataFrame

**功能说明:**
- 调用akshare接口获取龙虎榜数据
- 包含股票代码、名称、收盘价、涨跌幅、成交额、营业部信息等
- 数据包含每日涨幅偏离值达7%、振幅达15%、换手率达20%等股票

**代码示例:**
```python
from FQMarket.FQUtil.ToolsLhbData import getLhbDataFromAkshare

# 获取今日龙虎榜数据
lhb_df = getLhbDataFromAkshare()

# 获取指定日期龙虎榜数据
lhb_df = getLhbDataFromAkshare(date='20240131')
print(lhb_df.head())
```

### saveLhbData(date=None)

保存指定日期的龙虎榜数据到MongoDB数据库。

**参数:**
- `date` (str, optional): 日期，格式为'YYYYMMDD'，默认为今日

**返回值:**
- `bool`: 保存是否成功

**功能说明:**
- 调用getLhbDataFromAkshare获取数据
- 将数据保存到lhb_data集合
- 自动去重，避免重复保存
- 创建日期索引便于查询

**代码示例:**
```python
from FQMarket.FQUtil.ToolsLhbData import saveLhbData

# 保存今日龙虎榜数据
success = saveLhbData()

# 保存指定日期龙虎榜数据
success = saveLhbData(date='20240131')
print(f'保存成功: {success}')
```

### loadLhbData(start_date=None, end_date=None, code=None)

从数据库加载龙虎榜数据。

**参数:**
- `start_date` (str, optional): 开始日期，格式为'YYYYMMDD'
- `end_date` (str, optional): 结束日期，格式为'YYYYMMDD'
- `code` (str, optional): 股票代码，可选

**返回值:**
- `pandas.DataFrame`: 龙虎榜数据DataFrame

**功能说明:**
- 支持按日期范围查询
- 支持按股票代码查询
- 返回符合条件的所有龙虎榜数据

**代码示例:**
```python
from FQMarket.FQUtil.ToolsLhbData import loadLhbData

# 加载某只股票的龙虎榜数据
lhb_df = loadLhbData(code='000001')

# 加载日期范围的龙虎榜数据
lhb_df = loadLhbData(start_date='20240101', end_date='20240131')
print(lhb_df)
```

### getStockLhbHistory(code, start_date=None, end_date=None)

获取某只股票的龙虎榜历史数据。

**参数:**
- `code` (str): 股票代码
- `start_date` (str, optional): 开始日期
- `end_date` (str, optional): 结束日期

**返回值:**
- `pandas.DataFrame`: 该股票的龙虎榜历史数据

**功能说明:**
- 查询指定股票在指定时间范围内的所有龙虎榜记录
- 包含上榜日期、上榜原因、买卖营业部等信息

**代码示例:**
```python
from FQMarket.FQUtil.ToolsLhbData import getStockLhbHistory

# 获取某只股票的龙虎榜历史
history_df = getStockLhbHistory(code='000001', start_date='20230101', end_date='20240131')
print(history_df)
```

### getYYBHistory(yyb_name, start_date=None, end_date=None)

获取某个营业部的龙虎榜历史数据。

**参数:**
- `yyb_name` (str): 营业部名称
- `start_date` (str, optional): 开始日期
- `end_date` (str, optional): 结束日期

**返回值:**
- `pandas.DataFrame`: 该营业部的龙虎榜历史数据

**功能说明:**
- 查询指定营业部在指定时间范围内的所有龙虎榜交易记录
- 可用于分析知名营业部的动向和风格

**代码示例:**
```python
from FQMarket.FQUtil.ToolsLhbData import getYYBHistory

# 获取某个营业部的龙虎榜历史
yyb_df = getYYBHistory(yyb_name='华泰证券股份有限公司深圳益田路证券营业部')
print(yyb_df)
```

### analyzeLhbData(date=None)

分析指定日期的龙虎榜数据。

**参数:**
- `date` (str, optional): 日期，默认为今日

**返回值:**
- `dict`: 分析结果字典，包含热门股票、活跃营业部等信息

**功能说明:**
- 统计当日上榜股票数量
- 识别买卖金额最大的股票
- 识别最活跃的营业部
- 分析资金流向

**代码示例:**
```python
from FQMarket.FQUtil.ToolsLhbData import analyzeLhbData

# 分析今日龙虎榜
analysis = analyzeLhbData()
print('热门股票:', analysis['hot_stocks'])
print('活跃营业部:', analysis['active_yyb'])
```
