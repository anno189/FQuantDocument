---
title: 通知服务
description: FQBase 统一通知服务模块，支持企业微信、Server酱、PushBear多渠道通知
tag:
  - fqbase
  - core
  - notification

summary:
  type: infrastructure
  complexity: medium
  maturity: stable
  size: s
  core_classes:
    - NotificationManager
    - WecomHandler
    - ServerChanHandler
    - PushBearHandler
  key_functions:
    - sendWechat
    - sendMessage2ServerChan
    - sendMessagetoAll

relationships:
  belongs_to:
    - fquant.fqbase.core
  depends_on:
    - fquant.fqbase.foundation.singleton
    - fquant.fqbase.config
    - fquant.fqbase.core.logger
  used_by:
    - fquant.fqbase.datasource
    - fquant.fqbase.pipeline

concepts:
  provides:
    - name: 通知渠道
      definition: 支持的第三方通知平台，包括企业微信、Server酱、PushBear
    - name: 单例模式
      definition: NotificationManager 使用单例模式确保全局唯一实例
    - name: 异步发送
      definition: 支持非阻塞的异步通知发送
---

# 通知服务

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

📌 **统一多渠道通知服务，支持企业微信、Server酱、PushBear**

**TL;DR**：
- 解决什么问题：统一管理多种第三方通知渠道，简化应用通知发送
- 核心能力：多渠道支持、同步/异步发送、单例管理
- 入门难度：🟢 简单

**快速判断**：当您需要发送通知到企业微信、Server酱或PushBear时，使用本模块。

## 知识脉络

🧑‍🎓 **从零到精通的推荐学习顺序**：

1. [快速入门](./quick-start.md) - 5 分钟上手
2. [核心概念](./concepts.md) - 理解基本概念
3. [技术架构](./architecture.md) - 理解设计思路
4. [使用指南](./usage.md) - 深入使用
5. [动手实验室](./workshop.md) - 实践练习
6. [最佳实践](./best-practices.md) - 升华理解

⏱️ 预计学习时间：0.5 小时

## 前置知识

在开始学习本模块前，建议先掌握：

| 知识领域 | 建议资源 | 状态 |
|---------|---------|------|
| Python 基础 | [官方教程](https://docs.python.org/zh-cn/3/tutorial/) | ⬜ |
| 环境变量配置 | [Config 模块](../config/README.md) | ⬜ |

## 适用场景

✅ **推荐使用**：
- 交易系统订单执行通知
- 监控系统告警通知
- 定时任务执行结果通知
- 系统异常告警通知

❌ **不推荐使用**：
- 需要实时消息推送的聊天应用
- 大规模消息群发（建议使用专业推送服务）

💡 **与其他模块的关系**：
- 依赖 [单例模式](../foundation/singleton.md)（用于 NotificationManager）
- 常与 [日志模块](./logger.md) 配合使用

## 概述

通知服务模块提供统一的接口来发送通知到多个渠道。该模块支持企业微信（通过 corpwechatbot 库）、Server酱（通过 sctapi.ftqq.com）和 PushBear（通过 pushbear.ftqq.com）三种通知渠道。

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
| [最佳实践](./best-practices.md) | 最佳实践 |

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

```bash
pip install fquant-fqbase
```

额外依赖（用于企业微信）：
```bash
pip install corpwechatbot
```

## 相关文档

| 类型 | 文档 | 链接 |
|------|------|------|
| 项目首页 | FQBase 首页 | [README](../README.md) |
| 快速入门 | 快速入门 | [快速入门](../quick-start.md) |
| 架构 | 系统架构 | [技术架构](../architecture.md) |
| 相关模块 | 日志模块 | [logger](./logger/README.md) |
| 相关模块 | 单例模式 | [singleton](../foundation/singleton/README.md) |
