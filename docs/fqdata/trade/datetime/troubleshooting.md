---
title: datetime - 故障排查
description: datetime 常见问题与解决方案
tag:
  - fqdata
  - trade
  - datetime
---

# datetime - 故障排查

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → **[故障排查](./troubleshooting.md)** |

## 常见问题

### 问题 1: 日期格式错误

**症状：**
- 函数返回错误结果
- 错误：`ValueError`

**可能原因：**
- 日期格式不正确

**解决方案：**

1. 检查日期格式是否为 `YYYY-MM-DD`：
```python
# 正确
util_if_trade('2024-01-15')

# 错误
util_if_trade('2024/01/15')
```

---

### 问题 2: 交易日数据过时

**症状：**
- 新增假期日期判断错误

**可能原因：**
- 交易日数据未更新

**解决方案：**

1. 检查版本：
```python
from FQData.Trade.datetime import trade_date_version
print(trade_date_version)
```

2. 更新 trade_dates_data.py

## 相关文档

- [常见问题](./faq.md)
- [最佳实践](./best-practices.md)
