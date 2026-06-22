---
title: Infrastructure - 快速入门
description: 5分钟快速上手 Infrastructure 模块
tag:
  - fquant
  - fqbase
  - infrastructure

summary:
  purpose: quick-start
  complexity: low
---

# Infrastructure - 快速入门

## 阅读路径

🟢 **新手入门**：README → quick-start → examples → concepts

## 概述

本快速入门指南将帮助您在 5 分钟内理解 Infrastructure 模块并开始使用。

## 前置要求

- Python 3.8+

## 5分钟上手

### Step 1: 获取日志记录器

```python
from FQBase.Infrastructure import get_logger

logger = get_logger('my_module')
logger.info('Hello, Infrastructure!')
```

### Step 2: 使用单例模式

```python
from FQBase.Infrastructure import singleton

@singleton
class MyService:
    pass

s1 = MyService()
s2 = MyService()
print(s1 is s2)
```

### Step 3: 使用重试装饰器

```python
from FQBase.Infrastructure import retry

@retry(stop_max_attempt_number=3)
def unreliable_call():
    print("Trying...")
    raise ConnectionError("Failed")
```

### Step 4: 使用熔断器

```python
from FQBase.Infrastructure import circuit_breaker

@circuit_breaker(failure_threshold=3, recovery_timeout=60)
def call_service():
    return "success"
```

## ⚠️ 常见陷阱

1. **Infrastructure 是最底层**
   - ❌ 错误做法：从 Infrastructure 依赖 Foundation 或其他高层模块
   - ✅ 正确做法：其他模块依赖 Infrastructure

2. **单例在多进程环境下需要额外处理**

## 下一步

- 学习 [核心概念](./concepts.md)
- 阅读 [API参考](./api.md)
- 查看 [使用指南](./usage.md)

## 相关文档

- [README](./README.md)
- [API参考](./api.md)
- [核心概念](./concepts.md)
