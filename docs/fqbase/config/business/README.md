---
title: Business - 业务配置
description: FQBase 业务配置模块，提供数据源配置、IP列表管理等业务配置功能
tag:
  - fqbase
  - config

summary:
  type: infrastructure
  complexity: low
  maturity: stable
  size: s
  core_classes:
    - DataSourceConfig
    - TDXIPListManager
  key_functions:
    - get_datasource_priority
    - get_health_check_config
  features:
    has_async: false
    has_config: true
    has_security: false
    has_logging: false
    is_thread_safe: true
  usage_scenarios:
    - "获取数据源优先级配置"
    - "管理通达信服务器IP列表"
    - "配置健康检查参数"
  warnings:
    - "IP列表默认从配置文件加载，文件不存在时使用内置默认值"
  limitations:
    - "不支持热重载，需要手动调用reload函数"

relationships:
  belongs_to:
    - fquant.fqbase.config
  depends_on:
    - fquant.fqbase.core
  used_by:
    - fquant.fqdata
  import_path:
    - from FQBase.Config.business import DataSourceConfig

api:
  signatures:
    DataSourceConfig:
      __init__: "(self) -> None"
      get: "(self, key: str, default: Any = None) -> Any"
      get_priority: "(self, asset_type: str) -> List[str]"
  exceptions: []
  best_practices:
    - "使用单例模式获取配置实例"
    - "修改IP列表后调用reload_ip_list刷新"
    - "数据源配置从datasource.yaml文件加载"

usage:
  quick_example: |
    from FQBase.Config.business import get_datasource_priority
    
    # 获取股票数据源优先级
    priority = get_datasource_priority('stock')
    print(priority)
---

# Business - 业务配置

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [速查表](./cheatsheet.md) → [使用指南](./usage.md) → [案例库](./examples.md) |
| 🔵 开发者 | [README](./README.md) → [技术架构](./architecture.md) → [API参考](./api.md) → [使用指南](./usage.md) → [最佳实践](./best-practices.md) |
| 🟡 运维 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → [故障排查](./troubleshooting.md) → [常见问题](./faq.md) |

## 一句话总览

📌 **业务配置模块，管理数据源配置和通达信IP列表**

**TL;DR**：
- 解决什么问题：集中管理业务相关配置
- 核心能力：数据源优先级、IP列表管理、健康检查配置
- 入门难度：🟢 简单

**快速判断**：当您需要配置数据源优先级、管理通达信服务器IP时，使用本模块。

## 知识脉络

🧑‍🎓 **从零到精通的推荐学习顺序**：

1. [快速入门](./quick-start.md) - 5 分钟上手
2. [核心概念](./concepts.md) - 理解基本概念
3. [使用指南](./usage.md) - 深入使用
4. [最佳实践](./best-practices.md) - 升华理解

⏱️ 预计学习时间：0.5 小时

## 前置知识

在开始学习本模块前，建议先掌握：

| 知识领域 | 建议资源 |
|---------|---------|
| Python 基础 | [官方教程](https://docs.python.org/zh-cn/3/tutorial/) |
| 配置管理概念 | - |

## 适用场景

✅ **推荐使用**：
- 获取数据源优先级配置
- 管理通达信行情服务器IP列表
- 配置健康检查参数

❌ **不推荐使用**：
- 核心配置（使用 Config/base）
- 复杂业务逻辑

💡 **与其他模块的关系**：
- 依赖 [Base 配置](../base/)（环境变量、数据库配置）
- 被 [FQData](../fqdata/) 等模块使用

## 概述

Business 是 FQBase 的业务配置模块，提供：
- **数据源配置**：管理多数据源优先级、健康检查设置
- **IP列表管理**：通达信服务器IP的加载和刷新

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
| 核心配置 | Base模块 | [../base/README.md](../base/README.md) |
