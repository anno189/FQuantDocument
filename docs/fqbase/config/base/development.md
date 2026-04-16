---
title: Base - 开发指南
description: Base 基础配置模块开发指南与贡献指南
tag:
  - fqbase
  - config
---

# Base - 开发指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → [设计原则](./design.md) → [API参考](./api.md) → **[开发指南](./development.md)** → [最佳实践](./best-practices.md) |

## 概述

如何开发和贡献 Base 基础配置模块

## 开发环境设置

### 前置要求

- Python 3.8+
- Git
- pip
- MongoDB（开发用）
- Redis（开发用）

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
Config/base/
├── __init__.py          # 模块导出
├── env.py               # 环境变量管理
├── setting.py           # MongoDB配置
├── cache_config.py     # 缓存配置
├── config_watcher.py   # 配置监听
└── tests/              # 测试
```

## 代码规范

- 遵循 PEP 8
- 使用类型提示
- 编写文档字符串

## 测试

```bash
# 运行测试
pytest tests/

# 带覆盖率运行
pytest --cov=FQBase.Config.base tests/
```

## 相关文档

- [API参考](./api.md)
- [设计原则](./design.md)
- [最佳实践](./best-practices.md)
