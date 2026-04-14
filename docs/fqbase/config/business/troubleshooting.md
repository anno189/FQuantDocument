---
title: Business - 故障排查
description: Business 业务配置模块常见问题与解决方案
tag:
  - fqbase
  - config
---

# Business - 故障排查

## 概述

Business 业务配置模块的常见问题和解决方案。

## 常见问题

### 问题：常量值不存在

**解决方案：** 检查常量名称是否正确

```python
from FQBase.Config.business import ORDER_DIRECTION
# 正确使用
print(ORDER_DIRECTION.BUY)
```

---

## 相关文档

- [常见问题](./faq.md)
- [最佳实践](./best-practices.md)
