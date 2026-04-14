---
title: Config - 最佳实践
description: Config 配置中心最佳实践与建议
tag:
  - fqbase
  - config
---

# Config - 最佳实践

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [API参考](./api.md) → [使用指南](./usage.md) → **[最佳实践](./best-practices.md)** |
| 🟡 运维/安全 | [README](./README.md) → [配置指南](./configuration.md) → [故障排查](./troubleshooting.md) → **[最佳实践](./best-practices.md)** |


## 概述

有效使用 Config 配置中心的最佳实践。

## 配置管理最佳实践

### 技巧 1: 使用默认值

**建议：** 始终为环境变量提供默认值

**代码 - 好：**

```python
from FQBase.Config import get_env

host = get_env('MONGODB_HOST', 'localhost')
port = int(get_env('MONGODB_PORT', 27017))
```

**代码 - 差：**

```python
# 没有默认值可能导致运行时错误
host = os.environ['MONGODB_HOST']
```

### 技巧 2: 敏感配置检测

**建议：** 检测敏感配置是否为占位符

**代码 - 好：**

```python
from FQBase.Config import get_secure_env

api_key = get_secure_env('API_KEY')
if api_key is None:
    raise ValueError("API_KEY 未配置")
```

**代码 - 差：**

```python
# 不检查占位符，可能使用无效值
api_key = os.environ.get('API_KEY')
```

## 安全最佳实践

### 技巧 1: 使用环境变量存储密钥

**建议：** 永远不要硬编码密钥

**代码 - 好：**

```python
from FQBase.Config import get_secure_env

api_key = get_secure_env('API_KEY')
```

**代码 - 差：**

```python
# 永远不要这样做！
api_key = "my_secret_key_123"
```

### 技巧 2: 分离配置

**建议：** 开发/生产环境使用不同的 .env 文件

```bash
# 开发环境
cp .env.development .env

# 生产环境
cp .env.production .env
```

## 交易常量最佳实践

### 技巧 1: 使用枚举而非字符串

**建议：** 使用交易常量枚举而非字符串比较

**代码 - 好：**

```python
from FQBase.Config import ORDER_DIRECTION

if order['direction'] == ORDER_DIRECTION.BUY:
    print("买入订单")
```

**代码 - 差：**

```python
# 容易出错
if order['direction'] == 'BUY':
    print("买入订单")
```

## 错误处理最佳实践

### 技巧 1: 必需配置检查

```python
from FQBase.Config import get_env

REQUIRED_KEYS = ['MONGODB_HOST', 'MONGODB_DATABASE']

def validate_config():
    """验证必需配置"""
    for key in REQUIRED_KEYS:
        value = get_env(key)
        if value is None:
            raise ValueError(f"必需的配置项未设置: {key}")
```

## 配置最佳实践

### 技巧 1: 使用分层配置

```python
# 从环境变量读取关键配置
from FQBase.Config import get_env, DATABASE

config = {
    'env': get_env('RUNNING_ENVIRONMENT', 'development'),
    'database': DATABASE,
    # 其他配置
}
```

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [配置指南](./configuration.md)
