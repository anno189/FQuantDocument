---
title: Business - 集成指南
description: Business 业务配置模块集成指南
tag:
  - fqbase
  - config
---

# Business - 集成指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [技术架构](./architecture.md) → **[集成指南](./integrations.md)** |

## 概述

Business 模块与其他模块的集成方式

## 1. 与 Core 模块集成

Business 模块依赖 Core 模块的配置管理功能。

### 1.1 配置依赖

```python
# Business 使用 Core 中的路径配置
from FQBase.Config import SETTING_PATH

# IP 列表文件路径
ip_file = f"{SETTING_PATH}/stock_ip.json"
```

### 1.2 环境变量集成

```python
# 通过环境变量覆盖配置
import os
os.environ['FQDATA_PATH'] = '/custom/path'

# Business 模块会使用新的路径
from FQBase.Config.business import get_TDX_stock_ip_list
ips = get_TDX_stock_ip_list()
```

## 2. 与 FQData 模块集成

Business 模块被 FQData 用于数据源管理。

### 2.1 数据源选择

```python
from FQBase.Config.business import get_datasource_priority
from FQBase.FQData import DataSource

# 根据优先级选择数据源
priority = get_datasource_priority('stock')
for source_name in priority:
    ds = DataSource(source_name)
    if ds.is_available():
        break
```

### 2.2 健康检查集成

```python
from FQBase.Config.business import get_health_check_config
from FQBase.FQData import HealthChecker

# 配置健康检查
config = get_health_check_config()
checker = HealthChecker(timeout=config['timeout'])
```

## 集成模式总结

| 集成类型 | 典型场景 | 组合方案 |
|----------|----------|----------|
| 配置依赖 | 读取路径配置 | Business + Core |
| 数据源选择 | 获取优先级 | Business + FQData |
| 健康检查 | 监控服务 | Business + FQData |

## 相关文档

- [API参考](./api.md)
- [技术架构](./architecture.md)
- [使用指南](./usage.md)
