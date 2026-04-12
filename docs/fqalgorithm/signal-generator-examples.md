---
title: Signal Generator 应用示例
---

# Signal Generator 应用示例

本文档提供 `SignalGenerator` 信号生成器的实际应用示例。

## 目录

- [基础示例](#基础示例)
- [均线交叉策略](#均线交叉策略)
- [RSI 超买超卖策略](#rsi-超买超卖策略)
- [MACD 多指标策略](#macd-多指标策略)
- [背离交易策略](#背离交易策略)
- [多信号组合策略](#多信号组合策略)

---

## 基础示例

### 简单的金叉死叉

```python
import numpy as np
from FQFactor.signals.signal_generator import SignalGenerator, SignalType

# 准备数据
fast = np.array([10, 11, 12, 13, 14, 15, 14, 13, 12, 11])
slow = np.array([12, 12, 12, 12, 12, 12, 12, 12, 12, 12])

# 创建信号生成器
generator = SignalGenerator()

# 生成交叉信号
signals = generator.cross_signal(fast, slow)

# 打印信号
for sig in signals:
    print(f"时间点 {sig.timestamp}: {sig.signal_type.name} - {sig.reason}")

# 输出:
# 时间点 4: BUY - Golden Cross
# 时间点 7: SELL - Death Cross
```

---

## 均线交叉策略

### 双均线策略

```python
import numpy as np
import pandas as pd
from FQFactor.signals.signal_generator import SignalGenerator, SignalType
from FQFactor.utils import MA


class MovingAverageCrossStrategy:
    """双均线交叉策略"""

    def __init__(self, fast_period: int = 5, slow_period: int = 20):
        self.fast_period = fast_period
        self.slow_period = slow_period
        self.generator = SignalGenerator(name="MA_Cross")

    def generate_signals(self, close: np.ndarray) -> pd.DataFrame:
        """生成均线交叉信号"""
        # 计算均线
        fast_ma = MA(close, self.fast_period)
        slow_ma = MA(close, self.slow_period)

        # 生成交叉信号
        signals = self.generator.cross_signal(fast_ma, slow_ma)

        # 转换为DataFrame
        df = SignalGenerator.signals_to_dataframe(signals)
        return df


# 使用示例
close = np.array([
    10.0, 10.5, 11.0, 11.5, 12.0, 12.5, 13.0, 12.5, 12.0, 11.5,
    11.0, 10.5, 10.0, 10.5, 11.0, 11.5, 12.0, 12.5, 13.0, 13.5
])

strategy = MovingAverageCrossStrategy(fast_period=5, slow_period=10)
signals_df = strategy.generate_signals(close)
print(signals_df)
```

### 三均线策略

```python
import numpy as np
from FQFactor.signals.signal_generator import SignalGenerator, SignalType
from FQFactor.utils import MA


class TripleMAStrategy:
    """三均线策略"""

    def __init__(self):
        self.generator = SignalGenerator(name="Triple_MA")

    def generate_signals(self, close: np.ndarray) -> list:
        """三均线策略信号"""
        signals = []

        ma5 = MA(close, 5)
        ma10 = MA(close, 10)
        ma20 = MA(close, 20)

        # 短期上穿中期 + 中期上穿长期 = 强烈买入
        # 短期下穿中期 + 中期下穿长期 = 强烈卖出

        for i in range(1, len(close)):
            if np.isnan(ma5[i]) or np.isnan(ma20[i]):
                continue

            # 金叉：短期 > 中期 > 长期
            if ma5[i] > ma10[i] > ma20[i] and not (ma5[i-1] > ma10[i-1] > ma20[i-1]):
                signals.append(Signal(
                    timestamp=i,
                    code="",
                    signal_type=SignalType.BUY,
                    strength=1.0,
                    reason="Triple MA Bullish Alignment"
                ))

            # 死叉：短期 < 中期 < 长期
            elif ma5[i] < ma10[i] < ma20[i] and not (ma5[i-1] < ma10[i-1] < ma20[i-1]):
                signals.append(Signal(
                    timestamp=i,
                    code="",
                    signal_type=SignalType.SELL,
                    strength=1.0,
                    reason="Triple MA Bearish Alignment"
                ))

        return signals
```

---

## RSI 超买超卖策略

### RSI 区间交易策略

```python
import numpy as np
import pandas as pd
from FQFactor.signals.signal_generator import SignalGenerator, SignalType
from FQFactor.utils import RSI


class RSIStrategy:
    """RSI 超买超卖策略"""

    def __init__(self, rsi_period: int = 24, oversold: float = 30, overbought: float = 70):
        self.rsi_period = rsi_period
        self.oversold = oversold
        self.overbought = overbought
        self.generator = SignalGenerator(name="RSI_Strategy")

    def generate_signals(self, close: np.ndarray) -> pd.DataFrame:
        """生成RSI信号"""
        rsi = RSI(close, self.rsi_period)

        signals = self.generator.threshold_signal(
            values=rsi,
            upper_threshold=self.overbought,
            lower_threshold=self.oversold
        )

        return SignalGenerator.signals_to_dataframe(signals)


# 使用示例
close = np.array([
    100, 102, 105, 108, 110, 112, 115, 118, 120, 122,
    125, 128, 130, 132, 130, 128, 125, 122, 120, 118
])

strategy = RSIStrategy(rsi_period=14, oversold=30, overbought=70)
signals_df = strategy.generate_signals(close)
print(signals_df)
```

### RSI + 均线确认策略

```python
import numpy as np
from FQFactor.signals.signal_generator import SignalGenerator, SignalType
from FQFactor.utils import RSI, MA


class RSIConfirmationStrategy:
    """RSI + 均线确认策略"""

    def __init__(self):
        self.generator = SignalGenerator(name="RSI_Confirmation")

    def generate_signals(self, close: np.ndarray) -> list:
        """
        RSI 配合均线确认的策略

        买入条件：
        1. RSI < 30 (超卖)
        2. 价格在均线上方

        卖出条件：
        1. RSI > 70 (超买)
        2. 价格在均线下方
        """
        signals = []
        rsi = RSI(close, 24)
        ma20 = MA(close, 20)

        for i in range(1, len(close)):
            if np.isnan(rsi[i]) or np.isnan(ma20[i]):
                continue

            # 买入：RSI超卖 + 价格站稳均线
            if rsi[i] < 30 and close[i] > ma20[i]:
                signals.append(Signal(
                    timestamp=i,
                    code="",
                    signal_type=SignalType.BUY,
                    strength=min((30 - rsi[i]) / 30, 1.0),
                    reason="RSI Oversold + Price Above MA20",
                    metadata={"rsi": rsi[i], "price": close[i], "ma20": ma20[i]}
                ))

            # 卖出：RSI超买 + 价格跌破均线
            elif rsi[i] > 70 and close[i] < ma20[i]:
                signals.append(Signal(
                    timestamp=i,
                    code="",
                    signal_type=SignalType.SELL,
                    strength=min((rsi[i] - 70) / 30, 1.0),
                    reason="RSI Overbought + Price Below MA20",
                    metadata={"rsi": rsi[i], "price": close[i], "ma20": ma20[i]}
                ))

        return signals
```

---

## MACD 多指标策略

### 标准 MACD 策略

```python
import numpy as np
import pandas as pd
from FQFactor.signals.signal_generator import SignalGenerator, SignalType
from FQFactor.utils import MACD


class MACDStrategy:
    """MACD 标准策略"""

    def __init__(self, fast: int = 12, slow: int = 26, signal: int = 9):
        self.fast = fast
        self.slow = slow
        self.signal = signal
        self.generator = SignalGenerator(name="MACD")

    def generate_signals(self, close: np.ndarray) -> pd.DataFrame:
        """生成MACD信号"""
        dif, dea, macd_hist = MACD(close, SHORT=self.fast, LONG=self.slow, M=self.signal)

        signals = self.generator.cross_signal(dif, dea)

        return SignalGenerator.signals_to_dataframe(signals)


# 使用示例
close = np.array([
    10.0, 10.5, 11.0, 11.5, 12.0, 12.5, 13.0, 12.5, 12.0, 11.5,
    11.0, 10.5, 10.0, 10.5, 11.0, 11.5, 12.0, 12.5, 13.0, 13.5
])

strategy = MACDStrategy()
signals_df = strategy.generate_signals(close)
print(signals_df)
```

### MACD + RSI + 成交量策略

```python
import numpy as np
from FQFactor.signals.signal_generator import SignalGenerator, SignalType
from FQFactor.utils import MACD, RSI


class MultiIndicatorStrategy:
    """MACD + RSI 多指标策略"""

    def __init__(self):
        self.generator = SignalGenerator(name="Multi_Indicator")

    def generate_signals(self, close: np.ndarray, volume: np.ndarray) -> list:
        """
        多指标综合策略

        买入信号：
        1. MACD 金叉
        2. RSI < 50 (不是超买区域)
        3. 放量确认

        卖出信号：
        1. MACD 死叉
        2. RSI > 50 (不是超卖区域)
        """
        signals = []
        dif, dea, macd_hist = MACD(close)
        rsi = RSI(close)

        for i in range(1, len(close)):
            if np.isnan(dif[i]) or np.isnan(rsi[i]):
                continue

            # 计算成交量变化
            vol_ratio = volume[i] / (volume[i-1] + 1e-10)

            # 买入条件
            macd_cross_up = dif[i] > dea[i] and dif[i-1] <= dea[i-1]
            rsi_confirm = rsi[i] < 50
            volume_confirm = vol_ratio > 1.2

            if macd_cross_up and rsi_confirm and volume_confirm:
                signals.append(Signal(
                    timestamp=i,
                    code="",
                    signal_type=SignalType.BUY,
                    strength=min(vol_ratio / 2, 1.0),
                    reason="MACD Gold Cross + RSI Confirm + Volume",
                    metadata={
                        "dif": dif[i],
                        "dea": dea[i],
                        "rsi": rsi[i],
                        "vol_ratio": vol_ratio
                    }
                ))

            # 卖出条件
            macd_cross_down = dif[i] < dea[i] and dif[i-1] >= dea[i-1]
            rsi_confirm_sell = rsi[i] > 50

            if macd_cross_down and rsi_confirm_sell:
                signals.append(Signal(
                    timestamp=i,
                    code="",
                    signal_type=SignalType.SELL,
                    strength=0.8,
                    reason="MACD Death Cross + RSI Confirm",
                    metadata={"dif": dif[i], "dea": dea[i], "rsi": rsi[i]}
                ))

        return signals
```

---

## 背离交易策略

### 价格与RSI背离策略

```python
import numpy as np
from FQFactor.signals.signal_generator import SignalGenerator, SignalType, Signal
from FQFactor.utils import RSI


class DivergenceStrategy:
    """背离交易策略"""

    def __init__(self, lookback: int = 20):
        self.lookback = lookback
        self.generator = SignalGenerator(name="Divergence")

    def find_divergence(self, price: np.ndarray, indicator: np.ndarray) -> list:
        """
        检测背离

        牛市背离 (Bullish Divergence):
        - 价格创新低
        - 指标未创新低 (或指标低点抬高)
        → 买入信号

        熊市背离 (Bearish Divergence):
        - 价格创新高
        - 指标未创新高 (或指标高点降低)
        → 卖出信号
        """
        signals = []

        for i in range(self.lookback, len(price)):
            if np.isnan(price[i]) or np.isnan(indicator[i]):
                continue

            # 最近 lookback 周期内的价格高低点
            price_window = price[i - self.lookback:i + 1]
            indicator_window = indicator[i - self.lookback:i + 1]

            price_current = price[i]
            indicator_current = indicator[i]

            # 价格是否创新低？
            price_making_low = price_current == np.min(price_window)
            # 指标是否创新低？
            indicator_making_low = indicator_current == np.min(indicator_window)

            # 价格是否创新高？
            price_making_high = price_current == np.max(price_window)
            # 指标是否创新高？
            indicator_making_high = indicator_current == np.max(indicator_window)

            # 牛市背离：价格新低，指标不新低
            if price_making_low and not indicator_making_low:
                signals.append(Signal(
                    timestamp=i,
                    code="",
                    signal_type=SignalType.BUY,
                    strength=0.8,
                    reason="Bullish Divergence - Price making low but RSI not",
                    metadata={
                        "price": price_current,
                        "indicator": indicator_current,
                        "lookback": self.lookback
                    }
                ))

            # 熊市背离：价格新高，指标不新高
            elif price_making_high and not indicator_making_high:
                signals.append(Signal(
                    timestamp=i,
                    code="",
                    signal_type=SignalType.SELL,
                    strength=0.8,
                    reason="Bearish Divergence - Price making high but RSI not",
                    metadata={
                        "price": price_current,
                        "indicator": indicator_current,
                        "lookback": self.lookback
                    }
                ))

        return signals


# 使用示例
close = np.array([
    100, 98, 95, 92, 88, 85, 82, 80, 78, 75,
    72, 70, 72, 75, 78, 82, 85, 88, 90, 92
])

strategy = DivergenceStrategy(lookback=10)
signals = strategy.find_divergence(close, RSI(close))
```

---

## 多信号组合策略

### 信号组合与投票

```python
import numpy as np
from FQFactor.signals.signal_generator import SignalGenerator, SignalType
from FQFactor.utils import MA, EMA, MACD, RSI


class CombinedStrategy:
    """多信号组合策略"""

    def __init__(self):
        self.generator = SignalGenerator(name="Combined")

    def generate_signals(
        self,
        close: np.ndarray,
        volume: np.ndarray,
        confidence_threshold: float = 0.6
    ) -> list:
        """
        多指标组合策略

        使用多个指标产生信号，然后投票决定最终信号
        """
        # 计算各指标
        ma5 = MA(close, 5)
        ma20 = MA(close, 20)
        dif, dea, _ = MACD(close)
        rsi = RSI(close)

        # 生成各指标信号
        ma_signals = self.generator.cross_signal(ma5, ma20)
        macd_signals = self.generator.cross_signal(dif, dea)
        rsi_signals = self.generator.threshold_signal(rsi, 70, 30)

        # 合并所有信号
        all_signals = self.generator.combine_signals(
            [ma_signals, macd_signals, rsi_signals],
            method="majority"
        )

        # 过滤：只有多数指标同意才发出信号
        final_signals = []
        for signal in all_signals:
            if signal.strength >= confidence_threshold:
                final_signals.append(signal)

        return final_signals


# 使用示例
close = np.array([
    100, 102, 105, 108, 110, 112, 115, 118, 120, 122,
    125, 128, 130, 132, 130, 128, 125, 122, 120, 118
])
volume = np.array([
    1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900,
    2000, 2100, 2200, 2300, 2200, 2100, 2000, 1900, 1800, 1700
])

strategy = CombinedStrategy()
signals = strategy.generate_signals(close, volume)

for sig in signals:
    print(f"{sig.timestamp}: {sig.signal_type.name} - {sig.reason}")
```

### 动态权重信号组合

```python
import numpy as np
from FQFactor.signals.signal_generator import SignalGenerator, SignalType, Signal


class WeightedSignalCombiner:
    """动态权重信号组合器"""

    def __init__(self):
        self.generator = SignalGenerator()

    def weighted_combine(
        self,
        signal_lists: list,
        weights: list,
        threshold: float = 0.5
    ) -> list:
        """
        加权合并多个信号源

        Args:
            signal_lists: 多个信号列表
            weights: 对应权重
            threshold: 采用阈值
        """
        if not signal_lists or len(weights) != len(signal_lists):
            raise ValueError("Weights must match signal sources")

        # 归一化权重
        total = sum(weights)
        weights = [w / total for w in weights]

        # 收集所有信号
        all_signals = []
        for signals in signal_lists:
            all_signals.extend(signals)

        # 按时间分组
        grouped = {}
        for signal in all_signals:
            key = signal.timestamp
            if key not in grouped:
                grouped[key] = []
            grouped[key].append(signal)

        # 计算加权得分
        result = []
        for timestamp, signals in grouped.items():
            scores = {}
            for signal, weight in zip(signals, weights):
                score = signal.strength * weight
                scores[signal.signal_type] = scores.get(signal.signal_type, 0) + score

            best_type = max(scores, key=scores.get)
            best_score = scores[best_type]

            if best_score >= threshold:
                best_signal = next(s for s in signals if s.signal_type == best_type)
                result.append(best_signal)

        return result


# 使用示例
# 假设有三个策略的信号
strategy1_signals = [Signal(timestamp=1, code="", signal_type=SignalType.BUY, strength=0.8)]
strategy2_signals = [Signal(timestamp=1, code="", signal_type=SignalType.BUY, strength=0.6)]
strategy3_signals = [Signal(timestamp=1, code="", signal_type=SignalType.SELL, strength=0.7)]

combiner = WeightedSignalCombiner()
combined = combiner.weighted_combine(
    [strategy1_signals, strategy2_signals, strategy3_signals],
    weights=[0.5, 0.3, 0.2],  # 策略1权重最高
    threshold=0.4
)
```

---

## 信号分析与可视化

### 信号统计

```python
import pandas as pd
from FQFactor.signals.signal_generator import SignalGenerator, SignalType


def analyze_signals(signals: list) -> pd.DataFrame:
    """分析信号统计"""

    df = SignalGenerator.signals_to_dataframe(signals)

    stats = {
        "总信号数": len(df),
        "买入信号": len(df[df['signal'] == SignalType.BUY.value]),
        "卖出信号": len(df[df['signal'] == SignalType.SELL.value]),
        "平均信号强度": df['strength'].mean(),
        "最大信号强度": df['strength'].max(),
        "最小信号强度": df['strength'].min(),
    }

    return pd.DataFrame([stats]).T


# 使用示例
# signals = generator.cross_signal(fast, slow)
# stats = analyze_signals(signals)
# print(stats)
```

### 信号时间分布

```python
import pandas as pd
from FQFactor.signals.signal_generator import SignalGenerator, SignalType


def signal_time_distribution(signals: list) -> pd.Series:
    """分析信号时间分布"""

    df = SignalGenerator.signals_to_dataframe(signals)

    # 按时间戳统计
    time_dist = df.groupby('timestamp').size()

    return time_dist


def signal_type_timeline(signals: list) -> pd.DataFrame:
    """创建信号时间线"""

    df = SignalGenerator.signals_to_dataframe(signals)

    # 创建信号映射
    signal_map = {
        SignalType.BUY.value: 1,
        SignalType.SELL.value: -1,
        SignalType.HOLD.value: 0
    }

    df['signal_value'] = df['signal'].map(signal_map)

    return df[['timestamp', 'signal_value', 'strength', 'reason']]
```

---

## 下一步

- 查看 [API 文档](./signal-generator-api.md) 了解更多信号类型
- 查看 [开发指南](./signal-generator-dev.md) 了解如何扩展信号生成器
- 集成到回测系统进行策略评估
