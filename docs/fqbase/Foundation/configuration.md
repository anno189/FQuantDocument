---
title: Foundation - 配置指南
description: Foundation 配置参数和环境变量
tag:
  - fquant
  - fqbase
  - foundation

summary:
  purpose: configuration
---

# Foundation - 配置指南

## 阅读路径

🟡 **运维**：README → configuration → troubleshooting

## 环境变量

### FQ_EVENTBUS_WORKERS

事件总线 ThreadPoolExecutor 线程数

```bash
export FQ_EVENTBUS_WORKERS=8
```

默认值：4

### FQ_EVENTBUS_AUTHORIZATION_ENABLED

事件总线授权功能启用

```bash
export FQ_EVENTBUS_AUTHORIZATION_ENABLED=true
```

默认值：false

## 配置初始化

### 基础设施初始化

```python
from FQBase.Infrastructure import init

init()
```

### EventBus 初始化

```python
from FQBase.Foundation.event_bus_celery import setup_event_bus

setup_event_bus()
```

## 相关文档

- [使用指南](./usage.md)
- [故障排查](./troubleshooting.md)
