---
title: 生命周期管理 - 快速入门
description: 5分钟快速上手生命周期管理
tag:
  - fqbase
  - lifecycle

summary:
  purpose: quick-start
  complexity: low
---

# 生命周期管理 - 快速入门

## 概述

生命周期管理提供标准化的服务生命周期协议。

## 快速开始

```python
from FQBase.Foundation.lifecycle import HealthCheckable, Initializable, ServiceStatus
```

## 使用协议

```python
class MyService:
    def health_check(self):
        return {"status": ServiceStatus.RUNNING}
```

## 相关文档

- [API参考](./api.md)
