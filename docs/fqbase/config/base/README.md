---
title: Base - 基础配置
description: FQBase 基础配置模块，提供环境变量管理、MongoDB配置、缓存配置和配置监听功能
tag:
  - fqbase
  - config

summary:
  type: infrastructure
  complexity: high
  maturity: stable
  size: m
  core_classes:
    - Setting
    - CacheConfig
    - ConfigWatcher
  key_functions:
    - get_env
    - load_env
    - get_cache_config
    - watch_config
  api_coverage:
    total: 25
    covered: 25
    public: 20
    private: 5
  features:
    has_async: true
    has_config: true
    has_security: true
    has_logging: false
    is_thread_safe: true
  usage_scenarios:
    - "获取环境变量配置"
    - "管理 MongoDB 数据库连接"
    - "配置缓存策略（Redis/MongoDB）"
    - "监听配置文件变化"
  warnings:
    - "SETTING 是单例，修改后全局生效"
    - "DATABASE 需要在应用启动时初始化"
    - "CacheConfig 不支持运行时动态切换缓存类型"
  limitations:
    - "配置文件不支持热重载（需调用 reload_env）"
    - "DATABASE_ASYNC 仅支持异步上下文"
  design_patterns:
    - singleton
    - observer
    - lazy_loading

relationships:
  belongs_to:
    - fquant.fqbase.config
  depends_on:
    - pymongo
    - redis
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
    from FQBase.Config.base import get_env, SETTING, CacheConfig
    
    # 获取环境变量
    debug = get_env('DEBUG', False)
    
    # 获取数据库配置
    db_uri = SETTING.get_mongo()
    
    # 配置缓存
    cache_config = CacheConfig()

security:
  encryption:
    - type: AES-256
      data_at_rest: false
      data_in_transit: true
  authentication:
    - API_KEY
  data_classification: internal

maintenance:
  test_coverage: "80%"
  change_frequency: quarterly
  last_updated: "2024-01"
---

# Base - 基础配置

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [速查表](./cheatsheet.md) → [动手实验室](./workshop.md) → [使用指南](./usage.md) → [案例库](./examples.md) |
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → [设计原则](./design.md) → [API参考](./api.md) → [开发指南](./development.md) → [最佳实践](./best-practices.md) |
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → [安全指南](./security.md) → [故障排查](./troubleshooting.md) → [常见问题](./faq.md) |
| 🟠 架构师 | [README](./README.md) → [技术架构](./architecture.md) → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) → [决策指南](./decision-guide.md) → [案例研究](./case-studies.md) → [数据流](./data-flow.md) |

## 一句话总览

📌 **FQBase 基础配置模块，提供环境变量、数据库、缓存和配置监听**

## ⚠️ AI 开发必读

### 使用场景

✅ **应该使用**：
- 获取环境变量配置
- 管理 MongoDB 数据库连接
- 配置缓存策略
- 监听配置文件变化

❌ **不应该使用**：
- 业务配置（使用 Config/business）
- 复杂业务逻辑

### 注意事项

1. **SETTING 是单例**
   - 说明：修改后全局生效

2. **DATABASE 需要初始化**
   - 说明：在应用启动时初始化

3. **CacheConfig 不支持动态切换**
   - 说明：运行时更改缓存类型需要重启

### 已知限制

- 配置文件不支持热重载（需调用 reload_env）
- DATABASE_ASYNC 仅支持异步上下文

**TL;DR**：
- 解决什么问题：集中管理基础配置
- 核心能力：环境变量、数据库配置、缓存配置、配置监听
- 入门难度：🔵 中等

## 前置知识

在开始学习本模块前，建议先掌握：

| 知识领域 | 建议资源 |
|---------|---------|
| Python 基础 | [官方教程](https://docs.python.org/zh-cn/3/tutorial/) |
| MongoDB 基础 | [MongoDB 文档](https://docs.mongodb.com/) |
| Redis 基础 | [Redis 文档](https://redis.io/documentation) |

## 适用场景

✅ **推荐使用**：
- 获取环境变量配置
- 管理 MongoDB 数据库连接
- 配置缓存策略（Redis/MongoDB）
- 监听配置文件变化

❌ **不推荐使用**：
- 业务配置（使用 Config/business）
- 复杂业务逻辑

## 子模块

| 子模块 | 说明 | 文档 |
|--------|------|------|
| env/ | 环境变量管理 | [README](./env/README.md) |
| setting/ | MongoDB配置和路径配置 | [README](./setting/README.md) |
| cache_config/ | 缓存配置 | [README](./cache_config/README.md) |
| config_watcher/ | 配置监听 | [README](./config_watcher/README.md) |

## 快速链接

| 文档 | 说明 |
|------|------|
| [快速入门](./quick-start.md) | 5分钟快速上手 |
| [API参考](./api.md) | API参考文档 |
| [使用指南](./usage.md) | 详细使用说明 |
| [最佳实践](./best-practices.md) | 最佳实践指南 |

## 安装

```bash
pip install fquant-fqbase
```

## 相关文档

| 类型 | 文档 | 链接 |
|------|------|------|
| 项目首页 | FQBase首页 | [README](../README.md) |
| 业务配置 | Business模块 | [../business/README.md](../business/README.md) |
