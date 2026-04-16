---
title: Trade 交易模块 - 故障排查
description: Trade 交易模块常见问题与解决方案
tag:
  - fqdata
  - trade
---

# Trade 交易模块 - 故障排查

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维/安全 | [README](./README.md) → [使用指南](./usage.md) → **[故障排查](./troubleshooting.md)** → [常见问题](./faq.md) |

## 概述

Trade 模块的常见问题和解决方案。

## 常见问题

### 问题 1: 日期格式不正确导致判断结果异常

**症状：**
- `util_if_trade` 返回 False
- 日期判断结果不符合预期

**可能原因：**
- 日期字符串格式不正确，应使用 "YYYY-MM-DD" 格式

**解决方案：**

1. 检查日期格式：

```python
from FQData.Trade import util_if_trade

# 正确格式
print(util_if_trade("2024-01-02"))  # True

# 错误格式
print(util_if_trade("2024/01/02"))  # 可能返回 False
```

---

### 问题 2: 交易日期数据版本过旧

**症状：**
- 判断新日期是否为交易日时结果不正确

**可能原因：**
- `trade_dates_data.py` 中的数据是静态导出，需要定期更新

**解决方案：**

1. 检查数据版本：

```python
from FQData.Trade import trade_date_version, trade_date_end_date

print(f"数据版本: {trade_date_version}")
print(f"数据截止日期: {trade_date_end_date}")
```

2. 如需最新数据，访问上交所官网获取

---

### 问题 3: 全局日期单例未更新

**症状：**
- 获取的当前交易日期不是最新的

**可能原因：**
- GlobalDate 使用缓存机制，在交易时段内不会更新

**解决方案：**

```python
from FQData.Trade import GLOBALDATE

# 强制刷新缓存
gd = GLOBALDATE()
gd._update_cache_if_needed()
```

---

## 获取帮助

### 联系支持

- GitHub Issues：[链接](https://github.com/fquant/fquant/issues)

## 相关文档

- [常见问题](./faq.md)
- [最佳实践](./best-practices.md)
- [API参考](./api.md)
