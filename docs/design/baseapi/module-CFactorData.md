# CFactorData 模块文档

## 模块概述

CFactorData 是因子数据基类，用于个股/指数的因子基础数据运算和保存。该类结合 Stock/Index 使用，提供技术指标因子的计算和管理功能。

## 核心功能

- **因子数据计算**: 计算各类技术指标因子
- **因子数据重新计算**: 重新计算因子数据
- **多频率支持**: 支持日线、周线因子数据

## 依赖模块

- FQFactor
- QAUtil
- QAFetch

## 技术指标

- IKDJ: KDJ指标
- ICF01: CF01指标
- IMACD: MACD指标
- IBIAS36: BIAS36指标
- ICR: CR指标
- IXHS: XHS指标

---

## 类定义

### class CFactorData()

因子数据基类。

---

## 方法详细说明

### RecaluFactorData(self, frequence='d')

重新计算因子数据。

**参数:**
- `frequence` (str, optional): 频率，默认为'd'（日线）
  - 'd': 日线
  - 'w': 周线

**功能说明:**
- 根据类型和频率选择对应的数据库集合
- 创建索引（code和date）
- 加载扩展数据和因子数据
- 计算XHS指标
- 删除旧数据并插入新数据

**代码示例:**
```python
from FQMarket.FQUtil.CFactorData import CFactorData

# 注意：CFactorData通常作为基类被其他类继承使用
# 具体使用请参考CStockData或CIndexData
```

### InitDayFactor(self, startDay=None, end_date=None, frequence='d')

初始化日线因子数据。

**参数:**
- `startDay` (str, optional): 开始日期
- `end_date` (str, optional): 结束日期
- `frequence` (str, optional): 频率，默认为'd'

**功能说明:**
- 从指定开始日期获取数据
- 支持INDEX、STOCK等类型
- 对于行业和概念板块，处理特殊的流通股本数据

**返回数据字段:**
- 各类技术指标因子
- 均线系统
- 成交量相关指标
- 价格相关指标
