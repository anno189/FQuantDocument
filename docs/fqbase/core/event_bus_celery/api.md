---
title: EventBus Celery 集成 - API参考
description: EventBus Celery 集成 API 参考文档
tag:
  - fqbase
  - event_bus_celery

summary:
  purpose: api-reference
  core_functions:
    - setup_event_bus
    - get_event_bus
    - clear_event_bus
---

# EventBus Celery 集成 - API参考

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → **[API参考](./api.md)** |

## 函数

### setup_event_bus

**位置：** `FQBase/Core/event_bus_celery.py`

```python
from FQBase.Core.event_bus_celery import setup_event_bus

bus = setup_event_bus()
```

**描述：** 初始化 EventBus 实例，供 Celery Worker 启动时调用

**参数：** 无

**返回：** `EventBus` - EventBus 实例

**示例：**

```python
bus = setup_event_bus()
bus.subscribe('event', handler)
```

---

### get_event_bus

**位置：** `FQBase/Core/event_bus_celery.py`

```python
from FQBase.Core.event_bus_celery import get_event_bus

bus = get_event_bus()
```

**描述：** 获取当前 Worker 进程的 EventBus 实例

**参数：** 无

**返回：** `Optional[EventBus]` - EventBus 实例，如果尚未初始化则返回 None

**示例：**

```python
bus = get_event_bus()
if bus:
    bus.publish(Event('task', data))
```

---

### clear_event_bus

**位置：** `FQBase/Core/event_bus_celery.py`

```python
from FQBase.Core.event_bus_celery import clear_event_bus

clear_event_bus()
```

**描述：** 清除 EventBus 实例，供 Celery Worker 关闭时调用

**参数：** 无

**返回：** `None`

**示例：**

```python
# 在 Worker 关闭时清理
clear_event_bus()
```

---

## 常量

| 常量 | 类型 | 值 | 描述 |
|------|------|-----|------|
| _event_bus_instance | Optional[EventBus] | None | 模块级 EventBus 实例 |
| _celery_auto_init | bool | True | Celery 自动初始化开关 |

---

## 环境变量

| 变量 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| FQ_CELERY_AUTO_INIT | str | "true" | 设为 "false" 禁用自动初始化 |

---

## 相关文档

- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
