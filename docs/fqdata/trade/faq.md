---
title: Trade 交易模块 - 常见问题
description: Trade 交易模块常见问题与解答
tag:
  - fqdata
  - trade
---

# Trade 交易模块 - 常见问题

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维/安全 | [README](./README.md) → [使用指南](./usage.md) → [故障排查](./troubleshooting.md) → **[常见问题](./faq.md)** |

## 一般问题

### Q: 如何判断一个日期是否为交易日？

**A:** 使用 `util_if_trade` 函数：

```python
from FQData.Trade import util_if_trade

is_trade = util_if_trade("2024-01-02")
print(is_trade)  # True 或 False
```

### Q: 交易日期数据从哪里获取？

**A:** 本模块使用上海证券交易所（SSE）的静态历史交易日数据。

### Q: GlobalDate 是单例吗？

**A:** 是的，GlobalDate 使用单例模式，在整个应用程序中全局唯一。

### Q: 如何获取当前交易日期？

**A:** 使用 `get_today()` 函数或 `GLOBALDATE` 类：

```python
from FQData.Trade import get_today, GLOBALDATE

today = get_today()
gd = GLOBALDATE()
trade_date = gd.get_trade_date()
```

## 使用问题

### Q: 为什么 util_get_next_trade_date 的结果不包含起始日期？

**A:** 这是设计如此。如果起始日期是交易日，`util_get_next_trade_date` 返回的是**之后第N个**交易日，不包含起始日期。

### Q: 日期格式有什么要求？

**A:** 推荐使用 "YYYY-MM-DD" 格式的10位日期字符串，如 "2024-01-02"。

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [故障排查](./troubleshooting.md)
