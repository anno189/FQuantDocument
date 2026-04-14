---
title: Foundation 模块 - 术语表
description: Foundation 核心术语定义
tag:
  - fqbase
  - foundation
---

# Foundation 模块 - 术语表

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → **[术语表](./glossary.md)** |

## 子模块术语表

| 子模块 | 术语表 | 说明 |
|--------|---------|------|
| validators | [术语表](./validators/glossary.md) | 输入验证 |
| exceptions | [术语表](./exceptions/glossary.md) | 统一异常 |
| retry | [术语表](./retry/glossary.md) | 重试装饰器 |
| dotty | [术语表](./dotty/glossary.md) | 字典访问 |
| singleton | [术语表](./singleton/glossary.md) | 单例模式 |
| lifecycle | [术语表](./lifecycle/glossary.md) | 生命周期 |
| container | [术语表](./container/glossary.md) | 依赖注入 |
| circuit_breaker | [术语表](./circuit_breaker/glossary.md) | 熔断器 |

## 术语

### 单例模式 (Singleton)

确保类只有一个实例的模式。

### 依赖注入 (Dependency Injection)

通过外部注入而非内部创建的方式提供依赖对象。

### 熔断器 (Circuit Breaker)

防止级联故障的模式，状态包括：Closed、Open、Half-Open。

### 重试装饰器 (Retry Decorator)

自动重试失败操作的装饰器。

### 服务定位器 (Service Locator)

提供全局访问服务的方式。
