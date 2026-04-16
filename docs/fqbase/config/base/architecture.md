---
title: Base - 技术架构
description: Base 基础配置模块的技术架构与组件设计
tag:
  - fqbase
  - config
---

# Base - 技术架构

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → **[技术架构](./architecture.md)** → [设计原则](./design.md) → [API参考](./api.md) → [开发指南](./development.md) → [最佳实践](./best-practices.md) |
| 🟡 运维/安全 | [README](./README.md) → **[技术架构](./architecture.md)** → [配置指南](./configuration.md) → [安全指南](./security.md) → [故障排查](./troubleshooting.md) → [常见问题](./faq.md) |
| 🟠 架构师 | [README](./README.md) → **[技术架构](./architecture.md)** → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) → [决策指南](./decision-guide.md) → [案例研究](./case-studies.md) → [数据流](./data-flow.md) |

## 概述

Base 模块的架构概览

## 架构图

```
┌─────────────────────────────────────────┐
│           Base 基础配置                   │
├─────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  │
│  │  env    │  │ setting │  │ cache_  │  │
│  │ 环境变量  │  │ MongoDB │  │ config  │  │
│  └─────────┘  └─────────┘  └─────────┘  │
│  ┌───────────────────────────────────┐  │
│  │       config_watcher              │  │
│  │          配置监听                    │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## 组件

### env - 环境变量管理

**用途：** 加载和管理环境变量

**职责：**
- 加载 .env 文件
- 读取环境变量
- 提供默认值支持

### setting - MongoDB配置

**用途：** 管理 MongoDB 连接配置

**职责：**
- 提供 MongoDB 连接字符串
- 管理数据库实例
- 路径配置管理

### cache_config - 缓存配置

**用途：** 缓存配置管理

**职责：**
- 支持多种缓存类型
- 配置验证
- 参数管理

### config_watcher - 配置监听

**用途：** 监听配置文件变化

**职责：**
- 监控文件变化
- 触发回调
- 延迟处理

## 数据流

1. load_env() 加载环境变量
2. get_env() 读取变量值
3. SETTING 获取数据库配置
4. CacheConfig 管理缓存
5. ConfigWatcher 监听变化

## 依赖

| 依赖 | 版本 | 用途 |
|------|------|------|
| pymongo | >=4.0 | MongoDB 连接 |
| redis | >=4.0 | Redis 连接 |

## 相关文档

- [框架集成](./framework.md)
- [设计原则](./design.md)
- [API参考](./api.md)
