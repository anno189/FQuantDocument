---
title: 统一日志系统 - 性能调优
description: 统一日志系统性能优化指南
tag:
  - fqbase
  - logger
---

# 统一日志系统 - 性能调优

## 性能考虑

### 日志 I/O 开销

记录日志有 I/O 开销，高频日志影响性能：

```python
# 高频调用
for i in range(100000):
    logger.info(f'处理: {i}')  # I/O 开销大

# 优化：批量记录或减少日志
logger.info(f'开始处理 100000 个项目')
```

## 相关文档

- [API参考](./api.md)
