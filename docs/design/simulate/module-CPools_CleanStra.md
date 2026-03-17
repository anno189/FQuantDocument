# CPools_CleanStra 模块文档

## 1. 模块概述

`CPools_CleanStra` 是量化交易模拟系统的清仓策略模块，负责判断是否应该强制清仓。它支持多种清仓策略，包括基于连续下跌的清仓策略。该模块是交易系统的重要组成部分，决定了何时应该强制清仓，以控制风险。

## 2. 主要功能

- **清仓策略执行**：根据配置的清仓策略执行清仓判断
- **连续下跌清仓**：基于连续下跌的清仓策略
- **风险控制**：通过清仓策略控制风险

## 3. 核心类与方法

### 3.1 核心类

```python
class CPools_CleanStra():
    def __init__(self, params=None):
        pass
```

### 3.2 构造函数参数

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `params` | list | None | 清仓策略参数 |

### 3.3 清仓策略参数结构

```python
# 示例
['clean_stra_downtimes', 3]
```

| 索引 | 类型 | 描述 |
|------|------|------|
| 0 | string | 策略名称：'clean_no_code'（不清仓）或 'clean_stra_downtimes'（连续下跌清仓） |
| 1 | integer | 连续下跌天数（仅用于 'clean_stra_downtimes' 策略） |

### 3.4 主要方法

#### 3.4.1 清仓策略执行

**cleanStra**
- **功能**：执行清仓策略，判断是否应该清仓
- **参数**：
  - `end_date`：结束日期（可选）
  - `stra_networth`：策略净值数据（默认：空DataFrame）
  - `networth`：当前净值（默认：0）
- **返回值**：是否清仓（True/False）

#### 3.4.2 不清仓策略

**clean_no_code**
- **功能**：默认不清仓策略
- **参数**：
  - `end_date`：结束日期（可选）
  - `stra_networth`：策略净值数据（默认：空DataFrame）
  - `params`：参数（可选）
  - `networth`：当前净值（默认：0）
- **返回值**：False（不清仓）

#### 3.4.3 连续下跌清仓策略

**clean_stra_downtimes**
- **功能**：基于连续下跌的清仓策略
- **参数**：同 `clean_no_code` 方法
- **返回值**：是否清仓（True/False）
- **说明**：当连续下跌达到一定天数时，判断是否清仓

## 4. 清仓策略流程

### 4.1 基本清仓流程

1. **获取策略方法**：根据配置的清仓策略获取相应的方法
2. **执行清仓判断**：执行清仓策略，判断是否应该清仓
3. **返回结果**：返回是否清仓的结果

### 4.2 连续下跌清仓策略逻辑

1. **检查净值变化**：检查当前净值是否低于历史净值
2. **计算连续下跌天数**：计算连续下跌的天数
3. **判断清仓条件**：当连续下跌天数达到设定值时，返回清仓信号

## 5. 清仓条件

### 5.1 连续下跌清仓条件

- **净值下跌**：当前净值低于历史净值
- **连续下跌**：连续下跌天数达到设定值

## 6. 使用示例

### 6.1 初始化清仓策略

```python
from FQMarket.Simulate.CPools_CleanStra import CPools_CleanStra

# 初始化清仓策略（默认不清仓）
clean_stra = CPools_CleanStra(
    params=['clean_no_code']
)

# 初始化清仓策略（连续下跌3天清仓）
clean_stra = CPools_CleanStra(
    params=['clean_stra_downtimes', 3]
)
```

### 6.2 执行清仓判断

```python
# 执行清仓判断
clean = clean_stra.cleanStra(
    end_date='2023-01-01',
    stra_networth=networth,  # 策略净值数据
    networth=0.95  # 当前净值
)

print(f"是否清仓：{clean}")
```

## 7. 注意事项

1. **参数调优**：需要根据市场环境调整清仓策略参数
2. **风险控制**：清仓策略是风险控制的重要手段，需要合理配置
3. **数据依赖**：依赖于净值数据，需要确保数据准确性
4. **回测验证**：需要通过回测验证清仓策略的有效性

## 8. 代码优化建议

1. **参数优化**：将清仓策略参数外置，便于调整和优化
2. **策略扩展**：支持更多类型的清仓策略
3. **自适应调整**：实现参数的自适应调整，根据市场环境自动调整参数
4. **性能优化**：优化数据获取和处理逻辑，提高性能
5. **错误处理**：添加错误处理机制，提高系统稳定性

## 9. 输入输出示例

#### 输入：
```python
# 初始化清仓策略并执行清仓判断
from FQMarket.Simulate.CPools_CleanStra import CPools_CleanStra
import pandas as pd

# 初始化清仓策略（连续下跌3天清仓）
clean_stra = CPools_CleanStra(
    params=['clean_stra_downtimes', 3]
)

# 准备净值数据
networth = pd.DataFrame({
    'date': ['2023-01-01', '2023-01-02', '2023-01-03', '2023-01-04'],
    'networth': [1.0, 0.99, 0.98, 0.97]
})

# 执行清仓判断
clean = clean_stra.cleanStra(
    end_date='2023-01-04',
    stra_networth=networth,
    networth=0.97
)

print(f"是否清仓：{clean}")
```

#### 输出：
```
是否清仓：True
```

#### 输入：
```python
# 初始化清仓策略（默认不清仓）并执行清仓判断
clean_stra = CPools_CleanStra(
    params=['clean_no_code']
)

# 执行清仓判断
clean = clean_stra.cleanStra(
    end_date='2023-01-01',
    networth=0.95
)

print(f"是否清仓：{clean}")
```

#### 输出：
```
是否清仓：False
```