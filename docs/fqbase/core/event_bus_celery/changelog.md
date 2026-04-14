---
title: EventBus Celery 集成 - 变更日志
description: EventBus Celery 集成版本历史与更新说明
tag:
  - fqbase
  - event_bus_celery
---

# EventBus Celery 集成 - 变更日志

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 📖 索引 | [README](./README.md) → **[变更日志](./changelog.md)** |

## v1.0.0 (当前版本)

### 新增

- 首次发布 EventBus Celery 集成模块
- setup_event_bus(): 初始化 EventBus 实例
- get_event_bus(): 获取当前 Worker 的 EventBus 实例
- clear_event_bus(): 清除 EventBus 实例
- 自动注册 Celery 信号处理器

### 配置

- FQ_CELERY_AUTO_INIT 环境变量支持禁用自动初始化

## 相关文档

- [README](./README.md)
