---
title: Signal Generator 开发指南
---

# Signal Generator 开发指南

本文档介绍如何开发和扩展 `SignalGenerator` 信号生成模块。

## 模块架构

```
FQFactor/signals/
├── signal_generator.py    # 核心信号生成器
└── __init__.py           # 模块导出
```

## 核心组件

### SignalType 枚举

定义系统支持的所有信号类型：

```python
class SignalType(Enum):
    """信号类型"""
    BUY = 1      # 买入信号
    SELL = -1    # 卖出信号
    HOLD = 0     # 持仓信号
    COVER = 2    # 覆盖/平空
    SHORT = -2   # 做空信号
```

**扩展信号类型**：

```python
class SignalType(Enum):
    BUY = 1
    SELL = -1
    HOLD = 0
    COVER = 2
    SHORT = -2
    # 新增信号类型
    WATCH = 3        # 关注信号
    EXIT_WATCH = -3  # 退出关注
```

### Signal 数据类

交易信号的完整数据结构：

```python
@dataclass
class Signal:
    """交易信号"""
    timestamp: Union[str, datetime, int]  # 时间戳
    code: str                              # 股票代码
    signal_type: SignalType               # 信号类型
    strength: float                        # 信号强度 (0-1)
    price: Optional[float] = None          # 参考价格
    reason: Optional[str] = None           # 信号原因
    metadata: Optional[Dict] = None       # 附加元数据
```

**添加新字段**：

```python
@dataclass
class Signal:
    timestamp: Union[str, datetime, int]
    code: str
    signal_type: SignalType
    strength: float
    price: Optional[float] = None
    reason: Optional[str] = None
    metadata: Optional[Dict] = None
    # 新增字段
    confidence: float = 1.0  # 置信度
    indicators: Optional[Dict] = None  # 相关指标值
```

## 信号生成方法

### cross_signal() 交叉信号

**原理**：当快线从下穿过慢线时产生买入信号，反之产生卖出信号。

```python
def cross_signal(
    self,
    fast: np.ndarray,
    slow: np.ndarray,
    codes: Optional[np.ndarray] = None,
    timestamps: Optional[np.ndarray] = None,
    threshold: float = 0,
) -> List[Signal]:
    signals = []
    diff = fast - slow
    prev_diff = np.roll(diff, 1)
    prev_diff[0] = diff[0]

    for i in range(1, len(diff)):
        if np.isnan(diff[i]) or np.isnan(prev_diff[i]):
            continue

        if prev_diff[i] <= threshold and diff[i] > threshold:
            signal_type = SignalType.BUY
            reason = "Golden Cross"
        elif prev_diff[i] >= threshold and diff[i] < threshold:
            signal_type = SignalType.SELL
            reason = "Death Cross"
        else:
            continue

        signals.append(Signal(...))
    return signals
```

**扩展：添加更多交叉类型**：

```python
def cross_signal_ex(
    self,
    fast: np.ndarray,
    slow: np.ndarray,
    strict: bool = False,  # 严格模式：需要一定幅度
    min_strength: float = 0.0,  # 最小交叉幅度
) -> List[Signal]:
    """扩展版交叉信号"""
    signals = []
    diff = fast - slow
    prev_diff = np.roll(diff, 1)
    prev_diff[0] = diff[0]

    for i in range(1, len(diff)):
        if np.isnan(diff[i]) or np.isnan(prev_diff[i]):
            continue

        current_strength = abs(diff[i] - prev_diff[i])

        # 严格模式检查
        if strict and current_strength < min_strength:
            continue

        if prev_diff[i] <= 0 and diff[i] > 0:
            signals.append(Signal(
                timestamp=timestamps[i] if timestamps else i,
                code=codes[i] if codes else "",
                signal_type=SignalType.BUY,
                strength=min(current_strength / min_strength, 1.0) if strict else 1.0,
                reason="Golden Cross"
            ))
        elif prev_diff[i] >= 0 and diff[i] < 0:
            signals.append(Signal(...))
    return signals
```

### threshold_signal() 阈值信号

**原理**：当指标突破上阈值时产生卖出信号，突破下阈值时产生买入信号。

```python
def threshold_signal(
    self,
    values: np.ndarray,
    upper_threshold: float,
    lower_threshold: float,
    codes: Optional[np.ndarray] = None,
    timestamps: Optional[np.ndarray] = None,
) -> List[Signal]:
    """阈值信号生成"""
    signals = []
    prev_values = np.roll(values, 1)
    prev_values[0] = values[0]

    for i in range(len(values)):
        if np.isnan(values[i]) or np.isnan(prev_values[i]):
            continue

        # 上突破 = SELL
        if prev_values[i] <= upper_threshold and values[i] > upper_threshold:
            signals.append(Signal(
                signal_type=SignalType.SELL,
                strength=values[i] / upper_threshold,
                reason=f"Upper threshold breach ({upper_threshold})",
                ...
            ))
        # 下突破 = BUY
        elif prev_values[i] >= lower_threshold and values[i] < lower_threshold:
            signals.append(Signal(
                signal_type=SignalType.BUY,
                strength=lower_threshold / values[i] if values[i] != 0 else 0,
                reason=f"Lower threshold breach ({lower_threshold})",
                ...
            ))
    return signals
```

### divergence_signal() 背离信号

**原理**：检测价格与指标的背离关系。

```python
def divergence_signal(
    self,
    price: np.ndarray,
    indicator: np.ndarray,
    codes: Optional[np.ndarray] = None,
    timestamps: Optional[np.ndarray] = None,
    lookback: int = 20,
) -> List[Signal]:
    """
    背离信号检测

    - Bullish Divergence: 价格创新低但指标未创新低 = BUY
    - Bearish Divergence: 价格创新高但指标未创新高 = SELL
    """
    signals = []

    for i in range(lookback, len(price)):
        if np.isnan(price[i]) or np.isnan(indicator[i]):
            continue

        price_trend = price[i] - price[i - lookback]
        indicator_trend = indicator[i] - indicator[i - lookback]

        # 熊市背离：价格涨，指标跌 = SELL
        if price_trend > 0 and indicator_trend < 0:
            signals.append(Signal(
                signal_type=SignalType.SELL,
                strength=min(abs(indicator_trend) / lookback, 1.0),
                reason="Bearish Divergence",
                ...
            ))
        # 牛市背离：价格跌，指标涨 = BUY
        elif price_trend < 0 and indicator_trend > 0:
            signals.append(Signal(
                signal_type=SignalType.BUY,
                strength=min(abs(indicator_trend) / lookback, 1.0),
                reason="Bullish Divergence",
                ...
            ))
    return signals
```

## 信号合并策略

### combine_signals() 实现

```python
def combine_signals(
    self,
    signal_lists: List[List[Signal]],
    method: str = "majority",
) -> List[Signal]:
    """
    合并多个信号

    支持的合并方法：
    - majority: 多数投票
    - unanimous: 全票通过
    - any: 任意一个
    """
    if not signal_lists:
        return []

    all_signals = []
    for signals in signal_lists:
        all_signals.extend(signals)

    # 按时间和代码分组
    grouped = {}
    for signal in all_signals:
        key = (signal.timestamp, signal.code)
        if key not in grouped:
            grouped[key] = []
        grouped[key].append(signal)

    result = []
    for key, signals in grouped.items():
        if method == "unanimous":
            # 全票通过：所有信号类型相同
            signal_types = set(s.signal_type for s in signals)
            if len(signal_types) == 1:
                result.append(signals[0])

        elif method == "majority":
            # 多数投票
            votes = {}
            for s in signals:
                votes[s.signal_type] = votes.get(s.signal_type, 0) + 1
            max_vote = max(votes.values())
            winners = [s for s in signals if votes[s.signal_type] == max_vote]
            if len(winners) == 1:  # 只有一票领先才采用
                result.append(winners[0])

        elif method == "any":
            # 任意一个
            result.append(signals[0])

    return result
```

### 自定义合并策略

```python
def weighted_combine_signals(
    self,
    signal_lists: List[List[Signal]],
    weights: List[float],
    threshold: float = 0.5,
) -> List[Signal]:
    """
    加权合并信号

    Args:
        signal_lists: 信号列表
        weights: 每个信号源的权重
        threshold: 采纳阈值
    """
    if not signal_lists or len(weights) != len(signal_lists):
        raise ValueError("Weights must match signal sources")

    # 归一化权重
    total_weight = sum(weights)
    weights = [w / total_weight for w in weights]

    # 收集所有信号
    all_signals = []
    for signals in signal_lists:
        all_signals.extend(signals)

    # 按时间和代码分组
    grouped = {}
    for signal in all_signals:
        key = (signal.timestamp, signal.code)
        if key not in grouped:
            grouped[key] = []
        grouped[key].append(signal)

    result = []
    for key, signals in grouped.items():
        # 计算加权得分
        scores = {}
        for s, w in zip(signals, weights):
            score = s.strength * w
            scores[s.signal_type] = scores.get(s.signal_type, 0) + score

        # 找出最高分
        best_type = max(scores, key=scores.get)
        best_score = scores[best_type]

        if best_score >= threshold:
            # 找到对应的信号
            best_signal = next(s for s in signals if s.signal_type == best_type)
            result.append(best_signal)

    return result
```

## 新增信号类型示例

### 趋势跟踪信号

```python
def trend_following_signal(
    self,
    price: np.ndarray,
    trend_ma: np.ndarray,
    momentum: np.ndarray,
    codes: Optional[np.ndarray] = None,
    timestamps: Optional[np.ndarray] = None,
) -> List[Signal]:
    """
    趋势跟踪信号

    条件：
    - 价格在均线上方
    - 动量指标为正
    """
    signals = []

    for i in range(1, len(price)):
        if np.isnan(price[i]) or np.isnan(trend_ma[i]):
            continue

        # 看涨信号
        if price[i] > trend_ma[i] and momentum[i] > 0:
            signals.append(Signal(
                timestamp=timestamps[i] if timestamps else i,
                code=codes[i] if codes else "",
                signal_type=SignalType.BUY,
                strength=min(momentum[i], 1.0),
                reason="Trend Following - Bullish",
                metadata={"price": price[i], "ma": trend_ma[i]}
            ))

        # 看跌信号
        elif price[i] < trend_ma[i] and momentum[i] < 0:
            signals.append(Signal(
                timestamp=timestamps[i] if timestamps else i,
                code=codes[i] if codes else "",
                signal_type=SignalType.SELL,
                strength=min(abs(momentum[i]), 1.0),
                reason="Trend Following - Bearish",
                metadata={"price": price[i], "ma": trend_ma[i]}
            ))

    return signals
```

### 成交量确认信号

```python
def volume_confirmed_signal(
    self,
    price: np.ndarray,
    volume: np.ndarray,
    volume_ma: np.ndarray,
    codes: Optional[np.ndarray] = None,
    timestamps: Optional[np.ndarray] = None,
) -> List[Signal]:
    """
    成交量确认信号

    条件：
    - 价格突破需要成交量确认
    - 成交量高于均量
    """
    signals = []

    for i in range(1, len(price)):
        if np.isnan(price[i]) or np.isnan(volume[i]):
            continue

        price_change = price[i] - price[i-1]
        volume_ratio = volume[i] / (volume_ma[i] + 1e-10)

        # 放量上涨 = BUY
        if price_change > 0 and volume_ratio > 1.5:
            signals.append(Signal(
                timestamp=timestamps[i] if timestamps else i,
                code=codes[i] if codes else "",
                signal_type=SignalType.BUY,
                strength=min(volume_ratio / 2, 1.0),
                reason=f"Volume Confirmed - {volume_ratio:.1f}x Volume",
            ))

        # 放量下跌 = SELL
        elif price_change < 0 and volume_ratio > 1.5:
            signals.append(Signal(
                timestamp=timestamps[i] if timestamps else i,
                code=codes[i] if codes else "",
                signal_type=SignalType.SELL,
                strength=min(volume_ratio / 2, 1.0),
                reason=f"Volume Confirmed - {volume_ratio:.1f}x Volume",
            ))

    return signals
```

## 测试指南

```python
import unittest
import numpy as np
from FQFactor.signals.signal_generator import (
    SignalGenerator, Signal, SignalType,
)

class TestCrossSignal(unittest.TestCase):
    """交叉信号测试"""

    def setUp(self):
        self.generator = SignalGenerator()

    def test_golden_cross(self):
        """测试金叉信号"""
        fast = np.array([1, 2, 3, 4, 5, 6])
        slow = np.array([3, 3, 3, 3, 3, 3])

        signals = self.generator.cross_signal(fast, slow)

        self.assertEqual(len(signals), 1)
        self.assertEqual(signals[0].signal_type, SignalType.BUY)
        self.assertEqual(signals[0].reason, "Golden Cross")

    def test_death_cross(self):
        """测试死叉信号"""
        fast = np.array([5, 4, 3, 2, 1, 0])
        slow = np.array([3, 3, 3, 3, 3, 3])

        signals = self.generator.cross_signal(fast, slow)

        self.assertEqual(len(signals), 1)
        self.assertEqual(signals[0].signal_type, SignalType.SELL)

    def test_no_cross(self):
        """测试无交叉情况"""
        fast = np.array([1, 2, 3, 4, 5])
        slow = np.array([1, 2, 3, 4, 5])

        signals = self.generator.cross_signal(fast, slow)
        self.assertEqual(len(signals), 0)


if __name__ == '__main__':
    unittest.main()
```

## 性能优化

### 向量化处理

```python
def cross_signal_vectorized(
    self,
    fast: np.ndarray,
    slow: np.ndarray,
    threshold: float = 0,
) -> np.ndarray:
    """向量化版本的交叉信号"""
    diff = fast - slow
    prev_diff = np.roll(diff, 1)
    prev_diff[0] = diff[0]

    # 向量化判断
    golden_cross = (prev_diff <= threshold) & (diff > threshold)
    death_cross = (prev_diff >= threshold) & (diff < threshold)

    # 返回信号数组
    signals = np.zeros(len(diff))
    signals[golden_cross] = SignalType.BUY.value
    signals[death_cross] = SignalType.SELL.value

    return signals
```

### 缓存优化

```python
class CachedSignalGenerator(SignalGenerator):
    """带缓存的信号生成器"""

    def __init__(self, *args, cache_size: int = 1000, **kwargs):
        super().__init__(*args, **kwargs)
        self._cache = {}
        self._cache_size = cache_size

    def _get_cache_key(self, func_name: str, *args, **kwargs) -> str:
        """生成缓存键"""
        import hashlib
        import json
        data = {
            'func': func_name,
            'args': [str(a) for a in args],
            'kwargs': {k: str(v) for k, v in kwargs.items()}
        }
        return hashlib.md5(json.dumps(data).encode()).hexdigest()

    def cross_signal(self, *args, **kwargs):
        key = self._get_cache_key('cross_signal', *args, **kwargs)
        if key in self._cache:
            return self._cache[key]

        result = super().cross_signal(*args, **kwargs)

        # LRU 缓存
        if len(self._cache) >= self._cache_size:
            oldest_key = next(iter(self._cache))
            del self._cache[oldest_key]

        self._cache[key] = result
        return result
```
