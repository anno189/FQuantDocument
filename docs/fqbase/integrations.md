---
title: FQBase - 集成指南
description: FQBase 集成指南，包含模块内部集成、系统集成和跨系统集成
tag:
  - fqbase
---

# FQBase - 集成指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [技术架构](./architecture.md) → **[集成指南](./integrations.md)** |

## 子模块集成指南

| 子模块 | 集成指南 | 说明 |
|--------|----------|------|
| Core | [集成指南](./core/integrations.md) | 事件总线、日志、通知 |
| Foundation | [集成指南](./foundation/integrations.md) | 验证、异常、重试、单例 |
| Util | [集成指南](./util/integrations.md) | 工具函数 |
| Config | [集成指南](./config/integrations.md) | 配置管理 |
| Cache | [集成指南](./cache/integrations.md) | 缓存抽象 |

---

## 1. 模块内部集成

FQBase 各子模块之间的组合使用。

### 1.1 事件驱动 + 日志 + 通知

```python
from FQBase.Core import get_event_bus, get_logger, NotificationManager, Event

event_bus = get_event_bus()
logger = get_logger('app')
notifier = NotificationManager()

@event_bus.subscribe('task_completed')
def on_task_completed(event):
    logger.info(f"任务完成: {event.data}")
    notifier.send(f"任务完成: {event.data}", channel='SYSTEM')

event_bus.publish(Event('task_completed', {'task_id': 123}))
```

### 1.2 重试 + 熔断器 + 缓存

```python
from FQBase.Foundation import retry
from FQBase.Foundation.circuit_breaker import CircuitBreaker
from FQBase.Cache import CacheAdapter

circuit = CircuitBreaker(failure_threshold=5, recovery_timeout=60)
cache = CacheAdapter()

@circuit
@retry(max_attempts=3, delay=1)
def fetch_data(code):
    cached = cache.get(f"data:{code}")
    if cached:
        return cached
    data = external_api.get(code)
    cache.set(f"data:{code}", data, ttl=300)
    return data
```

### 1.3 验证 + 异常处理 + 日志

```python
from FQBase.Foundation import validate_code, handle_exception
from FQBase.Core import get_logger

logger = get_logger('validator')

def process(code):
    try:
        validate_code(code)
        return do_process(code)
    except Exception as e:
        handle_exception(e, logger=logger)
        raise
```

---

## 2. 系统模块间集成

FQBase 与项目内其他模块的集成。

### 2.1 FQBase + FQData

```python
from FQBase.Core import get_logger
from FQData import DataSource

logger = get_logger('data')

# 使用 FQBase 的日志系统记录 FQData 的操作
logger.info("开始获取数据")
data = DataSource.get_stock_data('000001')
logger.info(f"获取数据成功: {len(data)} 条")
```

### 2.2 FQBase + FQFactor

```python
from FQBase.Foundation import retry
from FQFactor import FactorCalculator

@retry(max_attempts=3)
def calculate_factor(code, date):
    calculator = FactorCalculator(code, date)
    return calculator.calculate()
```

---

## 3. 跨系统集成

FQBase 与外部系统、框架的集成。

### 3.1 Flask + FQBase

```python
from flask import Flask
from FQBase.Core import get_logger, init_logging

app = Flask(__name__)
init_logging(level='INFO')
logger = get_logger('flask')

@app.route('/')
def index():
    logger.info('首页访问')
    return 'OK'
```

### 3.2 Celery + FQBase

```python
from celery import Celery
from FQBase.Core.event_bus_celery import setup_event_bus

app = Celery('tasks')

@app.task
def long_task():
    setup_event_bus(app)
    # 执行任务
```

### 3.3 Redis + FQBase

```python
from FQBase.Cache import CacheAdapter

cache = CacheAdapter(backend='redis', host='localhost', port=6379)
cache.set('key', 'value', ttl=3600)
```

---

## 集成模式总结

| 集成类型 | 典型场景 | 组合方案 |
|----------|----------|----------|
| 模块内部 | 事件驱动流程 | event_bus + logger + notification |
| 模块内部 | 外部调用保护 | retry + circuit_breaker + cache |
| 系统模块间 | 数据处理流水线 | FQBase + FQData |
| 跨系统 | Web 框架 | Flask + FQBase |
| 跨系统 | 任务队列 | Celery + FQBase |
| 跨系统 | 缓存后端 | Redis + FQBase |

## 相关文档

- [API参考](./api.md)
- [技术架构](./architecture.md)
- [案例库](./examples.md)
