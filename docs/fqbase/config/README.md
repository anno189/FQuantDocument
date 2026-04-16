---
title: Config - 配置中心
description: FQBase 统一配置中心，聚合基础配置和业务配置
tag:
  - fqbase
  - config

summary:
  type: container
  complexity: medium
  maturity: stable
  size: m
  sub_modules:
    - base
    - business
  sub_modules_stats:
    total: 2
    L3_count: 1
    L2_count: 1
    L1_count: 0
  api_exports:
    total: 40
    classes: 10
    functions: 22
    constants: 8
  usage_scenarios:
    - "场景1：获取环境变量配置"
    - "场景2：管理 MongoDB 数据库连接"
    - "场景3：配置缓存策略（Redis/MongoDB）"
    - "场景4：监听配置文件变化"
    - "场景5：获取数据源优先级配置"
  warnings:
    - "警告1：SETTING 是单例，修改后全局生效"
    - "警告2：DATABASE 需要在应用启动时初始化"
    - "警告3：CacheConfig 不支持运行时动态切换缓存类型"
  limitations:
    - "限制1：配置文件不支持热重载（需调用 reload_env）"
    - "限制2：DATABASE_ASYNC 仅支持异步上下文"

relationships:
  belongs_to:
    - fquant.fqbase
  contains:
    - fquant.fqbase.config.base
    - fquant.fqbase.config.business
  used_by:
    - fquant.fqdata
    - fquant.fqalgorithm

api:
  signatures:
    get_env:
      params: "key: str, default: Any = None"
      return: "Any"
    SETTING:
      type: "Singleton"
      description: "MongoDB 连接配置单例"
    DATABASE:
      type: "Database"
      description: "MongoDB 数据库实例"
    CacheConfig:
      type: "Class"
      description: "缓存配置类"
  exceptions:
    - name: ConfigValidationError
      when: "配置值验证失败"
      solution: "检查配置格式和类型"
    - name: ConnectionError
      when: "数据库连接失败"
      solution: "检查 MongoDB 服务状态"
  best_practices:
    - "使用 get_env 获取环境变量，避免直接访问 os.environ"
    - "DATABASE 实例化后不要重复创建"
    - "缓存配置在应用启动时设置好，不要频繁更改"
  examples:
    get_env: |
      # 获取环境变量
      db_url = get_env('MONGODB_URL', 'mongodb://localhost:27017')
      debug_mode = get_env('DEBUG', False)
    SETTING: |
      # 获取 MongoDB 配置
      mongo_uri = SETTING.get_mongo()

usage:
  quick_example: |
    from FQBase.Config import get_env, SETTING, CacheConfig
    
    # 获取环境变量
    debug = get_env('DEBUG', False)
    
    # 获取数据库配置
    db_uri = SETTING.get_mongo()
    
    # 配置缓存
    cache_config = CacheConfig()

maintenance:
  test_coverage: "80%"
  change_frequency: quarterly
  last_updated: "2024-01"
---

# Config - 配置中心

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [子模块文档] → [案例库](./examples.md) |
| 🔵 开发者 | [README](./README.md) → [技术架构](./architecture.md) → [API参考](./api.md) → [子模块文档] |
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) |
| 🟠 架构师 | [README](./README.md) → [技术架构](./architecture.md) → [设计模式](./patterns.md) → [数据流](./data-flow.md) |
| 📚 案例库 | **[案例库](./examples.md)** → [跨模块集成示例] |
| 📖 索引 | [README](./README.md) → [变更日志](./changelog.md) |

## 一句话总览

📌 **FQBase 统一配置中心，聚合基础配置和业务配置**

## ⚠️ AI 开发必读

### 使用场景

✅ **应该使用**：
- 获取环境变量配置
- 管理 MongoDB 数据库连接
- 配置缓存策略
- 监听配置文件变化
- 获取数据源优先级配置

❌ **不应该使用**：
- 复杂业务逻辑

### 注意事项

1. **SETTING 是单例**
   - 说明：修改后全局生效

2. **DATABASE 需要初始化**
   - 说明：在应用启动时初始化

3. **CacheConfig 不支持动态切换**
   - 说明：运行时更改需要重启

### 已知限制

- 配置文件不支持热重载（需调用 reload_env）
- DATABASE_ASYNC 仅支持异步上下文

**TL;DR**：
- 功能：统一配置管理
- 包含：2 个子模块（base + business）
- 定位：应用配置中心

## 子模块概览

本模块是一个**容器模块**，聚合了以下核心子模块：

| 子模块 | 说明 | 文档级别 | 文档链接 |
|--------|------|---------|----------|
| base/ | 基础配置（环境变量、数据库、缓存） | L3 | [README](./base/README.md) |
| business/ | 业务配置（数据源、IP列表） | L2 | [README](./business/README.md) |

## 架构图

```
┌─────────────────────────────────────────────┐
│              Config 配置中心                   │
├─────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐                  │
│  │  base   │  │business │                  │
│  │ 基础配置 │  │ 业务配置 │                  │
│  └────┬────┘  └────┬────┘                  │
│       │            │                        │
│       └────────────┼────────────────────────┤
│                    │                         │
│            ┌───────┴───────┐                │
│            │   聚合层 API   │                │
│            └───────────────┘                │
└─────────────────────────────────────────────┘
```

## 快速开始

### 安装

```bash
pip install fquant-fqbase
```

### 组合使用示例

```python
from FQBase.Config import (
    get_env,
    SETTING,
    CacheConfig,
    get_datasource_priority,
)

# 基础配置
debug = get_env('DEBUG', False)
mongo_uri = SETTING.get_mongo()

# 业务配置
priority = get_datasource_priority('stock')
```

## 快速链接

| 文档 | 说明 |
|------|------|
| [技术架构](./architecture.md) | 子模块架构与关系 |
| [API参考](./api.md) | 跨模块组合 API |
| [案例库](./examples.md) | 跨模块集成示例 |
| [变更日志](./changelog.md) | 各子模块变更汇总 |

## 相关文档

| 类型 | 文档 | 链接 |
|------|------|------|
| 项目首页 | FQBase首页 | [README](../README.md) |
| 基础配置 | Base模块 | [base/README.md](./base/README.md) |
| 业务配置 | Business模块 | [business/README.md](./business/README.md) |

## 快速链接

| 文档 | 说明 |
|------|------|
| [快速入门](./quick-start.md) | 5分钟快速上手 |
| [术语表](./glossary.md) | 术语定义 |
| [核心概念](./concepts.md) | 核心概念详解 |
| [技术架构](./architecture.md) | 技术架构说明 |
| [API参考](./api.md) | API参考文档 |
| [使用指南](./usage.md) | 详细使用指南 |
| [案例库](./examples.md) | 案例库 |
| [集成指南](./integrations.md) | 模块集成指南 |
| [最佳实践](./best-practices.md) | 最佳实践 |
| [故障排查](./troubleshooting.md) | 问题排查 |
| [性能调优](./performance.md) | 性能优化 |
| [常见问题](./faq.md) | 常见问题 |
| [开发指南](./development.md) | 开发指南 |
| [变更日志](./changelog.md) | 版本变更 |
