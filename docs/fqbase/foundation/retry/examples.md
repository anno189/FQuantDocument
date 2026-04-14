---
title: 重试机制 - 案例库
description: 重试机制应用场景
tag:
  - fqbase
  - retry
---

# 重试机制 - 案例库

## 场景：API 请求重试

```python
from FQBase.Foundation.retry import retry

@retry(max_attempts=3, delay=1)
def call_api():
    pass
```

## 相关文档

- [API参考](./api.md)
