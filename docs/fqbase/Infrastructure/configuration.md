---
title: Infrastructure - 配置指南
description: Infrastructure 配置参数和环境变量
tag:
  - fquant
  - fqbase
  - infrastructure

summary:
  purpose: configuration
---

# Infrastructure - 配置指南

## 阅读路径

🟡 **运维**：README → configuration → troubleshooting

## 环境变量

### FQ_LOGGING_CONFIG

日志配置文件路径

```bash
export FQ_LOGGING_CONFIG=/path/to/logging.yaml
```

### FQ_LOG_DIR

日志文件存储目录

```bash
export FQ_LOG_DIR=/var/log/fquant
```

默认值：`./logs`

### FQ_CIRCUIT_BREAKER_DISABLED

禁用熔断器

```bash
export FQ_CIRCUIT_BREAKER_DISABLED=true
```

默认值：false

## 日志配置

### logging.yaml 示例

```yaml
version: 1
disable_existing_loggers: false

formatters:
  standard:
    format: '%(asctime)s - %(name)s - %(levelname)s - %(message)s'

handlers:
  console:
    class: logging.StreamHandler
    level: INFO
    formatter: standard
    stream: ext://sys.stdout

  file:
    class: logging.handlers.RotatingFileHandler
    level: DEBUG
    formatter: standard
    filename: logs/fquant.log
    maxBytes: 10485760
    backupCount: 5

root:
  level: DEBUG
  handlers: [console, file]
```

## 相关文档

- [使用指南](./usage.md)
- [故障排查](./troubleshooting.md)
