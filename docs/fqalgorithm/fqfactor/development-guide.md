# 因子函数开发指南

本文档详细介绍如何在 FQFactor 框架下开发新的因子函数。

## 1. 环境准备

### 1.1 目录结构

```
FQFactor/
└── indicators/
    ├── trend.py        # 趋势指标
    ├── momentum.py     # 动量指标
    ├── volatility.py   # 波动率指标
    ├── ma.py           # 移动平均
    ├── base.py         # 应用层函数
    ├── core.py         # 核心工具函数
    └── registry.py     # 指标注册表
```

### 1.2 依赖导入

```python
import numpy as np
import pandas as pd
from typing import Union, Tuple

from FQFactor.indicators.registry import register_indicator, IndicatorCategory
```

## 2. 编写规范

### 2.1 标准模板

```python
"""
indicators.xxx - 指标分类

提供XXX类指标
"""

import numpy as np
import pandas as pd
from typing import Union, Tuple

from FQFactor.indicators.registry import register_indicator, IndicatorCategory


def _validate_data(data: Union[pd.DataFrame, np.ndarray]) -> np.ndarray:
    """验证并提取价格数据"""
    if isinstance(data, pd.DataFrame):
        if "close" in data.columns:
            return data["close"].values
        return data.iloc[:, 0].values
    return np.asarray(data)


def _get_ohlcv(data: Union[pd.DataFrame, dict]) -> dict:
    """获取OHLCV数据"""
    if isinstance(data, pd.DataFrame):
        return {
            "open": data.get("open", data.get("Open", pd.Series([0])["Open"])).values,
            "high": data.get("high", data.get("High", pd.Series([0])["High"])).values,
            "low": data.get("low", data.get("Low", pd.Series([0])["Low"])).values,
            "close": data.get("close", data.get("Close", pd.Series([0])["Close"])).values,
            "volume": data.get("volume", data.get("Volume", pd.Series([0])["Volume"])).values,
        }
    return data


@register_indicator("指标名", category=IndicatorCategory.分类, params={"参数": 默认值})
def 函数名(data: Union[pd.DataFrame, np.ndarray], 参数1: int = 默认值, ...) -> 返回类型:
    """
    指标说明

    公式描述

    Args:
        data: 价格数据
        参数1: 参数说明

    Returns:
        返回值说明
    """
    # 1. 提取数据
    close = _validate_data(data)

    # 2. 计算逻辑
    result = ...

    # 3. 返回
    return np.round(result, 2)
```

### 2.2 数据提取规则

| 指标类型 | 提取函数 | 说明 |
|----------|----------|------|
| 纯价格 | `_validate_data(data)` | 仅需收盘价 |
| OHLCV | `_get_ohlcv(data)` | 需要OHLCV全部数据 |

### 2.3 分类规则

| 分类 | 适用指标 | 示例 |
|------|----------|------|
| TREND | 趋势类 | MA, EMA, MACD, BBI, DMI |
| MOMENTUM | 动量类 | RSI, KDJ, WR, ROC, CCI |
| VOLATILITY | 波动率类 | BOLL, ATR, VR, OBV |
| VOLUME | 成交量类 | VOL, AMOUNT |
| SENTIMENT | 市场情绪类 | VIX |
| CUSTOM | 自定义 | 用户扩展 |

### 2.4 返回值规则

| 类型 | 格式 | 示例 |
|------|------|------|
| 单值序列 | `np.ndarray` | `MA`, `EMA`, `RSI` |
| 多值返回 | `Tuple[np.ndarray, ...]` | `MACD`→`(dif,dea,macd)`, `BOLL`→`(upper,mid,lower)` |

## 3. 开发流程

### 3.1 步骤一：确定指标类型

根据指标特性确定分类和所需数据：

```python
# 例如开发 RSI 指标
# 1. 类型：MOMENTUM (动量指标)
# 2. 数据：只需 close 价格
```

### 3.2 步骤二：实现计算逻辑

```python
@register_indicator("RSI", category=IndicatorCategory.MOMENTUM, params={"period": 24})
def RSI(data: Union[pd.DataFrame, np.ndarray], period: int = 24) -> np.ndarray:
    """
    相对强弱指标

    RSI = 100 - 100 / (1 + RS)
    RS = n日内上涨平均值 / n日内下跌平均值

    Args:
        data: 价格数据
        period: 周期

    Returns:
        RSI值序列
    """
    close = _validate_data(data)

    # 计算价格变化
    delta = np.diff(np.insert(close, 0, close[0]))

    # 区分涨跌
    gain = np.where(delta > 0, delta, 0)
    loss = np.where(delta < 0, -delta, 0)

    # 计算平均涨跌幅
    avg_gain = pd.Series(gain).rolling(period).mean()
    avg_loss = pd.Series(loss).rolling(period).mean()

    # 计算RS和RSI
    rs = avg_gain / (avg_loss + 1e-10)
    rsi = 100 - (100 / (1 + rs))

    return np.round(rsi.values, 2)
```

### 3.3 步骤三：注册到正确文件

根据指标分类添加到对应文件：

| 分类 | 文件 |
|------|------|
| TREND | trend.py |
| MOMENTUM | momentum.py |
| VOLATILITY | volatility.py |
| 自定义 | 新建文件 |

### 3.4 步骤四：更新导出

在 `FQFactor/__init__.py` 中添加导出：

```python
from FQFactor.indicators.分类 import 函数名
```

## 4. 完整示例

### 4.1 示例：威廉指标 (WR)

```python
# indicators/momentum.py

@register_indicator("WR", category=IndicatorCategory.MOMENTUM, params={"n": 10, "n1": 6})
def WR(
    data: Union[pd.DataFrame, np.ndarray],
    n: int = 10,
    n1: int = 6
) -> Tuple[np.ndarray, np.ndarray]:
    """
    威廉指标 (Williams %R)

    WR = (HHV(HIGH, N) - CLOSE) / (HHV(HIGH, N) - LLV(LOW, N)) * 100
    WR1 = (HHV(HIGH, N1) - CLOSE) / (HHV(HIGH, N1) - LLV(LOW, N1)) * 100

    Args:
        data: OHLC数据
        n: 周期1
        n1: 周期2

    Returns:
        (WR, WR1)
    """
    ohlcv = _get_ohlcv(data)
    high = ohlcv["high"]
    low = ohlcv["low"]
    close = ohlcv["close"]

    wr = (HHV(high, n) - close) / (HHV(high, n) - LLV(low, n) + 1e-10) * 100
    wr1 = (HHV(high, n1) - close) / (HHV(high, n1) - LLV(low, n1) + 1e-10) * 100

    return np.round(wr, 2), np.round(wr1, 2)
```

### 4.2 示例：布林带 (BOLL)

```python
# indicators/volatility.py

def MA(values: np.ndarray, n: int) -> np.ndarray:
    """移动平均"""
    return pd.Series(values).rolling(window=n, min_periods=1).mean().values


def STD(values: np.ndarray, n: int) -> np.ndarray:
    """标准差"""
    return pd.Series(values).rolling(window=n).std().values


@register_indicator("BOLL", category=IndicatorCategory.VOLATILITY, params={"n": 20, "p": 2})
def BOLL(
    data: Union[pd.DataFrame, np.ndarray],
    n: int = 20,
    p: int = 2
) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
    """
    布林带 (Bollinger Bands)

    MID = MA(CLOSE, N)
    UPPER = MID + STD(CLOSE, N) * P
    LOWER = MID - STD(CLOSE, N) * P

    Args:
        data: 价格数据
        n: 周期
        p: 标准差倍数

    Returns:
        (UPPER, MID, LOWER)
    """
    close = _validate_data(data)

    mid = MA(close, n)
    std = STD(close, n)

    upper = mid + std * p
    lower = mid - std * p

    return np.round(upper, 2), np.round(mid, 2), np.round(lower, 2)
```

## 5. 测试验证

### 5.1 本地测试

```python
# test_indicator.py
from FQData.DataSource import get_datasource
from FQFactor import RSI

ds = get_datasource()
data = ds.get_stock_day('000001', '2024-01-01', '2025-12-31')

close = data['close'].values
rsi = RSI(close, 14)

print(f"RSI(14) 最后5个值: {rsi[-5:]}")
print(f"RSI(14) 最后一天: {rsi[-1]:.2f}")
```

### 5.2 边界测试

```python
def test_boundary():
    # 测试数据不足周期
    short_data = np.array([1, 2, 3])

    # 测试极值
    extreme_data = np.array([0, 100, 0, 100])

    # 测试NaN
    nan_data = np.array([1, 2, np.nan, 4, 5])

    # 测试全相等
    constant_data = np.array([10, 10, 10, 10])
```

## 6. 常见问题

### Q1: 装饰器不生效？

检查：
1. 是否正确导入 `register_indicator` 和 `IndicatorCategory`
2. 装饰器是否在函数定义上方
3. 是否有语法错误

### Q2: 返回值不匹配？

确保：
1. 单值返回是 `np.ndarray`
2. 多值返回是 `Tuple[np.ndarray, ...]`
3. 使用 `np.round(result, 2)` 保留小数

### Q3: 数据提取失败？

确认数据格式：
- DataFrame 包含 "close" 列
- 或使用 `_get_ohlcv` 获取完整 OHLCV
