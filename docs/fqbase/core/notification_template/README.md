---
title: 通知模板
description: FQBase 通知消息模板模块，提供预设模板和自定义渲染功能
tag:
  - fqbase
  - core
  - notification_template

summary:
  type: utility
  complexity: low
  maturity: stable
  size: xs
  core_classes:
    - NotificationTemplate
    - NotificationTemplateRegistry
  key_functions:
    - NotificationTemplate.render
    - NotificationTemplate.render_dict

relationships:
  belongs_to:
    - fquant.fqbase.core
  depends_on: []
  used_by:
    - fquant.fqbase.core.notification
---

# 通知模板

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [速查表](./cheatsheet.md) → [动手实验室](./workshop.md) → [使用指南](./usage.md) → [案例库](./examples.md) |
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → [设计原则](./design.md) → [API参考](./api.md) → [开发指南](./development.md) → [最佳实践](./best-practices.md) |
| 📖 索引 | [README](./README.md) → [变更日志](./changelog.md) |


## 一句话总览

📌 **统一通知消息模板，支持自定义渲染**

**TL;DR**：
- 解决什么问题：标准化通知消息格式，支持变量替换
- 核心能力：模板渲染、模板注册、预设模板
- 入门难度：🟢 简单

**快速判断**：当您需要发送格式化的通知消息时，使用本模块。

## 知识脉络

🧑‍🎓 **从零到精通的推荐学习顺序**：

1. [快速入门](./quick-start.md) - 5 分钟上手
2. [核心概念](./concepts.md) - 理解基本概念
3. [使用指南](./usage.md) - 深入使用

⏱️ 预计学习时间：0.2 小时

## 前置知识

在开始学习本模块前，建议先掌握：

| 知识领域 | 建议资源 | 状态 |
|---------|---------|------|
| Python 基础 | [官方教程](https://docs.python.org/zh-cn/3/tutorial/) | ⬜ |
| Python dataclass | [官方文档](https://docs.python.org/3/library/dataclass.html) | ⬜ |

## 适用场景

✅ **推荐使用**：
- 交易信号通知
- 风险预警通知
- 系统异常告警
- 订单/持仓更新通知
- 回测结果通知

❌ **不推荐使用**：
- 简单的纯文本消息（直接发送字符串即可）
- 需要复杂格式的富文本邮件

💡 **与其他模块的关系**：
- 常与 [通知服务模块](./notification/README.md) 配合使用

## 概述

通知模板模块提供统一的模板系统，用于生成格式化的通知消息。支持 8 种预设模板类型，并允许注册自定义模板。

## 快速链接

| 文档 | 说明 |
|------|------|
| [快速入门](./quick-start.md) | 5分钟快速上手 |
| [术语表](./glossary.md) | 术语定义 |
| [核心概念](./concepts.md) | 核心概念详解 |
| [API参考](./api.md) | API参考文档 |
| [案例库](./examples.md) | 案例库 |

## 快速定位

我不知道这个，应该去哪找？

| 场景 | 文档 |
|------|------|
| 我不了解这个术语 | [术语表](./glossary.md) |
| 如何渲染模板？ | [快速入门](./quick-start.md) |
| 如何自定义模板？ | [使用指南](./usage.md) |
| 需要参考实际案例 | [案例库](./examples.md) |

## 安装

本模块是 FQBase 的一部分，通过安装 FQBase 即可使用：

```bash
pip install fquant-fqbase
```

## 相关文档

| 类型 | 文档 | 链接 |
|------|------|------|
| 项目首页 | FQBase 首页 | [README](../README.md) |
| 相关模块 | 通知服务 | [notification](./notification/README.md) |
