# Pipeline 模块

任务调度模块，基于 Celery 提供定时任务和异步任务功能。

## 模块路径

`FQData.Pipeline`

## 模块结构

```
Pipeline/
├── __init__.py          # 模块入口，导出任务函数
├── celeryconfig.py     # Celery 配置
├── scheduler.py         # 定时任务调度配置
└── tasks.py            # Celery 任务定义
```

## 核心概念

### 任务类型

| 类型 | 说明 | 执行时间 |
|------|------|----------|
| 盘后任务 (postmarket) | 日线保存、因子计算 | 16:00、18:00 |
| 实时任务 (realtime) | 盘中市场/板块分析 | 交易时间内每分钟 |

### 队列设计

```
default queue     # 默认队列
postmarket queue # 盘后任务队列
realtime queue   # 实时任务队列
```

## 定时任务

### scheduler.py - Beat 调度配置

| 任务 | 执行时间 | 队列 |
|------|----------|------|
| `postmarket.save_daily` | 16:00 (周一至周五) | postmarket |
| `postmarket.calculate_factors` | 18:00 (周一至周五) | postmarket |
| `realtime.analyze_market` | 每 60 秒 | realtime |
| `realtime.analyze_sector` | 每 60 秒 | realtime |
| `realtime.save_realtime_data` | 15:35 (周一至周五) | postmarket |

## Celery 任务

### tasks.py - 任务定义

#### save_daily

```python
@app.task(bind=True, name="postmarket.save_daily")
def save_daily(self, date: str = None):
    """
    盘后保存日线数据

    Args:
        date: 交易日期 (YYYY-MM-DD)，默认为当天

    Returns:
        保存结果，包含 saved_count 等信息
    """
```

**执行时机**: 16:00（A股收盘后）

**功能**:
- 保存股票日线数据
- 保存除权除息数据 (save_xdxr=True)
- 保存债券数据 (save_bond=True)
- 保存概念数据 (save_concept=True)

#### calculate_factors

```python
@app.task(bind=True, name="postmarket.calculate_factors")
def calculate_factors(self, date: str = None):
    """
    盘后计算因子

    Args:
        date: 交易日期 (YYYY-MM-DD)，默认为当天

    Returns:
        计算结果，包含 computed_factors 等信息
    """
```

**执行时机**: 18:00

**功能**:
- 计算 RPS (Relative Price Strength) 因子
- 计算板块轮动因子
- 更新股票池

#### analyze_market_realtime

```python
@app.task(bind=True, name="realtime.analyze_market")
def analyze_market_realtime(self, mins: int = None):
    """
    盘中实时市场分析

    Args:
        mins: 交易分钟数

    Returns:
        市场情绪分析结果
    """
```

**执行时机**: 交易时间内每分钟

**返回数据**:
```python
{
    "timestamp": "2024-01-01T14:30:00",
    "mins": 180,
    "emotion": {...},
    "up_count": 1500,
    "down_count": 800,
    "limit_up_count": 50
}
```

#### analyze_sector_realtime

```python
@app.task(bind=True, name="realtime.analyze_sector")
def analyze_sector_realtime(self):
    """
    盘中实时板块分析

    Returns:
        板块分析结果
    """
```

**执行时机**: 交易时间内每分钟

#### save_realtime_data

```python
@app.task(bind=True, name="realtime.save_realtime_data")
def save_realtime_data(self, date: str = None):
    """
    保存实时数据到存储

    Args:
        date: 交易日期

    Returns:
        保存结果
    """
```

**执行时机**: 15:35（收盘后）

## 辅助函数

### get_current_trade_minutes

```python
def get_current_trade_minutes() -> int:
    """
    获取当前交易分钟数

    A股交易分钟计算:
    - 9:30 = 0
    - 11:30 = 120
    - 13:00 = 121
    - 15:00 = 240
    """
```

### is_trading_time

```python
def is_trading_time() -> bool:
    """
    判断当前是否为交易时间

    交易时间段:
    - 上午: 9:15 - 11:30
    - 下午: 13:00 - 15:00
    """
```

## 快速开始

### 启动 Worker

```bash
# 启动盘后任务 Worker
celery -A FQData.Pipeline.tasks worker -Q postmarket -l INFO

# 启动实时任务 Worker
celery -A FQData.Pipeline.tasks worker -Q realtime -l INFO

# 启动所有 Worker
celery -A FQData.Pipeline.tasks worker -l INFO
```

### 启动 Beat

```bash
celery -A FQData.Pipeline.tasks beat -l INFO
```

### 手动执行任务

```python
from FQData.Pipeline.tasks import save_daily, calculate_factors

# 保存日线数据
result = save_daily.delay(date="2024-01-01")

# 计算因子
result = calculate_factors.delay(date="2024-01-01")
```

## 配置

### celeryconfig.py

```python
broker_url = "redis://localhost:6379/0"
result_backend = "redis://localhost:6379/0"

task_serializer = "json"
result_serializer = "json"
timezone = "Asia/Shanghai"

# 任务路由
task_routes = {
    "postmarket.*": {"queue": "postmarket"},
    "realtime.*": {"queue": "realtime"},
}
```

## 依赖关系

```
Pipeline
├── Processors.postmarket
│   ├── DailySaver
│   └── FactorCalculator
└── Processors.realtime
    ├── MarketCollector
    ├── EmotionAnalyzer
    └── RealtimeDataSaver
```

## 相关文档

- [FQData 模块](../README.md)
- [DataSource 模块](../datasource/README.md)
- [DataStore 模块](../datastore/README.md)
- [Processors 模块](./processors/README.md)