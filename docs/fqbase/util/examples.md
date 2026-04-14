---
title: Util - 案例库
description: Util 跨模块工具层实际应用场景与示例
tag:
  - fqbase
  - util
---

# Util - 案例库

## 示例

```python
from FQBase.Util.converters import normalize_code
from FQBase.Util.transformer import dict_to_df

# 股票代码标准化
code = normalize_code('600000')

# 数据转换
data = [{'name': 'test'}]
df = dict_to_df(data)
```

---

## 相关文档

- [API参考](./api.md)
