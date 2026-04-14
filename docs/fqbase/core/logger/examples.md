---
title: 统一日志系统 - 案例库
description: 统一日志系统实际应用场景与示例
tag:
  - fqbase
  - logger
---

# 统一日志系统 - 案例库

## 示例 1：模块日志

### 场景描述

为不同模块创建独立的日志记录器

### 代码实现

```python
from FQBase.Core.logger import get_logger

# 数据模块日志
data_logger = get_logger('data')
data_logger.info('开始获取数据')

# 策略模块日志
strategy_logger = get_logger('strategy')
strategy_logger.info('策略执行完成')
```

---

## 示例 2：异常记录

### 场景描述

记录程序异常信息

### 代码实现

```python
from FQBase.Core.logger import get_logger

logger = get_logger('app')

try:
    result = risky_operation()
except Exception:
    logger.exception('操作失败')
    raise
```

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
