---
title: Base - 变更日志
description: Base 基础配置模块版本历史与更新说明
tag:
  - fqbase
  - config
---

# Base - 变更日志

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 📖 索引 | [README](./README.md) → **[变更日志](./changelog.md)** |

## v1.0.0 (2024-01)

### 新增

- 首次发布
- 环境变量管理（env）
- MongoDB 配置（setting）
- 缓存配置（cache_config）
- 配置监听（config_watcher）

### 新增

- get_env, load_env, reload_env 函数
- SETTING, DATABASE 单例
- CacheConfig 配置类
- ConfigWatcher 监听器

### 更改

- 优化单例模式实现
- 改进配置验证逻辑

### 修复

- 修复环境变量加载问题
- 修复缓存配置验证问题

## 相关文档

- [README](./README.md)
