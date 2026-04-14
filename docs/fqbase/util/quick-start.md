---
title: Util - 快速入门
description: 5分钟快速上手 Util 跨模块工具层
tag:
  - fqbase
  - util
---

# Util - 快速入门

## 5分钟上手

### Step 1: 导入模块

```python
from FQBase.Util import dict_to_df, normalize_code
```

### Step 2: 使用工具函数

```python
# 数据转换
import pandas as pd
data = [{'name': 'test', 'value': 100}]
df = dict_to_df(data)

# 股票代码标准化
code = normalize_code('600000')
```

---

## 相关文档

- [API参考](./api.md)
