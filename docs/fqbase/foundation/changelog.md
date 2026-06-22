---
title: Foundation - 变更日志
description: Foundation 模块变更历史
tag:
  - fquant
  - fqbase
  - foundation

summary:
  purpose: changelog
---

# Foundation - 变更日志

## 阅读路径

全部角色：README → changelog

## 2026-04

### 重大变更

- Foundation 模块重构完成
- 移除了 validators, exceptions, retry, singleton, container, circuit_breaker, logger 等模块（已移至 Infrastructure 层）

### 新增功能

- dotty: 嵌套字典点号访问
- lifecycle: 生命周期管理（HealthCheckable, Initializable, Shutdownable 协议）
- notification: 统一通知服务（支持企业微信、Server酱、PushBear）
- notification_template: 通知模板管理
- event_bus: 事件总线
- event_bus_celery: EventBus 与 Celery 集成

### 设计模式

- Observer 模式：EventBus 实现发布订阅
- Factory 模式：dotty(), get_event_bus() 工厂函数
- Singleton 模式：EventBus 单例

## 相关文档

- [README](./README.md)
