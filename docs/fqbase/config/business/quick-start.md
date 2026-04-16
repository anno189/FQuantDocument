---
title: Business - 快速入门
description: 5分钟快速上手 Business 业务配置模块
tag:
  - fqbase
  - config

summary:
  purpose: quick-start
  complexity: low
---

# Business - 快速入门

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → **[快速入门](./quick-start.md)** → [使用指南](./usage.md) → [案例库](./examples.md) |

## 概述

5分钟快速上手 Business 业务配置模块

## 前置要求

- Python 3.8+
- pip

## 安装

```bash
pip install fquant-fqbase
```

## 5分钟上手

### Step 1: 导入模块

```python
from FQBase.Config.business import get_datasource_priority
```

### Step 2: 获取数据源优先级

```python
# 获取股票数据源优先级
stock_priority = get_datasource_priority('stock')
print(stock_priority)
# 输出示例: ['tdx', 'tushare']

# 获取期货数据源优先级
future_priority = get_datasource_priority('future')
print(future_priority)
```

### Step 3: 获取健康检查配置

```python
from FQBase.Config.business import get_health_check_config

health_config = get_health_check_config()
print(health_config)
# 输出: {'enabled': True, 'timeout': 5, 'startup_check': True, 'on_demand_check': True}
```

### Step 4: 使用IP列表

```python
from FQBase.Config.business import (
    get_TDX_info_ip_list,
    get_TDX_stock_ip_list,
    get_TDX_future_ip_list,
)

# 获取通达信股票行情服务器IP列表
stock_ips = get_TDX_stock_ip_list()
print(stock_ips)
# 输出示例: [{'ip': '115.238.56.198', 'port': 7709}, ...]

# 排除某些IP
from FQBase.Config.business import exclude_from_TDX_stock_ip_list

available_ips = exclude_from_TDX_stock_ip_list(['115.238.56.198'])
print(available_ips)
```

### Step 5: 完成！

恭喜！你已经学会了 Business 业务配置模块的基本用法。

## ⚠️ 常见陷阱

1. **陷阱1：配置文件不存在时使用默认值**
   - ❌ 错误做法：假设配置文件一定存在
   - ✅ 正确做法：模块会自动使用内置默认值

2. **陷阱2：修改IP列表后未刷新**
   - ❌ 错误做法：修改JSON文件后直接使用
   - ✅ 正确做法：调用 `reload_ip_list()` 刷新缓存

## 下一步

- 学习 [核心概念](./concepts.md)
- 阅读 [使用指南](./usage.md)
- 查看 [API参考](./api.md)

## 相关文档

- [README](./README.md)
- [API参考](./api.md)
- [使用指南](./usage.md)
