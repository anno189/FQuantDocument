---
title: FQBase - 安全指南
description: FQBase 安全配置与最佳实践
tag:
  - fqbase
---

# FQBase - 安全指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → **[安全指南](./security.md)** → [故障排查](./troubleshooting.md) → [常见问题](./faq.md) |

## 子模块安全指南

| 子模块 | 安全指南 | 说明 |
|--------|----------|------|
| Core | [安全指南](./core/security.md) | 事件总线、日志、通知 |
| Config | [安全指南](./config/usage.md) | 配置管理 |
| Cache | [安全指南](./cache/security.md) | 缓存抽象 |


## 概述

FQBase 的安全概览和重要安全注意事项。

## 认证

### API 密钥认证

```python
from FQBase.Config import get_secure_env

api_key = get_secure_env("API_KEY")
```

### 环境变量安全

```python
from FQBase.Config import get_secure_env

# 安全获取敏感配置
secret = get_secure_env('SECRET_KEY')
```

## 数据保护

### 敏感信息处理

**好：**

```python
# 使用环境变量
api_key = os.environ.get("API_KEY")
```

**差：**

```python
# 永远不要这样做！
api_key = "hardcoded_secret"
```

### 日志脱敏

```python
from FQBase.Core import get_logger

logger = get_logger('security')

# 记录日志时脱敏
logger.info(f"用户 {user_id} 登录成功")  # 不记录敏感信息
```

## 输入验证

### 验证用户输入

```python
from FQBase.Foundation import validate_code, validate_date

# 验证输入
validate_code(request['code'])
validate_date(request['date'])
```

## 安全最佳实践

1. 永远不要硬编码凭据
2. 使用环境变量存储密钥
3. 启用审计日志
4. 定期轮换 API 密钥
5. 实现限流
6. 使用最小权限原则

## 审计日志

```python
from FQBase.Core import get_logger

logger = get_logger('audit')

# 记录安全事件
logger.info(f"用户 {user_id} 执行了 {action}")
```

## 相关文档

- [API参考](./api.md)
- [最佳实践](./best-practices.md)
- [配置指南](./configuration.md)
