---
title: datetime - 开发指南
description: datetime 开发指南与贡献指南
tag:
  - fqdata
  - trade
  - datetime
---

# datetime - 开发指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [API参考](./api.md) → **[开发指南](./development.md)** |

## 概述

如何开发和贡献 datetime 模块

## 项目结构

```
datetime/
├── __init__.py          # 模块导出
├── timestamp.py          # 时间戳工具
├── trade.py              # 交易日工具
└── trade_dates_data.py   # 交易日数据
```

## 代码规范

- 遵循 PEP 8
- 使用类型提示
- 编写文档字符串

## 测试

```bash
pytest tests/
```

## 相关文档

- [API参考](./api.md)
- [最佳实践](./best-practices.md)
