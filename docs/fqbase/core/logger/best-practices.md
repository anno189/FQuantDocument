---
title: 统一日志系统 - 最佳实践
description: 统一日志系统最佳实践与建议
tag:
  - fqbase
  - logger
---

# 统一日志系统 - 最佳实践

## 性能最佳实践

### 技巧 1: 使用合适的日志级别

**建议：** 根据环境选择合适的日志级别

```python
# 生产环境
logger.setLevel(logging.WARNING)  # 只记录警告和错误

# 开发环境
logger.setLevel(logging.DEBUG)  # 记录所有信息
```

### 技巧 2: 避免冗余日志

**建议：** 不要在循环中记录大量日志

```python
# 不好：每次迭代都记录
for item in items:
    logger.info(f'处理: {item}')

# 好：批量记录或使用进度
logger.info(f'开始处理 {len(items)} 个项目')
```

## 配置最佳实践

### 技巧 1: 使用环境变量

```python
import os

log_dir = os.environ.get('FQ_LOG_DIR', '~/.fqdata/logs')
```

## 相关文档

- [API参考](./api.md)
- [配置指南](./configuration.md)
