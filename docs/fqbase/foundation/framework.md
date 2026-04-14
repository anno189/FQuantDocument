---
title: Foundation 模块 - 框架集成
description: Foundation 模块框架集成指南
tag:
  - fqbase
  - foundation
---

# Foundation 模块 - 框架集成

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [技术架构](./architecture.md) → **[框架集成](./framework.md)** |

## 子模块框架集成

| 子模块 | 框架集成 | 说明 |
|--------|----------|------|
| validators | [框架集成](./validators/framework.md) | 输入验证 |
| exceptions | [框架集成](./exceptions/framework.md) | 统一异常 |
| retry | [框架集成](./retry/framework.md) | 重试装饰器 |
| dotty | [框架集成](./dotty/framework.md) | 字典访问 |
| singleton | [框架集成](./singleton/framework.md) | 单例模式 |
| lifecycle | [框架集成](./lifecycle/framework.md) | 生命周期 |
| container | [框架集成](./container/framework.md) | 依赖注入 |
| circuit_breaker | [框架集成](./circuit_breaker/framework.md) | 熔断器 |

## Flask 集成

```python
from flask import Flask
from FQBase.Foundation import ServiceContainer, ServiceLocator

app = Flask(__name__)
container = ServiceContainer()
ServiceLocator.set_container(container)
```

## FastAPI 集成

```python
from fastapi import FastAPI
from FQBase.Foundation import retry

app = FastAPI()

@retry(max_attempts=3)
@app.get("/data")
async def get_data():
    pass
```
