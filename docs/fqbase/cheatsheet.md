---
title: FQBase - 速查表
description: FQBase 快速参考指南
tag:
  - fqbase
---

# FQBase - 速查表

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → **[速查表](./cheatsheet.md)** → [动手实验室](./workshop.md) → [使用指南](./usage.md) → [案例库](./examples.md) |

## 快速参考

### 导入

```python
# 核心模块
from FQBase.Core import Event, EventBus, get_event_bus, get_logger
from FQBase.Core import NotificationManager

# Foundation
from FQBase.Foundation import validate_code, validate_date, retry, singleton
from FQBase.Foundation import FQException, ValidationError

# Config
from FQBase.Config import get_env, load_env, GLOBALMAP

# 便捷导入
from FQBase import EventBus, get_logger
```

### 事件总线

```python
# 获取单例
event_bus = get_event_bus()

# 订阅
event_bus.subscribe('topic', handler)

# 发布
event_bus.publish(Event('topic', data))

# 取消订阅
event_bus.unsubscribe(subscription)
```

### 日志

```python
# 获取记录器
logger = get_logger('module_name')

# 记录
logger.debug('调试')
logger.info('信息')
logger.warning('警告')
logger.error('错误')
```

### 通知

```python
notifier = NotificationManager()
notifier.send('消息', channel='WECOM')
notifier.send('消息', channel='SERVERCHAN')
```

### 验证

```python
validate_code('000001')      # 股票代码
validate_date('2024-01-01')   # 日期
```

### 重试

```python
@retry(max_attempts=3, delay=1)
def operation():
    pass
```

### 配置

```python
load_env('.env')
value = get_env('KEY')
```

## 常用配置

```python
# 日志初始化
init_logging(level='INFO')

# 熔断器
circuit = CircuitBreaker(failure_threshold=5)

# 缓存
cache = CacheAdapter(backend='redis')
```

## 快速调试

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
- [案例库](./examples.md)
