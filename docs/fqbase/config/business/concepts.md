---
title: Business - 核心概念
description: Business 业务配置模块核心概念详解
tag:
  - fqbase
  - config
---

# Business - 核心概念

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → **[核心概念](./concepts.md)** → [使用指南](./usage.md) |

## 概述

Business 模块的核心概念包括数据源配置、IP列表管理和延迟加载机制。

## 概念 1: 数据源配置

### 概念解释

数据源配置管理多数据源的优先级顺序，支持股票、期货、指数等多种资产类型。

### 原理

配置文件 `datasource.yaml` 中定义各资产类型的数据源优先级顺序，系统按顺序尝试连接。

### 代码示例

```python
from FQBase.Config.business import DataSourceConfig

config = DataSourceConfig()
priority = config.get_priority('stock')
# 返回数据源代号列表，如 ['tdx', 'tushare']
```

## 概念 2: IP列表延迟加载

### 概念解释

IP列表采用延迟加载机制，模块导入时不执行文件I/O，只有在首次访问时才加载。

### 原理

使用 `__getattr__` 实现延迟加载，配置文件不存在时使用内置默认值。

### 代码示例

```python
# 第一次访问时加载
from FQBase.Config.business import TDX_info_ip_list
# 此时才读取文件或使用默认值
```

## 概念 3: 健康检查配置

### 概念解释

健康检查配置用于监控数据源服务的可用性。

### 配置项

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| enabled | bool | True | 是否启用 |
| timeout | int | 5 | 超时时间(秒) |
| startup_check | bool | True | 启动时检查 |
| on_demand_check | bool | True | 按需检查 |

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [API参考](./api.md)
- [使用指南](./usage.md)
