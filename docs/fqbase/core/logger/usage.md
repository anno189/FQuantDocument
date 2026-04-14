---
title: 统一日志系统 - 使用指南
description: 统一日志系统详细使用指南
tag:
  - fqbase
  - logger
---

# 统一日志系统 - 使用指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → **[使用指南](./usage.md)** |
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → **[使用指南](./usage.md)** |

## 概述

本指南详细介绍如何使用统一日志系统。

## 基本用法

### 获取日志记录器

```python
from FQBase.Core.logger import get_logger

# 按模块获取
logger = get_logger('my_module')

# 使用默认名称
logger = get_logger()
```

### 记录日志

```python
logger.debug('调试信息')
logger.info('普通信息')
logger.warning('警告信息')
logger.error('错误信息')
logger.exception('异常信息')  # 自动包含堆栈
```

### 记录进度

```python
# 批量处理时记录进度
for i, item in enumerate(items, 1):
    logger.progress(i, len(items), job_name=f'处理 {item}')
```

## 配置

### 环境变量

```bash
# 设置日志目录
export FQ_LOG_DIR=/var/log/fquant

# 设置配置文件
export FQ_LOGGING_CONFIG=/etc/fquant/logging.yaml
```

## 相关文档

- [API参考](./api.md)
- [配置指南](./configuration.md)
