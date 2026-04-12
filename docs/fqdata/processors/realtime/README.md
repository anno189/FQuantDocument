# realtime 子模块

盘中实时处理模块，提供市场数据采集、情绪分析和实时数据保存功能。

## 模块路径

`FQData.Processors.realtime`

## 模块结构

```
realtime/
├── __init__.py
├── base.py              # 实时处理器基类和数据类
├── market_collector.py # 市场数据采集器
├── emotion_analyzer.py  # 市场情绪分析器
└── realtime_saver.py    # 实时数据保存器
```

## 核心组件

### 数据类

#### MarketStatus

市场状态数据类。

| 属性 | 类型 | 说明 |
|------|------|------|
| `timestamp` | datetime | 时间戳 |
| `mins` | int | 交易分钟数 |
| `up_count` | int | 上涨股票数 |
| `down_count` | int | 下跌股票数 |
| `limit_up_count` | int | 涨停股票数 |
| `limit_down_count` | int | 跌停股票数 |
| `mean_rate` | float | 平均涨跌幅 |
| `mean_amount` | float | 平均成交额 |
| `market_sentiment` | float | 市场情绪 (0-100) |

#### RealtimeMarketData

实时市场数据类。

| 属性 | 类型 | 说明 |
|------|------|------|
| `data` | pd.DataFrame | 实时行情数据 |
| `blockdata` | pd.DataFrame | 板块实时数据 |
| `conceptdata` | pd.DataFrame | 概念实时数据 |
| `dataup` | pd.DataFrame | 涨停股票数据 |
| `datadown` | pd.DataFrame | 跌停股票数据 |
| `timestamp` | datetime | 数据时间戳 |

#### EmotionMetrics

情绪指标数据类。

| 属性 | 类型 | 说明 |
|------|------|------|
| `timestamp` | datetime | 时间戳 |
| `mins` | int | 交易分钟数 |
| `mean_rate` | float | 平均涨跌幅 |
| `mean_high_rate` | float | 强势股平均涨幅 |
| `mean_mid_rate` | float | 中势股平均涨幅 |
| `mean_low_rate` | float | 弱势股平均跌幅 |
| `mean_tui_rate` | float | 推货平均跌幅 |
| `limit_up_count` | int | 涨停数 |
| `limit_down_count` | int | 跌停数 |
| `up_count` | int | 上涨数 |
| `down_count` | int | 下跌数 |
| `zdb_ratio` | float | 炸板率 |
| `fund_flow` | float | 资金流向 |
| `market_sentiment` | float | 市场情绪 (0-100) |
| `sector_heat` | Dict[str, float] | 板块热度 |

### RealtimeProcessor

盘中实时处理器基类，继承自 `BaseProcessor`。

**类型**: `ProcessorType.STREAMING`

**核心方法**:

| 方法 | 说明 |
|------|------|
| `process()` | 处理实时数据（抽象方法） |
| `collect_market_data(mins)` | 采集市场数据 |
| `analyze_emotion(data, mins)` | 分析市场情绪 |
| `get_emotion_history(limit)` | 获取情绪历史 |
| `get_current_trade_minutes()` | 获取当前交易分钟数 |

### MarketCollector

市场数据采集器，继承自 `RealtimeProcessor`。

**功能**:
- 采集股票实时行情
- 采集板块实时数据
- 采集概念实时数据
- 识别涨停/跌停股票

**使用示例**:

```python
from FQData.Processors.realtime import MarketCollector

collector = MarketCollector()
result = collector.collect(mins=120)

print(f"采集到 {len(result.data)} 条行情")
print(f"涨停股票: {len(result.dataup)}")
print(f"板块数据: {len(result.blockdata)}")
```

### EmotionAnalyzer

市场情绪分析器，继承自 `RealtimeProcessor`。

**功能**:
- 计算市场情绪指标
- 分析板块热度
- 计算资金流向
- 识别市场热点

**使用示例**:

```python
from FQData.Processors.realtime import EmotionAnalyzer, MarketCollector

collector = MarketCollector()
analyzer = EmotionAnalyzer()

# 采集数据
market_data = collector.collect(mins=120)

# 分析情绪
emotion = analyzer.analyze(market_data, mins=120)

print(f"市场情绪: {emotion.market_sentiment}")
print(f"上涨/下跌: {emotion.up_count}/{emotion.down_count}")
print(f"涨停数: {emotion.limit_up_count}")
```

### RealtimeDataSaver

实时数据保存器，继承自 `RealtimeProcessor`。

**功能**:
- 保存实时行情到 MongoDB
- 保存市场情绪数据
- 按日期分区存储

**使用示例**:

```python
from FQData.Processors.realtime import RealtimeDataSaver

saver = RealtimeDataSaver()
result = saver.save(
    date="2024-01-01",
    save_emotion=True,
    save_market=True
)

print(f"保存成功: {result.success}")
```

## 交易分钟计算

A 股交易分钟计算规则：

```python
# 9:15-9:25 集合竞价期间为负数
9:30 = 0
11:30 = 120
13:00 = 121
15:00 = 240

# 计算公式
if hour == 9 and minute < 30:
    return -(25 - minute)
elif hour < 12:
    return (hour - 9) * 60 + (minute - 30)
elif hour == 12:
    return 120
else:
    return (hour - 13) * 60 + minute + 120
```

## 相关文档

- [Processors 模块](../README.md)
- [Pipeline 模块](../pipeline/README.md)
- [DataStore 模块](../datastore/README.md)