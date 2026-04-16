---
title: Business - 使用指南
description: Business 业务配置模块详细使用指南
tag:
  - fqbase
  - config
---

# Business - 使用指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [使用指南](./usage.md) → [案例库](./examples.md) |
| 🔵 开发者 | [README](./README.md) → [技术架构](./architecture.md) → [API参考](./api.md) → **[使用指南](./usage.md)** → [最佳实践](./best-practices.md) |

## 概述

Business 模块的详细使用方法

## 基本用法

### 数据源配置

```python
from FQBase.Config.business import DataSourceConfig

# 获取配置实例（单例）
config = DataSourceConfig()

# 获取数据源优先级
priority = config.get_priority('stock')
print(f"股票数据源优先级: {priority}")

# 获取配置值
value = config.get('datasources.stock.priority', [])
```

### IP列表管理

```python
from FQBase.Config.business import (
    get_TDX_stock_ip_list,
    get_TDX_future_ip_list,
    reload_ip_list,
)

# 获取股票行情服务器IP列表
stock_ips = get_TDX_stock_ip_list()

# 获取期货行情服务器IP列表
future_ips = get_TDX_future_ip_list()

# 修改IP列表后刷新
reload_ip_list()
```

## 常见用例

### 用例1: 获取多资产类型数据源

```python
from FQBase.Config.business import get_datasource_priority

asset_types = ['stock', 'index', 'future', 'bond', 'option']

for asset_type in asset_types:
    priority = get_datasource_priority(asset_type)
    print(f"{asset_type}: {priority}")
```

### 用例2: 排除故障IP

```python
from FQBase.Config.business import exclude_from_TDX_stock_ip_list

# 排除已知故障的IP
exclude_ips = ['115.238.56.198', '60.12.136.250']
available_ips = exclude_from_TDX_stock_ip_list(exclude_ips)

# 使用可用IP
for ip_info in available_ips:
    print(f"IP: {ip_info['ip']}, Port: {ip_info['port']}")
```

## 配置

### 配置文件位置

数据源配置文件：`{FQDATA_PATH}/datasource.yaml`

IP列表文件：
- 资讯IP：`{SETTING_PATH}/info_ip.json`
- 股票IP：`{SETTING_PATH}/stock_ip.json`
- 期货IP：`{SETTING_PATH}/future_ip.json`

### 环境变量

无特殊环境变量需求，依赖 Core 模块的配置。

## 错误处理

```python
from FQBase.Config.business import DataSourceConfig

try:
    config = DataSourceConfig()
    priority = config.get_priority('stock')
except Exception as e:
    print(f"获取配置失败: {e}")
```

## 相关文档

- [API参考](./api.md)
- [最佳实践](./best-practices.md)
- [案例库](./examples.md)
