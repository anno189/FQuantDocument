# Singleton 模块

单例模式实现 - 线程安全版本。

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
