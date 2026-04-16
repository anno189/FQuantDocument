---
title: Business - 变更日志
description: Business 业务配置模块版本历史与更新说明
tag:
  - fqbase
  - config
---

# Business - 变更日志

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 📖 索引 | [README](./README.md) → **[变更日志](./changelog.md)** |

## v1.0.0 (2024-01)

### 新增

- 首次发布
- DataSourceConfig 类：数据源配置管理
- TDXIPListManager 类：通达信IP列表管理
- get_datasource_priority 函数：获取数据源优先级
- get_health_check_config 函数：获取健康检查配置

### 更改

- IP列表采用延迟加载机制

### 修复

- 修复配置文件不存在时的错误处理

## 相关文档

- [README](./README.md)
