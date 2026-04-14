---
title: 事件总线（Event Bus）
description: FQBase 核心事件发布订阅模块，提供同步/异步事件发布、全局订阅、优先级处理和弱引用内存管理
tag:
  - fqbase
  - core
  - event_bus

summary:
  type: infrastructure
  complexity: medium
  maturity: stable
  size: m
  core_classes:
    - EventBus
    - Event
    - EventHistory
    - Subscription
    - EventBusContext
  key_functions:
    - get_event_bus
    - publish
    - publish_async
    - publishAwait
    - subscribe
    - subscribe_global

relationships:
  belongs_to:
    - fqbase.core
  depends_on:
    - fqbase.Foundation.singleton
  used_by:
    - fqbase.notification
    - fqbase.event_bus_celery

concepts:
  provides:
    - name: 发布-订阅模式
      definition: 事件驱动架构的核心模式，实现发布者和订阅者的松耦合
    - name: 事件总线
      definition: 集中管理事件订阅和发布的中间件
    - name: 弱引用订阅
      definition: 使用弱引用持有订阅者，防止内存泄漏
    - name: 事件历史
      definition: 存储已发布事件记录的环形缓冲区
---

# 事件总线（Event Bus）

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [速查表](./cheatsheet.md) → [动手实验室](./workshop.md) → [使用指南](./usage.md) → [案例库](./examples.md) |
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → [设计原则](./design.md) → [API参考](./api.md) → [开发指南](./development.md) → [最佳实践](./best-practices.md) |
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → [安全指南](./security.md) → [故障排查](./troubleshooting.md) → [常见问题](./faq.md) |
| 🟠 架构师 | [README](./README.md) → [技术架构](./architecture.md) → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) → [决策指南](./decision-guide.md) → [案例研究](./case-studies.md) → [数据流](./data-flow.md) |
| 📚 案例库 | **[案例库](./examples.md)** → [案例研究](./case-studies.md) → [决策指南](./decision-guide.md) → [数据流](./data-flow.md) → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) |
| 📖 索引 | [README](./README.md) → [变更日志](./changelog.md) |


## 一句话总览

📌 **FQBase 核心事件发布订阅组件，支持同步/异步发布和弱引用内存管理**

**TL;DR**：
- 解决什么问题：实现模块间松耦合的事件通信，支持同步/异步发布、优先级处理
- 核心能力：发布订阅、事件历史、弱引用、线程安全
- 入门难度：🟢 简单 / 🔵 中等 / 🔴 复杂

**快速判断**：当您需要解耦模块通信、实现事件驱动架构、记录事件轨迹时，使用本模块。

## 知识脉络

🧑‍🎓 **从零到精通的推荐学习顺序**：

1. [快速入门](./quick-start.md) - 5 分钟上手
2. [核心概念](./concepts.md) - 理解基本概念
3. [技术架构](./architecture.md) - 理解设计思路
4. [使用指南](./usage.md) - 深入使用
5. [动手实验室](./workshop.md) - 实践练习
6. [最佳实践](./best-practices.md) - 升华理解

⏱️ 预计学习时间：1-2 小时

## 前置知识

在开始学习本模块前，建议先掌握：

| 知识领域 | 建议资源 | 状态 |
|---------|---------|------|
| Python 基础 | [官方教程](https://docs.python.org/zh-cn/3/tutorial/) | ⬜ |
| 观察者模式 | [设计模式](./patterns.md) | ⬜ |
| 异步编程基础 | [async/await](https://docs.python.org/zh-cn/3/library/asyncio.html) | ⬜ |

## 适用场景

✅ **推荐使用**：
- 模块间需要松耦合通信
- 需要实现事件驱动架构
- 需要记录和回溯事件历史
- 需要异步处理事件
- 需要全局监听所有事件

❌ **不推荐使用**：
- 简单的函数调用（直接调用更高效）
- 同步紧密耦合的模块（增加复杂度）
- 需要严格事务一致性的场景

💡 **与其他模块的关系**：
- 依赖 [singleton](../foundation/README.md)（单例模式实现）
- 与 [notification](./notification/README.md) 配合实现事件通知
- [event_bus_celery](./event_bus_celery/README.md) 提供 Celery 集成

## 概述

事件总线（Event Bus）是 FQBase 框架的核心基础设施组件，实现了经典的**发布-订阅（Publish-Subscribe）**模式。该模块提供：

- **EventBus**：单例模式的事件总线，负责事件订阅管理和发布
- **Event**：标准事件对象，包含类型、数据、时间戳等信息
- **EventHistory**：事件历史记录管理器，使用环形缓冲区限制内存
- **Subscription**：订阅者包装类，支持优先级排序

核心特性包括同步/异步事件发布、全局订阅、优先级处理、弱引用防内存泄漏、线程安全实现和事件历史记录。

## 子模块

| 子模块 | 说明 | 文档 |
|--------|------|------|
| event_bus | 核心事件总线实现 | [README](./event_bus/README.md) |
| event_bus_celery | Celery Worker 生命周期集成 | [README](./event_bus_celery/README.md) |

## 快速链接

| 文档 | 说明 |
|------|------|
| [快速入门](./quick-start.md) | 5分钟快速上手 |
| [术语表](./glossary.md) | 术语定义 |
| [核心概念](./concepts.md) | 核心概念详解 |
| [框架集成](./framework.md) | 框架集成方式 |
| [技术架构](./architecture.md) | 技术架构说明 |
| [API参考](./api.md) | API参考文档 |
| [案例库](./examples.md) | 案例库 |
| [速查表](./cheatsheet.md) | 快速参考 |
| [动手实验室](./workshop.md) | 动手练习 |

## 快速定位

我不知道这个，应该去哪找？

| 场景 | 文档 |
|------|------|
| 我不了解这个术语 | [术语表](./glossary.md) |
| 遇到错误/问题 | [故障排查](./troubleshooting.md) |
| 如何配置选项？ | [配置指南](./configuration.md) |
| 如何优化性能？ | [性能调优](./performance.md) |
| 如何与其他模块集成？ | [集成指南](./integrations.md) |
| 需要参考实际案例 | [案例库](./examples.md) |

## 安装

事件总线是 FQBase 框架的内置模块，安装 FQBase 后即可使用：

```bash
pip install FQBase
```

## 快速示例

```python
from FQBase.Core.event_bus import EventBus, Event, get_event_bus

# 获取事件总线单例
bus = get_event_bus()

# 定义事件处理函数
def on_price_update(event):
    print(f"价格更新: {event.data}")

# 订阅事件
bus.subscribe('price_update', on_price_update, priority=10)

# 发布事件
bus.publish(Event('price_update', {'symbol': 'AAPL', 'price': 150.0}))
# 输出: 价格更新: {'symbol': 'AAPL', 'price': 150.0}
```

## 相关文档

| 类型 | 文档 | 链接 |
|------|------|------|
| 项目首页 | FQBase 首页 | [README](../README.md) |
| 快速入门 | 快速入门 | [快速入门](./quick-start.md) |
| 架构 | 系统架构 | [技术架构](./architecture.md) |
