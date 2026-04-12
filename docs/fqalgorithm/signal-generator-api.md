---
title: Signal Generator API
---

# Signal Generator API 文档

提供基于因子的交易信号生成功能。

## 模块路径

```python
from FQFactor.signals.signal_generator import (
    SignalGenerator,
    Signal,
    SignalType,
)
```

## SignalType 枚举

定义信号类型。

```python
class SignalType(Enum):
    """信号类型"""
    BUY = 1      # 买入信号
    SELL = -1    # 卖出信号
    HOLD = 0     # 持仓信号
    COVER = 2    # 覆盖/平空
    SHORT = -2   # 做空信号
```

## Signal 数据类

交易信号数据结构。

```python
@dataclass
class Signal:
    """交易信号"""
    timestamp: Union[str, datetime, int]  # 时间戳
    code: str                              # 股票代码
    signal_type: SignalType               # 信号类型
    strength: float                        # 信号强度 (0-1)
    price: Optional[float] = None         # 参考价格
    reason: Optional[str] = None          # 信号原因
    metadata: Optional[Dict] = None       # 附加元数据
```

### 方法

#### to_dict()

将信号转换为字典格式。

```python
def to_dict(self) -> Dict:
    return {
        "timestamp": str(self.timestamp),
        "code": self.code,
        "signal": self.signal_type.value,
        "signal_name": self.signal_type.name,
        "strength": self.strength,
        "price": self.price,
        "reason": self.reason,
        "metadata": self.metadata,
    }
```

## SignalGenerator 类

信号生成器，基于指标和因子生成交易信号。

```python
class SignalGenerator:
    """
    信号生成器

    基于指标和因子生成交易信号
    """

    def __init__(self, name: str = "SignalGenerator"):
        self.name = name
```

### 方法

#### cross_signal()

生成交叉信号（金叉/死叉）。

```python
def cross_signal(
    self,
    fast: np.ndarray,
    slow: np.ndarray,
    codes: Optional[np.ndarray] = None,
    timestamps: Optional[np.ndarray] = None,
    threshold: float = 0,
) -> List[Signal]
```

**参数说明**：

| 参数 | 类型 | 说明 |
|------|------|------|
| `fast` | np.ndarray | 快线数据 |
| `slow` | np.ndarray | 慢线数据 |
| `codes` | Optional[np.ndarray] | 股票代码数组 |
| `timestamps` | Optional[np.ndarray] | 时间戳数组 |
| `threshold` | float | 交叉阈值，默认0 |

**返回值**：Signal 列表

**信号规则**：
- **BUY (Golden Cross)**: `prev_diff <= threshold` 且 `diff > threshold`
- **SELL (Death Cross)**: `prev_diff >= threshold` 且 `diff < threshold`

**示例**：

```python
import numpy as np
from FQFactor.signals.signal_generator import SignalGenerator

generator = SignalGenerator()

# 生成金叉死叉信号
fast = np.array([10, 11, 12, 13, 14, 15, 14, 13, 12, 11])
slow = np.array([12, 12, 12, 12, 12, 12, 12, 12, 12, 12])

signals = generator.cross_signal(fast, slow)
for sig in signals:
    print(f"{sig.timestamp}: {sig.signal_type.name} @ {sig.reason}")
```

#### threshold_signal()

生成阈值信号（超买/超卖）。

```python
def threshold_signal(
    self,
    values: np.ndarray,
    upper_threshold: float,
    lower_threshold: float,
    codes: Optional[np.ndarray] = None,
    timestamps: Optional[np.ndarray] = None,
) -> List[Signal]
```

**参数说明**：

| 参数 | 类型 | 说明 |
|------|------|------|
| `values` | np.ndarray | 指标值序列 |
| `upper_threshold` | float | 上阈值（突破产生SELL信号） |
| `lower_threshold` | float | 下阈值（突破产生BUY信号） |
| `codes` | Optional[np.ndarray] | 股票代码数组 |
| `timestamps` | Optional[np.ndarray] | 时间戳数组 |

**信号规则**：
- **SELL**: `prev_values <= upper_threshold` 且 `values > upper_threshold`
- **BUY**: `prev_values >= lower_threshold` 且 `values < lower_threshold`

**示例**：

```python
# RSI 超买超卖信号
rsi = np.array([30, 35, 40, 45, 50, 55, 60, 65, 70, 75])

signals = generator.threshold_signal(
    values=rsi,
    upper_threshold=70,  # 超买阈值
    lower_threshold=30,   # 超卖阈值
)
```

#### range_signal()

生成超买超卖信号（基于80/20分位数）。

```python
def range_signal(
    self,
    values: np.ndarray,
    codes: Optional[np.ndarray] = None,
    timestamps: Optional[np.ndarray] = None,
) -> List[Signal]
```

**参数说明**：

| 参数 | 类型 | 说明 |
|------|------|------|
| `values` | np.ndarray | 指标值序列 |
| `codes` | Optional[np.ndarray] | 股票代码数组 |
| `timestamps` | Optional[np.ndarray] | 时间戳数组 |

**信号规则**：
- 自动计算80/20分位数作为上下阈值
- 基于 `threshold_signal()` 实现

**示例**：

```python
# 基于价格动量的超买超卖信号
momentum = np.array([...])  # 动量指标值

signals = generator.range_signal(momentum)
```

#### divergence_signal()

生成价格与指标背离信号。

```python
def divergence_signal(
    self,
    price: np.ndarray,
    indicator: np.ndarray,
    codes: Optional[np.ndarray] = None,
    timestamps: Optional[np.ndarray] = None,
    lookback: int = 20,
) -> List[Signal]
```

**参数说明**：

| 参数 | 类型 | 说明 |
|------|------|------|
| `price` | np.ndarray | 价格数据 |
| `indicator` | np.ndarray | 指标数据 |
| `codes` | Optional[np.ndarray] | 股票代码数组 |
| `timestamps` | Optional[np.ndarray] | 时间戳数组 |
| `lookback` | int | 回看周期，默认20 |

**信号规则**：
- **Bearish Divergence (SELL)**: 价格上涨但指标下跌
- **Bullish Divergence (BUY)**: 价格下跌但指标上涨

**示例**：

```python
# 检测价格与RSI背离
price = np.array([100, 102, 105, 108, 110, 112, 115, 118, 120, 122])
rsi = np.array([70, 72, 75, 78, 80, 82, 79, 76, 73, 70])

signals = generator.divergence_signal(price, rsi, lookback=5)
```

#### factor_signal()

基于因子值生成信号。

```python
def factor_signal(
    self,
    factor_result: FactorResult,
    quantiles: Tuple[float, float] = (0.2, 0.8),
    codes: Optional[np.ndarray] = None,
) -> List[Signal]
```

**参数说明**：

| 参数 | 类型 | 说明 |
|------|------|------|
| `factor_result` | FactorResult | 因子结果对象 |
| `quantiles` | Tuple[float, float] | 分位数阈值 (下界, 上界) |
| `codes` | Optional[np.ndarray] | 股票代码数组 |

**信号规则**：
- **BUY**: 因子值 <= 下分位数
- **SELL**: 因子值 >= 上分位数

**示例**：

```python
from FQFactor.core.base_factor import FactorResult

# 假设有一个因子结果
factor_result = FactorResult(
    name="pe_ratio",
    values=np.array([5, 10, 15, 20, 25, 30, 35, 40, 45, 50]),
    timestamps=np.arange(10)
)

signals = generator.factor_signal(
    factor_result,
    quantiles=(0.2, 0.8)  # 20%分位买入，80%分位卖出
)
```

#### combine_signals()

合并多个信号。

```python
def combine_signals(
    self,
    signal_lists: List[List[Signal]],
    method: str = "majority",
) -> List[Signal]
```

**参数说明**：

| 参数 | 类型 | 说明 |
|------|------|------|
| `signal_lists` | List[List[Signal]] | 信号列表的列表 |
| `method` | str | 合并方法 |

**合并方法**：

| 方法 | 说明 |
|------|------|
| `majority` | 多数投票（默认） |
| `unanimous` | 全票通过 |
| `any` | 任意一个 |

**示例**：

```python
# 合并多个信号源
ma_signals = generator.cross_signal(fast_ma, slow_ma)
rsi_signals = generator.threshold_signal(rsi, 70, 30)
macd_signals = generator.cross_signal(macd_dif, macd_dea)

combined = generator.combine_signals(
    [ma_signals, rsi_signals, macd_signals],
    method="majority"
)
```

#### signals_to_dataframe()

将信号列表转换为DataFrame。

```python
@staticmethod
def signals_to_dataframe(signals: List[Signal]) -> pd.DataFrame
```

**示例**：

```python
signals = generator.cross_signal(fast, slow)
df = SignalGenerator.signals_to_dataframe(signals)

print(df)
#    timestamp code  signal signal_name  strength price        reason
# 0         4        1        BUY      1.0    None  Golden Cross
# 1         7       -1       SELL     -1.0    None  Death Cross
```

## 使用流程

```
┌─────────────────────────────────────────────────────────────┐
│                    Signal Generation Pipeline                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. 原始数据 ──► 2. 计算指标 ──► 3. 生成信号 ──► 4. 过滤/合并 │
│                                                              │
│     price data      indicators     raw signals    final signals │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 完整示例

```python
import numpy as np
from FQFactor.signals.signal_generator import (
    SignalGenerator, SignalType,
)
from FQFactor.utils import MA, EMA, MACD, RSI

# 1. 准备数据
close = np.array([10.0, 11.0, 12.0, 11.5, 12.5, 13.0, 12.0, 11.5, 12.0, 13.0,
                  14.0, 13.5, 14.5, 15.0, 14.0, 13.5, 14.0, 15.0, 16.0, 15.5])
high = close + 1
low = close - 1

# 2. 计算指标
ma5 = MA(close, 5)
ma20 = MA(close, 20)
dif, dea, macd_hist = MACD(close, SHORT=12, LONG=26, M=9)
rsi = RSI(close, 24)

# 3. 创建信号生成器
generator = SignalGenerator(name="MyStrategy")

# 4. 生成各种信号
ma_cross_signals = generator.cross_signal(ma5, ma20)
macd_cross_signals = generator.cross_signal(dif, dea)
rsi_signals = generator.threshold_signal(rsi, 70, 30)

# 5. 合并信号
all_signals = generator.combine_signals(
    [ma_cross_signals, macd_cross_signals, rsi_signals],
    method="majority"
)

# 6. 转换为DataFrame分析
df = SignalGenerator.signals_to_dataframe(all_signals)
print(df)
```
