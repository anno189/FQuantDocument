# ToolsStrategyPools 模块文档

## 模块概述

ToolsStrategyPools 模块提供策略股票池的加载和选股功能。该模块用于从数据库加载预定义的策略股票池，并提供基于技术指标的选股功能，如均线突破、KDJ指标筛选等。

## 核心功能

- **策略股票池加载**: 从数据库加载预定义的策略股票池
- **均线突破选股**: 基于均线突破的选股策略
- **KDJ指标选股**: 基于KDJ指标的选股策略
- **成交金额筛选**: 基于成交金额的筛选

## 依赖模块

- FQFactor
- pandas
- numpy
- Parameter
- QAUtil

## 函数列表

| 函数名 | 功能描述 |
|--------|----------|
| load_strategy_pools | 加载策略股票池 |
| sp_line_days | 均线突破选股 |
| sp_kdj_allbase | KDJ指标选股 |
| sp_min_amount | 最小成交金额筛选 |

---

## 函数详细说明

### load_strategy_pools(date=None, strategy='str60_base', client=DATABASE)

从数据库加载策略股票池。

**参数:**
- `date` (str, optional): 日期，默认为今日
- `strategy` (str, optional): 策略名称，默认为'str60_base'
- `client` (MongoClient, optional): MongoDB客户端，默认为DATABASE

**返回值:**
- `DataFrame`: 策略股票池数据，包含code、date、strategy列

**功能说明:**
- 从strategy_pools集合读取指定日期和策略的股票池
- 返回符合条件的股票列表

**代码示例:**
```python
from FQMarket.FQUtil.ToolsStrategyPools import load_strategy_pools

# 加载今日策略股票池
pools = load_strategy_pools(strategy='str60_base')
print(pools)

# 加载指定日期策略股票池
pools = load_strategy_pools(date='2024-01-31', strategy='str60_base')
```

### sp_line_days(end_date=None, lists=None, days=60, client=DATABASE)

均线突破选股策略。

**参数:**
- `end_date` (str, optional): 结束日期，默认为今日
- `lists` (list, optional): 股票代码列表，默认为None（全部）
- `days` (int, optional): 均线天数，默认为60
- `client` (MongoClient, optional): MongoDB客户端，默认为DATABASE

**返回值:**
- `DataFrame`: 符合均线突破条件的股票数据

**功能说明:**
- 筛选收盘价大于MA60的股票
- 筛选突破指定天数均线的股票
- 筛选成交量满足条件的股票
- 筛选突破3日高点的股票

**代码示例:**
```python
from FQMarket.FQUtil.ToolsStrategyPools import sp_line_days

# 均线突破选股
stocks = sp_line_days(days=60)
print(stocks)

# 在指定股票池中选股
stocks = sp_line_days(lists=['000001', '000002'], days=60)
```

### sp_kdj_allbase(end_date=None, lists=None, AMOUNT20=0, client=DATABASE)

基于KDJ指标的选股策略。

**参数:**
- `end_date` (str, optional): 结束日期，默认为今日
- `lists` (list, optional): 股票代码列表，默认为None（全部）
- `AMOUNT20` (float, optional): 20日成交金额阈值，默认为0（不限制）
- `client` (MongoClient, optional): MongoDB客户端，默认为DATABASE

**返回值:**
- `DataFrame`: 符合KDJ条件的股票数据

**功能说明:**
- 筛选JLong大于JLMA的股票
- 筛选满足多种KDJ组合条件的股票
- 可按20日成交金额排序和筛选

**代码示例:**
```python
from FQMarket.FQUtil.ToolsStrategyPools import sp_kdj_allbase

# KDJ指标选股
stocks = sp_kdj_allbase()
print(stocks)

# 限制20日成交金额
stocks = sp_kdj_allbase(AMOUNT20=1000000000)
```

### sp_min_amount(end_date=None, lists=None, amount=0, client=DATABASE)

最小成交金额筛选。

**参数:**
- `end_date` (str, optional): 结束日期，默认为今日
- `lists` (list, optional): 股票代码列表，默认为None（全部）
- `amount` (float, optional): 最小成交金额，默认为0
- `client` (MongoClient, optional): MongoDB客户端，默认为DATABASE

**返回值:**
- `DataFrame`: 符合成交金额条件的股票数据

**功能说明:**
- 筛选满足基本成交量条件的股票
- 可设置最小成交金额阈值

**代码示例:**
```python
from FQMarket.FQUtil.ToolsStrategyPools import sp_min_amount

# 成交金额筛选
stocks = sp_min_amount()
print(stocks)

# 设置最小成交金额
stocks = sp_min_amount(amount=50000000)
```
