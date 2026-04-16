---
title: Business - 最佳实践
description: Business 业务配置模块最佳实践与建议
tag:
  - fqbase
  - config
---

# Business - 最佳实践

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [技术架构](./architecture.md) → [API参考](./api.md) → [使用指南](./usage.md) → **[最佳实践](./best-practices.md)** |

## 概述

有效使用 Business 模块的最佳实践

## 配置最佳实践

### 实践1: 使用单例获取配置

**建议：** 使用模块提供的便捷函数而非直接实例化类

```python
# 好：使用便捷函数
from FQBase.Config.business import get_datasource_priority
priority = get_datasource_priority('stock')

# 不好：直接实例化
from FQBase.Config.business import DataSourceConfig
config = DataSourceConfig()  # 每次创建新实例
```

### 实践2: 及时刷新IP列表

**建议：** 修改配置文件后调用reload函数

```python
# 好：修改后刷新
with open('stock_ip.json', 'w') as f:
    json.dump(new_ips, f)
reload_ip_list()  # 刷新缓存
```

### 实践3: 异常处理

**建议：** 捕获可能的异常

```python
from FQBase.Config.business import get_datasource_priority

try:
    priority = get_datasource_priority('stock')
except Exception as e:
    logger.warning(f"获取数据源优先级失败: {e}")
    priority = []  # 使用空列表作为默认值
```

## 性能最佳实践

### 实践1: 减少重复加载

**建议：** 缓存配置结果

```python
# 好：获取一次，重复使用
_cached_priority = None

def get_cached_priority(asset_type):
    global _cached_priority
    if _cached_priority is None:
        _cached_priority = get_datasource_priority(asset_type)
    return _cached_priority
```

### 实践2: 使用延迟加载

**建议：** 利用延迟加载机制减少启动时间

```python
# 好：只在需要时加载
def get_stock_ips():
    from FQBase.Config.business import get_TDX_stock_ip_list
    return get_TDX_stock_ip_list()
```

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [案例库](./examples.md)
