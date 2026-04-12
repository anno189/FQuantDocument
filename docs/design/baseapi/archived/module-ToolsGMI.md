# ToolsGMI 模块文档

## 模块概述

ToolsGMI 模块提供GMI（General Market Index，通用市场指数）计算功能。该模块用于计算和更新多个市场指数的综合指标。

## 核心功能

- **GMI计算**: 计算上证、深证、创业板、北交所等多个市场的综合指数
- **指数更新**: 更新各市场指数数据到数据库

## 依赖模块

- ToolsGetData
- CIndexData
- ToolsSaveData
- Parameter

## 函数列表

| 函数名 | 功能描述 |
|--------|----------|
| calculateGMI | 计算GMI综合市场指数 |
| saveGMI | 保存GMI数据到数据库 |
| updateAllIndexData | 更新所有指数数据 |

---

## 函数详细说明

### calculateGMI(end_date=None)

计算GMI（通用市场指数），综合多个市场指数的表现。

**参数:**
- `end_date` (str, optional): 计算日期，默认为今日

**返回值:**
- `float`: GMI指数值

**功能说明:**
- 获取上证指数(000001)、深证成指(399001)、创业板指(399006)、北证50(899050)等主要指数
- 计算各指数的涨跌幅
- 综合计算得出GMI指数值

**代码示例:**
```python
from FQMarket.FQUtil.ToolsGMI import calculateGMI

# 计算今日GMI
gmi_value = calculateGMI()

# 计算指定日期GMI
gmi_value = calculateGMI(end_date='2024-01-31')
```

### saveGMI(end_date=None)

保存GMI数据到MongoDB数据库。

**参数:**
- `end_date` (str, optional): 日期，默认为今日

**返回值:**
- `dict`: 保存的GMI数据字典

**功能说明:**
- 调用calculateGMI计算GMI值
- 将GMI数据保存到数据库的gmi_data集合中

**代码示例:**
```python
from FQMarket.FQUtil.ToolsGMI import saveGMI

# 保存今日GMI数据
gmi_data = saveGMI()

# 保存指定日期GMI数据
gmi_data = saveGMI(end_date='2024-01-31')
```

### updateAllIndexData(end_date=None)

更新所有指数数据，包括各主要指数的日线数据。

**参数:**
- `end_date` (str, optional): 结束日期，默认为今日

**返回值:**
- `bool`: 更新是否成功

**功能说明:**
- 更新上证指数(000001)
- 更新深证成指(399001)
- 更新创业板指(399006)
- 更新北证50(899050)
- 更新科创50(000688)
- 更新沪深300(000300)
- 保存GMI数据

**代码示例:**
```python
from FQMarket.FQUtil.ToolsGMI import updateAllIndexData

# 更新今日所有指数数据
success = updateAllIndexData()

# 更新指定日期所有指数数据
success = updateAllIndexData(end_date='2024-01-31')
```
