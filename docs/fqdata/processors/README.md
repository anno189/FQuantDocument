# Processors 模块

数据处理模块，提供盘后处理和盘中实时分析功能。

## 模块路径

`FQData.Processors`

## 模块结构

```
Processors/
├── __init__.py           # 模块入口
├── base.py              # 处理器基类和接口
├── postmarket/         # 盘后处理
│   ├── __init__.py
│   ├── base.py         # 盘后处理器基类
│   ├── daily_saver.py  # 日线数据保存
│   └── factor_calculator.py  # 因子计算
└── realtime/           # 实时处理
    ├── __init__.py
    ├── base.py         # 实时处理器基类
    ├── market_collector.py  # 市场数据采集
    ├── emotion_analyzer.py   # 市场情绪分析
    └── realtime_saver.py     # 实时数据保存
```

## 核心组件

### 处理器类型

| 类型 | 说明 | 使用场景 |
|------|------|----------|
| `POSTMARKET` | 盘后处理 | 日线保存、因子计算 |
| `REALTIME` | 实时处理 | 盘中市场分析 |
| `BATCH` | 批量处理 | 批量数据处理 |
| `STREAMING` | 流式处理 | 实时数据流处理 |

### 处理器状态

| 状态 | 说明 |
|------|------|
| `IDLE` | 空闲 |
| `RUNNING` | 运行中 |
| `SUCCESS` | 执行成功 |
| `FAILED` | 执行失败 |
| `PARTIAL` | 部分成功 |

## 快速开始

### 使用基础处理器

```python
from FQData.Processors.base import BaseProcessor, ProcessorType

class MyProcessor(BaseProcessor):
    name = "my_processor"
    type = ProcessorType.BATCH

    def process(self, **kwargs):
        # 处理数据
        return {"result": "success"}
```

### 使用处理器流水线

```python
from FQData.Processors.base import ProcessorPipeline, BaseProcessor

pipeline = ProcessorPipeline(name="my_pipeline")
pipeline.add(processor1)
pipeline.add(processor2)

results = pipeline.execute(initial_data={"key": "value"})
```

### 盘后处理

```python
from FQData.Processors.postmarket import DailySaver, FactorCalculator

# 保存日线数据
saver = DailySaver()
result = saver.save(date="2024-01-01", save_xdxr=True)

# 计算因子
calculator = FactorCalculator()
result = calculator.calculate(date="2024-01-01")
```

### 实时处理

```python
from FQData.Processors.realtime import MarketCollector, EmotionAnalyzer

# 采集市场数据
collector = MarketCollector()
data = collector.collect(mins=120)

# 分析市场情绪
analyzer = EmotionAnalyzer()
emotion = analyzer.analyze(data, mins=120)
```

## 相关文档

- [FQData 模块](../README.md)
- [Pipeline 模块](../pipeline/README.md)
- [postmarket 子模块](./postmarket/README.md)
- [realtime 子模块](./realtime/README.md)