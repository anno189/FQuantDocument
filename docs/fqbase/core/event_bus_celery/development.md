---
title: EventBus Celery 集成 - 开发指南
description: EventBus Celery 集成开发指南
tag:
  - fqbase
  - event_bus_celery
---

# EventBus Celery 集成 - 开发指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → [API参考](./api.md) → **[开发指南](./development.md)** |

## 概述

本指南介绍如何开发和贡献 EventBus Celery 集成模块。

## 开发环境设置

### 前置要求

- Python 3.8+
- Celery
- FQBase

### 设置

```bash
pip install -e FQuant.Server/FQBase
pip install celery
```

## 测试

### 运行测试

```bash
pytest tests/test_event_bus_celery.py
```

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
