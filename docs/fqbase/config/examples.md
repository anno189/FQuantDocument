---
title: Config - 案例库
description: Config 配置中心实际应用场景与示例
tag:
  - fqbase
  - config
---

# Config - 案例库

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [速查表](./cheatsheet.md) → [使用指南](./usage.md) → **[案例库](./examples.md)** |


## 概述

本文档展示 Config 配置中心的实际应用场景，重点介绍跨模块组合使用的最佳实践。

## 基础示例

### 示例 1：环境变量基本使用

**场景描述：** 应用程序启动时加载配置

**代码实现：**

```python
from FQBase.Config import load_env, get_env

# 加载环境变量
load_env()

# 获取数据库配置
db_config = {
    'host': get_env('MONGODB_HOST', 'localhost'),
    'port': int(get_env('MONGODB_PORT', 27017)),
    'database': get_env('MONGODB_DATABASE', 'fquant'),
}

print(f"数据库配置: {db_config}")
```

### 示例 2：使用交易常量

**场景描述：** 下单时使用交易常量

**代码实现：**

```python
from FQBase.Config import (
    ORDER_DIRECTION,
    EXCHANGE_ID,
    ORDER_MODEL,
    ORDER_STATUS,
)

# 创建订单
order = {
    'direction': ORDER_DIRECTION.BUY,
    'exchange': EXCHANGE_ID.SH,
    'code': '600000',
    'model': ORDER_MODEL.LIMIT,
    'price': 10.5,
    'volume': 100,
}

# 模拟订单状态检查
current_status = ORDER_STATUS.FILLED
if current_status == ORDER_STATUS.FILLED:
    print("订单已成交")
```

### 示例 3：多环境配置管理

**场景描述：** 开发/生产环境使用不同配置

**代码实现：**

```python
from FQBase.Config import get_env, DATABASE

# 根据环境选择配置
env = get_env('RUNNING_ENVIRONMENT', 'development')

if env == 'production':
    # 生产环境配置
    db_config = DATABASE['production']
else:
    # 开发环境配置
    db_config = DATABASE['development']

print(f"当前环境: {env}")
print(f"数据库配置: {db_config}")
```

## 常见应用模式

### 模式 1：配置优先读取

**描述：** 优先从环境变量读取， fallback 到默认值

```python
from FQBase.Config import get_env

# 优雅的配置读取方式
config = {
    'host': get_env('HOST', 'localhost'),
    'port': get_env('PORT', 8080),
    'debug': get_env('DEBUG', 'false').lower() == 'true',
}
```

### 模式 2：敏感配置检测

**描述：** 检测敏感配置是否正确配置

```python
from FQBase.Config import get_secure_env

def validate_secrets():
    """验证必需的敏感配置"""
    required = ['API_KEY', 'SECRET_KEY', 'TOKEN']
    missing = []

    for key in required:
        value = get_secure_env(key)
        if value is None:
            missing.append(key)

    if missing:
        print(f"警告: 以下敏感配置未设置: {missing}")
        return False
    return True
```

### 模式 3：交易常量组合

**描述：** 使用交易常量构建完整订单

```python
from FQBase.Config import (
    ORDER_DIRECTION,
    EXCHANGE_ID,
    ORDER_MODEL,
    ORDER_STATUS,
    TIME_CONDITION,
    VOLUME_CONDITION,
)

def create_order(code, direction, price, volume):
    """创建订单"""
    return {
        'code': code,
        'direction': direction,  # ORDER_DIRECTION.BUY/SELL
        'exchange': EXCHANGE_ID.SH,
        'model': ORDER_MODEL.LIMIT,
        'time_condition': TIME_CONDITION.GFD,
        'volume_condition': VOLUME_CONDITION.ANY,
        'price': price,
        'volume': volume,
    }

# 创建买单
order = create_order('600000', ORDER_DIRECTION.BUY, 10.5, 100)
```

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
- [故障排查](./troubleshooting.md)
