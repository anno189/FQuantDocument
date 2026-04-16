---
title: Business - 常见问题
description: Business 业务配置模块常见问题与解答
tag:
  - fqbase
  - config
---

# Business - 常见问题

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → [故障排查](./troubleshooting.md) → **[常见问题](./faq.md)** |

## 一般问题

### Q: 如何获取数据源优先级？

**A:** 使用 `get_datasource_priority` 函数：

```python
from FQBase.Config.business import get_datasource_priority
priority = get_datasource_priority('stock')
```

### Q: 支持哪些资产类型？

**A:** 支持以下资产类型：
- stock（股票）
- index（指数）
- future（期货）
- bond（债券）
- option（期权）
- hk_stock（港股）
- us_stock（美股）
- exchange_rate（汇率）

### Q: IP列表从哪里加载？

**A:** IP列表从以下位置按优先级加载：
1. `{SETTING_PATH}/info_ip.json`（资讯IP）
2. `{SETTING_PATH}/stock_ip.json`（股票IP）
3. `{SETTING_PATH}/future_ip.json`（期货IP）

如果文件不存在，使用内置默认值。

## 使用问题

### Q: 如何添加新的数据源？

**A:** 在 `datasource.yaml` 配置文件中添加：

```yaml
datasources:
  new_asset:
    priority: ['new_source1', 'new_source2']
```

### Q: 如何排除故障IP？

**A:** 使用 `exclude_from_TDX_stock_ip_list` 函数：

```python
from FQBase.Config.business import exclude_from_TDX_stock_ip_list
available = exclude_from_TDX_stock_ip_list(['故障IP1', '故障IP2'])
```

### Q: 如何刷新配置？

**A:** 使用对应的 reload 函数：

```python
from FQBase.Config.business import reload_ip_list, reload_datasource_config

# 刷新IP列表
reload_ip_list()

# 刷新数据源配置
reload_datasource_config()
```

## 故障排查

### Q: 为什么获取到的是空列表？

**A:** 检查配置文件是否存在且格式正确：

```python
import yaml
with open('datasource.yaml') as f:
    config = yaml.safe_load(f)
print(config)
```

### Q: 修改文件后没有生效？

**A:** 调用刷新函数清除缓存：

```python
reload_ip_list()  # 或 reload_datasource_config()
```

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [故障排查](./troubleshooting.md)
