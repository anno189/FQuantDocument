---
title: FQAlgorithm 算法体系
---

# FQAlgorithm 算法体系

FQAlgorithm 是量化算法的核心模块，提供指标库、因子库、过滤器、信号生成和评估器等功能。

## 目录结构

```
FQAlgorithm/
├── Indicators/              # 基础技术指标库
│   ├── __init__.py
│   ├── registry.py          # 指标注册表
│   ├── calculator.py        # 因子计算器
│   ├── trend/              # 趋势指标
│   │   ├── __init__.py
│   │   ├── ma.py           # 移动平均线
│   │   └── macd.py         # MACD
│   ├── momentum/           # 动量指标
│   │   ├── __init__.py
│   │   ├── kdj.py          # KDJ
│   │   └── rsi.py          # RSI
│   ├── volatility/         # 波动指标
│   │   ├── __init__.py
│   │   ├── boll.py         # 布林带
│   │   ├── atr.py          # ATR
│   │   ├── cci.py          # CCI
│   │   └── obv.py          # OBV
│   └── ...
├── Factors/                # 因子库
│   ├── __init__.py
│   ├── alpha.py           # Alpha因子
│   ├── risk.py            # 风险因子
│   └── market.py          # 市场因子
├── Filters/                # 过滤器体系
│   ├── __init__.py
│   ├── base.py            # 过滤器基类
│   └── pipeline.py        # 过滤器管道
├── Signals/               # 信号生成
│   ├── __init__.py
│   ├── signal_generator.py # 信号生成器
│   └── composite_signals.py # 复合信号
├── Evaluators/            # 策略评估
│   ├── __init__.py
│   ├── performance.py     # 绩效评估
│   ├── risk_metrics.py    # 风险指标
│   └── optimization.py    # 参数优化
├── preprocessing.py       # 数据预处理
├── feature_engineering.py  # 特征工程
└── model_evaluator.py     # 模型评估
```

## FQFactor 模块

> FQFactor 是当前主要的因子计算模块，提供高效的函数式指标计算。

**文档**：[FQFactor 文档](./fqfactor/) - 当前推荐的因子计算模块

### 快速开始

```python
from FQData.DataSource import get_datasource
from FQFactor import MA, EMA, MACD, RSI, BOLL

ds = get_datasource()
data = ds.get_stock_day('000001', '2024-01-01', '2025-12-31')
close = data['close'].values

ma5 = MA(close, 5)
dif, dea, macd = MACD(close)
rsi6 = RSI(close, 6)
upper, mid, lower = BOLL(close, 20, 2)
```

## 核心功能

### 指标库 Indicators

提供20+技术指标，支持注册和计算。

```python
from FQBase.FQAlgorithm import (
    IndicatorRegistry, indicator,
    IndicatorCalculator,
)

# 使用装饰器注册指标
@indicator(name="MA", category="trend")
def calculate_ma(data, period=20):
    return data['close'].rolling(period).mean()

# 计算指标
calculator = IndicatorCalculator()
result = calculator.calculate(data, "MA", period=20)
```

**指标分类**：

| 类别 | 指标 | 说明 |
|-----|------|-----|
| **趋势** | MA, EMA, MACD, SAR | 移动平均、指数平滑、MACD、抛物线 |
| **动量** | KDJ, RSI, CCI, WR | 随机指标、相对强弱、顺势、威廉 |
| **波动** | BOLL, ATR, STD | 布林带、平均真实波幅、标准差 |
| **量价** | OBV, VR, MFI | 能量潮、成交量比、资金流 |

### 因子库 Factors

提供 Alpha因子、风险因子、市场因子。

```python
from FQBase.FQAlgorithm import (
    AlphaFactor, RiskFactor, MarketFactor,
)

# Alpha因子 - 捕捉超额收益
alpha = AlphaFactor()
factor_value = alpha.calculate(data)

# 风险因子 - 评估风险水平
risk = RiskFactor()
risk_value = risk.calculate(data)

# 市场因子 - 市场情绪指标
market = MarketFactor()
market_value = market.calculate(data)
```

### 过滤器 Filters

支持多种过滤条件的组合。

```python
from FQBase.FQAlgorithm import (
    BaseFilter, FilterType, FilterPipeline,
)

# 价格过滤
price_filter = PriceFilter(min_price=1, max_price=500)

# 成交量过滤
volume_filter = VolumeFilter(min_amount=5000000)

# 技术过滤
tech_filter = TechnicalFilter(kdj_j_below=20)

# 过滤器管道
pipeline = FilterPipeline()
pipeline.add_filter(price_filter, priority=100)
pipeline.add_filter(volume_filter, priority=90)
pipeline.add_filter(tech_filter, priority=80)

# 执行过滤
filtered_data = pipeline.execute(data)
```

### 信号生成 Signals

支持多种信号生成和复合信号。

```python
from FQBase.FQAlgorithm import (
    SignalGenerator, SignalType, CompositeSignals,
)

# 创建信号生成器
generator = SignalGenerator()

# 金叉信号
gold_cross = generator.generate(data, SignalType.GOLD_CROSS,
                                params={'fast': 5, 'slow': 20})

# 死叉信号
death_cross = generator.generate(data, SignalType.DEATH_CROSS,
                                 params={'fast': 5, 'slow': 20})

# 复合信号
composite = CompositeSignals()
composite.add_signal(gold_cross)
composite.add_signal(volume_signal)
result = composite.combine()
```

### 评估器 Evaluators

支持策略绩效评估、风险指标计算、参数优化。

```python
from FQBase.FQAlgorithm import (
    PerformanceEvaluator, RiskMetrics,
    ParameterOptimizer, GeneticOptimizer,
)

# 绩效评估
evaluator = PerformanceEvaluator()
metrics = evaluator.evaluate(strategy_returns, benchmark_returns)
# 返回: Sharpe, Sortino, Calmar, 最大回撤等

# 风险指标
risk_metrics = RiskMetrics()
risk = risk_metrics.calculate(returns)
# 返回: VaR, CVaR, 波动率, 最大回撤等

# 参数优化 - 遗传算法
optimizer = GeneticOptimizer()
best_params = optimizer.optimize(
    objective_func,
    param_space={'ma_period': (5, 60), 'kdj_period': (9, 30)}
)
```

### 数据预处理 Preprocessing

```python
from FQBase.FQAlgorithm import (
    DataPreprocessor, TimeSeriesPreprocessor,
    FillMethod, OutlierMethod,
)

preprocessor = DataPreprocessor()

# 缺失值填充
data = preprocessor.fill_missing(data, method=FillMethod.FFWARD)

# 异常值处理
data = preprocessor.remove_outliers(data, method=OutlierMethod.SIGMA,
                                      threshold=3.0)

# 标准化
data = preprocessor.normalize(data, method='zscore')
```

### 特征工程 FeatureEngineering

```python
from FQBase.FQAlgorithm import (
    FeatureGenerator, FeatureSelector, FeatureEngineering,
)

# 特征生成
generator = FeatureGenerator()
features = generator.generate(data, [
    'price_change',
    'volume_ratio',
    'volatility',
])

# 特征选择
selector = FeatureSelector()
selected = selector.select(features, target, method='pearson')

# 特征工程
engineering = FeatureEngineering()
result = engineering.transform(data)
```

## Signal Generator 信号生成器

`SignalGenerator` 提供基于指标的交易信号生成功能，支持交叉信号、阈值信号、背离信号等多种信号类型。

### 文档

- [API 文档](./signal-generator-api.md) - SignalGenerator 完整 API 参考
- [开发指南](./signal-generator-dev.md) - 如何扩展和定制信号生成器
- [应用示例](./signal-generator-examples.md) - 实际交易策略示例

### 快速开始

```python
from FQFactor.signals.signal_generator import SignalGenerator, SignalType

generator = SignalGenerator()

# 金叉死叉信号
signals = generator.cross_signal(fast_ma, slow_ma)

# 超买超卖信号
signals = generator.threshold_signal(rsi, upper=70, lower=30)

# 背离信号
signals = generator.divergence_signal(price, rsi)

# 合并多个信号
combined = generator.combine_signals([signals1, signals2], method="majority")
```

## 导出 API

```python
__all__ = [
    # 指标
    "IndicatorRegistry",
    "indicator",
    "IndicatorCalculator",

    # 过滤器
    "BaseFilter",
    "FilterType",
    "FilterPipeline",

    # 评估器
    "PerformanceEvaluator",
    "RiskMetrics",
    "ParameterOptimizer",
    "GeneticOptimizer",

    # 信号
    "SignalGenerator",
    "SignalType",
    "CompositeSignals",

    # 预处理
    "DataPreprocessor",
    "TimeSeriesPreprocessor",
    "FillMethod",
    "OutlierMethod",

    # 特征工程
    "FeatureGenerator",
    "FeatureSelector",
    "FeatureEngineering",

    # 模型评估
    "ModelEvaluator",
    "BacktestEvaluator",
]
```

## 使用示例

```python
from FQBase.FQAlgorithm import (
    IndicatorCalculator, FilterPipeline, SignalGenerator,
    PerformanceEvaluator, DataPreprocessor,
)

# 1. 数据预处理
preprocessor = DataPreprocessor()
data = preprocessor.fill_missing(raw_data)

# 2. 计算指标
calculator = IndicatorCalculator()
ma5 = calculator.calculate(data, 'MA', period=5)
ma20 = calculator.calculate(data, 'MA', period=20)
kdj = calculator.calculate(data, 'KDJ')

# 3. 信号生成
generator = SignalGenerator()
gold_cross = generator.generate(data, SignalType.GOLD_CROSS,
                                params={'fast': 5, 'slow': 20})

# 4. 过滤
pipeline = FilterPipeline()
pipeline.add_filter(price_filter)
pipeline.add_filter(volume_filter)
filtered = pipeline.execute(data)

# 5. 绩效评估
evaluator = PerformanceEvaluator()
metrics = evaluator.evaluate(strategy_returns, benchmark_returns)
```
