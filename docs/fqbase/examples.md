---
title: FQBase - 案例库
description: FQBase 实际应用场景与示例
tag:
  - fqbase
---

# FQBase - 案例库

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → **[案例库](./examples.md)** |

## 子模块案例库

| 子模块 | 案例库 | 说明 |
|--------|--------|------|
| Core | [案例库](./core/examples.md) | 事件总线、日志、通知 |
| Foundation | [案例库](./foundation/examples.md) | 验证、异常、重试、单例 |
| Util | [案例库](./util/examples.md) | 工具函数 |
| Config | [案例库](./config/examples.md) | 配置管理 |
| Cache | [案例库](./cache/examples.md) | 缓存抽象 |
| Date | [案例库](./date/examples.md) | 日期时间 |
| DataStore | [案例库](./datastore/examples.md) | 数据存储 |
| Crawler | [案例库](./crawler/examples.md) | 网页爬虫 |

---

## 场景 1: 交易信号通知系统

**业务需求**：当交易策略产生信号时，实时通知交易员

```python
from FQBase.Core import get_event_bus, get_logger, NotificationManager, Event

# 初始化组件
event_bus = get_event_bus()
logger = get_logger('strategy')
notifier = NotificationManager()

# 订阅交易信号事件
@event_bus.subscribe('trade_signal')
def on_trade_signal(event):
    signal = event.data
    logger.info(f"产生交易信号: {signal}")
    
    # 格式化消息
    message = f"""
    股票代码: {signal['code']}
    信号类型: {signal['signal']}
    价格: {signal['price']}
    时间: {signal['timestamp']}
    """
    
    # 发送企业微信通知
    notifier.send(message, channel='WECOM')

# 策略模块发布信号
def strategy_generate_signal(code, price):
    event_bus.publish(Event('trade_signal', {
        'code': code,
        'signal': 'BUY',
        'price': price,
        'timestamp': '2024-01-15 10:30:00'
    }))
```

---

## 场景 2: 带熔断器的外部数据调用

**业务需求**：保护系统免受外部服务故障影响，使用熔断器和缓存

```python
from FQBase.Foundation import retry
from FQBase.Foundation.circuit_breaker import CircuitBreaker
from FQBase.Cache import CacheAdapter

# 初始化组件
circuit_breaker = CircuitBreaker(failure_threshold=5, recovery_timeout=60)
cache = CacheAdapter()

@circuit_breaker
@retry(max_attempts=3, delay=1, backoff=2)
def fetch_quote(code):
    # 先从缓存获取
    cached = cache.get(f"quote:{code}")
    if cached:
        return cached
    
    # 调用外部 API
    data = external_api.get_quote(code)
    
    # 存入缓存
    cache.set(f"quote:{code}", data, ttl=60)
    return data
```

---

## 场景 3: 数据验证工作流

**业务需求**：对输入数据进行多层验证

```python
from FQBase.Foundation import (
    validate_code,
    validate_date,
    validate_dict,
    ValidationError
)

def validate_trade_request(request):
    # 验证股票代码
    validate_code(request['code'])
    
    # 验证日期
    validate_date(request['date'])
    
    # 验证数量为正数
    if request.get('quantity', 0) <= 0:
        raise ValidationError("数量必须为正数")
    
    # 验证字典结构
    validate_dict(request, {
        'code': {'type': 'string', 'required': True},
        'quantity': {'type': 'int', 'required': True},
        'price': {'type': 'float', 'required': True},
    })
    
    return True
```

---

## 场景 4: 异步任务处理

**业务需求**：使用 Celery 处理异步任务，并集成事件总线

```python
from celery import Celery
from FQBase.Core.event_bus_celery import setup_event_bus, clear_event_bus
from FQBase.Core import get_logger

app = Celery('tasks')
logger = get_logger('celery_task')

@app.task(bind=True)
def process_data(self, data_id):
    # 设置事件总线
    setup_event_bus(app)
    
    try:
        logger.info(f"开始处理数据: {data_id}")
        # 处理逻辑
        result = process(data_id)
        logger.info(f"数据处理完成: {data_id}")
        return result
    finally:
        clear_event_bus()
```

---

## 场景 5: 多渠道通知

**业务需求**：发送通知到多个渠道

```python
from FQBase.Core import NotificationManager

notifier = NotificationManager()

def send_alert(message, level='INFO'):
    # 所有渠道
    channels = ['WECOM', 'SERVERCHAN', 'PUSHBEAR']
    
    for channel in channels:
        try:
            notifier.send(f"[{level}] {message}", channel=channel)
        except Exception as e:
            print(f"发送失败 ({channel}): {e}")
```

---

## 场景 6: 配置热更新

**业务需求**：监听配置文件变化，动态更新配置

```python
from FQBase.Config import load_env, get_env, reload_env

# 初始加载
load_env('.env')
threshold = get_env('THRESHOLD', type=float)

# 监听文件变化（需要外部文件监视器）
def on_config_changed():
    reload_env()  # 重新加载
    threshold = get_env('THRESHOLD', type=float)
    print(f"配置已更新: threshold={threshold}")
```
