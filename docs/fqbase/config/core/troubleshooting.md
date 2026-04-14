---
title: Core - 故障排查
description: Core 核心配置模块常见问题与解决方案
tag:
  - fqbase
  - config
---

# Core - 故障排查

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维/安全 | [README](./README.md) → [配置指南](./configuration.md) → **[故障排查](./troubleshooting.md)** |


## 概述

Core 核心配置模块的常见问题和解决方案。

## 常见问题

### 问题 1: 环境变量未加载

**解决方案：**

```python
from FQBase.Config.core import load_env
load_env()
```

---

## 相关文档

- [常见问题](./faq.md)
- [最佳实践](./best-practices.md)
