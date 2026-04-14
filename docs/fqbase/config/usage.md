---
title: Config - 使用指南
description: Config 配置中心详细使用指南
tag:
  - fqbase
  - config
---

# Config - 使用指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [速查表](./cheatsheet.md) → **[使用指南](./usage.md)** → [案例库](./examples.md) |
| 🔵 开发者 | [README](./README.md) → [技术架构](./architecture.md) → [API参考](./api.md) → **[使用指南](./usage.md)** → [最佳实践](./best-practices.md) |


## 概述

详细介绍如何有效使用 Config 配置中心。

## 基本用法

### 安装

```bash
pip install fquant-fqbase
```

### 快速开始

```python
from FQBase.Config import load_env, get_env, SETTING, DATABASE

# 加载环境变量
load_env()

# 获取环境变量
db_host = get_env('MONGODB_HOST', 'localhost')

# 获取数据库配置
print(DATABASE)
```

## 环境变量管理

### 加载环境变量

```python
from FQBase.Config import load_env

# 加载 .env 文件
load_env()

# .env 文件位置默认在项目根目录
```

### 获取环境变量

```python
from FQBase.Config import get_env, get_secure_env

# 获取普通环境变量
value = get_env('KEY_NAME', 'default')

# 获取敏感环境变量（检测占位符）
secure_value = get_secure_env('API_KEY')
```

### 重新加载

```python
from FQBase.Config import reload_env

# 重新加载环境变量（用于 Celery 等长期运行进程）
reload_env()
```

## 配置使用

### 数据库配置

```python
from FQBase.Config import DATABASE, DATABASE_ASYNC

# 同步数据库配置
print(DATABASE)

# 异步数据库配置
print(DATABASE_ASYNC)
```

### 路径配置

```python
from FQBase.Config import (
    FQDATA_PATH,
    SETTING_PATH,
    CACHE_PATH,
    LOG_PATH,
    DOWNLOAD_PATH,
    STRATEGY_PATH,
)

# 使用各路径
data_path = FQDATA_PATH
```

## 交易常量使用

### 订单方向

```python
from FQBase.Config import ORDER_DIRECTION

# 使用订单方向
direction = ORDER_DIRECTION.BUY  # 买入
direction = ORDER_DIRECTION.SELL # 卖出
```

### 交易所

```python
from FQBase.Config import EXCHANGE_ID

# 交易所ID
exchange = EXCHANGE_ID.SH    # 上海
exchange = EXCHANGE_ID.SZ    # 深圳
exchange = EXCHANGE_ID.CFFEX # 中金所
```

### 订单状态

```python
from FQBase.Config import ORDER_STATUS

# 订单状态
status = ORDER_STATUS.SUBMITTING  # 提交中
status = ORDER_STATUS.SUBMITTED    # 已提交
status = ORDER_STATUS.FILLED       # 全部成交
```

## 数据源配置

### 获取数据源优先级

```python
from FQBase.Config import get_datasource_priority

priority = get_datasource_priority()
# 返回: ['tushare', 'tonghua', 'wy']
```

### 健康检查配置

```python
from FQBase.Config import get_health_check_config

health_config = get_health_check_config()
```

## 常见用例

### 用例 1: 数据库连接配置

**场景：** 配置 MongoDB 数据库连接

**代码：**

```python
from FQBase.Config import load_env, get_env

# 第1步：加载环境变量
load_env()

# 第2步：获取数据库配置
host = get_env('MONGODB_HOST', 'localhost')
port = int(get_env('MONGODB_PORT', 27017))
db_name = get_env('MONGODB_DATABASE', 'fquant')

# 第3步：构建连接字符串
connection_string = f"mongodb://{host}:{port}/{db_name}"
```

### 用例 2: 使用交易常量

**场景：** 下单时指定订单参数

**代码：**

```python
from FQBase.Config import ORDER_DIRECTION, EXCHANGE_ID, ORDER_MODEL

# 买入订单
order = {
    'direction': ORDER_DIRECTION.BUY,
    'exchange': EXCHANGE_ID.SH,
    'model': ORDER_MODEL.LIMIT,
    'price': 100.0,
    'volume': 100,
}
```

## 错误处理

```python
from FQBase.Config import get_env, ConfigValidationError

try:
    # 获取配置
    value = get_env('REQUIRED_KEY')
    if value is None:
        print("警告: 必需的配置项未设置")
except Exception as e:
    print(f"配置错误: {e}")
```

## 相关文档

- [API参考](./api.md)
- [最佳实践](./best-practices.md)
- [故障排查](./troubleshooting.md)
