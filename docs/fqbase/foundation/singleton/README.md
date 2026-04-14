---
title: Singleton 模块
description: 单例模式实现 - 线程安全版本
tag:
  - fqbase
  - singleton
---

# Singleton 模块

单例模式实现 - 线程安全版本。

```yaml
summary:
  type: design_pattern
  complexity: low
  maturity: stable
  # ⚠️ AI 开发必需信息
  usage_scenarios:
    - "需要全局唯一实例时（如配置、连接池）"
    - "需要线程安全的单例"
    - "需要测试时能重置实例"
  warnings:
    - "单例会降低代码可测试性"
    - "多线程环境下需注意初始化顺序"
  limitations:
    - "不支持多进程"
    - "不能继承多个单例类"

relationships:
  depends_on: []
  import_path:
    - from FQBase.Foundation.singleton import singleton
```

## 概述

`singleton` 模块提供线程安全的单例模式实现，使用元类（Metaclass）确保类只有一个实例。支持测试隔离的重置功能。

## 快速开始

```python
from FQBase.Foundation.singleton import singleton

@singleton
class DatabaseConnection:
    def __init__(self):
        self.host = "localhost"

# 获取单例实例
db1 = DatabaseConnection()
db2 = DatabaseConnection()
assert db1 is db2  # True
```

## 核心组件

| 组件 | 说明 |
|------|------|
| `SingletonMeta` | 单例元类，线程安全的实例创建 |
| `singleton` | 单例装饰器 |
| `reset_singleton()` | 重置单例实例 |
| `get_instance()` | 获取当前实例（不创建） |
| `has_instance()` | 检查实例是否存在 |

## 特性

- **线程安全**: 使用双检查锁定（Double-Checked Locking）模式
- **可重置**: 支持测试隔离，清除单例实例
- **元信息保留**: 保留原始类名、模块和文档字符串

## 使用场景

- 全局配置管理器
- 数据库连接池
- 日志记录器
- 缓存管理器

## 文档索引

- [API 参考](api.md) - 完整接口文档
- [使用指南](usage.md) - 详细使用示例
- [开发指南](development.md) - 开发环境、调试、测试
- [最佳实践](best-practices.md) - 设计模式和注意事项
- [架构设计](architecture.md) - 内部实现和流程
- [设计决策](design.md) - 设计选择和权衡
- [FAQ](faq.md) - 常见问题解答
