---
title: 统一异常处理系统 - 案例库
description: 异常处理实际应用场景
tag:
  - fqbase
  - exceptions
---

# 统一异常处理系统 - 案例库

## 场景 1: 数据源异常

```python
from FQBase.Foundation.exceptions import DataSourceException, DataFetchException

try:
    data = fetch_data()
except DataFetchException as e:
    logger.error(f"数据获取失败: {e.message}")
```

## 场景 2: 统一错误响应

```python
from FQBase.Foundation.exceptions import FQException

def handle_error(exc):
    return exc.to_dict()
```

## 相关文档

- [API参考](./api.md)
