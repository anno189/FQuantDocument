---
title: Core - 开发指南
description: Core 基础设施核心层开发指南与贡献指南
tag:
  - fqbase
  - core
---

# Core - 开发指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [技术架构](./architecture.md) → [API参考](./api.md) → **[开发指南](./development.md)** → [最佳实践](./best-practices.md) |


## 概述

本文档介绍如何开发和贡献 Core 模块。作为容器模块，Core 本身不包含业务逻辑实现，主要职责是聚合子模块和提供统一的导出接口。

## 开发环境设置

### 前置要求

- Python 3.8+
- Git
- pip
- Celery（用于 event_bus_celery 子模块）

### 设置

```bash
# 克隆仓库
git clone https://github.com/fquant/fquant.git
cd fquant

# 安装依赖
pip install -e .

# 安装开发依赖
pip install -e ".[dev]"
```

## 项目结构

```
FQBase/
└── Core/
    ├── __init__.py          # 模块导出（聚合层）
    ├── event_bus.py         # 子模块 1
    ├── event_bus_celery.py  # 子模块 2
    ├── logger.py            # 子模块 3
    ├── notification.py      # 子模块 4
    └── notification_template.py  # 子模块 5
```

## 代码规范

### 容器模块代码规范

Core 作为容器模块，其 `__init__.py` 的主要职责是：

1. 导入并重新导出子模块的核心 API
2. 不添加额外的业务逻辑
3. 保持导入顺序清晰

### 代码示例

```python
# Core/__init__.py

from .event_bus import (
    Event,
    EventBus,
    get_event_bus,
)

from .logger import (
    get_logger,
    FQLogger,
)

from .notification import (
    NotificationManager,
    sendWechat,
)

__all__ = [
    # EventBus
    'Event',
    'EventBus',
    'get_event_bus',
    # Logger
    'get_logger',
    'FQLogger',
    # Notification
    'NotificationManager',
    'sendWechat',
]
```

## 测试

### 运行测试

```bash
# 运行所有测试
pytest tests/

# 运行 Core 相关测试
pytest tests/core/

# 带覆盖率运行
pytest --cov=FQBase.Core tests/
```

### 测试策略

容器模块的测试主要验证：
1. 导入是否正确
2. 子模块组合使用是否正常
3. 跨模块集成是否工作

## 调试

### 启用调试日志

```python
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("FQBase.Core")
```

### 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| ImportError | 子模块未安装 | 安装 fquant-base |
| EventBus 单例未初始化 | 未调用 get_event_bus() | 使用 get_event_bus() 获取实例 |
| 通知发送失败 | 渠道配置不正确 | 检查渠道配置 |

## 贡献

1. Fork 仓库
2. 创建功能分支
3. 对子模块进行更改
4. 更新 Core 的导出（如有新增）
5. 添加测试
6. 提交 Pull Request

## 相关文档

- [API参考](./api.md)
- [设计原则](./design.md)
- [最佳实践](./best-practices.md)
- [event_bus 子模块](./event_bus/)
- [logger 子模块](./logger/)
- [notification 子模块](./notification/)
