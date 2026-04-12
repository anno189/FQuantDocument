# FQFactor 模块

量化因子计算引擎，提供高效的因子函数调用框架。

## 快速开始

### 1. 获取数据

```python
from FQData.DataSource import get_datasource

ds = get_datasource()
data = ds.get_stock_day('000001', '2024-01-01', '2025-12-31')
```

### 2. 计算因子

```python
from FQFactor import MA, EMA, MACD, RSI, BOLL

close = data['close'].values

# 移动平均
ma5 = MA(close, 5)

# 指数移动平均
ema12 = EMA(close, 12)

# MACD指标
dif, dea, macd = MACD(close)

# RSI指标
rsi6 = RSI(close, 6)

# 布林带
upper, mid, lower = BOLL(close, 20, 2)
```

## 目录结构

```
FQFactor/
├── indicators/          # 指标函数
│   ├── trend.py        # 趋势指标 (MA, EMA, MACD, BBI, TRIX, DMI)
│   ├── momentum.py     # 动量指标 (RSI, KDJ, WR, ROC, MTM, CCI, MFI)
│   ├── volatility.py   # 波动率指标 (BOLL, ATR, VR, OBV, EMV, DPO, MASS)
│   ├── ma.py           # 移动平均 (旧版MA实现)
│   ├── base.py         # 应用层函数 (CROSS, BARSLAST, ZIG, etc.)
│   ├── core.py         # 核心工具函数 (HHV, LLV, REF, IF, etc.)
│   └── registry.py     # 指标注册表
├── factors/            # 预定义因子
├── evaluators/         # 因子评估
└── signals/            # 信号生成
```

## 可用指标

### 趋势指标 (Trend)

| 函数 | 说明 | 默认参数 |
|------|------|----------|
| `MA(data, period)` | 移动平均线 | period=20 |
| `EMA(data, period)` | 指数移动平均 | period=12 |
| `MACD(data, fast, slow, signal)` | MACD指标 | fast=12, slow=26, signal=9 |
| `BBI(data, m1, m2, m3, m4)` | 多空指标 | m1=3, m2=6, m3=12, m4=20 |
| `DMA(data, alpha)` | 动态移动平均 | alpha=0.5 |
| `TRIX(data, m1, m2)` | 三重指数平滑平均线 | m1=12, m2=20 |
| `DMI(data, m1, m2)` | 动向指标 | m1=14, m2=6 |

### 动量指标 (Momentum)

| 函数 | 说明 | 默认参数 |
|------|------|----------|
| `RSI(data, period)` | 相对强弱指标 | period=24 |
| `KDJ(data, n, m1, m2)` | KDJ随机指标 | n=9, m1=3, m2=3 |
| `WR(data, n, n1)` | 威廉指标 | n=10, n1=6 |
| `ROC(data, n, m)` | 变动率指标 | n=12, m=6 |
| `MTM(data, n, m)` | 动量指标 | n=12, m=6 |
| `CCI(data, n)` | 顺势指标 | n=14 |
| `MFI(data, n)` | 资金流量指标 | n=14 |

### 波动率指标 (Volatility)

| 函数 | 说明 | 默认参数 |
|------|------|----------|
| `BOLL(data, n, p)` | 布林带 | n=20, p=2 |
| `ATR(data, n)` | 真实波动均值 | n=20 |
| `VR(data, m1)` | 虚拟成交量比率 | m1=26 |
| `OBV(data)` | 能量潮指标 | - |
| `EMV(data, n, m)` | 简易波动指标 | n=14, m=9 |
| `DPO(data, m1, m2, m3)` | 区间震荡线 | m1=20, m2=10, m3=6 |
| `MASS(data, n1, n2, m)` | 梅斯线 | n1=9, n2=25, m=6 |

## 应用层函数

| 函数 | 说明 |
|------|------|
| `CROSS(A, B)` | 金叉死叉判断 |
| `BARSLAST(COND)` | 条件上一次成立位置 |
| `BARSLASTCOUNT(COND)` | 连续满足条件周期数 |
| `BARSSINCE(Series)` | 条件成立至今周期数 |
| `TFILTER(A, B, N)` | 买卖信号过滤 |
| `ZIG(k, x, type)` | 之字转向函数 |
| `PLOYLINE(COND, V1)` | 折线作图 |
| `DRAWLINE(COND1, V1, COND2, V2)` | 画线函数 |

## 核心工具函数

| 函数 | 说明 |
|------|------|
| `HHV(S, N)` | N日最高值 |
| `LLV(S, N)` | N日最低值 |
| `REF(Series, N)` | N日前的值 |
| `IF(S, A, B)` | 条件选择 |
| `SUM(S, N)` | 求和 |
| `STD(Series, N)` | 标准差 |
| `CONST(Series, N)` | 常量数组 |

## 示例

### 计算多个指标

```python
from FQFactor import MA, MACD, RSI, BOLL, CROSS

close = data['close'].values

# 同时计算多个指标
ma5 = MA(close, 5)
ma10 = MA(close, 10)
dif, dea, macd = MACD(close)
rsi = RSI(close, 6)
upper, mid, lower = BOLL(close)

# 金叉信号
cross_signal = CROSS(ma5, ma10)
```

### 批量获取股票数据并计算

```python
from FQData.DataSource import get_datasource
from FQFactor import MA, MACD

ds = get_datasource()
stocks = ['000001', '000002', '600000']

results = {}
for code in stocks:
    data = ds.get_stock_day(code, '2024-01-01', '2025-12-31')
    close = data['close'].values
    results[code] = {
        'MA5': MA(close, 5)[-1],
        'MACD': MACD(close)[0][-1],  # DIF
    }
```

## 开发者文档

### 文档目录

- [因子函数编写规范](./indicator-specification.md) - 函数定义规范、装饰器使用
- [因子开发指南](./development-guide.md) - 完整开发流程、测试验证
- [指标注册系统](./registry.md) - 注册表API、装饰器详解
- [数据处理规范](./data-handling.md) - 数据格式、提取函数、最佳实践

### 快速开发流程

```python
from typing import Union, Tuple
import numpy as np
import pandas as pd

from FQFactor.indicators.registry import register_indicator, IndicatorCategory


@register_indicator("MY_INDICATOR", category=IndicatorCategory.TREND, params={"period": 20})
def my_indicator(data: Union[pd.DataFrame, np.ndarray], period: int = 20) -> np.ndarray:
    """
    自定义指标说明

    Args:
        data: 价格数据
        period: 周期

    Returns:
        指标值序列
    """
    close = _validate_data(data)
    # 计算逻辑
    result = ...
    return np.round(result, 2)
```
