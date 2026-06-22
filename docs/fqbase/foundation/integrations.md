---
title: Foundation - 集成指南
description: Foundation 与其他模块的集成
tag:
  - fquant
  - fqbase
  - foundation

summary:
  purpose: integrations
---

# Foundation - 集成指南

## 阅读路径

🔵 **开发者**：README → integrations → configuration

## 集成架构

```
┌─────────────────────────────────────────────┐
│              FQBase.Foundation              │
├─────────────────────────────────────────────┤
│  dotty  │ lifecycle │ notification │ event_bus │
└─────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│            FQBase.Infrastructure            │
├─────────────────────────────────────────────┤
│ logger │ singleton │ exceptions │ retry     │
└─────────────────────────────────────────────┘
```

## 与 Infrastructure 集成

Foundation 依赖 Infrastructure 层：

```python
from FQBase.Infrastructure.logger import get_logger
from FQBase.Infrastructure.singleton import singleton

logger = get_logger(__name__)

@singleton
class MyEventBus:
    pass
```

## 与 FQData 集成

FQData 使用 Foundation 实现数据更新通知：

```python
from FQBase.Foundation import EventBus, Event, get_event_bus

bus = get_event_bus()
bus.subscribe('data_update', my_handler)
```

## 与 Celery 集成

```python
from FQBase.Foundation.event_bus_celery import setup_event_bus, clear_event_bus

# Celery worker 启动时
setup_event_bus()

# Celery worker 关闭时
clear_event_bus()
```

## 相关文档

- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
