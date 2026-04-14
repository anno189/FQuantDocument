---
title: 单例模式 - 案例库
description: 单例模式应用场景
tag:
  - fqbase
  - singleton
---

# 单例模式 - 案例库

## 场景：全局配置

```python
from FQBase.Foundation.singleton import Singleton

class Config(metaclass=Singleton):
    pass
```

## 相关文档

- [API参考](./api.md)
