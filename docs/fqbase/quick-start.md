---
title: FQBase - 快速入门
description: 5分钟快速上手 FQBase
tag:
  - fquant
  - fqbase

summary:
  purpose: quick-start
  complexity: medium
---

# FQBase - 快速入门

## 阅读路径

🟢 **新手入门**：README → quick-start → examples → concepts → glossary → usage

## 概述

本快速入门指南将帮助您在 5 分钟内理解 FQBase 并开始使用。

## 前置要求

- Python 3.8+
- MongoDB（用于 Config 和 DataStore）
- Redis（用于 Cache，可选）

## 5分钟上手

### Step 1: 导入基础设施模块

```python
from FQBase.Infrastructure import singleton, get_logger
from FQBase.Infrastructure.retry import retry
from FQBase.Infrastructure.exceptions import FQException
```

### Step 2: 使用日志系统

```python
logger = get_logger(__name__)
logger.info("This is an info message")
logger.error("This is an error message")
```

### Step 3: 使用单例模式

```python
@singleton
class MyService:
    def __init__(self):
        self.name = "my_service"

# 获取单例实例
service1 = MyService()
service2 = MyService()
assert service1 is service2  # True
```

### Step 4: 使用重试装饰器

```python
@retry(stop_max_attempt_number=3, wait_random_min=100, wait_random_max=500)
def fetch_data():
    # 可能会失败的操作
    return "data"
```

### Step 5: 配置 MongoDB

```python
from FQBase.Config import SETTING, get_database

db = get_database()
if db is not None:
    result = db.users.find_one({"name": "test"})
```

## ⚠️ 常见陷阱

1. **导入路径错误**
   - ❌ 错误做法：`from FQBase import get_logger`
   - ✅ 正确做法：`from FQBase.Infrastructure import get_logger`

2. **单例装饰器位置错误**
   - ❌ 错误做法：类内部方法使用 `@singleton`
   - ✅ 正确做法：类定义上方使用 `@singleton`

3. **重试装饰器参数错误**
   - ❌ 错误做法：`@retry()` 无参数可能导致无限重试
   - ✅ 正确做法：`@retry(stop_max_attempt_number=3)` 设置上限

## 下一步

- 学习 [核心概念](./concepts.md)
- 阅读 [API参考](./api.md)
- 查看 [使用指南](./usage.md)

## 相关文档

- [README](./README.md)
- [API参考](./api.md)
- [核心概念](./concepts.md)
