# CPools_SellStra 模块文档

## 1. 模块概述

`CPools_SellStra` 是量化交易模拟系统的卖出策略模块，继承自 `CPoolsBase`，负责执行卖出操作。它支持多种卖出策略，包括止盈卖出、止损卖出、到期平仓等。该模块是交易系统的重要组成部分，决定了何时以及如何卖出股票。

## 2. 主要功能

- **卖出策略执行**：根据配置的卖出策略执行卖出操作
- **止盈止损**：根据止盈止损参数执行卖出操作
- **到期平仓**：根据持仓天数执行到期平仓操作
- **开盘卖出**：在开盘时执行卖出操作
- **收盘卖出**：在收盘时执行卖出操作
- **强制清仓**：执行强制清仓操作

## 3. 核心类与方法

### 3.1 核心类

```python
class CPools_SellStra(CPoolsBase):
    def __init__(self, params=None):
        pass
```

### 3.2 构造函数参数

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `params` | list | None | 卖出策略参数 |

### 3.3 卖出策略参数结构

```python
# 示例
['sell_stra_base', [0.05], [-0.06], [5]]
```

| 索引 | 类型 | 描述 |
|------|------|------|
| 0 | string | 策略名称：'sell_stra_base'（基本卖出策略）或 'sell_stra_opensell'（开盘卖出策略）或 'sell_stra_losssell'（止损卖出策略） |
| 1 | list | 止盈参数：如 [0.05] 表示止盈5% |
| 2 | list | 止损参数：如 [-0.06] 表示止损6% |
| 3 | list | 持仓天数：如 [5] 表示持仓5天 |

### 3.4 主要方法

#### 3.4.1 初始化仓位

**InitDaysPosition**
- **功能**：初始化当日仓位数据
- **参数**：
  - `end_date`：结束日期
  - `Position`：仓位数据
- **返回值**：更新后的仓位数据
- **说明**：获取当日股票的开盘价、收盘价、最高价、最低价等数据，更新仓位数据

#### 3.4.2 获取策略参数

**getStraValues**
- **功能**：获取卖出策略的止盈、止损和持仓天数参数
- **参数**：
  - `code`：代码（可选）
  - `surplus`：止盈参数（默认：[0.05, 'values']）
  - `loss`：止损参数（默认：[-0.06, 'values']）
  - `holdays`：持仓天数（默认：[5]）
- **返回值**：止盈值、止损值、持仓天数

#### 3.4.3 开盘卖出

**sellStraOpen**
- **功能**：执行开盘卖出操作
- **参数**：
  - `end_date`：结束日期
  - `back_code`：回测代码
  - `params`：参数（可选）
  - `Position`：仓位数据（默认：空DataFrame）
  - `k`：交易订单号（默认：0）
  - `allfunds`：现金（默认：0）
  - `sucess`：成功交易次数（默认：0）
  - `fail`：失败交易次数（默认：0）
- **返回值**：更新后的仓位数据、现金、交易订单号、成功交易次数、失败交易次数

#### 3.4.4 收盘卖出

**sellStraClose**
- **功能**：执行收盘卖出操作
- **参数**：同 `sellStraOpen` 方法
- **返回值**：更新后的仓位数据、现金、交易订单号、成功交易次数、失败交易次数

#### 3.4.5 强制清仓

**sellStraClean**
- **功能**：执行强制清仓操作
- **参数**：同 `sellStraOpen` 方法
- **返回值**：更新后的仓位数据、现金、交易订单号、成功交易次数、失败交易次数

### 3.5 具体卖出策略

#### 3.5.1 基本卖出策略

**sell_stra_base_open**
- **功能**：执行基本开盘卖出策略
- **参数**：同 `sellStraOpen` 方法
- **返回值**：更新后的仓位数据、现金、交易订单号、成功交易次数、失败交易次数
- **说明**：在开盘时执行止盈卖出操作

**sell_stra_base_close**
- **功能**：执行基本收盘卖出策略
- **参数**：同 `sellStraClose` 方法
- **返回值**：更新后的仓位数据、现金、交易订单号、成功交易次数、失败交易次数
- **说明**：在收盘时执行止损卖出和到期平仓操作

#### 3.5.2 开盘卖出策略

**sell_stra_opensell_open**
- **功能**：执行开盘卖出策略
- **参数**：同 `sellStraOpen` 方法
- **返回值**：更新后的仓位数据、现金、交易订单号、成功交易次数、失败交易次数
- **说明**：在开盘时按比例和日期清仓

#### 3.5.3 止损卖出策略

**sell_stra_losssell_open**
- **功能**：执行止损卖出策略
- **参数**：同 `sellStraOpen` 方法
- **返回值**：更新后的仓位数据、现金、交易订单号、成功交易次数、失败交易次数
- **说明**：在开盘时卖出策略消失的标的

## 4. 卖出策略流程

### 4.1 基本卖出流程

1. **初始化仓位**：获取当日股票的开盘价、收盘价、最高价、最低价等数据
2. **开盘卖出**：
   - 检查是否达到止盈条件
   - 执行止盈卖出操作
   - 记录交易日志
3. **收盘卖出**：
   - 检查是否达到止损条件
   - 检查是否到期
   - 执行止损卖出和到期平仓操作
   - 记录交易日志
4. **更新数据**：更新仓位数据和现金

### 4.2 止盈止损逻辑

- **止盈**：当股票价格达到止盈价格时卖出
  - 开盘止盈：当开盘价达到止盈价格时卖出
  - 盘中止盈：当盘中最高价达到止盈价格时卖出
- **止损**：当股票价格达到止损价格时卖出
  - 收盘止损：当收盘价达到止损价格时卖出
- **到期平仓**：当持仓天数达到设定天数时卖出

## 5. 卖出条件

### 5.1 止盈条件

- **开盘止盈**：`开盘价 >= 买入价格 * (1 + 止盈比例)`
- **盘中止盈**：`最高价 >= 买入价格 * (1 + 止盈比例)`

### 5.2 止损条件

- **收盘止损**：`收盘价 <= 买入价格 * (1 + 止损比例)`

### 5.3 到期条件

- **到期平仓**：`持仓天数 >= 设定天数`

## 6. 数据结构

### 6.1 卖出订单结构

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

## 7. 使用示例

### 7.1 初始化卖出策略

```python
from FQMarket.Simulate.CPools_SellStra import CPools_SellStra

# 初始化卖出策略（基本卖出策略，止盈5%，止损6%，持仓5天）
sell_stra = CPools_SellStra(
    params=['sell_stra_base', [0.05], [-0.06], [5]]
)

# 初始化卖出策略（开盘卖出策略）
sell_stra = CPools_SellStra(
    params=['sell_stra_opensell', [-0.06, 1]]
)
```

### 7.2 执行卖出操作

```python
# 初始化仓位数据
Position = pd.DataFrame({
    'code': ['600000', '600001'],
    'values': [10.0, 15.0],
    'count': [2000, 1300],
    'days': [3, 5],
    'hold': [1, 1],
    'open': [10.5, 14.0],
    'close': [10.6, 13.5],
    'high': [10.7, 14.2],
    'low': [10.4, 13.8]
}).set_index('code')

# 执行开盘卖出操作
Position, allfunds, k, sucess, fail = sell_stra.sellStraOpen(
    end_date='2023-01-01',
    back_code='backtest_001',
    Position=Position,
    k=0,
    allfunds=100000,
    sucess=0,
    fail=0
)

# 执行收盘卖出操作
Position, allfunds, k, sucess, fail = sell_stra.sellStraClose(
    end_date='2023-01-01',
    back_code='backtest_001',
    Position=Position,
    k=k,
    allfunds=allfunds,
    sucess=sucess,
    fail=fail
)
```

## 8. 注意事项

1. **除权除息处理**：当前代码未处理除权除息，可能会影响卖出价格的计算
2. **停牌处理**：当股票停牌时，会使用买入价格计算，可能会影响收益率计算
3. **参数调优**：需要根据市场环境调整止盈止损参数
4. **风险控制**：需要合理设置止盈止损参数，控制风险
5. **数据依赖**：依赖于股票的开盘价、收盘价、最高价、最低价等数据，需要确保数据准确性

## 9. 代码优化建议

1. **除权除息处理**：实现除权除息调整逻辑，确保卖出价格的准确性
2. **参数优化**：将卖出参数外置，便于调整和优化
3. **策略扩展**：支持更多类型的卖出策略
4. **风险控制**：添加风险控制机制，如最大回撤控制
5. **性能优化**：优化数据获取和处理逻辑，提高性能
6. **错误处理**：添加错误处理机制，提高系统稳定性

## 10. 输入输出示例

#### 输入：
```python
# 初始化卖出策略并执行卖出操作
from FQMarket.Simulate.CPools_SellStra import CPools_SellStra
import pandas as pd

# 初始化卖出策略
sell_stra = CPools_SellStra(
    params=['sell_stra_base', [0.05], [-0.06], [5]]
)

# 准备仓位数据
Position = pd.DataFrame({
    'code': ['600000', '600001'],
    'values': [10.0, 15.0],
    'count': [2000, 1300],
    'days': [3, 5],
    'hold': [1, 1],
    'open': [10.5, 14.0],
    'close': [10.6, 13.5],
    'high': [10.7, 14.2],
    'low': [10.4, 13.8]
}).set_index('code')

# 执行开盘卖出操作
Position, allfunds, k, sucess, fail = sell_stra.sellStraOpen(
    end_date='2023-01-01',
    back_code='backtest_001',
    Position=Position,
    k=0,
    allfunds=100000,
    sucess=0,
    fail=0
)

print("开盘卖出后持仓数据:")
print(Position)
print(f"剩余现金: {allfunds}")
print(f"交易订单号: {k}")
print(f"成功交易次数: {sucess}")
print(f"失败交易次数: {fail}")

# 执行收盘卖出操作
Position, allfunds, k, sucess, fail = sell_stra.sellStraClose(
    end_date='2023-01-01',
    back_code='backtest_001',
    Position=Position,
    k=k,
    allfunds=allfunds,
    sucess=sucess,
    fail=fail
)

print("\n收盘卖出后持仓数据:")
print(Position)
print(f"剩余现金: {allfunds}")
print(f"交易订单号: {k}")
print(f"成功交易次数: {sucess}")
print(f"失败交易次数: {fail}")
```

#### 输出：
```
开盘卖出后持仓数据:
       values  count  days  hold  open  close  high   low
code                                                    
600000   10.0   2000     3     0  10.5   10.6  10.7  10.4
600001   15.0   1300     5     1  14.0   13.5  14.2  13.8
剩余现金: 121000.0
交易订单号: 1
成功交易次数: 1
失败交易次数: 0

收盘卖出后持仓数据:
       values  count  days  hold  open  close  high   low
code                                                    
600000   10.0   2000     3     0  10.5   10.6  10.7  10.4
600001   15.0   1300     5     0  14.0   13.5  14.2  13.8
剩余现金: 137550.0
交易订单号: 2
成功交易次数: 1
失败交易次数: 1
```