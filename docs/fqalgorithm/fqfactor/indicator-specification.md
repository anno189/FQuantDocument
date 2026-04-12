# 因子函数编写规范

本文档介绍如何在 FQFactor 框架下编写因子函数。

## 1. 基本结构

因子函数必须遵循以下结构：

```python
from typing import Union, Tuple
import numpy as np
import pandas as pd

from FQFactor.indicators.registry import register_indicator, IndicatorCategory


@register_indicator("函数名", category=IndicatorCategory.类别, params={"参数": 默认值})
def 函数名(data: Union[pd.DataFrame, np.ndarray], 参数1: int = 默认值, ...) -> 返回类型:
    """
    函数说明 (公式)

    Args:
        data: 价格数据
        参数1: 说明
        ...

    Returns:
        返回说明
    """
    # 1. 提取数据
    close = _validate_data(data)

    # 2. 计算逻辑
    result = ...

    # 3. 返回 (统一用 np.round 保留2位小数)
    return np.round(result, 2)
```

## 2. 数据提取

### 2.1 辅助函数

| 函数 | 用途 | 返回 |
|------|------|------|
| `_validate_data(data)` | 提取 close 价格 | `np.ndarray` |
| `_get_ohlcv(data)` | 获取完整 OHLCV | `dict` |

### 2.2 使用示例

```python
# 纯价格指标 (只需要收盘价)
def _validate_data(data: Union[pd.DataFrame, np.ndarray]) -> np.ndarray:
    if isinstance(data, pd.DataFrame):
        if "close" in data.columns:
            return data["close"].values
        return data.iloc[:, 0].values
    return np.asarray(data)

# 需要OHLCV的指标
def _get_ohlcv(data: Union[pd.DataFrame, dict]) -> dict:
    if isinstance(data, pd.DataFrame):
        return {
            "open": data.get("open", data.get("Open", pd.Series([0])["Open"])).values,
            "high": data.get("high", data.get("High", pd.Series([0])["High"])).values,
            "low": data.get("low", data.get("Low", pd.Series([0])["Low"])).values,
            "close": data.get("close", data.get("Close", pd.Series([0])["Close"])).values,
            "volume": data.get("volume", data.get("Volume", pd.Series([0])["Volume"])).values,
        }
    return data
```

## 3. 指标分类

使用 `IndicatorCategory` 枚举值：

```python
from FQFactor.indicators.registry import IndicatorCategory

TREND      # 趋势指标
MOMENTUM   # 动量指标
VOLATILITY # 波动率指标
VOLUME     # 成交量指标
SENTIMENT  # 市场情绪
CUSTOM     # 自定义
```

## 4. 返回值规范

| 类型 | 示例 | 处理方式 |
|------|------|----------|
| 单值序列 | `MA`, `EMA` | `np.round(result, 2)` |
| 多值返回 | `MACD` → `(dif, dea, macd)` | 每个都 `np.round` |

## 5. 完整示例

### 示例1：简单价格指标

```python
@register_indicator("SMA", category=IndicatorCategory.TREND, params={"period": 20})
def SMA(data: Union[pd.DataFrame, np.ndarray], period: int = 20) -> np.ndarray:
    """
    简单移动平均线 (Simple Moving Average)

    SMA = SUM(CLOSE, N) / N

    Args:
        data: 价格数据
        period: 周期

    Returns:
        SMA值序列
    """
    close = _validate_data(data)
    result = pd.Series(close).rolling(window=period, min_periods=1).mean().values
    return np.round(result, 2)
```

### 示例2：多返回值指标

```python
@register_indicator("MACD", category=IndicatorCategory.TREND, params={"fast": 12, "slow": 26, "signal": 9})
def MACD(
    data: Union[pd.DataFrame, np.ndarray],
    fast: int = 12,
    slow: int = 26,
    signal: int = 9
) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
    """
    MACD指标

    DIF = EMA(CLOSE, FAST) - EMA(CLOSE, SLOW)
    DEA = EMA(DIF, SIGNAL)
    MACD = (DIF - DEA) * 2

    Args:
        data: 价格数据
        fast: 快线周期
        slow: 慢线周期
        signal: 信号线周期

    Returns:
        (DIF, DEA, MACD)
    """
    close = _validate_data(data)

    ema_fast = pd.Series(close).ewm(span=fast, min_periods=1, adjust=False).mean().values
    ema_slow = pd.Series(close).ewm(span=slow, min_periods=1, adjust=False).mean().values

    dif = ema_fast - ema_slow
    dea = pd.Series(dif).ewm(span=signal, min_periods=1, adjust=False).mean().values
    macd = (dif - dea) * 2

    return np.round(dif, 2), np.round(dea, 2), np.round(macd, 2)
```

### 示例3：使用OHLCV数据

```python
@register_indicator("ATR", category=IndicatorCategory.VOLATILITY, params={"n": 20})
def ATR(data: Union[pd.DataFrame, np.ndarray], n: int = 20) -> np.ndarray:
    """
    真实波动N日平均值 (Average True Range)

    TR = MAX(MAX(HIGH-LOW, ABS(HIGH-REF(CLOSE,1))), ABS(LOW-REF(CLOSE,1)))
    ATR = MA(TR, N)

    Args:
        data: OHLC数据
        n: 周期

    Returns:
        ATR值序列
    """
    ohlcv = _get_ohlcv(data)
    high = ohlcv["high"]
    low = ohlcv["low"]
    close = ohlcv["close"]

    prev_close = np.roll(close, 1)
    prev_close[0] = close[0]

    tr = np.maximum(
        high - low,
        np.maximum(
            np.abs(high - prev_close),
            np.abs(low - prev_close)
        )
    )

    atr = pd.Series(tr).rolling(window=n, min_periods=1).mean().values
    return np.round(atr, 2)
```

## 6. 注意事项

1. **必须使用 `@register_indicator` 装饰器** - 将函数注册到全局注册表
2. **参数必须有默认值** - 通过 `params` 字典声明
3. **统一返回 `np.ndarray`** - 不返回 pandas Series
4. **数值结果保留2位小数** - 使用 `np.round(result, 2)`
5. **使用现有的辅助函数** - 不要重复实现 `_validate_data` 和 `_get_ohlcv`
6. **docstring 必须完整** - 说明公式、参数和返回值

## 7. 注册与调用

### 7.1 自动注册

装饰器会在函数定义时自动注册到 `IndicatorRegistry`：

```python
@register_indicator("MA", category=IndicatorCategory.TREND, params={"period": 20})
def MA(data, period=20):
    ...
# 函数定义后即已注册，可直接调用
```

### 7.2 通过注册表调用

```python
from FQFactor.indicators.registry import IndicatorRegistry

registry = IndicatorRegistry.get_instance()

# 获取指标函数
ma_func = registry.get("MA").func

# 调用
result = ma_func(data, period=5)
```

## 8. 指标分类参考

| 分类 | 指标 |
|------|------|
| **TREND** | MA, EMA, MACD, BBI, DMA, TRIX, DMI |
| **MOMENTUM** | RSI, KDJ, WR, ROC, MTM, CCI, MFI |
| **VOLATILITY** | BOLL, ATR, VR, OBV, EMV, DPO, MASS |
| **VOLUME** | VOL, AMOUNT, VOL-RATIO |
| **SENTIMENT** | VIX, PUT-CALL |
