---
title: 统一异常处理系统 - 最佳实践
description: 异常处理最佳实践
tag:
  - fqbase
  - exceptions
---

# 统一异常处理系统 - 最佳实践

## 最佳实践

### 1. 使用统一异常

始终使用 FQException 及其子类。

### 2. 提供错误码

为每个异常提供有意义的错误码。

### 3. 附加上下文

使用 details 传递额外信息。

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
