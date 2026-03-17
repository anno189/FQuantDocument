# ToolsRedisData 模块文档

## 模块概述

ToolsRedisData 模块提供Redis缓存数据的初始化和管理功能。该模块负责设置Redis中各类数据结构的初始化，包括市场实时数据、成交量数据、市值分位数据等，以及昨日数据初始化等功能。

## 核心功能

- **Redis初始化**: 初始化Redis中各类数据结构
- **市值分位管理**: 设置和管理市值分位数据
- **昨日数据初始化**: 初始化昨日JSON数据到Redis

## 依赖模块

- direct_redis
- redis_json_storage
- dotty_dict
- CIndexData
- CFutureData
- Tools
- Parameter
- ToolsGetData

## 函数列表

| 函数名 | 功能描述 |
|--------|----------|
| set_Redis_empty | 初始化Redis为空数据结构 |
| set_Redis_shizhiValues | 设置市值分位数据到Redis和数据库 |
| set_db_shizhiValues | 保存市值分位数据到数据库 |
| set_Redis_Yestoday | 初始化昨日JSON数据到Redis |

---

## 函数详细说明

### set_Redis_empty()

初始化Redis中的各类数据结构为空值。

**功能说明:**
- 初始化涨跌统计数据：DataFrame_StockIncCount, DataFrame_StockConCount
- 初始化量比数据：DataFrame_StockVRate, DataFrame_StockVRateDay
- 初始化评分数据：DataFrame_StockScoreDay
- 初始化涨停时间：DataFrame_LimitUpTime
- 初始化竞价数据：DataFrame_predata, DataFrame_pretopdata
- 初始化涨停打板数据：datalimitup
- 初始化分时跟踪数据：DataFrame_Realtime
- 初始化概念分类数据：n1namecount
- 调用set_Redis_Yestoday初始化昨日数据
- 发送初始化完成通知

**代码示例:**
```python
from FQMarket.FQUtil.ToolsRedisData import set_Redis_empty

# 初始化Redis
set_Redis_empty()
```

### set_Redis_shizhiValues(end_date=None, data=None, redis=True, db=True)

设置市值分位数据到Redis和数据库。

**参数:**
- `end_date` (str, optional): 结束日期，默认为今日
- `data` (DataFrame, optional): 股票列表数据，默认为None
- `redis` (bool, optional): 是否保存到Redis，默认为True
- `db` (bool, optional): 是否保存到数据库，默认为True

**返回值:**
- `list`: 市值分位值列表 [micro, small, middle, big]

**功能说明:**
- 获取股票列表数据
- 计算流通市值标准化值
- 计算市场市值分位数
- 保存到Redis的shizhiValues
- 保存到数据库的shizhiValues.csv文件

**代码示例:**
```python
from FQMarket.FQUtil.ToolsRedisData import set_Redis_shizhiValues

# 设置今日市值分位数据
shizhi_values = set_Redis_shizhiValues()

# 设置指定日期市值分位数据
shizhi_values = set_Redis_shizhiValues(end_date='2024-01-31')
print(shizhi_values)
```

### set_db_shizhiValues(end_date=None)

保存市值分位数据到数据库CSV文件。

**参数:**
- `end_date` (str, optional): 结束日期

**功能说明:**
- 计算市场市值分位数
- 保存到shizhiValues.csv文件

**代码示例:**
```python
from FQMarket.FQUtil.ToolsRedisData import set_db_shizhiValues

# 保存市值分位数据到数据库
set_db_shizhiValues(end_date='2024-01-31')
```

### set_Redis_Yestoday(end_date=None)

初始化昨日JSON数据到Redis。

**参数:**
- `end_date` (str, optional): 结束日期，默认为今日

**功能说明:**
- 获取各指数20日成交金额数据（上证指数、深证成指、创业板指、科创50、北证50等）
- 初始化成交量及今日预测模块JSON数据
- 初始化温度雷达图JSON数据
- 初始化上证指数分时数据
- 初始化涨跌分布数据
- 初始化市场ABC数据
- 初始化分钟数据
- 初始化情绪数据
- 初始化竞价数据
- 保存所有JSON数据到Redis

**代码示例:**
```python
from FQMarket.FQUtil.ToolsRedisData import set_Redis_Yestoday

# 初始化昨日数据
set_Redis_Yestoday()

# 初始化指定日期昨日数据
set_Redis_Yestoday(end_date='2024-01-31')
```
