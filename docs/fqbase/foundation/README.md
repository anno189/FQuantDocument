---
title: Foundation 基础模块
description: FQBase 基础抽象层，提供设计模式、工具类和接口定义
tag:
  - fqbase
  - foundation

summary:
  type: foundation
  complexity: medium
  maturity: stable
  size: m
  # ⚠️ AI 开发必需信息
  usage_scenarios:
    - "需要单例模式时使用 singleton"
    - "需要输入验证时使用 validators"
    - "需要重试机制时使用 retry"
    - "需要依赖注入时使用 container"
    - "需要熔断保护时使用 circuit_breaker"
  warnings:
    - "循环依赖问题需注意"
    - "container 和 singleton 不能混用"
  limitations:
    - "不支持循环依赖"
    - "lifecycle 仅支持同步初始化"

relationships:
  belongs_to:
    - fquant.fqbase
  used_by:
    - fquant.fqdata
    - fquant.fqmarket
    - fquant.fqalgorithm
  depends_on: []
  import_path:
    - from FQBase.Foundation import validators, exceptions, retry
---

# Foundation 基础模块

## 一句话总览

📌 **FQBase 基础抽象层，提供设计模式、工具类和接口定义**

**TL;DR**：
- 核心能力：单例模式、依赖注入、熔断器、重试机制、验证器等
- 入门难度：🟢 简单

## 概述

Foundation 是 FQBase 的基础抽象层，提供通用设计模式、工具类和接口定义，不包含业务逻辑。

## 模块结构

```
FQBase/Foundation/
├── validators.py             # 输入验证器
├── exceptions.py             # 统一异常定义
├── retry.py                 # 重试装饰器
├── dotty.py                 # 嵌套字典点号访问
├── singleton.py             # 单例模式
├── lifecycle.py             # 生命周期管理
├── container.py             # 依赖注入容器
└── circuit_breaker.py       # 熔断器
```

## 核心功能

| 子模块 | 功能 |
|--------|------|
| [validators](validators/) | 输入验证：股票代码、日期、市场、频率等 |
| [exceptions](exceptions/) | 统一异常体系：DataSource、Strategy、Config等 |
| [retry](retry/) | 重试装饰器：固定延迟、指数退避、异步支持 |
| [dotty](dotty/) | 嵌套字典点号访问：简化深层字典操作 |
| [singleton](singleton/) | 单例模式：线程安全、支持重置 |
| [lifecycle](lifecycle/) | 生命周期：健康检查、初始化、关闭 |
| [container](container/) | 依赖注入：容器、服务定位器 |
| [circuit_breaker](circuit_breaker/) | 熔断器：故障隔离、状态机 |

## 快速开始

```python
from FQBase.Foundation import validators, exceptions

# 验证输入
result = validators.validate_code("600000")
print(result)  # True

# 处理异常
try:
    pass
except exceptions.FQException as e:
    print(e.code)
```

## 文档索引

| 文档 | 说明 |
|------|------|
| [快速入门](./quick-start.md) | 5分钟快速上手 |
| [核心概念](./concepts.md) | 核心概念详解 |
| [术语表](./glossary.md) | 术语定义 |
| [API参考](./api.md) | 完整 API |
| [使用指南](./usage.md) | 详细使用说明 |
| [设计原则](./design.md) | 设计理念 |
| [开发指南](./development.md) | 扩展开发 |
| [技术架构](./architecture.md) | 架构设计 |
| [框架集成](./framework.md) | 框架集成 |
| [最佳实践](./best-practices.md) | 最佳实践 |
| [案例库](./examples.md) | 应用场景 |
| [常见问题](./faq.md) | FAQ |
| [变更日志](./changelog.md) | 版本历史 |

## 子模块文档

| 子模块 | README | 说明 |
|--------|--------|------|
| [validators](validators/) | [README](validators/README.md) | 输入验证 |
| [exceptions](exceptions/) | [README](exceptions/README.md) | 统一异常 |
| [retry](retry/) | [README](retry/README.md) | 重试装饰器 |
| [dotty](dotty/) | [README](dotty/README.md) | 字典访问 |
| [singleton](singleton/) | [README](singleton/README.md) | 单例模式 |
| [lifecycle](lifecycle/) | [README](lifecycle/README.md) | 生命周期 |
| [container](container/) | [README](container/README.md) | 依赖注入 |
| [circuit_breaker](circuit_breaker/) | [README](circuit_breaker/README.md) | 熔断器 |
