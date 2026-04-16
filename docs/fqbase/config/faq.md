---
title: Config - 常见问题
description: FQBase 配置中心常见问题与解答
tag:
  - fqbase
  - config
---

# Config - 常见问题

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → [安全指南](./security.md) → [故障排查](./troubleshooting.md) → **[常见问题](./faq.md)** |

## 子模块常见问题

| 子模块 | 常见问题 | 说明 |
|--------|----------|------|
| base | [常见问题](./base/faq.md) | 基础配置问题 |
| business | [常见问题](./business/faq.md) | 业务配置问题 |


## 一般问题

### Q: 为什么要使用配置中心？

**A:** 配置中心提供统一的配置管理：
- 集中管理环境变量
- 支持配置文件热加载
- 提供类型安全的配置获取
- 支持敏感配置安全存储

### Q: load_env 和 reload_env 有什么区别？

**A:**
- `load_env()`: 首次加载环境变量文件
- `reload_env()`: 重新加载环境变量文件，用于配置文件变更后刷新

### Q: 如何选择缓存类型？

**A:** 根据场景选择：
- Redis: 高性能、需要分布式缓存
- MongoDB: 简单场景、已有 MongoDB

### Q: SETTING 是单例吗？

**A:** 是的，SETTING 是单例模式全局唯一实例，修改后全局生效。

---

## 使用问题

### Q: 环境变量文件在哪里？

**A:** 默认在项目根目录的 `.env` 文件。可以指定路径：

```python
load_env('/path/to/.env')
```

### Q: 如何获取敏感配置？

**A:** 使用 `get_secure_env()` 不会将值记录到日志：

```python
api_key = get_secure_env('API_KEY')
```

### Q: 缓存配置可以动态修改吗？

**A:** 可以，但建议在应用启动时设置：

```python
from FQBase.Config import set_cache_config, CacheConfig

# 修改缓存配置
set_cache_config(CacheConfig(cache_type='redis', ttl=1800))
```

### Q: 如何监听配置变化？

**A:** 使用 ConfigWatcher：

```python
from FQBase.Config import ConfigWatcher

def on_change(key, value):
    print(f"配置 {key} 已变更")

watcher = ConfigWatcher()
watcher.watch('database', callback=on_change)
```

---

## 故障排查

### Q: get_env 返回 None 怎么办？

**A:**
1. 确认已调用 `load_env()`
2. 检查环境变量名称是否正确（大小写敏感）
3. 确认 .env 文件存在且格式正确

### Q: DATABASE 连接失败怎么办？

**A:**
1. 检查 MongoDB 服务是否运行
2. 验证连接字符串是否正确
3. 检查网络连通性

### Q: 路径配置为 None 怎么办？

**A:** 检查 `FQData/setting.json` 是否存在且包含正确的路径配置。

---

## 性能问题

### Q: 环境变量读取有性能问题吗？

**A:** 没有，性能很好。`get_env()` 只是简单的字典查找。

### Q: 懒加载会影响性能吗？

**A:** 不会。懒加载只在首次访问时初始化，后续访问直接使用缓存实例。

---

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
- [故障排查](./troubleshooting.md)
