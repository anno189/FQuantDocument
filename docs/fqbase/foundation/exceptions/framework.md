---
title: 统一异常处理系统 - 框架集成
description: 异常处理系统框架集成指南
tag:
  - fqbase
  - exceptions
---

# 统一异常处理系统 - 框架集成

## Flask 集成

```python
from flask import jsonify
from FQBase.Foundation.exceptions import FQException

@app.errorhandler(FQException)
def handle_fq_exception(e):
    return jsonify(e.to_dict()), 400
```

## FastAPI 集成

```python
from fastapi import Request
from FQBase.Foundation.exceptions import FQException

@app.exception_handler(FQException)
async def handle_fq_exception(request: Request, e: FQException):
    return JSONResponse(e.to_dict(), status_code=400)
```

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
