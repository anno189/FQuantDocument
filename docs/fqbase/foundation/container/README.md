---
title: Container 模块
description: 轻量级依赖注入容器
tag:
  - fqbase
  - container
---

# Container 模块

轻量级依赖注入容器，提供服务注册、解析和生命周期管理。支持单例、瞬态、工厂函数模式，内置循环依赖检测。

```yaml
summary:
  type: framework
  complexity: medium
  maturity: stable
  # ⚠️ AI 开发必需信息
  usage_scenarios:
    - "需要依赖注入解耦代码"
    - "需要统一管理服务实例"
    - "需要单例/瞬态模式"
  warnings:
    - "不能与 singleton 装饰器混用"
    - "循环依赖会检测失败"
  limitations:
    - "不支持属性注入"
    - "不支持装饰器注入"

relationships:
  depends_on: []
  import_path:
    - from FQBase.Foundation.container import ServiceContainer
```

## 快速开始

### 基本使用

```python
from FQBase.Foundation import ServiceContainer

container = ServiceContainer()
container.register_singleton(ICache, RedisCache)
container.register_transient(ILogger, FileLogger)

cache = container.get(ICache)
```

### 服务定位器

```python
from FQBase.Foundation import ServiceLocator

ServiceLocator.set_container(container)
cache = ServiceLocator.get(ICache)
```

## 核心功能

| 功能 | 说明 |
|------|------|
| 单例注册 | `register_singleton()` 全局共享实例 |
| 瞬态注册 | `register_transient()` 每次创建新实例 |
| 工厂注册 | `register_factory()` 自定义创建逻辑 |
| 实例注册 | `register_instance()` 注册已有实例 |
| 循环依赖检测 | 自动检测并抛出异常 |
| 线程安全 | 所有操作线程安全 |

## 文档索引

| 文档 | 说明 |
|------|------|
| [README](README.html) | 本文档，模块索引 |
| [框架](framework.html) | 模块架构与核心概念 |
| [架构](architecture.html) | 设计与工作流程 |
| [API](api.html) | 完整API参考 |
| [使用](usage.html) | 使用指南与示例 |
| [开发指南](development.html) | 开发环境、调试、测试 |
| [最佳实践](best-practices.html) | 开发建议与注意事项 |
| [设计](design.html) | 设计决策文档 |
| [FAQ](faq.html) | 常见问题解答 |
