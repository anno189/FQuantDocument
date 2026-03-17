# CPools_BuyStra 模块文档

## 1. 模块概述

`CPools_BuyStra` 是量化交易模拟系统的买入策略模块，继承自 `CPoolsBase`，负责执行买入操作。它支持多种买入策略，包括基于开盘价、收盘价的买入，以及涨停买入、超跌买入等特殊情况的处理。该模块是交易系统的重要组成部分，决定了何时以及如何买入股票。

## 2. 主要功能

- **买入策略执行**：根据配置的买入策略执行买入操作
- **价格计算**：根据买入价格类型和浮动比例计算买入价格
- **特殊情况处理**：处理涨停买入、超跌买入等特殊情况
- **ETF买入**：支持ETF的买入操作
- **资金管理**：根据仓位管理策略控制买入资金量

## 3. 核心类与方法

### 3.1 核心类

```python
class CPools_BuyStra(CPoolsBase):
    def __init__(self, code=None, back_code=None, empty_stra=None, surplus=[['open', 0., True, True, True]]):
        pass
```

### 3.2 构造函数参数

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `code` | string | None | 买入策略代码 |
| `back_code` | string | None | 回测代码 |
| `empty_stra` | list | None | 空仓策略参数 |
| `surplus` | list | [['open', 0., True, True, True]] | 买入参数 |

### 3.3 买入参数结构

```python
# 示例
[['open', 0., True, True, True]]
```

| 索引 | 类型 | 描述 |
|------|------|------|
| 0 | string | 买入价格类型：'open'（开盘价）或 'close'（前日收盘价） |
| 1 | float | 价格浮动比例：正数表示高于基准价格，负数表示低于基准价格 |
| 2 | boolean | 是否涨停买入：True表示允许涨停买入，False表示不允许 |
| 3 | boolean | 是否超跌买入：True表示允许超跌买入，False表示不允许 |
| 4 | boolean | 是否买入ETF：True表示允许买入ETF，False表示不允许 |

### 3.4 主要方法

#### 3.4.1 买入策略执行

**buyStra**
- **功能**：执行买入策略
- **参数**：
  - `end_date`：结束日期
  - `back_code`：回测代码
  - `stocklist`：股票列表
  - `start_date`：开始日期（可选）
  - `Position`：仓位数据（默认：空DataFrame）
  - `k`：交易订单号（默认：0）
  - `allfunds`：现金（默认：0）
  - `funds`：每仓位资金（默认：0）
  - `tuijian`：推荐仓位数量（默认：0）
  - `marketstatus`：市场状态（默认：空DataFrame）
- **返回值**：更新后的仓位数据、现金、交易订单号

#### 3.4.2 基本买入策略

**buy_stra_base**
- **功能**：执行基本买入策略
- **参数**：同 `buyStra` 方法
- **返回值**：更新后的仓位数据、现金、交易订单号
- **说明**：该方法是默认的买入策略，根据买入参数执行买入操作，包括：
  - 检查空仓策略
  - 计算买入价格和数量
  - 检查买入条件（如是否达到买入价格、是否涨停等）
  - 执行买入操作
  - 记录交易日志

## 4. 买入策略流程

### 4.1 基本买入流程

1. **检查空仓策略**：判断是否满足开仓条件
2. **确定买入数量**：根据推荐仓位数量确定买入股票数量
3. **遍历股票列表**：从股票列表中选择股票进行买入
4. **检查资金**：确保有足够的资金进行买入
5. **获取股票数据**：获取股票的开盘价、收盘价等数据
6. **计算买入价格**：根据买入参数计算买入价格
7. **检查买入条件**：
   - 检查是否达到买入价格
   - 检查是否涨停（如果不允许涨停买入）
   - 检查是否超跌（如果不允许超跌买入）
8. **执行买入**：更新仓位数据和现金
9. **记录交易日志**：记录买入交易日志

### 4.2 ETF买入流程

当空仓策略生效且允许买入ETF时，系统会：

1. **判断市场状态**：根据市场状态选择买入大盘ETF还是小盘ETF
2. **选择ETF标的**：
   - 大盘ETF：510050（上证50）、510210（上证）、510300（沪深300）、510500（中证500）、515080（红利）
   - 小盘ETF：159915（创业板）、159949（创50）、159922（中证500）、159845（中证1000）、159628（国证2000）
3. **执行买入**：按照推荐仓位数量买入ETF

## 5. 买入条件

### 5.1 价格条件

- **买入价格**：根据买入价格类型和浮动比例计算
  - 开盘价买入：`开盘价 * (1 + 浮动比例)`
  - 收盘价买入：`前日收盘价 * (1 + 浮动比例)`

### 5.2 特殊条件

- **涨停买入**：当股票开盘涨停时，是否允许买入
- **超跌买入**：当股票前日收盘价低于-7%时，是否允许买入
- **ETF买入**：是否允许买入ETF作为替代策略

## 6. 数据结构

### 6.1 买入订单结构

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
| hhv | float | 历史最高价 |
| hhp | float | 历史最高持仓价 |

## 7. 使用示例

### 7.1 初始化买入策略

```python
from FQMarket.Simulate.CPools_BuyStra import CPools_BuyStra

# 初始化买入策略（开盘价买入，允许涨停和超跌买入，允许ETF买入）
buy_stra = CPools_BuyStra(
    code='buy_stra_base',
    back_code='backtest_001',
    empty_stra=None,
    surplus=[['open', 0., True, True, True]]
)

# 初始化买入策略（收盘价买入，不允许涨停买入，允许超跌买入，不允许ETF买入）
buy_stra = CPools_BuyStra(
    code='buy_stra_base',
    back_code='backtest_001',
    empty_stra=None,
    surplus=[['close', -0.01, False, True, False]]
)
```

### 7.2 执行买入操作

```python
# 执行买入操作
Position, allfunds, k = buy_stra.buyStra(
    end_date='2023-01-01',
    back_code='backtest_001',
    stocklist=stock_list,  # 股票列表
    Position=Position,     # 现有仓位
    k=0,                   # 交易订单号
    allfunds=100000,       # 现金
    funds=20000,           # 每仓位资金
    tuijian=5,             # 推荐仓位数量
    marketstatus=market_status  # 市场状态
)
```

## 8. 注意事项

1. **资金管理**：需要确保有足够的资金进行买入操作
2. **买入条件**：需要根据市场环境调整买入条件
3. **特殊情况**：需要考虑涨停、超跌等特殊情况的处理
4. **ETF替代**：当市场环境不佳时，可以考虑买入ETF作为替代策略
5. **数据依赖**：依赖于股票的开盘价、收盘价等数据，需要确保数据准确性

## 9. 代码优化建议

1. **参数优化**：将买入参数外置，便于调整和优化
2. **策略扩展**：支持更多类型的买入策略
3. **风险控制**：添加风险控制机制，如最大买入金额限制
4. **性能优化**：优化数据获取和处理逻辑，提高性能
5. **错误处理**：添加错误处理机制，提高系统稳定性

## 10. 输入输出示例

#### 输入：
```python
# 初始化买入策略并执行买入操作
from FQMarket.Simulate.CPools_BuyStra import CPools_BuyStra
import pandas as pd

# 初始化买入策略
buy_stra = CPools_BuyStra(
    code='buy_stra_base',
    back_code='backtest_001',
    empty_stra=None,
    surplus=[['open', 0., True, True, True]]
)

# 准备股票列表
stock_list = pd.DataFrame({
    'code': ['600000', '600001', '600002', '600003', '600004']
})

# 执行买入操作
Position, allfunds, k = buy_stra.buyStra(
    end_date='2023-01-01',
    back_code='backtest_001',
    stocklist=stock_list,
    Position=pd.DataFrame({}),
    k=0,
    allfunds=100000,
    funds=20000,
    tuijian=5,
    marketstatus=pd.DataFrame({})
)

print("持仓数据:")
print(Position)
print(f"剩余现金: {allfunds}")
print(f"交易订单号: {k}")
```

#### 输出：
```
买入条件：
开盘价买入，竞价涨停打板买入，昨日超跌 -7% 依然买入，ETF投机买入
持仓数据:
         blockname posidate    code        date  values  count  days  networth  hold  open  close  high  low    hhv    hhp
code                                                                                                                
600000  backtest_001     None  600000  2023-01-01   10.0   2000     0      0.0     1   0.0    0.0   0.0  0.0  10.0  10.0
600001  backtest_001     None  600001  2023-01-01   15.0   1300     0      0.0     1   0.0    0.0   0.0  0.0  15.0  15.0
600002  backtest_001     None  600002  2023-01-01    8.0   2500     0      0.0     1   0.0    0.0   0.0  0.0   8.0   8.0
600003  backtest_001     None  600003  2023-01-01   12.0   1600     0      0.0     1   0.0    0.0   0.0  0.0  12.0  12.0
600004  backtest_001     None  600004  2023-01-01   20.0   1000     0      0.0     1   0.0    0.0   0.0  0.0  20.0  20.0
剩余现金: 100000.0
交易订单号: 5
```