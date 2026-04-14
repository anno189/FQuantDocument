---
title: 统一日志系统 - 核心概念
description: 深入理解统一日志系统的核心概念
tag:
  - fqbase
  - logger
---

# 统一日志系统 - 核心概念

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [术语表](./glossary.md) → **[核心概念](./concepts.md)** |
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → **[核心概念](./concepts.md)** |

## 概念 1: 多实例单例模式

### 概念解释

每个 name 对应一个独立的 FQLogger 实例，实现模块级别日志隔离。

### 原理

```python
# 同一个 name 返回同一个实例
logger1 = get_logger('module_a')
logger2 = get_logger('module_a')
assert logger1 is logger2

# 不同的 name 返回不同的实例
logger3 = get_logger('module_b')
assert logger1 is not logger3
```

## 概念 2: 日志轮转

### 概念解释

使用 RotatingFileHandler，当日志文件达到 10MB 时自动创建新文件，保留 5 个备份。

### 原理

```
fquant.log       # 当前日志文件
fquant.log.1     # 最近的归档
fquant.log.2     # 第二个归档
fquant.log.3     # 第三个归档
fquant.log.4     # 第四个归档
fquant.log.5     # 第五个归档（最旧）
```

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [配置指南](./configuration.md)
