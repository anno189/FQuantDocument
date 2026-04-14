---
title: 事件总线 - 配置指南
description: 事件总线配置选项详解
tag:
  - fqbase
  - event_bus
---

# 事件总线 - 配置指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → **[配置指南](./configuration.md)** → [安全指南](./security.md) → [故障排查](./troubleshooting.md) → [常见问题](./faq.md) |


## 概述

本章节详细介绍事件总线的所有配置选项。

## 配置文件

### 文件位置

事件总线配置可以通过代码或环境变量设置。

### 基本配置

```python
from FQBase.Core.event_bus import EventBus

bus = EventBus(
    max_history=1000,
    auto_cleanup_interval=100
)
```

## 配置选项

### 核心选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| max_history | int | 100 | 最大历史记录数 |
| auto_cleanup_interval | int | 100 | 自动清理失效订阅的间隔 |

### 高级选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| _executor | ThreadPoolExecutor | 4 线程 | 异步执行器 |

## 环境变量

| 变量 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| FQ_EVENTBUS_WORKERS | str | "4" | ThreadPoolExecutor 线程数 |
| FQ_CELERY_AUTO_INIT | str | "true" | Celery 自动初始化 |

### 配置示例

### 最小配置

```python
from FQBase.Core.event_bus import get_event_bus

bus = get_event_bus()
```

### 完整配置

```python
import os

# 设置线程数（在导入前）
os.environ['FQ_EVENTBUS_WORKERS'] = '8'

from FQBase.Core.event_bus import EventBus

bus = EventBus(
    max_history=5000,
    auto_cleanup_interval=50
)
```

### 环境特定配置

```python
# 开发环境
if os.getenv('ENV') == 'development':
    bus = EventBus(max_history=10000)

# 生产环境
if os.getenv('ENV') == 'production':
    bus = EventBus(max_history=1000)
```

## 配置优先级

配置值按以下顺序解析（从高到低）：

1. 代码参数（最高优先级）
2. 环境变量
3. 默认值（最低优先级）

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
