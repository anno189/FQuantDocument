---
title: 统一日志系统 - 故障排查
description: 统一日志系统常见问题与解决方案
tag:
  - fqbase
  - logger
---

# 统一日志系统 - 故障排查

## 常见问题

### 问题 1: 日志未输出

**可能原因：** 日志级别设置过高

**解决方案：**

```python
logger = get_logger('my_module')
# 确保级别设置正确
```

### 问题 2: 日志文件未创建

**可能原因：** 日志目录不存在或无权限

**解决方案：**

```python
import os
log_dir = os.environ.get('FQ_LOG_DIR')
os.makedirs(log_dir, exist_ok=True)
```

## 相关文档

- [API参考](./api.md)
