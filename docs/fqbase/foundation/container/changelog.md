---
title: 服务容器 - 变更日志
description: ServiceContainer 版本历史与更新说明
tag:
  - fqbase
  - container
---

# 服务容器 - 变更日志

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 📖 索引 | [README](./README.md) → **[变更日志](./changelog.md)** |


## v1.0.0 (2024-01-15)

### 新增

- 首次发布 ServiceContainer 服务容器
- 支持三种服务生命周期：SINGLETON、TRANSIENT、SCOPED
- 实现循环依赖检测机制
- 提供 ServiceLocator 全局服务定位器
- 支持工厂函数注册
- 支持实例直接注册

### 核心功能

- `register_singleton()` - 注册单例服务
- `register_transient()` - 注册瞬态服务
- `register_factory()` - 注册工厂函数
- `register_instance()` - 注册已有实例
- `get()` - 获取服务实例
- `try_get()` - 安全获取服务实例
- `is_registered()` - 检查服务是否已注册
- `unregister()` - 注销服务
- `clear()` - 清空所有服务
- `get_dependency_graph()` - 获取依赖关系图

### 架构特性

- 线程安全实现（使用 threading.Lock）
- 依赖注入支持
- 链式调用 API
- 完整类型提示

## 相关文档

- [README](./README.md)
- [API参考](./api.md)
- [使用指南](./usage.md)
