---
title: 统一日志系统 - 快速入门
description: 快速上手统一日志系统
tag:
  - fqbase
  - logger

summary:
  purpose: quick-start
  complexity: low
---

# 统一日志系统 - 快速入门

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → **[快速入门](./quick-start.md)** → [速查表](./cheatsheet.md) → [使用指南](./usage.md) → [案例库](./examples.md) |

## 概述

本指南帮助您快速上手统一日志系统。

## 5分钟上手

### Step 1: 获取日志记录器

```python
from FQBase.Core.logger import get_logger

logger = get_logger('my_module')
```

### Step 2: 记录日志

```python
logger.debug('调试信息')
logger.info('普通信息')
logger.warning('警告信息')
logger.error('错误信息')
logger.exception('异常信息')  # 自动包含堆栈
```

### Step 3: 完成！

```python
logger = get_logger('my_module')
logger.info('程序启动')
logger.info('程序运行正常')
# 日志自动输出到控制台和文件
```

## ⚠️ 常见陷阱

1. **陷阱：日志级别设置过高**
   - ❌ 错误做法：只设置了 ERROR 级别，导致 debug/info 信息不输出
   - ✅ 正确做法：根据需要设置合适的日志级别

2. **陷阱：未初始化就使用**
   - ❌ 错误做法：get_logger() 之前调用其他日志函数
   - ✅ 正确做法：get_logger() 会自动初始化

## 下一步

- 学习 [核心概念](./concepts.md)
- 查看 [API参考](./api.md)
- 阅读 [配置指南](./configuration.md)

## 相关文档

- [README](./README.md)
- [API参考](./api.md)
- [配置指南](./configuration.md)
