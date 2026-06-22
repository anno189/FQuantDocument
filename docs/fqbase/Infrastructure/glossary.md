---
title: Infrastructure - 术语表
description: Infrastructure 术语和概念解释
tag:
  - fquant
  - fqbase
  - infrastructure

summary:
  purpose: glossary
---

# Infrastructure - 术语表

## 阅读路径

🟢 **新手入门**：README → glossary

## 术语

### Singleton

单例模式，确保类只有一个实例。

### SingletonMeta

单例元类，线程安全的单例实现。

### FQLogger

统一的日志记录器，多实例单例模式。

### Circuit Breaker

熔断器模式，防止级联故障。

### CircuitState

熔断器状态：CLOSED, OPEN, HALF_OPEN。

### Retry

重试装饰器，支持多种重试策略。

### Exponential Backoff

指数退避策略，每次重试等待时间指数增长。

### Dependency Injection

依赖注入，将依赖从外部传入。

### ServiceContainer

服务容器，管理服务实例。

### ServiceLifetime

服务生命周期：SINGLETON, TRANSIENT, SCOPED。

### MongoClientManager

MongoDB 客户端管理器，线程安全单例。

### CircularDependencyException

循环依赖异常。

## 相关文档

- [README](./README.md)
- [核心概念](./concepts.md)
