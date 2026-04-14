---
title: Foundation 模块 - 快速入门
description: 5分钟快速上手 Foundation 基础模块
tag:
  - fqbase
  - foundation

summary:
  purpose: quick-start
  complexity: low
---

# Foundation 模块 - 快速入门

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → **[快速入门](./quick-start.md)** |

## 子模块快速入门

| 子模块 | 快速入门 | 说明 |
|--------|----------|------|
| validators | [快速入门](./validators/quick-start.md) | 输入验证 |
| exceptions | [快速入门](./exceptions/quick-start.md) | 统一异常 |
| retry | [快速入门](./retry/quick-start.md) | 重试装饰器 |
| dotty | [快速入门](./dotty/quick-start.md) | 字典访问 |
| singleton | [快速入门](./singleton/quick-start.md) | 单例模式 |
| lifecycle | [快速入门](./lifecycle/quick-start.md) | 生命周期 |
| container | [快速入门](./container/quick-start.md) | 依赖注入 |
| circuit_breaker | [快速入门](./circuit_breaker/quick-start.md) | 熔断器 |

## 概述

Foundation 是 FQBase 的基础抽象层，提供设计模式、工具类和接口定义。

## 5分钟上手

### Step 1: 导入模块

```python
from FQBase.Foundation import validators, exceptions
```

### Step 2: 使用验证器

```python
from FQBase.Foundation import validate_code

result = validate_code("600000")
print(result)  # True
```

### Step 3: 处理异常

```python
from FQBase.Foundation.exceptions import FQException

try:
    # 业务代码
    pass
except FQException as e:
    print(e.code)
```

### Step 4: 使用单例

```python
from FQBase.Foundation.singleton import Singleton

class MyClass(metaclass=Singleton):
    pass
```

### Step 5: 使用重试

```python
from FQBase.Foundation.retry import retry

@retry(max_attempts=3)
def fetch_data():
    pass
```

## 下一步

- 学习 [核心概念](./concepts.md)
- 阅读 [术语表](./glossary.md)
- 查看 [使用指南](./usage.md)
