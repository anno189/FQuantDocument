---
title: Trade 交易模块 - 开发指南
description: Trade 交易模块开发指南与贡献指南
tag:
  - fqdata
  - trade
---

# Trade 交易模块 - 开发指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [使用指南](./usage.md) → **[开发指南](./development.md)** → [最佳实践](./best-practices.md) |

## 概述

Trade 模块为量化交易系统提供基础工具支持，主要包含四个子模块。

## 模块结构

```
Trade/
├── __init__.py          # 模块导出
├── constants.py         # 交易常量
├── datetime/            # 日期时间工具
│   ├── __init__.py
│   ├── timestamp.py
│   ├── trade.py
│   └── trade_dates_data.py
├── runtime.py          # 全局日期单例
└── financial_mapping.py # 财务指标映射
```

## 代码规范

### 命名规范

- 常量类：使用全大写字母
- 函数：使用 `util_` 前缀
- 类名：使用 CapWords 风格

### 示例

```python
class GlobalDate:
    """全局日期单例类"""
    
    _cache_date: Optional[str] = None
    
    def get_trade_date(self) -> str:
        """获取当前交易日期"""
        pass
```

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
