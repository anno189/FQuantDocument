# CMarket 模块文档

## 模块概述

CMarket 提供市场（大盘）数据的处理功能，包括全市场股票初始化、指数数据初始化、市场数据分析等。该模块是整个量化系统的核心市场数据管理模块。

## 核心功能

- **市场初始化**: 初始化全市场股票和指数数据
- **指数数据管理**: 管理各类宽基指数、行业指数、概念指数
- **Redis数据管理**: 管理Redis中的市场数据

## 主要指数列表

### 宽基指数
- 000001: 上证指数
- 399001: 深证成指
- 399006: 创业板指
- 000688: 科创50
- 000016: 上证50
- 000300: 沪深300
- 000903: 中证100
- 000905: 中证500
- 000852: 中证1000
- 000985: 中证全指

### 行业指数
- 880300 - 880499: 通达信细分行业

## Redis数据说明

- DataFrame_StockList: 复盘/初始化数据，每日盘前及盘后数据同步后运行
- DataFrame_BaseInfoList: 基本面数据

## 依赖模块

- CStockData
- CIndexData
- CFutureData
- ToolsGetData
- ToolsStrategyPools
- QAUtil
- FQFactor

---

## 类定义

### class CMarketData()

市场数据类。

#### \_\_init\_\_(self, end_date=None, GradeName=None)

初始化类。

**参数:**
- `end_date` (str, optional): 数据截止日期，默认当前最后交易日期 GLOBALMAP.TODAY()
- `GradeName` (str, optional): 等级名称，默认为None

---

## 方法详细说明

### marketInitIndexData(self, end_date=None, block_=True)

市场初始化指数数据。

**参数:**
- `end_date` (str, optional): 结束日期
- `block_` (bool, optional): 是否包含板块，默认为True

**功能说明:**
- 2023.02.19修订，重构算法
- 从widthindex.csv加载宽基指数列表
- 加载通达信细分行业（880300 - 880499）
- 加载概念板块
- 合并所有指数列表
- 检查指数扩展数据是否存在

**代码示例:**
```python
from FQMarket.FQUtil.CMarket import CMarketData

market = CMarketData()
# 初始化市场指数数据
market.marketInitIndexData(end_date='2024-01-31')
```
