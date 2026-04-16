---
title: Base - 故障排查
description: Base 基础配置模块常见问题与解决方案
tag:
  - fqbase
  - config
---

# Base - 故障排查

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → [安全指南](./security.md) → **[故障排查](./troubleshooting.md)** → [常见问题](./faq.md) |

## 概述

Base 基础配置模块的常见问题和解决方案

## 常见问题

### 问题 1: MongoDB 连接失败

**症状：**
- 错误：`ConnectionError: Unable to connect to MongoDB`
- 错误：`pymongo.errors.ServerSelectionTimeoutError`

**可能原因：**
- MongoDB 服务未运行
- 连接地址错误
- 网络问题

**解决方案：**

1. 检查 MongoDB 服务：
```bash
mongod --version
```

2. 检查连接：
```python
from FQBase.Config.base import SETTING
print(SETTING.get_mongo())
```

---

### 问题 2: 环境变量加载失败

**症状：**
- 错误：`KeyError: 'XXX'`
- 错误：配置值为 None

**可能原因：**
- .env 文件不存在
- 变量名称错误

**解决方案：**

1. 检查 .env 文件是否存在
2. 使用默认值：
```python
value = get_env('KEY', 'default_value')
```

---

### 问题 3: 缓存配置无效

**症状：**
- 缓存不工作
- 连接错误

**可能原因：**
- 缓存类型未正确设置
- Redis/MongoDB 未运行

**解决方案：**

```python
from FQBase.Config.base import get_cache_config, set_cache_config, CacheType

# 重新设置
set_cache_config(CacheType.REDIS, host='localhost', port=6379)
config = get_cache_config()
print(config.get_type())
```

## 错误参考

| 代码 | 错误 | 描述 | 解决方案 |
|------|------|------|---------|
| 001 | ConnectionError | 连接失败 | 检查服务状态 |
| 002 | ConfigValidationError | 配置无效 | 检查配置格式 |
| 003 | KeyError | 变量不存在 | 使用默认值 |

## 诊断工具

### 启用调试日志

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

### 健康检查

```python
from FQBase.Config.base import SETTING, get_cache_config

# 检查配置状态
print(f"MongoDB: {SETTING.get_mongo()}")
print(f"Cache: {get_cache_config().get_type()}")
```

## 相关文档

- [常见问题](./faq.md)
- [最佳实践](./best-practices.md)
- [API参考](./api.md)
