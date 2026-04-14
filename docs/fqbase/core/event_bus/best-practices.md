---
title: 事件总线 - 最佳实践
description: 事件总线最佳实践与建议
tag:
  - fqbase
  - event_bus
---

# 事件总线 - 最佳实践

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → [设计原则](./design.md) → [API参考](./api.md) → [开发指南](./development.md) → [使用指南](./usage.md) → **[最佳实践](./best-practices.md)** |
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → [安全指南](./security.md) → [故障排查](./troubleshooting.md) → [常见问题](./faq.md) → **[最佳实践](./best-practices.md)** |


## 概述

本指南总结了使用事件总线的最佳实践，帮助您构建高效、稳定的事件驱动系统。

## 性能最佳实践

### 技巧 1: 使用弱引用订阅

**建议：** 对于类方法订阅，始终使用弱引用

**代码 - 好：**

```python
class PriceMonitor:
    def on_price_update(self, event):
        self.latest_price = event.data['price']

monitor = PriceMonitor()
bus.subscribe('price_update', monitor.on_price_update, weak_ref=True)
```

**代码 - 差：**

```python
# 错误：类实例不再使用时仍被引用，导致内存泄漏
class PriceMonitor:
    def on_price_update(self, event):
        self.latest_price = event.data['price']

monitor = PriceMonitor()
bus.subscribe('price_update', monitor.on_price_update)  # 无弱引用
del monitor  # monitor 对象仍被 EventBus 引用，无法释放
```

### 技巧 2: 合理设置历史记录大小

**建议：** 根据实际需求设置 max_history，避免不必要的内存占用

**代码 - 好：**

```python
# 生产环境：根据需要设置合理大小
bus = EventBus(max_history=1000)

# 调试环境：可以设置更大以便问题排查
bus = EventBus(max_history=10000)
```

**代码 - 差：**

```python
# 过大：占用过多内存
bus = EventBus(max_history=1000000)

# 事件频繁时，内存会快速膨胀
for i in range(2000000):
    bus.publish(Event('tick', i))
```

### 技巧 3: 使用异步发布处理耗时操作

**建议：** 对于耗时的事件处理，使用异步发布

**代码 - 好：**

```python
import asyncio

# 方式1：使用 publishAwait
async def handle_trade(event):
    await save_to_database(event.data)  # 耗时 I/O
    await send_notification(event.data)

bus.subscribe('trade', handle_trade)
await bus.publishAwait(Event('trade', trade_data))

# 方式2：使用 publish_async
def on_complete():
    print("保存完成")

bus.publish_async(Event('trade', trade_data), callback=on_complete)
```

**代码 - 差：**

```python
# 错误：同步处理阻塞主流程
def slow_handler(event):
    time.sleep(10)  # 阻塞 10 秒
    save_to_database(event.data)

bus.subscribe('trade', slow_handler)
bus.publish(Event('trade', trade_data))  # 阻塞 10 秒
```

### 技巧 4: 批量发布使用批处理模式

**建议：** 频繁发布小批量事件时，考虑批量处理

**代码 - 好：**

```python
# 批量发布
def publish_batch(events):
    for event in events:
        bus.publish(event)

# 或者使用调度器定期发布
import threading
def background_publisher():
    while True:
        event = queue.get()
        bus.publish(event)
```

**代码 - 差：**

```python
# 频繁的小 publish 调用
for tick in ticks:
    bus.publish(Event('tick', tick))  # 每次都加锁、解锁
```

## 架构最佳实践

### 技巧 1: 使用清晰的命名约定

**建议：** 使用有意义的命名组织事件

```python
# 推荐：带有命名空间前缀
bus.subscribe('market.price_update', handler)
bus.subscribe('trade.order_executed', handler)
bus.subscribe('strategy.signal_generated', handler)

# 推荐：使用常量定义事件类型
class EventTypes:
    PRICE_UPDATE = 'market.price_update'
    ORDER_EXECUTED = 'trade.order_executed'
    SIGNAL_GENERATED = 'strategy.signal_generated'
```

### 技巧 2: 合理使用优先级

**建议：** 规划好处理顺序

```python
# 优先级规划示例
PRIORITY_CRITICAL = 100   # 关键业务（如风控检查）
PRIORITY_HIGH = 80        # 核心业务（如交易执行）
PRIORITY_NORMAL = 50      # 普通处理（如数据处理）
PRIORITY_LOW = 20         # 次要处理（如缓存更新）
PRIORITY_AUDIT = 10       # 日志审计（最后执行）

bus.subscribe('trade', check_risk, priority=PRIORITY_CRITICAL)
bus.subscribe('trade', execute_trade, priority=PRIORITY_HIGH)
bus.subscribe('trade', update_cache, priority=PRIORITY_LOW)
bus.subscribe_global(audit_logger, priority=PRIORITY_AUDIT)
```

### 技巧 3: 解耦模块边界

**建议：** 使用事件总线解耦模块，不要直接依赖

```python
# 好的做法：通过事件通信
class MarketDataService:
    def update(self, data):
        bus.publish(Event('market_data', data))

class TradingStrategy:
    def __init__(self):
        bus.subscribe('market_data', self.on_data)
    
    def on_data(self, event):
        signal = self.calculate(event.data)
        if signal:
            bus.publish(Event('signal', signal))

class RiskManager:
    def __init__(self):
        bus.subscribe('signal', self.check)
    
    def check(self, event):
        # 检查风险
        pass

# 差的做法：直接调用
# class TradingStrategy:
#     def __init__(self, market_data_service):  # 强耦合
```

### 技巧 4: 清理失效订阅

**建议：** 在模块卸载或不再需要时取消订阅

```python
# 方式1：使用订阅 ID
sub_id = bus.subscribe('event', handler)
# ... 使用订阅
bus.unsubscribe_by_id(sub_id)

# 方式2：使用上下文管理器
class Subscriber:
    def __init__(self):
        self.sub_id = None
    
    def start(self):
        self.sub_id = bus.subscribe('event', self.on_event)
    
    def stop(self):
        if self.sub_id:
            bus.unsubscribe_by_id(self.sub_id)

# 方式3：使用弱引用（自动清理）
bus.subscribe('event', handler, weak_ref=True)
```

## 错误处理最佳实践

### 技巧 1: 不要在事件处理中抛出异常

```python
# 好的做法：捕获并记录异常
def safe_handler(event):
    try:
        process_data(event.data)
    except ValidationError as e:
        logger.warning(f"数据验证失败: {e}")
    except Exception as e:
        logger.exception(f"处理事件失败: {e}")

# EventBus 会捕获异常，不影响其他订阅者
bus.subscribe('event', safe_handler)
```

### 技巧 2: 使用错误事件传播问题

```python
# 好的做法：通过事件通知错误
def handler(event):
    try:
        result = process(event.data)
        bus.publish(Event('processing_success', {'result': result}))
    except Exception as e:
        bus.publish(Event('processing_error', {
            'original_event': event,
            'error': str(e)
        }))

bus.subscribe('task', handler)
```

## 配置最佳实践

### 技巧 1: 使用环境变量配置

```python
import os

# 在启动时配置
max_workers = int(os.getenv('FQ_EVENTBUS_WORKERS', '4'))
bus = EventBus()

# Celery 集成配置
celery_auto_init = os.getenv('FQ_CELERY_AUTO_INIT', 'true').lower() == 'true'
```

### 技巧 2: 分离配置和业务

```python
# 配置模块
class EventBusConfig:
    MAX_HISTORY = 1000
    AUTO_CLEANUP_INTERVAL = 100
    PRIORITY = {
        'critical': 100,
        'high': 80,
        'normal': 50,
        'low': 20,
    }

# 使用配置
bus.subscribe('trade', handler, priority=EventBusConfig.PRIORITY['high'])
```

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [开发指南](./development.md)
- [性能调优](./performance.md)
