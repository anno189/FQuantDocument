---
title: Infrastructure - 变更日志
description: Infrastructure 模块变更历史
tag:
  - fquant
  - fqbase
  - infrastructure

summary:
  purpose: changelog
---

# Infrastructure - 变更日志

## 阅读路径

全部角色：README → changelog

## 2026-04

### 重大变更

- Infrastructure 模块作为 FQBase 最底层独立
- 单例模式重写，支持线程安全和测试隔离

### 新增功能

- singleton: 线程安全单例模式
- logger: 统一日志系统
- exceptions: 统一异常处理
- retry: 重试装饰器
- circuit_breaker: 熔断器模式
- container: 依赖注入容器
- _mongo: MongoDB 客户端管理

### 设计模式

- Singleton: 单例模式
- Decorator: 装饰器模式
- Circuit Breaker: 熔断器模式
- Dependency Injection: 依赖注入

## 相关文档

- [README](./README.md)
