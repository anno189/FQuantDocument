---
title: 生命周期管理 - 案例库
description: 生命周期管理应用场景
tag:
  - fqbase
  - lifecycle
---

# 生命周期管理 - 案例库

## 场景：服务健康检查

```python
from FQBase.Foundation.lifecycle import HealthCheckable, ServiceStatus

class DatabaseService:
    def health_check(self):
        return {"status": ServiceStatus.RUNNING}
```

## 相关文档

- [API参考](./api.md)
