---
title: Util - 最佳实践
description: Util 跨模块工具层最佳实践与建议
tag:
  - fqbase
  - util
---

# Util - 最佳实践

## 最佳实践

### 按子模块导入

```python
# 好：按子模块导入
from FQBase.Util.converters import normalize_code

# 差：直接从包导入
from FQBase.Util import normalize_code
```

---

## 相关文档

- [API参考](./api.md)
