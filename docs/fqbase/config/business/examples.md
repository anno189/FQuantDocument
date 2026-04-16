---
title: Business - 案例库
description: Business 业务配置模块实际应用场景与示例
tag:
  - fqbase
  - config
---

# Business - 案例库

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → **[案例库](./examples.md)** |

## 场景1: 配置多数据源优先级

**业务需求：** 配置股票数据源优先级，优先使用通达信，失败时使用Tushare

```python
from FQBase.Config.business import get_datasource_priority

# 获取配置
priority = get_datasource_priority('stock')
print(f"当前优先级: {priority}")
# 输出: ['tdx', 'tushare']

# 根据优先级遍历数据源
for source in priority:
    print(f"尝试连接: {source}")
    # 连接逻辑...
```

## 场景2: 管理通达信服务器IP

**业务需求：** 获取可用的通达信行情服务器IP列表

```python
from FQBase.Config.business import get_TDX_stock_ip_list, exclude_from_TDX_stock_ip_list

# 获取所有股票行情服务器IP
all_ips = get_TDX_stock_ip_list()
print(f"服务器数量: {len(all_ips)}")

# 排除已知故障的IP
bad_ips = ['115.238.56.198', '60.12.136.250']
good_ips = exclude_from_TDX_stock_ip_list(bad_ips)
print(f"可用服务器数量: {len(good_ips)}")

# 遍历可用服务器
for ip_info in good_ips:
    print(f"IP: {ip_info['ip']}, Port: {ip_info['port']}")
```

## 场景3: 配置健康检查

**业务需求：** 配置数据源健康检查参数

```python
from FQBase.Config.business import get_health_check_config

# 获取健康检查配置
config = get_health_check_config()
print(f"健康检查启用: {config['enabled']}")
print(f"超时时间: {config['timeout']}秒")
print(f"启动时检查: {config['startup_check']}")
print(f"按需检查: {config['on_demand_check']}")
```

## 场景4: 动态刷新配置

**业务需求：** 在运行时重新加载IP列表

```python
from FQBase.Config.business import reload_ip_list

# 修改JSON文件后刷新缓存
# ...修改操作...
reload_ip_list()

# 重新获取
from FQBase.Config.business import get_TDX_stock_ip_list
ips = get_TDX_stock_ip_list()
```

## 场景5: 获取期货数据源

**业务需求：** 配置期货数据源

```python
from FQBase.Config.business import get_datasource_priority, get_TDX_future_ip_list

# 获取期货数据源优先级
future_priority = get_datasource_priority('future')
print(f"期货数据源优先级: {future_priority}")

# 获取期货行情服务器IP
future_ips = get_TDX_future_ip_list()
print(f"期货服务器数量: {len(future_ips)}")
```

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
