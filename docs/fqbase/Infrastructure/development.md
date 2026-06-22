---
title: Infrastructure - 开发指南
description: 如何参与 Infrastructure 开发与扩展
tag:
  - fquant
  - fqbase
  - infrastructure

summary:
  purpose: development
---

# Infrastructure - 开发指南

## 阅读路径

🔵 **开发者**：README → development → patterns

## 开发环境

### 前置要求

- Python 3.8+

## 添加新组件

### Step 1: 创建模块

在 `Infrastructure/` 目录创建新模块文件。

```python
# Infrastructure/my_feature.py

from FQBase.Infrastructure.logger import get_logger

logger = get_logger(__name__)
```

### Step 2: 导出 API

在 `__init__.py` 中添加导出。

```python
from .my_feature import MyClass, my_function

__all__ = [
    ...
    'MyClass',
    'my_function',
]
```

### Step 3: 编写测试

```bash
cd /Users/A.D.189/FQuant/FQuant.Server/FQBase
python -m pytest tests/Infrastructure/
```

## 扩展现有组件

### 扩展重试策略

```python
from FQBase.Infrastructure import retry

def custom_wait_strategy(attempt):
    return attempt * 1000  # 递增延迟

@retry(wait_func=custom_wait_strategy)
def unreliable_call():
    pass
```

### 扩展熔断器

```python
from FQBase.Infrastructure import CircuitBreaker, CircuitState

class CustomCircuitBreaker(CircuitBreaker):
    def on_success(self):
        super().on_success()
        self.record_metric('success')
```

## 代码风格

- 遵循 PEP8
- 使用类型注解
- 所有公共 API 必须有 docstring
- 使用 get_logger 记录日志
- 组件必须线程安全

## 相关文档

- [设计模式](./patterns.md)
- [API参考](./api.md)
