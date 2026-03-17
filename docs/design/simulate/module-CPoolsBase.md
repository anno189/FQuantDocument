# CPoolsBase 模块文档

## 1. 模块概述

`CPoolsBase` 是量化交易模拟系统的基础类，提供了交易系统所需的核心功能，包括交易日志记录、手续费计算、数据获取、净值管理等。所有策略类都继承自此类，是整个模拟系统的基础。

## 2. 主要功能

- **交易日志管理**：记录交易日志和交易记录到数据库
- **手续费计算**：根据交易金额和日期计算手续费
- **市场状态检查**：检查市场状态，判断是否适合交易
- **数据获取**：获取股票和期货的历史数据
- **净值管理**：加载和保存净值数据
- **仓位管理**：加载和保存仓位数据
- **可视化**：生成净值曲线和持仓行业分布等可视化结果
- **报告生成**：生成交易报告

## 3. 核心类与方法

### 3.1 核心类

```python
class CPoolsBase():
    def __init__(self):
        pass
```

### 3.2 主要方法

#### 3.2.1 交易日志管理

**writelog**
- **功能**：记录交易日志到数据库
- **参数**：
  - `back_code`：策略代码
  - `date`：交易日期
  - `orders`：交易订单号
  - `tradelog`：交易日志内容
  - `price`：交易价格（可选）
  - `rate`：交易收益率（可选）
  - `client`：数据库客户端（默认：DATABASE）
- **返回值**：无

**writerecode**
- **功能**：记录交易记录到数据库
- **参数**：
  - `back_code`：策略代码
  - `code`：股票代码
  - `start_date`：买入日期
  - `buy`：买入价格
  - `end_date`：卖出日期
  - `sell`：卖出价格
  - `rate`：收益率
  - `days`：持仓天数
  - `client`：数据库客户端（默认：DATABASE）
- **返回值**：无

#### 3.2.2 手续费计算

**shouxufei**
- **功能**：计算交易手续费
- **参数**：
  - `code`：股票代码
  - `monery`：交易金额
  - `day`：交易日期（默认：'2023-08-27'）
  - `type`：交易类型（'B'买入，'S'卖出，默认：'B'）
- **返回值**：计算后的手续费金额

#### 3.2.3 市场状态检查

**checkmarketstatus**
- **功能**：检查市场状态
- **参数**：
  - `start_date`：开始日期
  - `end_date`：结束日期
- **返回值**：市场状态数据，包含推荐操作（'B'买入，'S'卖出）

#### 3.2.4 数据获取

**getStockExtentData**
- **功能**：获取股票扩展数据
- **参数**：
  - `code`：股票代码
  - `end_date`：结束日期
  - `days`：天数（默认：0）
  - `client`：数据库客户端（默认：DATABASE）
- **返回值**：股票扩展数据DataFrame

**getFutureData**
- **功能**：获取期货数据
- **参数**：
  - `code`：期货代码
  - `end_date`：结束日期
  - `days`：天数（默认：0）
  - `client`：数据库客户端（默认：DATABASE）
- **返回值**：期货数据DataFrame

#### 3.2.5 净值管理

**loadNetworth4DB**
- **功能**：从数据库加载净值数据
- **参数**：
  - `back_code`：策略代码
  - `start_date`：开始日期（可选）
  - `client`：数据库客户端（默认：DATABASE）
- **返回值**：净值数据DataFrame

**saveNetworth2DB**
- **功能**：保存净值数据到数据库
- **参数**：
  - `date`：日期
  - `networth`：净值
  - `values`：总价值
  - `allfunds`：现金
  - `pvalues`：持仓价值
  - `lposition`：持仓数量
  - `maxposition`：最大持仓数量
  - `maxnetworth`：最大净值
  - `rate`：成功率
  - `sucess`：成功交易次数
  - `fail`：失败交易次数
  - `client`：数据库客户端（默认：DATABASE）
- **返回值**：无

#### 3.2.6 仓位管理

**loadPosition4DB**
- **功能**：从数据库加载仓位数据
- **参数**：
  - `date`：日期
  - `reset`：是否重置日内价格（默认：True）
  - `hold_only`：是否只返回持仓（默认：True）
  - `client`：数据库客户端（默认：DATABASE）
- **返回值**：仓位数据DataFrame

**savePosition2DB**
- **功能**：保存仓位数据到数据库
- **参数**：
  - `data`：仓位数据
  - `date`：日期
  - `client`：数据库客户端（默认：DATABASE）
- **返回值**：无

#### 3.2.7 可视化

**writenetworth2json**
- **功能**：生成净值数据JSON和图表
- **参数**：
  - `start_date`：开始日期（可选）
  - `title`：图表标题（默认："组合回测"）
  - `subtitle`：图表副标题（默认："净值展示"）
  - `pic`：是否生成图片（默认：False）
  - `notebook`：是否在notebook中显示（默认：False）
- **返回值**：如果notebook为True，返回图表对象

**writeowner2json**
- **功能**：生成持仓数据JSON和图表
- **参数**：
  - `end_date`：结束日期（可选）
- **返回值**：无

#### 3.2.8 报告生成

**reportHTML**
- **功能**：生成HTML格式的交易报告
- **参数**：
  - `start_date`：开始日期（可选）
- **返回值**：无

## 4. 数据结构

### 4.1 交易日志数据结构

| 字段 | 类型 | 描述 |
|------|------|------|
| blockname | string | 策略代码 |
| date | string | 交易日期 |
| orders | integer | 交易订单号 |
| tradelog | string | 交易日志内容 |
| price | float | 交易价格 |
| rate | float | 交易收益率 |

### 4.2 交易记录数据结构

| 字段 | 类型 | 描述 |
|------|------|------|
| blockname | string | 策略代码 |
| code | string | 股票代码 |
| start_date | string | 买入日期 |
| buy | float | 买入价格 |
| end_date | string | 卖出日期 |
| sell | float | 卖出价格 |
| rate | float | 收益率 |
| days | integer | 持仓天数 |

### 4.3 净值数据结构

| 字段 | 类型 | 描述 |
|------|------|------|
| blockname | string | 策略代码 |
| date | string | 日期 |
| networth | float | 净值 |
| values | float | 总价值 |
| allfunds | float | 现金 |
| pvalues | float | 持仓价值 |
| lposition | integer | 持仓数量 |
| maxposition | integer | 最大持仓数量 |
| maxnetworth | float | 最大净值 |
| rate | float | 成功率 |
| sucess | integer | 成功交易次数 |
| fail | integer | 失败交易次数 |

### 4.4 仓位数据结构

| 字段 | 类型 | 描述 |
|------|------|------|
| blockname | string | 策略代码 |
| posidate | string | 仓位日期 |
| code | string | 股票代码 |
| date | string | 买入日期 |
| values | float | 买入价格 |
| count | integer | 持仓数量 |
| days | integer | 持仓天数 |
| networth | float | 净值 |
| hold | integer | 持仓状态（1：持仓，0：卖出） |
| open | float | 当日开盘价 |
| close | float | 当日收盘价 |
| high | float | 当日最高价 |
| low | float | 当日最低价 |

## 5. 使用示例

### 5.1 初始化基础类

```python
from FQMarket.Simulate.CPoolsBase import CPoolsBase

base = CPoolsBase()
```

### 5.2 记录交易日志

```python
base.writelog(
    back_code="strategy_001",
    date="2023-01-01",
    orders=1,
    tradelog="买入股票 600000",
    price=10.0,
    rate=0.05
)
```

### 5.3 计算手续费

```python
fee = base.shouxufei(
    code="600000",
    monery=10000,
    day="2023-01-01",
    type="B"
)
print(f"手续费：{fee}")
```

### 5.4 加载净值数据

```python
networth = base.loadNetworth4DB(
    back_code="strategy_001",
    start_date="2023-01-01"
)
print(networth)
```

## 6. 注意事项

1. **除权除息处理**：当前代码未处理除权除息，可能会影响持仓成本和收益率计算的准确性
2. **数据库依赖**：系统依赖MongoDB存储数据，需要确保数据库连接正常
3. **参数配置**：部分参数硬编码在代码中，需要根据实际情况调整
4. **性能考虑**：对于大规模回测，可能存在性能瓶颈，建议优化数据库查询

## 7. 代码优化建议

1. **除权除息处理**：实现除权除息调整逻辑，包括价格和持仓数量的调整
2. **异常处理**：添加try-except块处理可能的异常情况
3. **参数配置外置**：将策略参数配置外置，使用配置文件或数据库存储
4. **性能优化**：优化数据库查询，使用批量操作，考虑使用缓存机制
5. **代码重构**：提取公共功能到工具类，减少代码冗余

## 8. 输入输出示例

#### 输入：
```python
# 计算手续费
base = CPoolsBase()
fee = base.shouxufei(code="600000", monery=10000, day="2023-01-01", type="B")
print(fee)
```

#### 输出：
```
5.2
```

#### 输入：
```python
# 检查市场状态
market_status = base.checkmarketstatus(start_date="2023-01-01", end_date="2023-01-05")
print(market_status)
```

#### 输出：
```
           recommend_
date                  
2023-01-03           B
2023-01-04           S
```