# CPools_PositionStra 模块文档

## 1. 模块概述

`CPools_PositionStra` 是量化交易模拟系统的仓位管理策略模块，负责调整仓位规模。它支持多种仓位管理策略，包括默认仓位管理和私募轮动仓位管理。该模块是交易系统的重要组成部分，决定了每次交易的资金量和仓位数量。

## 2. 主要功能

- **仓位管理**：根据策略调整仓位规模
- **资金管理**：控制每次交易的资金量
- **动态仓位平衡**：根据正反馈和负反馈调整仓位
- **基于胜率调整**：根据近期交易胜率自动调整仓位
- **风险控制**：通过仓位管理控制风险

## 3. 核心类与方法

### 3.1 核心类

```python
class CPools_PositionStra():
    def __init__(self, params=None):
        pass
```

### 3.2 构造函数参数

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `params` | list | None | 仓位管理策略参数 |

### 3.3 胜率调整相关参数

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `win_rate_window` | integer | 30 | 胜率计算窗口（交易日） |
| `min_trades` | integer | 10 | 最小交易次数（确保统计意义） |
| `position_adjustment['high_win']` | float | 1.2 | 高胜率调整因子 |
| `position_adjustment['low_win']` | float | 0.8 | 低胜率调整因子 |
| `win_rate_threshold['high']` | float | 0.6 | 高胜率阈值 |
| `win_rate_threshold['low']` | float | 0.4 | 低胜率阈值 |

### 3.4 仓位管理策略参数结构

```python
# 默认仓位管理
['default_funds']

# 私募轮动仓位管理
['private_funds']

# 自定义仓位管理
['custom_funds', 每次交易金额, 初始资金, 初始仓位数量, 是否动态平衡]
```

| 索引 | 类型 | 描述 |
|------|------|------|
| 0 | string | 策略名称：'default_funds'（默认仓位管理）或 'private_funds'（私募轮动仓位管理）或 'custom_funds'（自定义仓位管理） |
| 1 | integer | 每次交易金额（仅用于 'custom_funds' 策略） |
| 2 | integer | 初始资金（仅用于 'custom_funds' 策略） |
| 3 | integer | 初始仓位数量（仅用于 'custom_funds' 策略） |
| 4 | boolean | 是否动态平衡（仅用于 'custom_funds' 策略） |

### 3.4 主要方法

#### 3.4.1 获取基础值

**getbasevalues**
- **功能**：获取基础资金和仓位值
- **参数**：无
- **返回值**：初始资金、每次交易金额、初始仓位数量

#### 3.4.2 获取策略值

**getStraValues**
- **功能**：获取仓位管理策略的资金和仓位值，支持基于胜率的调整
- **参数**：
  - `allfunds`：总资金（默认：0）
  - `posi`：正反馈数量（默认：0）
  - `nega`：负反馈数量（默认：0）
  - `days`：持仓天数（默认：3）
  - `trades`：交易记录列表（默认：None），格式为[{'date': '2023-01-01', 'rate': 0.05}, ...]
- **返回值**：每次交易金额、推荐仓位数量

#### 3.4.3 计算胜率

**_calculate_win_rate**
- **功能**：计算近期交易胜率
- **参数**：
  - `trades`：交易记录列表
- **返回值**：胜率（0-1之间）

#### 3.4.4 根据胜率调整仓位

**_adjust_position_by_win_rate**
- **功能**：根据胜率调整仓位数量
- **参数**：
  - `base_count`：基础仓位数量
  - `win_rate`：近期胜率
- **返回值**：调整后的仓位数量

#### 3.4.5 默认仓位管理策略

**default_funds**
- **功能**：执行默认仓位管理策略
- **参数**：同 `getStraValues` 方法
- **返回值**：每次交易金额、推荐仓位数量
- **说明**：返回固定的每次交易金额和仓位数量，或根据动态平衡调整仓位数量

#### 3.4.6 私募轮动仓位管理策略

**private_funds**
- **功能**：执行私募轮动仓位管理策略
- **参数**：同 `getStraValues` 方法
- **返回值**：每次交易金额、推荐仓位数量
- **说明**：根据总资金规模调整每次交易金额和仓位数量

## 4. 仓位管理流程

### 4.1 基本仓位管理流程

1. **初始化参数**：设置初始资金、每次交易金额、初始仓位数量等参数
2. **获取总资金**：计算当前总资金（现金 + 持仓价值）
3. **计算正反馈和负反馈**：根据历史交易结果计算正反馈和负反馈数量
4. **执行基础仓位管理策略**：根据仓位管理策略计算基础每次交易金额和推荐仓位数量
5. **计算近期胜率**：根据交易记录计算近期胜率
6. **根据胜率调整仓位**：基于胜率调整仓位数量
7. **返回结果**：返回每次交易金额和调整后的推荐仓位数量

### 4.2 私募轮动仓位管理逻辑

1. **资金规模判断**：
   - 当总资金 < 3000万 * (1 + 回撤预期) 时，每次交易金额为10万，仓位数量根据总资金计算
   - 当总资金 < 6000万 * (1 + 回撤预期) 时，仓位数量固定为100，每次交易金额根据总资金计算
   - 当总资金 >= 6000万 * (1 + 回撤预期) 时，每次交易金额为20万，仓位数量根据总资金计算
2. **动态平衡**：如果启用动态平衡，根据正反馈和负反馈调整仓位数量

### 4.3 基于胜率调整的仓位管理逻辑

1. **胜率计算**：
   - 使用滚动窗口计算近期胜率，默认窗口为30个交易日
   - 最小样本量为10笔交易，确保统计意义
   - 当交易次数不足时，使用默认胜率50%

2. **仓位调整规则**：
   - 胜率 >= 60%（高胜率）：增加仓位20%
   - 胜率 40%-60%（中等胜率）：保持基础仓位
   - 胜率 < 40%（低胜率）：减少仓位20%

3. **仓位限制**：
   - 最小仓位为基础仓位的50%
   - 最大仓位为基础仓位的150%
   - 确保仓位调整在合理范围内

## 5. 仓位管理参数

### 5.1 默认仓位管理参数

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| 每次交易金额 | integer | 20000 | 每次交易的资金量 |
| 初始资金 | integer | 300000 | 初始资金量 |
| 初始仓位数量 | integer | 5 | 初始仓位数量 |
| 是否动态平衡 | boolean | False | 是否根据正反馈和负反馈调整仓位 |

### 5.2 私募轮动仓位管理参数

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| 每次交易金额 | integer | 100000 | 每次交易的资金量 |
| 初始资金 | integer | 10000000 | 初始资金量 |
| 初始仓位数量 | integer | 32 | 初始仓位数量 |
| 是否动态平衡 | boolean | False | 是否根据正反馈和负反馈调整仓位 |
| 回撤预期 | float | 0.04 | 回撤预期 |

## 6. 使用示例

### 6.1 初始化仓位管理策略

```python
from FQMarket.Simulate.CPools_PositionStra import CPools_PositionStra

# 初始化默认仓位管理策略
position_stra = CPools_PositionStra(
    params=['default_funds']
)

# 初始化私募轮动仓位管理策略
position_stra = CPools_PositionStra(
    params=['private_funds']
)

# 初始化自定义仓位管理策略
position_stra = CPools_PositionStra(
    params=['custom_funds', 50000, 500000, 10, True]
)
```

### 6.2 获取基础值

```python
# 获取基础值
defunds, funds, count = position_stra.getbasevalues()
print(f"初始资金：{defunds}")
print(f"每次交易金额：{funds}")
print(f"初始仓位数量：{count}")
```

### 6.3 获取策略值

```python
# 获取策略值（不使用交易记录）
funds, count = position_stra.getStraValues(
    allfunds=1000000,  # 总资金
    posi=2,           # 正反馈数量
    nega=1,           # 负反馈数量
    days=5            # 持仓天数
)

print(f"每次交易金额：{funds}")
print(f"推荐仓位数量：{count}")

# 获取策略值（使用交易记录，基于胜率调整）
trades = [
    {'date': '2023-01-01', 'rate': 0.05},
    {'date': '2023-01-02', 'rate': -0.02},
    {'date': '2023-01-03', 'rate': 0.08},
    {'date': '2023-01-04', 'rate': 0.03},
    {'date': '2023-01-05', 'rate': -0.01},
    {'date': '2023-01-06', 'rate': 0.06},
    {'date': '2023-01-07', 'rate': 0.04},
    {'date': '2023-01-08', 'rate': -0.03},
    {'date': '2023-01-09', 'rate': 0.07},
    {'date': '2023-01-10', 'rate': 0.02}
]

funds, count = position_stra.getStraValues(
    allfunds=1000000,
    posi=2,
    nega=1,
    days=5,
    trades=trades  # 传入交易记录
)

print(f"\n基于胜率调整后：")
print(f"每次交易金额：{funds}")
print(f"推荐仓位数量：{count}")
```

## 7. 注意事项

1. **参数调优**：需要根据市场环境调整仓位管理参数
2. **风险控制**：仓位管理是风险控制的重要手段，需要合理配置
3. **资金管理**：需要根据实际资金情况调整每次交易金额和仓位数量
4. **回测验证**：需要通过回测验证仓位管理策略的有效性

## 8. 代码优化建议

1. **参数优化**：将仓位管理参数外置，便于调整和优化
2. **策略扩展**：支持更多类型的仓位管理策略
3. **自适应调整**：实现参数的自适应调整，根据市场环境自动调整参数
4. **性能优化**：优化计算逻辑，提高性能
5. **错误处理**：添加错误处理机制，提高系统稳定性

## 9. 输入输出示例

#### 输入：
```python
# 初始化仓位管理策略并获取策略值
from FQMarket.Simulate.CPools_PositionStra import CPools_PositionStra

# 初始化默认仓位管理策略
position_stra = CPools_PositionStra(
    params=['default_funds']
)

# 获取基础值
defunds, funds, count = position_stra.getbasevalues()
print(f"初始资金：{defunds}")
print(f"每次交易金额：{funds}")
print(f"初始仓位数量：{count}")

# 获取策略值（动态平衡）
position_stra = CPools_PositionStra(
    params=['default_funds', 20000, 300000, 5, True]
)

funds, count = position_stra.getStraValues(
    allfunds=400000,
    posi=3,
    nega=1,
    days=5
)

print(f"\n动态平衡后：")
print(f"每次交易金额：{funds}")
print(f"推荐仓位数量：{count}")

# 获取策略值（基于胜率调整 - 高胜率）
trades_high_win = [
    {'date': '2023-01-01', 'rate': 0.05},
    {'date': '2023-01-02', 'rate': 0.03},
    {'date': '2023-01-03', 'rate': 0.08},
    {'date': '2023-01-04', 'rate': 0.04},
    {'date': '2023-01-05', 'rate': 0.06},
    {'date': '2023-01-06', 'rate': 0.02},
    {'date': '2023-01-07', 'rate': 0.07},
    {'date': '2023-01-08', 'rate': 0.03},
    {'date': '2023-01-09', 'rate': 0.05},
    {'date': '2023-01-10', 'rate': 0.04}
]

funds, count = position_stra.getStraValues(
    allfunds=400000,
    posi=3,
    nega=1,
    days=5,
    trades=trades_high_win
)

print(f"\n高胜率调整后：")
print(f"每次交易金额：{funds}")
print(f"推荐仓位数量：{count}")

# 获取策略值（基于胜率调整 - 低胜率）
trades_low_win = [
    {'date': '2023-01-01', 'rate': -0.02},
    {'date': '2023-01-02', 'rate': -0.03},
    {'date': '2023-01-03', 'rate': 0.01},
    {'date': '2023-01-04', 'rate': -0.04},
    {'date': '2023-01-05', 'rate': -0.02},
    {'date': '2023-01-06', 'rate': 0.03},
    {'date': '2023-01-07', 'rate': -0.01},
    {'date': '2023-01-08', 'rate': -0.05},
    {'date': '2023-01-09', 'rate': 0.02},
    {'date': '2023-01-10', 'rate': -0.03}
]

funds, count = position_stra.getStraValues(
    allfunds=400000,
    posi=3,
    nega=1,
    days=5,
    trades=trades_low_win
)

print(f"\n低胜率调整后：")
print(f"每次交易金额：{funds}")
print(f"推荐仓位数量：{count}")
```

#### 输出：
```
初始资金：300000
每次交易金额：20000
初始仓位数量：5

动态平衡后：
每次交易金额：20000
推荐仓位数量：7

高胜率调整后：
每次交易金额：20000
推荐仓位数量：8

低胜率调整后：
每次交易金额：20000
推荐仓位数量：6
```

#### 输入：
```python
# 初始化私募轮动仓位管理策略并获取策略值
position_stra = CPools_PositionStra(
    params=['private_funds']
)

# 获取基础值
defunds, funds, count = position_stra.getbasevalues()
print(f"初始资金：{defunds}")
print(f"每次交易金额：{funds}")
print(f"初始仓位数量：{count}")

# 获取策略值（不同资金规模）
funds1, count1 = position_stra.getStraValues(
    allfunds=20000000,  # 2000万
    posi=2,
    nega=1,
    days=5
)

funds2, count2 = position_stra.getStraValues(
    allfunds=40000000,  # 4000万
    posi=2,
    nega=1,
    days=5
)

funds3, count3 = position_stra.getStraValues(
    allfunds=70000000,  # 7000万
    posi=2,
    nega=1,
    days=5
)

print(f"\n资金规模2000万：")
print(f"每次交易金额：{funds1}")
print(f"推荐仓位数量：{count1}")

print(f"\n资金规模4000万：")
print(f"每次交易金额：{funds2}")
print(f"推荐仓位数量：{count2}")

print(f"\n资金规模7000万：")
print(f"每次交易金额：{funds3}")
print(f"推荐仓位数量：{count3}")
```

#### 输出：
```
初始资金：10000000
每次交易金额：100000
初始仓位数量：32

资金规模2000万：
每次交易金额：100000
推荐仓位数量：48

资金规模4000万：
每次交易金额：400000
推荐仓位数量：100

资金规模7000万：
每次交易金额：200000
推荐仓位数量：332
```