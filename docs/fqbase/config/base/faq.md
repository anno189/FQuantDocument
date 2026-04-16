---
title: Base - 常见问题
description: Base 基础配置模块常见问题与解答
tag:
  - fqbase
  - config
---

# Base - 常见问题

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → [安全指南](./security.md) → [故障排查](./troubleshooting.md) → **[常见问题](./faq.md)** |

## 一般问题

### Q: 如何获取环境变量？

**A:** 使用 `get_env` 函数：

```python
from FQBase.Config.base import get_env
value = get_env('KEY', 'default')
```

### Q: SETTING 是单例吗？

**A:** 是的，SETTING 是单例模式，直接使用即可：

```python
from FQBase.Config.base import SETTING
mongo_uri = SETTING.get_mongo()
```

## 使用问题

### Q: 如何配置 Redis 缓存？

**A:** 使用 `set_cache_config` 函数：

```python
from FQBase.Config.base import set_cache_config, CacheType
set_cache_config(CacheType.REDIS, host='localhost', port=6379)
```

### Q: 如何监听配置变化？

**A:** 使用 `@watch_config` 装饰器：

```python
from FQBase.Config.base import watch_config

@watch_config('config.yaml')
def on_change(config):
    print(f"配置已更新: {config}")
```

## 故障排查

### Q: MongoDB 连接失败

**A:** 检查以下项：
1. MongoDB 服务是否运行
2. 环境变量 MONGODB_URL 是否正确
3. 网络是否可达

### Q: 缓存配置不生效

**A:** 确保在应用启动时设置缓存配置，运行时更改需要重启应用。

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
- [故障排查](./troubleshooting.md)
