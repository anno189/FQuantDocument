---
title: Config - 变更日志
description: FQBase 配置中心版本历史与更新说明
tag:
  - fqbase
  - config
---

# Config - 变更日志

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 📖 索引 | [README](./README.md) → **[变更日志](./changelog.md)** |

## 子模块变更日志

| 子模块 | 变更日志 | 说明 |
|--------|----------|------|
| base | [变更日志](./base/changelog.md) | 基础配置变更 |
| business | [变更日志](./business/changelog.md) | 业务配置变更 |


## v1.0.0 (2024-01)

### 新增

- 首次发布 Config 配置中心模块
- 环境变量管理（load_env, get_env, reload_env, get_secure_env）
- MongoDB 配置（SETTING, DATABASE, DATABASE_ASYNC）
- 缓存配置（CacheConfig, get_cache_config, set_cache_config）
- 配置监听（ConfigWatcher, ConfigWatcherManager, watch_config）
- 路径配置（FQDATA_PATH, SETTING_PATH, CACHE_PATH, LOG_PATH 等）

### 更改

- 重构 Config 目录结构，分为 base 和 business 两个子模块

### 子模块

- **base/**: 基础配置（L3 完整文档）
  - env.py: 环境变量管理
  - setting.py: MongoDB 连接配置
  - cache_config.py: 缓存配置
  - config_watcher.py: 配置监听

- **business/**: 业务配置（L2 标准文档）
  - datasource_config.py: 数据源配置
  - ip_list.py: IP 列表管理

## 相关文档

- [README](./README.md)
- [base/CHANGELOG](./base/changelog.md)
- [business/CHANGELOG](./business/changelog.md)
