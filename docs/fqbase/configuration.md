---
title: FQBase - 配置指南
description: FQBase 配置选项详解
tag:
  - fqbase
---

# FQBase - 配置指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → **[配置指南](./configuration.md)** → [安全指南](./security.md) → [故障排查](./troubleshooting.md) → [常见问题](./faq.md) |

## 子模块配置指南

| 子模块 | 配置指南 | 说明 |
|--------|----------|------|
| Core | [配置指南](./core/configuration.md) | 事件总线、日志、通知 |
| Config | [配置指南](./config/configuration.md) | 配置管理 |
| Cache | [配置指南](./cache/configuration.md) | 缓存抽象 |


## 概述

FQBase 所有配置选项的详细说明。

## 配置文件

### 文件位置

```yaml
# 默认位置
config/fqbase.yaml

# 自定义位置
config/custom/fqbase.yaml
```

### 基本配置

```yaml
fqbase:
  enabled: true
  version: "1.0.0"
```

## 配置选项

### 核心选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| enabled | bool | true | 启用/禁用模块 |
| version | str | "1.0.0" | 版本号 |

### EventBus 选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| event_bus.enabled | bool | true | 启用事件总线 |
| event_bus.max_history | int | 100 | 历史事件最大数量 |
| event_bus.async | bool | false | 异步事件分发 |

### Logger 选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| logger.level | str | INFO | 日志级别 |
| logger.format | str | "%(asctime)s..." | 日志格式 |
| logger.handlers | list | ["console"] | 输出处理器 |

### Notification 选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| notification.enabled | bool | true | 启用通知 |
| notification.channels | list | ["SYSTEM"] | 启用的渠道 |

## 环境变量

| 变量 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| FQBASE_ENABLED | bool | true | 通过环境变量启用模块 |
| FQBASE_LOG_LEVEL | str | INFO | 日志级别 |
| FQBASE_REDIS_HOST | str | localhost | Redis 主机 |

## 配置示例

### 最小配置

```yaml
fqbase:
  enabled: true
```

### 完整配置

```yaml
fqbase:
  enabled: true
  version: "1.0.0"
  
event_bus:
  enabled: true
  max_history: 100
  async: false

logger:
  level: DEBUG
  format: "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
  handlers:
    - console
    - file

notification:
  enabled: true
  channels:
    - WECOM
    - SERVERCHAN
```

## 配置优先级

配置值按以下顺序解析（从高到低）：

1. 环境变量
2. 命令行参数
3. 配置文件
4. 默认值

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
