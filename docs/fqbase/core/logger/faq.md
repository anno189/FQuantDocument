---
title: 统一日志系统 - 常见问题
description: 统一日志系统常见问题与解答
tag:
  - fqbase
  - logger
---

# 统一日志系统 - 常见问题

## 一般问题

### Q: 日志文件在哪里？

**A:** 默认在 `~/.fqdata/logs/fquant.log`，可通过 `FQ_LOG_DIR` 环境变量修改。

### Q: 如何使用自定义配置？

**A:** 通过 `FQ_LOGGING_CONFIG` 环境变量或 `init_logging()` 函数指定配置文件路径。

## 相关文档

- [API参考](./api.md)
- [配置指南](./configuration.md)
