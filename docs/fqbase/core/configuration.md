---
title: Core - 配置指南
description: Core 基础设施核心层配置选项详解
tag:
  - fqbase
  - core
---

# Core - 配置指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → **[配置指南](./configuration.md)** → [安全指南](./security.md) → [故障排查](./troubleshooting.md) → [常见问题](./faq.md) |


## 概述

本文档介绍 Core 模块的配置选项。各子模块的详细配置请参考各自文档。

## 配置文件

### 文件位置

```yaml
# 默认位置
config/core.yaml

# 自定义位置
config/custom/core.yaml
```

### 基本配置

```yaml
core:
  event_bus:
    enabled: true
    max_history: 1000

  logger:
    level: INFO
    log_dir: logs

  notification:
    default_channel: SYSTEM
```

## 环境变量

| 变量 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| CORE_LOG_LEVEL | str | INFO | 日志级别 |
| CORE_LOG_DIR | str | logs | 日志目录 |
| CORE_NOTIFICATION_ENABLED | bool | true | 启用通知 |

## 子模块配置索引

| 子模块 | 配置说明 |
|--------|----------|
| event_bus | [configuration](./event_bus/configuration.md) |
| logger | [configuration](./logger/configuration.md) |
| notification | [configuration](./notification/configuration.md) |

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
