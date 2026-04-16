---
title: datetime - 常见问题
description: datetime 常见问题与解答
tag:
  - fqdata
  - trade
  - datetime
---

# datetime - 常见问题

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维/安全 | [README](./README.md) → [故障排查](./troubleshooting.md) → **[常见问题](./faq.md)** |

## 一般问题

### Q: 如何判断是否为交易日？

**A:** 使用 `util_if_trade(date)` 函数

### Q: 交易日数据从哪里获取？

**A:** 来自 trade_dates_data.py 中的静态数据

## 使用问题

### Q: 日期格式有什么要求？

**A:** 使用 `YYYY-MM-DD` 格式，如 '2024-01-15'

### Q: 如何获取前一个交易日？

**A:** 使用 `util_get_pre_trade_date(date)` 函数

## 相关文档

- [API参考](./api.md)
- [故障排查](./troubleshooting.md)
