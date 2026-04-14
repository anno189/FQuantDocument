---
title: 统一异常处理系统 - 快速入门
description: 5分钟快速上手 FQBase 异常处理系统
tag:
  - fqbase
  - exceptions

summary:
  purpose: quick-start
  complexity: low
---

# 统一异常处理系统 - 快速入门

## 概述

FQuant 统一异常处理系统提供标准化的异常类和错误处理机制。

## 5分钟上手

### Step 1: 导入异常

```python
from FQBase.Foundation.exceptions import FQException, DataSourceException
```

### Step 2: 抛出异常

```python
raise DataSourceException("数据获取失败", code="DS001")
```

### Step 3: 捕获异常

```python
try:
    # 业务代码
    pass
except FQException as e:
    print(f"错误码: {e.code}")
    print(f"消息: {e.message}")
```

## 常见用法

```python
from FQBase.Foundation.exceptions import FQException

# 创建异常
exc = FQException(
    message="发生错误",
    code="ERR001",
    details={"field": "user_id"}
)

# 转为字典
print(exc.to_dict())
```

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
