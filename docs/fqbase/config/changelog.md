---
title: Config - 变更日志
description: Config 版本历史与更新说明
tag:
  - fquant
  - fqbase
  - config

summary:
  purpose: changelog
---

# Config - 变更日志

## 阅读路径

全部角色：README → changelog

## v2.9.0 (2026-04)

### 新增

- EnvManager 类统一管理环境变量
- get_secure_env() 安全获取敏感配置
- ConfigWatcherManager 管理多个配置监听器
- watch_config() 快捷函数

### 更改

- 重构配置加载顺序：环境变量 > .env > config.ini > 默认值
- SETTING 和 GLOBALMAP 保持单例模式

## v2.8.0 (2026-03)

### 新增

- GlobalMap 类统一管理路径配置
- 路径属性：FQDATA_PATH, CACHE_PATH, LOG_PATH 等

### 更改

- 统一使用 GlobalMap 而非分散的路径常量

## v2.7.0 (2026-02)

### 新增

- CacheConfig 缓存配置类
- get_cache_config / set_cache_config 函数

## v2.6.0 (2026-01)

### 新增

- ConfigWatcher 配置监听器
- 支持热更新配置

## v2.5.0 (2025-12)

### 新增

- Setting 类 MongoDB 配置
- get_env / load_env 环境变量函数

---

## 弃用追踪

| 弃用项 | 替代方案 | 迁移指南 | 弃用版本 |
|--------|---------|---------|---------|
| 直接导入路径常量 | 使用 GLOBALMAP | `from FQBase.Config import FQDATA_PATH` → `GLOBALMAP.FQDATA_PATH` | v2.8.0 |

## 相关文档

- [README](./README.md)
