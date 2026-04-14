---
title: Date - 案例库
description: Date 日期时间工具模块实际应用场景与示例
tag:
  - fqbase
  - date
---

# Date - 案例库

## 示例

### 示例：获取历史交易日

```python
from FQBase.Date import util_get_trade_range

# 获取2024年1月的所有交易日
trade_dates = util_get_trade_range('2024-01-01', '2024-01-31')
print(trade_dates)
```

---

## 相关文档

- [API参考](./api.md)
