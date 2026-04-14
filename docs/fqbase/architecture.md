---
title: FQBase - 技术架构
description: FQBase 的技术架构与组件设计
tag:
  - fqbase
---

# FQBase - 技术架构

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → **[技术架构](./architecture.md)** → [设计原则](./design.md) → [API参考](./api.md) → [开发指南](./development.md) → [最佳实践](./best-practices.md) |
| 🟡 运维/安全 | [README](./README.md) → **[技术架构](./architecture.md)** → [配置指南](./configuration.md) → [安全指南](./security.md) → [故障排查](./troubleshooting.md) → [常见问题](./faq.md) |
| 🟠 架构师 | [README](./README.md) → **[技术架构](./architecture.md)** → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) → [决策指南](./decision-guide.md) → [案例研究](./case-studies.md) → [数据流](./data-flow.md) |

## 子模块技术架构

| 子模块 | 技术架构 | 说明 |
|--------|----------|------|
| Core | [技术架构](./core/architecture.md) | 事件总线、日志、通知 |
| Foundation | [技术架构](./foundation/architecture.md) | 验证、异常、重试、单例 |
| Util | [技术架构](./util/architecture.md) | 工具函数 |
| Config | [技术架构](./config/architecture.md) | 配置管理 |
| Cache | [技术架构](./cache/architecture.md) | 缓存抽象 |
| Date | [技术架构](./date/concepts.md) | 日期时间 |
| DataStore | [技术架构](./datastore/architecture.md) | 数据存储 |
| Crawler | [技术架构](./crawler/architecture.md) | 网页爬虫 |


## 概述

FQBase 的架构概览，展示了各子模块的职责和交互关系。

## 架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        FQBase 基础框架                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    Core 核心层                        │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────┐  │   │
│  │  │   EventBus   │  │    Logger    │  │Notifica- │  │   │
│  │  │   事件总线    │  │    日志系统   │  │  tion    │  │   │
│  │  └──────────────┘  └──────────────┘  │  通知    │  │   │
│  │                                      └───────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                 Foundation 基础组件层                   │   │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────────┐  │   │
│  │  │Validators│ │Excep-  │ │ Retry │ │CircuitBreak-│  │   │
│  │  │ 验证器  │ │ tions  │ │ 重试   │ │    er       │  │   │
│  │  └────────┘ │  异常   │ └────────┘ │   熔断器    │  │   │
│  │             └────────┘            └──────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   Util   │  │  Config  │  │  Cache   │  │   Date   │  │
│  │ 工具函数  │  │  配置管理 │  │  缓存    │  │  日期时间  │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                             │
│  ┌──────────┐  ┌──────────┐                                │
│  │DataStore │  │ Crawler  │                                │
│  │  数据存储 │  │  网页爬虫 │                                │
│  └──────────┘  └──────────┘                                │
└─────────────────────────────────────────────────────────────┘
```

## 组件

### Core 组件

| 组件 | 职责 | 关键类 |
|------|------|--------|
| EventBus | 事件总线，发布-订阅 | Event, EventBus, get_event_bus |
| Logger | 统一日志系统 | get_logger, FQLogger, init_logging |
| Notification | 多渠道通知 | NotificationManager, sendWechat |

### Foundation 组件

| 组件 | 职责 | 关键类 |
|------|------|--------|
| Validators | 数据验证 | validate_code, validate_date, Validator |
| Exceptions | 统一异常 | FQException, ValidationError |
| Retry | 重试机制 | retry, RetryContext |
| CircuitBreaker | 熔断器 | CircuitBreaker |
| Singleton | 单例装饰器 | singleton |
| Container | 依赖注入容器 | Container |

## 数据流

1. **事件驱动流程**：
   - 业务代码 → EventBus.publish() → 订阅者处理

2. **日志流程**：
   - Logger.info() → 格式化 → 输出（控制台/文件）

3. **通知流程**：
   - NotificationManager.send() → 渠道适配器 → 第三方服务

4. **缓存流程**：
   - Cache.get() → 命中返回 → 未命中查询 → 存入缓存

## 依赖

| 依赖 | 版本 | 用途 |
|------|------|------|
| python | >=3.8 | 运行环境 |
| redis | >=4.0 | 缓存后端 |
| pymongo | >=4.0 | MongoDB 客户端 |
| requests | >=2.28 | HTTP 请求 |
| selenium | >=4.0 | 浏览器自动化 |

## 相关文档

- [框架集成](./framework.md)
- [设计原则](./design.md)
- [API参考](./api.md)
