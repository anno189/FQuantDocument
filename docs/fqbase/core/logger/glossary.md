---
title: 统一日志系统 - 术语表
description: 统一日志系统术语定义
tag:
  - fqbase
  - logger
---

# 统一日志系统 - 术语表

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → **[术语表](./glossary.md)** → [核心概念](./concepts.md) |

## 术语

### 日志级别

**定义：** 日志信息的重要程度分级

**级别（从低到高）：**
- DEBUG：调试信息
- INFO：普通信息
- WARNING：警告信息
- ERROR：错误信息
- CRITICAL：严重错误

### 日志轮转

**定义：** 当日志文件达到一定大小时，自动创建新文件并归档旧文件

### 多实例单例

**定义：** 每个 name 对应一个独立的日志记录器实例

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
