---
title: Foundation
description: FQBase 核心抽象层，提供事件总线、通知、生命周期、Dotty 等
tag:
  - fquant
  - fqbase
  - foundation

summary:
  type: foundation
  complexity: high
  maturity: stable
  size: medium
  is_container: true
  api_exports:
    total: 35
    classes: 15
    functions: 20
    constants: 0
  features:
    has_async: true
    is_thread_safe: true
    has_config: false
    has_logging: true
    has_security: false
  usage_scenarios:
    - "使用事件总线实现组件解耦"
    - "使用通知服务发送企业微信/Server酱通知"
    - "使用生命周期管理服务状态"
    - "使用 Dotty 简化嵌套字典访问"
  warnings:
    - "Foundation 层依赖 Infrastructure 层"
    - "Celery 集成是可选功能"
  limitations:
    - "需要 Infrastructure 层先初始化"
  design_patterns:
    - observer
    - observer
    - lifecycle

relationships:
  belongs_to:
    - fquant.fqbase
  contains:
    - fquant.fqbase.foundation.dotty
    - fquant.fqbase.foundation.event_bus
    - fquant.fqbase.foundation.event_bus_celery
    - fquant.fqbase.foundation.lifecycle
    - fquant.fqbase.foundation.notification
    - fquant.fqbase.foundation.notification_template
  depends_on:
    - fquant.fqbase.infrastructure
  used_by:
    - fquant.fqdata
    - fquant.fqfactor

documentation_progress:
  status: complete
  level: L3
  total_expected: 16
  total_generated: 16
  l0_modules: 6
  l0_generated:
    - dotty.md
    - event_bus.md
    - event_bus_celery.md
    - lifecycle.md
    - notification.md
    - notification_template.md
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
  source_hash: "d86c757844e9be3e0b75d2976a45b399b18be3e294d3526bd7b0f208cea34877"
  source_mtime: 1776815537
  source_files:
    - "__init__.py"
    - "dotty.py"
    - "event_bus.py"
    - "event_bus_celery.py"
    - "lifecycle.py"
    - "notification.py"
    - "notification_template.py"
  last_updated: "2026-04"
---

# Foundation

## 阅读路径

🔵 **开发者**：README → api → usage → concepts → examples

🟠 **架构师**：README → architecture → design → patterns

## 一句话总览

📌 **FQBase 核心抽象层，提供事件总线、通知服务、生命周期管理、Dotty 字典访问等业务通用抽象。**

## 架构图

```mermaid
graph TB
    subgraph Foundation["Foundation"]
        dotty["dotty - 嵌套字典访问"]
        lifecycle["lifecycle - 生命周期管理"]
        notification["notification - 通知服务"]
        notification_template["notification_template - 通知模板"]
        event_bus["event_bus - 事件总线"]
        event_bus_celery["event_bus_celery - Celery集成"]
    end
```

## 子模块

| 子模块 | 说明 |
|--------|------|
| dotty | 支持点号访问的嵌套字典 |
| lifecycle | 服务生命周期和健康检查 |
| notification | 统一通知（企业微信、Server酱、PushBear） |
| notification_template | 通知模板管理 |
| event_bus | 事件总线，发布-订阅模式 |
| event_bus_celery | EventBus 与 Celery 集成 |

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
| 核心类 | 22 |
| 核心函数 | 16 |
| 设计模式 | 4 |
| 异步支持 | 是 |
| 线程安全 | 是 |

## 相关文档

- [FQBase README](../README.md)
- [Infrastructure README](../Infrastructure/README.md)
