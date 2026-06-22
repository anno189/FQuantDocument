---
title: Infrastructure
description: FQBase 底层基础设施模块，提供单例、日志、异常、重试、熔断器、依赖注入等
tag:
  - fquant
  - fqbase
  - infrastructure

summary:
  type: foundation
  complexity: high
  maturity: stable
  size: medium
  is_container: false
  api_exports:
    total: 45
    classes: 12
    functions: 33
    constants: 0
  features:
    has_async: true
    is_thread_safe: true
    has_config: false
    has_logging: true
    has_security: false
  usage_scenarios:
    - "使用单例模式管理全局实例"
    - "使用日志系统统一记录日志"
    - "使用重试装饰器包装不稳定的网络调用"
    - "使用熔断器保护下游服务"
    - "使用依赖注入容器管理依赖关系"
  warnings:
    - "Infrastructure 层是 FQBase 最底层，不应依赖其他 FQBase 子模块"
  limitations:
    - "单例模式在多进程环境下需要额外处理"
  design_patterns:
    - singleton
    - decorator
    - circuit_breaker
    - dependency_injection

relationships:
  belongs_to:
    - fquant.fqbase
  depends_on: []
  used_by:
    - fquant.fqbase.foundation
    - fquant.fqbase.config
    - fquant.fqbase.cache
    - fquant.fqbase.datastore
    - fquant.fqdata

documentation_progress:
  status: complete
  level: L3
  total_expected: 16
  total_generated: 16
  generated:
    - README.md
    - quick-start.md
    - concepts.md
    - api.md
    - usage.md
    - examples.md
    - glossary.md
    - changelog.md
    - best-practices.md
    - integrations.md
    - troubleshooting.md
    - configuration.md
    - architecture.md
    - design.md
    - patterns.md
    - development.md
  missing: []

maintenance:
  source_hash: "9a091a2b01f462d868d3621d46ebfc869687131d0c850d6c15fa8e0518283df8"
  source_mtime: 1776815639
  source_files:
    - "__init__.py"
    - "_mongo/__init__.py"
    - "_mongo/_interfaces.py"
    - "_mongo/_mongo_client.py"
    - "circuit_breaker.py"
    - "container.py"
    - "exceptions.py"
    - "logger.py"
    - "retry.py"
    - "singleton.py"
  last_updated: "2026-04"
---

# Infrastructure

## 阅读路径

🔵 **开发者**：README → api → usage → concepts → examples

🟠 **架构师**：README → architecture → design → patterns

## 一句话总览

📌 **FQBase 底层基础设施模块，提供单例、日志、异常、重试、熔断器、依赖注入等核心能力。**

## 架构图

```mermaid
graph TB
    subgraph Infrastructure["Infrastructure"]
        singleton["singleton - 单例模式"]
        logger["logger - 日志系统"]
        exceptions["exceptions - 异常处理"]
        retry["retry - 重试机制"]
        circuit_breaker["circuit_breaker - 熔断器"]
        container["container - 依赖注入"]
        mongo["_mongo - MongoDB客户端"]
    end
```

## 子模块

| 子模块 | 说明 |
|--------|------|
| singleton | 线程安全的单例模式实现 |
| logger | 统一日志系统 |
| exceptions | 异常类和异常处理工具 |
| retry | 重试装饰器 |
| circuit_breaker | 熔断器模式 |
| container | 依赖注入容器 |
| _mongo | MongoDB 客户端管理 |

## 快速链接

| 需求 | 文档 |
|------|------|
| 快速入门 | [快速入门](./quick-start.md) |
| 查看 API | [API参考](./api.md) |
| 核心概念 | [核心概念](./concepts.md) |
| 使用指南 | [使用指南](./usage.md) |
| 示例 | [示例](./examples.md) |
| 架构设计 | [架构](./architecture.md) |
| 设计原则 | [设计原则](./design.md) |
| 设计模式 | [设计模式](./patterns.md) |
| 配置指南 | [配置指南](./configuration.md) |
| 故障排查 | [故障排查](./troubleshooting.md) |
| 开发指南 | [开发指南](./development.md) |

## 文档统计

| 指标 | 值 |
|------|-----|
| 总文档数 | 16 |
| 核心类 | 40+ |
| 核心函数 | 10+ |
| 设计模式 | 5 |
| 异步支持 | 是 |
| 线程安全 | 是 |
| 被依赖关系 | Foundation, Config, Cache, DataStore, FQData |

## 相关文档

- [FQBase README](../README.md)
