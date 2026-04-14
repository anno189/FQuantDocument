---
title: 统一异常处理系统 - 技术架构
description: 异常处理系统技术架构
tag:
  - fqbase
  - exceptions
---

# 统一异常处理系统 - 技术架构

## 架构设计

### 异常层次

```
FQException (基类)
├── DataSourceException
│   ├── DataFetchException
│   └── DataParseException
├── ValidationException
├── StrategyException
└── ConfigException
```

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
