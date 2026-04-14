---
title: 统一异常处理系统 - 核心概念
description: 深入理解 FQBase 异常处理系统
tag:
  - fqbase
  - exceptions
---

# 统一异常处理系统 - 核心概念

## 概念：异常类层次

```
FQException (基类)
├── DataSourceException
│   ├── DataFetchException
│   └── DataParseException
├── ValidationException
└── ...
```

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
