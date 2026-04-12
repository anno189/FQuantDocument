# CFutureData 模块文档

## 模块概述

CFutureData 是期货/外盘指数数据类，继承自CBaseData。该类提供了期货和外盘指数数据的初始化和管理功能，支持恒生指数、原油等外盘指数的数据获取。

## 核心功能

- **期货信息管理**: 管理期货的基本信息
- **期货数据初始化**: 初始化期货数据

## 主要期货/外盘指数代码

- IFL8: 沪深当月
- ICL8: 中证主连
- IHL8: 上证主连
- 7_RQ: 沪深融券余额
- 7_RZ: 沪深融资余额
- 7_TETF: ETF基金规模
- YANG: 富时中国三倍做空
- YINN: 富时中国三倍做多
- SCL8: 原油主连
- HSI: 恒生指数

## 继承关系

CFutureData继承自：
- CBaseData: 基础数据类

## 依赖模块

- CBaseData
- FQFactor
- QAUtil

---

## 类定义

### class CFutureData(CBaseData)

期货/外盘指数数据类。

#### \_\_init\_\_(self, code, name=None, startDay=None, end_date=None, days=250, daysOffset=260, online=False, category=None)

初始化类。

**参数:**
- `code` (str): 期货代码
- `name` (str, optional): 期货名称，默认为None
- `startDay` (str, optional): 开始日期，默认为None
- `end_date` (str, optional): 数据截止日期，默认当前最后交易日期 GLOBALMAP.TODAY()
- `days` (int, optional): 取数周期，默认250天
- `daysOffset` (int, optional): 取数周期偏移，默认60天
- `online` (bool, optional): 取数位置
  - True：从网络取数据
  - False：从本地取数
- `category` (str, optional): 分类，默认为None

**功能说明:**
- 初始化期货代码等信息
- 调用getFutureInfo获取期货信息

---

## 方法详细说明

### getFutureInfo(self, category=None)

获取期货信息。

**参数:**
- `category` (int, optional): 分类，默认为None

**返回值:**
- `tuple`: (category, name) 分类和名称

**功能说明:**
- 从期货列表中查找对应代码的信息
- 返回分类和名称

**代码示例:**
```python
from FQMarket.FQUtil.CFutureData import CFutureData

# 初始化恒生指数
future = CFutureData('HSI', online=True)
category, name = future.getFutureInfo()
print(category, name)
```

### InitData(self)

初始化期货数据。

**返回值:**
- `DataFrame`: 初始化后的期货数据

**功能说明:**
- 调用dayData获取日线数据（online=True）
- 清洗空数据

**代码示例:**
```python
from FQMarket.FQUtil.CFutureData import CFutureData

# 初始化恒生指数数据
future = CFutureData('HSI', online=True)
data = future.InitData()
print(data.tail())

# 注意：外盘数据的amount单位可能需要调整
# 例如：data['amount'] = (data['amount'] / 100).round(0)
```
