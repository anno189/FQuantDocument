---
title: Config - 核心概念
description: 深入理解 Config 配置中心的核心概念
tag:
  - fqbase
  - config
---

# Config - 核心概念

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [术语表](./glossary.md) → **[核心概念](./concepts.md)** → [技术架构](./architecture.md) |


## 概述

深入理解 Config 配置中心的核心概念，包括环境变量管理、配置监听、交易常量等。

## 概念 1: 环境变量管理

### 概念解释

环境变量管理是 Config 模块的核心功能之一，通过 `EnvManager` 单例类统一管理 .env 文件的加载和读取。

### 原理

1. `EnvManager` 使用单例模式确保全局唯一
2. 支持 override=False 避免覆盖已存在的系统环境变量
3. 支持敏感信息占位符检测
4. 支持 Celery 等长期运行进程的动态重载

### 代码示例

```python
from FQBase.Config import load_env, get_env, reload_env

# 加载环境变量
load_env()

# 获取环境变量
value = get_env('KEY_NAME', 'default_value')

# 重新加载（用于动态更新）
reload_env()
```

## 概念 2: 配置监听

### 概念解释

配置监听机制允许应用在配置文件发生变化时自动更新配置，无需重启应用。

### 原理

1. 使用文件监听器监控配置文件
2. 支持热更新配置
3. 提供回调机制处理配置变更

### 代码示例

```python
from FQBase.Config import ConfigWatcher, watch_config

# 创建配置监听器
watcher = ConfigWatcher()

# 监听配置变化
@watcher.on_change
def handle_config_change(config):
    print(f"配置已更新: {config}")

# 启动监听
watcher.start()
```

## 概念 3: 交易常量

### 概念解释

交易常量是量化交易业务中使用的标准枚举值，包括订单方向、交易所ID、订单状态等。

### 原理

1. 使用 Python 枚举（Enum）定义常量
2. 提供类型安全的常量访问
3. 支持中英文对照

### 代码示例

```python
from FQBase.Config import ORDER_DIRECTION, EXCHANGE_ID, ORDER_STATUS

# 订单方向
ORDER_DIRECTION.BUY   # 买入
ORDER_DIRECTION.SELL  # 卖出

# 交易所
EXCHANGE_ID.SH       # 上海交易所
EXCHANGE_ID.SZ       # 深圳交易所
EXCHANGE_ID.CFFEX    # 中金所

# 订单状态
ORDER_STATUS.SUBMITTING  # 提交中
ORDER_STATUS.SUBMITTED   # 已提交
ORDER_STATUS.PART_FILLED # 部分成交
ORDER_STATUS.FILLED      # 全部成交
ORDER_STATUS.CANCELLED   # 已撤销
```

## 概念 4: 数据源配置

### 概念解释

数据源配置管理多个数据源的优先级和健康检查配置，支持数据源的动态切换。

### 原理

1. 配置多个数据源的优先级
2. 支持健康检查机制
3. 自动选择可用数据源

### 代码示例

```python
from FQBase.Config import DataSourceConfig, get_datasource_priority

# 获取数据源优先级
priority = get_datasource_priority()

# 健康检查配置
health_config = get_health_check_config()
```

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [术语表](./glossary.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
